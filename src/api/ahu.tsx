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