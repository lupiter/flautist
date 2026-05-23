import React, { useEffect, useState, useCallback } from "react";
import { AudioContextInternal } from "./useAudio";

const audioContext = new window.AudioContext();

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSuspended, setIsSuspended] = useState<boolean>(
    audioContext.state === "suspended",
  );

  // Monitor state changes
  useEffect(() => {
    if (!audioContext) return;

    const handleStateChange = () => {
      setIsSuspended(audioContext.state === "suspended");
    };

    audioContext.onstatechange = handleStateChange;
    return () => {
      audioContext.onstatechange = null;
    };
  }, []);

  const resume = useCallback(async () => {
    if (audioContext && audioContext.state === "suspended") {
      await audioContext.resume();
    }
  }, []);

  return (
    <AudioContextInternal.Provider
      value={{ audioContext, resume, isSuspended }}
    >
      {children}
    </AudioContextInternal.Provider>
  );
};
