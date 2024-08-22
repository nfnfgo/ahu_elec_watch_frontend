import useSWR, {mutate} from "swr";

import {axiosIns} from './axios';
import {apiErrorThrower, BaseError, ParamError} from '@/exceptions/error';

import {useSettingsStore} from '@/states/settings';
import {BalanceRecordIn} from "@/api/info";


export interface AHUCredentialInfoIn {
  authorization: string;
  synjones_auth: string;
}

export async function getAhuCredential(): Promise<AHUCredentialInfoIn> {
  let data = undefined;

  try {
    let res = await axiosIns.get('/ahu/header_info');
    data = res.data;

  } catch (e) {
    apiErrorThrower(e);
  }

  return data;
}

export function useHeaderInfo() {
  return useSWR('/ahu/header_info', getAhuCredential);
}

export async function setAhuCredentialFromURL(url: string) {
  let data = undefined;

  try {
    let res = await axiosIns.post('/ahu/set_header_info', url);
    data = res.data;
    // if successfully updated, mutate credential info SWR
    await mutate('/ahu/header_info');
  } catch (e) {
    await mutate('/ahu/header_info');
    apiErrorThrower(e);
  }

  return data;
}

export interface AhuRecordsIn {
  record: BalanceRecordIn,
  latency_ms: number;
}

/**
 * Directly catch records from AHU website.
 * Checkout backend API for more info.
 *
 * Params:
 *
 * - ``dry_run`` If true, do not add the record to the database.
 */
export async function getRecordsFromAhu(dry_run: boolean = true): Promise<AhuRecordsIn> {
  let data = undefined;

  try {
    let res = await axiosIns.get('/ahu/catch_record', {
      params: {
        dry_run
      }
    });
    data = res.data as AhuRecordsIn;
  } catch (e) {
    apiErrorThrower(e);
  }

  return data as AhuRecordsIn;
}