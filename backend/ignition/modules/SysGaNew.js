const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SysGaNew", (m) => {
  const sysGa = m.contract("SysGa");

  return { sysGa };
});
