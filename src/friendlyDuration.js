export const UNITS = {
    YEAR: { name: "year", milliseconds: 360*60*60*24*1000 },
    WEEK: { name: "week", milliseconds: 7*24*60*60*1000 },
    DAY: { name: "day", milliseconds: 24*60*60*1000 },
    HOUR: { name: 'hour', milliseconds: 60*60*1000 },
    MINUTE: { name: 'minute', milliseconds: 60*1000 },
    SECOND: { name: 'second', milliseconds: 1000 },
    MILLISECONDS: { name: 'millisecond', milliseconds: 1 }
}

/**
 * Converts a duration to a friendly human-readable string
 * @param {number} totalMilliseconds The duration, in milliseconds
 * @param {{name: string, milliseconds: number}[]} units The units to include (must be greatest to least)
 */
export default function toDurationString (totalMilliseconds, units = [UNITS.DAY, UNITS.HOUR, UNITS.MINUTE]) {
    const lastUnit = units.pop();
    const parts = [];

    for (const unit of units) {
        const value = Math.floor(totalMilliseconds / unit.milliseconds);
        if (value) parts.push(`${value} ${unit.name}${value === 1 ? '' : 's'}`);
        totalMilliseconds -= value * unit.milliseconds;
    }

    const lastValue = Math.round(totalMilliseconds / lastUnit.milliseconds); // Round instead of floor
    parts.push(`${lastValue} ${lastUnit.name}${lastValue === 1 ? '' : 's'}`); // and always include last unit

    return parts.join(", ");
}