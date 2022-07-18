import { Collection } from "discord.js";
import {default as axios} from "axios";
import config from "../config.js";

/** @type {Collection<string, CacheItem>} */
const cache = new Collection();

class CacheItem {
    constructor (id, username) {
        this.id = id;
        this.username = username;
        this.expires = Date.now() + config.usernameCacheTime + Math.floor(Math.random() * config.usernameCacheTimeRandom);
    }
    expired() {
        return this.expires < Date.now();
    }
}

export const fetch = async (usernameOrId) => {
    const response = await axios.get("https://api.minetools.eu/uuid/" + usernameOrId);
    if (response.data.status === "ERR") {
        const sameUsername = cache.findKey(item => item.username.toLowerCase() === usernameOrId.toLowerCase());
        cache.delete(sameUsername);
        return null;
    }

    const sameUsername = cache.findKey(item => item.username.toLowerCase() === response.data.name.toLowerCase());
    cache.delete(sameUsername);

    const newItem = new CacheItem(response.data.id, response.data.name)
    cache.set(response.data.id, newItem);
    return newItem;
}

export const getIdByUsername = async (username) => {
    const cacheResult = cache.find(item => item.username.toLowerCase() === username.toLowerCase());
    if (!cacheResult) return (await fetch(username)).id;
    if (cacheResult.expired()) fetch(username);
    return cacheResult.id;
}

export const getUsernameById = async (id) => {
    const cacheResult = cache.get(id);
    if (!cacheResult) return (await fetch(id)).username;
    if (cacheResult.expired()) module.exports.fetchUsernameByID(id);
    return cacheResult.username;
}