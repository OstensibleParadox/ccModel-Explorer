import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import EigenInspector from './EigenInspector';
import EigenTooltip from './EigenTooltip';
import {
  buildProjectionBasis,
  clampUserDisplayCoords,
  computeScaleFactors,
  entityMidpointVector,
  projectPoint,
  projectAllEntities,
  findOverlaps,
  DIMENSIONS,
  normalizeCoords,
  sliderValuesToArray,
  NORM_HALF_RANGE,
  OVERLAP_THRESHOLD,
} from '../utils/eigenProjection.js';

const COLORS = {
  commonLaw: 0x4a90d9,
  civilLaw: 0x50b860,
  ai: 0xe8a838,
  user: 0xff3333,
};

const SPHERE_RADIUS = 2;
const USER_SPHERE_RADIUS = 2.5;
const AXIS_LENGTH = 120;

function isRelevantCategory(category, mode) {
  if (mode === 'ai') {
    return category === 'ai';
  }

  return category === 'commonLaw' || category === 'civilLaw';
}

function disposeOverlapLines(lines, scene) {
  for (const { line, geometry, material } of lines) {
    if (scene) {
      scene.remove(line);
    }
    geometry.dispose();
    material.dispose();
  }
}

function createAxisLabel(text, position) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(248, 243, 231, 0.7)';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.set(16, 4, 1);
  return { sprite, texture, material };
}

export default function EigenVisualization({
  sliderValues,
  allEntities,
  mode,
  locale,
  ui,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const animFrameRef = useRef(null);
  const clockRef = useRef(null);
  const userMeshRef = useRef(null);
  const userCoordsRef = useRef([0, 0, 0]);
  const entityMeshMapRef = useRef(new Map());
  const entityVisualMapRef = useRef(new Map());
  const highlightSetRef = useRef(new Set());
  const overlapLinesRef = useRef([]);
  const hoveredEntityRef = useRef(null);
  const syncHoveredEntityRef = useRef(() => {});
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [showCategoryTags, setShowCategoryTags] = useState(false);
  const showCategoryTagsRef = useRef(false);
  const tagsOverlayRef = useRef(null);

  // --- PCA basis (static, computed once) ---
  const basis = useMemo(
    () => buildProjectionBasis(allEntities),
    [allEntities]
  );

  const projected = useMemo(
    () => projectAllEntities(allEntities, basis),
    [allEntities, basis]
  );

  const scaleFactors = useMemo(
    () => computeScaleFactors(projected),
    [projected]
  );

  const totalVariance = useMemo(
    () => basis.pcs.reduce((s, pc) => s + pc.explainedVarianceRatio, 0),
    [basis]
  );

  // --- User point projection (updates on every slider change) ---
  const userCoords = useMemo(
    () => projectPoint(sliderValuesToArray(sliderValues), basis),
    [sliderValues, basis]
  );

  const userNormalized = useMemo(
    () => normalizeCoords(userCoords, scaleFactors),
    [userCoords, scaleFactors]
  );

  // --- Overlap detection (derived directly, no extra state) ---
  const overlaps = useMemo(
    () => findOverlaps(userCoords, projected, OVERLAP_THRESHOLD),
    [userCoords, projected]
  );

  useEffect(() => {
    userCoordsRef.current = userCoords;
  }, [userCoords]);

  useEffect(() => {
    hoveredEntityRef.current = hoveredEntity;
  }, [hoveredEntity]);

  // --- Scene setup (one-time, refs only in animation loop) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x162234);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 2000);
    camera.position.set(70, 50, 70);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controlsRef.current = controls;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(1, 1, 1);
    scene.add(ambient, directional);

    const clock = new THREE.Clock();
    clockRef.current = clock;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function handleResize() {
      const { clientWidth: w, clientHeight: h } = container;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      syncHoveredEntityRef.current();
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    function syncHoveredEntity(mesh, anchorPoint = mesh.position) {
      const {
        entity,
        category,
        projectedCoords,
      } = mesh.userData;

      if (!entity || !projectedCoords) {
        return;
      }

      const projectedPoint = anchorPoint.clone().project(camera);
      const screenX = ((projectedPoint.x + 1) / 2) * container.clientWidth;
      const screenY = ((-projectedPoint.y + 1) / 2) * container.clientHeight;
      const distance = Math.sqrt(
        userCoordsRef.current.reduce(
          (sum, value, index) =>
            sum + (value - projectedCoords[index]) ** 2,
          0
        )
      );

      setHoveredEntity((previous) => {
        const roundedX = Math.round(screenX);
        const roundedY = Math.round(screenY);
        const roundedDistance = Number(distance.toFixed(1));

        if (
          previous &&
          previous.id === entity.id &&
          Math.round(previous.screenX) === roundedX &&
          Math.round(previous.screenY) === roundedY &&
          previous.distance === roundedDistance
        ) {
          hoveredEntityRef.current = previous;
          return previous;
        }

        const nextHoveredEntity = {
          id: entity.id,
          entity,
          category,
          screenX,
          screenY,
          distance: roundedDistance,
        };

        hoveredEntityRef.current = nextHoveredEntity;
        return nextHoveredEntity;
      });
    }

    function syncHoveredFromCurrentMesh() {
      const hoveredId = hoveredEntityRef.current?.id;

      if (!hoveredId) {
        return;
      }

      const mesh = entityMeshMapRef.current.get(hoveredId);

      if (!mesh) {
        hoveredEntityRef.current = null;
        setHoveredEntity((previous) => (previous == null ? previous : null));
        return;
      }

      syncHoveredEntity(mesh);
    }

    syncHoveredEntityRef.current = syncHoveredFromCurrentMesh;
    handleResize();

    function clearHover() {
      hoveredEntityRef.current = null;
      setHoveredEntity((previous) => (previous == null ? previous : null));
    }

    function handleMouseMove(event) {
      const rect = canvas.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        clearHover();
        return;
      }

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersections = raycaster.intersectObjects(
        [...entityMeshMapRef.current.values()],
        false
      );

      if (intersections.length === 0) {
        clearHover();
        return;
      }

      const intersection = intersections[0];
      const mesh = intersection.object;
      if (!mesh.userData.entity || !mesh.userData.projectedCoords) {
        clearHover();
        return;
      }

      syncHoveredEntity(mesh, intersection.point);
    }

    function animate() {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();

      const elapsed = clock.getElapsedTime();
      const pulse = 1 + 0.15 * Math.sin(elapsed * 3);
      for (const id of highlightSetRef.current) {
        const mesh = entityMeshMapRef.current.get(id);
        if (mesh) mesh.scale.setScalar(pulse);
      }
      if (userMeshRef.current && highlightSetRef.current.size > 0) {
        userMeshRef.current.scale.setScalar(pulse);
      }

      if (showCategoryTagsRef.current) {
        const overlay = tagsOverlayRef.current;
        if (overlay) {
          for (const [entityId, visuals] of entityVisualMapRef.current) {
            const mesh = visuals[0];
            if (!mesh) continue;
            const vector = mesh.position.clone().project(camera);
            if (vector.z > 1) continue; // behind camera
            const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
            const y = -(vector.y * 0.5 - 0.5) * container.clientHeight;
            const tagEl = overlay.querySelector(`[data-entity-id="${entityId}"]`);
            if (tagEl) {
              tagEl.style.left = `${x}px`;
              tagEl.style.top = `${y}px`;
            }
          }
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    controls.addEventListener('change', syncHoveredFromCurrentMesh);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', clearHover);

    return () => {
      syncHoveredEntityRef.current = () => {};
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', clearHover);
      controls.removeEventListener('change', syncHoveredFromCurrentMesh);
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      disposeOverlapLines(overlapLinesRef.current, scene);
      overlapLinesRef.current = [];
      renderer.dispose();
      renderer.forceContextLoss();
      cameraRef.current = null;
      sceneRef.current = null;
      hoveredEntityRef.current = null;
      setHoveredEntity(null);
    };
  }, []);

  // --- Create entity spheres + axes + user sphere ---
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || projected.length === 0) return;
    const entityMeshMap = entityMeshMapRef.current;
    const entityVisualMap = entityVisualMapRef.current;

    const addedObjects = [];
    const localDisposables = [];

    function trackAdd(obj) {
      scene.add(obj);
      addedObjects.push(obj);
    }

    const sphereGeo = new THREE.SphereGeometry(SPHERE_RADIUS, 16, 16);
    localDisposables.push(sphereGeo);

    for (const { entity, coords } of projected) {
      const color = COLORS[entity._category] ?? 0xaaaaaa;
      const material = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0.8,
      });
      localDisposables.push(material);

      const mesh = new THREE.Mesh(sphereGeo, material);
      const norm = normalizeCoords(coords, scaleFactors);
      mesh.position.set(norm[0], norm[1], norm[2]);
      mesh.userData = {
        entityId: entity.id,
        category: entity._category,
        entity,
        projectedCoords: coords,
        baseOpacity: 0.8,
      };
      trackAdd(mesh);
      entityMeshMap.set(entity.id, mesh);
      const visuals = [mesh];

      if (entity.special) {
        const sourceGeo = new THREE.SphereGeometry(SPHERE_RADIUS * 1.5, 12, 12);
        const edgesGeo = new THREE.EdgesGeometry(sourceGeo);
        const edgesMat = new THREE.LineBasicMaterial({
          color: COLORS.ai,
          transparent: true,
          opacity: 0.4,
        });
        const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
        wireframe.position.copy(mesh.position);
        wireframe.userData = {
          entityId: entity.id,
          category: entity._category,
          baseOpacity: 0.4,
        };
        trackAdd(wireframe);
        visuals.push(wireframe);
        localDisposables.push(sourceGeo, edgesGeo, edgesMat);
      }

      entityVisualMap.set(entity.id, visuals);
    }

    // Axis lines using CylinderGeometry
    const axisColors = [0x994444, 0x449944, 0x444499];
    const axisRotations = [
      new THREE.Euler(0, 0, Math.PI / 2),
      new THREE.Euler(0, 0, 0),
      new THREE.Euler(Math.PI / 2, 0, 0),
    ];
    const pctLabels = basis.pcs.map(
      (pc) => `PC${pc.component} (${(pc.explainedVarianceRatio * 100).toFixed(0)}%)`
    );
    const labelPositions = [
      new THREE.Vector3(NORM_HALF_RANGE + 10, 0, 0),
      new THREE.Vector3(0, NORM_HALF_RANGE + 10, 0),
      new THREE.Vector3(0, 0, NORM_HALF_RANGE + 10),
    ];

    for (let i = 0; i < 3; i++) {
      const cylGeo = new THREE.CylinderGeometry(0.15, 0.15, AXIS_LENGTH, 6);
      const cylMat = new THREE.MeshBasicMaterial({
        color: axisColors[i],
        transparent: true,
        opacity: 0.35,
      });
      const cylinder = new THREE.Mesh(cylGeo, cylMat);
      cylinder.rotation.copy(axisRotations[i]);
      trackAdd(cylinder);
      localDisposables.push(cylGeo, cylMat);

      const { sprite, texture, material } = createAxisLabel(
        pctLabels[i],
        labelPositions[i]
      );
      trackAdd(sprite);
      localDisposables.push(texture, material);
    }

    // User sphere
    const userGeo = new THREE.SphereGeometry(USER_SPHERE_RADIUS, 16, 16);
    const userMat = new THREE.MeshStandardMaterial({
      color: COLORS.user,
      transparent: true,
    });
    const userMesh = new THREE.Mesh(userGeo, userMat);
    trackAdd(userMesh);
    userMeshRef.current = userMesh;
    localDisposables.push(userGeo, userMat);

    return () => {
      for (const obj of addedObjects) {
        scene.remove(obj);
      }
      for (const d of localDisposables) {
        if (d.dispose) d.dispose();
      }
      disposeOverlapLines(overlapLinesRef.current, scene);
      overlapLinesRef.current = [];
      entityMeshMap.clear();
      entityVisualMap.clear();
      userMeshRef.current = null;
      setHoveredEntity(null);
    };
  }, [projected, scaleFactors, basis]);

  // --- Mode-specific entity dimming ---
  useEffect(() => {
    for (const [, visuals] of entityVisualMapRef.current) {
      for (const visual of visuals) {
        const baseOpacity = visual.userData.baseOpacity ?? 1;
        const opacity = isRelevantCategory(visual.userData.category, mode)
          ? baseOpacity
          : baseOpacity * 0.2;

        visual.material.setValues({ opacity });
      }
    }
  }, [mode, projected]);

  // --- Update user sphere position ---
  useEffect(() => {
    if (!userMeshRef.current) return;

    const displayCoords = clampUserDisplayCoords(userNormalized);
    userMeshRef.current.position.set(
      displayCoords[0],
      displayCoords[1],
      displayCoords[2]
    );
    const wasClamped = displayCoords.some(
      (value, index) => value !== userNormalized[index]
    );
    userMeshRef.current.material.opacity = wasClamped ? 0.6 : 1;
  }, [userNormalized]);

  // --- Recompute tooltip position/distance when the user point changes ---
  useEffect(() => {
    syncHoveredEntityRef.current();
  }, [userCoords]);

  // --- Highlight overlapping entities ---
  useEffect(() => {
    for (const id of highlightSetRef.current) {
      const mesh = entityMeshMapRef.current.get(id);
      if (mesh) {
        mesh.material.emissive?.setHex(0x000000);
        mesh.scale.setScalar(1);
      }
    }
    highlightSetRef.current.clear();

    if (userMeshRef.current) {
      userMeshRef.current.material.emissive?.setHex(
        overlaps.length > 0 ? 0x333333 : 0x000000
      );
      if (overlaps.length === 0) userMeshRef.current.scale.setScalar(1);
    }

    for (const { entity } of overlaps) {
      const mesh = entityMeshMapRef.current.get(entity.id);
      if (mesh) {
        mesh.material.emissive?.setHex(0x333333);
        highlightSetRef.current.add(entity.id);
      }
    }
  }, [overlaps]);

  // --- Draw lines between the user point and overlapping entities ---
  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) {
      return undefined;
    }

    disposeOverlapLines(overlapLinesRef.current, scene);
    overlapLinesRef.current = [];

    if (!userMeshRef.current || overlaps.length === 0) {
      return undefined;
    }

    const userPosition = userMeshRef.current.position;

    for (const { entity } of overlaps) {
      const targetMesh = entityMeshMapRef.current.get(entity.id);

      if (!targetMesh) {
        continue;
      }

      const geometry = new THREE.BufferGeometry().setFromPoints([
        userPosition.clone(),
        targetMesh.position.clone(),
      ]);
      const material = new THREE.LineDashedMaterial({
        color: COLORS.user,
        dashSize: 2,
        gapSize: 1,
        transparent: true,
        opacity: 0.6,
      });
      const line = new THREE.Line(geometry, material);
      line.computeLineDistances();
      scene.add(line);
      overlapLinesRef.current.push({ line, geometry, material });
    }

    return () => {
      disposeOverlapLines(overlapLinesRef.current, scene);
      overlapLinesRef.current = [];
    };
  }, [overlaps]);

  const resolveEntityName = useCallback(
    (entity) => {
      if (entity.names) {
        return entity.names[locale] ?? entity.names.en ?? entity.names.de ?? entity.id;
      }
      return entity.name ?? entity.id;
    },
    [locale]
  );

  const legendLabels = useMemo(
    () => ui?.eigenspacePanel?.legend ?? {
      commonLaw: 'Common Law',
      civilLaw: 'Civil Law',
      ai: 'AI Framework',
      user: 'Your Config',
    },
    [ui]
  );

  const categoryLabel = useCallback(
    (cat) => legendLabels[cat] ?? cat,
    [legendLabels]
  );

  const tooltipCopy = useMemo(
    () => ui?.eigenspacePanel?.tooltip ?? {},
    [ui]
  );

  const tooltipDimensionLabels = useMemo(
    () => tooltipCopy.dimensions ?? {
      possession: 'Possession',
      use: 'Use',
      income: 'Income',
      alienation: 'Alienation',
      exclusion: 'Exclusion',
      duration: 'Duration',
      inheritability: 'Inheritability',
    },
    [tooltipCopy]
  );

  const hoveredFeatures = useMemo(() => {
    if (!hoveredEntity?.entity) {
      return [];
    }

    const midpointVector = entityMidpointVector(hoveredEntity.entity);

    return DIMENSIONS.map((key, index) => ({
      key,
      label: tooltipDimensionLabels[key] ?? key,
      value: midpointVector[index],
    }));
  }, [hoveredEntity, tooltipDimensionLabels]);

  return (
    <section className="panel-eigenspace">
      <div className="eigen-header">
        <span className="panel-kicker">
          {ui?.eigenspacePanel?.title ?? 'Eigenspace Projection'}
        </span>
        <span className="eigen-variance">
          {ui?.eigenspacePanel?.varianceExplained ?? 'Variance explained'}:{' '}
          {(totalVariance * 100).toFixed(1)}%
        </span>
      </div>

      <div className="eigen-canvas-container" ref={containerRef}>
        <canvas ref={canvasRef} className="eigen-canvas" />
        {showCategoryTags && (
          <div className="eigen-tags-overlay" ref={tagsOverlayRef}>
            {Array.from(entityVisualMapRef.current.entries()).map(([entityId, visuals]) => {
              const mesh = visuals[0];
              if (!mesh) return null;
              const category = mesh.userData.category;

              return (
                <span
                  key={entityId}
                  data-entity-id={entityId}
                  className="eigen-tag"
                  style={{
                    color: `#${COLORS[category].toString(16).padStart(6, '0')}`,
                  }}
                >
                  {legendLabels[category]}
                </span>
              );
            })}
          </div>
        )}

        <div className="eigen-legend">
          {['commonLaw', 'civilLaw', 'ai', 'user'].map((key) => (
            <span key={key} className="eigen-legend-item">
              <span
                className="eigen-legend-dot"
                style={{ background: `#${COLORS[key].toString(16).padStart(6, '0')}` }}
              />
              {legendLabels[key]}
            </span>
          ))}
          <button
            className="eigen-tag-toggle"
            onClick={() => {
              const next = !showCategoryTags;
              showCategoryTagsRef.current = next;
              setShowCategoryTags(next);
            }}
            title="Toggle category labels on entities"
          >
            [{showCategoryTags ? '✕' : '+'}] tags
          </button>
        </div>

        <EigenTooltip
          visible={hoveredEntity != null}
          x={hoveredEntity?.screenX ?? 0}
          y={hoveredEntity?.screenY ?? 0}
          name={
            hoveredEntity?.entity
              ? resolveEntityName(hoveredEntity.entity)
              : ''
          }
          category={hoveredEntity?.category ?? ''}
          categoryLabel={categoryLabel}
          distance={hoveredEntity?.distance ?? 0}
          distanceLabel={tooltipCopy.distance ?? 'Distance'}
          featuresLabel={tooltipCopy.features ?? 'Features'}
          features={hoveredFeatures}
        />
      </div>

      <EigenInspector
        overlaps={overlaps}
        sliderValues={sliderValues}
        basis={basis}
        ui={ui}
        resolveEntityName={resolveEntityName}
        categoryLabel={categoryLabel}
      />
    </section>
  );
}
