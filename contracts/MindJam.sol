//SPDX-License-Identifier: MIT

// Fungible Token ecosystem used to help build loyalty through play to earn tactics
// Token: MINDJAM
// These tokens will be granted when users submit their game for prize consideration.
// These tokens can be used for paid functions in the dapp (e.g. reveal word)
// Minting: 10 million

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MindJam is ERC20, Pausable, Ownable {
    constructor() ERC20("MindJam", "MINDJAM") {
        _mint(msg.sender, 10000000 * 10**decimals());
    }

    //The Owner will be able to pause the functionality
    //marked as whenNotPaused. Useful for emergency response.
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    //The Owner will be able to create more supply.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    //Function overridden to check for paused state.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
