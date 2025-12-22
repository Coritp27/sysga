const fs = require("fs");
const path = require("path");

// Script pour mettre à jour l'adresse du contrat dans le frontend
async function updateFrontendAddress() {
  try {
    // Lire l'adresse du contrat déployé depuis les artifacts
    const artifactsPath = path.join(
      __dirname,
      "../ignition/deployments/chain-11155111/deployed_addresses.json"
    );

    if (!fs.existsSync(artifactsPath)) {
      console.log(
        "Fichier deployed_addresses.json non trouvé. Déployez d'abord le contrat."
      );
      return;
    }

    const deployedAddresses = JSON.parse(
      fs.readFileSync(artifactsPath, "utf8")
    );
    const contractAddress = deployedAddresses.SysGaModule?.SysGa;

    if (!contractAddress) {
      console.log(
        "Adresse du contrat non trouvée dans deployed_addresses.json"
      );
      return;
    }

    console.log("Adresse du contrat déployé:", contractAddress);

    // Mettre à jour le fichier de configuration frontend
    const frontendConfigPath = path.join(
      __dirname,
      "../../frontend/constants/blockchain.js"
    );

    if (!fs.existsSync(frontendConfigPath)) {
      console.log("Fichier blockchain.js non trouvé dans le frontend");
      return;
    }

    let configContent = fs.readFileSync(frontendConfigPath, "utf8");

    // Remplacer l'ancienne adresse par la nouvelle
    const oldAddressRegex = /contractAddress: "0x[a-fA-F0-9]{40}"/;
    const newAddressLine = `contractAddress: "${contractAddress}"`;

    if (oldAddressRegex.test(configContent)) {
      configContent = configContent.replace(oldAddressRegex, newAddressLine);
      fs.writeFileSync(frontendConfigPath, configContent);
      console.log(
        "Adresse mise à jour dans frontend/constants/blockchain.js"
      );
    } else {
      console.log(
        "Aucune adresse trouvée à remplacer dans le fichier de configuration"
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
  }
}

// Exécuter le script
updateFrontendAddress();
