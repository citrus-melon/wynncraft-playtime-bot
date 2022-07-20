export default {
    /** How often in milliseconds to check which players are online */
    tickInterval: 30000, // Wynncraft API updates every ~30sec, rate limit = 180/min
    /** Minimum duration in ms to cache Minecraft username/UUID pairs */
    usernameCacheTime: 60000,
    /** Maximum additional random duration to cache Minecraft usernames/UUIDs */
    usernameCacheTimeRandom: 120000
}