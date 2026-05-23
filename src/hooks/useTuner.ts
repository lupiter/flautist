import { useState, useEffect, useRef, useCallback } from "react";
import { useAudio } from "../context/useAudio";

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

interface TunerResult {
  frequency?: number;
  note?: Note;
  cents?: number;
  octave?: number;
}

export const useTunerOut = (frequency: number) => {
  const { audioContext, resume } = useAudio();
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(async () => {
    if (oscillatorRef.current && gainNodeRef.current && audioContext) {
      const osc = oscillatorRef.current;
      const gain = gainNodeRef.current;
      const now = audioContext.currentTime;

      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.stop(now + 0.1);

      oscillatorRef.current = null;
      gainNodeRef.current = null;
    }
    setIsPlaying(false);
  }, [audioContext]);

  const play = useCallback(async () => {
    if (frequency === null || !audioContext) return;

    await resume();

    if (oscillatorRef.current && gainNodeRef.current) {
      oscillatorRef.current.frequency.setTargetAtTime(
        frequency,
        audioContext.currentTime,
        0.03,
      );
      setIsPlaying(true);
      return;
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.5,
      audioContext.currentTime + 0.05,
    );

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();

    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    setIsPlaying(true);
  }, [audioContext, frequency, resume]);

  useEffect(() => {
    if (oscillatorRef.current && audioContext && frequency !== null) {
      oscillatorRef.current.frequency.setTargetAtTime(
        frequency,
        audioContext.currentTime,
        0.03,
      );
    }
  }, [frequency, audioContext]);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  return {
    isPlaying,
    play,
    stop,
  };
};

export const useTunerIn = ({ transpose }: { transpose: Note }) => {
  const { audioContext, resume } = useAudio();
  const [result, setResult] = useState<TunerResult>({});
  const [isListening, setIsListening] = useState(false);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const update = useCallback(() => {
    const getNoteFromFrequency = (frequency: number) => {
      const transposeIndex = NOTES.indexOf(transpose);
      const noteNum = 12 * Math.log2(frequency / 440) + 69;
      const roundedNote = Math.round(noteNum);
      const cents = Math.floor((noteNum - roundedNote) * 100);
      const noteName = NOTES[(roundedNote + transposeIndex) % 12];
      const octave = Math.floor((roundedNote + transposeIndex) / 12) - 1;
      return { note: noteName, octave: octave, cents };
    };

    if (!analyserRef.current || !audioContext) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Find peak frequency
    let maxVal = -1;
    let maxIndex = -1;
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxVal) {
        maxVal = dataArray[i];
        maxIndex = i;
      }
    }

    // Only process if the signal is strong enough
    if (maxVal > 200) {
      const nyquist = audioContext.sampleRate / 2;
      const frequency = (maxIndex * nyquist) / bufferLength;

      if (frequency > 20 && frequency < 2000) {
        const { note, cents, octave } = getNoteFromFrequency(frequency);
        setResult({ frequency, note, cents, octave });
      } else {
        setResult({});
      }
    } else {
      setResult({});
    }

    animationFrameRef.current = requestAnimationFrame(update);
  }, [audioContext, transpose]);

  const startListening = async () => {
    try {
      await resume();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext!.createMediaStreamSource(stream);
      const analyser = audioContext!.createAnalyser();
      analyser.fftSize = 2048;

      source.connect(analyser);
      // We don't connect to destination because we don't want to hear the mic feedback

      analyserRef.current = analyser;
      microphoneRef.current = source;
      setIsListening(true);
      animationFrameRef.current = requestAnimationFrame(update);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    setIsListening(false);
    setResult({});
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return {
    ...result,
    isListening,
    startListening,
    stopListening,
  };
};
