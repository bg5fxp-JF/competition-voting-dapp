const { deployments, network } = require("hardhat");
require("dotenv").config();
const fs = require("fs");

const FRONTEND_ADDRESSES_FILE =
	"../frontend/src/app/constants/contractAddresses.json";
const FRONTEND_ABI_FILE = "../frontend/src/app/constants/abi.json";

async function updateAbi() {
	const competitionAbi = (await deployments.fixture(["competition"]))
		.Competition.abi;

	fs.writeFileSync(FRONTEND_ABI_FILE, JSON.stringify(competitionAbi));
}

async function updateContractAddresses() {
	const competitionAddress = (await deployments.fixture(["competition"]))
		.Competition.address;
	const chainId = network.config.chainId.toString();
	const currentAddress = JSON.parse(
		fs.readFileSync(FRONTEND_ADDRESSES_FILE, "utf8")
	);
	if (chainId in currentAddress) {
		if (!currentAddress[chainId].includes(competitionAddress)) {
			currentAddress[chainId].push(competitionAddress);
		}
	} else {
		currentAddress[chainId] = [competitionAddress];
	}

	fs.writeFileSync(FRONTEND_ADDRESSES_FILE, JSON.stringify(currentAddress));
}

module.exports = async function () {
	if (process.env.UPDATE_FRONTEND) {
		console.log("Updating frontend");
		await updateAbi();
		await updateContractAddresses();
	}
};

module.exports.tags = ["frontend"];
