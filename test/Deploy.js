const { expect } = require("chai");
const { ethers } = require("hardhat");
const { Contract } = require("hardhat/internal/hardhat-network/stack-traces/model");

describe("Donator contract", function(){
    let Donator;
    let donator;
    let owner;
    let addr1;
    let addr2;

    this.beforeEach(async function(){
        Donator = await ethers.getContractFactory("Donator");

        [owner,addr1,addr2] = await ethers.getSigners();

        donator = await Donator.deploy();
        await donator.deployed();     
    })
    it("Should be successfully deployed", async function (){
        console.log("success!");
    })
    it("Should accepts ether in msg.value", async function(){
        expect((await donator.getBalance())).to.equal(ethers.BigNumber.from(0));
        await donator.connect(addr1).donate({
            value: ethers.utils.parseEther("0.5")
        });
        expect((await donator.getBalance())).to.equal(ethers.utils.parseEther("0.5"));
    })
    it("Funds can be withdraw to another account by owner", async function(){
        const transactionHash = await donator.connect(addr1).donate({
            value: ethers.utils.parseEther("0.5")
        });
        await donator.withdraw(owner.address, ethers.utils.parseEther("0.5"));
        expect((await donator.getBalance())).to.equal(ethers.BigNumber.from(0));
    })
    it("Not owner can't do this", async function(){
        expect(await donator.owner()).to.equal(owner.address);
        await donator.connect(addr1).donate({
            value: ethers.utils.parseEther("1.0")
        });
        await expect(donator.connect(addr1).withdraw(owner.address, ethers.utils.parseEther("1.0"))).to.be.reverted;
    })
    it("Stores contributors addresses and payments", async function() {
        await donator.connect(owner).donate({
            value: ethers.utils.parseEther("1.0")
        });
        await donator.connect(addr1).donate({
            value: ethers.utils.parseEther("1.0")
        });
        const a = await donator.donaters[0];
        console.log(a);
        // const b = donator.contributors[0xccA210e7C05322379F801a07F320E863efE68f80];
        const b = await donator.getSumOfDonater(ethers.utils.getAddress("0xccA210e7C05322379F801a07F320E863efE68f80"));
        console.log(b);
        console.log(donator.dd);
        // тут хочу сравнить значение в мапе с тем, что отправил, но не знаю как(((((
        expect((await donator.donaters[0])).to.equal(owner.address);
    })
})