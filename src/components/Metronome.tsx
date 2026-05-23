import React from 'react';
import styles from './Metronome.module.css';

interface MetronomeProps {
  bpm: number;
  ticks: number;
  isPlaying: boolean;
  currentBeat: number;
}

const Metronome: React.FC<MetronomeProps> = ({
  bpm,
  ticks,
  isPlaying,
  currentBeat
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.modeLabel}>METRONOME</span>
        <span className={styles.timeSignature}>J={ticks}</span>
      </div >

      <div className={styles.mainDisplay}>
        <div className={styles.bpm}>{bpm}</div >
      </div >

      <div className={styles.lightsContainer} data-testid="lights-container">
        {Array.from({ length: ticks }).map((_, i) => (
          <div
            key={i}
            data-testid="metronome-light"
            className={`${styles.light} ${
              isPlaying && currentBeat === i + 1
                ? styles.lightActive
                : ''
            }`}
          />
        ))}
      </div >
    </div >
  );
};

export default Metronome;
