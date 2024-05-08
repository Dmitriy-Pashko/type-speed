import { useEffect } from "react";

import { useThemeContext } from "../hooks/useTheme";

type CountdownProps = {
  countdown: number;
  reset: () => void;
};

const Countdown = ({ countdown, reset }: CountdownProps) => {
  useEffect(() => {
    reset();
  }, [reset]);

  const formatedCountdown = {
    minutes: new Date(countdown).getUTCMinutes(),
    seconds: new Date(countdown).getUTCSeconds(),
  };

  const { systemTheme } = useThemeContext();

  //   For commit
  return (
    <div className="flex justify-end">
      <div
        className=" rounded-lg p-3"
        style={{
          backgroundColor: systemTheme.background.secondary,
        }}
      >
        <span
          className="text-right font-mono text-lg lg:text-xl"
          style={{
            color: systemTheme.text.secondary,
          }}
        >
          {/* Do that with moment? */}
          {formatedCountdown.minutes < 10
            ? `0${formatedCountdown.minutes}`
            : formatedCountdown.minutes}
          :
          {formatedCountdown.seconds < 10
            ? `0${formatedCountdown.seconds}`
            : formatedCountdown.seconds}
        </span>
      </div>
    </div>
  );
};

export default Countdown;
