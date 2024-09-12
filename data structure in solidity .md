If you have experiences for other programming language, you will know several complex data structures like vector, map, struct. Solidity provided them too. Let's try the map first. Create a sol file and name it
MappingExample.sol and have the following code:

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract MappingExample {
    mapping(uint => bool) public myMapping;

    function setValue(uint _val) public {
        myMapping[_val] = true;
    }
}

```
In aboved code, mapping is the map object provided by solidity, the data type for key is uint and data type for value is bool, then given an uint value, we can map it to true or false. Let's deploy it to hardhat node and try the code aboved in console:

```js
> const contract = await ethers.getContractAt("MappingExample", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
undefined
> await contract.setValue(1)
> await contract.myMapping(1)
true
> await contract.myMapping(2)
false
```
As you can see, if the given key is not in the map, then the value for the given key is false. we can even create a mapping to mapping as following:
```sol
contract MappingExample {
    mapping(uint => bool) public myMapping;
    mapping(uint => mapping(uint => bool)) public uint2uintBoolMapping;

    function setValue(uint _val) public {
        myMapping[_val] = true;
    }

    function getValueMapping(uint _val) public view returns (bool) {
        return myMapping[_val];
    }

    function setUint2UintBoolMapping(uint _key1, uint _key2, bool _val) public {
        uint2uintBoolMapping[_key1][_key2] = _val;
    }
}
```
Deploy the contract and we try it like following:
```js
> const contract1 = await ethers.getContractAt("MappingExample", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9")
undefined
> await contract1.setUint2UintBoolMapping(1, 2, true)
> await contract1.uint2uintBoolMapping(1,2)
true
```

