import axios from 'axios';

/*
  API to fetch past 10 games of a summoner, given their In game ID and tagline
*/
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const summonerName = searchParams.get('summonerName');
  const tagline = searchParams.get('tagline');
  const API_KEY = process.env.RIOT_API_KEY;

  if (!summonerName || !tagline) {
    return new Response(JSON.stringify({ message: "Summoner name and tagline are required." }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Fetch account information to get the player PUUID (account id is not deprecated)
    const accountResponse = await axios.get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(summonerName)}/${encodeURIComponent(tagline)}?api_key=${API_KEY}`
    );

    const playerPUUID = accountResponse.data.puuid;

    // Fetch the match IDs of the last 10 matches for this PUUID
    const matchIDResponse = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(playerPUUID)}/ids?start=0&count=10&api_key=${API_KEY}`
    );

    const matchIDs = matchIDResponse.data;

    // Fetch details for each match concurrently
    const matchDetailRequests = matchIDs.map((matchId) =>
      axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}?api_key=${API_KEY}`)
    );

    const matchDetailsResponses = await Promise.all(matchDetailRequests);
    const matchDetails = matchDetailsResponses.map((response) => response.data);

    // Helper to generate champion icon URLs
    const getChampionIconURL = (championName) =>
      `https://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/${championName}.png`;

    // Extract the required information for each match
    const extractedMatches = matchDetails.map((match) => {
      // Extract relevant data for the summoner by finding their participant object
      const participant = match.info.participants.find((p) => p.puuid === playerPUUID);

      return {
        matchId: match.metadata.matchId,
        champion: participant.championName,
        championIconURL: getChampionIconURL(participant.championName),
        win: participant.win ? 'Victory' : 'Defeat',
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        kda: `${participant.kills} / ${participant.deaths} / ${participant.assists}`,
        gameDurationMinutes: Math.floor(match.info.gameDuration / 60),
        gameMode: match.info.gameMode,
        team: participant.teamId === 100 ? 'Blue' : 'Red',
      };
    });

    return new Response(JSON.stringify({ matches: extractedMatches }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error.response?.data || error.message);
    return new Response(JSON.stringify({ message: error.message }), {
      status: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
