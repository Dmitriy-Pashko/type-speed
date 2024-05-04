import Header from "./components/Header";
import Footer from "./components/Footer";
import TimeCategory from "./components/TimeCategory";

import { useThemeContext } from "./hooks/useTheme";
import { useCountdown } from "./hooks/useCountdown";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSystem } from "./hooks/useSystem";

function App() {
  const { systemTheme } = useThemeContext();

  const { setLocalStorageValue } = useLocalStorage();
  const { time, setTime } = useCountdown();
  const { restartTest } = useSystem();
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
        {/* Start from here */}
        <Countdown countdown={countdown} reset={resetCountdown} />
        {/* <WordWrapper
          focused={wordContainerFocused}
          setFocused={setWordContainerFocused}
        >
          <WordContainer word={word} />
          <UserTyped word={word} check={checkCharacter} charTyped={charTyped} />
        </WordWrapper>
        <Restart restart={restartTest} /> */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
