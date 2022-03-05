// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MindJam.sol";

/**
 * @title Handler of the crossword-type games
 * @dev This is to be used to create new crossword games
 */
contract Crosswords {
    address public owner;
    MindJam public mjToken;

    struct Crossword {
        uint256 hintPrice;
        uint256 wordPrice;
        uint256 timestamp; // time at which the game was created
        uint256 id;
    }
    Crossword[] crosswords;

    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner");
        _;
    }

    event RequestHint(address from, uint256 crosswordId);
    event RequestWordReveal(address from, uint256 crosswordId);

    constructor(address _tokenAddress) {
        owner = msg.sender;
        mjToken = MindJam(_tokenAddress);
    }

    /**
     * @dev Creates new crossword specifying the prices
     * @param _hintPrice Number of tokens required to request an hint
     * @param _wordPrice Number of tokens required to reveal a word
     * @return id of the crossword
     */
    function newCrossword(uint256 _hintPrice, uint256 _wordPrice)
        public
        returns (uint256)
    {
        crosswords.push(
            Crossword(
                _hintPrice,
                _wordPrice,
                block.timestamp,
                crosswords.length
            )
        );
        return crosswords.length - 1;
    }

    /**
     * Requests an hint
     * @param _id the id of the crossword for which the hint is requested
     */
    function requestHint(uint256 _id) public {
        uint256 price = crosswords[_id].hintPrice;

        // Check for allowance
        require(
            mjToken.allowance(msg.sender, address(this)) >= price,
            "Token spending not allowed!"
        );

        // Make the payment
        bool sent = mjToken.transferFrom(msg.sender, address(this), price);
        require(sent, "Payment failed!");

        emit RequestHint(msg.sender, _id);
    }

    // Request a word reveal
    function requestWord(uint256 _id) public {
        uint256 price = crosswords[_id].wordPrice;

        // Check for allowance
        require(
            mjToken.allowance(msg.sender, address(this)) >= price,
            "Token spending not allowed"
        );

        // Make the payment
        bool sent = mjToken.transferFrom(msg.sender, address(this), price);
        require(sent, "Payment failed!");

        emit RequestWordReveal(msg.sender, _id);
    }

    /**
     * @dev Used to check if the 24 hours challenge is still active
     * @param _id id of the crossword game you want to check
     */
    function isChallengeOn(uint256 _id) public view returns (bool) {
        return (block.timestamp - crosswords[_id].timestamp) <= 24 hours;
    }
}
