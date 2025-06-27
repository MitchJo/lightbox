exports.getRandomId = (prefix) => {
    const randString = Math.random().toString(36).substring(2, 6);
    const timestr = (+new Date).toString(32);
    return `${prefix}-${timestr}${randString}`
}