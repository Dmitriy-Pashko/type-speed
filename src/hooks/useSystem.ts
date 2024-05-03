import { useCallback, useState } from "react";

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

  const [wordContainerFocused, setWordContainerFocused] = useState(false);

  const { countdown, resetCountdown, startCountdown, time } = useCountdown();
  const { word, updateWord, totalWord } = useWord(30);
  const {
    charTyped,
    typingState,
    cursorPosition,
    totalCharacterTyped,
    resetCharTyped,
    resetCursorPointer,
    setTotalCharacterTyped,
    setTypingState,
  } = useKeyDown(wordContainerFocused);
  const { modalIsOpen, aboutModal, openModal, closeModal } = useModal();

  // Start from here
  const restartTest = useCallback(() => {
    resetCountdown();
    updateWord(true);
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
    cursorPosition,
    modalIsOpen,
    aboutModal,
    results,
    history,
    word,
    wordContainerFocused,
    setWordContainerFocused,
    resetCountdown,
    updateWord,
    restartTest,
    checkCharacter,
    closeModal,
    openModal,
  };
};
