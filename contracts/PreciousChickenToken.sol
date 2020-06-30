// SPDX-License-Identifier: The Unlicencse
pragma solidity ^0.6.1;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PreciousChickenToken is ERC20 {

    event TokenTransfer (
        address from,
        address to,
        uint256 amount
    );

    address private owner;
    uint conversionRate;
    mapping (address => uint) pendingWithdrawals;
   
    constructor(uint _initialSupply) public ERC20("PreciousChickenToken", "PCT") {
        _mint(msg.sender, _initialSupply);
        owner = msg.sender;
    }

    function buyToken(uint256 _amount) external payable {
        require(_amount == ((msg.value / 1 ether)), "Incorrect amount of Eth.");
        transferFrom(owner, msg.sender, _amount);
        emit TokenTransfer(owner, msg.sender, _amount);
    }
    
    function sellToken(uint256 _amount) public {
        pendingWithdrawals[msg.sender] = _amount;
        transfer(owner, _amount);
        withdrawEth();
        emit TokenTransfer(msg.sender, owner, _amount);
    }

     function withdrawEth() public {
        uint amount = pendingWithdrawals[msg.sender];
        // Pending refund zerod before to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount * 1 ether);
    }
}





// This works!!!!!!!!!!!!!!!!
// Get instance of contract
// token = await PreciousChickenToken.deployed()
// Increase allowance
// token.increaseAllowance(accounts[1], 10, {from: accounts[0]}) 
// Buy tokens
// token.buyToken(3, {from: accounts[1], value: 3000000000000000000})
// Shows ETH in token (should be same as value above)
// balancetoken = await web3.eth.getBalance(token.address) 
// console.log(balancetoken)
// Shows ETH in accounts[1] - should be 100 Eth minus value above
// balanceaccount1 = await web3.eth.getBalance(accounts[1])
// console.log(balanceaccount1)
// Shows tokens in contract - should be 993
// token.balanceOf(accounts[0])
// Shows tokens in account 1- should be 7
// token.balanceOf(accounts[1])
// Sell one tokens from account[1]
// token.sellToken(1, {from: accounts[1], value: 0})
// Shows tokens in account 1- should be 6
// token.balanceOf(accounts[1])

// General notes:
//     address of contract:
//     token.address
