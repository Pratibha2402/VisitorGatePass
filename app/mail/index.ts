import nodemailer from "nodemailer";
import fs from "fs";

function generateHtmlContent(templatePath: string, context?: Record<string, any>) {
  let htmlContent = fs.readFileSync(templatePath, "utf8");

  if (context) {
    Object.keys(context).forEach((key) => {
      const placeholder = `{{${key}}}`;
      htmlContent = htmlContent.replace(
        new RegExp(placeholder, "g"),
        String(context[key] ?? "")
      );
    });
  }

  return htmlContent;
}

export async function sendMailUsingTemplate(
  mailOptions: any,
  templateOptions: {
    path: string;
    context?: Record<string, any>;
  }
) {
  const html = generateHtmlContent(
    templateOptions.path,
    templateOptions.context
  );

  return sendMail({
    ...mailOptions,
    html,
  });
}

export async function sendMail(mailOptions: any) {
  if (process.env.ENABLE_MAILS !== "true") {
    console.log("Mail sending disabled");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: process.env.MAIL_USER
      ? {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        }
      : undefined,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.response);
  return info;
}