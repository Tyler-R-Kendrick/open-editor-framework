export const ExperimentFlags = {
  ALIGNMENT_GUIDES: 'exp-alignment-guides',
  PROPERTY_LIVE_PREVIEW: 'exp-property-live-preview',
  CURATED_TEMPLATES: 'exp-curated-templates',
  LONG_PRESS_THRESHOLD: 'exp-long-press-threshold',
  SHARE_PREVIEW: 'exp-share-preview'
} as const;

export type AlignmentVariant = 'control' | 'guides' | 'guides-snap';
export type TemplateVariant = 'control' | 'curated';
export type LongPressVariantMs = 150 | 300 | 450;

export type FeatureFlagValue = string | boolean | undefined;

export function resolveAlignmentVariant(
  value: FeatureFlagValue
): AlignmentVariant {
  if (value === 'guides' || value === 'guides-snap') return value;
  return 'control';
}

export function resolvePropertyPreviewEnabled(
  value: FeatureFlagValue
): boolean {
  return value === true || value === 'test' || value === 'true';
}

/** When the experiment is inactive, keep the current live-commit behavior. */
export type PropertyEditMode = 'live' | 'blur' | 'live-validated';

export function resolvePropertyEditMode(
  value: FeatureFlagValue
): PropertyEditMode {
  if (value === 'control') return 'blur';
  if (
    value === true ||
    value === 'test' ||
    value === 'true' ||
    value === 'live-validated'
  ) {
    return 'live-validated';
  }
  return 'live';
}

export function resolveTemplateVariant(
  value: FeatureFlagValue
): TemplateVariant {
  if (value === true || value === 'curated' || value === 'test') {
    return 'curated';
  }
  return 'control';
}

/** `null` means the long-press experiment is inactive (keep current sensors). */
export function resolveLongPressMs(
  value: FeatureFlagValue
): LongPressVariantMs | null {
  if (value === undefined || value === false) return null;
  if (value === '150') return 150;
  if (value === '450') return 450;
  // `control` and `300` are the current 300ms baseline.
  if (value === 'control' || value === '300' || value === true) return 300;
  return 300;
}

export function resolveSharePreviewEnabled(value: FeatureFlagValue): boolean {
  return value === true || value === 'test' || value === 'true';
}

export const TEMPLATE_URLS = {
  control: '/assets/component-templates.json',
  curated: '/assets/curated-component-templates.json'
} as const;
