import { useEffect, useRef, useState } from 'react';
import { LANGUAGE_OPTIONS, getLanguageOption } from '../i18n';

export default function LanguageSwitcher({ locale, onChange, ui }) {
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef(null);
  const activeLanguage = getLanguageOption(locale);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        switcherRef.current &&
        event.target instanceof Node &&
        !switcherRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={switcherRef}
      className={`language-switcher ${isOpen ? 'is-open' : ''}`}
    >
      <button
        type="button"
        className="language-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ui.changeLanguageLabel}
        title={ui.languageMenuLabel}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="language-trigger-flag" aria-hidden="true">
          {activeLanguage.flag}
        </span>
        <span className="language-trigger-text">{activeLanguage.nativeLabel}</span>
        <span className="language-trigger-caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen ? (
        <div className="language-menu" role="menu" aria-label={ui.languageMenuLabel}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.key === locale;

            return (
              <button
                key={option.key}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                className={`language-option ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  onChange(option.key);
                  setIsOpen(false);
                }}
              >
                <span className="language-option-flag" aria-hidden="true">
                  {option.flag}
                </span>
                <span className="language-option-label">{option.nativeLabel}</span>
                <span className="language-option-code">{option.shortLabel}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
