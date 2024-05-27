import Axios, {AxiosInstance} from 'axios';

import {BaseError} from '@/exceptions/error';
import {throws} from "node:assert";

export const axiosIns = Axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});