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

		it("should revert if the judges length doesn't meet requirements", async function () {
			const judges = [
				account1.address,
				account2.address,
				account3.address,
				account4.address,
			];
			await expect(
				competition.selectJudges(judges)
			).to.be.revertedWithCustomError(competition, "TooBig");
			await expect(competition.selectJudges([])).to.be.revertedWithCustomError(
				competition,
				"NotEnough"
			);
		});

		it("should revert if one of the judges has approved(owner) capabilities", async function () {
			const judges = [account1.address, account2.address, account3.address];
			const judges2 = [deployer.address, account2.address, account3.address];

			const competition_account1 = await competition.connect(account1);
			await competition_account1.getCapabilites();

			await expect(
				competition.selectJudges(judges)
			).to.be.revertedWithCustomError(competition, "AlreadyApproved");
			await expect(
				competition.selectJudges(judges2)
			).to.be.revertedWithCustomError(competition, "AlreadyOwner");
		});

		it("should be reverted if one of judges is already a finalist", async function () {
			const judges = [account1.address, account2.address, account3.address];
			const finalists = [account3.address, account4.address];

			await competition.selectFinalists(finalists);

			await expect(
				competition.selectJudges(judges)
			).to.be.revertedWithCustomError(competition, "AlreadyFinalist");
		});

		it("should successfully update voting status (owner)", async function () {
			const expectedStatus = [
				true /* hasSelectedJudges */,
				false /* hasInputWeight*/,
				false /* hasSelectedFinalists */,
				false /* hasStartedVoting */,
			];
			const judges = [account1.address, account2.address, account3.address];

			await competition.selectJudges(judges);
			assert.equal(
				await competition.getVotingStatus(),
				expectedStatus.toString()
			);
		});
		it("should successfully update voting status (approved sender)", async function () {
			const expectedStatus = [
				true /* hasSelectedJudges */,
				false /* hasInputWeight*/,
				false /* hasSelectedFinalists */,
				false /* hasStartedVoting */,
			];
			const judges = [account2.address, account3.address];

			const competition_account1 = await competition.connect(account1);
			await competition_account1.getCapabilites();

			await competition_account1.selectJudges(judges);
			assert.equal(
				await competition_account1.getVotingStatus(),
				expectedStatus.toString()
			);
		});
		it("should revert if started the voting", async function () {
			const judges = [account1.address, account2.address];
			const finalists = [account3.address, account4.address];

			await competition.selectJudges(judges);
			await competition.selectFinalists(finalists);
			await competition.inputWeightage(1, 1);

			await competition.startVoting();

			await expect(
				competition.selectJudges(judges)
			).to.be.revertedWithCustomError(competition, "VotingAlreadyStarted");
		});
	});
});
