// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Donator{
    address payable public owner;
    mapping(address=>uint) public contributors;
    address[] public donaters;

    event NewDonate(address _from, uint _amount);
    event FullRefund(address _who);
    event NewTransfer(address _to, uint _amount);

    error Unauthorized();
    error NotEnoughEther();

    // for test
    int dd = 12;

    receive() external payable {}
    fallback() external payable {}


    constructor(){
        owner = payable(msg.sender);
    // for test
        contributors[0xccA210e7C05322379F801a07F320E863efE68f80] += 1 ether ;
    }

    modifier onlyBy(address _account)
    {
        if (msg.sender != _account)
            revert Unauthorized();
        _;
    }

    function changeOwner(address _newOwner) public onlyBy(owner){
        owner = payable(_newOwner);
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

    function donate() public payable {
        contributors[msg.sender] += msg.value;
        donaters.push(msg.sender);
        emit NewDonate(msg.sender,msg.value);
    }

    function withdraw(address payable _to, uint _amount) public onlyBy(owner){
        _to.transfer(_amount);
        emit NewTransfer(_to,_amount);
    }
    
    function getSumOfDonater(address _of) public view returns(uint){
        return(contributors[_of]);
    }
}