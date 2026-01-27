import BASE_URL from "@/config/base-url";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Cookies from "js-cookie";

const STALE_TIME = 5 * 60 * 1000;
const CACHE_TIME = 30 * 60 * 1000;

const fetchData = async (endpoint, token) => {
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch data from ${endpoint}`);
  return response.json();
};

const createQueryConfig = (queryKey, endpoint, options = {}) => {
  const token = Cookies.get("token");
  return {
    queryKey,
    queryFn: () => fetchData(endpoint, token),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    ...options,
  };
};

export const useFetchState = () => {
  return useQuery(createQueryConfig(["states"], "/api/panel-fetch-state"));
};
export const useFetchDataSource = () => {
  return useQuery(createQueryConfig(["data-source"], "/api/data-source"));
};
export const useFetchPromoter = () => {
  return useQuery(createQueryConfig(["promoter-active"], "/api/promoter-active"));
};
export const useFetchChapterActive = () => {
  return useQuery(createQueryConfig(["chapter-active"], "/api/chapter-active"));
};




export const useFetchMembershipYear = () => {
  return useQuery(createQueryConfig(["memership-year"], "/api/fetch-membership-year"));
};

export const useFetchSchoolAllotmentYear = () => {
  return useQuery(createQueryConfig(["school-allotment-year"], "/api/fetch-school-allotment-year"));
};


export const useFetchReceiptControl = () => {
  return useQuery(createQueryConfig(["receipt-control"], "/api/fetch-receipt-control"));
};
