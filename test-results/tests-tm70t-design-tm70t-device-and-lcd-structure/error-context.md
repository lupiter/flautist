# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/tm70t-design.spec.ts >> tm70t: device and lcd structure
- Location: tests/tm70t-design.spec.ts:3:1

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
  3  | test('tm70t: device and lcd structure', async ({ page }) => {
  4  |   await page.goto('http://localhost:5173');
  5  | 
  6  |   // Check for the Device shell
  7  |   const device = page.getByTestId('device-shell');
> 8  |   await expect(device).toBeVisible();
     |                        ^ Error: expect(locator).toBeVisible() failed
  9  | 
  10 |   // Check for the LCD area
  11 |   const lcdArea = page.getByTestId('lcd-area');
  12 |   await expect(lcdArea).toBeVisible();
  13 | 
  14 |   // Check for the LCD screen - at least one should be visible
  15 |   const lcdScreens = page.getByTestId('lcd-screen');
  16 |   await expect(lcdScreens.first()).toBeVisible();
  17 | 
  18 |   // Check for the TAP button
  19 |   const tapButton = page.getByTestId('btn-tap');
  20 |   await expect(tapButton).toBeVisible();
  21 | });
  22 | 
  23 | test('tm70t: metronome lights in lcd', async ({ page }) => {
  24 |   await page.goto('http://localhost:5173');
  25 | 
  26 |   // The metronome should be visible in the LCD
  27 |   const lights = page.getByTestId('metronome-light');
  28 |   const count = await lights.count();
  29 |   expect(count).toBeGreaterThan(0);
  30 | });
  31 | 
```