import { Page, Locator, expect } from '@playwright/test';

/**
 * Utility functions for Playwright tests
 */

/**
 * Wait for web components to be defined and rendered
 */
export async function waitForWebComponents(page: Page, components: string[]) {
  for (const component of components) {
    await page.waitForFunction(
      (tagName) => window.customElements.get(tagName) !== undefined,
      component
    );
    await expect(page.locator(component)).toBeVisible({ timeout: 10000 });
  }
}

/**
 * Simulate drag and drop between two elements
 */
export async function dragAndDrop(
  page: Page,
  source: Locator,
  target: Locator,
  options?: { delay?: number }
) {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('Could not get bounding boxes for drag and drop');
  }

  const sourceX = sourceBox.x + sourceBox.width / 2;
  const sourceY = sourceBox.y + sourceBox.height / 2;
  const targetX = targetBox.x + targetBox.width / 2;
  const targetY = targetBox.y + targetBox.height / 2;

  await page.mouse.move(sourceX, sourceY);
  await page.mouse.down();

  if (options?.delay) {
    await page.waitForTimeout(options.delay);
  }

  await page.mouse.move(targetX, targetY);
  await page.mouse.up();

  // Wait for any animations or async operations
  await page.waitForTimeout(300);
}

/**
 * Simulate touch drag and drop
 */
export async function touchDragAndDrop(
  page: Page,
  source: Locator,
  target: Locator,
  options?: { steps?: number }
) {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('Could not get bounding boxes for touch drag and drop');
  }

  const sourceX = sourceBox.x + sourceBox.width / 2;
  const sourceY = sourceBox.y + sourceBox.height / 2;
  const targetX = targetBox.x + targetBox.width / 2;
  const targetY = targetBox.y + targetBox.height / 2;

  // Dispatch touch events
  await source.dispatchEvent('touchstart', {
    touches: [{ clientX: sourceX, clientY: sourceY }]
  });

  // Move in steps for smoother animation
  const steps = options?.steps || 5;
  for (let i = 1; i <= steps; i++) {
    const x = sourceX + (targetX - sourceX) * (i / steps);
    const y = sourceY + (targetY - sourceY) * (i / steps);

    await page.dispatchEvent('body', 'touchmove', {
      touches: [{ clientX: x, clientY: y }]
    });

    await page.waitForTimeout(50);
  }

  await target.dispatchEvent('touchend', {
    changedTouches: [{ clientX: targetX, clientY: targetY }]
  });

  await page.waitForTimeout(300);
}

/**
 * Check accessibility of an element
 */
export async function checkAccessibility(locator: Locator) {
  // Check for proper labeling
  const ariaLabel = await locator.getAttribute('aria-label');
  const ariaLabelledby = await locator.getAttribute('aria-labelledby');
  const title = await locator.getAttribute('title');
  const textContent = await locator.textContent();

  const hasLabel = !!(ariaLabel || ariaLabelledby || title || textContent?.trim());

  // Check if element is focusable
  const tabIndex = await locator.getAttribute('tabindex');
  const tagName = await locator.evaluate(el => el.tagName.toLowerCase());
  const isFocusable = ['input', 'button', 'select', 'textarea', 'a'].includes(tagName) ||
    (tabIndex !== null && parseInt(tabIndex) >= 0);

  return {
    hasLabel,
    isFocusable,
    ariaLabel,
    ariaLabelledby,
    title,
    textContent: textContent?.trim()
  };
}

/**
 * Simulate pinch to zoom gesture
 */
export async function pinchToZoom(
  page: Page,
  center: { x: number; y: number },
  scale: number
) {
  const distance = 100;
  const startDistance = distance / scale;

  // Start points for two fingers
  const finger1Start = { x: center.x - startDistance / 2, y: center.y };
  const finger1End = { x: center.x - distance / 2, y: center.y };
  const finger2Start = { x: center.x + startDistance / 2, y: center.y };
  const finger2End = { x: center.x + distance / 2, y: center.y };

  // Dispatch touch events for pinch gesture
  await page.dispatchEvent('body', 'touchstart', {
    touches: [
      { clientX: finger1Start.x, clientY: finger1Start.y, identifier: 0 },
      { clientX: finger2Start.x, clientY: finger2Start.y, identifier: 1 }
    ]
  });

  // Move fingers apart (zoom in) or together (zoom out)
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const finger1X = finger1Start.x + (finger1End.x - finger1Start.x) * progress;
    const finger2X = finger2Start.x + (finger2End.x - finger2Start.x) * progress;

    await page.dispatchEvent('body', 'touchmove', {
      touches: [
        { clientX: finger1X, clientY: finger1Start.y, identifier: 0 },
        { clientX: finger2X, clientY: finger2Start.y, identifier: 1 }
      ]
    });

    await page.waitForTimeout(50);
  }

  await page.dispatchEvent('body', 'touchend', {
    changedTouches: [
      { clientX: finger1End.x, clientY: finger1End.y, identifier: 0 },
      { clientX: finger2End.x, clientY: finger2End.y, identifier: 1 }
    ]
  });

  await page.waitForTimeout(300);
}

/**
 * Get performance metrics
 */
export async function getPerformanceMetrics(page: Page) {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    };
  });
}

/**
 * Wait for element to be stable (not moving)
 */
export async function waitForElementToBeStable(
  locator: Locator,
  timeout: number = 1000
) {
  let previousBox = await locator.boundingBox();
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const currentBox = await locator.boundingBox();

    if (!previousBox || !currentBox) {
      continue;
    }

    const isStable =
      Math.abs(previousBox.x - currentBox.x) < 1 &&
      Math.abs(previousBox.y - currentBox.y) < 1 &&
      Math.abs(previousBox.width - currentBox.width) < 1 &&
      Math.abs(previousBox.height - currentBox.height) < 1;

    if (isStable) {
      return;
    }

    previousBox = currentBox;
  }
}

/**
 * Check if element has proper focus indication
 */
export async function hasFocusIndication(locator: Locator): Promise<boolean> {
  await locator.focus();

  const styles = await locator.evaluate(el => {
    const computed = getComputedStyle(el);
    return {
      outline: computed.outline,
      outlineWidth: computed.outlineWidth,
      outlineStyle: computed.outlineStyle,
      outlineColor: computed.outlineColor,
      boxShadow: computed.boxShadow,
      borderColor: computed.borderColor,
      backgroundColor: computed.backgroundColor
    };
  });

  // Check for visible focus indicators
  const hasOutline = styles.outline !== 'none' &&
    styles.outlineWidth !== '0px' &&
    styles.outlineStyle !== 'none';

  const hasBoxShadow = styles.boxShadow !== 'none';

  const hasBorderChange = styles.borderColor !== 'initial' &&
    styles.borderColor !== 'currentcolor';

  return hasOutline || hasBoxShadow || hasBorderChange;
}
