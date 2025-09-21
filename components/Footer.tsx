import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-8 text-gray-500 text-sm">
      <p>
        Nền tảng: "Gửi lời nhớ Nhung" do{' '}
        <a 
          href="https://trantuanthanh.net" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-indigo-500 hover:underline"
        >
          Trần Tuấn Thành (trantuanthanh.net)
        </a>{' '}
        phát triển
      </p>
    </footer>
  );
};

export default Footer;