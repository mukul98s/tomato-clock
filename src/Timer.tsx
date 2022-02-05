import React, { useState, useEffect } from "react";
import Duration from "./Duration";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaStopCircle } from "react-icons/fa";
import { IoReloadCircleSharp } from "react-icons/io5";
import { motion } from "framer-motion";

const dummyTimer = setInterval(() => {});

const Timer: React.FC = () => {
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const [onBreak, setOnBreak] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<number>(25 * 60);
  const [timer, setTimer] = useState<NodeJS.Timer>(dummyTimer);
  const [sessionDuration, setSessionDuration] = useState<number>(25 * 60);
  const [breakDuration, setBreakDuration] = useState<number>(5 * 60);

  const formatTime = (time: number) => {
    return time < 10 ? "0" + time : time;
  };

  const showTime = (displayTime: number) => {
    let min = Math.floor(displayTime / 60);
    let sec = displayTime % 60;
    return formatTime(min) + ":" + formatTime(sec);
  };

  const stop = () => {
    clearInterval(timer);
    setTimerOn(false);
  };

  useEffect(() => {
    let interval = setInterval(() => {
      if (timerOn) {
        setDisplayTime((prev) => {
          if (prev <= 0 && !onBreak) {
            setOnBreak(true);
            return breakDuration;
          }
          if (prev <= 0 && onBreak) {
            setOnBreak(false);
            return sessionDuration;
          }
          return prev - 1;
        });
      }
    }, 1000);
    setTimer(interval);

    return () => clearInterval(interval);
  }, [breakDuration, onBreak, sessionDuration, timerOn]);

  const start = () => {
    stop();
    setTimerOn(true);
  };

  const reset = () => {
    setDisplayTime(25 * 60);
    clearInterval(timer);
    setTimerOn(false);
    setSessionDuration(25 * 60);
    setBreakDuration(5 * 60);
  };

  const changeTime = (amount: number, type: string) => {
    if (type === "break") {
      if (breakDuration <= 60 && amount < 0) {
        return;
      }
      setBreakDuration((prev) => (prev += amount));
    } else {
      if (sessionDuration <= 60 && amount < 0) {
        return;
      }
      setSessionDuration((prev) => (prev += amount));
      if (!timerOn) {
        setDisplayTime(sessionDuration + amount);
      }
    }
  };

  return (
    <div className="container">
      {!timerOn && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.7 }}
          className="duration"
        >
          <Duration
            title="Duration"
            type="timer"
            time={sessionDuration}
            changeTime={changeTime}
          />
          <Duration
            title="Break"
            type="break"
            time={breakDuration}
            changeTime={changeTime}
          />
        </motion.div>
      )}
      <motion.div
        initial={{ y: 1000, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          bounce: 5,
        }}
        className="clock"
      >
        <h1 className="time">{showTime(displayTime)}</h1>
      </motion.div>

      <div className="button-group">
        {!timerOn ? (
          <motion.button
            initial={{ x: -1000, scale: 3 }}
            animate={{ x: 0, scale: 1 }}
            onClick={start}
            disabled={timerOn}
          >
            <AiFillPlayCircle /> Start
          </motion.button>
        ) : (
          <motion.button
            initial={{ x: -1000, scale: 3 }}
            animate={{ x: 0, scale: 1 }}
            onClick={stop}
          >
            <FaStopCircle /> Stop
          </motion.button>
        )}
        <motion.button
          initial={{ x: 1000, scale: 3 }}
          animate={{ x: 0, scale: 1 }}
          onClick={reset}
          disabled={timerOn}
        >
          <IoReloadCircleSharp /> Reset
        </motion.button>
      </div>
    </div>
  );
};

export default Timer;
