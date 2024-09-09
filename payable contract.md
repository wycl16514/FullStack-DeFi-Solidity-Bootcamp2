In this section, we will see how to dive deep into  contract that can send and receive money. Contract that can act like a bank account is  backbone for DeFi application, we have involved such
contract before, and this time we will look at more details.

Let's create a simple contract first, we will build more functions on it, create a contract named SimpleContract.sol and add following:
```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract SimpleContract {
    string public myString = "Hello World";

    function updateString(string memory _str) public {
        myString = _str;
    }
}

```
Then add its deploy script with name deploy_simple_contract.js:
```js
const { ethers } = require("hardhat")
async function main() {
    const [deployer] = await ethers.getSigners()
    const dataTypeContractFactory = await ethers.getContractFactory("SimpleContract")
    const contract = await dataTypeContractFactory.deploy()
    await contract.waitForDeployment()

    console.log("Manager contract address: ", contract.target)
    console.log("Manager address: ", deployer.address)
}

try {
    main()
} catch (err) {
    console.err(err)
    process.exitCode = 1
}
```
Start the testing local network with "npx hardhat node" then compile the contract and deploy it， then we can call its function as following:
```js
> await simpleContract.myString()
'Hello World'
> await simpleContract.updateString("Goodbye world")
> await simpleContract.myString()
'Goodbye world'
> 
```
Now we require that, only those pay for more thant 1 eth can they update the string, we have seen how to make a function receive money before, that is we can using the payable keyword as 
following:
```sol
contract SimpleContract {
    string public myString = "Hello World";

    function updateString(string memory _str) public payable {
        require(msg.value >= 1 ether);
        myString = _str;
    }
}
```
We use payable keyword to mark the function can receive money, and we use the require macro to make sure the money received by the function can't less than 1 eth,if it dose lower than 1 
ether, the require macro will throw an exception. Redeploy the contract and let's try to call the function with money less thant 1 ether:
```js
> const payableFunc = await ethers.getContractAt("SimpleContract","0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
> await payableFunc.updateString("Goodbye world",{value:ethers.parseEther("0.5")})
Uncaught ProviderError: Error: Transaction reverted without a reason string
```
As you can see, when we send 0.5 ether to call the updateString function, it cause an error, but if we call it with more than 1 ether, then the calling will result ok:
```js
> await payableFunc.updateString("Goodbye world",{value:ethers.parseEther("1.5")})
> await payableFunc.myString()
'Goodbye world'
```
Now let's introduce some element that is the receive function for a contract, a contract can have a special receive function, and this function can only be called from outside that is you
can't use you code to call this function, let's check the code:
```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract SimpleContract {
    string public lastFunctionCalled;
    uint public lastValueSent;

    receive() external payable {
        lastFunctionCalled = "receive";
        lastValueSent = msg.value;
    }

}
```
As we can see there is a external keyword for the receives function, this keyword used to mark the function as a kind of callback, which means this function is to be call by our call, it will
be called automatically by the blockchain if there is a transaction send to the given contract. Compile and deploy the aboved contract,remember to record the deployed contract address , 
we need it in running commands at hardhat console:
```js
> const [receivableOwner] = await ethers.getSigners()
undefined
> await receivableOwner.sendTransaction({to:"0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6", value:ethers.parseEther("3.0")})
> const receivableContract = await ethers.getContractAt("SimpleContract", "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6")
> const receivableContract = await ethers.getContractAt("SimpleContract", "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6")
```
As we can see from aboved, we use the signers to send a transaction with value of to ethers to contract with given address of "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6", this address is
the address of my deployed contract aboved, then I call the contract to get the value of lastFunctioncalled and lastValueSent, there values are set which proofs that the receive function
has been called, but of course the caller is not us since we never call this function in the console.
