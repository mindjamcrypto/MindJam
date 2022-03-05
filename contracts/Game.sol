// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Game {
    // Holds the main data about each session
    struct Session {
        address player;
        uint256 timestamp;
        uint256 id;
        bool active;
    }

    Session[] sessions;
    // Couples a player's address to his last session
    mapping(address => uint256) playerLastSessionId;

    // Prices for showing hints and revealing words
    // defined in the constructor, can be later changed with set functions
    uint256 hintPrice;
    uint256 wordRevealPrice;

    // Owner of the contract, can change prices and withdraw funds
    address owner;

    event NewSessionStarted(address from, uint256 sessionId);
    event SessionEnded(address from, uint256 sessionId);
    event RequestHint(address from, uint256 sessionId);
    event RequestWordReveal(address from, uint256 sessionId);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Sets the prices and the owner
    constructor(uint256 _hintPrice, uint256 _wordRevealPrice) {
        hintPrice = _hintPrice;
        wordRevealPrice = _wordRevealPrice;
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
     * Functions called from the frontend when the player wants hints or word revealed
     */
    function requestHint(uint256 _sessionId) public payable {
        Session memory session = sessions[_sessionId]; // gas saver
        require(
            session.player == msg.sender,
            "Only the player can request hints!"
        );
        require(session.active, "This session has ended");
        require(
            msg.value >= hintPrice,
            "Insufficient amount to cover hint cost"
        );

        emit RequestHint(msg.sender, _sessionId);
    }

    function requestWordReveal(uint256 _sessionId) public payable {
        Session memory session = sessions[_sessionId]; // gas saver
        require(
            session.player == msg.sender,
            "Only the player can request hints!"
        );
        require(session.active, "This session has ended");
        require(
            msg.value >= wordRevealPrice,
            "Insufficient amount to cover word reveal cost"
        );

        emit RequestWordReveal(msg.sender, _sessionId);
    }

    /*
     * Ends the game session provided and calculates the total time taken to finish
     */
    function endSession(uint256 _sessionId) public returns (uint256 timeTaken) {
        Session memory session = sessions[_sessionId]; // gas saver
        require(session.active, "The session has already ended!");
        require(
            session.player == msg.sender,
            "Only the player can terminate the session" // QUESTION: does the player terminate the session or the onwer??
        );

        sessions[_sessionId].active = false;
        timeTaken = block.timestamp - session.timestamp;
        emit SessionEnded(msg.sender, _sessionId);
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

    function setHintPrice(uint256 _price) public onlyOwner {
        hintPrice = _price;
    }

    function setWordRevealPrice(uint256 _price) public onlyOwner {
        wordRevealPrice = _price;
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
