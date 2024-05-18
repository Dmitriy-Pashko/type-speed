import { useCallback, useState } from "react";

import { useCursorPosition } from "./useCursorPosition";
import { useCountdown } from "./useCountdown";
import { useKeyDown } from "./useKeyDown";
import { useModal } from "./useModal";
import { useWord } from "./useWord";

import {
  calculateAccuracy,
  calculateErrorPercentage,
  calculateWPM,
} from "../utils";

import type { Results } from "../types";
import type { HistoryType } from "../types";

export const useSystem = () => {
  const [results, setResults] = useState<Results>({
    accuracy: 0,
    wpm: 0,
    cpm: 0,
    error: 0,
  });

  const [history, setHistory] = useState<HistoryType>({
    wordHistory: "",
    typedHistory: "",
  });

  const { countdown, resetCountdown, startCountdown, time } = useCountdown();
  const { word, updateWord, totalWord } = useWord(30);
  const { resetCursorPointer, wordContainerFocused } = useCursorPosition();
  const {
    charTyped,
    typingState,
    totalCharacterTyped,
    resetCharTyped,
    setTotalCharacterTyped,
    setTypingState,
  } = useKeyDown(wordContainerFocused);
  const { openModal } = useModal();

  const restartTest = useCallback(() => {
    resetCountdown();
    // Seems like a bad naming
    updateWord(true);
    // How this work in depth
    resetCursorPointer();
    resetCharTyped();
    setTypingState("idle");
    setTotalCharacterTyped("");
  }, [
    resetCountdown,
    updateWord,
    resetCursorPointer,
    resetCharTyped,
    setTypingState,
    setTotalCharacterTyped,
  ]);

  const checkCharacter = useCallback(
    (index: number) => {
      if (charTyped[index] === word[index]) {
        return true;
      } else {
        return false;
      }
    },
    [charTyped, word]
  );

  if (word.length === charTyped.length) {
    updateWord();
    resetCharTyped();
    resetCursorPointer();
  }

  if (typingState === "start") {
    startCountdown();
    setTypingState("typing");
  }

  if (countdown === 0) {
    const { accuracy } = calculateAccuracy(totalWord, totalCharacterTyped);
    const { wpm, cpm } = calculateWPM(totalCharacterTyped, accuracy, time);
    const error = calculateErrorPercentage(accuracy);

    setResults({
      accuracy,
      wpm,
      cpm,
      error,
    });

    setHistory({
      wordHistory: totalWord,
      typedHistory: totalCharacterTyped,
    });

    openModal("result");
    restartTest();
  }

  return {
    charTyped,
    countdown,
    results,
    history,
    word,
    restartTest,
    checkCharacter,
  };
};
