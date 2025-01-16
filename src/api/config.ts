import { OpenAPI } from "./client";
import { API_URL } from "astro:env/client";

// OpenAPI.TOKEN = getAccessToken;
OpenAPI.BASE = API_URL;
