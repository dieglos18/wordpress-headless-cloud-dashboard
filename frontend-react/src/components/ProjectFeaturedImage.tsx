import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

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

  const lightbox =
    lightboxOpen &&
    url &&
    createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Full screen image"
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4"
        onClick={() => setLightboxOpen(false)}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 z-101 rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(false);
          }}
        >
          <X className="size-6" strokeWidth={1.5} aria-hidden />
        </button>
        <img
          src={url}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>,
      document.body,
    );

  return (
    <>
      <div className={outerClass}>
        {isPending && (
          <div
            className="absolute inset-0 z-0 animate-pulse bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-white/4 dark:via-white/8 dark:to-white/4"
            aria-hidden
          />
        )}
        {showImg ? (
          <>
            <img
              src={url}
              alt={alt}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className={imgClass}
            />
            {variant === "detail" ? (
              <button
                type="button"
                className="group absolute inset-0 z-2 flex cursor-pointer items-center justify-center border-0 bg-black/0 p-0 transition-colors hover:bg-black/60 focus-visible:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => setLightboxOpen(true)}
                aria-label="View image full screen"
              >
                <span className="pointer-events-none text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  View image
                </span>
              </button>
            ) : null}
          </>
        ) : null}
        {!isPending && !showImg ? (
          <div
            className={`absolute inset-0 flex items-center justify-center px-2 text-center text-xs font-medium text-app-muted ${zMessage}`}
          >
            {isError ? "Image unavailable" : "No image"}
          </div>
        ) : null}
      </div>
      {lightbox}
    </>
  );
}
