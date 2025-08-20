import Admin from "@/components/admin";
import { fetchRole, fetchUser } from "@/utils/supabase/actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const uuid = await fetchUser("id");
  if (!uuid || typeof uuid !== "string" || uuid.startsWith("error:")) {
    redirect("/signin");
  }
  const roleRow = await fetchRole(uuid);
  const role = roleRow && typeof roleRow === "object" ? (roleRow as { role?: boolean }).role : null;
  if (role !== true) {
    redirect("/dashboard");
  }
  return <Admin />;
}