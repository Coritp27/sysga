const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SysGaModule", (m) => {
  const sysGa = m.contract("SysGa");

  return { sysGa };
});
