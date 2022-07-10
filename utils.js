const APP = require('./appGlobals.js');

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


membersToString = (memberIds, sep=', ') => {
    let outStr = "";

    for (const id of memberIds) {
        if (id !== memberIds[0]) outStr += sep;
        outStr += APP.Guild.members.cache.get(id).displayName;
    }

    return outStr;
}


pointsToRole = (points) => {
    const roles = [
        {name: "Impostor", level: 0, color: '#c7c7c7', reqPoints: 0},
        {name: "Newbie", level: 1, color: '#b2e0e3', reqPoints: 1},
        {name: "Apprentice", level: 2, color: '#6bf1ca', reqPoints: 5},
        {name: "Regular", level: 3, color: '#35ff55', reqPoints: 15},
        {name: "Skilled", level: 4, color: '#f3c155', reqPoints: 30},
        {name: "Master", level: 5, color: '#f34c44', reqPoints: 75},
        {name: "Amigus", level: 6, color: '#ff28e4', reqPoints: 150},
    ]   

    let lastRole = roles[0];
    
    for (const role of roles) {
        if (points < role.reqPoints) return lastRole;
        lastRole = role;
    }

    return roles[-1];
}


module.exports = {
    membersToArray,
    membersToString,
    pointsToRole,
}