// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MindJam.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Handler of the crossword-type games
 * @dev This is to be used to create new crossword games
 */
contract Crosswords is ReentrancyGuard {
    address public owner;
    MindJam public mjToken;

    struct Crossword {
        uint256 squarePrice;
        uint256 wordPrice;
        uint256 challengePrize; // amount of token to be minted for winning the challenge
        address winner; // current prize winner
        bool winnerPaid;
        uint256 timestamp; // time at which the game was created
        uint256 id;
        uint256 recordTime; // The best time in which the game was finished
    }
    Crossword[] public crosswords;

    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner");
        _;
    }

    event RequestSquare(address from, uint256 crosswordId);
    event RequestWord(address from, uint256 crosswordId);

    constructor(address _tokenAddress) {
        owner = msg.sender;
        mjToken = MindJam(_tokenAddress);
    }

    /**
     * @dev Creates new crossword specifying the prices
     * @param _squarePrice Number of tokens required to request an hint
     * @param _wordPrice Number of tokens required to reveal a word
     * @param _challengePrize Number of tokens to be minted to who wins the 24 hour challenge
     * @return index The index of the newly created crossword
     */
    function newCrossword(
        uint256 _squarePrice,
        uint256 _wordPrice,
        uint256 _challengePrize
    ) external returns (uint256) {
        crosswords.push(
            Crossword(
                _squarePrice,
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
    function requestSquare(uint256 _id) external {
        require(_id < crosswords.length, "Index out of bound!");
        uint256 price = crosswords[_id].squarePrice;

        // Make sure the player has enough tokens
        require(
            mjToken.balanceOf(msg.sender) >= price,
            "You don't have enough tokens!"
        );

        // Check for allowance
        require(
            mjToken.allowance(msg.sender, address(this)) >= price,
            "Token spending not allowed!"
        );

        // Make the payment
        bool sent = mjToken.transferFrom(msg.sender, address(this), price);
        require(sent, "Payment failed!");

        emit RequestSquare(msg.sender, _id);
    }

    // Request a word reveal
    function requestWord(uint256 _id) external {
        require(_id < crosswords.length, "Index out of bound!");
        uint256 price = crosswords[_id].wordPrice;

        // Make sure the player has enough tokens
        require(
            mjToken.balanceOf(msg.sender) >= price,
            "You don't have enough tokens!"
        );

        // Check for allowance
        require(
            mjToken.allowance(msg.sender, address(this)) >= price,
            "Token spending not allowed"
        );

        // Make the payment
        bool sent = mjToken.transferFrom(msg.sender, address(this), price);
        require(sent, "Payment failed!");

        emit RequestWord(msg.sender, _id);
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
     * @return true if player has put a new record time and the challenge is still on
     */
    // HACK CONCERN: anyone can call this function!
    function endSession(
        uint256 _id,
        uint256 _time,
        address _player
    ) external returns (bool) {
        require(_time > 0, "Time can't be 0!");
        require(_id < crosswords.length, "Index out of bound!");

        Crossword memory crossword = crosswords[_id]; // gas saver
        if (!isChallengeOn(_id)) return false;

        // If it's the first time this game is played, or we have a new record
        // Record the new time and set the player as winner
        if (crossword.recordTime == 0 || _time < crossword.recordTime) {
            crosswords[_id].recordTime = _time;
            crosswords[_id].winner = _player;
            return true;
        }
        return false;
    }

    /**@dev Returns the address of the winner
     * @param _id the id of the crossword you want the winner of
     */
    function getWinner(uint256 _id) public view returns (address) {
        return crosswords[_id].winner;
    }

    /**
    @dev This function is called from the player's account to claim the winner's prize
    @param _id The identifier of the crossword
     */
    function payWinner(uint256 _id) external nonReentrant {
        Crossword memory crossword = crosswords[_id]; // gas saver
        require(
            msg.sender == crossword.winner,
            "You're not the winner of the challenge!"
        );
        require(!isChallengeOn(_id), "The challenge is still open!");
        require(!crossword.winnerPaid, "The winner has already been paid!");

        crosswords[_id].winnerPaid = true;
        bool sent = mjToken.transfer(msg.sender, crossword.challengePrize);
        require(sent, "Transaction rejected");
    }

    /**@dev Withdraw all the mJTokens to specified address
     */
    function withdraw(address _to) external onlyOwner {
        uint256 balance = mjToken.balanceOf(address(this));
        require(balance > 0, "No tokens to transfer");
        mjToken.transfer(_to, balance);
    }

    /** Given a crossword ID, it tells whether the winner has already been payed
     * @param _id ID of the crossword game
     * @return bool
     */
    function hasWinnerBeenPaid(uint256 _id) external view returns (bool) {
        return crosswords[_id].winnerPaid;
    }
}
