import { useLocation, useNavigate } from 'react-router-dom';
import type { HistoryItem, Asset } from '../types';

export const useHistoryDetailsAction = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const historyItem = location.state?.plan as HistoryItem | undefined;
  
  let assets: Asset[] = [];
  let adviceText = "We have arranged a diversified portfolio to balance your growth targets with risk management.";

  if (historyItem) {
    if (historyItem.data?.recommendations) {
      assets = historyItem.data.recommendations;
    } else if (historyItem.response?.data?.recommendations) {
      assets = historyItem.response.data.recommendations;
    }
    
    if (historyItem.message) {
      adviceText = historyItem.message;
    } else if (historyItem.response?.message) {
      adviceText = historyItem.response.message;
    }
  }

  const totalPrincipal = assets.reduce((sum, item) => sum + item.principal, 0);
  const totalEstReturn = assets.reduce((sum, item) => sum + item.estimated_return_value, 0);
  const roiPercentage = totalPrincipal > 0 
    ? ((totalEstReturn / totalPrincipal) * 100).toFixed(1) 
    : "0.0";

  return {
    assets,
    adviceText,
    totalPrincipal,
    totalEstReturn,
    roiPercentage,
    navigate,
  };
};