import { renderHook, act, waitFor } from '@testing-library/react';
import { useComponentTemplates } from '../src/behaviors/useComponentTemplates';

describe('useComponentTemplates', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ templates: [], categories: ['All'] })
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('loads templates on mount', async () => {
    const { result } = renderHook(() => useComponentTemplates('/test.json'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/test.json');
  });

  it('reload fetches templates again', async () => {
    const { result } = renderHook(() => useComponentTemplates('/test.json'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.reload();
    });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
});
