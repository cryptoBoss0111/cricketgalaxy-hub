
// Cricket API service
import { useToast } from '@/hooks/use-toast';

const API_KEY = "1008d947-ac1d-4a69-a135-897686252434";
const API_BASE_URL = "https://api.cricapi.com/v1";

interface ApiResponse {
  apikey: string;
  data: any[];
  status: string;
  info: {
    hitsToday: number;
    hitsLimit: number;
    credits: number;
    server: number;
    offsetRows: number;
    totalRows: number;
    queryTime: number;
  };
}

export async function fetchMatches() {
  try {
    const response = await fetch(`${API_BASE_URL}/matches?apikey=${API_KEY}`);
    const data: ApiResponse = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.status || "Failed to fetch matches");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
}

export async function fetchMatchDetails(matchId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/match_info?apikey=${API_KEY}&id=${matchId}`);
    const data: ApiResponse = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.status || "Failed to fetch match details");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching match details:", error);
    throw error;
  }
}

export async function fetchPlayerDetails(playerId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/players_info?apikey=${API_KEY}&id=${playerId}`);
    const data: ApiResponse = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.status || "Failed to fetch player details");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching player details:", error);
    throw error;
  }
}

export async function searchPlayers(query: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/players?apikey=${API_KEY}&offset=0&search=${query}`);
    const data: ApiResponse = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.status || "Failed to search players");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error searching players:", error);
    throw error;
  }
}

export async function getPlayerStats(playerId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/players_stats?apikey=${API_KEY}&id=${playerId}`);
    const data: ApiResponse = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.status || "Failed to fetch player stats");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching player stats:", error);
    throw error;
  }
}

export async function getMatchScorecard(matchId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/match_scorecard?apikey=${API_KEY}&id=${matchId}`);
    const data: ApiResponse = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.status || "Failed to fetch match scorecard");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching match scorecard:", error);
    throw error;
  }
}

// Gemini API for Chatbot
export async function getGeminiResponse(query: string) {
  const API_KEY = "AIzaSyDYDj9g9FwKBcYWlkAS3HZrP5SQjB6fQ-E";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a cricket expert assistant. Please respond to the following query about cricket: ${query}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Failed to get Gemini response");
    }
    
    return data.candidates[0]?.content?.parts[0]?.text || "I'm sorry, I couldn't generate a response for that query.";
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    return "I encountered an error processing your request. Please try again later.";
  }
}
