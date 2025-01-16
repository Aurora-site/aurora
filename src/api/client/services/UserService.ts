/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cust } from "../models/Cust";
import type { CustIn } from "../models/CustIn";
import type { CustSubResponse } from "../models/CustSubResponse";
import type { GetUserResponse } from "../models/GetUserResponse";
import type { Sub } from "../models/Sub";
import type { SubIn } from "../models/SubIn";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class UserService {
  /**
   * New User
   * Создание нового пользователя
   * @param requestBody
   * @returns Cust Successful Response
   * @throws ApiError
   */
  public static newUserApiV1NewUserPost(
    requestBody: CustIn,
  ): CancelablePromise<Cust> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/new-user",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        409: `Conflict`,
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get User
   * Получение пользователя и его подписок по id
   * @param id
   * @returns GetUserResponse Successful Response
   * @throws ApiError
   */
  public static getUserApiV1UserIdGet(
    id: number,
  ): CancelablePromise<GetUserResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/user/{id}",
      path: {
        id: id,
      },
      errors: {
        404: `Not Found`,
        409: `Conflict`,
        422: `Validation Error`,
      },
    });
  }
  /**
   * New Subscription
   * Создание новой подписки для существующего пользователя
   * @param requestBody
   * @returns CustSubResponse Successful Response
   * @throws ApiError
   */
  public static newSubscriptionApiV1NewSubscriptionPost(
    requestBody: SubIn,
  ): CancelablePromise<CustSubResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/new-subscription",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        404: `Not Found`,
        409: `Conflict`,
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Subscription
   * Получение подписки по id
   * @param id
   * @returns Sub Successful Response
   * @throws ApiError
   */
  public static getSubscriptionApiV1SubscriptionIdGet(
    id: string,
  ): CancelablePromise<Sub> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/subscription/{id}",
      path: {
        id: id,
      },
      errors: {
        404: `Not Found`,
        409: `Conflict`,
        422: `Validation Error`,
      },
    });
  }
}
