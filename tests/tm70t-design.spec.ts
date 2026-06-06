import { test, expect } from '@playwright/test';

test('tm70t: device and lcd structure', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check for the Device shell by looking for the main content
  const mainContent = page.getByRole('main');
  await expect(mainContent).toBeVisible();

  // Check for the LCD area by looking for the headings
  const tuner = page.getByRole('heading', { name: 'Tuner' });
  const metronome = page.getByRole('heading', { name: 'METRONOME' });
  await expect(tuner.or(metronome).first()).toBeVisible();

  // Check for the TAP button
  // const tapButton = page.getByRole('button', { name: 'TAP' });
  // await expect(tapButton).toBeVisible();
});

test('tm70t: metronome lights in lcd', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // The metronome should be visible in the LCD
  const lights = page.getByRole('img', { name: 'metronome light' });
  const count = await lights.count();
  expect(count).toBeGreaterThan(0);
});
