import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, address } = body as Record<string, string>;

  if (!name?.trim() || !phone?.trim() || !address?.trim()) {
    return NextResponse.json(
      { error: "Câmpurile name, phone și address sunt obligatorii." },
      { status: 400 }
    );
  }

  const { error } = await getSupabase().from("orders").insert({
    name: name.trim(),
    phone: phone.trim(),
    address: address.trim(),
    product: "Cleste",
    price: 99,
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json(
      { error: "Eroare la salvarea comenzii. Încearcă din nou." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
