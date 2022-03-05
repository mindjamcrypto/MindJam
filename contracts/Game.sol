// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Game {
    struct Session {
        address player;
        uint256 timestamp;
        uint256 id;
        bool active;
    }

    Session[] sessions;
    mapping(address => uint256) playerLastSessionId;
    uint256 hintPrice;
    uint256 wordRevealPrice;
    address owner;

    event NewSessionStarted(address from, uint256 sessionId);
    event SessionEnded(address from, uint256 sessionId);
    event RequestHint(address from, uint256 sessionId);
    event RequestWordReveal(address from, uint256 sessionId);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

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
            "Only the player can terminate the session"
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

    // Withdraw the funds
    function withdraw(address payable _to) public onlyOwner {
        (bool sent, ) = _to.call{value: address(this).balance}("");
        require(sent, "Transaction failed!");
    }
}
