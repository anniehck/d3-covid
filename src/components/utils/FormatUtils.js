import each from 'lodash/each';

/**
 * Parse each value in dataset to integer.
 * 
 * @param {Object} dataSet 
 */
export function parseIntData(dataSet) {
    const parsed = {};
    each(dataSet, (val, key) => {
        parsed[key] = val ? parseInt(val, 10) : 0;
    });

    return parsed;
}

/**
 * Parse each value in dataset to float.
 * 
 * @param {Object} dataSet 
 */
export function parseFloatData(dataSet) {
    const parsed = {};
    each(dataSet, (val, key) => {
        parsed[key] = val ? parseFloat(val).toFixed(3) : 0;
    });

    return parsed;
}