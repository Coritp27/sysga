#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------------
# Script générique de lancement local (sans Docker) pour VeriCarte
# - Suppose que DATABASE_URL est déjà configurée (ex : Prisma Accelerate)
# - Démarre un nœud Hardhat local
# - Déploie le smart contract SysGa (VeriCarte) sur localhost
# - Lance le frontend Next.js avec Prisma
# ------------------------------------------------------------------

# Dossier racine du projet (là où se trouve ce script)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"

# ------------------------------------------------------------------
# 1) Backend : nœud Hardhat local
# ------------------------------------------------------------------
echo "Lancement du nœud Hardhat (http://localhost:8545)..."
cd "$ROOT_DIR/backend"
npm install
npx hardhat node --hostname 0.0.0.0 &
HARDHAT_PID=$!

cleanup() {
  echo "🛑 Arrêt du nœud Hardhat..."
  kill "$HARDHAT_PID" 2>/dev/null || true
}
trap cleanup EXIT

sleep 10

# ------------------------------------------------------------------
# 2) Déploiement du smart contract sur localhost
# ------------------------------------------------------------------
echo "Déploiement du contrat SysGa sur localhost..."
npx hardhat ignition deploy ./ignition/modules/SysGa.js --network localhost

# ------------------------------------------------------------------
# 3) Frontend : Prisma + Next.js
# ------------------------------------------------------------------
echo "Lancement du frontend (Next.js)..."
cd "$ROOT_DIR/frontend"
yarn install
# Si nécessaire, appliquer les migrations Prisma manuellement :
# yarn prisma migrate dev --name init
yarn dev
