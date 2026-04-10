/**
 * Normalizes uploaded framework data into the flat shape expected by the engine.
 * Handles both flat (Form A) and composite (Form B) framework structures.
 * 
 * @param {Object} uploaded - The parsed JSON object from the user upload.
 * @returns {Object} { parent, analyzableEntries }
 */
export function normalizeUploadedFramework(uploaded) {
  const isComposite = Array.isArray(uploaded.components) && uploaded.components.length > 0;
  
  const parent = {
    id: uploaded.id,
    name: uploaded.name,
    authority: uploaded.authority,
    jurisdiction: uploaded.jurisdiction || null,
    notes: uploaded.notes || null,
    isComposite,
    componentCount: isComposite ? uploaded.components.length : 1
  };

  const analyzableEntries = [];

  if (isComposite) {
    uploaded.components.forEach((component, index) => {
      const componentSlug = slugify(component.name) || `component_${index + 1}`;
      analyzableEntries.push({
        id: `${parent.id}__${componentSlug}`,
        name: `${parent.name} — ${component.name}`,
        ranges: { ...component.ranges },
        authority: parent.authority,
        jurisdiction: parent.jurisdiction,
        notes: parent.notes,
        _parentId: parent.id,
        _isComponentOf: parent.name
      });
    });
  } else {
    analyzableEntries.push({
      id: uploaded.id,
      name: uploaded.name,
      ranges: { ...uploaded.ranges },
      authority: uploaded.authority,
      jurisdiction: uploaded.jurisdiction || null,
      notes: uploaded.notes || null,
      _parentId: null,
      _isComponentOf: null
    });
  }

  return {
    parent,
    analyzableEntries
  };
}

/**
 * Slugs a string: lowercase, spaces to underscore, strip non-alphanumeric.
 * Gracefully handles non-ASCII characters by stripping them, which triggers 
 * the fallback to index-based IDs if the result is empty.
 * 
 * @param {string} text 
 * @returns {string}
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')           // Replace spaces with _
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars (except -)
    .replace(/--+/g, '_');          // Replace multiple - or _ with single _
}
