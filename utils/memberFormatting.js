const APP = require('../index.js');

module.exports = {
    membersToArray(members, interaction='') {
        const memberIds = [];
    
        if (members) {
            for (const id of members.matchAll(/<@!(\d*)>/g)) {
                memberIds.push(id[1]);
            }
        } else {
            memberIds.push(interaction.member.id)
        }
    
        return memberIds;
    },
    
    
    membersIdsToString(memberIds, interaction='', sep=', ') {
        let outStr = "";
    
        for (const id of memberIds) {
            if (id !== memberIds[0]) outStr += sep;
            outStr += interaction.guild.members.cache.get(id).displayName;
        }
    
        return outStr;
    },
    
    
    pointsToRole(points) {
        const roles = APP.RANKS
        let lastRole = roles[0];
        
        for (const role of roles) {
            if (points < role.reqPoints) return lastRole;
            lastRole = role;
        }
    
        return roles[-1];
    },
}