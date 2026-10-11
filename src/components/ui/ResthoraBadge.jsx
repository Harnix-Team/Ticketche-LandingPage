import Image from "next/image";

/** Logo Resthora, pose sur les restaurants connectes (meme repere que dans l'application). */
export function ResthoraBadge({ className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-md bg-surface/95 px-2 py-1.5 backdrop-blur-sm ${className}`}>
      <Image src="/images/partners/resthora-logo.png" alt="Resthora" width={62} height={11} className="h-[11px] w-auto dark:hidden" />
      <Image src="/images/partners/resthora-logo-dark.png" alt="Resthora" width={62} height={11} className="hidden h-[11px] w-auto dark:block" />
    </span>
  );
}
