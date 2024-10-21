'use client';

import React, { useState } from 'react';

const SummonerForm = ({ onSubmit }) => {
  const [summonerName, setSummonerName] = useState('');
  const [tagline, setTagline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (summonerName && tagline) {
      onSubmit(summonerName, tagline);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          placeholder="Enter Summoner Name"
        />
      </div>
      <div>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Enter Tagline (e.g., NA1)"
        />
      </div>
      <button type="submit">Get Match History</button>
    </form>
  );
};

export default SummonerForm;