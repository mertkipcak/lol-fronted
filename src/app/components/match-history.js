'use client';

import React from 'react';

const MatchHistory = ({ matches }) => {
  return (
    <div>
      <h2>Recent Matches</h2>
      <ul>
        {matches.map((match, index) => (
          <li key={index}>
            Game ID: {match.gameId} - {match.win ? "Win" : "Loss"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchHistory;