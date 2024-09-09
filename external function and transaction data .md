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

There is another external function like receive, its name is fallback, let change the code like following:
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

    fallback() external payable {
        lastValueSent = msg.value;
        lastFunctionCalled = "fallback";
    }
}

```
Compile and depoly the aboved contract, now the question is, how can we enable the fallback to be called, let's try as following:
```js
const [fallbackOwner] = await ethers.getSigners()
await fallbackOwner.sendTransaction({to:"0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e", value:ethers.parseEther("1.5"), data:"0xabcd"})
> const fallbackContract = await ethers.getContractAt("SimpleContract","0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e")
undefined
> await fallbackContract.lastFunctionCalled()
'fallback'
> await fallbackContract.lastValueSent()
1500000000000000000n
```
As you can see, compare with before we enable the calling of receive, this time we set the field of data in sendTransaction, that's exactly to decide which one in receive and fallback to
be called, if the data field is empty, then the receive will be call, if the dta field is not empty, then the fallback is called. But if the contract dose not have the receive function,
and only have the fallback function, then the fallback will be called no matter we set the data field or not, try it as your homework.

Now let's see a funny thing, we change the code of contract as following:
```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract SimpleContract {
    string public lastFunctionCalled;
    uint public lastValueSent;

    uint public myUint;

    function setMyUint(uint _val) public {
        myUint = _val;
    }

    receive() external payable {
        lastFunctionCalled = "receive";
        lastValueSent = msg.value;
    }

    fallback() external payable {
        lastValueSent = msg.value;
        lastFunctionCalled = "fallback";
    }
}
```
Compile and deploy it, then in the console, let's get the contract and call the setMyUint function as following:
```sol
> const newSimpleContract = await ethers.getContractAt("SimpleContract", "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82")
> await newSimpleContract.setMyUint(1234);
ContractTransactionResponse {
  provider: HardhatEthersProvider {
    _hardhatProvider: LazyInitializationProviderAdapter {

    ....

    maxPriorityFeePerGas: 36850156n,
  maxFeePerGas: 153696697n,
  maxFeePerBlobGas: null,
  data: '0xe492fd8400000000000000000000000000000000000000000000000000000000000004d2',
  value: 0n,
  chainId: 31337n,
  signature: Signature { r: "0x9e7d961977c6b3231495048474cb1f74b529e2055e84ac4ca8ddc170456e1121", s: "0x18bbf974d3f3e96435fcc1b55a3336d737af3f141110cc0f05de670f32fbdd30", yParity: 0, networkV: null },
```
Could you see the data field aboved, its value is "0xe492fd8400000000000000000000000000000000000000000000000000000000000004d2", remember the value we pass to the function is 1234, and 
its hex format is 0x4d2 which is exactly the same as the last several digits for the value, is this coincidental? Let's try to change the last four digits from 04d2 to 162e, which is the
hex format of value 5678, and we put it as the value of data field in sendTransaction as following:
```js
> const [contractOwner2] = await ethers.getSigners()
>await contractOwner2.sendTransaction({to:"0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82", value:ethers.parseEther("0"), data:"0xe492fd84000000000000000000000000000000000000000000000000000000000000162E"})
>const simpleContract2 = ethers.getContractAt("SimpleContract", "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82")
>await simpleContract2.myUint()
5678n
```
As you can see, sendTransaction with given data is just like calling setMyUint() function with value 5678! Actually the value for the data field at the beginning "0xe492fd84" is called
the signature of function setMyUint(), if we use web3.util.sha3 hash to compute the result of "setMyUint(uint256)", then for the first 4 bytes of the result would be "0x4e92fd84",

