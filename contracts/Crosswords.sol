// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MindJam.sol";
import "./SessionHandler.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Handler of the crossword-type games
 * @dev This is to be used to create new crossword games
 */
contract Crosswords is ReentrancyGuard {
    address public owner;
    MindJam public mjToken;
    SessionHandler sessionHandler;

    struct Crossword {
        uint256 hintPrice;
        uint256 wordPrice;
        uint256 challengePrize; // amount of token to be minted for winning the challenge
        address winner; // current prize winner
        bool winnerPaid;
        uint256 timestamp; // time at which the game was created
        uint256 id;
        uint256 recordTime; // The best time to finish the game, in seconds
    }
    Crossword[] crosswords;

    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner");
        _;
    }

    modifier onlySessionHandler() {
        require(
            msg.sender == address(sessionHandler),
            "Only the session handler can call this function!"
        );
        _;
    }

    event RequestHint(address from, uint256 crosswordId);
    event RequestWordReveal(address from, uint256 crosswordId);

    constructor(address _tokenAddress, address _sessionHandlerAddress) {
        owner = msg.sender;
        mjToken = MindJam(_tokenAddress);
        sessionHandler = SessionHandler(_sessionHandlerAddress);
    }

    /**
     * @dev Creates new crossword specifying the prices
     * @param _hintPrice Number of tokens required to request an hint
     * @param _wordPrice Number of tokens required to reveal a word
     * @param _challengePrize Number of tokens to be minted to who wins the 24 hour challenge
     * @return id of the crossword
     */
    function newCrossword(
        uint256 _hintPrice,
        uint256 _wordPrice,
        uint256 _challengePrize
    ) public returns (uint256) {
        crosswords.push(
            Crossword(
                _hintPrice,
                _wordPrice,
                _challengePrize,
                address(0), // winner addres initialized to 0
                false, // winner has not been payed yet
                block.timestamp, // time of creation of the crossword
                crosswords.length, // crossword id
                0 // record time initialized to 0
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

    /**
     * @dev this function is called each time one player ends a session
     * @dev checks wether he's made a new record
     * @param _id The identifier of the crossword
     * @param _time The time it took the player
     * @param _player The player of the session
     */
    function newTime(
        uint256 _id,
        uint256 _time,
        address _player
    ) public onlySessionHandler returns (bool) {
        Crossword memory crossword = crosswords[_id]; // gas saver
        require(isChallengeOn(_id), "The challenge for this game is over!");

        if (crossword.recordTime == 0 || _time < crossword.recordTime) {
            crosswords[_id].recordTime = _time;
            crosswords[_id].winner = _player;
            return true;
        } else return false;
    }

    /**
    @dev This function is called by the frontend from the player's account to claim the winner's prize
    @param _id The identifier of the crossword
     */
    function payWinner(uint256 _id) public nonReentrant {
        Crossword memory crossword = crosswords[_id]; // gas saver
        require(
            msg.sender == crossword.winner,
            "You're not the winner of the challenge!"
        );
        require(!isChallengeOn(_id), "The challenge is still open!");
        require(!crossword.winnerPaid, "The winner has already been paid!");

        crosswords[_id].winnerPaid = true;
        bool sent = mjToken.mint(crossword.winner, crossword.challengePrize);
        require(sent, "Transaction failed!");
    }
}
