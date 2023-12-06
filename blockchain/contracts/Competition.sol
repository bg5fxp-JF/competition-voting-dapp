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

contract Competition {
    // Type declerations
    struct VotingStatus {
        bool hasSelectedJudges;
        bool hasInputWeight;
        bool hasSelectedFinalists;
        bool hasStartedVoting;
    }

    // State Variavles
    address private immutable i_owner;
    VotingStatus private votingStatus;
    uint256 private mappingIndex;

    mapping(uint256 => mapping(address => address)) vote;
    mapping(uint256 => mapping(address => bool)) hasVoted;
    mapping(uint256 => mapping(address => bool)) isJudge;
    mapping(uint256 => mapping(address => bool)) isApprovedForOwnerCapabilities;
    mapping(uint256 => mapping(address => uint256)) finalistJudgeVotes;
    mapping(uint256 => mapping(address => uint256)) finalistAudienceVotes;
    address[] private voters;
    address[] private judges;
    address[] private finalists;
    address[] private winners;
    address[] private approvedAdresses;

    uint256 private judgeWeight;
    uint256 private audienceWeight;

    // Events
    event CapabilitiesGranted(address indexed grantedTo);
    event CapabilitiesRemoved(address indexed removedFrom);
    event JudgesSelected(address[] judges);
    event WeightageInputted(uint256 judgeWeightage, uint256 audienceWeightage);
    event FinalistsSelected(address[] finalists);
    event VotingStarted();
    event VoteCast(address indexed voter, address indexed finalistVotedFor);
    event VotingEnded();
    event WinnersDeclared(address[] winners);

    constructor() {
        i_owner = msg.sender;
        votingStatus = VotingStatus({
            hasSelectedJudges: false,
            hasInputWeight: false,
            hasSelectedFinalists: false,
            hasStartedVoting: false
        });
        mappingIndex = 0;
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert NotOwner();
        _;
    }

    modifier onlyApproved() {
        if (!(isApprovedForOwnerCapabilities[mappingIndex][msg.sender] || msg.sender == i_owner)) revert NotApproved();
        _;
    }

    function getCapabilites() public {
        if (msg.sender == i_owner) revert AlreadyOwner();
        if (isJudge[mappingIndex][msg.sender]) revert AlreadyJudge();
        if (finalistAudienceVotes[mappingIndex][msg.sender] > 0 || finalistJudgeVotes[mappingIndex][msg.sender] > 0) {
            revert AlreadyFinalist();
        }
        if (isApprovedForOwnerCapabilities[mappingIndex][msg.sender]) revert AlreadyApproved();
        isApprovedForOwnerCapabilities[mappingIndex][msg.sender] = true;

        emit CapabilitiesGranted(msg.sender);
    }

    function removeCapabilites(address adr) public onlyOwner {
        if (!isApprovedForOwnerCapabilities[mappingIndex][adr]) revert NotApproved();
        isApprovedForOwnerCapabilities[mappingIndex][adr] = false;

        emit CapabilitiesRemoved(adr);
    }

    //this function defines the addresses of accounts of judges
    function selectJudges(address[] memory arrayOfAddresses) public onlyApproved {
        if (arrayOfAddresses.length < 1) revert NotEnough();
        if (votingStatus.hasStartedVoting) revert VotingAlreadyStarted();
        if (arrayOfAddresses.length > 3) revert TooBig();

        for (uint256 i; i < arrayOfAddresses.length; i++) {
            if (
                finalistAudienceVotes[mappingIndex][arrayOfAddresses[i]] > 0
                    || finalistJudgeVotes[mappingIndex][arrayOfAddresses[i]] > 0
            ) {
                revert AlreadyFinalist();
            }
            if (arrayOfAddresses[i] == i_owner) revert AlreadyOwner();
            if (isApprovedForOwnerCapabilities[mappingIndex][arrayOfAddresses[i]]) revert AlreadyApproved();
            isJudge[mappingIndex][arrayOfAddresses[i]] = true;
            judges.push(arrayOfAddresses[i]);
        }

        votingStatus.hasSelectedJudges = true;

        emit JudgesSelected(arrayOfAddresses);
    }

    //this function adds the weightage for judges and audiences
    function inputWeightage(uint256 judgeWeightage, uint256 audienceWeightage) public onlyApproved {
        if (votingStatus.hasStartedVoting) revert VotingAlreadyStarted();

        judgeWeight = judgeWeightage;
        audienceWeight = audienceWeightage;

        votingStatus.hasInputWeight = true;

        emit WeightageInputted(judgeWeightage, audienceWeightage);
    }

    //this function defines the addresses of finalists
    function selectFinalists(address[] memory arrayOfAddresses) public onlyApproved {
        if (votingStatus.hasStartedVoting) revert VotingAlreadyStarted();
        if (arrayOfAddresses.length <= 1) revert NotEnough();
        if (arrayOfAddresses.length > 4) revert TooBig();

        for (uint256 i; i < arrayOfAddresses.length; i++) {
            if (isJudge[mappingIndex][arrayOfAddresses[i]]) revert AlreadyJudge();
            if (arrayOfAddresses[i] == i_owner) revert AlreadyOwner();
            if (isApprovedForOwnerCapabilities[mappingIndex][arrayOfAddresses[i]]) revert AlreadyApproved();
            finalistJudgeVotes[mappingIndex][arrayOfAddresses[i]] = 1;
            finalistAudienceVotes[mappingIndex][arrayOfAddresses[i]] = 1;
            finalists.push(arrayOfAddresses[i]);
        }

        votingStatus.hasSelectedFinalists = true;

        emit FinalistsSelected(arrayOfAddresses);
    }

    //this function strats the voting process
    function startVoting() public onlyApproved {
        if (!votingStatus.hasSelectedJudges || !votingStatus.hasInputWeight || !votingStatus.hasSelectedFinalists) {
            revert NotReady();
        }
        votingStatus.hasStartedVoting = true;

        emit VotingStarted();
    }

    //this function is used to cast the vote
    function castVote(address finalistAddress) public {
        if (!votingStatus.hasStartedVoting) revert NotReady();
        // if (finalistAudienceVotes[msg.sender] > 0 || finalistJudgeVotes[msg.sender] > 0) revert CannotVote();
        if (
            finalistAudienceVotes[mappingIndex][finalistAddress] < 1
                || finalistJudgeVotes[mappingIndex][finalistAddress] < 1
        ) revert NotFinalist();
        vote[mappingIndex][msg.sender] = finalistAddress;
        if (!hasVoted[mappingIndex][msg.sender]) voters.push(msg.sender);

        emit VoteCast(msg.sender, finalistAddress);
    }

    //this function ends the process of voting
    function endVoting() public onlyApproved {
        if (!votingStatus.hasStartedVoting) revert NotReady();
        votingStatus.hasSelectedJudges = false;
        votingStatus.hasInputWeight = false;
        votingStatus.hasSelectedFinalists = false;
        votingStatus.hasStartedVoting = false;

        for (uint256 i; i < voters.length; i++) {
            if (isJudge[mappingIndex][voters[i]]) {
                finalistJudgeVotes[mappingIndex][vote[mappingIndex][voters[i]]]++;
            } else {
                finalistAudienceVotes[mappingIndex][vote[mappingIndex][voters[i]]]++;
            }
        }
        uint256 highestVotes;
        for (uint256 i; i < finalists.length; i++) {
            uint256 totalVotes = (finalistJudgeVotes[mappingIndex][finalists[i]] * judgeWeight)
                + (finalistAudienceVotes[mappingIndex][finalists[i]] * audienceWeight);
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

        judges = new address[](0);
        finalists = new address[](0);
        voters = new address[](0);
        approvedAdresses = new address[](0);
        judgeWeight = 1;
        audienceWeight = 1;

        mappingIndex++;

        emit VotingEnded();
        emit WinnersDeclared(winners);
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

    function getIsApproved(address adr) public view returns (bool) {
        if (adr == i_owner) return true;
        return isApprovedForOwnerCapabilities[mappingIndex][adr];
    }

    function getVotingStatus() public view returns (bool) {
        return votingStatus.hasStartedVoting;
    }

    function getVotingStatusStruct() public view returns (VotingStatus memory) {
        return votingStatus;
    }

    function getJudgeWeight() public view returns (uint256) {
        return judgeWeight;
    }

    function getAudienceWeight() public view returns (uint256) {
        return audienceWeight;
    }

    function getCurrentVote() public view returns (address) {
        return vote[mappingIndex][msg.sender];
    }

    function getVoters() public view returns (address[] memory) {
        return voters;
    }

    function getFinalists() public view returns (address[] memory) {
        return finalists;
    }

    function getJudges() public view returns (address[] memory) {
        return judges;
    }

    function getJudgeVotesOfFinalist(address finalist) public view returns (uint256) {
        if (finalistAudienceVotes[mappingIndex][finalist] < 1 || finalistJudgeVotes[mappingIndex][finalist] < 1) {
            revert NotFinalist();
        }
        return finalistJudgeVotes[mappingIndex][finalist] - 1;
    }

    function getAudienceVotesOfFinalist(address finalist) public view returns (uint256) {
        if (finalistAudienceVotes[mappingIndex][finalist] < 1 || finalistJudgeVotes[mappingIndex][finalist] < 1) {
            revert NotFinalist();
        }
        return finalistAudienceVotes[mappingIndex][finalist] - 1;
    }

    function getTotalVotesOfFinalist(address finalist) public view returns (uint256) {
        if (finalistAudienceVotes[mappingIndex][finalist] < 1 || finalistJudgeVotes[mappingIndex][finalist] < 1) {
            revert NotFinalist();
        }
        return (finalistJudgeVotes[mappingIndex][finalist] + finalistAudienceVotes[mappingIndex][finalist]) - 2;
    }
}
