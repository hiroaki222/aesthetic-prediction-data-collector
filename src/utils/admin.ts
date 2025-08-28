"use server";
import { createClient } from "./supabase/server";

export const getCumulativeUserComparison = async (): Promise<{
  lastWeekCount: number;
  todayCount: number;
  change: string;
  upDown: "up" | "down";
}> => {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { count: lastWeekCount, error: err1 } = await supabase
    .from("user-data")
    .select("id", { count: "exact", head: true })
    .lte("created_at", `${sevenDaysAgo}T23:59:59`);

  const { count: todayCount, error: err2 } = await supabase
    .from("user-data")
    .select("id", { count: "exact", head: true })
    .lte("created_at", `${today}T23:59:59`);

  if (err1 || err2) {
    console.error(err1 ?? err2);
    return { lastWeekCount: 0, todayCount: 0, change: "0", upDown: "down" };
  }

  const lw = lastWeekCount ?? 0;
  const td = todayCount ?? 0;

  const change = (lw / td) * 100;
  if (lw || td || change) {
    return {
      lastWeekCount: lw,
      todayCount: td,
      change: String(Math.round(change)),
      upDown: change > 0 ? "up" : "down",
    };
  }
  return {
    lastWeekCount: 0,
    todayCount: 0,
    change: "0",
    upDown: "down",
  };
};
