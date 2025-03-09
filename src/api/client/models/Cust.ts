/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Cust = {
  id: number;
  current_geo_lat?: (number | null) | null;
  current_geo_long?: (number | null) | null;
  selected_geo_lat?: (number | null) | null;
  selected_geo_long?: (number | null) | null;
  locale?: string | null;
  token: string;
  hobo?: boolean | null;
  hobo_at?: (string | null) | null;
  readonly created_at: string;
  readonly updated_at: string;
};
