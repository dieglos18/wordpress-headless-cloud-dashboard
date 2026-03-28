import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../api/wordpress";

const PROJECTS_QUERY_KEY = ["projects"] as const;

const STALE_TIME_MS = 5 * 60 * 1000;

export function useProjects() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: fetchProjects,
    staleTime: STALE_TIME_MS,
  });
}
