import { createContext, useContext } from "react";

export interface AudioContextType {
  audioContext: AudioContext;
  resume: () => Promise<void>;
  isSuspended: boolean;
}

export const AudioContextInternal = createContext<AudioContextType | undefined>(
  undefined,
);

export const useAudio = () => {
  const context = useContext(AudioContextInternal);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
