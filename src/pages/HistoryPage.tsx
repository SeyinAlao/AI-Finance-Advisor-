import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  Search,
  FileText,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useHistoryPageAction } from "../hooks/useHistoryPageAction";
import type { HistoryItem } from "../types";

const HistoryPage = () => {
  const {
    page,
    limit,
    appliedFilters,
    setTempFromDate,
    setTempToDate,
    tempFromDate,
    tempToDate,
    historyList,
    isLoading,
    isError,
    error,
    refetch,
    handleApply,
    clearFilters,
    handlePreviousPage,
    handleNextPage,
  } = useHistoryPageAction();

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan History</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review your past generated investment strategies.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">
              From
            </label>
            <div className="relative">
              <DatePicker
                selected={tempFromDate}
                onChange={(date: Date | null) => setTempFromDate(date)}
                className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-32 text-sm font-medium text-gray-700"
                placeholderText="Start Date"
                dateFormat="dd-MM-yyyy"
              />
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">
              To
            </label>
            <div className="relative">
              <DatePicker
                selected={tempToDate}
                onChange={(date: Date | null) => setTempToDate(date)}
                className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-32 text-sm font-medium text-gray-700"
                placeholderText="End Date"
                dateFormat="dd-MM-yyyy"
                minDate={tempFromDate || undefined}
              />
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 h-[38px]"
            >
              <Filter className="w-4 h-4" />
              Apply
            </button>

            {(tempFromDate || tempToDate) && (
              <button
                onClick={clearFilters}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors h-[38px] w-[38px] flex items-center justify-center"
                title="Clear Filters"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px] flex flex-col">
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mb-3"></div>
              <span className="text-sm font-medium">Retrieving records...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">
                Request Failed
              </h3>
              <p className="text-red-500 text-sm max-w-xs mx-auto mb-4">
                {(error as Error)?.message ||
                  "The server could not process your request. Please try again later."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : historyList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center p-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">
                No plans found
              </h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {appliedFilters.from || appliedFilters.to
                  ? "We couldn't find any plans within that date range."
                  : "You haven't generated any investment plans yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {historyList.map((item: HistoryItem, index: number) => (
                <div
                  key={index}
                  className="p-5 hover:bg-green-50/50 transition-colors flex justify-between items-center group cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 shadow-sm group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        Investment Strategy #{item.id || index + 1}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "Date N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded-full uppercase tracking-wide">
                      Success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {(historyList.length > 0 || page > 1) && !isLoading && !isError && (
          <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-500 pl-2">
              Page <span className="font-semibold text-gray-900">{page}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNextPage}
                disabled={historyList.length < limit}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
