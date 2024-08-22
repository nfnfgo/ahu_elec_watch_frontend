import {ReactNode} from "react";

import * as dayjs from 'dayjs';
import toast from 'react-hot-toast';
import {ValueOrFunction, Renderable} from 'react-hot-toast';

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
  await new Promise(r => setTimeout(r, sleepMs));
  return;
}

/**
 * Convert timestamp to readable format (YYYY-MM-DD HH:mm:ss)
 * @param timestamp The current timestamp (int millisecond)
 */
export function convertTimeStampToReadable(timestamp: number) {
  return dayjs.unix(timestamp / 1000).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Return true if the current running environment is browser-like,
 */
export function inBrowserEnv(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Custom react-hot-toast wrapper with custom error rendering function.
 */
export function promiseToastWithBaseErrorHandling<T>(
  promise: Promise<T>,
  loading: Renderable,
  success: ValueOrFunction<Renderable, T>): Promise<T> {
  return toast.promise(
    promise,
    {
      success: success,
      loading: loading,
      error: function (e) {
        return `${e.message}` + (e.name ? ` (${e.name})` : '');
      },
    },
  );
}