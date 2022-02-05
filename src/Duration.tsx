import React from "react";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";

interface Props {
  title: string;
  type: string;
  time: number;
  changeTime: (amount: number, type: string) => void;
}

const Duration: React.FC<Props> = ({ title, type, time, changeTime }) => {
  const toMintues = (seconds: number) => {
    return Math.floor(seconds / 60);
  };
  return (
    <div className="session">
      <h2>{title}</h2>
      <div className="change">
        <span onClick={() => changeTime(60, type)}>
          <BiUpArrow />
        </span>
        <h3 className="time">{toMintues(time)}</h3>
        <span onClick={() => changeTime(-60, type)}>
          <BiDownArrow />
        </span>
      </div>
    </div>
  );
};

export default Duration;
