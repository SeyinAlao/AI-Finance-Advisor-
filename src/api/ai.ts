import type { AIRequestPayload, AIResponse } from "../types";

const API_URL = "https://robo-advisor-backend-service.onrender.com";

const getToken = () => localStorage.getItem('token'); 

export const generateAIPlan = async (payload: AIRequestPayload): Promise<AIResponse> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/ai/request`, {
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

export const fetchAIHistory = async (
  page: number, 
  limit: number, 
  from?: string, 
  to?: string
) => {
  const token = getToken(); 

  // We use URLSearchParams to build the query string cleanly
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (from) params.append('from', from);
  if (to) params.append('to', to);

  // Example result: /ai/fetch-response/date?page=1&limit=20&from=2023-01-01&to=2023-01-31
  const response = await fetch(`${API_URL}/ai/fetch-response/date?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }

  return response.json();
};