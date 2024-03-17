// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] public funders;
    mapping(address => uint) public addressToAmountFunded;
    address public immutable i_owner;

    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        // msg.value has 18 decimal i.e 1.000000000000000000
        // msg.value works in wei unit.
        require(msg.value.getConverionRate() >= MINIMUM_USD, "Not enough eth");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for(uint i=0; i<funders.length; i++){
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // send
        // bool sendSucess = payable(msg.sender).send(address(this).balance);
        // require(sendSucess, "Call Failed");

        // call
        (bool callSuccess,) = payable(msg.sender).call{value:address(this).balance}("");
        require(callSuccess, "Call Failed");
    }

    modifier onlyOwner {
        // require(msg.sender == i_owner);
        if(msg.sender == i_owner){
            revert NotOwner();
        }
        _;
    }

    receive() external payable { 
        fund();
    }

    fallback() external payable {
        fund();
     }

}