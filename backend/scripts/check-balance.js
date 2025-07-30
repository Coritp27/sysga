const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Vérification de la configuration...");

  // Vérifier le réseau
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Réseau: ${network.name} (Chain ID: ${network.chainId})`);

  // Vérifier la configuration
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Adresse du déployeur: ${deployer.address}`);

  // Vérifier la balance
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  console.log(`💰 Balance: ${balanceInEth} ETH`);

  // Vérifier si la balance est suffisante
  const minBalance = ethers.parseEther("0.01"); // 0.01 ETH minimum
  if (balance < minBalance) {
    console.log("❌ Balance insuffisante pour le déploiement");
    console.log("💡 Obtenez des ETH de test sur: https://sepoliafaucet.com");
    console.log("   Ou: https://faucet.sepolia.dev/");
    console.log("   Ou: https://sepolia-faucet.pk910.de/");
    return;
  }

  console.log("✅ Balance suffisante pour le déploiement");

  // Vérifier la configuration RPC
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(`📦 Dernier bloc: ${blockNumber}`);

  // Test de connexion au réseau
  try {
    const gasPrice = await ethers.provider.getGasPrice();
    console.log(`⛽ Gas price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);
  } catch (error) {
    console.log("❌ Erreur de connexion au réseau");
    console.log("💡 Vérifiez votre URL RPC dans .env");
    return;
  }

  console.log("\n🎯 Configuration prête pour le déploiement !");
  console.log("\n📋 Prochaines étapes:");
  console.log("1. Vérifiez que vous êtes sur le bon réseau dans MetaMask");
  console.log("2. Lancez: npm run deploy:sepolia");
  console.log("3. Confirmez la transaction dans MetaMask");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
