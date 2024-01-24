import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-1 flex items-center justify-start sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
            Campus-X COllaborator
            </div>
          </div>

          {/* Search Section */}
          <div className="flex-1 flex justify-center">
            <div className="w-full px-2 lg:px-6">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative text-gray-600 focus-within:text-gray-400">
                <input id="search" className="block w-full h-full pl-8 pr-3 py-2 rounded-md text-gray-900 bg-gray-200 focus:outline-none focus:bg-white" placeholder="Search documentation..." type="search" />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Search Icon */}
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13h-1v1h1V5zm0 2h-1v3h1V7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Icons and Links Section */}
          <div className="flex items-center justify-end">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {/* Navigation Links - Adjust href as necessary */}
                <a href="/docs" className="text-gray-800 px-3 py-2 rounded-md text-sm font-medium" aria-current="page">Docs</a>
                <a href="/components" className="text-gray-800 px-3 py-2 rounded-md text-sm font-medium">Components</a>
                {/* ... other navigation links */}
              </div>
            </div>

            {/* Icons - Replace with actual icons */}
            <div className="flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Settings Icon */}
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              {/* ... other icons */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
