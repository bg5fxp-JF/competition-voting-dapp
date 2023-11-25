const { assert, expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("Competition Unit Tests", function () {
	let deployer, account1, account2, account3, account4, account5, account6;
	let competition;

	beforeEach(async function () {
		[deployer, account1, account2, account3, account4, account5, account6] =
			await ethers.getSigners();
		competition = await ethers.getContractAt(
			"Competition",
			(
				await deployments.fixture(["competition"])
			).Competition.address
		);
	});

	describe("constructor", function () {
		it("should set the deployer as owner", async function () {
			assert.equal(await competition.getOwner(), deployer.address);
		});
		it("should set the voting status correctly", async function () {
			const expectedStatus = [
				false /* hasSelectedJudges */,
				false /* hasInputWeight*/,
				false /* hasSelectedFinalists */,
				false /* hasStartedVoting */,
			];
			assert.equal(
				await competition.getVotingStatus(),
				expectedStatus.toString()
			);
		});
	});

	describe("selectJudges", function () {
		it("should revert if sender does not have capabilites", async function () {
			const competition_account5 = await competition.connect(account5);
			const judges = [account1.address, account2.address];
			await expect(
				competition_account5.selectJudges(judges)
			).to.be.revertedWithCustomError(competition_account5, "NotApproved");
		});

		it("should revert if the judges length doesn't meet requirements", async function () {});
	});
});
