import { ServerConnection } from '@jupyterlab/services';

export namespace ContainDS {
  /**
   * Dashboard interface
   */
  export interface IDashboard {
    /**
     * Dashboard name
     */
    name: string;
    /**
     * URL to launch the dashboard
     */
    url: string;
    /**
     * Dashboard description
     */
    description: string;
    /**
     * Dashboard file
     */
    path: string;
    /**
     * Dashboard author
     */
    username: string;
  }

  /**
   * Dashboard available for the user
   */
  export interface IDashboards {
    /**
     * Owned dashboards
     */
    _owned: IDashboard[];
    /**
     * Shared dashboards grouped by authors
     */
    [key: string]: IDashboard[];
  }
}

/**
 * Call the hub API
 *
 * @param endPoint API REST end point
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
export async function requestAPI<T>(
  endPoint: string,
  init: RequestInit = {}
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(endPoint, { ...init, cache: 'no-cache' });
  } catch (error) {
    throw new ServerConnection.NetworkError(error);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data.message);
  }

  return data;
}
