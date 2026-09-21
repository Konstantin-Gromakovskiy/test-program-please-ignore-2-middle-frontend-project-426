import "@typespec/http";

using Http;
@service(#{ title: "Widget Service" })
namespace DemoService;

scalar Money extends int32;

@error
model ProblemDetails {
  type?: url;
  title: string;
  status: int32;
  detail?: string;
  instance?: url;
}
