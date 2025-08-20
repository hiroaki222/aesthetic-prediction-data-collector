import Admin from "@/components/admin";
import { fetchRole, fetchUser } from "@/utils/supabase/actions";
import { redirect } from "next/navigation";

export default function AdminPage() {
  (async () => {
    const uuid = await fetchUser('id');
    if (!uuid) {
      const role = await fetchRole(uuid);
      if (!role) {
        redirect(`/dashboard`);
      }
    }
  })()
  return (
    <Admin />
  )
}