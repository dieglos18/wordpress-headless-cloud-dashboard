import { useQuery } from "@tanstack/react-query";
import { fetchMedia } from "../api/wordpress";

const STALE_TIME_MS = 45 * 60 * 1000;

function parseMediaId(mediaId: string | undefined): number | undefined {
  if (!mediaId?.trim()) return undefined;
  const n = Number.parseInt(mediaId, 10);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return n;
}

export function useMedia(mediaId: string | undefined) {
  const id = parseMediaId(mediaId);

  return useQuery({
    queryKey: ["wp-media", id],
    queryFn: () => fetchMedia(id!),
    enabled: typeof id === "number",
    staleTime: STALE_TIME_MS,
  });
}
