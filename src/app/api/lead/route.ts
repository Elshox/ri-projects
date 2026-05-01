import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

/* ── Server-side schema (no consent — UI only) ── */
const schema = z.object({
  name:    z.string().min(2),
  company: z.string().optional().default(''),
  phone:   z.string().min(7),
  email:   z.string().email(),
  type:    z.string().default('contact'),
  message: z.string().optional().default(''),
});

type Lead = z.infer<typeof schema>;

/* ── Telegram ── */
async function sendTelegram(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    '🔔 <b>Новая заявка с сайта</b>',
    '',
    `👤 <b>Имя:</b> ${lead.name}`,
    lead.company && `🏢 <b>Компания:</b> ${lead.company}`,
    `📞 <b>Телефон:</b> ${lead.phone}`,
    `📧 <b>Email:</b> ${lead.email}`,
    lead.message && `💬 <b>Сообщение:</b> ${lead.message}`,
    `📌 <b>Тип:</b> ${lead.type}`,
  ]
    .filter(Boolean)
    .join('\n');

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    },
  );

  if (!res.ok) throw new Error(`Telegram error ${res.status}`);
}

/* ── Resend email ── */
async function sendEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://riprojects.org';

  await resend.emails.send({
    from: `RI PROJECTS <noreply@${new URL(siteUrl).hostname}>`,
    to: ['hello@riprojects.org'],
    subject: `Новая заявка от ${lead.name}`,
    html: `
      <table style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#1A1A1A;max-width:520px">
        <tr><td style="padding-bottom:24px">
          <h2 style="margin:0;font-size:20px">Новая заявка с сайта</h2>
        </td></tr>
        <tr><td><b>Имя:</b> ${lead.name}</td></tr>
        ${lead.company ? `<tr><td><b>Компания:</b> ${lead.company}</td></tr>` : ''}
        <tr><td><b>Телефон:</b> ${lead.phone}</td></tr>
        <tr><td><b>Email:</b> ${lead.email}</td></tr>
        ${lead.message ? `<tr><td style="padding-top:12px"><b>Сообщение:</b><br>${lead.message}</td></tr>` : ''}
      </table>
    `,
  });
}

/* ── POST /api/lead ── */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const lead = parsed.data;

  /* Fire both notifications in parallel; log failures but don't block response */
  const [tg, rs] = await Promise.allSettled([
    sendTelegram(lead),
    sendEmail(lead),
  ]);

  if (tg.status === 'rejected') console.error('[lead] Telegram:', tg.reason);
  if (rs.status === 'rejected') console.error('[lead] Resend:',   rs.reason);

  return NextResponse.json({ ok: true });
}
