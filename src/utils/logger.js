module.exports = () => {
    const _console = {
        log: console.log
    };
    console.log = (...args) => {
        _console.log.apply(console, ["[" + Game.cpu.getUsed().toFixed(2) + "]", ...args]);
    };

    console.json = (...args) => {
        console.log(JSON.safeStringify(args));
    };

    JSON.safeStringify = (obj, indent = 2) => {
        let cache = [];
        const retVal = JSON.stringify(
            obj,
            (key, value) =>
                typeof value === "object" && value !== null
                    ? cache.includes(value)
                    ? undefined // Duplicate reference found, discard key
                    : cache.push(value) && value // Store value in our collection
                    : value,
            indent
        );
        cache = null;
        return retVal;
    };
};