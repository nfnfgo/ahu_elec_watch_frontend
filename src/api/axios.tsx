import Axios, {AxiosInstance} from 'axios';

import {BaseError} from '@/exceptions/error';
import {throws} from "node:assert";

import * as gene_config from '@/config/general';

export const axiosIns = Axios.create({
  baseURL: process.env.NODE_ENV == 'development' ? 'http://localhost:8000' : gene_config.backendBaseUrl,
  timeout: 10000,
});