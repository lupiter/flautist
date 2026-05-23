# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/smoke-test.spec.ts >> smoke test: Metronome component renders lights
- Location: tests/smoke-test.spec.ts:3:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByTestId('metronome-light')
Expected: 4
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByTestId('metronome-light')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('smoke test: Metronome component renders lights', async ({ page }) => {
  4  |   await page.goto('http://localhost:5173');
  5  | 
  6  |   // Check for the presence of light elements using testid
  7  |   const lights = page.getByTestId('metronome-light');
> 8  |   await expect(lights).toHaveCount(4);
     |                        ^ Error: expect(locator).toHaveCount(expected) failed
  9  |   await expect(lights.first()).toBeVisible();
  10 | });
  11 | 
```