membersToArray = (members, interaction='') => {
    const memberIds = [];

    if (members) {
        for (const id of members.matchAll(/<@!(\d*)>/g)) {
            memberIds.push(id[1]);
        }
    } else {
        memberIds.push(interaction.member.id)
    }

    return memberIds;
}

module.exports = {
    membersToArray,
}