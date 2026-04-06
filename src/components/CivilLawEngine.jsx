import { Fragment, useState } from 'react';

const JURISDICTIONS = [
  { key: 'de', label: 'DE' },
  { key: 'jp', label: 'JP' },
  { key: 'tw', label: 'TW' },
  { key: 'prc', label: 'PRC' },
];

function getCivilDisplayName(estate) {
  return (
    estate.names.de ??
    estate.names.tw ??
    estate.names.prc ??
    estate.names.jp ??
    estate.id
  );
}

function CivilLawCard({ estate, score, index, activeJurisdiction }) {
  const defaultJurisdiction =
    JURISDICTIONS.find(({ key }) => estate.names[key])?.key ?? 'de';
  const [mobileJurisdiction, setMobileJurisdiction] =
    useState(defaultJurisdiction);
  const activeLabel = JURISDICTIONS.find(
    ({ key }) => key === mobileJurisdiction
  );
  const percentage = Math.round(score * 100);

  return (
    <article className={`match-card civil-card ${index === 0 ? 'top-match' : ''}`}>
      <div className="match-header">
        <div>
          <p className="match-rank">#{index + 1} civil-law fit</p>
          <h3 className="estate-name">{getCivilDisplayName(estate)}</h3>
        </div>
        <span className="match-pct">{percentage}%</span>
      </div>

      <div className="match-bar">
        <div className="match-fill" style={{ width: `${percentage}%` }} />
      </div>

      <div className="jurisdiction-grid">
        {JURISDICTIONS.map(({ key, label }) => (
          <div
            key={key}
            className={`jurisdiction-cell ${estate.names[key] ? '' : 'empty'} ${
              activeJurisdiction === key && estate.names[key]
                ? 'active-context'
                : ''
            }`}
          >
            <span className="jurisdiction-code">{label}</span>
            <span className="jurisdiction-name">{estate.names[key] ?? '---'}</span>
            {estate.authorities[key] ? (
              <span className="jurisdiction-authority">
                {estate.authorities[key]}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="civil-law-tabs" role="tablist" aria-label="Jurisdiction view">
        {JURISDICTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`civil-tab ${
              mobileJurisdiction === key ? 'active' : ''
            } ${estate.names[key] ? '' : 'empty'}`}
            onClick={() => setMobileJurisdiction(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="civil-law-mobile-panel">
        <div className="mobile-jurisdiction-header">
          <span className="jurisdiction-code">{activeLabel?.label ?? '---'}</span>
          <span className="jurisdiction-name">
            {estate.names[mobileJurisdiction] ?? '---'}
          </span>
        </div>
        {estate.authorities[mobileJurisdiction] ? (
          <p className="jurisdiction-authority">
            {estate.authorities[mobileJurisdiction]}
          </p>
        ) : null}
      </div>

      <div className="genealogy-chain" aria-label="Jurisdiction genealogy chain">
        {JURISDICTIONS.map(({ key, label }, indexValue) => (
          <Fragment key={key}>
            <div className="genealogy-step">
              <span
                className={`genealogy-node ${
                  estate.names[key] ? 'filled' : 'hollow'
                }`}
              />
              <span className="genealogy-label">{label}</span>
            </div>
            {indexValue < JURISDICTIONS.length - 1 ? (
              <span className="genealogy-arrow" aria-hidden="true">
                &gt;
              </span>
            ) : null}
          </Fragment>
        ))}
      </div>

      <p className="estate-description">{estate.description}</p>
      <p className="estate-notes">{estate.notes}</p>
    </article>
  );
}

export default function CivilLawEngine({
  matches,
  title = 'Civil Law Track',
  limit = 5,
  activeJurisdiction = null,
}) {
  const visibleMatches = matches.slice(0, limit);

  return (
    <section className="track-panel">
      <div className="track-heading">
        <p className="track-kicker">Ranked Matches</p>
        <h2 className="track-title">{title}</h2>
      </div>

      <div className="match-card-list">
        {visibleMatches.map(({ estate, score }, index) => (
          <CivilLawCard
            key={estate.id}
            estate={estate}
            score={score}
            index={index}
            activeJurisdiction={activeJurisdiction}
          />
        ))}
      </div>
    </section>
  );
}
