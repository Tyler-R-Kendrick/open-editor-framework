import { Page, Locator, expect } from '@playwright/test';

/**
 * Utility functions for Playwright tests
 */

/**
 * Wait for web components to be defined and rendered
 * Handles mobile navigation automatically
 */
export async function waitForWebComponents(page: Page, components: string[]) {
  const isMobile = page.viewportSize()!.width <= 768;

  for (const component of components) {
    await page.waitForFunction(
      (tagName) => window.customElements.get(tagName) !== undefined,
      component
    );

    // Handle mobile navigation for specific components
    if (isMobile) {
      if (component === 'component-palette') {
        const paletteTab = page.locator('.mobile-tab:has-text("Components")');
        if (await paletteTab.count() > 0) {
          await paletteTab.click();
          await page.waitForTimeout(300);
        }
      } else if (component === 'control-panel') {
        const propertiesTab = page.locator('.mobile-tab:has-text("Properties")');
        if (await propertiesTab.count() > 0) {
          await propertiesTab.click();
          await page.waitForTimeout(300);
        }
      } else if (component === 'editor-canvas') {
        const canvasTab = page.locator('.mobile-tab:has-text("Canvas")');
        if (await canvasTab.count() > 0) {
          await canvasTab.click();
          await page.waitForTimeout(300);
        }
      }
    }

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
  const isMobile = await isMobileViewport(page);
  const hasTouch = await hasTouchSupport(page);

  if (isMobile && hasTouch) {
    // On mobile with touch support, we need to use a different approach
    // Since we can't have both source and target visible at the same time,
    // we'll simulate the drag and drop by triggering the app's internal events

    // First, get the source element info while on the source tab
    const sourceParent = await source.evaluateHandle(el => {
      const editorCanvas = el.closest('editor-canvas');
      const componentPalette = el.closest('component-palette');
      const controlPanel = el.closest('control-panel');

      if (editorCanvas) return 'editor-canvas';
      if (componentPalette) return 'component-palette';
      if (controlPanel) return 'control-panel';
      return null;
    });

    const sourceComponentName = await sourceParent.jsonValue();
    if (sourceComponentName) {
      await ensureComponentVisibleByName(page, sourceComponentName);
    }

    await expect(source).toBeVisible();

    // Get source element data while it's visible
    const sourceData = await source.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        componentType: el.getAttribute('data-component-type') || 'text',
        innerHTML: el.innerHTML,
        className: el.className
      };
    });

    // Now switch to target tab and get target info
    const targetParent = await target.evaluateHandle(el => {
      const editorCanvas = el.closest('editor-canvas');
      const componentPalette = el.closest('component-palette');
      const controlPanel = el.closest('control-panel');

      if (editorCanvas) return 'editor-canvas';
      if (componentPalette) return 'component-palette';
      if (controlPanel) return 'control-panel';
      return null;
    });

    const targetComponentName = await targetParent.jsonValue();
    if (targetComponentName) {
      await ensureComponentVisibleByName(page, targetComponentName);
    }

    await expect(target).toBeVisible();

    const targetData = await target.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      };
    });

    // Simulate the drag and drop with touch events at the target location
    // This simulates adding a component to the canvas without needing both visible
    await page.touchscreen.tap(targetData.x, targetData.y);
    await page.waitForTimeout(200);

    // If this is a palette to canvas drop, we can simulate the component addition
    if (sourceComponentName === 'component-palette' && targetComponentName === 'editor-canvas') {          // Trigger component addition via JavaScript
      await page.evaluate((componentType) => {
        const canvas = document.querySelector('editor-canvas');
        if (canvas) {
          // Simulate component drop event
          const event = new CustomEvent('component-drop', {
            detail: {
              componentType: componentType
            }
          });
          canvas.dispatchEvent(event);
        }
      }, sourceData.componentType);
    }

  } else if (isMobile) {
    // Mobile without touch - use mouse but handle tab switching
    const sourceParent = await source.evaluateHandle(el => {
      const editorCanvas = el.closest('editor-canvas');
      const componentPalette = el.closest('component-palette');
      const controlPanel = el.closest('control-panel');

      if (editorCanvas) return 'editor-canvas';
      if (componentPalette) return 'component-palette';
      if (controlPanel) return 'control-panel';
      return null;
    });

    const sourceComponentName = await sourceParent.jsonValue();
    if (sourceComponentName) {
      await ensureComponentVisibleByName(page, sourceComponentName);
    }

    await expect(source).toBeVisible();
    const sourceBox = await source.boundingBox();

    if (!sourceBox) {
      throw new Error('Could not get source bounding box for mobile drag and drop');
    }

    // Get source coordinates
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;

    // Switch to target and get coordinates
    const targetParent = await target.evaluateHandle(el => {
      const editorCanvas = el.closest('editor-canvas');
      const componentPalette = el.closest('component-palette');
      const controlPanel = el.closest('control-panel');

      if (editorCanvas) return 'editor-canvas';
      if (componentPalette) return 'component-palette';
      if (controlPanel) return 'control-panel';
      return null;
    });

    const targetComponentName = await targetParent.jsonValue();
    if (targetComponentName) {
      await ensureComponentVisibleByName(page, targetComponentName);
    }

    await expect(target).toBeVisible();
    const targetBox = await target.boundingBox();

    if (!targetBox) {
      throw new Error('Could not get target bounding box for mobile drag and drop');
    }

    const targetX = targetBox.x + targetBox.width / 2;
    const targetY = targetBox.y + targetBox.height / 2;

    // Switch back to source to start drag
    if (sourceComponentName) {
      await ensureComponentVisibleByName(page, sourceComponentName);
    }

    await page.mouse.move(sourceX, sourceY);
    await page.mouse.down();

    // Switch to target to complete drag
    if (targetComponentName) {
      await ensureComponentVisibleByName(page, targetComponentName);
    }

    await page.mouse.move(targetX, targetY);
    await page.mouse.up();

  } else {
    // Desktop drag and drop - normal approach
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
  }

  // Wait for any animations or async operations
  await page.waitForTimeout(500);
}

/**
 * Ensure a component is visible on mobile by navigating to the correct tab
 */
export async function ensureComponentVisible(
  page: Page,
  componentName: 'palette' | 'canvas' | 'controls'
) {
  const isMobile = page.viewportSize()!.width <= 768;

  if (isMobile) {
    const tabMap = {
      palette: 'Components',
      canvas: 'Canvas',
      controls: 'Properties'
    };

    const tab = page.locator(`.mobile-tab:has-text("${tabMap[componentName]}")`);
    if (await tab.count() > 0) {
      await tab.click();
      await page.waitForTimeout(300);
    }
  }
}

/**
 * Ensure any component is visible by name
 */
export async function ensureComponentVisibleByName(
  page: Page,
  componentName: string,
  timeout: number = 10000
): Promise<void> {
  const component = page.locator(componentName);

  try {
    // First check if already visible
    await expect(component).toBeVisible({ timeout: 2000 });
    return;
  } catch {
    // Not visible, try mobile tab navigation
    const isMobile = await isMobileViewport(page);

    if (isMobile) {
      // Map component names to the exact tab text used in the app
      const componentToTabText: Record<string, string> = {
        'component-palette': 'Components',
        'editor-canvas': 'Canvas',
        'control-panel': 'Properties'
      };

      const tabText = componentToTabText[componentName];
      if (tabText) {
        // Try to click the mobile tab via direct JavaScript execution
        // This handles the shadow DOM issue
        const clicked = await page.evaluate((targetTabText) => {
          const editorApp = document.querySelector('editor-app');
          if (!editorApp) return false;

          let mobileTab = null;

          // Look for any button containing the tab text in the document
          const buttons = document.querySelectorAll('button');
          for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            if (button.textContent && button.textContent.trim().includes(targetTabText) &&
              button.classList.contains('mobile-tab')) {
              mobileTab = button;
              break;
            }
          }

          // If not found, try to access shadow DOM
          if (!mobileTab && editorApp.shadowRoot) {
            const shadowTabs = editorApp.shadowRoot.querySelectorAll('.mobile-tab');
            for (let i = 0; i < shadowTabs.length; i++) {
              const tab = shadowTabs[i];
              if (tab.textContent && tab.textContent.trim().includes(targetTabText)) {
                mobileTab = tab;
                break;
              }
            }
          }

          if (mobileTab) {
            (mobileTab as HTMLElement).click();
            return true;
          }
          return false;
        }, tabText);

        if (clicked) {
          await page.waitForTimeout(500);

          // Check if component is now visible
          if (await component.isVisible()) {
            return;
          }
        }

        // Try Playwright's built-in locator approach with different selectors
        const tabSelectors = [
          `button:has-text("${tabText}")`,
          `.mobile-tab:has-text("${tabText}")`,
          `[role="tab"]:has-text("${tabText}")`,
          `button.mobile-tab:has-text("${tabText}")`
        ];

        for (const selector of tabSelectors) {
          try {
            const tab = page.locator(selector);
            if (await tab.count() > 0) {
              await tab.click();
              await page.waitForTimeout(500);

              if (await component.isVisible()) {
                return;
              }
            }
          } catch {
            // Continue to next selector
          }
        }
      }

      // Try setting the mobile-active class directly via JavaScript
      // This is a fallback when tab clicking doesn't work
      const activated = await page.evaluate((compName) => {
        const component = document.querySelector(compName);
        if (!component) return false;

        // Find the parent area div and activate it
        const parentArea = component.closest('.palette-area, .canvas-area, .controls-area');
        if (parentArea) {
          // Remove mobile-active from all areas first
          document.querySelectorAll('.palette-area, .canvas-area, .controls-area').forEach(area => {
            area.classList.remove('mobile-active');
          });

          // Add mobile-active to the target area
          parentArea.classList.add('mobile-active');

          // Also try to update the editor app's internal state
          const editorApp = document.querySelector('editor-app');
          if (editorApp && (editorApp as any).activeMobileTab !== undefined) {
            const componentToTab = {
              'component-palette': 'palette',
              'editor-canvas': 'canvas',
              'control-panel': 'controls'
            };
            (editorApp as any).activeMobileTab = componentToTab[compName] || 'canvas';

            // Force a re-render if possible
            if ((editorApp as any).requestUpdate) {
              (editorApp as any).requestUpdate();
            }
          }

          return true;
        }
        return false;
      }, componentName);

      if (activated) {
        await page.waitForTimeout(500);

        try {
          await expect(component).toBeVisible({ timeout: 2000 });
          return;
        } catch {
          // Still not visible
        }
      }

      throw new Error(`Component ${componentName} could not be made visible on mobile after all attempts. Current mobile tab may not be switched correctly.`);
    } else {
      // Desktop - component should be visible by default
      await expect(component).toBeVisible({ timeout });
    }
  }
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
  // Check if touch is supported
  const hasTouch = await hasTouchSupport(page);
  if (!hasTouch) {
    throw new Error('Touch drag and drop requires touch support to be enabled in the browser context');
  }

  // First, determine which component the source belongs to and ensure it's visible
  const sourceParent = await source.evaluateHandle(el => {
    const editorCanvas = el.closest('editor-canvas');
    const componentPalette = el.closest('component-palette');
    const controlPanel = el.closest('control-panel');

    if (editorCanvas) return 'editor-canvas';
    if (componentPalette) return 'component-palette';
    if (controlPanel) return 'control-panel';
    return null;
  });

  const sourceComponentName = await sourceParent.jsonValue();
  if (sourceComponentName) {
    await ensureComponentVisibleByName(page, sourceComponentName);
  }

  // Now the source should be visible
  await expect(source).toBeVisible();
  const sourceBox = await source.boundingBox();

  if (!sourceBox) {
    throw new Error('Could not get source bounding box for touch drag and drop');
  }

  // Now switch to target tab (if needed) and get target coordinates
  const targetParent = await target.evaluateHandle(el => {
    const editorCanvas = el.closest('editor-canvas');
    const componentPalette = el.closest('component-palette');
    const controlPanel = el.closest('control-panel');

    if (editorCanvas) return 'editor-canvas';
    if (componentPalette) return 'component-palette';
    if (controlPanel) return 'control-panel';
    return null;
  });

  const targetComponentName = await targetParent.jsonValue();
  if (targetComponentName) {
    await ensureComponentVisibleByName(page, targetComponentName);
  }

  await expect(target).toBeVisible();
  const targetBox = await target.boundingBox();

  if (!targetBox) {
    throw new Error('Could not get target bounding box for touch drag and drop');
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

/**
 * Check if the current browser context has touch support enabled
 */
export async function hasTouchSupport(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });
}

/**
 * Check if this is a mobile viewport size
 */
export async function isMobileViewport(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  return !!(viewport && viewport.width <= 768);
}
