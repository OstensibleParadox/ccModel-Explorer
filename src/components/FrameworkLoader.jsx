import { useState } from 'react';
import { normalizeUploadedFramework } from '../utils/normalizeUploadedFramework';

const DIMENSIONS = [
  'possession',
  'use',
  'income',
  'alienation',
  'exclusion',
  'duration',
  'inheritability',
];

export default function FrameworkLoader({ onFrameworkLoad }) {
  const [fileText, setFileText] = useState('');
  const [validationErrors, setValidationErrors] = useState(null);
  const [normalizedResult, setNormalizedResult] = useState(null);
  const [loadSuccess, setLoadSuccess] = useState(false);

  const validateRanges = (ranges, path) => {
    const errors = [];
    if (!ranges || typeof ranges !== 'object') {
      errors.push(`${path}: ranges must be an object`);
      return errors;
    }

    const keys = Object.keys(ranges);
    const missing = DIMENSIONS.filter(d => !keys.includes(d));
    if (missing.length > 0) {
      errors.push(`${path}: missing dimensions: ${missing.join(', ')}`);
    }

    const extra = keys.filter(k => !DIMENSIONS.includes(k));
    if (extra.length > 0) {
      errors.push(`${path}: extra dimensions not allowed: ${extra.join(', ')}`);
    }

    DIMENSIONS.forEach(dim => {
      const val = ranges[dim];
      if (Array.isArray(val)) {
        if (val.length !== 2) {
          errors.push(`${path}.${dim}: must have exactly 2 elements`);
        } else {
          const [min, max] = val;
          if (typeof min !== 'number' || typeof max !== 'number') {
            errors.push(`${path}.${dim}: elements must be numbers`);
          } else {
            if (min < 0 || min > 100 || max < 0 || max > 100) {
              errors.push(`${path}.${dim}: numbers must be in [0, 100]`);
            }
            if (min > max) {
              errors.push(`${path}.${dim}: min must be <= max`);
            }
          }
        }
      } else if (keys.includes(dim)) {
        errors.push(`${path}.${dim}: must be an array`);
      }
    });

    return errors;
  };

  const validateFramework = (data) => {
    const errors = [];
    if (!data.id) errors.push('Root: missing "id"');
    if (!data.name) errors.push('Root: missing "name"');
    if (!data.authority) errors.push('Root: missing "authority"');

    if (data.components) {
      if (!Array.isArray(data.components)) {
        errors.push('Root: "components" must be an array');
      } else if (data.components.length === 0) {
        errors.push('Root: "components" array cannot be empty');
      } else {
        data.components.forEach((comp, idx) => {
          if (!comp.name) errors.push(`components[${idx}]: missing "name"`);
          errors.push(...validateRanges(comp.ranges, `components[${idx}]`));
        });
      }
    } else {
      errors.push(...validateRanges(data.ranges, 'Root'));
    }

    return errors.length > 0 ? errors : null;
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setFileText(text);
    setLoadSuccess(false);
    
    if (!text.trim()) {
      setValidationErrors(null);
      setNormalizedResult(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const errors = validateFramework(parsed);
      if (errors) {
        setValidationErrors(errors);
        setNormalizedResult(null);
      } else {
        setValidationErrors(null);
        setNormalizedResult(normalizeUploadedFramework(parsed));
      }
    } catch (err) {
      setValidationErrors([`JSON Parse Error: ${err.message}`]);
      setNormalizedResult(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      handleTextChange({ target: { value: event.target.result } });
    };
    reader.readAsText(file);
  };

  const handleLoadClick = () => {
    if (normalizedResult) {
      onFrameworkLoad(normalizedResult.analyzableEntries, normalizedResult.parent);
      setLoadSuccess(true);
      setFileText('');
      setNormalizedResult(null);
    }
  };

  return (
    <div className="framework-loader track-panel" style={{ marginTop: '1.25rem' }}>
      <div className="track-heading">
        <p className="track-kicker">Plug-in</p>
        <h2 className="track-title">Framework Loader</h2>
        <p className="ai-panel-subtitle">
          Upload custom governance frameworks for immediate eigenspace analysis.
        </p>
      </div>

      <div style={{ margin: '1.5rem 0' }}>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleFileUpload}
          style={{ marginBottom: '1rem', display: 'block' }}
        />
        <textarea
          placeholder="Paste JSON here..."
          value={fileText}
          onChange={handleTextChange}
          className="match-card"
          style={{ 
            width: '100%', 
            height: '150px', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.85rem',
            resize: 'vertical',
            padding: '1rem',
            background: 'var(--surface-soft)'
          }}
        />
      </div>

      {validationErrors && (
        <div className="ai-violation-chip ai-violation-chip--error" style={{ marginBottom: '1rem' }}>
          <div className="ai-violation-body">
            <strong className="ai-violation-message">Validation Errors</strong>
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', fontSize: '0.82rem' }}>
              {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

      {normalizedResult && !validationErrors && (
        <div className="ai-violation-chip ai-violation-chip--warning" style={{ marginBottom: '1rem', background: 'rgba(33, 92, 101, 0.1)', borderColor: 'var(--civil)' }}>
          <div className="ai-violation-body">
            <strong className="ai-violation-message" style={{ color: 'var(--civil)' }}>
              Ready to Load: {normalizedResult.parent.name}
            </strong>
            <p className="ai-violation-detail">
              This will add {normalizedResult.parent.componentCount} sphere(s) to the visualization.
            </p>
            <button 
              onClick={handleLoadClick}
              className="arrangement-modal-snap-button"
              style={{ marginTop: '0.5rem', width: 'fit-content' }}
            >
              Load into analysis
            </button>
          </div>
        </div>
      )}

      {loadSuccess && (
        <p style={{ color: 'var(--civil)', fontWeight: '600', marginBottom: '1rem' }}>
          ✓ Framework loaded successfully!
        </p>
      )}
    </div>
  );
}
