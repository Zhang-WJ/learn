import React, { createContext, useContext, useEffect, useState } from 'react';
import { Effect } from 'effect';

const DATE_BLOCK = 1_000;
const NUM_OF_CIRCLES = 20;
const RADIUS = 200;
const DEG_STEP = (2 * Math.PI) / NUM_OF_CIRCLES;
const MARGIN = RADIUS * 1.5;
const runningContext = createContext({ isRunning: false });
const REFRESH_RATE = 30;

const HeavyWork = () => {
  const [deg, setDeg] = useState(0);
  const running = useContext(runningContext);

  useEffect(() => {
    const updateDeg = () => {
      setDeg((_) => _ + 0.2);
    };
    const interval = setInterval(() => updateDeg(), REFRESH_RATE);

    updateDeg();

    if (!running.isRunning) {
      running.isRunning = true;
      Effect.unsafeFork(
        Effect.gen(function* ($) {
          yield* $(Effect.log('process started'));
          let counter = 0;

          for (let i = 0; i < 10_000_000; i++) {
            if (counter > 0 && counter % 100 === 0) {
              yield* $(Effect.log(`generated ${counter * DATE_BLOCK} dates`));
            }
            yield* $(
              Effect.blocking(
                Effect.sync(() => {
                  for (let i = 0; i < DATE_BLOCK; i++) {
                    new Date();
                  }
                }),
              ),
            );
            counter++;
          }
          yield* $(Effect.log('process completed'));
        }),
      );
    }
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative">
      {[...new Array(NUM_OF_CIRCLES).keys()].map((index) => (
        <Circle key={index} newDeg={deg + index * DEG_STEP} />
      ))}
    </div>
  );
};

export default HeavyWork;

const Circle: React.FC<{ newDeg: number }> = ({ newDeg }) => {
  for (let i = 0; i < DATE_BLOCK; i++) {
    new Date();
  }

  return (
    <div
      className="absolute h-8 w-8 rounded-full bg-red-600"
      style={{
        left: MARGIN + Math.sin(newDeg) * RADIUS,
        top: MARGIN + Math.cos(newDeg) * RADIUS,
      }}
    />
  );
};
