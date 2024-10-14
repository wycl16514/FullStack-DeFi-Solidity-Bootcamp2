// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleException {
    mapping(address => uint) public balanceReceived;

    receive() external payable {
        balanceReceived[msg.sender] += msg.value;
    }

    function receiveMoney() public payable {
        //not allow to receive more than 100 wei
        assert(msg.value <= 100);
        balanceReceived[msg.sender] += msg.value;
    }

    function withdrawMoney(address payable _to, uint _amount) public {
        require(
            _amount <= balanceReceived[msg.sender],
            "Not enought funds, aborting"
        );
        balanceReceived[msg.sender] -= _amount;
        _to.transfer(_amount);
    }

    string public errorReason;

    function errorHandling() public {
        WillFail will = new WillFail();
        //can only use function from other contract
        try will.failingFunction() {
            //code here if it works
        } catch Error(string memory reason) {
            errorReason = reason;
        }
    }

    uint public panicCode;

    function panicHandling() public {
        WillFail will = new WillFail();
        try will.assertFunction() {
            //if it works
        } catch Panic(uint code) {
            panicCode = code;
        }
    }
}

contract CallPayableFunction {
    receive() external payable {}

    // function callReceiveMoney(address _contract) public {
    //     SimpleException instance = SimpleException(_contract);
    //     instance.receiveMoney{value: 10, gas: 100000}();
    // }

    function callReceiveMoney2(address _contract) public {
        bytes memory payload = abi.encodeWithSignature("receiveMoney()");
        (bool success, ) = _contract.call{value: 100, gas: 100000}(payload);
        require(success);
    }

    function callReceiveMoney3(address _contract) public {
        (bool success, ) = _contract.call{value: 100, gas: 100000}("");
        require(success);
    }
}

contract WillFail {
    function failingFunction() public pure {
        require(false, "calling failing function");
    }

    function assertFunction() public pure {
        assert(false);
    }
}
