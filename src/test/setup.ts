import { vi } from 'vitest';

// Mock Web Audio API because it's not available in jsdom
class MockAudioContext {
  state: 'running' | 'suspended' | 'closed' | 'interrupted' = 'running';
  currentTime = 0;
  onstatechange: (() => void) | null = null;

  async resume() {
    this.state = 'running';
    if (this.onstatechange) this.onstatechange();
  }

  async close() {
    this.state = 'closed';
    if (this.onstatechange) this.onstatechange();
  }

  createOscillator() {
    return {
      connect: vi.fn().mockReturnValue({}),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createGain() {
    return {
      connect: vi.fn().mockReturnValue({}),
      gain: { value: 1 },
    };
  }

  createAnalyser() {
    return {
      connect: vi.fn().mockReturnValue({}),
      frequencyBinCount: 1024,
      getByteFrequencyData: vi.fn(),
    };
  }
}

interface CustomWindow extends Window {
  AudioContext: typeof MockAudioContext;
  webkitAudioContext: typeof MockAudioContext;
}

(window as unknown as CustomWindow).AudioContext = MockAudioContext;
(window as unknown as CustomWindow).webkitAudioContext = MockAudioContext;
