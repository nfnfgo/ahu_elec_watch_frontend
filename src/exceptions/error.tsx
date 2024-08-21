import toast from 'react-hot-toast';
import {message} from "antd";

export class BaseError extends Error {
  name: string;

  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export class ParamError extends BaseError {
  constructor(message: string) {
    super('param_error', message);
  }
}

export class NetworkError extends BaseError {
  constructor() {
    super('network_error', 'Network error occurred, ' +
      'please check your Internet connection or maybe there is error occurred at server side.');
  }
}

/**
 * Error thrower used by function that do api request.
 * @param e The error need to be parsed and throw.
 */
export function apiErrorThrower(e: any) {
  // if it's an Axios Error, and server response with status code out of 2xx range.
  if (e.response) {

    // if backend doesn't give any further info
    // throw request_error
    if (!e.response.data) {
      throw new BaseError(
        'request_error',
        'Error occurred when requesting backend API. ' +
        `(HTTP Status Code: ${e.response.status}). \n` + e);
    }

    // backend has data info, but not in standard type (with name and message key)
    // throw backend_error with detail itself as message
    if (e.response.data.detail && (!e.response.data.detail.name || !e.response.data.detail.message)) {
      throw new BaseError('backend_error', JSON.stringify(
        e.response.data.detail,
      ))
    }

    // backend give enough info
    // through standard backend_error with correct name and message given by backend.
    let err_data = e.response.data.detail;
    throw new BaseError(
      err_data.name,
      err_data.message,
    )
  }

  // if it's axios network error
  if (e.message == 'Network Error') {
    throw new NetworkError()
  }

  // If not axios error, throw unknown error
  throw new BaseError('unknown_error', 'Error occurred when requesting API: ' + e.message);
}


export function errorPopper(e: any) {
  if (e.name !== undefined && e.message !== undefined) {
    toast.error(`${e.message} (${e.name})`)
  } else {
    toast.error(e.message);
  }
}