'use client';

import React from 'react';

const MatchHistory = ({ matches }) => {
  return (
    <div className="container mx-auto p-8">
      <div className="space-y-8">
        {matches.map((match) => (
          <div key={match.matchId} className={`p-8 rounded-lg shadow-lg 
          ${match.win === 'Victory' ? 'bg-gradient-to-r from-green-600 to-green-800' : 'bg-gradient-to-r from-red-600 to-red-800'}
          hover:shadow-2xl transition duration-300`}>
            <div className="flex items-center">
              <img src={match.championIconURL} alt={match.champion} className="w-24 h-24 rounded-full shadow-md" />
              <div className="ml-6 text-white">
                <h3 className="text-3xl font-semibold">{match.champion}</h3>
                <p className="text-lg font-bold mt-2">{match.win}</p>
                <p className="mt-4">
                  <span className="font-semibold">KDA:</span> {match.kda}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span> {match.gameDurationMinutes} min
                </p>
                <p>
                  <span className="font-semibold">Game Mode:</span> {match.gameMode}
                </p>
                <p>
                  <span className="font-semibold">Team:</span> {match.team}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;