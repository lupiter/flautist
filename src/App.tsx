import { useState } from "react";
import { useAudio } from "./context/useAudio";
import Metronome from "./components/Metronome";
import Tuner from "./components/Tuner";
import { useMetronome } from "./hooks/useMetronome";
import {
  useTunerIn,
  useTunerOut,
  NOTES,
  type Note,
  notesToFrequency,
} from "./hooks/useTuner";
import styles from "./App.module.css";

type TunerMode = "off" | "in" | "out";

function App() {
  const { audioContext, resume, isSuspended } = useAudio();
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [note, setNote] = useState<Note>("C");
  const [octave, setOctave] = useState(5);
  const [bpm, setBpm] = useState(120);
  const [ticks, setTicks] = useState(4);
  const [transpose, setTranspose] = useState<Note>("C");
  const pitch = notesToFrequency(note, octave, transpose);
  const [tunerMode, setTunerMode] = useState("off");

  const { isPlaying, start, stop, currentBeat } = useMetronome({
    bpm,
    totalBeats: ticks,
    silent: false,
  });

  const { play: startTuner, stop: stopTuner } = useTunerOut(pitch);

  const targetMidiNote = 12 * Math.log2(pitch / 440) + 69;

  const {
    isListening,
    startListening,
    stopListening,
    note: inNote,
    cents,
    frequency,
    volume,
  } = useTunerIn({
    targetMidiNote,
  });

  const handleStartAudio = async () => {
    await resume();
    console.log("AudioContext state:", audioContext?.state);
  };

  const handleTunerModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as TunerMode;
    setTunerMode(value);
    if (value === "in") {
      startListening();
      stopTuner();
    } else if (value === "out") {
      stopListening();
      startTuner();
    } else {
      stopListening();
      stopTuner();
    }
  };

  const handleTogglePlayMetronome = () => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  };

  // const handleTap = () => {
  //   console.log("TAP pressed");
  // };

  const handleNote = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNote(e.target.value as Note);
  };

  const handleOctave = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOctave(parseInt(e.target.value));
  };

  const handleTranspose = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTranspose(e.target.value as Note);
  };

  const handleTempoUp = () => {
    setBpm((prev) => Math.min(prev + 1, 240));
  };

  const handleTempoDown = () => {
    setBpm((prev) => Math.max(prev - 1, 40));
  };

  const handleTicksUp = () => {
    setTicks((prev) => Math.min(prev + 1, 12));
  };

  const handleTicksDown = () => {
    setTicks((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.deviceBox}>
        <div className={styles.device} data-testid="device-shell">
          <div
            className={`${styles.led} ${isListening ? styles.ledActive : ""}`}
            data-testid="device-led"
          />

          <main className={styles.mainContent}>
            <div className={styles.lcd}>
              <Tuner
                note={inNote}
                cents={cents}
                frequency={frequency}
                isListening={isListening}
                volume={volume}
              />
              <Metronome
                bpm={bpm}
                ticks={ticks}
                isPlaying={isPlaying}
                currentBeat={currentBeat}
              />
            </div>
          </main>

          <div className={styles.mainLayout}>
            <div className={styles.leftButtons}>
              <div className={styles.buttonGroup}>
                <h6>Tuner</h6>
                <fieldset className={styles.threeStateToggle}>
                  <div>
                    <input
                      type="radio"
                      id="tunerOff"
                      name="off"
                      value="off"
                      checked={tunerMode === "off"}
                      onChange={handleTunerModeChange}
                    />
                    <label htmlFor="tunerOff">Off</label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      id="in"
                      name="in"
                      value="in"
                      checked={tunerMode === "in"}
                      onChange={handleTunerModeChange}
                    />
                    <label htmlFor="in">In</label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      id="out"
                      name="out"
                      value="out"
                      checked={tunerMode === "out"}
                      onChange={handleTunerModeChange}
                    />
                    <label htmlFor="out">Out</label>
                  </div>
                </fieldset>
              </div>
              <div className={styles.buttonGroup}>
                <label htmlFor="note" className={styles.buttonLabel}>
                  Note
                </label>
                <select
                  className={styles.button}
                  onChange={handleNote}
                  id="note"
                  value={note}
                >
                  {NOTES.map((note) => (
                    <option key={note} value={note}>
                      {note}
                    </option>
                  ))}
                </select>
                <label htmlFor="octave" className={styles.buttonLabel}>
                  Octave
                </label>
                <select
                  className={styles.button}
                  onChange={handleOctave}
                  id="octave"
                  value={octave}
                >
                  <option value={6}>6</option>
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                </select>
                <label htmlFor="transpose" className={styles.buttonLabel}>
                  Transpose
                </label>
                <select
                  className={styles.button}
                  onChange={handleTranspose}
                  id="transpose"
                  value={transpose}
                >
                  <option value="C">C</option>
                  <option value="F">F</option>
                  <option value="B♭">B♭</option>
                  <option value="E♭">E♭</option>
                </select>
              </div>
            </div>

            <div className={styles.rightButtons}>
              <div className={styles.buttonGroup}>
                <h6>Metronome</h6>
                <button
                  className={styles.playPauseButton}
                  onClick={handleTogglePlayMetronome}
                  id="play-pause"
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.arrowButton} onClick={handleTempoUp}>
                  ▲
                </button>
                <div className={styles.buttonLabel}>TEMPO</div>
                <button
                  className={styles.arrowButton}
                  onClick={handleTempoDown}
                >
                  ▼
                </button>
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.arrowButton} onClick={handleTicksUp}>
                  ▲
                </button>
                <div className={styles.buttonLabel}>TICKS</div>
                <button
                  className={styles.arrowButton}
                  onClick={handleTicksDown}
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*<button
          className={styles.tapButton}
          onClick={handleTap}
          data-testid="btn-tap"
        >
          TAP
        </button>*/}

        {isSuspended && (
          <div className={styles.audioControlArea}>
            <p className={styles.audioStatus}>Audio: Suspended</p>
            <button
              className={styles.enableAudioButton}
              onClick={handleStartAudio}
            >
              Enable Audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
