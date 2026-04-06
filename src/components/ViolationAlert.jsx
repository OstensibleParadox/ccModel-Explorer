import { useEffect, useMemo, useRef, useState } from 'react';

const AUTO_DISMISS_MS = 4000;
const EXIT_MS = 240;
const ICONS = {
  error: '!',
  warning: '!',
};

function clearTimers(timerMap) {
  timerMap.forEach((timer) => clearTimeout(timer));
  timerMap.clear();
}

function retainActiveIds(currentIds, activeIdSet) {
  const nextIds = currentIds.filter((id) => activeIdSet.has(id));

  if (
    nextIds.length === currentIds.length &&
    nextIds.every((id, index) => id === currentIds[index])
  ) {
    return currentIds;
  }

  return nextIds;
}

export default function ViolationAlert({ violations }) {
  const [dismissedWarningIds, setDismissedWarningIds] = useState([]);
  const [dismissingWarningIds, setDismissingWarningIds] = useState([]);
  const dismissTimersRef = useRef(new Map());
  const exitTimersRef = useRef(new Map());
  const pruneTimerRef = useRef(null);

  const toastViolations = useMemo(() => {
    return violations.filter(
      ({ severity }) => severity === 'error' || severity === 'warning'
    );
  }, [violations]);

  const warningIds = useMemo(() => {
    return toastViolations
      .filter(({ severity }) => severity === 'warning')
      .map(({ id }) => id);
  }, [toastViolations]);

  useEffect(() => {
    const dismissTimers = dismissTimersRef.current;
    const exitTimers = exitTimersRef.current;

    return () => {
      if (pruneTimerRef.current) {
        clearTimeout(pruneTimerRef.current);
      }

      clearTimers(dismissTimers);
      clearTimers(exitTimers);
    };
  }, []);

  useEffect(() => {
    const activeWarningIdSet = new Set(warningIds);

    dismissTimersRef.current.forEach((timer, id) => {
      if (!activeWarningIdSet.has(id)) {
        clearTimeout(timer);
        dismissTimersRef.current.delete(id);
      }
    });

    exitTimersRef.current.forEach((timer, id) => {
      if (!activeWarningIdSet.has(id)) {
        clearTimeout(timer);
        exitTimersRef.current.delete(id);
      }
    });

    if (pruneTimerRef.current) {
      clearTimeout(pruneTimerRef.current);
    }

    pruneTimerRef.current = setTimeout(() => {
      setDismissedWarningIds((currentIds) =>
        retainActiveIds(currentIds, activeWarningIdSet)
      );
      setDismissingWarningIds((currentIds) =>
        retainActiveIds(currentIds, activeWarningIdSet)
      );
      pruneTimerRef.current = null;
    }, 0);
  }, [warningIds]);

  useEffect(() => {
    const dismissedSet = new Set(dismissedWarningIds);
    const dismissingSet = new Set(dismissingWarningIds);

    warningIds.forEach((id) => {
      if (
        dismissedSet.has(id) ||
        dismissingSet.has(id) ||
        dismissTimersRef.current.has(id)
      ) {
        return;
      }

      const timer = setTimeout(() => {
        dismissTimersRef.current.delete(id);
        setDismissingWarningIds((currentIds) =>
          currentIds.includes(id) ? currentIds : [...currentIds, id]
        );
      }, AUTO_DISMISS_MS);

      dismissTimersRef.current.set(id, timer);
    });
  }, [warningIds, dismissedWarningIds, dismissingWarningIds]);

  useEffect(() => {
    const dismissingSet = new Set(dismissingWarningIds);

    dismissingWarningIds.forEach((id) => {
      if (exitTimersRef.current.has(id)) {
        return;
      }

      const timer = setTimeout(() => {
        exitTimersRef.current.delete(id);
        setDismissingWarningIds((currentIds) =>
          currentIds.filter((currentId) => currentId !== id)
        );
        setDismissedWarningIds((currentIds) =>
          currentIds.includes(id) ? currentIds : [...currentIds, id]
        );
      }, EXIT_MS);

      exitTimersRef.current.set(id, timer);
    });

    exitTimersRef.current.forEach((timer, id) => {
      if (!dismissingSet.has(id)) {
        clearTimeout(timer);
        exitTimersRef.current.delete(id);
      }
    });
  }, [dismissingWarningIds]);

  const dismissedSet = useMemo(() => {
    return new Set(dismissedWarningIds);
  }, [dismissedWarningIds]);

  const dismissingSet = useMemo(() => {
    return new Set(dismissingWarningIds);
  }, [dismissingWarningIds]);

  const visibleViolations = toastViolations.filter(
    ({ severity, id }) => severity === 'error' || !dismissedSet.has(id)
  );

  if (!visibleViolations.length) {
    return null;
  }

  return (
    <aside className="violation-toast-stack" aria-live="polite">
      {visibleViolations.map((violation) => (
        <article
          key={violation.id}
          className={`violation-toast violation-toast--${violation.severity} ${
            dismissingSet.has(violation.id) ? 'is-dismissing' : ''
          }`}
        >
          <span className="violation-toast-icon" aria-hidden="true">
            {ICONS[violation.severity]}
          </span>
          <p className="violation-toast-message">{violation.message}</p>
        </article>
      ))}
    </aside>
  );
}
