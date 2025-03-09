/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_object_api_v1_create_object_post } from "../models/Body_create_object_api_v1_create_object_post";
import type { City } from "../models/City";
import type { CityIn } from "../models/CityIn";
import type { CityUpdate } from "../models/CityUpdate";
import type { Cust } from "../models/Cust";
import type { Message } from "../models/Message";
import type { Tour } from "../models/Tour";
import type { TourIn } from "../models/TourIn";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AdminService {
  /**
   * All Customers
   * Получение списка всех пользователей
   * @returns Cust Successful Response
   * @throws ApiError
   */
  public static allCustomersApiV1AllCustomersGet(): CancelablePromise<
    Array<Cust>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/all-customers",
    });
  }
  /**
   * Set Cities
   * Перезапись списка городов
   * @param requestBody
   * @returns City Successful Response
   * @throws ApiError
   */
  public static setCitiesApiV1SetCitiesPost(
    requestBody: Array<CityIn>,
  ): CancelablePromise<Array<City>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/set-cities",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * New City
   * Добавление города
   * @param requestBody
   * @returns City Successful Response
   * @throws ApiError
   */
  public static newCityApiV1NewCityPost(
    requestBody: CityIn,
  ): CancelablePromise<City> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/new-city",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Drop City
   * Удаление города
   * @param cityId
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static dropCityApiV1CityCityIdDelete(
    cityId: number,
  ): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/city/{city_id}",
      path: {
        city_id: cityId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update City
   * Обновление города
   * @param cityId
   * @param requestBody
   * @returns City Successful Response
   * @throws ApiError
   */
  public static updateCityApiV1CityCityIdPut(
    cityId: number,
    requestBody: CityUpdate,
  ): CancelablePromise<City> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/city/{city_id}",
      path: {
        city_id: cityId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Drop Cache
   * Очистка кэша запросов в NOOA
   * @returns any Successful Response
   * @throws ApiError
   */
  public static dropCacheApiV1DropCacheDelete(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/drop-cache",
    });
  }
  /**
   * Set Tour
   * Добавление тура
   * @param requestBody
   * @returns Tour Successful Response
   * @throws ApiError
   */
  public static setTourApiV1TourPost(
    requestBody: TourIn,
  ): CancelablePromise<Tour> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/tour",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Drop Tour
   * Удаление тура
   * @param tourId
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static dropTourApiV1TourTourIdDelete(
    tourId: number,
  ): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/tour/{tour_id}",
      path: {
        tour_id: tourId,
      },
      errors: {
        404: `Not Found`,
        422: `Validation Error`,
      },
    });
  }
  /**
   * Create Object
   * Сохранение медиафайла в папку media
   * @param formData
   * @param name
   * @returns string Successful Response
   * @throws ApiError
   */
  public static createObjectApiV1CreateObjectPost(
    formData: Body_create_object_api_v1_create_object_post,
    name?: string | null,
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/create-object",
      query: {
        name: name,
      },
      formData: formData,
      mediaType: "multipart/form-data",
      errors: {
        409: `Conflict`,
        422: `Validation Error`,
      },
    });
  }
}
