import { useLocation, useNavigate } from 'react-router-dom';

export interface Asset {
  financial_product: string;
  ticker: string;
  provider: string;
  brief_description: string;
  expected_return: string;
  composition: number;
  principal: number;
  estimated_return_value: number;
}

interface PlanResponse {
  success: boolean;
  response: {
    message: string;
    id?: number;
    data: {
      recommendations: Asset[];
    };
  };
}

export const usePlanPageAction = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rawPlan = location.state?.plan as PlanResponse | undefined;
  
  let assets: Asset[] = [];
  let adviceText = "We have arranged a diversified portfolio to balance your growth targets with risk management.";

  if (rawPlan?.response?.data?.recommendations) {
    assets = rawPlan.response.data.recommendations;
    
    if (rawPlan.response.message) {
      adviceText = rawPlan.response.message;
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