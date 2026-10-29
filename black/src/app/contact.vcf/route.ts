import { profile } from "@/lib/profile";
import { createVCard } from "@/lib/vcard";
export function GET() { return new Response(createVCard(profile), { headers: { "Content-Type": "text/vcard; charset=utf-8", "Content-Disposition": 'attachment; filename="nguyen-huu-nhat.vcf"', "X-Content-Type-Options": "nosniff" } }); }
