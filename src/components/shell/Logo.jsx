import Image from "next/image";
import Link from "next/link";

const FULL = { light: "/images/logo-brown-green-extended.png", dark: "/images/logo-brown-green-extended-dark.png", ratio: "aspect-[1242/166]" };
const MARK = { light: "/images/logo-brown-green.png", dark: "/images/logo-yellow-light.png", ratio: "aspect-[668/350]" };

function Variant({ source, className }) {
  return (
    <span className={`relative h-full ${source.ratio} ${className}`}>
      <Image src={source.light} alt="" fill sizes="160px" className="object-contain dark:hidden" />
      <Image src={source.dark} alt="" fill sizes="160px" className="hidden object-contain dark:block" />
    </span>
  );
}

/** Logo complet. Avec `compact`, seul le sigle reste sur les ecrans tres etroits, pour laisser la place aux actions. */
export function Logo({ className = "", compact = false }) {
  return (
    <Link href="/" aria-label="Ticketché, accueil" className={`flex shrink-0 ${className}`}>
      {compact && <Variant source={MARK} className="block xs:hidden" />}
      <Variant source={FULL} className={compact ? "hidden xs:block" : "block"} />
    </Link>
  );
}
