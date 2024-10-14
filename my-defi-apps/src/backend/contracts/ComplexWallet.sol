// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract ComplexWallet {
    struct Transaction {
        uint amount;
        uint timestamp;
    }

    struct Balance {
        //total saving for given user
        uint totalBalance;
        //how many deposits made by user
        uint numDeposits;
        //given the transaction number, return info about the transaction
        mapping(uint => Transaction) deposits;
        //how many withdraw made by the user
        uint numWithdrawls;
        //given the withdraw number, return info about the withdraw
        mapping(uint => Transaction) withdrawals;
    }

    mapping(address => Balance) balances;

    function saveMoney() public payable {
        balances[msg.sender].totalBalance += msg.value;
        Transaction memory deposit = Transaction(msg.value, block.timestamp);
        balances[msg.sender].deposits[
            balances[msg.sender].numDeposits
        ] = deposit;
        balances[msg.sender].numDeposits += 1;
    }

    function getDepositNum(
        address _from,
        uint _numDeposit
    ) public view returns (Transaction memory) {
        return balances[_from].deposits[_numDeposit];
    }

    function getMoney(address payable _to, uint _amount) public {
        require(balances[msg.sender].totalBalance >= _amount);
        Transaction memory withdraw = Transaction(_amount, block.timestamp);
        balances[msg.sender].withdrawals[
            balances[msg.sender].numWithdrawls
        ] = withdraw;
        balances[msg.sender].numWithdrawls += 1;
        _to.transfer(_amount);
    }
}
