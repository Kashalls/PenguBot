const MusicCommand = require("../../lib/structures/MusicCommand");

module.exports = class extends MusicCommand {

    constructor(...args) {
        super(...args, {
            requireDJ: true,
            requireMusic: true,
            cooldown: 8,
            aliases: ["changevol", "setvolume"],
            requiredPermissions: ["USE_EXTERNAL_EMOJIS"],
            description: language => language.get("COMMAND_VOLUME_DESCRIPTION"),
            extendedHelp: "No extended help available.",
            usage: "[volume:integer{0,200}]"
        });
    }

    async run(msg, [volume]) {
        if (!this.client.config.main.patreon) throw msg.sendMessage(`${this.client.emotes.cross} ***${msg.language.get("CMD_PATRON_ONLY")}***`);
        if (!volume) return msg.sendMessage(`🔈 | ***Guild's Current Music Volume is:*** ${msg.guild.settings.musicVolume}`);

        await msg.guild.settings.update("musicVolume", volume);
        if (msg.guild.music.playing) await msg.guild.music.player.volume(volume);

        return msg.sendMessage(`${this.client.emotes.check} ***Volume has been set to:*** ${volume}`);
    }

};
