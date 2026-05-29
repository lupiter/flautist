import React from "react";
import { type Note } from "../hooks/tuner";
import styles from "./Tuner.module.css";

interface TunerProps {
  note?: Note;
  cents?: number;
  frequency?: number;
  isListening: boolean;
  volume?: number;
}

const Tuner: React.FC<TunerProps> = ({
  note,
  cents,
  frequency,
  isListening,
  volume,
}) => {
  // Centered at 0, range -50 to +50
  // -50 cents -> -90 degrees
  // +50 cents -> 90 degrees
  const needleRotation = (cents || 0) * 1.8;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.modeLabel}>
          Tuner {isListening ? "• Listening" : ""}
        </div>
        <div className={styles.pitchLabel}>{frequency} Hz</div>
      </div>

      <div className={styles.mainDisplay}>
        <div className={styles.note}>{note || "--"}</div>
        {isListening && (
          <div className={styles.volumeMeterContainer}>
            <div
              className={styles.volumeMeterBar}
              style={{ width: `${Math.min(100, (volume || 0) / 2.55)}%` }}
            />
          </div>
        )}
      </div>

      <div className={styles.gaugeContainer}>
        <svg className={styles.gaugeSvg} viewBox="0 0 100 50">
          {/* Gauge Arc */}
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="2"
          />
          {/* Center Mark */}
          <line
            x1="50"
            y1="45"
            x2="50"
            y2="40"
            stroke="rgba(0, 0, 0, 0.4)"
            strokeWidth="1"
          />

          {/* Needle */}
          <g transform={`rotate(${needleRotation}, 50, 45)`}>
            <line
              x1="50"
              y1="45"
              x2="50"
              y2="10"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="45" r="2" fill="#000" />
          </g>
        </svg>
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
