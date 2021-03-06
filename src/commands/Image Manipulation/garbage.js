const Command = require("../../lib/structures/KlasaCommand");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 8,
            aliases: ["garbagewho"],
            requiredPermissions: ["ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "EMBED_LINKS"],
            description: language => language.get("COMMAND_GARBAGE_DESCRIPTION"),
            extendedHelp: "No extended help available.",
            usage: "[GarbageWho:username]"
        });
    }

    async run(msg, [GarbageWho = msg.author]) {
        const image = await this.client.idiotic.garbage(GarbageWho.displayAvatarURL({ format: "png", size: 128 }))
            .catch(() => null);
        if (!image) return msg.reply(msg.language.get("ER_TRY_AGAIN"));
        return msg.channel.sendFile(image);
    }

};
