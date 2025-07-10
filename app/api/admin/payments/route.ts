import { NextRequest, NextResponse } from "next/server";
import { supabaseDb } from "@/lib/services/supabase-database";
import { authenticateUser, isAdmin } from "@/lib/middleware/auth"

export async function GET(req: NextRequest) {
  const { user } = await authenticateUser(req);
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const data = await supabaseDb.getTotalPaymentAmount();
  if (!data) {
    return NextResponse.json({ success: false, message: "No payments found" }, { status: 404 });
  
  }
  return NextResponse.json({ success: true, payments: data }, { status: 200 });
}
