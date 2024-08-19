import useSWR, {mutate} from "swr";

import {axiosIns} from './axios';
import {apiErrorThrower, BaseError, ParamError} from '@/exceptions/error';

import {useSettingsStore} from '@/states/settings';
import {BalanceRecordIn} from "@/api/info";

interface LoginCredentials {
  name: string;
  password: string;
}

export async function login(name: string, password: string) {
  const credential: LoginCredentials = {name, password};

  let data = undefined;

  try {
    // get login info from server
    let res = await axiosIns.post('/auth/login', credential);
    data = res.data;

    // if successfully logged in, revalidate me info API.
    await mutate('/auth/me');
  } catch (e) {
    apiErrorThrower(e);
  }

  return data;
}


/**
 * Call API to log out an account.
 */
export async function logout() {
  let data = undefined;

  try {
    // get login info from server
    let res = await axiosIns.get('/auth/logout');
    data = res.data;

    // if successfully logged out, revalidate me info API.
    await mutate('/auth/me');
  } catch (e) {
    // even if error caught, still need to revalidate me info API.
    await mutate('/auth/me');
    apiErrorThrower(e);
  }

  return data;
}

interface MeInfoIn {
  has_role: boolean;
  role_name: string;
}

/**
 * Get me info from API.
 *
 * Returns:
 *
 * If success, return `string` of current logged in account's role name. If not logged in, return `undefined`.
 */
export async function getMe(): Promise<string | undefined> {

  let data = undefined;

  try {
    let res = await axiosIns.get('/auth/me');
    data = res.data;
  } catch (e) {
    // try to check if the error is because of user not logged in.
    // if it is, return guest, else, goto apiErrorThrower()
    try {
      if ((e as any).response.data.detail.name == 'token_required') {
        return undefined;
      }
    } catch (err) {
    }

    apiErrorThrower(e);
  }

  return (data as MeInfoIn).role_name;
}


export function useGetMe() {
  return useSWR('/auth/me', getMe);
}