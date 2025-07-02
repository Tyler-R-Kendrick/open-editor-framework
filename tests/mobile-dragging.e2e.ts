import { expect, test } from '@playwright/test';

test.describe('Mobile Canvas Dragging', () => {
  test('should drag components on mobile devices', async ({ page }) => {
    // Set mobile viewport to simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to the editor app
    await page.goto('/');

    // Wait for the canvas to load
    await page.waitForSelector('[aria-label="Interactive design canvas"]');

    // Add a component to the canvas (this would depend on your UI)
    // For now, we'll assume a component is already present or can be added programmatically

    // Find a draggable component overlay
    const overlay = page.locator('[aria-hidden="true"]').first();
    await expect(overlay).toBeVisible();

    // Get initial position
    const initialBox = await overlay.boundingBox();

    // Perform touch drag gesture
    await overlay.dispatchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 }]
    });
    await page.waitForTimeout(50); // Small delay to simulate realistic interaction

    await overlay.dispatchEvent('touchmove', {
      touches: [{ clientX: 200, clientY: 150 }]
    });
    await page.waitForTimeout(50);

    await overlay.dispatchEvent('touchend', {});

    // Get final position
    const finalBox = await overlay.boundingBox();

    // Verify that the component moved
    expect(finalBox?.x).not.toBe(initialBox?.x);
    expect(finalBox?.y).not.toBe(initialBox?.y);
  });

  test('should not interfere with pinch-to-zoom', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.waitForSelector('[aria-label="Interactive design canvas"]');
    const canvas = page.locator('[aria-label="Interactive design canvas"]');

    // Simulate pinch gesture (two finger touch)
    await canvas.dispatchEvent('touchstart', {
      touches: [
        { clientX: 100, clientY: 100 },
        { clientX: 200, clientY: 200 }
      ]
    });

    await canvas.dispatchEvent('touchmove', {
      touches: [
        { clientX: 80, clientY: 80 },
        { clientX: 220, clientY: 220 }
      ]
    });

    await canvas.dispatchEvent('touchend', {});

    // Should not crash or cause errors
    await expect(canvas).toBeVisible();
  });

  test('should work on different mobile device sizes', async ({ page }) => {
    const devices = [
      { width: 360, height: 640, name: 'Small phone' },
      { width: 414, height: 896, name: 'Large phone' },
      { width: 768, height: 1024, name: 'Tablet' }
    ];

    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('/');

      await page.waitForSelector('[aria-label="Interactive design canvas"]');

      // Test that touch events work on this device size
      const overlay = page.locator('[aria-hidden="true"]').first();
      if (await overlay.isVisible()) {
        const initialBox = await overlay.boundingBox();

        await overlay.dispatchEvent('touchstart', {
          touches: [{ clientX: 50, clientY: 50 }]
        });
        await overlay.dispatchEvent('touchmove', {
          touches: [{ clientX: 100, clientY: 100 }]
        });
        await overlay.dispatchEvent('touchend', {});

        const finalBox = await overlay.boundingBox();

        // Verify movement worked on this device size
        expect(finalBox?.x).not.toBe(initialBox?.x);
      }
    }
  });
});