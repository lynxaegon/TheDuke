module.exports = () => {
    const _console = {
        log: console.log
    };
    console.log = (...args) => {
        _console.log.apply(console, ["[" + Game.cpu.getUsed().toFixed(2) + "]", ...args]);
    };
};