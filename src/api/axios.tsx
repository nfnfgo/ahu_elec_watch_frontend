import Axios, {AxiosInstance} from 'axios';

import {BaseError} from '@/exceptions/error';
import {throws} from "node:assert";

export const axiosIns = Axios.create({
  baseURL: process.env.NODE_ENV == 'development' ? 'http://localhost:8000' : 'https://api-ahuelec.nfblogs.com',
  timeout: 10000,
});