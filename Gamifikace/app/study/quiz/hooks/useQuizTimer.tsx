import { useEffect, useState } from "react";

export function useQuizTimer(running: boolean, is_challange: string) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (running && is_challange === "true") {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, is_challange]);

  return { seconds, setSeconds };
}
