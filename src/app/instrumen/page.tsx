import { redirect } from "next/navigation";

export default async function InstrumenAliasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params.set(k, v);
    else if (Array.isArray(v) && v[0]) params.set(k, v[0]);
  }
  const queryStr = params.toString();
  redirect(queryStr ? `/virtual-instruments?${queryStr}` : "/virtual-instruments");
}
