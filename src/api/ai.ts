import type { AIRequestPayload, AIResponse } from "../types";

const API_URL = import.meta.env.DEV ? "" : "https://advisor-blush.vercel.app";

const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const generateAIPlan = async (payload: AIRequestPayload): Promise<AIResponse> => {
  const token = getToken();

  console.log("DEBUG - Token being sent to AI:", token);

  if (!token || token === "undefined" || token === "null") {
    throw new Error("You are missing a token! Please log out and log back in to get a fresh one.");
  }

  const response = await fetch(`${API_URL}/api/ai/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();
  console.log("DEBUG - Raw Server Response:", rawText);

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    throw new Error(`Server Error (Not JSON): ${rawText}`);
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to generate AI plan');
  }

  return data;
};

export const fetchAIHistory = async (page: number, limit: number, from?: string, to?: string) => {
  const token = getToken();

  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (from) params.append('from', from);
  if (to) params.append('to', to);

  const response = await fetch(`${API_URL}/api/ai/response?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }

  const result = await response.json();
  
  console.log("API RESPONSE:", result); 

  if (Array.isArray(result)) return result;
  
  if (result.data && Array.isArray(result.data)) return result.data;
  if (result.history && Array.isArray(result.history)) return result.history;

  if (result.response) {
    if (Array.isArray(result.response)) return result.response;
    if (result.response.data && Array.isArray(result.response.data)) return result.response.data;
    if (result.response.history && Array.isArray(result.response.history)) return result.response.history;
  }

  return [];
};
