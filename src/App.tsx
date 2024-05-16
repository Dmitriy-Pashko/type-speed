import Header from "./components/Header";
import Footer from "./components/Footer";
import TimeCategory from "./components/TimeCategory";
import Countdown from "./components/Countdown";
import WordWrapper from "./components/WordWrapper";
import WordContainer from "./components/WordContainer";
import UserTyped from "./components/UserTyped";

import { useThemeContext } from "./hooks/useTheme";
import { useCountdown } from "./hooks/useCountdown";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSystem } from "./hooks/useSystem";
import { useCursorPosition } from "./hooks/useCursorPosition";
import { useWord } from "./hooks/useWord";

function App() {
  const { systemTheme } = useThemeContext();

  const { setLocalStorageValue } = useLocalStorage();
  const { time, setTime } = useCountdown();
  const { restartTest } = useSystem();
  const { countdown, resetCountdown } = useCountdown();
  const { wordContainerFocused, setWordContainerFocused } = useCursorPosition();
  // hardcoded number and maybe bad naming
  const { word } = useWord(30);
  // console.log(systemTheme);

  return (
    // Make with styled components
    <div
      className="h-screen w-full overflow-y-auto"
      style={{
        backgroundColor: systemTheme?.background.primary,
        color: systemTheme?.text.primary,
      }}
    >
      <main
        className=" mx-auto flex h-full max-w-5xl flex-col gap-4 px-4 xl:px-0"
        style={{}}
      >
        <Header />
        <TimeCategory
          time={time}
          setLocalStorage={setLocalStorageValue}
          setTime={setTime}
          restart={restartTest}
        />
        <Countdown countdown={countdown} reset={resetCountdown} />
        <WordWrapper
          focused={wordContainerFocused}
          setFocused={setWordContainerFocused}
        >
          <WordContainer word={word} />
          {/* Start from here */}
          <UserTyped word={word} check={checkCharacter} charTyped={charTyped} />
        </WordWrapper>
        {/* <Restart restart={restartTest} /> */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
