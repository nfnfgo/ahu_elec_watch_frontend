import Axios, {AxiosInstance} from 'axios';

import * as gene_config from '@/config/general';

export const axiosIns = Axios.create({
    baseURL: gene_config.backendBaseUrl,
    timeout: gene_config.backendRequestTimeoutMs,
    withCredentials: true,
});