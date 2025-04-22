// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    bytes32[] public candidateList;

    struct Vote {
        bytes32 candidate;
        uint priority;
    }

    mapping(bytes32 => uint256) public votesReceived;
    mapping(address => bool) public hasVoted;
    mapping(address => Vote[]) public votesByVoter;

    constructor(bytes32[] memory _candidates) {
        require(_candidates.length > 0, "Candidates required");
        admin = msg.sender;
        candidateList = _candidates;
    }

    function voteWithPriority(bytes32[] memory candidates, uint[] memory priorities) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidates.length == priorities.length, "Mismatched inputs");

        for (uint i = 0; i < candidates.length; i++) {
            require(validCandidate(candidates[i]), "Invalid candidate");
            votesReceived[candidates[i]] += 1;
            votesByVoter[msg.sender].push(Vote(candidates[i], priorities[i]));
        }

        hasVoted[msg.sender] = true;
    }

    function validCandidate(bytes32 candidate) internal view returns (bool) {
        for (uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }

    function getCandidates() public view returns (bytes32[] memory) {
        return candidateList;
    }

    function totalVotesFor(bytes32 candidate) public view returns (uint256) {
        require(validCandidate(candidate), "Invalid candidate");
        return votesReceived[candidate];
    }

    function getVoterVotes(address voter) public view returns (Vote[] memory) {
        return votesByVoter[voter];
    }
}
