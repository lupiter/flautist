import { test, expect } from '@playwright/test';

test('debug: metronome lights existence and style', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Find the lights container
  const lightsContainer = page.getByTestId('lights-container');
  await expect(lightsContainer).toBeVisible();

  // Check if there are any lights
  const lights = page.getByTestId('metronome-light');
  const count = await lights.count();
  console.log('Number of lights found:', count);

  // If lights are found, check their background color
  if (count > 0) {
    const bgColor = await lights.first().evaluate((el) => getComputedStyle(el).backgroundColor);
    console.log('First light background color:', bgColor);
  } else {
    throw new Error('No lights found in the DOM');
  }
});
