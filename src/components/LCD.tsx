import React from "react";
import styles from "./LCD.module.css";

interface LCDProps {
  children: React.ReactNode;
}

const LCD: React.FC<LCDProps> = ({ children }) => {
  return <div className={styles.lcd}>{children}</div>;
};

export default LCD;
