import { useId, useRef, useState } from "react";
import { FileText, Maximize2, X } from "lucide-react";

export default function OfferLetterPreview({
  image,
  company,
  compensation = "salary",
}: {
  image: string;
  company: string;
  compensation?: "salary" | "stipend";
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [opened, setOpened] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => { setOpened(true); dialog.current?.showModal(); }}
        aria-label={`View ${company} offer letter, ${compensation} hidden`}
        className="mt-5 flex w-full items-center gap-4 rounded-lg border border-border bg-secondary/40 p-3 text-left transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-foreground"
      >
        <img
          src={image.endsWith(".webp") ? image.replace(/\.webp$/, "-thumb.webp") : image}
          srcSet={image.endsWith(".webp")
            ? `${image.replace(/\.webp$/, "-thumb-small.webp")} 128w, ${image.replace(/\.webp$/, "-thumb.webp")} 240w`
            : undefined}
          sizes="96px"
          alt={`${company} offer letter first page, ${compensation} redacted`}
          loading="lazy"
          width={1473}
          height={2090}
          className="h-36 w-24 shrink-0 rounded border border-border bg-white object-contain"
        />
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <FileText size={16} />
            Offer letter
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Page 1
          </span>
          <span className="mt-3 flex items-center gap-1.5 text-xs">
            <Maximize2 size={13} />
            View letter
          </span>
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="m-auto w-[min(94vw,900px)] max-h-[92vh] overflow-auto rounded-xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/75"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3">
          <div>
            <h3 id={titleId} className="text-sm font-semibold">
              {company} — Offer letter
            </h3>
            <p className="text-xs text-muted-foreground">Page 1</p>
          </div>
          <button
            type="button"
            aria-label="Close offer letter"
            onClick={() => dialog.current?.close()}
            className="rounded-lg p-2 hover:bg-secondary"
          >
            <X size={20} />
          </button>
        </div>
        {opened && <img
          src={image}
          alt={`${company} offer letter first page, ${compensation} redacted`}
          width={1473}
          height={2090}
          className="block h-auto w-full bg-white"
        />}
      </dialog>
    </>
  );
}
