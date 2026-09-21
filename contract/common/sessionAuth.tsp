import "@typespec/http";

using Http;

model SessionAuth is ApiKeyAuth<ApiKeyLocation.cookie, "sessions">;
