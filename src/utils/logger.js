class Logger {
    info() {
        console.log.apply(console.log, arguments);
    }

    err() {
        var log = console.error;
        if (!log)
            log = console.log;

        log.apply(log, arguments);
    }

    warn() {
        var log = console.warn;
        if (!log)
            log = console.log;

        log.apply(log, arguments);
    }
}

module.exports = new Logger();