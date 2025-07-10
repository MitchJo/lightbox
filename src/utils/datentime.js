exports.getDateTime = () => {
    const now = new Date();
    return `${now.toDateString()}  ${now.toTimeString()}`;
}