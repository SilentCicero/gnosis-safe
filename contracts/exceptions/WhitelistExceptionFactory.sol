pragma solidity 0.4.17;
import "./WhitelistException.sol";


contract WhitelistExceptionFactory {

    event WhitelistExceptionCreation(GnosisSafe gnosisSafe, WhitelistException whitelistException);

    function addException(Exception exception)
        public
    {
        revert();
    }

    function create(address[] whitelist)
        public
        returns (WhitelistException whitelistException)
    {
        whitelistException = new WhitelistException(whitelist);
        WhitelistExceptionCreation(GnosisSafe(this), whitelistException);
        this.addException(whitelistException);
    }
}
