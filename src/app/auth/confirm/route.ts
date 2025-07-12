import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (error) {
      const code = error.status?.toString() || "401";
      const message = encodeURIComponent(
        error.message || "Failed to authenticate"
      );
      const description = encodeURIComponent(error.message.replace(/_/g, " "));

      redirect(`/error/${code}?message=${message}&description=${description}`);
    }
    redirect(next);
  } else {
    const code = !token_hash ? "400" : "422";
    const message = encodeURIComponent(
      !token_hash ? "token_hash is missing" : "type is missing or invalid"
    );
    const description = encodeURIComponent(
      !token_hash
        ? "The URL is missing the token_hash parameter."
        : "The URL is missing the type parameter or it is invalid."
    );
    redirect(`/error/${code}?message=${message}&description=${description}`);
  }
}
