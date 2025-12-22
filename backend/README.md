# Backend VeriCarte - Déploiement Blockchain

## Déploiement en Production

### Prérequis

1. **Créer un wallet Ethereum** avec des fonds pour le déploiement
2. **Obtenir des clés API** pour les services RPC et vérification

### Configuration

1. **Copier le fichier d'environnement :**
   ```bash
   cp env.example .env
   ```

2. **Configurer les variables dans `.env` :**
   - `PRIVATE_KEY` : Votre clé privée (ne jamais commiter)
   - `SEPOLIA_RPC_URL` : URL RPC Sepolia (Infura/Alchemy)
   - `ETHERSCAN_API_KEY` : Clé API Etherscan

### Services RPC recommandés

#### Option 1: Infura (Gratuit pour commencer)
- Créer un compte sur [infura.io](https://infura.io)
- Créer un projet et récupérer les URLs RPC

#### Option 2: Alchemy (Plus fiable pour production)
- Créer un compte sur [alchemy.com](https://alchemy.com)
- Créer une app et récupérer les URLs RPC

### Déploiement

#### Testnet (Recommandé pour les beta testeurs)
```bash
# Déploiement sur Sepolia
npm run deploy:sepolia

# Vérification du contrat
npm run verify:sepolia
```

#### Mainnet (Production finale)
```bash
# Déploiement sur Ethereum mainnet
npm run deploy:mainnet

# Vérification du contrat
npm run verify:mainnet
```

### Scripts disponibles

- `npm run deploy:sepolia` : Déploiement sur Sepolia
- `npm run deploy:mainnet` : Déploiement sur Ethereum mainnet
- `npm run deploy:mumbai` : Déploiement sur Polygon Mumbai
- `npm run verify:sepolia` : Vérification sur Sepolia
- `npm run verify:mainnet` : Vérification sur mainnet

### Coûts estimés

- **Sepolia** : gratuit (ETH de test).
- **Ethereum mainnet** : ~0.01-0.05 ETH (déploiement + vérification).
- **Polygon Mumbai** : gratuit (MATIC de test).

### Sécurité

**IMPORTANT** :
- Ne jamais commiter votre clé privée.
- Utiliser un wallet dédié pour le déploiement.
- Tester d'abord sur testnet.
- Sauvegarder l'adresse du contrat déployé.
