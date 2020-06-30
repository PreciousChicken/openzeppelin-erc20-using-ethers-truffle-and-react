var PreciousChickenToken = artifacts.require("PreciousChickenToken");

module.exports = function(deployer) {
	// Arguments are: contract, initialSupply
  deployer.deploy(PreciousChickenToken, 1000);
};
