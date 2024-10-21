'use client';

import { useState } from 'react';
import axios from 'axios';
import SummonerForm from './components/summoner-form';
import MatchHistory from './components/match-history';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [Loading, setLoading] = useState(false);

  const fetchMatchHistory = async (summonerName, tagline) => {
    try {
      setErrorMessage('');
      setMatches([]);
      setLoading(true);
  
      const response = await axios.get(`/api/summoner-matches`, {
        params: {
          summonerName,
          tagline,
        },
      });
  
      const matchDetails = response.data.matches;
  
      setMatches(matchDetails);
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage("Summoner with the given name and tagline doesn't exist");
      } else {
        setErrorMessage('An error occurred while fetching match history. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>League of Legends Match History</h1>
      <SummonerForm onSubmit={fetchMatchHistory} />
      {Loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {matches.length > 0 && <MatchHistory matches={matches} />}
    </div>
  );
}