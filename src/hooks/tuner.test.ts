import { describe, it, expect } from "vitest";
import { getNoteFromFrequency } from "./tuner";

describe("getNoteFromFrequency", () => {
  it("identifies A4 (440Hz) correctly", () => {
    const result = getNoteFromFrequency(440, "C");
    expect(result).toEqual({
      note: "A",
      octave: 4,
      cents: 0,
    });
  });

  it("identifies Middle C (C4) correctly", () => {
    const result = getNoteFromFrequency(261.6256, "C");
    expect(result.note).toBe("C");
    expect(result.octave).toBe(4);
    expect(Math.abs(result.cents)).toBeLessThan(1);
  });

  it("identifies E4 correctly", () => {
    const result = getNoteFromFrequency(329.6276, "C");
    expect(result.note).toBe("E");
    expect(result.octave).toBe(4);
  });

  it("handles transposition correctly", () => {
    // A4 (440Hz) transposed by C# (1 step) should be Bb (index 10)
    const result = getNoteFromFrequency(440, "C♯");
    expect(result.note).toBe("B♭");
    expect(result.octave).toBe(4);
  });

  it("handles cents correctly for slightly sharp notes", () => {
    // 440Hz + 40 cents
    // noteNum = 69 + 40/100 = 69.4
    const freq = 440 * Math.pow(2, 40 / 1200);
    const result = getNoteFromFrequency(freq, "C");
    expect(result.note).toBe("A");
    expect(result.cents).toBe(40);
  });

  it("handles cents correctly for slightly flat notes", () => {
    // 440Hz - 40 cents
    // noteNum = 69 - 40/100 = 68.6
    const freq = 440 * Math.pow(2, -40 / 1200);
    const result = getNoteFromFrequency(freq, "C");
    expect(result.note).toBe("A");
    expect(result.cents).toBe(-40);
  });

  it("handles very low frequencies", () => {
    const result = getNoteFromFrequency(20, "C");
    // 12 * log2(20/440) + 69 = 12 * (-4.459) + 69 = 15.49
    // roundedNote = 15
    // noteName = NOTES[15 % 12] = NOTES[3] = E♭
    // octave = floor(15/12) - 1 = 1 - 1 = 0
    expect(result.note).toBe("E♭");
    expect(result.octave).toBe(0);
  });

  it("handles very high frequencies", () => {
    const result = getNoteFromFrequency(4000, "C");
    // 12 * log2(4000/440) + 69 = 12 * (3.18) + 69 = 38.16 + 69 = 107.16
    // roundedNote = 107
    // noteName = NOTES[107 % 12] = NOTES[11] = B
    // octave = floor(107/12) - 1 = 8 - 1 = 7
    expect(result.note).toBe("B");
    expect(result.octave).toBe(7);
  });
});
