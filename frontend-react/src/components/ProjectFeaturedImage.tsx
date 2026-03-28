import { useState } from "react";
import { useMedia } from "../hooks/useMedia";

export type FeaturedImageVariant = "card" | "cardSide" | "detail";

type ProjectFeaturedImageProps = {
  mediaId: string;
  alt: string;
  variant?: FeaturedImageVariant;
};

export function ProjectFeaturedImage({
  mediaId,
  alt,
  variant = "card",
}: ProjectFeaturedImageProps) {
  const { data, isPending, isError } = useMedia(mediaId);
  const [imgFailed, setImgFailed] = useState(false);

  if (!mediaId.trim()) {
    return null;
  }

  const url = data?.source_url?.trim();
  const showImg = url && !isError && !imgFailed;

  const outerClass =
    variant === "detail"
      ? "relative min-h-[12rem] h-[min(32rem,55dvh)] w-full max-w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-black/20"
      : variant === "cardSide"
        ? "relative h-40 w-full min-h-0 min-w-0 shrink-0 overflow-hidden rounded-t-xl bg-slate-100 dark:bg-black/20 sm:h-full sm:min-h-[9rem] sm:w-32 sm:self-stretch md:w-36 xl:w-40 sm:rounded-l-xl sm:rounded-t-none sm:rounded-br-none"
        : "relative aspect-video w-full min-w-0 shrink-0 overflow-hidden rounded-t-xl bg-slate-100 dark:bg-black/20";

  const imgClass =
    "absolute inset-0 z-[1] block h-full w-full object-cover object-center";

  const isStackCard = variant === "card";
  const zMessage = variant === "detail" || !isStackCard ? "z-[1]" : "";

  return (
    <div className={outerClass}>
      {isPending && (
        <div
          className="absolute inset-0 z-0 animate-pulse bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-white/4 dark:via-white/8 dark:to-white/4"
          aria-hidden
        />
      )}
      {showImg ? (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
          className={imgClass}
        />
      ) : null}
      {!isPending && !showImg ? (
        <div
          className={`absolute inset-0 flex items-center justify-center px-2 text-center text-xs font-medium text-app-muted ${zMessage}`}
        >
          {isError ? "Image unavailable" : "No image"}
        </div>
      ) : null}
    </div>
  );
}
