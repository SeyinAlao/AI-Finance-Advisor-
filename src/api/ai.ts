import type { AIRequestPayload, AIResponse } from "../types";

const API_URL = "https://robo-advisor-backend-service.onrender.com";

const getToken = () => localStorage.getItem('token'); 

export const generateAIPlan = async (userData: AIRequestPayload): Promise<AIResponse> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/ai/send-request`, {
    method: "POST",
    headers: {
      'accept': 'application/json',
      'Content-Type': "application/json",
      'Authorization': `Bearer ${token}` // We must attach the token for authenticated requests
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to generate AI plan');
  }

  return data;
};

export const fetchAIHistory = async (page: number = 1, limit: number = 20, fromdate?: string, todate?: string) => {
  const token = getToken();
  let url = `${API_URL}/ai/fetch-response/date?page=${page}&limit=${limit}`;

  if (fromdate) {
    url += `&fromdate=${fromdate}`;
  }

  if (todate) {
    url += `&todate=${todate}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch history');
  }

  return data;
};