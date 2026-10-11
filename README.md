# Site vitrine Ticketché

Site public de Ticketché (ticketche.com) : événements, lieux et restaurants au Bénin, avec pour objectif d'amener le visiteur dans l'application mobile. Next.js 16 (App Router), JavaScript, Tailwind CSS 4.

## Lancer en local

Le site lit l'API Ticketché. En local, démarrer d'abord la pile du monorepo `Ticketche` (API sur `http://localhost:8000`, données de démonstration incluses) :

```bash
cd ../Ticketche/INFRA && ./scripts/local-up.sh
```

Puis le site, **sur le port 3000** (seule origine locale autorisée par le CORS de l'API pour les appels faits depuis le navigateur : recherche, suivi, fil personnel) :

```bash
npm run dev
```

Variables d'environnement (`.env`, voir `.env.example`) :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_API_URL` | Racine de l'API, par exemple `http://localhost:8000/api/v2` |
| `NEXT_PUBLIC_CHATBOT_PROVIDER` | Widget de chat : `nixia`, `tawk` ou `none` |
| `NEXT_PUBLIC_RECO_GUEST_SESSION` | `1` pour créer une session invité après accord du visiteur (suggestions personnalisées) |

## Vérifier

```bash
npm run lint
npm test
npm run build
```

## Organisation

| Dossier | Contenu |
|---|---|
| `src/app` | Pages. `/` accueil, `/events`, `/establishments` (lieux), `/restaurants`, `/carte`, fiches en `/events/<slug>-<id>`, `/places/<slug>-<id>`, `/restaurants/<slug>-<id>` |
| `src/lib/api.js` | Accès à l'API côté serveur, mis en cache (l'API limite à 60 requêtes par minute et par IP, et tout le rendu serveur partage une IP) |
| `src/lib/catalog.js` | Mise en forme des réponses de l'API : seuls les champs affichés sortent du serveur, jamais les données personnelles des propriétaires |
| `src/lib/tracking.js` | Suivi des consultations pour le moteur de recommandation, uniquement après accord du visiteur |
| `src/components/ui` | Primitives (bouton, puce, rangée défilante, champ de formulaire, fenêtre modale) |
| `src/components/shell` | En-tête, recherche, pied de page, thème, bouton « Obtenir l'app » |
| `src/components/cards`, `home`, `explore`, `detail`, `map` | Cartes, sections de l'accueil, listes, fiches, carte |
| `src/app/globals.css` | Couleurs des thèmes clair et sombre (reprises de l'application mobile) et utilitaires `tk-*` |

## Recommandations

Le site s'appuie sur le moteur de recommandation de l'API (`GET /recommendations`, `GET /recommendations/related`, `POST /tracking/events`) :

- accueil : billet de la une, « Tendances », « Ouvert maintenant », « Nouveautés » ;
- listes : tri par défaut « Recommandés » ;
- fiches : rangée « Vous aimeriez aussi », avec la raison sous chaque carte ;
- carte : ordre « Près de vous » après localisation ;
- « Pour vous » : fil personnel, alimenté par les consultations du visiteur une fois son accord donné.

Quand le moteur est coupé (`enabled: false`) ou injoignable, chaque rubrique retombe sur un classement simple (note, date, distance).

## Carte

MapLibre GL avec les fonds OpenFreeMap (données OpenStreetMap), sans clé. Le worker de MapLibre est copié de `node_modules` vers `public/vendor/` avant `dev` et `build` (`scripts/copy-map-worker.mjs`).
