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
    uint256 hintPrice;
    uint256 wordRevealPrice;
    address owner;

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
    }

    function requestHint(uint256 _sessionId) public payable {
        Session memory session = sessions[_sessionId]; // gas saver
        require(session.player == msg.sender && session.active);
        require(msg.value >= hintPrice);
        emit RequestHint(msg.sender, _sessionId);
    }

    function requestWordReveal(uint256 _sessionId) public payable {
        Session memory session = sessions[_sessionId]; // gas saver
        require(session.player == msg.sender && session.active);
        require(msg.value >= wordRevealPrice);
        emit RequestWordReveal(msg.sender, _sessionId);
    }

    /*
     * Ends the game session provided and calculates the total time taken to finish
     */
    function endSession(uint256 _sessionId) public returns (uint256 timeTaken) {
        Session memory session = sessions[_sessionId]; // gas saver
        require(session.active && session.player == msg.sender);

        sessions[_sessionId].active = false;
        timeTaken = block.timestamp - session.timestamp;
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
}
