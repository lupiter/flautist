import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Audio API because it's not available in jsdom
class MockAudioContext {
  state: 'running' | 'suspended' | 'closed' = 'running';
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
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createGain() {
    return {
      connect: vi.fn(),
      gain: { value: 1 },
    };
  }

  createAnalyser() {
    return {
      connect: vi.fn(),
      frequencyBinCount: 1024,
      getByteFrequencyData: vi.fn(),
    };
  }
}

(window as any).AudioContext = MockAudioContext;
(window as any).webkitAudioContext = MockAudioContext;
