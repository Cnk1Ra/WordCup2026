import { getSupabaseServer } from "@/lib/supabase/server";
import CuponsClient from "./CuponsClient";

export const dynamic = "force-dynamic";

export default async function CuponsPage() {
  const supabase = getSupabaseServer();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Cupons
        </h1>
        <p className="text-sm text-foreground/60">
          Códigos de desconto que o cliente aplica no carrinho.
        </p>
      </header>

      <CuponsClient coupons={coupons ?? []} />
    </div>
  );
}
