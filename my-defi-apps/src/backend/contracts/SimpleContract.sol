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
        lastFunctionCalled = "fallback";
        lastValueSent = msg.value;
    }
}
