/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuroraNooaProbabilityResponse } from "../models/AuroraNooaProbabilityResponse";
import type { AuroraProbabilityBody } from "../models/AuroraProbabilityBody";
import type { AuroraProbabilityResponse } from "../models/AuroraProbabilityResponse";
import type { City } from "../models/City";
import type { NooaAuroraKp27Row } from "../models/NooaAuroraKp27Row";
import type { NooaAuroraKp3Col } from "../models/NooaAuroraKp3Col";
import type { NooaAuroraReq } from "../models/NooaAuroraReq";
import type { NooaAuroraRes } from "../models/NooaAuroraRes";
import type { Tour } from "../models/Tour";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ApiService {
  /**
   * Api Aurora Probability
   * Получение вероятности северного сияния по заданным параметрам
   * @param requestBody
   * @returns AuroraProbabilityResponse Successful Response
   * @throws ApiError
   */
  public static apiAuroraProbabilityApiV1AuroraProbabilitiyPost(
    requestBody: AuroraProbabilityBody,
  ): CancelablePromise<AuroraProbabilityResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/aurora-probabilitiy",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Api Aurora Nooa Probability
   * Получение вероятности северного сияния по заданным координатам из nooa
   * @param requestBody
   * @returns AuroraNooaProbabilityResponse Successful Response
   * @throws ApiError
   */
  public static apiAuroraNooaProbabilityApiV1AuroraNooaProbabilityPost(
    requestBody: NooaAuroraReq,
  ): CancelablePromise<AuroraNooaProbabilityResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/aurora-nooa-probability",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Api Aurora Map
   * Получение карты северного сияния
   * @returns NooaAuroraRes Successful Response
   * @throws ApiError
   */
  public static apiAuroraMapApiV1AuroraMapGet(): CancelablePromise<NooaAuroraRes> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/aurora-map",
    });
  }
  /**
   * Api Aurora Kp 3
   * Получение планетарного k-индекса за 3 дня
   * @returns NooaAuroraKp3Col Successful Response
   * @throws ApiError
   */
  public static apiAuroraKp3ApiV1AuroraKp3Get(): CancelablePromise<
    Array<NooaAuroraKp3Col>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/aurora-kp-3",
    });
  }
  /**
   * Api Aurora Kp Map
   * Получение планетарного k-индекса за 27 дней
   * @returns NooaAuroraKp27Row Successful Response
   * @throws ApiError
   */
  public static apiAuroraKpMapApiV1AuroraKp27Get(): CancelablePromise<
    Array<NooaAuroraKp27Row>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/aurora-kp-27",
    });
  }
  /**
   * Api All Cities
   * Получение списка всех городов для выбора
   * @returns City Successful Response
   * @throws ApiError
   */
  public static apiAllCitiesApiV1AllCitiesGet(): CancelablePromise<
    Array<City>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/all-cities",
    });
  }
  /**
   * Api All Tours
   * Получение списка всех туров для выбора
   * @returns Tour Successful Response
   * @throws ApiError
   */
  public static apiAllToursApiV1AllToursGet(): CancelablePromise<Array<Tour>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/all-tours",
    });
  }
}
