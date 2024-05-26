import React, {useState} from "react";

/**
 * Calculate total page with `limit` and `total`
 *
 * @param limit The item count limit pre page
 * @param total The total number of items
 *
 * @return The page number in total
 *
 * @exception invalid_input_number Input number must greater or equal than zero, which `limit` must be non-zero
 */
export function getTotalPage(limit: number, total: number): number {
  if (limit <= 0 || total < 0) {
    throw 'invalid_input_number';
  }

  let res = Math.floor(total / limit);
  if (total % limit > 0) {
    res++;
  }
  return res;
}

/**
 * Add a `key` props to every element in this list
 *
 * Params:
 * - `arr` The arr you want to add key
 * - `keyGenerator` Function used to generate a `key` for each element. Could
 * receive each element as param, and return a `React.Key` type object
 */
export function addKeysPropsForAnArray<ArrayElementType>(
  arr: ArrayElementType[],
  keyGenerator: (value: ArrayElementType) => (React.Key)
): (ArrayElementType & { key: React.Key })[] {
  arr = arr.map(function (value) {
    let keyForThisElement = keyGenerator(value);
    return {...value, key: keyForThisElement};
  });
  return arr as (ArrayElementType & { key: React.Key })[];
}


// use to limit the input type of `extractKeysFromList()`
type hasKeyPropsType = {
  key: React.Key;
}

/**
 * Extract all keys from the items in an array, and return that list of keys
 *
 * Params:
 * - `arr` An array whose item has `key` props. The array that you want to extract
 * `key` props from.
 */
export function extractKeysFromList<T extends hasKeyPropsType>(arr: T[]): React.Key[] {
  let keyList = [];
  for (let item of arr) {
    keyList.push(item.key);
  }
  return keyList;
}

/**
 * Custom pagination state hook
 *
 * This hook will provide state management of `limit`, `cursor` and an alternative `staleData` management
 *
 * Params:
 * - `initLimit` Set the initial limit, default to `20`
 * - `initCursor` Set the initial cursor(page), default to `0`
 * - `initStaleData` Initial staled data, could be `undeinfed`. See notice below to learn more.
 *
 * Notice:
 * - It's recommended to use 0-indexed cursor
 * - About `staleData`: Since in lots of pagination application senario, we may want to save the staled data
 * and keep showing it to the user until the new info has been fetched successfully or met with exceptions. So
 * you can prefer using the `staleData` provided by this state to store that kind of data.
 */
export function usePaginationState<StaleDataType>(
  initLimit: number = 20,
  initCursor: number = 0,
  initStaleData?: StaleDataType) {
  const [limit, setLimit] = useState(initLimit);
  const [cursor, setCursor] = useState(initCursor);
  const [staleData, setStaleData] =
    useState<StaleDataType | undefined>(initStaleData ?? undefined);
  return {
    limit,
    setLimit,
    cursor,
    setCursor,
    staleData,
    setStaleData,
  };
}