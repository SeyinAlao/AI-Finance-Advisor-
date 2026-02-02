import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { Calendar, Search, FileText, XCircle } from 'lucide-react';
import { fetchAIHistory } from '../api/ai';

interface HistoryItem {
  id?: string | number;
  created_at?: string;
}

const HistoryPage = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const fromStr = fromDate ? fromDate.toISOString().split('T')[0] : undefined;
  const toStr = toDate ? toDate.toISOString().split('T')[0] : undefined;

  const { 
    data: history = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['aiHistory', fromStr, toStr], 
    queryFn: () => fetchAIHistory(1, 20, fromStr, toStr),
    staleTime: 1000 * 60 * 5, 
  });

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
 
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan History</h1>
          <p className="text-gray-500 text-sm">Filter your past investment strategies by date.</p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          {/* From Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">From</label>
            <div className="relative">
              <DatePicker 
                selected={fromDate} 
                onChange={(date: Date | null) => setFromDate(date)} 
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-32 text-sm"
                placeholderText="Start"
                dateFormat="yyyy-MM-dd"
              />
              <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">To</label>
            <div className="relative">
              <DatePicker 
                selected={toDate} 
                onChange={(date: Date | null) => setToDate(date)} 
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-32 text-sm"
                placeholderText="End"
                dateFormat="yyyy-MM-dd"
                minDate={fromDate || undefined}
              />
              <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {(fromDate || toDate) && (
            <button onClick={clearFilters} className="mb-1 p-2 text-red-600 hover:bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mb-2"></div>
            Loading history...
          </div>
        ) : isError ? (
            <div className="p-8 text-center text-red-500">Failed to load history. Please try again.</div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium">No plans found</p>
            <p className="text-gray-500 text-sm">
              {(fromDate || toDate) ? "Try changing the date range." : "You haven't generated any plans yet."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {history.map((item: HistoryItem, index: number) => (
              <li key={index} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Investment Plan #{index + 1}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Date N/A'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  Completed
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;