// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error NotEnoughFunds();
error AlreadyBought();

contract SysGa {

    struct InsuranceCard {
        uint256 id;
        string cardNumber;
        uint256 issuedOn;
        string status;
        address insuranceCompany;
    }

    uint256 public nextId;

    mapping(address => InsuranceCard[]) private insuranceCardsByCompany;

    function getInsuranceCards(address _insuranceCompany) external view returns(InsuranceCard[] memory) {
        return insuranceCardsByCompany[_insuranceCompany];
    }

    function addInsuranceCard(string calldata _cardNumber, uint256 _issuedOn, string calldata _status, address _insuranceCompany) external {
        nextId++;
        InsuranceCard memory thisInsuranceCard = InsuranceCard(nextId, _cardNumber, _issuedOn, _status, _insuranceCompany);
        insuranceCardsByCompany[_insuranceCompany].push(thisInsuranceCard);
    }

    function getKeyByAddressAndId(address _insuranceCompany, uint256 _id) internal view returns(uint256) {
        uint256 result;
        for(uint256 i = 0 ; i < insuranceCardsByCompany[_insuranceCompany].length ; i++) {
            if(insuranceCardsByCompany[_insuranceCompany][i].id == _id) {
                result = i;
            }
        }
        return result;
    }
}