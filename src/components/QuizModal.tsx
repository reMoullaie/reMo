import React, { useState, useEffect } from 'react';
import './QuizModal.css'; // فایل استایل برای مودال
import {dollarCoin} from '../images'

const QuizModal: React.FC<{ onClose: () => void; onReward: (coins: number) => void; points: number }> = ({ onClose, onReward, points }) => {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnsweredToday, setIsAnsweredToday] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const correctAnswer = 'React'; // جواب صحیح سوال

  // تابعی برای بررسی اینکه آیا مودال امروز فعال شده است یا نه
  const checkIfActiveToday = () => {
    const lastAnswer = localStorage.getItem('quizAnswerDate');
    if (lastAnswer) {
      const lastAnswerDate = new Date(JSON.parse(lastAnswer));
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastAnswerDate.getTime()) / 1000);
      const secondsIn24Hours = 24 * 60 * 60;
      return diffInSeconds < secondsIn24Hours; // بررسی اینکه 24 ساعت گذشته یا نه
    }
    return false;
  };

  // تابعی برای مدیریت ارسال جواب
  const handleSubmit = () => {
    if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setIsCorrect(true);
      onReward(200); // اضافه کردن 200 سکه به امتیاز کاربر
      localStorage.setItem('quizAnswerDate', JSON.stringify(new Date()));
      setIsSubmitDisabled(true);
      setTimeLeft(24 * 60 * 60); // تنظیم تایمر 24 ساعته
    } else {
      setIsCorrect(false);
    }
  };

  // محاسبه زمان باقی‌مانده تا دوباره فعال شدن آزمون
  const calculateTimeLeft = () => {
    const lastAnswer = localStorage.getItem('quizAnswerDate');
    if (lastAnswer) {
      const lastAnswerDate = new Date(JSON.parse(lastAnswer));
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastAnswerDate.getTime()) / 1000);
      const secondsIn24Hours = 24 * 60 * 60;
      return Math.max(secondsIn24Hours - diffInSeconds, 0); // محاسبه زمان باقی‌مانده
    }
    return 0;
  };

  // بررسی اینکه آیا مودال امروز فعال شده است
  useEffect(() => {
    const activeToday = checkIfActiveToday();
    setIsAnsweredToday(activeToday);
    setIsSubmitDisabled(activeToday);
    if (activeToday) {
      setTimeLeft(calculateTimeLeft()); // تنظیم تایمر در صورت فعال بودن امروز
    }

    const interval = setInterval(() => {
      if (activeToday) {
        setTimeLeft(calculateTimeLeft());
      }
    }, 1000); // به روز رسانی تایمر هر ثانیه

    return () => clearInterval(interval); // پاک کردن تایمر پس از بسته شدن مودال
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
      <div className="px-14 py-2 flex items-center space-x-2">
                <img style={{ width: '25px', height: '25px' }} src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p style={{ fontSize: '22px' }} className="text-4xl text-white">{points.toLocaleString()}</p>
              </div>
        <h2 className="modal-title text-[#fff]">Quiz Time!</h2>
        {isAnsweredToday ? (
          <div className="modal-text">
            <p>You have already answered today. Please come back tomorrow!</p>
            {timeLeft > 0 && <p style={{ fontSize: '15px' }}>{formatTime(timeLeft)}</p>}
          </div>
        ) : (
          <div className="text-black">
            <p className="modal-text text-[#fff]">What is the name of the popular JavaScript library for building user interfaces?</p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="modal-input"
              placeholder="Your answer"
            />
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Submit
            </button>
            {isCorrect === true && <p className="modal-text correct">Correct! You've earned 200 coins!</p>}
            {isCorrect === false && answer && <p className="modal-text incorrect">Incorrect! Try again.</p>}
          </div>
        )}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default QuizModal;
