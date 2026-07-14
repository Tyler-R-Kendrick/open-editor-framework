import {
  ExperimentFlags,
  resolveAlignmentVariant,
  resolveLongPressMs,
  resolvePropertyEditMode,
  resolvePropertyPreviewEnabled,
  resolveSharePreviewEnabled,
  resolveTemplateVariant
} from '../src/analytics/featureFlags';

describe('experiment feature flags', () => {
  it('defines flag keys for each planned experiment', () => {
    expect(ExperimentFlags.ALIGNMENT_GUIDES).toBe('exp-alignment-guides');
    expect(ExperimentFlags.PROPERTY_LIVE_PREVIEW).toBe(
      'exp-property-live-preview'
    );
    expect(ExperimentFlags.CURATED_TEMPLATES).toBe('exp-curated-templates');
    expect(ExperimentFlags.LONG_PRESS_THRESHOLD).toBe(
      'exp-long-press-threshold'
    );
    expect(ExperimentFlags.SHARE_PREVIEW).toBe('exp-share-preview');
  });

  it('resolves alignment variants from flag values', () => {
    expect(resolveAlignmentVariant(undefined)).toBe('control');
    expect(resolveAlignmentVariant(false)).toBe('control');
    expect(resolveAlignmentVariant('control')).toBe('control');
    expect(resolveAlignmentVariant('guides')).toBe('guides');
    expect(resolveAlignmentVariant('guides-snap')).toBe('guides-snap');
  });

  it('resolves property live preview from boolean flag', () => {
    expect(resolvePropertyPreviewEnabled(undefined)).toBe(false);
    expect(resolvePropertyPreviewEnabled(false)).toBe(false);
    expect(resolvePropertyPreviewEnabled(true)).toBe(true);
    expect(resolvePropertyPreviewEnabled('test')).toBe(true);
  });

  it('resolves property edit mode without changing default UX', () => {
    expect(resolvePropertyEditMode(undefined)).toBe('live');
    expect(resolvePropertyEditMode('control')).toBe('blur');
    expect(resolvePropertyEditMode(true)).toBe('live-validated');
    expect(resolvePropertyEditMode('test')).toBe('live-validated');
  });

  it('resolves curated template URLs', () => {
    expect(resolveTemplateVariant(undefined)).toBe('control');
    expect(resolveTemplateVariant(false)).toBe('control');
    expect(resolveTemplateVariant('curated')).toBe('curated');
    expect(resolveTemplateVariant(true)).toBe('curated');
  });

  it('resolves long-press thresholds in milliseconds', () => {
    expect(resolveLongPressMs(undefined)).toBeNull();
    expect(resolveLongPressMs(false)).toBeNull();
    expect(resolveLongPressMs('150')).toBe(150);
    expect(resolveLongPressMs('300')).toBe(300);
    expect(resolveLongPressMs('control')).toBe(300);
    expect(resolveLongPressMs('450')).toBe(450);
    expect(resolveLongPressMs(true)).toBe(300);
  });

  it('resolves share preview flag', () => {
    expect(resolveSharePreviewEnabled(undefined)).toBe(false);
    expect(resolveSharePreviewEnabled(true)).toBe(true);
    expect(resolveSharePreviewEnabled('test')).toBe(true);
  });
});
