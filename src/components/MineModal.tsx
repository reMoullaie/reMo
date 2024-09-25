import React, { useState, useEffect } from 'react';
import './Mine.modal.css'; // فایل استایل برای مودال

const RewardModal: React.FC<{ onClose: () => void; onReward: (coins: number) => void; points: number }> = ({ onClose, onReward, points }) => {
  const [rewardStep, setRewardStep] = useState<number>(1); // شمارنده پاداش‌ها
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(0); // زمان باقی‌مانده تا فعال شدن دکمه

  // لیست پاداش‌ها از 1000 تا 7000 به صورت صعودی
  const rewards = [1000, 2000, 3000, 4000, 5000, 6000, 7000];

  // بررسی زمان آخرین پاداش
  const checkLastRewardTime = () => {
    const lastRewardTime = localStorage.getItem('lastRewardTime');
    const now = new Date().getTime();

    if (lastRewardTime) {
      const lastRewardDate = new Date(JSON.parse(lastRewardTime)).getTime();
      const timeDifference = now - lastRewardDate;
      const secondsIn24Hours = 24 * 60 * 60 * 1000;

      if (timeDifference >= secondsIn24Hours) {
        setIsButtonDisabled(false);
        setTimeLeft(0); // تایمر صفر می‌شود
      } else {
        setIsButtonDisabled(true);
        setTimeLeft(secondsIn24Hours - timeDifference); // محاسبه زمان باقی‌مانده
      }
    } else {
      setIsButtonDisabled(false);
      setTimeLeft(0);
    }
  };

  // بررسی مرحله پاداش و ذخیره در localStorage
  const checkRewardStep = () => {
    const savedStep = localStorage.getItem('rewardStep');
    if (savedStep) {
      setRewardStep(parseInt(savedStep));
    }
  };

  // هندلر برای دریافت پاداش
  const handleClaimReward = () => {
    const now = new Date();
    localStorage.setItem('lastRewardTime', JSON.stringify(now));

    // ارسال پاداش فعلی
    onReward(rewards[rewardStep - 1]);

    // به روزرسانی مرحله پاداش
    const nextStep = rewardStep === 7 ? 1 : rewardStep + 1; // بعد از 7 به 1 برگردد
    setRewardStep(nextStep);
    localStorage.setItem('rewardStep', nextStep.toString());

    // غیرفعال کردن دکمه برای 24 ساعت
    setIsButtonDisabled(true);
    setTimeLeft(24 * 60 * 60 * 1000); // تنظیم تایمر 24 ساعته
  };

  // محاسبه زمان باقی‌مانده به صورت فرمت ساعتی
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // به روزرسانی تایمر هر ثانیه
  useEffect(() => {
    checkLastRewardTime();
    checkRewardStep();

    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1000);
      } else {
        setIsButtonDisabled(false); // دکمه فعال می‌شود
      }
    }, 1000); // به‌روزرسانی تایمر هر ثانیه

    return () => clearInterval(interval); // پاک کردن تایمر پس از بسته شدن مودال
  }, [timeLeft]);

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2 className="modal-title">Daily Reward</h2>
        <p className="modal-text">Claim your reward for today!</p>
        <p className="modal-text">Your current balance: {points.toLocaleString()} Coins</p>
        <button
          className="claim-btn"
          onClick={handleClaimReward}
          disabled={isButtonDisabled}
        >
          Claim Reward: {rewards[rewardStep - 1]} Coins
        </button>
        {isButtonDisabled && (
          <p className="modal-text">{formatTime(timeLeft)}</p>
        )}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RewardModal;
