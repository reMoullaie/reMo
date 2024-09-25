import React, { useState, useEffect } from "react";
import "./Battery.css";

interface BatteryProps {
  resetTime: number; // زمان در ثانیه برای ریست
}

const Battery: React.FC<BatteryProps> = ({ resetTime }) => {
  const [timeLeft, setTimeLeft] = useState(resetTime);
  const [batteryWidth, setBatteryWidth] = useState(100); // فرض می‌کنیم که نوار به‌طور کامل پر است

  useEffect(() => {
    if (timeLeft <= 0) return; // اگر زمان تمام شده باشد، تایمر را متوقف کن

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
      setBatteryWidth((timeLeft - 1) / resetTime * 100); // به‌روزرسانی عرض نوار پیشرفت
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, resetTime]);

  return (
    <div className="battery-container">
      <div className={`battery`}>
        <div
          className={`battery-fill ${timeLeft <= 0 ? 'battery-full' : ''}`}
          style={{ width: `${batteryWidth}%` }}
        />
        <div className="battery-text">
          {timeLeft <= 0 ? 'Ready!' : `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
        </div>
      </div>
    </div>
  );
};

export default Battery;
