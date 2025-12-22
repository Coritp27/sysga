## VeriCarte Frontend (Next.js 14 + Prisma)

Application frontend de VeriCarte : tableau de bord d’assurance, gestion des cartes, OTP (SMS / email) et intégration blockchain.

### Stack principale

- **Next.js 14** (App Router)  
- **Clerk** pour l’authentification  
- **Prisma + PostgreSQL** pour les données  
- **Twilio / SendGrid / Nodemailer** pour l’OTP  
- **wagmi / viem / RainbowKit** pour l’intégration Ethereum

---

## 1. Pré-requis

- Node.js 18+  
- PostgreSQL local (ou `docker-compose` depuis la racine `sysga/`)  
- Un compte **Clerk**, **Twilio** et éventuellement **SendGrid**

---

## 2. Configuration de l'environnement

Depuis `sysga/frontend` :

```bash
cp .env.example .env.local
```

Puis éditez `.env.local` pour renseigner :

- les clés Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)  
- la connexion base de données (`DATABASE_URL`)  
- la partie blockchain (`NEXT_PUBLIC_INFURA_PROJECT_ID`, `NEXT_PUBLIC_CONTRACT_ADDRESS`, etc.)  
- les providers OTP (Twilio / SendGrid / Gmail)

---

## 3. Installation & lancement en dev

Depuis `sysga/frontend` :

```bash
yarn install
yarn dev
```

L’interface est disponible sur [http://localhost:3000](http://localhost:3000).

Si vous utilisez le `docker-compose` de la racine, la base PostgreSQL et le nœud Hardhat sont déjà provisionnés.

---

## 4. Gestion de la base (Prisma)

Deux options principales :

1. **PostgreSQL local / managé classique**  
   - `DATABASE_URL="postgresql://user:password@host:5432/dbname"`  
   - Utilisez vos propres outils pour démarrer PostgreSQL.

2. **Prisma Accelerate (base distante)**  
   - Créez une base Postgres (Neon, RDS, etc.) et une API key Accelerate.  
   - Dans `frontend/.env` (pour Prisma CLI) et `frontend/.env.local` (pour Next.js), définissez :  
     `DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."`.

Commandes utiles (via `yarn` ou `npx prisma`) :

```bash
# Générer le client Prisma
yarn prisma generate

# Appliquer les migrations existantes (prod / CI)
yarn prisma migrate deploy

# En dev, créer/mettre à jour les migrations (à lancer manuellement)
yarn prisma migrate dev --name <nom_migration>

# Lancer Prisma Studio
yarn prisma studio
```

Le schéma se trouve dans `prisma/schema.prisma` et couvre les entités :
utilisateurs, compagnies d’assurance, assurés, cartes, références blockchain (`BlockchainReference`), OTP, etc.

---

## 5. Build et production

```bash
yarn build   # génère le client Prisma + build Next.js
yarn start   # lance le serveur en mode production
```

En production, le déploiement recommandé est sur **Vercel** avec une base PostgreSQL managée
et un RPC Ethereum de type Infura / Alchemy.
