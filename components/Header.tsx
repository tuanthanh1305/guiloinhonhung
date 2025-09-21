
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-4 md:py-6">
      <h1 className="font-pacifico text-4xl md:text-5xl text-pink-500">
        Gửi lời nhớ Nhung
      </h1>
      <p className="mt-3 text-base md:text-lg text-gray-600">Nền tảng do Trần Tuấn Thành (trantuanthanh.net) phát triển</p>
    </header>
  );
};

export default Header;