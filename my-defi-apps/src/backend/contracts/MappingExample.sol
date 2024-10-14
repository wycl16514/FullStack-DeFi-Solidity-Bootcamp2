// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract MappingExample {
    mapping(uint => bool) public myMapping;
    mapping(uint => mapping(uint => bool)) public uint2uintBoolMapping;

    struct PaymentRecordStruct {
        address from;
        uint amount;
    }

    PaymentRecordStruct public paymentStruct;

    function payContractWithStruct() public payable {
        paymentStruct = PaymentRecordStruct(msg.sender, msg.value);
    }

    PaymentRecord public payment;

    function payContract() public payable {
        payment = new PaymentRecord(msg.sender, msg.value);
    }

    function setValue(uint _val) public {
        myMapping[_val] = true;
    }

    function setUint2UintBoolMapping(uint _key1, uint _key2, bool _val) public {
        uint2uintBoolMapping[_key1][_key2] = _val;
    }
}

contract PaymentRecord {
    address public from;
    uint public amount;

    constructor(address _from, uint _amount) {
        from = _from;
        amount = _amount;
    }
}
