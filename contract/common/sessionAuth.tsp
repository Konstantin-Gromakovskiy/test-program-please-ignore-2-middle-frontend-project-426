import "@typespec/http";

using Http;

model SessionAutha is ApiKeyAuth<ApiKeyLocation.cookie, "sessions">;
