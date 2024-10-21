'use client';

import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import SummonerForm from './components/summoner-form';
import MatchHistory from './components/match-history';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
    <>
      <Head>
        <title>Summoner Match History</title>
        <meta name="description" content="View the LoL match history" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 text-white py-12 flex flex-col items-center">
        <SummonerForm onSubmit={fetchMatchHistory} />

        {/* Display the error message if there is one */}
        {errorMessage && (
          <div className="bg-red-600 text-white p-4 mt-4 rounded-md shadow-md max-w-lg w-full text-center">
            <p className="font-bold">{errorMessage}</p>
          </div>
        )}

        {/* Show the loading spinner while data is being fetched */}
        {loading && (
          <div className="flex justify-center items-center mt-10">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-400"></div>
          </div>
        )}

        {/* Show the match history only when not loading and matches are present */}
        {!loading && matches.length > 0 && (
          <MatchHistory matches={matches} />
        )}
      </main>
    </>
  );
}
