// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Handler of the crossword-type games
 * @dev This is to be used to create new crossword games
 */
contract Crosswords {
    address public owner;

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

    constructor() {
        owner = msg.sender;
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
     * @dev Used to check if the 24 hours challenge is still active
     * @param _id id of the crossword game you want to check
     */
    function isChallengeOn(uint256 _id) public view returns (bool) {
        return (block.timestamp - crosswords[_id].timestamp) <= 24 hours;
    }
}
