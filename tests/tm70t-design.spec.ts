import { test, expect } from '@playwright/test';

test('tm70t: device and lcd structure', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check for the Device shell
  const device = page.getByTestId('device-shell');
  await expect(device).toBeVisible();

  // Check for the LCD area
  const lcdArea = page.getByTestId('lcd-area');
  await expect(lcdArea).toBeVisible();

  // Check for the LCD screen - at least one should be visible
  const lcdScreens = page.getByTestId('lcd-screen');
  await expect(lcdScreens.first()).toBeVisible();

  // Check for the TAP button
  const tapButton = page.getByTestId('btn-tap');
  await expect(tapButton).toBeVisible();
});

test('tm70t: metronome lights in lcd', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // The metronome should be visible in the LCD
  const lights = page.getByTestId('metronome-light');
  const count = await lights.count();
  expect(count).toBeGreaterThan(0);
});
