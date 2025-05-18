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

    mapping(address => InsuranceCard[]) private insuranceCards;

    function getInsuranceCards(address _of) external view returns(InsuranceCard[] memory) {
        return insuranceCards[_of];
    }

    function addInsuranceCard(string calldata _cardNumber, uint256 _issuedOn, string calldata _status, address _insuranceCompany) external {
        nextId++;
        InsuranceCard memory thisInsuranceCard = InsuranceCard(nextId, _cardNumber, _issuedOn, _status, _insuranceCompany);
        insuranceCards[msg.sender].push(thisInsuranceCard);
    }

    function getKeyByAddressAndId(address _for, uint256 _id) internal view returns(uint256) {
        uint256 result;
        for(uint256 i = 0 ; i < insuranceCards[_for].length ; i++) {
            if(insuranceCards[_for][i].id == _id) {
                result = i;
            }
        }
        return result;
    }
}