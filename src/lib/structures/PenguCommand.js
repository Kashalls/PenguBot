const { Command } = require("klasa");

class PenguCommand extends Command {

    constructor(client, store, file, core, options = {}) {
        super(client, store, file, core, options);

        this.upvoteOnly = options.upvoteOnly;
        this.patronOnly = options.patronOnly;
    }

}

module.exports = PenguCommand;
