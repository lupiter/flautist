import { describe, it, expect } from "vitest";
import { getNoteFromFrequency, notesToFrequency } from "./tuner";

describe("tuner math", () => {
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
  });

  describe("notesToFrequency", () => {
    it("returns 440 for A4", () => {
      const freq = notesToFrequency("A", 4, "C");
      expect(freq).toBeCloseTo(440, 1);
    });

    it("returns ~261.63 for C4", () => {
      const freq = notesToFrequency("C", 4, "C");
      expect(freq).toBeCloseTo(261.63, 1);
    });

    it("returns ~329.63 for E4", () => {
      const freq = notesToFrequency("E", 4, "C");
      expect(freq).toBeCloseTo(329.63, 1);
    });

    it("returns ~523.25 for C5", () => {
      const freq = notesToFrequency("C", 5, "C");
      expect(freq).toBeCloseTo(523.25, 1);
    });

    it("returns ~220 for A3", () => {
      const freq = notesToFrequency("A", 3, "C");
      expect(freq).toBeCloseTo(220, 1);
    });

    it("handles transposition correctly", () => {
      // A4 (440Hz) transposed by C# (1 step) should be Bb (index 10)
      // A#4 = 440 * 2^(1/12) approx 466.16
      const freq = notesToFrequency("A", 4, "C♯");
      expect(freq).toBeCloseTo(466.16, 1);
    });

    it("checks consistency across octaves", () => {
        // C4 -> C5 should be exactly double
        const c4 = notesToFrequency("C", 4, "C");
        const c5 = notesToFrequency("C", 5, "C");
        expect(c5).toBeCloseTo(c4 * 2, 1);

        // A3 -> A4 should be exactly double
        const a3 = notesToFrequency("A", 3, "C");
        const a4 = notesToFrequency("A", 4, "C");
        expect(a4).toBeCloseTo(a3 * 2, 1);
    });
  });
});
