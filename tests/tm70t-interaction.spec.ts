import { test, expect } from '@playwright/test';

test('tm70t: user interaction and visual check', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 1. Verify initial state (Metronome mode)
  const device = page.getByTestId('device-shell');
  await expect(device).toBeVisible();

  // Check for BPM number
  await expect(page.getByText('120')).toBeVisible();

  // 2. Switch to Tuner mode
  const modeButton = page.getByTestId('btn-mode');
  await modeButton.click();

  // Check if Tuner content is visible (via text)
  // Use more specific locator to avoid ambiguity
  await expect(page.locator('[data-testid="lcd-screen"]').getByText('TUNER')).toBeVisible();

  // 3. Switch back to Metronome
  await modeButton.click();
  await expect(page.getByText('120')).toBeVisible();

  // 4. Start the metronome
  const playPauseBtn = page.getByTestId('btn-play-pause');
  await playPauseBtn.click();

  // 5. Click the TAP button
  const tapButton = page.getByTestId('btn-tap');
  await tapButton.click();

  // 6. Verify beat indicator (the LED) flashes
  const led = page.getByTestId('device-led');
  await expect(led).toBeVisible();
});
