import { useEffect, useMemo, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  buildProjectionBasis,
  projectPoint,
  projectAllEntities,
  findOverlaps,
  sliderValuesToArray,
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
const NORM_HALF_RANGE = 50;

function normalizeCoords(coords, scaleFactors) {
  return coords.map((v, i) => v * scaleFactors[i]);
}

function computeScaleFactors(projectedEntities) {
  const halfRanges = [0, 1, 2].map((axis) => {
    const maxAbs = projectedEntities.reduce(
      (mx, { coords }) => Math.max(mx, Math.abs(coords[axis])),
      1e-6
    );
    return maxAbs;
  });
  return halfRanges.map((hr) => NORM_HALF_RANGE / hr);
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

export default function EigenVisualization({ sliderValues, allEntities, locale, ui }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);
  const clockRef = useRef(null);
  const userMeshRef = useRef(null);
  const entityMeshMapRef = useRef(new Map());
  const highlightSetRef = useRef(new Set());

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

    function handleResize() {
      const { clientWidth: w, clientHeight: h } = container;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

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

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      sceneRef.current = null;
    };
  }, []);

  // --- Create entity spheres + axes + user sphere ---
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || projected.length === 0) return;

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
      mesh.userData = { entityId: entity.id, category: entity._category };
      trackAdd(mesh);
      entityMeshMapRef.current.set(entity.id, mesh);

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
        trackAdd(wireframe);
        localDisposables.push(sourceGeo, edgesGeo, edgesMat);
      }
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
    const userMat = new THREE.MeshStandardMaterial({ color: COLORS.user });
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
      entityMeshMapRef.current.clear();
      userMeshRef.current = null;
    };
  }, [projected, scaleFactors, basis]);

  // --- Update user sphere position ---
  useEffect(() => {
    if (!userMeshRef.current) return;
    userMeshRef.current.position.set(
      userNormalized[0],
      userNormalized[1],
      userNormalized[2]
    );
  }, [userNormalized]);

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

  const resolveEntityName = useCallback(
    (entity) => {
      if (entity.names) {
        return entity.names[locale] ?? entity.names.en ?? entity.names.de ?? entity.id;
      }
      return entity.name ?? entity.id;
    },
    [locale]
  );

  const legendLabels = ui?.eigenspacePanel?.legend ?? {
    commonLaw: 'Common Law',
    civilLaw: 'Civil Law',
    ai: 'AI Framework',
    user: 'Your Config',
  };

  const categoryLabel = useCallback(
    (cat) => legendLabels[cat] ?? cat,
    [legendLabels]
  );

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
        </div>
      </div>

      <div
        className={`eigen-info-panel ${overlaps.length > 0 ? 'eigen-info-panel--active' : ''}`}
      >
        {overlaps.length > 0 ? (
          <>
            <p className="eigen-iso-label">
              {ui?.eigenspacePanel?.isomorphicTo ??
                'Your configuration is isomorphic to'}:
            </p>
            <ul className="eigen-match-list">
              {overlaps.map(({ entity, distance }) => (
                <li key={entity.id} className="eigen-match-item">
                  <span className="eigen-match-name">
                    {resolveEntityName(entity)}
                  </span>
                  <span
                    className={`eigen-match-category eigen-match-category--${entity._category}`}
                  >
                    {categoryLabel(entity._category)}
                  </span>
                  <span className="eigen-match-distance">
                    d={distance.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="eigen-no-match">
            {ui?.eigenspacePanel?.noMatch ??
              'Move sliders to explore the eigenspace'}
          </p>
        )}
      </div>
    </section>
  );
}
