import nodemailer from "nodemailer";

export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  provider: any;
}) {
  const { identifier, url } = params;

  // In development: log to console
  if (process.env.NODE_ENV === "development") {
    console.log("\n" + "=".repeat(80));
    console.log("🔐 MAGIC LINK LOGIN");
    console.log("=".repeat(80));
    console.log(`📧 Email: ${identifier}`);
    console.log(`🔗 Login URL: ${url}`);
    console.log("=".repeat(80) + "\n");
    console.log("👉 Kopieer de URL hierboven en plak in je browser om in te loggen");
    console.log("=".repeat(80) + "\n");
    return;
  }

  // In production: send via Resend
  const { host } = new URL(url);
  const transport = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth: {
      user: "resend",
      pass: process.env.AUTH_RESEND_KEY,
    },
  });

  await transport.sendMail({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: identifier,
    subject: `Inloggen bij ${host}`,
    text: text({ url, host }),
    html: html({ url, host }),
  });
}

function html({ url, host }: { url: string; host: string }) {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #2C2C2E; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #3A3A3C; border-radius: 20px; padding: 40px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 60px; height: 60px; margin: 0 auto; background: linear-gradient(135deg, #34C759 0%, #30B350 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 32px; font-weight: bold;">V</span>
      </div>
      <h1 style="color: #F2F2F7; font-size: 24px; margin: 16px 0 8px;">ViaVia</h1>
      <p style="color: #AEAEB2; font-size: 16px; margin: 0;">Inloggen</p>
    </div>

    <p style="color: #F2F2F7; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Klik op de knop hieronder om in te loggen bij <strong>${escapedHost}</strong>:
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${url}" style="display: inline-block; background: #34C759; color: white; text-decoration: none; padding: 16px 32px; border-radius: 100px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(52, 199, 89, 0.3);">
        Inloggen
      </a>
    </div>

    <p style="color: #8E8E93; font-size: 14px; line-height: 1.6; margin-top: 32px; padding-top: 24px; border-top: 1px solid #48484A;">
      Als je deze email niet hebt aangevraagd, kun je deze veilig negeren.
    </p>
  </div>
</body>
</html>
`;
}

function text({ url, host }: { url: string; host: string }) {
  return `Inloggen bij ${host}\n\n${url}\n\n`;
}
