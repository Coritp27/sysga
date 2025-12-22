# 🚀 VeriCarte - Guide Complet de Déploiement

> **Système de Gestion d'Assurance basé sur la Blockchain**

## 📋 Vue d'ensemble

VeriCarte est une application d'assurance décentralisée qui permet de gérer et tracer les cartes d'assurance sur la blockchain Ethereum, avec :
- un **frontend Next.js 14** (`frontend/`) protégé par **Clerk** pour l'authentification,
- un **backend Hardhat** (`backend/`) qui gère les **smart contracts Solidity**,
- une **base PostgreSQL** (via Prisma) pour les données métier off‑chain.

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   Base de       │
│   (Next.js)     │◄──►│   Contract      │◄──►│   données       │
│   Port 3000     │    │   (Ethereum)    │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Diagramme des modules

```mermaid
flowchart LR
  U[Utilisateur web] --> FE[Frontend]
  subgraph FrontendZone["Frontend (Next.js)"]
    FE --> DB[(PostgreSQL via Prisma)]
    FE --> Auth[(Clerk)]
    FE --> SMS[(Twilio)]
    FE --> Mail[(SendGrid / Nodemailer)]
    FE --> RPC[(RPC Ethereum)]
  end
  subgraph BackendZone["Blockchain (Hardhat)"]
    RPC --> SC[Smart contract SysGa.sol]
  end
```

## 🎯 Environnements de Déploiement

### 🔧 **Développement Local** (Recommandé pour commencer)

- **Blockchain** : Hardhat (localhost)
- **Frontend** : Next.js (localhost:3000)
- **Base de données** : PostgreSQL (Docker)
- **Coût** : Gratuit

### 🌐 **Production** (Beta testeurs)

- **Blockchain** : Sepolia (testnet)
- **Frontend** : Vercel
- **Base de données** : PostgreSQL (Vercel)
- **Coût** : Gratuit (ETH de test)

### 🚀 **Production Finale**

- **Blockchain** : Ethereum mainnet
- **Frontend** : Vercel
- **Base de données** : PostgreSQL (Vercel)
- **Coût** : ~0.03 ETH

---

## 🛠️ Développement Local

- [Docker](https://www.docker.com/products/docker-desktop) et [Docker Compose](https://docs.docker.com/compose/) (ou un PostgreSQL local)
- [Node.js](https://nodejs.org/) (v18+)
- MetaMask pour interagir avec l’appli via un wallet

➡️ Les étapes détaillées (avec et sans Docker) sont décrites dans la section **🎯 Workflow Recommandé** plus bas.

---

## 🌐 Déploiement en Production

### 📋 Prérequis

1. **Wallet Ethereum** avec des fonds
2. **Comptes API** (Infura, Etherscan)
3. **Compte Vercel** pour le frontend

### 🔑 Configuration des Services

#### A. Infura (RPC Provider)

1. Aller sur [infura.io](https://infura.io)
2. Créer un compte et un projet
3. Récupérer les URLs RPC :
   - Sepolia : `https://sepolia.infura.io/v3/YOUR-PROJECT-ID`
   - Mainnet : `https://mainnet.infura.io/v3/YOUR-PROJECT-ID`

#### B. Etherscan (Vérification des contrats)

1. Aller sur [etherscan.io](https://etherscan.io)
2. Créer un compte et générer une clé API

#### C. ETH de test (Sepolia)

1. Aller sur [sepoliafaucet.com](https://sepoliafaucet.com)
2. Coller votre adresse wallet
3. Recevoir des ETH de test

➡️ La configuration détaillée du backend, du frontend et le plan de déploiement (Sepolia / mainnet / Vercel) sont centralisés dans la section **🎯 Workflow Recommandé**.

---

## 🔧 Scripts Disponibles

### Backend

| Script                   | Description                      |
| ------------------------ | -------------------------------- |
| `npm run deploy:sepolia` | Déploiement sur Sepolia          |
| `npm run deploy:mainnet` | Déploiement sur Ethereum mainnet |
| `npm run verify:sepolia` | Vérification sur Sepolia         |
| `npm run check-balance`  | Vérifier la balance du wallet    |
| `npm run interact`       | Interagir avec le contrat        |

### Frontend

> Le frontend utilise `yarn` (voir `frontend/yarn.lock`).

| Script          | Description            |
| --------------- | ---------------------- |
| `yarn dev`      | Développement local    |
| `yarn build`    | Build de production    |
| `yarn start`    | Démarrer en production |


---

## 🧪 Instructions pour les Beta Testeurs

### Prérequis

1. **Installer MetaMask** : [metamask.io](https://metamask.io)
2. **Ajouter le réseau Sepolia** dans MetaMask :
   - Nom : Sepolia
   - RPC URL : `https://sepolia.infura.io/v3/YOUR-PROJECT-ID`
   - Chain ID : 11155111
   - Explorer : `https://sepolia.etherscan.io`
3. **Obtenir des ETH de test** : [sepoliafaucet.com](https://sepoliafaucet.com)

### Test de l'application

1. **Se connecter** à l'application avec MetaMask
2. **Vérifier la connexion** au contrat
3. **Tester les fonctionnalités** :
   - Lecture des cartes d'assurance
   - Ajout d'une nouvelle carte
   - Changement de réseau

---

## 📊 Monitoring et Explorers

### Explorers de contrats

- **Sepolia** : [sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Mainnet** : [etherscan.io](https://etherscan.io)

### Métriques importantes

- **Adresse du contrat déployé**
- **Nombre de transactions**
- **Gas utilisé**
- **Balance du wallet de déploiement**

---

## 🚨 Gestion des Erreurs

### Erreurs communes

1. **"Insufficient funds"** → Obtenir des ETH de test
2. **"Wrong network"** → Basculer vers Sepolia
3. **"Contract not found"** → Vérifier l'adresse du contrat
4. **"RPC error"** → Vérifier les URLs RPC

### Support

- Vérifier les logs de déploiement
- Consulter l'explorer de contrats
- Tester d'abord en local : `npx hardhat node`

---

## 💰 Coûts Estimés

| Environnement     | Déploiement | Vérification | Total     |
| ----------------- | ----------- | ------------ | --------- |
| **Développement** | Gratuit     | Gratuit      | Gratuit   |
| **Sepolia**       | Gratuit     | Gratuit      | Gratuit   |
| **Mainnet**       | ~0.02 ETH   | ~0.01 ETH    | ~0.03 ETH |

---

## 🔒 Sécurité

⚠️ **IMPORTANT** :

- Ne jamais commiter votre clé privée
- Utiliser un wallet dédié pour le déploiement
- Tester d'abord sur testnet
- Sauvegarder l'adresse du contrat déployé
- Utiliser des variables d'environnement

---

## 📁 Structure du Projet

```
sysga/    # Dossier du projet VeriCarte
├── backend/                 # Smart contracts, Hardhat
│   ├── contracts/          # Contrats Solidity
│   ├── scripts/           # Scripts de déploiement
│   └── ignition/          # Modules de déploiement
├── frontend/              # Application Next.js
│   ├── app/              # Pages et composants
│   ├── components/       # Composants React
│   └── constants/        # Configuration blockchain
├── docker-compose.yml    # Orchestration Docker
└── README.md            # Ce fichier
```

---

## 🎯 Workflow Recommandé

### 1. Déploiement local avec Docker (recommandé)

1. Cloner le projet et se placer dans le dossier `sysga` :
   ```bash
   git clone <repo-url>
   cd sysga
   ```
2. Configurer les environnements de base :
   - `cd backend && cp env.example .env` (facultatif pour le pur local, utile si vous déployez aussi sur Sepolia/Mainnet).
   - `cd frontend && cp .env.example .env.local` puis adapter au moins :
     - `DATABASE_URL=postgresql://sysga:sysga123@postgres:5432/sysga`
     - `NEXT_PUBLIC_DEFAULT_NETWORK=localhost` si vous utilisez le nœud Hardhat local.
3. Lancer toute la stack :
   ```bash
   docker-compose up --build
   ```
4. Accéder aux services :
   - Frontend : `http://localhost:3000`
   - Blockchain locale (Hardhat) : `http://localhost:8545`
   - Base de données PostgreSQL : `localhost:5432`
   - Prisma Studio (optionnel) : `http://localhost:5555` (service `prisma-studio`).
5. (Optionnel) Lancer les tests et redéployer le contrat :
   ```bash
   docker-compose run backend npx hardhat test
   docker-compose run backend npx hardhat ignition deploy ./ignition/modules/SysGa.js
   ```

### 2. Déploiement local sans Docker

#### 2.1 Chemin “manuel” (PostgreSQL local)

1. Installer et démarrer PostgreSQL localement, puis créer une base :
   - DB : `sysga`
   - User : `sysga` / `sysga123` (ou adapter `DATABASE_URL`).
2. Backend (Hardhat) :
   ```bash
   cd backend
   npm install
   # (optionnel) cp env.example .env
   npx hardhat node
   ```
3. Dans un autre terminal, déployer le contrat sur le nœud local :
   ```bash
   cd backend
   npx hardhat ignition deploy ./ignition/modules/SysGa.js --network localhost
   ```
4. Frontend :
   ```bash
   cd frontend
   yarn install
   cp .env.example .env.local
   # Adapter notamment :
   # DATABASE_URL=postgresql://sysga:sysga123@localhost:5432/sysga
   # NEXT_PUBLIC_DEFAULT_NETWORK=localhost
   yarn prisma migrate dev --name init   # première initialisation
   yarn dev
   ```
5. Ouvrir `http://localhost:3000` et se connecter via Clerk.

#### 2.2 Lancement rapide avec le script `dev-local.sh`

Une fois vos fichiers d’environnement configurés (`frontend/.env` et
`frontend/.env.local`, y compris `DATABASE_URL` vers Prisma Accelerate ou une
base PostgreSQL), vous pouvez lancer toute l’application avec un seul script :

```bash
cd sysga
chmod +x dev-local.sh      # première fois seulement
./dev-local.sh
```

Ce script :
- démarre un nœud Hardhat local,
- déploie le smart contract SysGa sur `localhost`,
- lance le frontend Next.js (`yarn dev`).

### 3. Déploiement en production (testnet + Vercel)

1. Préparer le backend (contrat) :
   ```bash
   cd backend
   cp env.example .env
   # Renseigner PRIVATE_KEY, SEPOLIA_RPC_URL / MAINNET_RPC_URL, ETHERSCAN_API_KEY, etc.
   npm run check-balance --network sepolia
   npm run deploy:sepolia
   npm run verify:sepolia
   ```
   - Noter l’adresse du contrat déployé sur Sepolia (ou Mainnet).
2. Configurer le frontend pour la production :
   - Dans `frontend/.env.local` (ou les variables d’environnement Vercel), renseigner :
     - `NEXT_PUBLIC_CONTRACT_ADDRESS` = adresse du contrat déployé.
     - `NEXT_PUBLIC_INFURA_PROJECT_ID` / `NEXT_PUBLIC_SEPOLIA_RPC_URL`.
     - `NEXT_PUBLIC_DEFAULT_NETWORK=sepolia` (ou `mainnet`).
     - Les clés Clerk, Twilio, SendGrid et la chaîne `DATABASE_URL` d’une base PostgreSQL managée.
3. Déployer sur Vercel :
   - Pousser le code sur GitHub/GitLab.
   - Créer un projet sur [Vercel](https://vercel.com/) pointant sur `sysga/frontend`.
   - Renseigner les variables d’environnement dans Vercel.
   - Lancer un build (`yarn build`) et vérifier l’application en ligne.

> 💡 **Option base de données managée avec Prisma Accelerate**  
> Au lieu d’un PostgreSQL local ou managé classique, vous pouvez utiliser
> [Prisma Accelerate](https://www.prisma.io/docs/orm/prisma-accelerate) :
> - Configurez une base PostgreSQL (Neon, RDS, etc.) puis créez une API key Accelerate.  
> - Dans `frontend/.env` et `frontend/.env.local`, définissez `DATABASE_URL` sous la forme :  
>   `DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."`  
> - Prisma CLI utilisera `frontend/.env`, tandis que Next.js utilisera `frontend/.env.local`.

---

## 🔗 Ressources utiles

- Hardhat : https://hardhat.org/getting-started
- Ignition (déploiement) : https://hardhat.org/ignition
- Prisma : https://www.prisma.io/docs
- Clerk : https://clerk.com/docs
- Twilio : https://www.twilio.com/docs
- SendGrid : https://docs.sendgrid.com
- Vercel / Next.js : https://nextjs.org/docs/deployment
- Infura : https://infura.io
- Alchemy : https://www.alchemy.com
- MetaMask : https://metamask.io
- Etherscan : https://etherscan.io
- Faucet Sepolia : https://sepoliafaucet.com

---

## 📞 Support

En cas de problème :

1. Vérifier les logs de déploiement
2. Consulter la documentation Hardhat
3. Vérifier la configuration des services
4. Tester en local avant de déployer

---

**🎉 Félicitations !** Votre application SYSGA est maintenant prête pour le déploiement !
