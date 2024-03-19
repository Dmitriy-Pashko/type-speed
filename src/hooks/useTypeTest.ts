import { useCallback, useState } from "react";

import { useCountdown } from "./useCountdown";
import { useKeyDown } from "./useKeyDown";
import { useLocalStorage } from "./useLocalStorage";
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

  const { getLocalStorageValue } = useLocalStorage();
  const [time, setTime] = useState(() => getLocalStorageValue("time") || 15000);
  const { countdown, resetCountdown, startCountdown } = useCountdown(time);
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

  // Needed
  const { openModal } = useModal();

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

  //TODO This is strange check it once more
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
    results,
    time,
    history,
    word,
    wordContainerFocused,
    setWordContainerFocused,
    setTime,
    restartTest,
    checkCharacter,
  };
};
