import { NextResponse } from "next/server";
import { IngestRequestSchema } from "@/types/assistant";
import { createSupabaseServiceClient } from "@/server/supabase";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = IngestRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { user_id, kind, input_text } = parsed.data;

  const supabase = createSupabaseServiceClient();

  const { data: job, error } = await supabase
    .from("ingestion_jobs")
    .insert({
      user_id,
      kind,
      input_text,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const webhookBase = process.env.N8N_WEBHOOK_BASE_URL;
  if (webhookBase) {
    // Fire-and-forget best-effort
    fetch(`${webhookBase}/lifeos-ingest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        job_id: job.id,
        user_id,
        kind,
        input_text,
      }),
    }).catch(() => null);
  }

  return NextResponse.json({ job_id: job.id });
}
