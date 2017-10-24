var GnosisSafeFactory = artifacts.require("./GnosisSafeFactory.sol");
var GnosisSafeWithDescriptionsFactory = artifacts.require("./GnosisSafeWithDescriptionsFactory.sol");
var DailyLimitExceptionFactory = artifacts.require("./exceptions/DailyLimitExceptionFactory.sol");
var WhitelistExceptionFactory = artifacts.require("./exceptions/WhitelistExceptionFactory.sol");
var LastResortExceptionFactory = artifacts.require("./exceptions/LastResortExceptionFactory.sol");
var DelayedExecutionConditionFactory = artifacts.require("./exceptions/DelayedExecutionConditionFactory.sol");

var GnosisSafeWithDescriptions = artifacts.require("./GnosisSafeWithDescriptions.sol");

module.exports = function(deployer) {
  	const args = process.argv.slice()
    deployer.deploy(GnosisSafeFactory);
    deployer.deploy(GnosisSafeWithDescriptionsFactory);
    deployer.deploy(DailyLimitExceptionFactory);
    deployer.deploy(WhitelistExceptionFactory);
    deployer.deploy(LastResortExceptionFactory);
    deployer.deploy(DelayedExecutionConditionFactory);
    console.log("Factory with Daily Limit deployed");
    
  	if (args.length == 5) {
    	deployer.deploy(GnosisSafeWithDescriptions, args[3].split(","), args[4]);
    	console.log("Gnosis Safe with Descriptions deployed");
  	}
};