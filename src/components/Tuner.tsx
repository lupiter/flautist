import React from "react";
import { type Note } from "../hooks/tuner";
import styles from "./Tuner.module.css";

interface TunerProps {
  note?: Note;
  cents?: number;
  frequency?: number;
  volume?: number;
}

const Tuner: React.FC<TunerProps> = ({ note, cents, frequency, volume }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.modeLabel}>Tuner</div>
        <div className={styles.pitchLabel}>{frequency} Hz</div>
      </div>

      <div className={styles.mainDisplay}>
        <div className={styles.note}>{note || "--"}</div>
        <div className={styles.volumeMeterContainer}>
          <div
            className={styles.volumeMeterBar}
            style={{ width: `${Math.min(100, (volume || 0) / 2.55)}%` }}
          />
        </div>
      </div>

      <div className={styles.gaugeContainer}>
        <div className={styles.linearGaugeTrack}>
          <div className={styles.centerMarker} />
          <div
            className={styles.indicator}
            style={{ left: `${Math.max(-50, Math.min(50, cents || 0)) + 50}%` }}
          />
        </div>
        <div className={styles.gaugeLabels}>
          <span>-50</span>
          <span>0</span>
          <span>+50</span>
        </div>
      </div>
    </div>
  );
};

export default Tuner;
