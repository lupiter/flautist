import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudio } from '../context/useAudio';

interface MetronomeOptions {
  bpm: number;
  totalBeats: number;
  silent?: boolean;
}

export const useMetronome = (options: MetronomeOptions) => {
  const { audioContext, resume } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const lookahead = 25.0; // How frequently to call scheduling function (in ms)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (in seconds)

  const schedulerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const currentBeatRef = useRef<number>(0);

  const scheduleNote = useCallback((time: number, beat: number) => {
    // Even if silent, we want to update the beat state for the lights
    setTimeout(() => {
      setCurrentBeat(beat);
    }, (time - audioContext!.currentTime) * 1000);

    if (options.silent || !audioContext) return;

    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    osc.connect(envelope);
    envelope.connect(audioContext.destination);

    osc.frequency.value = beat === 1 ? 880 : 440; // Higher pitch for first beat
    osc.type = 'sine';

    envelope.gain.setValueAtTime(1, time);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.start(time);
    osc.stop(time + 0.1);
  }, [audioContext, options.silent]);

  const scheduler = useCallback(() => {
    while (nextNoteTimeRef.current < audioContext!.currentTime + scheduleAheadTime) {
      const beat = (currentBeatRef.current % options.totalBeats) + 1;
      scheduleNote(nextNoteTimeRef.current, beat);

      const secondsPerBeat = 60.0 / options.bpm;
      nextNoteTimeRef.current += secondsPerBeat;
      currentBeatRef.current += 1;
    }
  }, [audioContext, options, scheduleNote]);

  const start = useCallback(async () => {
    if (!audioContext) return;

    await resume();

    setIsPlaying(true);
    currentBeatRef.current = 0;
    nextNoteTimeRef.current = audioContext.currentTime + 0.05;

    schedulerRef.current = setInterval(scheduler, lookahead);
  }, [audioContext, resume, scheduler]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (schedulerRef.current) {
      clearInterval(schedulerRef.current);
    }
    currentBeatRef.current = 0;
    setCurrentBeat(0);
  }, []);

  useEffect(() => {
    return () => {
      if (schedulerRef.current) clearInterval(schedulerRef.current);
    };
  }, []);

  return {
    isPlaying,
    start,
    stop,
    currentBeat,
  };
};
