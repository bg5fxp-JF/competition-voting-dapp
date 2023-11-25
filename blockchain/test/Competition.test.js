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

	describe("inputWeightage", function () {
		it("should revert if sender does not have capabilites", async function () {
			const competition_account5 = await competition.connect(account5);

			await expect(
				competition_account5.inputWeightage(1, 2)
			).to.be.revertedWithCustomError(competition_account5, "NotApproved");
		});
		it("should store weightages successfully (owner)", async function () {
			await competition.inputWeightage(1, 1);

			assert.equal(Number(await competition.getJudgeWeight()), 1);
			assert.equal(Number(await competition.getAudienceWeight()), 1);
		});
		it("should store weightages successfully (approved sender)", async function () {
			const competition_account1 = await competition.connect(account1);
			await competition_account1.getCapabilites();

			await competition_account1.inputWeightage(1, 1);

			assert.equal(Number(await competition_account1.getJudgeWeight()), 1);
			assert.equal(Number(await competition_account1.getAudienceWeight()), 1);
		});
		it("should successfully update voting status", async function () {
			const expectedStatus = [
				false /* hasSelectedJudges */,
				true /* hasInputWeight*/,
				false /* hasSelectedFinalists */,
				false /* hasStartedVoting */,
			];

			await competition.inputWeightage(1, 1);
			assert.equal(
				await competition.getVotingStatus(),
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
				competition.inputWeightage(1, 2)
			).to.be.revertedWithCustomError(competition, "VotingAlreadyStarted");
		});
	});

	describe("selectFinalists", async function () {
		it("should revert if sender does not have capabilites", async function () {
			const competition_account5 = await competition.connect(account5);
			const finalists = [account1.address, account2.address];
			await expect(
				competition_account5.selectFinalists(finalists)
			).to.be.revertedWithCustomError(competition_account5, "NotApproved");
		});

		it("should revert if the finalists length doesn't meet requirements", async function () {
			const finalists = [
				account1.address,
				account2.address,
				account3.address,
				account4.address,
				account5.address,
			];
			await expect(
				competition.selectFinalists(finalists)
			).to.be.revertedWithCustomError(competition, "TooBig");
			await expect(
				competition.selectFinalists([account1.address])
			).to.be.revertedWithCustomError(competition, "NotEnough");
		});

		it("should revert if one of the finalists has approved(owner) capabilities", async function () {
			const finalists = [account1.address, account2.address, account3.address];
			const finalists2 = [deployer.address, account2.address, account3.address];

			const competition_account1 = await competition.connect(account1);
			await competition_account1.getCapabilites();

			await expect(
				competition.selectFinalists(finalists)
			).to.be.revertedWithCustomError(competition, "AlreadyApproved");
			await expect(
				competition.selectFinalists(finalists2)
			).to.be.revertedWithCustomError(competition, "AlreadyOwner");
		});

		it("should be reverted if one of finalist is already a judge", async function () {
			const judges = [account1.address, account2.address, account3.address];
			const finalists = [account3.address, account4.address];

			await competition.selectJudges(judges);

			await expect(
				competition.selectFinalists(finalists)
			).to.be.revertedWithCustomError(competition, "AlreadyJudge");
		});

		it("should successfully update voting status (owner)", async function () {
			const expectedStatus = [
				false /* hasSelectedJudges */,
				false /* hasInputWeight*/,
				true /* hasSelectedFinalists */,
				false /* hasStartedVoting */,
			];
			const finalists = [account1.address, account2.address, account3.address];

			await competition.selectFinalists(finalists);
			assert.equal(
				await competition.getVotingStatus(),
				expectedStatus.toString()
			);
		});
		it("should successfully update voting status (approved sender)", async function () {
			const expectedStatus = [
				false /* hasSelectedJudges */,
				false /* hasInputWeight*/,
				true /* hasSelectedFinalists */,
				false /* hasStartedVoting */,
			];
			const finalists = [account2.address, account3.address];

			const competition_account1 = await competition.connect(account1);
			await competition_account1.getCapabilites();

			await competition_account1.selectFinalists(finalists);
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
				competition.selectFinalists(finalists)
			).to.be.revertedWithCustomError(competition, "VotingAlreadyStarted");
		});
	});

	describe("startVoting", function () {
		it("should revert if sender does not have capabilites", async function () {
			const competition_account5 = await competition.connect(account5);

			const judges = [account1.address, account2.address];
			const finalists = [account3.address, account4.address];

			await competition.selectJudges(judges);
			await competition.selectFinalists(finalists);
			await competition.inputWeightage(1, 1);

			await expect(
				competition_account5.startVoting()
			).to.be.revertedWithCustomError(competition_account5, "NotApproved");
		});

		it("should revert if judges arent selected", async function () {
			const finalists = [account3.address, account4.address];

			await competition.selectFinalists(finalists);
			await competition.inputWeightage(1, 1);

			await expect(competition.startVoting()).to.be.revertedWithCustomError(
				competition,
				"NotReady"
			);
		});
		it("should revert if finalists arent selected", async function () {
			const judges = [account3.address, account4.address];

			await competition.selectJudges(judges);
			await competition.inputWeightage(1, 1);

			await expect(competition.startVoting()).to.be.revertedWithCustomError(
				competition,
				"NotReady"
			);
		});
		it("should revert if weightages arent selected", async function () {
			const judges = [account1.address, account2.address];
			const finalists = [account3.address, account4.address];

			await competition.selectJudges(judges);
			await competition.selectFinalists(finalists);

			await expect(competition.startVoting()).to.be.revertedWithCustomError(
				competition,
				"NotReady"
			);
		});
		it("should successfully update voting status (owner)", async function () {
			const expectedStatus = [
				true /* hasSelectedJudges */,
				true /* hasInputWeight*/,
				true /* hasSelectedFinalists */,
				true /* hasStartedVoting */,
			];
			const judges = [account1.address, account2.address];
			const finalists = [account3.address, account4.address];

			await competition.selectJudges(judges);
			await competition.selectFinalists(finalists);
			await competition.inputWeightage(1, 1);

			await competition.startVoting();

			assert.equal(
				await competition.getVotingStatus(),
				expectedStatus.toString()
			);
		});
		it("should successfully update voting status (approved sender)", async function () {
			const expectedStatus = [
				true /* hasSelectedJudges */,
				true /* hasInputWeight*/,
				true /* hasSelectedFinalists */,
				true /* hasStartedVoting */,
			];
			const judges = [account2.address];
			const finalists = [account3.address, account4.address];

			const competition_account1 = await competition.connect(account1);
			await competition_account1.getCapabilites();

			await competition_account1.selectJudges(judges);
			await competition_account1.selectFinalists(finalists);
			await competition_account1.inputWeightage(1, 1);

			await competition_account1.startVoting();

			assert.equal(
				await competition_account1.getVotingStatus(),
				expectedStatus.toString()
			);
		});
	});

	describe("castVote", function () {
		it("should revert if the competition is not ready (not all conditions have been met)", async function () {
			const competition_account5 = await competition.connect(account5);

			await expect(
				competition_account5.castVote(account3.address)
			).to.be.revertedWithCustomError(competition_account5, "NotReady");
		});

		describe("castVote with condidions met", function () {
			let competition_account1, competition_account5, competition_account6;
			beforeEach(async function () {
				const judges = [account1.address, account2.address];
				const finalists = [account3.address, account4.address];

				await competition.selectJudges(judges);
				await competition.selectFinalists(finalists);
				await competition.inputWeightage(1, 1);

				await competition.startVoting();

				competition_account1 = await competition.connect(account1);
				competition_account5 = await competition.connect(account5);
				competition_account6 = await competition.connect(account6);
			});

			it("should revert if the vote is for a non finalist", async function () {
				await expect(
					competition_account5.castVote(account6.address)
				).to.be.revertedWithCustomError(competition_account5, "NotFinalist");
			});
			it("should correctly count judges vote for finalist", async function () {
				await competition_account1.castVote(account3.address);
				await competition_account5.castVote(account3.address);
				await competition_account6.castVote(account4.address);

				assert.equal(
					await competition_account1.getCurrentVote(),
					account3.address
				);
				assert.equal(
					await competition_account5.getCurrentVote(),
					account3.address
				);
				assert.equal(
					await competition_account6.getCurrentVote(),
					account4.address
				);
			});
			it("should allow senders to change votes", async function () {
				await competition_account1.castVote(account3.address);
				assert.equal(
					await competition_account1.getCurrentVote(),
					account3.address
				);

				await competition_account1.castVote(account4.address);

				assert.equal(
					await competition_account1.getCurrentVote(),
					account4.address
				);
			});
			it("should revert if voting is ended", async function () {
				await competition.endVoting();

				await expect(
					competition.castVote(account3.address)
				).to.be.revertedWithCustomError(competition, "NotReady");
			});
		});
	});

	describe("endVoting", function () {
		it("should revert if sender does not have capabilites", async function () {
			const competition_account5 = await competition.connect(account5);

			await expect(
				competition_account5.endVoting()
			).to.be.revertedWithCustomError(competition_account5, "NotApproved");
		});
		it("should revert if the voting never started", async function () {
			await expect(competition.endVoting()).to.be.revertedWithCustomError(
				competition,
				"NotReady"
			);
		});

		describe("endVoting with conditions met", function () {
			let competition_account1, competition_account5, competition_account6;
			beforeEach(async function () {
				const judges = [account1.address, account2.address];
				const finalists = [account3.address, account4.address];

				await competition.selectJudges(judges);
				await competition.selectFinalists(finalists);
				await competition.inputWeightage(1, 1);

				await competition.startVoting();

				competition_account1 = await competition.connect(account1);
				competition_account5 = await competition.connect(account5);
				competition_account6 = await competition.connect(account6);
			});

			it("should reset voting status", async function () {
				const expectedStatus = [
					false /* hasSelectedJudges */,
					false /* hasInputWeight*/,
					false /* hasSelectedFinalists */,
					false /* hasStartedVoting */,
				];

				await competition.endVoting();

				assert.equal(
					await competition.getVotingStatus(),
					expectedStatus.toString()
				);
			});
			it("should give multiple winners", async function () {
				const expectedResult = [account3.address, account4.address];
				await competition.endVoting();

				assert.equal(await competition.showResult(), expectedResult.toString());
			});
			it("should give sole winner", async function () {
				const expectedResult = [account3.address];
				await competition.castVote(account3.address);
				await competition_account1.castVote(account4.address);
				await competition_account5.castVote(account3.address);
				await competition.endVoting();

				assert.equal(await competition.showResult(), expectedResult.toString());
			});
		});

		describe("showResult", async function () {
			it("should revert if there's never been a winner", async function () {
				await expect(competition.showResult()).to.be.revertedWithCustomError(
					competition,
					"NotReady"
				);
			});
		});
	});
});
