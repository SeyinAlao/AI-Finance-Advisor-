import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAIHistory } from "../api/ai";

export const useHistoryPageAction = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [tempFromDate, setTempFromDate] = useState<Date | null>(null);
  const [tempToDate, setTempToDate] = useState<Date | null>(null);

  const [appliedFilters, setAppliedFilters] = useState<{
    from?: string;
    to?: string;
  }>({});

  const formatLocalDate = (date: Date | null) => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const {
    data: history,
    isLoading,
    isError,
    error, // specific reason for failing
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      "aiHistory",
      page,
      limit,
      appliedFilters.from,
      appliedFilters.to,
    ],
    queryFn: () =>
      fetchAIHistory(page, limit, appliedFilters.from, appliedFilters.to),
    retry: 1, // Limited retries to surface errors faster
  });

  const historyList = Array.isArray(history) ? history : [];

  const handleApply = () => {
    const fromStr = formatLocalDate(tempFromDate);
    const toStr = formatLocalDate(tempToDate);
    setAppliedFilters({ from: fromStr, to: toStr });
    setPage(1);
  };

  const clearFilters = () => {
    setTempFromDate(null);
    setTempToDate(null);
    setAppliedFilters({});
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((old) => Math.max(old - 1, 1));
  };

  const handleNextPage = () => {
    if (!isPlaceholderData && historyList.length === limit) {
      setPage((old) => old + 1);
    }
  };

  return {
    tempFromDate,
    appliedFilters,
    tempToDate,
    historyList,
    isLoading,
    isError,
    error,
    page,
    limit,
    setTempFromDate,
    setTempToDate,
    refetch,
    handleApply,
    clearFilters,
    handlePreviousPage,
    handleNextPage,
  };
};
