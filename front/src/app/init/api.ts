import { client } from "@/shared/api";

export function initApi() {
  client.setConfig({ baseUrl: "" });
}
