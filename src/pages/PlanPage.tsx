import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const COLORS = ['#15803d', '#166534', '#14532d', '#22c55e'];

interface PortfolioItem {
  asset_class: string;
  percentage: number;
}

interface PlanData {
  portfolio_allocation: PortfolioItem[];
  risk_analysis: string;
  recommendations: string[];
}

const PlanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state?.plan as PlanData | undefined;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">No Plan Found</h2>
        <p className="text-gray-500 mb-6">Please answer the questions to generate your investment plan.</p>
        <button 
          onClick={() => navigate('/questionnaire')}
          className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
        >
          Go to Questionnaire
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button 
          onClick={() => navigate('/questionnaire')}
          className="flex items-center text-gray-600 hover:text-green-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retake Questionnaire
        </button>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Your Investment Strategy</h1>
        <p className="text-gray-500">Based on your risk profile and financial goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recommended Allocation</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.portfolio_allocation} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="asset_class" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {data.portfolio_allocation.map((_entry: PortfolioItem, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
            <h3 className="text-green-800 font-bold mb-2">AI Risk Analysis</h3>
            <p className="text-green-700 text-sm leading-relaxed">{data.risk_analysis}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-800 font-bold mb-4">Actionable Steps</h3>
            <ul className="space-y-3">
              {data.recommendations?.map((rec: string, i: number) => (
                <li key={i} className="flex items-start text-sm text-gray-600">
                  <span className="inline-block w-2 h-2 mt-1.5 mr-3 bg-green-500 rounded-full flex-shrink-0"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;