import { z } from "zod";

export const IngestRequestSchema = z.object({
  user_id: z.string().uuid(),
  kind: z.enum(["text", "link"]),
  input_text: z.string().min(1),
});

export type IngestRequest = z.infer<typeof IngestRequestSchema>;
