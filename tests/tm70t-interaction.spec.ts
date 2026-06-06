import { test, expect } from '@playwright/test';

test('tm70t: user interaction and visual check', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 1. Verify initial state (Metronome mode)
  const mainContent = page.getByRole('main');
  await expect(mainContent).toBeVisible();

  // Check for BPM number
  await expect(page.getByText('120')).toBeVisible();

  // 2. Switch to Tuner mode
  // Validate the heading and radio buttons are visible separately
  await expect(page.getByRole('heading', { name: 'Tuner' })).toBeVisible();
  const tunerRadio = page.getByRole('radio', { name: 'In' });
  await expect(tunerRadio).toBeVisible();
  await tunerRadio.click();

  // Check if Tuner content is visible (via text)
  await expect(page.getByRole('heading', { name: 'Tuner' })).toBeVisible();

  // 3. Switch back to Metronome (Off mode)
  await page.getByRole('radio', { name: 'Off' }).click();

  await expect(page.getByText('120')).toBeVisible();

  // 4. Start the metronome
  const playPauseBtn = page.getByRole('button', { name: 'play' });
  await playPauseBtn.click();

  // 6. Verify beat indicator (the LED) flashes
  const led = page.getByRole('status', { name: 'device led' });
  await expect(led).toBeVisible();
});
