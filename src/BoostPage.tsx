// BoostPage.tsx
import React from "react";

interface BoostPageProps {
  toggleBoostPage: () => void;
}

const BoostPage: React.FC<BoostPageProps> = ({ toggleBoostPage }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="bg-white p-6  w-full h-full relative">
        <h2 className="text-2xl font-bold mb-4 text-black">صفحه Boost</h2>
        <p className="text-lg text-gray-700 mb-6">
          اینجا اطلاعات مربوط به Boost و استفاده از آن نمایش داده می‌شود.
        </p>
        <button
          onClick={toggleBoostPage}
          className="absolute top-4 right-4 text-white bg-red-600 px-4 py-2 rounded-full"
        >
          بستن
        </button>
      </div>
    </div>
  );
};

export default BoostPage;
