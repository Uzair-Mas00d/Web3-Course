// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint) {
        // ABI 
        // address 0x694AA1769357215DE4FAC081bf1f309aDC325306
        (,int256 price,,,) = priceFeed.latestRoundData();
        // ETH in term of USD
        // 3000.00000000

        return uint256(price * 1e10); // to match decimal of price and msg.value
    }

    function getConverionRate(uint ethAmount,AggregatorV3Interface priceFeed) internal view returns(uint) {
        uint ethPrice = getPrice(priceFeed);
        uint ethAmountInUsd = (ethPrice * ethAmount) / 1e18;

        return ethAmountInUsd;
    }
}

