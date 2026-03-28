import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "../api/wordpress";

const STALE_TIME_MS = 5 * 60 * 1000;

export function useProject(id: number | undefined) {
  const enabled = typeof id === "number" && Number.isFinite(id);

  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id!),
    enabled,
    staleTime: STALE_TIME_MS,
  });
}
