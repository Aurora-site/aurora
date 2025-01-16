/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuroraProbabilityBody } from "./AuroraProbabilityBody";
import type { AuroraProbabilityCalculation } from "./AuroraProbabilityCalculation";
import type { SwpcApiData } from "./SwpcApiData";
export type AuroraProbabilityResponse = {
  calc_data: AuroraProbabilityCalculation;
  user_data: AuroraProbabilityBody;
  api_data: SwpcApiData;
};
