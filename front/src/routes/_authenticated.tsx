import { createFileRoute, Outlet } from "@tanstack/react-router";
import { meOptions } from "@/shared/api";
import { redirect } from "@tanstack/react-router";
import { routes } from "@/shared/config";

export const Route = createFileRoute("/_authenticated")({
  component: () => <Outlet />,
  async beforeLoad({ context }) {
    const { queryClient } = context;
    try {
      const user = await queryClient.query(meOptions());
      return { user };
    } catch (e) {
      console.error(e);
      throw redirect({ to: routes.login });
    }
  },
});
