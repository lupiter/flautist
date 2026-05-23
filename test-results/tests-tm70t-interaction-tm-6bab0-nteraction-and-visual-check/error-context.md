# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/tm70t-interaction.spec.ts >> tm70t: user interaction and visual check
- Location: tests/tm70t-interaction.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('device-shell')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('device-shell')

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('tm70t: user interaction and visual check', async ({ page }) => {
  4  |   await page.goto('http://localhost:5173');
  5  | 
  6  |   // 1. Verify initial state (Metronome mode)
  7  |   const device = page.getByTestId('device-shell');
> 8  |   await expect(device).toBeVisible();
     |                        ^ Error: expect(locator).toBeVisible() failed
  9  | 
  10 |   // Check for BPM number
  11 |   await expect(page.getByText('120')).toBeVisible();
  12 | 
  13 |   // 2. Switch to Tuner mode
  14 |   const modeButton = page.getByTestId('btn-mode');
  15 |   await modeButton.click();
  16 | 
  17 |   // Check if Tuner content is visible (via text)
  18 |   // Use more specific locator to avoid ambiguity
  19 |   await expect(page.locator('[data-testid="lcd-screen"]').getByText('TUNER')).toBeVisible();
  20 | 
  21 |   // 3. Switch back to Metronome
  22 |   await modeButton.click();
  23 |   await expect(page.getByText('120')).toBeVisible();
  24 | 
  25 |   // 4. Start the metronome
  26 |   const playPauseBtn = page.getByTestId('btn-play-pause');
  27 |   await playPauseBtn.click();
  28 | 
  29 |   // 5. Click the TAP button
  30 |   const tapButton = page.getByTestId('btn-tap');
  31 |   await tapButton.click();
  32 | 
  33 |   // 6. Verify beat indicator (the LED) flashes
  34 |   const led = page.getByTestId('device-led');
  35 |   await expect(led).toBeVisible();
  36 | });
  37 | 
```