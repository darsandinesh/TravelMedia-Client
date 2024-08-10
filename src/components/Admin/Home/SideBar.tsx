import React from 'react';

const Sidebar = () => (
  <nav className="w-64 h-screen bg-gray-800 text-white">
    <div className="p-4 flex items-center space-x-3">
      <img src="img/avatar-6.jpg" alt="User Avatar" className="w-12 h-12 rounded-full" />
      <div>
        <h1 className="text-lg font-semibold">Mark Stephen</h1>
        <p>Web Designer</p>
      </div>
    </div>
    <div className="mt-8">
      <h2 className="text-gray-400 px-4">Main</h2>
      <ul className="mt-2">
        <li><a href="index.html" className="block px-4 py-2 hover:bg-gray-700">Home</a></li>
        <li><a href="tables.html" className="block px-4 py-2 hover:bg-gray-700">Tables</a></li>
        <li className="bg-gray-700"><a href="charts.html" className="block px-4 py-2">Charts</a></li>
        <li><a href="forms.html" className="block px-4 py-2 hover:bg-gray-700">Forms</a></li>
        <li>
          <a href="#exampledropdownDropdown" className="block px-4 py-2 hover:bg-gray-700">Example dropdown</a>
          <ul id="exampledropdownDropdown" className="pl-4">
            <li><a href="#" className="block px-4 py-2 hover:bg-gray-600">Page</a></li>
            <li><a href="#" className="block px-4 py-2 hover:bg-gray-600">Page</a></li>
            <li><a href="#" className="block px-4 py-2 hover:bg-gray-600">Page</a></li>
          </ul>
        </li>
        <li><a href="login.html" className="block px-4 py-2 hover:bg-gray-700">Login page</a></li>
      </ul>
      <h2 className="text-gray-400 px-4 mt-8">Extras</h2>
      <ul className="mt-2">
        <li><a href="#" className="block px-4 py-2 hover:bg-gray-700">Demo</a></li>
        <li><a href="#" className="block px-4 py-2 hover:bg-gray-700">Demo</a></li>
        <li><a href="#" className="block px-4 py-2 hover:bg-gray-700">Demo</a></li>
      </ul>
    </div>
  </nav>
);

export default Sidebar;
