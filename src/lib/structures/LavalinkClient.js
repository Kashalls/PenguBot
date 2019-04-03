const fetch = require("node-fetch");
const { PlayerManager } = require("discord.js-lavalink");

class LavalinkClient extends PlayerManager {

    constructor(client, nodes, options) {
        super(client, nodes, options);

        this.shards = options.shards;

        this.regions = {
            asia: ["sydney", "singapore", "japan", "hongkong"],
            eu: ["london", "frankfurt", "amsterdam", "russia", "eu-central", "eu-west"],
            us: ["us-central", "us-west", "us-east", "us-south", "brazil"]
        };
    }

    /**
     * Search for tracks from lavalink rest api
     * @param {LavalinkNode} node The node to use to query the track
     * @param {string} search Search query
     * @returns {Promise<any>}
     */
    getSongs(node = this.idealNodes.first(), search) {
        const params = new URLSearchParams();
        params.append("identifier", search);

        return fetch(`http://${node.host}:${node.port}/loadtracks?${params}`, { headers: { Authorization: node.password } })
            .then(res => res.json())
            .catch(error => {
                Error.captureStackTrace(error);
                this.client.console.error(error);
                return {};
            });
    }

    /**
     * Gets the most ideal region based on specified guild region.
     * @param {string} region The region of the guild
     * @returns {string}
     */
    getIdealRegion(region) {
        region = region.replace("vip-", "");
        for (const key of Object.keys(this.regions)) {
            const nodes = this.idealNodes.filter(node => node.options.region === key);
            if (!nodes) continue;
            for (const id of this.regions[key]) if (region.includes(id)) return key;
        }
        return this.idealNodes.first().host;
    }

}

module.exports = LavalinkClient;
