const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;

	const { deployer } = await getNamedAccounts();

	log("Deploying Competition Contract...");

	let blocksCon = 1;
	if (!network.name.includes(developmentChains)) blocksCon = 6;

	const competition = await deploy("Competition", {
		from: deployer,
		ars: [],
		log: true,
		waitConfirmations: blocksCon,
	});

	log("============================================================");

	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		// verify
		await verify(competition.address, []);
	}
};

module.exports.tags = ["competition"];
