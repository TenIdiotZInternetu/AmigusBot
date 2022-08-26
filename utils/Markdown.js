module.exports = {
    Markdown(string, tags) {
        string = string.toString();
        if (tags.includes('i')) string = `*${string}*`;
        if (tags.includes('b')) string = `**${string}**`;
        if (tags.includes('u')) string = `__${string}__`;
        if (tags.includes('s')) string = `~~${string}~~`;
        if (tags.includes('q')) string = `> ${string}`;
        if (tags.includes('c')) string = `\`\`\`${string}\`\`\``;
        if (tags.includes('m')) string = `"${string}"`;
        return string;
    },
}