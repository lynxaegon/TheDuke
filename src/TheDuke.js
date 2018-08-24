class TheDuke {
    // Try to load the AI from Memory
    loadFrom(obj) {

    }

    handler() {
        if (Game.cpu.bucket < 500) {
            Logger.warning("CPU bucket is critically low (" + Game.cpu.bucket + ") - suspending for 5 ticks!");
            Memory.suspend = 4;
            return;
        } else {
            if (Memory.suspend != undefined) {
                if (Memory.suspend > 0) {
                    Logger.info("Operation suspended for " + Memory.suspend + " more ticks.");
                    Memory.suspend -= 1;
                    return;
                } else {
                    delete Memory.suspend;
                }
            }
            this.loop();
        }
    }

    // Run phases
    loop() {
        this.initPhase();
        this.runPhase();
        this.visualsPhase();
    }

    initPhase() {
        Logger.info("Hello from The Duke!");
    }

    runPhase() {

    }

    visualsPhase() {

    }
}

module.exports = TheDuke;