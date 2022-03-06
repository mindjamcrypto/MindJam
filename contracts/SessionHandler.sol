// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MindJam.sol";
import "./Crosswords.sol";

contract SessionHandler {
    // All the different kinds of games
    enum GameType {
        CROSSWORD
    }

    // Holds the main data about each session
    struct Session {
        GameType gameType;
        address gameContractAddress;
        uint256 gameId;
        address player;
        uint256 timestamp;
        uint256 id;
        bool active;
    }

    MindJam public mjToken;
    Session[] public sessions;
    // Couples a player's address to his last session
    mapping(address => uint256) public playerLastSessionId;

    // Owner of the contract, can change prices and withdraw funds
    address public owner;

    event NewSessionStarted(address from, uint256 sessionId);
    event SessionEnded(address from, uint256 sessionId);
    event NewRecord(address player, uint256 crosswordId, uint256 time);

    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner of the contract");
        _;
    }

    modifier onlyPlayer(uint256 _sessionId) {
        require(
            msg.sender == sessions[_sessionId].player,
            "You are not the player of this session!"
        );
        _;
    }

    // Sets the owner and the MindJam token address
    constructor(address _tokenAddress) {
        mjToken = MindJam(_tokenAddress);
        owner = msg.sender;
    }

    /**
     * @dev Starts a new session and registers the timestamp at which the game started
     * @dev to later calculate how much time it takes the player to finish the game
     * @param _gameType This refers to the enum GameType previously defined, the uint
     * type is converted in the enum type (crossword is currently 0)
     * @param _gameContractAddress The addres of the game contract
     * @param _gameId The id that identifies the game in its own contract
     */
    function startSession(
        uint256 _gameType,
        address _gameContractAddress,
        uint256 _gameId
    ) public {
        Session memory session = Session(
            GameType(_gameType),
            _gameContractAddress,
            _gameId,
            msg.sender,
            block.timestamp,
            sessions.length,
            true
        );
        sessions.push(session);
        playerLastSessionId[msg.sender] = session.id;
        emit NewSessionStarted(msg.sender, session.id);
    }

    /**
     * Ends the game session provided and calculates the total time taken to finish
     * @dev only the owner can call this function
     */
    function endSession(uint256 _sessionId)
        public
        onlyOwner
        returns (uint256 timeTaken)
    {
        Session memory session = sessions[_sessionId]; // gas saver
        require(session.active, "The session has already ended!");

        sessions[_sessionId].active = false;
        timeTaken = block.timestamp - session.timestamp;
        emit SessionEnded(msg.sender, _sessionId);

        // Checks for the 24 hour challenge
        if (session.gameType == GameType.CROSSWORD) {
            Crosswords crosswords = Crosswords(session.gameContractAddress); // Gets the instance of the crossword game
            if (
                crosswords.isChallengeOn(session.gameId) &&
                crosswords.newTime(session.gameId, timeTaken, session.player)
            ) {
                emit NewRecord(session.player, session.gameId, timeTaken);
            }
        }
    }

    // Some helper methods
    function getLastSession()
        external
        view
        returns (
            uint256 gameType,
            address gameContractAddress,
            uint256 gameId,
            address player,
            uint256 timestamp,
            uint256 id,
            bool active
        )
    {
        return getSessionById(sessions.length - 1);
    }

    function getSessionById(uint256 _id)
        public
        view
        returns (
            uint256 gameType,
            address gameContractAddress,
            uint256 gameId,
            address player,
            uint256 timestamp,
            uint256 id,
            bool active
        )
    {
        Session memory session = sessions[_id];
        gameType = uint256(session.gameType);
        gameContractAddress = session.gameContractAddress;
        gameId = session.gameId;
        player = session.player;
        timestamp = session.timestamp;
        id = session.id;
        active = session.active;
    }

    function getPlayerLastSessionId(address _player)
        external
        view
        returns (uint256)
    {
        return playerLastSessionId[_player];
    }

    // Withdraw the funds to specified address
    // TODO withdraw tokens
    function withdraw(address payable _to) public onlyOwner {
        bool sent = mjToken.transfer(_to, mjToken.balanceOf(address(this)));
        require(sent, "Transaction failed!");
    }
}
