import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  ArrowLeft, TrendingUp, PieChart, ShieldCheck, Wallet, Info 
} from 'lucide-react';

interface Asset {
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
  status: string;
  data: Asset[] | { 
    investmentAdvice?: string; 
    holdings?: Asset[];
    portfolio?: Asset[];
  };
}

const CHART_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

const PlanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rawPlan = location.state?.plan as PlanResponse | undefined;
  let assets: Asset[] = [];
  let adviceText = "We have arranged a diversified portfolio to balance your growth targets with risk management.";

  if (rawPlan?.data) {
    if (Array.isArray(rawPlan.data)) {
      assets = rawPlan.data;
    } else {
      assets = rawPlan.data.holdings || rawPlan.data.portfolio || [];
      if (rawPlan.data.investmentAdvice) {
        adviceText = rawPlan.data.investmentAdvice;
      }
    }
  }
  const totalPrincipal = assets.reduce((sum, item) => sum + item.principal, 0);
  const totalEstReturn = assets.reduce((sum, item) => sum + item.estimated_return_value, 0);
  const roiPercentage = totalPrincipal > 0 ? ((totalEstReturn / totalPrincipal) * 100).toFixed(1) : "0.0";

  if (!assets || assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Plan</h2>
          <p className="text-gray-500 mb-6">We couldn't retrieve the portfolio data. This usually happens if the page was refreshed.</p>
          <button 
            onClick={() => navigate('/questionnaire')}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Create New Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <button 
              onClick={() => navigate('/dashboard/questionnaire')}
              className="group flex items-center text-slate-500 hover:text-emerald-700 transition-colors mb-4 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retake Assessment
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Your Wealth Strategy
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Personalized allocation based on your profile.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
             <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex-1 md:flex-none">
                <div className="flex items-center gap-2 mb-1 text-slate-500">
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Invested</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">${totalPrincipal.toLocaleString()}</p>
             </div>
             <div className="bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100 shadow-sm flex-1 md:flex-none">
                <div className="flex items-center gap-2 mb-1 text-emerald-700">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Est. Growth</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-emerald-800">+${totalEstReturn.toLocaleString()}</p>
                  <span className="text-sm font-medium text-emerald-600">({roiPercentage}%)</span>
                </div>
             </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border-l-4 border-emerald-500">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-full shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-1">
                Advisor Insight
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                "{adviceText}"
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-slate-400" />
                  Asset Allocation
                </h2>
              </div>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="ticker" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      tickFormatter={(value) => `${value}%`} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '16px',
                        backgroundColor: '#1e293b',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="composition" radius={[6, 6, 6, 6]} barSize={40}>
                      {assets.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Class</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Weight</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((item) => (
                    <tr key={item.ticker} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{item.financial_product}</div>
                        <div className="text-xs text-slate-500 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">
                          {item.ticker} • {item.provider}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-600">
                        {item.composition}%
                      </td>
                      <td className="px-6 py-4 text-right text-slate-700 font-semibold">
                        ${item.principal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-full">
              <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                Portfolio Breakdown
              </h3>
              
              <div className="space-y-8">
                {assets.map((item, i) => (
                  <div key={i} className="relative pl-4 border-l-2 border-slate-100">
                    <div 
                      className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    ></div>
                    
                    <div className="mb-1 flex justify-between items-start">
                        <span className="text-sm font-bold text-slate-800">{item.ticker}</span>
                        <span className="text-xs font-semibold text-slate-400">{item.expected_return} Exp. Return</span>
                    </div>
                    
                    <p className="text-sm text-slate-500 leading-relaxed">
                        {item.brief_description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlanPage;