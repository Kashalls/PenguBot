const MusicCommand = require("../../lib/structures/MusicCommand");

module.exports = class extends MusicCommand {

    constructor(...args) {
        super(...args, {
            requireDJ: false,
            requireMusic: false,
            permissionLevel: 5,
            cooldown: 8,
            aliases: ["djonly", "enabledjonly", "disabledjonly"],
            requiredPermissions: ["USE_EXTERNAL_EMOJIS"],
            description: language => language.get("COMMAND_DJONLY_DESCRIPTION"),
            extendedHelp: "No extended help available."
        });
    }

    async run(msg) {
        await msg.guild.settings.update("djOnly", !msg.guild.settings.djOnly);

        return msg.sendMessage(`${this.client.emotes.check} ***Pengu DJ only mode has been ${msg.guild.settings.djOnly ? "enabled" : "disabled"}.***`);
    }

};
