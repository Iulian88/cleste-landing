import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, address, items, total, product } = body as {
    name: string;
    phone: string;
    address: string;
    items: { name: string; price: number; qty: number }[];
    total: number;
    product?: string;
  };

  if (!name?.trim() || !phone?.trim() || !address?.trim()) {
    return NextResponse.json(
      { error: "Câmpurile name, phone și address sunt obligatorii." },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0 || typeof total !== "number") {
    return NextResponse.json(
      { error: "Comanda nu conține produse valide." },
      { status: 400 }
    );
  }

  const { error } = await getSupabase().from("orders").insert({
    name: name.trim(),
    phone: phone.trim(),
    address: address.trim(),
    product: JSON.stringify({ source: product ?? "unknown", items }),
    price: total,
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
