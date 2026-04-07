import { useEffect, useRef } from 'react';

function getLocalizedText(field, locale) {
  if (!field) return null;
  return field[locale] ?? field.en ?? null;
}

export default function ArrangementViolationModal({
  open,
  onClose,
  dimension,
  violation,
  lockedArrangement,
  closestAlternative,
  onSnapTo,
  locale,
  ui,
  sliderMeta = [],
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  if (!lockedArrangement || !violation) return null;

  const estate = lockedArrangement.estate;
  const estateName =
    estate.displayName ?? estate.name ?? estate.id;
  const dimensionLabel =
    sliderMeta.find((m) => m.key === dimension)?.label ?? dimension;
  const [rangeMin, rangeMax] = violation.range;
  const constraints = estate.dimensionConstraints?.[dimension];

  const reasoning = getLocalizedText(constraints?.reasoning, locale);
  const caseLaw = getLocalizedText(constraints?.caseLaw, locale);
  const consequences = getLocalizedText(constraints?.consequences, locale);
  const hasContent = reasoning || caseLaw || consequences;

  const authorities = estate.authorities;

  const alternativeName = closestAlternative
    ? closestAlternative.estate.displayName ??
      closestAlternative.estate.name ??
      closestAlternative.estate.id
    : null;

  return (
    <dialog ref={dialogRef} className="arrangement-modal">
      <div className="arrangement-modal-content">
        <header className="arrangement-modal-header">
          <span className="arrangement-modal-icon" aria-hidden="true">!</span>
          <h3>{ui.modal.rangeViolation(dimensionLabel)}</h3>
        </header>

        <p className="arrangement-modal-summary">
          {ui.modal.requiresRange(estateName, dimensionLabel, rangeMin, rangeMax, violation.value)}
        </p>

        {hasContent ? (
          <div className="arrangement-modal-sections">
            {reasoning && (
              <section className="arrangement-modal-section">
                <h4>{ui.modal.legalReasoning}</h4>
                <p>{reasoning}</p>
              </section>
            )}

            {caseLaw && (
              <section className="arrangement-modal-section">
                <h4>{ui.modal.caseLaw}</h4>
                <p>{caseLaw}</p>
                {authorities && (
                  <div className="arrangement-modal-authorities">
                    {Object.entries(authorities)
                      .filter(([, value]) => value != null)
                      .map(([key, value]) => (
                        <span key={key} className="authority-badge">
                          <span className="authority-badge-code">{key.toUpperCase()}</span>
                          {value}
                        </span>
                      ))}
                  </div>
                )}
              </section>
            )}

            {consequences && (
              <section className="arrangement-modal-section">
                <h4>{ui.modal.consequences}</h4>
                <p>{consequences}</p>
              </section>
            )}
          </div>
        ) : (
          <p className="arrangement-modal-fallback">{ui.modal.fallbackNote}</p>
        )}

        <footer className="arrangement-modal-footer">
          {alternativeName && onSnapTo && (
            <button
              type="button"
              className="arrangement-modal-snap-button"
              onClick={() => {
                onSnapTo(closestAlternative);
                onClose();
              }}
            >
              {ui.modal.snapTo(alternativeName)}
            </button>
          )}
          <button
            type="button"
            className="arrangement-modal-dismiss-button"
            onClick={onClose}
          >
            {ui.modal.dismiss}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
