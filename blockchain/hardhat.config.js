require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const COINMARKETCAP_API = process.env.COINMARKETCAP_API || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.19",
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,
		},
		localhost: {
			chainId: 31337,
		},
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: [PRIVATE_KEY],
			saveDeployment: true,
			chainId: 11155111,
			blockConfirmations: 6,
		},
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	gasReporter: {
		enabled: false,
		outputFile: "gas-report.txt",
		noColors: true,
		currency: "USD",
		// coinmarketcap: COINMARKETCAP_API,
		token: "ETH",
	},
	namedAccounts: {
		deployer: {
			default: 0,
			1: 0,
		},
		account1: {
			default: 1,
		},
		account2: {
			default: 2,
		},
		account3: {
			default: 3,
		},
		account4: {
			default: 4,
		},
		account5: {
			default: 5,
		},
		account6: {
			default: 6,
		},
	},
};
