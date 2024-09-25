import React, { useState, useEffect } from 'react';
import './Modal.css'; // فایل استایل برای مودال
import { YouTube, Telegram, Instageram, dollarCoin} from '../images'; // وارد کردن تصاویر مورد نیاز

const Modal: React.FC<{ onClose: () => void; onReward: (coins: number) => void; points: number }> = ({ onClose, onReward, points }) => {
  const [clickedLinks, setClickedLinks] = useState<{ [key: string]: boolean }>({
    link1: false,
    link2: false,
    link3: false
  });

  const [timers, setTimers] = useState<{ [key: string]: number }>({
    link1: 0,
    link2: 0,
    link3: 0
  });

  const rewards: { [key: string]: number } = {
    link1: 1000, 
    link2: 1500, 
    link3: 2000
  };

  const checkIfClickable = (linkKey: string) => {
    const lastClick = localStorage.getItem(linkKey);
    if (lastClick) {
      const lastClickDate = new Date(JSON.parse(lastClick));
      const now = new Date();
      return now.getTime() - lastClickDate.getTime() > 24 * 60 * 60 * 1000; // 24 ساعت
    }
    return true;
  };

  const handleClick = (linkKey: string) => {
    if (checkIfClickable(linkKey)) {
      const now = new Date();
      localStorage.setItem(linkKey, JSON.stringify(now));
      setClickedLinks((prev) => ({ ...prev, [linkKey]: true }));
      setTimers((prev) => ({ ...prev, [linkKey]: 24 * 60 * 60 })); // تنظیم تایمر 24 ساعته
      onReward(rewards[linkKey]); 
    }
  };

  const calculateTimeLeft = (linkKey: string) => {
    const lastClick = localStorage.getItem(linkKey);
    if (lastClick) {
      const lastClickDate = new Date(JSON.parse(lastClick));
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastClickDate.getTime()) / 1000);
      return Math.max(24 * 60 * 60 - diffInSeconds, 0);
    }
    return 0;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers({
        link1: calculateTimeLeft('link1'),
        link2: calculateTimeLeft('link2'),
        link3: calculateTimeLeft('link3')
      });
    }, 1000); // هر ثانیه تایمر به روز می‌شود

    return () => clearInterval(interval); // پاک کردن تایمر برای جلوگیری از حافظه‌های غیر ضروری
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };
  
  return (
    <div className="modal-backdrop">
      <div className="bg-[#1d2025] p-6 w-full h-full relative">
      <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img style={{ width: '25px', height: '25px' }} src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p style={{ fontSize: '22px' }} className="text-4xl text-white">{points.toLocaleString()}</p>
              </div>
            </div>
        <h2 className="modal-title text-[#fff]">Daily Tasks</h2>
        <div className="modal-links">
          <p>Complete the tasks</p>
          <div className="reward-box bg-[#272a2f]">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!checkIfClickable('link1')) {
                  e.preventDefault(); 
                } else {
                  handleClick('link1');
                }
              }}
              className={`reward-link ${clickedLinks.link1 ? 'disabled' : ''}`}
            >
              <img src={YouTube} alt="YouTube" className="reward-icon" />
              <p className="mr-8">YouTube</p>
              <h1 style={{ fontSize: '14px' }} className="text-[#ffe600]">1.000 Coin</h1>
            </a>
            {timers.link1 > 0 && (
              <p style={{ fontSize: '10px' }}className="timer-text">{formatTime(timers.link1)}</p>
            )}
          </div>
          <div className="reward-box bg-[#272a2f]">
            <a
              href="https://www.telegram.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!checkIfClickable('link2')) {
                  e.preventDefault();
                } else {
                  handleClick('link2');
                }
              }}
              className={`reward-link ${clickedLinks.link2 ? 'disabled' : ''}`}
            >
              <img src={Telegram} alt="Telegram" className="reward-icon" />
              <p className="mr-7">Telegram</p>
              <h1 style={{ fontSize: '14px' }} className="text-[#ffe600]">1.500 Coin</h1>
            </a>
            {timers.link2 > 0 && (
              <p style={{ fontSize: '10px' }}className="timer-text">{formatTime(timers.link2)}</p>
            )}
          </div>
          <div className="reward-box bg-[#272a2f]">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!checkIfClickable('link3')) {
                  e.preventDefault();
                } else {
                  handleClick('link3');
                }
              }}
              className={`reward-link ${clickedLinks.link3 ? 'disabled' : ''}`}
            >
              <img src={Instageram} alt="Instagram" className="reward-icon" />
              <p className="mr-5">Instagram</p>
              <h1 style={{ fontSize: '14px' }} className="text-[#ffe600]">2.000 Coin</h1>
            </a>
            {timers.link3 > 0 && (
              <p style={{ fontSize: '10px' }}className="timer-text">{formatTime(timers.link3)}</p>
            )}
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
