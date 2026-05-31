import { test, expect } from '@playwright/test';

test('smoke test: Metronome component renders lights', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check for the presence of light elements using accessibility role
  const lights = page.getByRole('img', { name: 'metronome light' });
  // The number of lights depends on the 'ticks' state, which defaults to 4 in App.tsx
  await expect(lights).toHaveCount(4);
  await expect(lights.first()).toBeVisible();
});
