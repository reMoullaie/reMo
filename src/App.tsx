import React, { useState, useEffect } from "react";
import "./App.css";
import {
  binanceLogo,
  Quiztime,
  dailyCombo,
  dailyReward,
  dollarCoin,
  hamsterCoin,
  mainCharacter,
  Bottry,
  Arrow,
  Boost,
} from "./images";
import QuizModal from "./components/QuizModal.tsx"; // وارد کردن کامپوننت مودال سوال
import RewardModal from "./components/Modal.tsx"; // وارد کردن کامپوننت مودال جوایز (مودال قبلی که داشتید)
import DailyReward from "./components/Dailyreward.tsx";
import Airdrop from "./components/Airdrop.tsx";
import BoostPage from "./BoostPage"; // وارد کردن کامپوننت صفحه Boost
import MinePage from "./MinePage.tsx";

const App: React.FC = () => {
  const levelNames = [
    "Bronze", // From 0 to 4999 coins
    "Silver", // From 5000 coins to 24,999 coins
    "Gold", // From 25,000 coins to 99,999 coins
    "Platinum", // From 100,000 coins to 999,999 coins
    "Diamond", // From 1,000,000 coins to 2,000,000 coins
    "Epic", // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master", // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord", // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0, // Bronze
    5000, // Silver
    25000, // Gold
    100000, // Platinum
    1000000, // Diamond
    2000000, // Epic
    10000000, // Legendary
    50000000, // Master
    100000000, // GrandMaster
    1000000000, // Lord
  ];

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(22749365);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [pointsToAdd,] = useState(11);
  const [clickLimit, ] = useState(500); // Maximum coins per click
  const [clicksCount, setClicksCount] = useState(0); // Number of clicks in the current period
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null); // Timer for resetting limit
  const profitPerHour = 126420;
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 دقیقه به ثانیه


  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
  const [isAirdropOpen, setIsAirdropOpen] = useState(false);
  const [isBoostPageVisible, setIsBoostPageVisible] = useState(false); 
  const [isMinePageOpen, setIsMinePageOpen] = useState(false);

  

  const toggleBoostPage = () => {setIsBoostPageVisible(!isBoostPageVisible);};
   
  const toggleMinePage = () => {setIsMinePageOpen((prev) => !prev);};

  const handleOpenAirdrop = () => setIsAirdropOpen(true);
  const handleCloseAirdrop = () => setIsAirdropOpen(false);

  const handleOpenQuizModal = () => setIsQuizModalOpen(true);
  const handleCloseQuizModal = () => setIsQuizModalOpen(false);

  const handleOpenDailyReward = () => setIsDailyRewardOpen(true);
  const handleCloseDailyReward = () => setIsDailyRewardOpen(false);

  const handleOpenRewardModal = () => setIsRewardModalOpen(true);
  const handleCloseRewardModal = () => setIsRewardModalOpen(false);

  const handleReward = (coins: number) => {
    setPoints(prevPoints => prevPoints + coins);
  };
  useEffect(() => {
    if (clicksCount >= clickLimit) {
      const interval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 0) {
            clearInterval(interval);
            setClicksCount(0); // بازنشانی تعداد کلیک‌ها
            setTimeRemaining(25 * 60); // بازنشانی زمان
            return 25 * 60; // زمان جدید
          }
          return prevTime - 1; // کاهش زمان
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [clicksCount]);


  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clicksCount >= clickLimit) return; // Prevent adding coins if limit reached

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${ -y / 10 }deg) rotateY(${ x / 10 }deg)`;
    setTimeout(() => {
      card.style.transform = "";
    }, 100);
    setClicks((prevClicks) => {
      const updatedClicks = [
        ...prevClicks,
        { id: Date.now(), x: e.pageX, y: e.pageY },
      ];
      if (updatedClicks.length > 5) updatedClicks.shift(); // محدود کردن به 5 انیمیشن فعال
      return updatedClicks;
    });

    setClicksCount(prevCount => {
      const newCount = prevCount + pointsToAdd;
      if (newCount > clickLimit) return clickLimit;
      setPoints(prevPoints => prevPoints + pointsToAdd);
      return newCount;
    });
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  useEffect(() => {
    // Reset clicks count every 25 minutes
    if (resetTimer) clearTimeout(resetTimer);
    const timer = setTimeout(() => setClicksCount(0), 25 * 60 * 1000);
    setResetTimer(timer);
    return () => clearTimeout(timer);
  }, [clicksCount]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints((prevPoints) => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  return (
    <div className="flex text-white justify-center">
      <div className="w-full bg-[#1c1f24] h-screen font-bold max-w-xl">
        <div className="px-4 z-10"></div>
        <div className="flex-grow mt-4 bg-[#389] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2">
              <div className="rounded-lg px-2 py-2 w-full relative items-center flex justify-center bg-[#272a2f]">
                <img src={dollarCoin} alt="Dollar Coin" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
              </div>
              <div className="rounded-lg px-2 py-2 w-full relative items-center flex justify-center bg-[#272a2f]">
                <p className="text-sm">Profile Name</p>
              </div>
              <div className="rounded-lg px-2 py-2 w-full relative items-center flex justify-center bg-[#272a2f]">
                <img src={Bottry} alt="Dollar Coin" style={{ width: '20px', height: '20px', marginRight: '3px' }} />
                <p className="text-sm text-center">{(clickLimit)}/</p>
                <p className="text-sm text-center">{(clicksCount)}</p>
               </div>
            </div>
            <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p className="text-4xl text-white">{points.toLocaleString()}</p>
              </div>
            </div>
            <div className="px-4 mt-4 flex justify-center">
              <div className="w-80 h-80 p-4 rounded-full circle-outer" onClick={handleCardClick}>
                <div className="w-full h-full rounded-full circle-inner">
                  <img src={mainCharacter} alt="Main Character" className="w-full h-full object-cover img_storok" />
                </div>
              </div>
            </div> 
            <div className="flex justify-between">
            <button onClick={toggleMinePage}>
            <img src={Arrow} alt="Boost" className="mx-auto w-12 h-12" />
            <p className="text-[10px] text-center text-[#85827d] mt-1">Mine</p>

        {isMinePageOpen}
      </button>
      
      {isMinePageOpen && (
        <MinePage 
          toggleMinePage={toggleMinePage} 
          points={points} // ارسال موجودی سکه‌ها به MinePage
        />
      )}
             
             <a
          href="#"
          onClick={toggleBoostPage}
          className="rounded-lg px-2 py-2 relative justify-end items-start"
        >
          <img src={Boost} alt="Boost" className="mx-auto w-12 h-12" />
          <p className="text-[10px] text-center text-[#85827d] mt-1">Boost</p>
        </a>
        {/* نمایش صفحه Boost */}
      {isBoostPageVisible && <BoostPage toggleBoostPage={toggleBoostPage} />}
           </div>
          </div>
        </div>
           <div className="px-4 mt-4">
  {/* نوار پیشرفت */}
  <div className="progress-bar-container">
    <div
      className="progress-bar relative items-center flex justify-center"
      style={{ width: `${(clicksCount / clickLimit) * 100}%` }}
    ><p>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</p></div>
  </div>
  </div>
  
  
      </div>
      <div className="fixed bottom-0 left-25 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
        <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Exchange</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <button className="rounded-lg px-2 py-2 w-full relative items-center" onClick={handleOpenDailyReward}>
            <img src={dailyReward} alt="Daily Reward" className="w-8 h-8 mx-auto" />
            <p className="text-[10px] text-center text-[#85827d] mt-1">Reward</p>
          </button>
          {isDailyRewardOpen && <DailyReward onClose={handleCloseDailyReward} onReward={handleReward} points={points} />}
        </div>
        
        <div className="text-center text-[#85827d] w-1/5">
          <button className="rounded-lg px-2 py-2 w-full relative items-center" onClick={handleOpenQuizModal}>
            <img src={Quiztime} alt="Daily Quiz" className="mx-auto w-15 h-10" />
            <p className="text-[10px] text-center text-[#85827d] mt-1">Quiz</p>
          </button>
          {isQuizModalOpen && <QuizModal onClose={handleCloseQuizModal} onReward={handleReward} points={points} />}
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <button className="rounded-lg px-2 py-2 w-full relative items-center" onClick={handleOpenRewardModal}>
            <img src={dailyCombo} alt="Daily Tasks" className="w-8 h-8 mx-auto" />
            <p className="text-[10px] text-center text-[#85827d] mt-1">Tasks</p>
          </button>
          {isRewardModalOpen && <RewardModal onClose={handleCloseRewardModal} onReward={handleReward} points={points} />}
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <button className="open-quiz-modal-btn bg-[#272a2f]" onClick={handleOpenAirdrop}>
            <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
            <p className="mt-1">Airdrop</p>
          </button>
          {isAirdropOpen && <Airdrop onClose={handleCloseAirdrop} onReward={handleReward} />}
        </div>
      </div>
      {clicks.map(click => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`,
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {pointsToAdd}
        </div>
      ))}
    </div>
  );
};

export default App;
