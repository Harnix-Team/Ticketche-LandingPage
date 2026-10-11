// MapLibre 6 charge son worker depuis une URL voisine de son module : un bundler casse ce
// chemin, on sert donc le worker depuis public/ (meme version que le paquet installe).
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(root, "public/vendor/maplibre-gl-worker.mjs");

mkdirSync(dirname(target), { recursive: true });
copyFileSync(resolve(root, "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs"), target);
