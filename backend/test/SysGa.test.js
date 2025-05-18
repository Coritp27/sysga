const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers");

describe("SysGa Tests", function () {
  let owner;
  let addr1;
  let addr2;
  let addr3;

  async function deploySysGa() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const SysGa = await ethers.getContractFactory("SysGa");
    const sysGa = await SysGa.deploy();

    return { sysGa, owner, addr1, addr2, addr3 };
  }

  async function deploySysGaAndAddInsuranceCard() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const SysGa = await ethers.getContractFactory("SysGa");
    const sysGa = await SysGa.deploy();

    const cardNumber = "1234567890";
    const issuedOn = Math.floor(
      new Date("2025-05-17T23:45:20.897Z").getTime() / 1000
    );
    const status = "active";
    const insuranceCompany = owner.address;
    await sysGa.addInsuranceCard(
      cardNumber,
      issuedOn,
      status,
      insuranceCompany
    );

    return { sysGa, owner, addr1, addr2, addr3 };
  }

  describe("Deployment", function () {
    beforeEach(async function () {
      const fixture = await loadFixture(deploySysGa);
      owner = fixture.owner;
      addr1 = fixture.addr1;
      addr2 = fixture.addr2;
      addr3 = fixture.addr3;
      sysGa = fixture.sysGa;
    });

    it("should deploy the smart contract", async function () {
      let nextId = await sysGa.nextId();
      assert(nextId.toString() === "0");
    });
  });

  describe("addInsuranceCard", function () {
    beforeEach(async function () {
      const fixture = await loadFixture(deploySysGaAndAddInsuranceCard);
      owner = fixture.owner;
      addr1 = fixture.addr1;
      addr2 = fixture.addr2;
      addr3 = fixture.addr3;
      sysGa = fixture.sysGa;
    });

    it("should add an element in the insuranceCards", async function () {
      const cardNumber = "1234567890";
      const issuedOn = Math.floor(
        new Date("2025-05-17T23:45:20.897Z").getTime() / 1000
      );
      const status = "active";
      const insuranceCompany = owner.address;
      await sysGa.addInsuranceCard(
        cardNumber,
        issuedOn,
        status,
        insuranceCompany
      );
      const insuranceCardElement = await sysGa.getInsuranceCards(owner.address);
      console.log(insuranceCardElement);
      assert(insuranceCardElement.length === 2);
      assert(insuranceCardElement[0][0] === 1n);
      assert(insuranceCardElement[0][1] === cardNumber);
      assert(insuranceCardElement[0][2] === BigInt(issuedOn));
      assert(insuranceCardElement[0][3] === status);
      assert(insuranceCardElement[0][4] === insuranceCompany);
      assert(insuranceCardElement[1][0] === 2n);
      assert(insuranceCardElement[1][1] === cardNumber);
      assert(insuranceCardElement[1][2] === BigInt(issuedOn));
      assert(insuranceCardElement[1][3] === status);
      assert(insuranceCardElement[1][4] === insuranceCompany);
    });
  });
});
