import useSWR from "swr";

import {axiosIns} from './axios';
import {apiErrorThrower, BaseError, ParamError} from '@/exceptions/error';

export interface BalanceRecordIn {
  timestamp: number;
  ac_balance: number;
  light_balance: number;
}

/**
 * Get the latest balance record that directly caught from AHU website.
 */
export async function getLatestRecord(): Promise<BalanceRecordIn> {
  let data = undefined;
  try {
    let res = await axiosIns.get('/info/latest_record');
    data = res.data;
  } catch (e) {
    apiErrorThrower(e);
  }
  return data as BalanceRecordIn;
}

export function useGetBalance() {
  return useSWR('/lastest_record', getLatestRecord);
}

// export function useRbacPermissionListInfo(limit: number, cursor: number) {
//   return useSWR(['/rbac/permissions', limit, cursor],
//     (key) => (getRbacPermissionList(key[1], key[2]))
//   );
// }

export interface StatisticIn {
  timestamp: number;
  light_total_last_day: number;
  ac_total_last_day: number;
  light_total_last_week: number;
  ac_total_last_week: number;
}

export async function getStatistics(): Promise<StatisticIn> {
  let data = undefined;
  try {
    let res = await axiosIns.get('/info/statistics');
    data = res.data;
  } catch (e) {
    apiErrorThrower(e);
  }
  data = data as StatisticIn;
  // only keey two floating point
  data.ac_total_last_day = parseFloat(data.ac_total_last_day.toFixed(2));
  data.ac_total_last_week = parseFloat(data.ac_total_last_week.toFixed(2));
  data.light_total_last_day = parseFloat(data.light_total_last_day.toFixed(2));
  data.light_total_last_week = parseFloat(data.light_total_last_week.toFixed(2));
  return data;
}

export function useGetStatistics() {
  return useSWR('/info/statistics', getStatistics);
}


/**
 * Get recent records starting from several days ago.
 */
export async function getRecentRecords(
  days: number,
  type: 'balance' | 'usage'
): Promise<BalanceRecordIn[]> {
  if (days < 1) {
    throw new ParamError('You must at least get recent records starting from 1 day before.');
  }

  let data = undefined;
  try {
    let res = await axiosIns.get(
      '/info/recent_records',
      {params: {days, info_type: type}})
    ;
    data = res.data;
  } catch (e) {
    apiErrorThrower(e);
  }

  return data;
}

export function useGetRecentRecords(days: number, type: 'balance' | 'usage') {
  return useSWR(
    ['/info/recent_records', days, type],
    (keys) => (getRecentRecords(keys[1], keys[2])),
  );
}

/**
 * For more info, please checkout API documents.
 *
 * All field has the same meaning as the one that the API returns.
 */
export interface DailyUsageInfoIn {
  start_time: number;
  end_time: number;
  light_usage: number;
  ac_usage: number;
}

export async function getDailyUsage(
  days: number,
  recent_on_top: boolean = true,
): Promise<DailyUsageInfoIn[]> {
  if (days < 1) {
    throw new ParamError('You must at least get daily usage info list starting from 1 day back.');
  }

  let data = undefined;
  try {
    let res = await axiosIns.get(
      '/info/daily_usage',
      {params: {days, recent_on_top: recent_on_top}})
    ;
    data = res.data;
  } catch (e) {
    apiErrorThrower(e);
  }

  return data;
}

export function useGetDailyUsage(days: number, recent_on_top?: boolean) {
  return useSWR(
    ['/info/daily_usage', days, recent_on_top],
    (keys) => (getDailyUsage(keys[1], keys[2])),
  );
}