import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-blue-500 flex flex-col items-center justify-center text-center p-4">
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-white">
        <div className="logo">
          {/* Replace with your actual logo image */}
          <img src="/path-to-your-logo.png" alt="animasters logo" className="h-8" />
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/the-journey" className="text-gray-800 hover:text-gray-600">The Journey</a></li>
            <li><a href="/about-us" className="text-gray-800 hover:text-gray-600">About Us</a></li>
            <li><a href="/partners" className="text-gray-800 hover:text-gray-600">Partners</a></li>
            <li><a href="/register" className="text-gray-800 hover:text-gray-600">Register</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          What do <span className="text-blue-600">your</span> dreams <br /> look like?
        </h1>
        <button className="mt-8 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <span>Discover</span>
          {/* You can use an arrow svg or font icon */}
          <svg className="ml-2 w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </main>

      <footer className="absolute bottom-0 left-0 w-full text-white p-4">
        <p>© 2024 animasters. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
