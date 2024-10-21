import axios from 'axios';

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
    const accountResponse = await axios.get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(summonerName)}/${encodeURIComponent(tagline)}?api_key=${API_KEY}`
    );

    const playerPUUID = accountResponse.data.puuid;
    const matchIDResponse = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(playerPUUID)}/ids?start=0&count=10&api_key=${API_KEY}`
    );

    const matchIDs = matchIDResponse.data;
    const matchDetailRequests = matchIDs.map((matchId) =>
      axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}?api_key=${API_KEY}`)
    );

    const matchDetailsResponses = await Promise.all(matchDetailRequests);
    const matchDetails = matchDetailsResponses.map((response) => response.data);

    const extractedMatches = matchDetails.map((match) => {
    const participant = match.info.participants.find((p) => p.puuid === playerPUUID);

    return {
      champion: participant.championName,
      win: participant.win,
      kills: participant.kills,
      deaths: participant.deaths,
      assists: participant.assists,
    };
});

return new Response(JSON.stringify({ matches: extractedMatches }), {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
  },
});
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
