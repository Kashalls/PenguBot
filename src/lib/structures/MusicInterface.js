class MusicInterface {

    constructor(guild) {
        Object.defineProperty(this, "client", { value: guild.client });
        Object.defineProperty(this, "guild", { value: guild });

        this.textChannel = null;
        this.playing = false;
        this.paused = false;
        this.queue = [];
        this.looping = false;
    }

    /**
     * Joins the voice channel which the bot will play tracks in
     * @param {VoiceChannel} voiceChannel The voice channel the bot is connected to
     * @returns {string}
     */
    join(voiceChannel) {
        return this.client.lavalink.join({
            guild: this.guild.id,
            channel: voiceChannel.id,
            host: this.idealNode.host
        }, { selfdeaf: true });
    }

    /**
     * Leaves the voice channel the bot is connected to
     * @param {boolean} force Force leave option
     * @returns {MusicInterface}
     */
    async leave(force = true) {
        if (this.player && (this.playing || force)) await this.player.stop();
        await this.client.lavalink.leave(this.guild.id);
        this.playing = false;
        return this;
    }

    /**
     * Gets the most ideal region based on specified guild region.
     * @returns {Player}
     */
    async play() {
        if (!this.player) throw "No! Something went wrong, try again.";
        else if (!this.queue.length) throw "Can't play songs from an empty queue.";

        const [song] = this.queue;
        await this.player.play(song.track);
        if (this.client.config.main.patreon) await this.player.volume(this.volume);
        this.playing = true;
        return this.player;
    }

    /**
     * Pause/Resume the player
     * @returns {boolean}
     */
    async pause() {
        if (!this.player) return false;
        await this.player.pause(!this.paused);
        this.paused = !this.paused;
        return true;
    }

    /**
     * Skips the current song in the queue
     * @param {boolean} force Force skip option
     * @returns {MusicInterface}
     */
    async skip(force = true) {
        if (this.player && force) await this.player.stop();
        else this.queue.shift();
        return this;
    }

    /**
     * Clears the current queue
     * @returns {MusicInterface}
     */
    clearQueue() {
        this.queue = [];
        return this;
    }

    /**
     * Destroys the current interface
     * @returns {void}
     */
    async destroy() {
        this.queue = [];
        this.playing = null;
        this.paused = null;
        this.textChannel = null;
        this.looping = null;

        if (this.player) await this.player.destroy();
        await this.leave();
        this.client.music.delete(this.guild.id);
    }

    get voiceChannel() {
        return this.guild.me ? this.guild.me.voice.channel : null;
    }

    get player() {
        return this.client.lavalink.players.get(this.guild.id) || null;
    }

    get volume() {
        return this.guild.settings.musicVolume;
    }

    /**
     * Gets the ideal Node based on the load
     * @returns {LavalinkNode}
     */
    get idealNode() {
        return this.client.lavalink.idealNodes.first();
    }

    /**
     * Check if a guild member is listening to music
     * @param {GuildMember} member The member you want to check
     * @returns {boolean}
     */
    isListening(member) {
        return this.voiceChannel && !member.voice.deaf && member.voice.channel.id === this.voiceChannel.id;
    }

}

module.exports = MusicInterface;
