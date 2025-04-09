import React, { useState, useEffect, useRef } from "react";
import "./index.css";

const timePresets = [
  { label: "30s", value: 30 },
  { label: "45s", value: 45 },
  { label: "90s", value: 90 },
  { label: "3min", value: 180 },
  { label: "15min", value: 900 },
];

const Timer = ({ label }) => {
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [running, setRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;
    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && running) {
      audioRef.current?.play();
      setRunning(false);
    }
    return () => clearInterval(interval);
  }, [running, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const setCustomTime = () => {
    const total = inputMinutes * 60 + inputSeconds;
    setTimeLeft(total);
    setInitialTime(total);
  };

  const setPresetTime = (value) => {
    setInputMinutes(Math.floor(value / 60));
    setInputSeconds(value % 60);
    setTimeLeft(value);
    setInitialTime(value);
    setRunning(false);
  };

  const resetTime = () => {
    setRunning(false);
    setTimeLeft(initialTime);
  };

  return (
    <div className="timer">
      <h2>{label}</h2>
      <div className="time-display">{formatTime(timeLeft)}</div>

      <div className="presets">
        {timePresets.map((p) => (
          <button key={p.label} onClick={() => setPresetTime(p.value)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="input-time">
        <input
          type="number"
          placeholder="min"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(+e.target.value)}
        />
        <input
          type="number"
          placeholder="sek"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(+e.target.value)}
        />
        <button onClick={setCustomTime}>Postavi</button>
      </div>

      <div className="controls">
        <button onClick={() => setRunning(true)} disabled={running || timeLeft === 0}>
          ▶ Start
        </button>
        <button onClick={() => setRunning(false)}>⏸ Pauza</button>
        <button onClick={resetTime}>🔄 Reset</button>
      </div>

      <audio ref={audioRef} src="/beep-08b.wav" />
    </div>
  );
};

export default function App() {
  return (
    <div className="app">
      <h1>Tajmeri</h1>
      <div className="timers">
        <Timer label="Tema" />
        <Timer label="Izlaganje" />
        <Timer label="Reč" />
        <Timer label="Replika" />
      </div>
    </div>
  );
}
