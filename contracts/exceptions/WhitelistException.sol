pragma solidity 0.4.17;
import "../Exception.sol";
import "../GnosisSafe.sol";


/// @title Whitelist Exception - Allows to execute transactions to whitelisted addresses without confirmations.
/// @author Stefan George - <stefan@gnosis.pm>
contract WhitelistException is Exception {

    event WhitelistAddition(address account);
    event WhitelistRemoval(address account);

    string public constant NAME = "Whitelist Exception";
    string public constant VERSION = "0.0.1";

    GnosisSafe public gnosisSafe;
    mapping (address => bool) public isWhitelisted;

    modifier onlyGnosisSafe() {
        require(msg.sender == address(gnosisSafe));
        _;
    }

    function WhitelistException(address[] accounts)
        public
    {
        gnosisSafe = GnosisSafe(msg.sender);
        for (uint i = 0; i < accounts.length; i++) {
            require(accounts[i] != 0);
            isWhitelisted[accounts[i]]= true;
            WhitelistAddition(accounts[i]);
        }
    }

    function addToWhitelist(address account)
        public
        onlyGnosisSafe
    {
        require(   account != 0
                && !isWhitelisted[account]);
        isWhitelisted[account] = true;
        WhitelistAddition(account);
    }

    function removeFromWhitelist(address account)
        public
        onlyGnosisSafe
    {
        require(isWhitelisted[account]);
        isWhitelisted[account] = false;
        WhitelistRemoval(account);
    }

    function isExecutable(address sender, address to, uint value, bytes data, GnosisSafe.Operation operation)
        public
        returns (bool)
    {
        require(gnosisSafe.isOwner(sender));
        if (isWhitelisted[to])
            return true;
        return false;
    }
}
