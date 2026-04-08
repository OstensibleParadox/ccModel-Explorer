import SliderPanel from './SliderPanel';
import ArrangementViolationModal from './ArrangementViolationModal';

function ControlSurface({
  state,
  engine,
  localizedData,
  ui,
  sliderMeta,
  arrangementViolations,
  closestAlternative,
  handleCommonLawJurisdictionChange,
  handleCivilJurisdictionChange,
  handleAssetTypeChange,
  handlePresetClick,
  handleSnapTo,
  sliderAnnotations,
  sliderPanelNote,
}) {
  const {
    localizedCommonLawEstates,
    localizedCivilLawEstates,
    localizedAIFrameworks,
  } = localizedData;

  const violationModalData =
    state.violationModalDimension && state.lockedArrangement
      ? arrangementViolations.find(
          (v) => v.dimension === state.violationModalDimension
        ) ?? null
      : null;

  return (
    <>
      <section className="panel-sliders">
        <SliderPanel
          values={state.sliderValues}
          onChange={state.setSliderValues}
          commonLawEstates={state.mode === 'property' ? localizedCommonLawEstates : []}
          civilLawEstates={state.mode === 'property' ? localizedCivilLawEstates : []}
          activeCommonLawJurisdiction={state.activeCommonLawJurisdiction}
          onCommonLawJurisdictionChange={handleCommonLawJurisdictionChange}
          activeCivilJurisdiction={state.activeCivilJurisdiction}
          onCivilLawJurisdictionChange={handleCivilJurisdictionChange}
          activeAssetType={state.activeAssetType}
          onAssetTypeChange={handleAssetTypeChange}
          sliderAnnotations={state.mode === 'property' ? sliderAnnotations : []}
          sliderBounds={engine.sliderBounds}
          arrangementRanges={state.lockedArrangement?.resolvedRanges ?? null}
          panelNote={state.mode === 'property' ? sliderPanelNote : null}
          sliderMeta={sliderMeta}
          selectedPreset={state.selectedPreset}
          lockedArrangement={state.lockedArrangement}
          onPresetClick={handlePresetClick}
          onReset={state.handleReset}
          arrangementViolations={arrangementViolations}
          closestAlternative={closestAlternative}
          onOpenViolationModal={state.setViolationModalDimension}
          ui={ui}
          mode={state.mode}
          aiFrameworks={localizedAIFrameworks}
        />
      </section>

      <ArrangementViolationModal
        open={violationModalData != null}
        onClose={() => state.setViolationModalDimension(null)}
        dimension={state.violationModalDimension}
        violation={violationModalData}
        lockedArrangement={state.lockedArrangement}
        closestAlternative={closestAlternative}
        onSnapTo={handleSnapTo}
        locale={state.locale}
        ui={ui}
        sliderMeta={sliderMeta}
      />
    </>
  );
}

export default ControlSurface;
