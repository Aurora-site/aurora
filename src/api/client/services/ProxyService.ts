/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ProxyService {
  /**
   * Api Cloud Map
   * @param z
   * @param x
   * @param y
   * @returns any Successful Response
   * @throws ApiError
   */
  public static apiCloudMapApiV1ProxyOsmTileMapZXYPngGet(
    z: number,
    x: number,
    y: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/proxy/osm-tile-map/{z}/{x}/{y}.png",
      path: {
        z: z,
        x: x,
        y: y,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
