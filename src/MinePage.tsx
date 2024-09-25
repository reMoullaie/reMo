import React from "react";
import "./Modal.css"

interface MinePageProps {
  toggleMinePage: () => void; // اضافه کردن toggleMinePage به props
  points: number; // اضافه کردن props برای موجودی سکه‌ها
}

const MinePage: React.FC<MinePageProps> = ({ toggleMinePage, points }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="bg-white p-6 w-full h-full relative">
        <h2 className="text-2xl font-bold mb-4 text-black">صفحه Mine</h2>
        <p className="text-lg text-gray-700 mb-6">
          موجودی سکه‌های شما: <span className="font-bold">{points.toLocaleString()}</span> سکه
        </p>
        <button
          onClick={toggleMinePage} // استفاده از تابع toggleMinePage برای بستن صفحه
          className="absolute top-4 right-4 text-white bg-red-600 px-4 py-2 rounded-full"
        >
          بستن
        </button>
      </div>
    </div>
  );
};

export default MinePage;
