// import React from 'react';

const Header = () => (
  <header className="bg-gray-900 text-white py-4 px-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white">
          <i className="fa fa-long-arrow-left"></i>
        </button>
        <div className="text-lg font-bold">DarkAdmin</div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white">
          <i className="fa fa-search"></i>
        </button>
        <button className="relative text-gray-400 hover:text-white">
          <i className="fa fa-envelope"></i>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2 py-1">5</span>
        </button>
        <button className="relative text-gray-400 hover:text-white">
          <i className="fa fa-tasks"></i>
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full text-xs px-2 py-1">9</span>
        </button>
        <button className="relative text-gray-400 hover:text-white">
          <i className="fa fa-globe"></i>
          <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full text-xs px-2 py-1">EN</span>
        </button>
        <button className="text-gray-400 hover:text-white">
          <i className="fa fa-sign-out"></i>
        </button>
      </div>
    </div>
  </header>
);

export default Header;
