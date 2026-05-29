export type Note =
  | "C"
  | "C♯"
  | "D"
  | "E♭"
  | "E"
  | "F"
  | "F♯"
  | "G"
  | "G♯"
  | "A"
  | "B♭"
  | "B";

export const NOTES: Note[] = [
  "C",
  "C♯",
  "D",
  "E♭",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "B♭",
  "B",
];

export const getNoteFromFrequency = (frequency: number, transpose: Note) => {
  const transposeIndex = NOTES.indexOf(transpose);
  const noteNum = 12 * Math.log2(frequency / 440) + 69;
  const roundedNote = Math.round(noteNum);
  const cents = Math.round((noteNum - roundedNote) * 100);
  const noteName = NOTES[(roundedNote + transposeIndex) % 12];
  const octave = Math.floor((roundedNote + transposeIndex) / 12) - 1;
  return { note: noteName, octave: octave, cents };
};

export const notesToFrequency = (
  note: Note,
  octave: number,
  transpose: Note,
): number => {
  const noteIndex = NOTES.indexOf(note);
  const transposeIndex = NOTES.indexOf(transpose);
  const midiNote = noteIndex + 12 * (octave + 1) + transposeIndex;
  return 440 * Math.pow(2, (midiNote - 69) / 12);
};
