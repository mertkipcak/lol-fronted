'use client';

import React, { useState } from 'react';

const SummonerForm = ({ onSubmit }) => {
  const [summonerName, setSummonerName] = useState('');
  const [tagline, setTagline] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (summonerName && tagline) {
      onSubmit(summonerName, tagline);
    }
  };

  return (
    <div className="container mx-auto p-8 mb-10">
      <form
        onSubmit={handleSearch}
        className="bg-gray-900 p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
      >
        <input
          type="text"
          placeholder="Summoner Name"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          className="w-full md:w-1/3 p-4 border border-gray-700 rounded-md bg-gray-800 text-white text-center placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Tagline (e.g., NA1)"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full md:w-1/3 p-4 border border-gray-700 rounded-md bg-gray-800 text-white text-center placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
      </form>
    </div>
  );
};


export default SummonerForm;