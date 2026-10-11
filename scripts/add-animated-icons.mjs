// Ajoute des icones animees de lucide-animated.com (registre shadcn, composants TypeScript) au projet,
// converties en JSX : `node scripts/add-animated-icons.mjs heart map-pin ...`
// Chaque icone ajoutee doit ensuite etre declaree dans src/components/icons/index.js.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformSync } from "@swc/core";

const REGISTRY = "https://lucide-animated.com/r";
const target = resolve(dirname(fileURLToPath(import.meta.url)), "../src/components/icons/animated");
const names = process.argv.slice(2);

if (names.length === 0) {
  console.error("Usage : node scripts/add-animated-icons.mjs <nom-lucide> [...]");
  process.exit(1);
}

mkdirSync(target, { recursive: true });

for (const name of names) {
  const response = await fetch(`${REGISTRY}/${name}.json`);
  if (!response.ok) {
    console.error(`${name} : absente du registre (${response.status})`);
    process.exitCode = 1;
    continue;
  }

  const item = await response.json();
  const extra = (item.dependencies ?? []).filter((dependency) => dependency !== "motion");
  if (extra.length > 0 || item.files.length !== 1) {
    console.error(`${name} : dependances inattendues (${extra.join(", ") || "plusieurs fichiers"}), a integrer a la main`);
    process.exitCode = 1;
    continue;
  }

  const { code } = transformSync(item.files[0].content, {
    filename: `${name}.tsx`,
    isModule: true,
    jsc: { parser: { syntax: "typescript", tsx: true }, transform: { react: { runtime: "preserve" } }, target: "es2022" },
  });

  // Racine en <span> : une icone vit souvent dans un <p> ou un <button>, ou un <div> est du HTML invalide.
  const inline = code.replace(/<div(?=[\s>])/g, "<span").replace(/<\/div>/g, "</span>");

  writeFileSync(resolve(target, `${name}.jsx`), `// Source : ${REGISTRY}/${name}.json (lucide-animated, licence MIT). Fichier genere, ne pas modifier a la main.\n${inline}`);
  console.log(`${name} : ajoutee`);
}
