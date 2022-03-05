// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SessionHandler {
    // Holds the main data about each session
    struct Session {
        address player;
        uint256 timestamp;
        uint256 id;
        bool active;
    }

    struct Crossword {
        uint256 hintPrice;
        uint256 wordPrice;
        uint256 creationTimestamp;
        uint256 id;
    }

    Session[] public sessions;
    Crossword[] public crosswords;
    // Couples a player's address to his last session
    mapping(address => uint256) public playerLastSessionId;

    // Owner of the contract, can change prices and withdraw funds
    address public owner;

    event NewSessionStarted(address from, uint256 sessionId);
    event SessionEnded(address from, uint256 sessionId);
    event RequestHint(address from, uint256 sessionId);
    event RequestWordReveal(address from, uint256 sessionId);

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

    // Sets the prices and the owner
    constructor() {
        owner = msg.sender;
    }

    /*
     * Starts a new session and registers the timestamp at which the game started
     * to later calculate how much time it takes the player to finish the game
     */
    function startSession() public {
        Session memory session = Session(
            msg.sender,
            block.timestamp,
            sessions.length,
            true
        );
        sessions.push(session);
        playerLastSessionId[msg.sender] = session.id;
        emit NewSessionStarted(msg.sender, session.id);
    }

    /*
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
    }

    // Request an hint
    function requestHint(uint256 _sessionId) public onlyPlayer(_sessionId) {
        // TODO: make token payment
        emit RequestHint(msg.sender, _sessionId);
    }

    // Request a word reveal
    function requestWord(uint256 _sessionId) public onlyPlayer(_sessionId) {
        // TODO: make token payment
        emit RequestWordReveal(msg.sender, _sessionId);
    }

    // Some helper methods
    function getLastSession()
        public
        view
        returns (
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
            address player,
            uint256 timestamp,
            uint256 id,
            bool active
        )
    {
        Session memory session = sessions[_id];
        player = session.player;
        timestamp = session.timestamp;
        id = session.id;
        active = session.active;
    }

    function getPlayerLastSessionId(address _player)
        public
        view
        returns (uint256)
    {
        return playerLastSessionId[_player];
    }

    // Withdraw the funds to specified address
    function withdraw(address payable _to) public onlyOwner {
        (bool sent, ) = _to.call{value: address(this).balance}("");
        require(sent, "Transaction failed!");
    }
}
