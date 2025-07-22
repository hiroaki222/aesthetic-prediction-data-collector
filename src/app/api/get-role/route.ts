import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user-data")
    .select("role")
    .eq("uuid", uuid)
    .single();

  if (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({ role: data });
}
