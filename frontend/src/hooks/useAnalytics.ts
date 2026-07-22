import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../services/analytics";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
    // Since this is public info for landing page, we can refetch it less frequently
    staleTime: 5 * 60 * 1000, 
  });
}
