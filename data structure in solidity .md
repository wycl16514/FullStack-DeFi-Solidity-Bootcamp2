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
In aboved code, mapping is the map object provided by solidity, the data type for key is uint and data type for value is bool, then given an uint value, we can map it to true or false. Let's deploy it to
hardhat node and try the code aboved in console:

```js

```
