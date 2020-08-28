// import { URLExt } from '@jupyterlab/coreutils';

import { ServerConnection } from '@jupyterlab/services';

export namespace ContainDS {
  export interface IDashboard {
    name: string;
    url: string;
    description: string;
    path: string;
    username: string;
  }

  export interface IDashboards {
    _owned: IDashboard[];
    [key: string]: IDashboard[];
  }
}

/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
export async function requestAPI<T>(
  endPoint: string,
  init: RequestInit = {}
): Promise<T> {
  // Make request to Jupyter API
  // const settings = ServerConnection.makeSettings();
  // const requestUrl = URLExt.join(endPoint);

  let response: Response;
  try {
    // response = await ServerConnection.makeRequest(requestUrl, init, settings);
    response = await fetch(endPoint, init);
  } catch (error) {
    throw new ServerConnection.NetworkError(error);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data.message);
  }

  return data;
}
