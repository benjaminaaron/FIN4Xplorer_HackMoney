pragma solidity ^0.5.0;

contract Fin4Groups {

    struct Group {
        uint groupId;
        address creator;
        address[] members;
        mapping(address => bool) membersSet;
        string name;
        string identifier;
    }

    uint public nextGroupId = 0;
    uint private INVALID_INDEX = 9999;

    mapping (uint => Group) public groups;
    mapping (string => bool) public identifiers;

    function getGroupsCount() public view returns(uint) {
        return nextGroupId;
    }

    function createGroup(string memory name, string memory identifier, bool addCreatorAsMember) public returns(uint) {
        require(!identifiers[identifier], "Identifier already in use");
        Group storage group = groups[nextGroupId];
        group.creator = msg.sender;
        if (addCreatorAsMember) {
            group.members.push(msg.sender);
        }
        group.name = name;
        group.identifier = identifier;
        nextGroupId ++;
        identifiers[identifier] = true;
        return nextGroupId - 1;
    }

    function addMembers(uint groupId, address[] memory newMembers) public {
        for (uint i = 0; i < newMembers.length; i ++) {
            addMember(groupId, newMembers[i]);
        }
    }

    function addMember(uint groupId, address newMember) public {
        require(groups[groupId].creator == msg.sender, "Only the group creator can add members");
        groups[groupId].members.push(newMember);
        groups[groupId].membersSet[newMember] = true;
    }

    function removeMember(uint groupId, address memberToRemove) public {
        require(groups[groupId].creator == msg.sender, "Only the group creator can remove members");
        require(groups[groupId].membersSet[memberToRemove], "Given address is not a member in this group, can't remove it");
        groups[groupId].membersSet[memberToRemove] = false;
        delete groups[groupId].members[getIndexOfMember(groupId, memberToRemove)];
    }

    function getIndexOfMember(uint groupId, address member) private view returns(uint) {
        Group memory group = groups[groupId];
        for (uint i = 0; i < group.members.length; i ++) {
            if (group.members[i] == member) {
                return i;
            }
        }
        return INVALID_INDEX;
    }

    function isMember(uint groupId, address memberToCheck) public view returns(bool) {
        return groups[groupId].membersSet[memberToCheck];
    }

    function sendMessageToMembers() public view {
        // TODO
    }
}