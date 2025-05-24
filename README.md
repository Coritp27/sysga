# SYSGA - Guide de démarrage rapide

Ce projet contient deux parties :

- **backend** : Node Hardhat (blockchain locale, smart contracts)
- **frontend** : Next.js (interface web)

## Prérequis

- [Docker](https://www.docker.com/products/docker-desktop) installé
- [Docker Compose](https://docs.docker.com/compose/) (inclus dans Docker Desktop)

## Lancement rapide avec Docker

1. **Cloner le projet** (si ce n'est pas déjà fait) :

   ```sh
   git clone <repo-url>
   cd SYSGA
   ```

2. **Lancer toute l'application (backend + frontend) :**

   ```sh
   docker-compose up --build
   ```

   - Le backend (blockchain locale Hardhat) sera accessible sur le port **8545**.
   - Le frontend (Next.js) sera accessible sur le port **3000** : [http://localhost:3000](http://localhost:3000)

3. **Arrêter l'application :**
   ```sh
   docker-compose down
   ```

## Commandes utiles

- **Lancer les tests Hardhat (backend) :**

  ```sh
  docker-compose run backend npx hardhat test
  ```

- **Déployer le smart contract (backend) :**

  ```sh
  docker-compose run backend npx hardhat ignition deploy ./ignition/modules/SysGa.js
  ```

- **Accéder à la blockchain locale (RPC) :**

  - URL : `http://localhost:8545`

- **Accéder à l'interface web :**
  - URL : `http://localhost:3000`

## Développement

- Les modifications dans le code frontend sont prises en compte automatiquement (hot reload).
- Pour le backend, relancer le service si tu modifies les smart contracts ou la config Hardhat.

## Structure du projet

- `backend/` : code Hardhat, smart contracts, tests
- `frontend/` : code Next.js, composants React, pages web
- `docker-compose.yml` : orchestration des deux services

---
