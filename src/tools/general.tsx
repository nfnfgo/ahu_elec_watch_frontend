import * as dayjs from 'dayjs';

/**
 * Get the key of an object by its value
 */
export function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find(k => object[k] === value);
}

/**
 * Async sleep a certian time
 * @param sleepMs Sleep time in milliseconds
 */
export async function asyncSleep(sleepMs: number): Promise<void> {
  await new Promise(r => setTimeout(r, 2000));
  return;
}

/**
 * Convert timestamp to readable format (YYYY-MM-DD HH:mm:ss)
 * @param timestamp The current timestamp (int millisecond)
 */
export function convertTimeStampToReadable(timestamp: number) {
  return dayjs.unix(timestamp / 1000).format('YYYY-MM-DD HH:mm:ss');
}