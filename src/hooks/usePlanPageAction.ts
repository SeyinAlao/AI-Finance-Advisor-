import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { fetchAIHistory } from '../api/ai'; 

import type { PlanResponse, HistoryPlanItem, Asset } from '../types';

export const usePlanPageAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const statePlan = location.state?.plan as PlanResponse | undefined;

  const { data: fetchedPlan, isLoading: isQueryLoading } = useQuery<HistoryPlanItem | null>({
    queryKey: ['latestAIHistory'],
    queryFn: async () => {
      const history = await fetchAIHistory(1, 1);
      return history?.length ? history[0] : null;
    },
    enabled: !statePlan, 
  });
  const isLoading = !statePlan ? isQueryLoading : false;

  let assets: Asset[] = [];
  let adviceText = "We have arranged a diversified portfolio to balance your growth targets with risk management.";

  const activePlan = statePlan || fetchedPlan;

  if (activePlan) {
    if ('response' in activePlan && activePlan.response?.data?.recommendations) {
      assets = activePlan.response.data.recommendations;
      if (activePlan.response.message) {
        adviceText = activePlan.response.message;
      }
    } 
    else if ('data' in activePlan && activePlan.data?.recommendations) {
      assets = activePlan.data.recommendations;
      if (activePlan.message) {
        adviceText = activePlan.message;
      }
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
    isLoading, 
  };
};