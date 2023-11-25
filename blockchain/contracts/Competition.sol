// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

error NotOwner();
error NotApproved();
error NotReady();
error AlreadyOwner();
error AlreadyApproved();
error NotEnough();
error AlreadyFinalist();
error AlreadyJudge();
error NotFinalist();
error TooBig();
error CannotVote();
error VotingAlreadyStarted();
error Ended();

contract Competition {
    struct VotingStatus {
        bool hasSelectedJudges;
        bool hasInputWeight;
        bool hasSelectedFinalists;
        bool hasStartedVoting;
    }

    address private immutable i_owner;
    VotingStatus private votingStatus;

    mapping(address => address) vote;
    mapping(address => bool) hasVoted;
    mapping(address => bool) isJudge;
    mapping(address => bool) isApprovedForOwnerCapabilities;
    mapping(address => uint256) finalistJudgeVotes;
    mapping(address => uint256) finalistAudienceVotes;
    address[] private voters;
    address[] private finalists;
    address[] private winners;
    address[] private approvedAdresses;

    uint256 private judgeWeight;
    uint256 private audienceWeight;

    constructor() {
        i_owner = msg.sender;
        votingStatus = VotingStatus({
            hasSelectedJudges: false,
            hasInputWeight: false,
            hasSelectedFinalists: false,
            hasStartedVoting: false
        });
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert NotOwner();
        _;
    }

    modifier onlyApproved() {
        if (!(isApprovedForOwnerCapabilities[msg.sender] || msg.sender == i_owner)) revert NotApproved();
        _;
    }

    function getCapabilites() public {
        if (msg.sender == i_owner) revert AlreadyOwner();
        if (isJudge[msg.sender]) revert AlreadyJudge();
        if (finalistAudienceVotes[msg.sender] > 0 || finalistJudgeVotes[msg.sender] > 0) {
            revert AlreadyFinalist();
        }
        if (isApprovedForOwnerCapabilities[msg.sender]) revert AlreadyApproved();
        isApprovedForOwnerCapabilities[msg.sender] = true;
    }

    function removeCapabilites(address adr) public onlyOwner {
        if (!isApprovedForOwnerCapabilities[adr]) revert NotApproved();
        isApprovedForOwnerCapabilities[adr] = false;
    }

    //this function defines the addresses of accounts of judges
    function selectJudges(address[] memory arrayOfAddresses) public onlyApproved {
        if (arrayOfAddresses.length < 1) revert NotEnough();
        if (votingStatus.hasStartedVoting) revert VotingAlreadyStarted();
        if (arrayOfAddresses.length > 3) revert TooBig();

        for (uint256 i; i < arrayOfAddresses.length; i++) {
            if (finalistAudienceVotes[arrayOfAddresses[i]] > 0 || finalistJudgeVotes[arrayOfAddresses[i]] > 0) {
                revert AlreadyFinalist();
            }
            if (arrayOfAddresses[i] == i_owner) revert AlreadyOwner();
            if (isApprovedForOwnerCapabilities[arrayOfAddresses[i]]) revert AlreadyApproved();
            isJudge[arrayOfAddresses[i]] = true;
        }

        votingStatus.hasSelectedJudges = true;
    }

    //this function adds the weightage for judges and audiences
    function inputWeightage(uint256 judgeWeightage, uint256 audienceWeightage) public onlyApproved {
        if (votingStatus.hasStartedVoting) revert VotingAlreadyStarted();

        judgeWeight = judgeWeightage;
        audienceWeight = audienceWeightage;

        votingStatus.hasInputWeight = true;
    }

    //this function defines the addresses of finalists
    function selectFinalists(address[] memory arrayOfAddresses) public onlyApproved {
        if (votingStatus.hasStartedVoting) revert VotingAlreadyStarted();
        if (arrayOfAddresses.length < 1) revert NotEnough();
        if (arrayOfAddresses.length > 4) revert TooBig();

        for (uint256 i; i < arrayOfAddresses.length; i++) {
            if (isJudge[arrayOfAddresses[i]]) revert AlreadyJudge();
            if (arrayOfAddresses[i] == i_owner) revert AlreadyOwner();
            if (isApprovedForOwnerCapabilities[arrayOfAddresses[i]]) revert AlreadyApproved();
            finalistJudgeVotes[arrayOfAddresses[i]] = 1;
            finalistAudienceVotes[arrayOfAddresses[i]] = 1;
            finalists.push(arrayOfAddresses[i]);
        }

        votingStatus.hasSelectedFinalists = true;
    }

    //this function strats the voting process
    function startVoting() public onlyApproved {
        if (!votingStatus.hasSelectedJudges || !votingStatus.hasInputWeight || !votingStatus.hasSelectedFinalists) {
            revert NotReady();
        }
        votingStatus.hasStartedVoting = true;
    }

    //this function is used to cast the vote
    function castVote(address finalistAddress) public {
        if (!votingStatus.hasStartedVoting) revert NotReady();
        // if (finalistAudienceVotes[msg.sender] > 0 || finalistJudgeVotes[msg.sender] > 0) revert CannotVote();
        if (finalistAudienceVotes[finalistAddress] < 1 || finalistJudgeVotes[finalistAddress] < 1) revert NotFinalist();
        vote[msg.sender] = finalistAddress;
        if (!hasVoted[msg.sender]) voters.push(msg.sender);
    }

    //this function ends the process of voting
    function endVoting() public onlyApproved {
        if (!votingStatus.hasStartedVoting) revert NotReady();
        votingStatus.hasSelectedJudges = false;
        votingStatus.hasInputWeight = false;
        votingStatus.hasSelectedFinalists = false;
        votingStatus.hasStartedVoting = false;

        for (uint256 i; i < voters.length; i++) {
            if (isJudge[voters[i]]) {
                finalistJudgeVotes[vote[voters[i]]]++;
            } else {
                finalistAudienceVotes[vote[voters[i]]]++;
            }
        }
        uint256 highestVotes;
        for (uint256 i; i < finalists.length; i++) {
            uint256 totalVotes = (finalistJudgeVotes[finalists[i]] * judgeWeight)
                + (finalistAudienceVotes[finalists[i]] * audienceWeight);
            if (totalVotes == highestVotes) {
                highestVotes = totalVotes;
                winners.push(finalists[i]);
            } else {
                if (totalVotes > highestVotes) {
                    winners = new address[](0);

                    highestVotes = totalVotes;
                    winners.push(finalists[i]);
                }
            }
        }
    }

    //this function returns the winner/winners
    function showResult() public view returns (address[] memory) {
        if (winners.length == 0) revert NotReady();

        return winners;
    }

    function getApprovedAddresses() public view returns (address[] memory) {
        return approvedAdresses;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getVotingStatus() public view returns (VotingStatus memory) {
        return votingStatus;
    }
}
