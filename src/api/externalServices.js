import { getAsyncResult } from "../utils/getAsyncResults";

export const genericGetService = async (url, options = {}) => {
  return await getAsyncResult(fetch(url, options));
}

export const genericPostService = async (url, payload,
  options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }) => {

  return await getAsyncResult(fetch(url, {
    headers: options.headers,
    method: "POST",
    body: JSON.stringify(payload),
  }));
}

export const genericPutService = async (url, payload,
  options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }) => {

  return await getAsyncResult(fetch(url, {
    headers: options.headers,
    method: "PUT",
    body: JSON.stringify(payload),
  }));
}

export const getAuthHeaders = (token) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
}
