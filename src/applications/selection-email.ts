import {
  colors,
  escapeHtml,
  fontStack,
  greetingFor,
  type EmailContent,
} from '../auth/email-templates.js';

export type SelectionEmailInput = {
  name?: string | null;
  projectTitle: string;
  applicationNo: string;
  workEmail: string;
  workPassword: string;
  workInstructions?: string | null;
  projectsUrl?: string | null;
};

const mono = "'SFMono-Regular',Menlo,Consolas,monospace";

function credentialRow(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 14px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${colors.muted};white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:10px 14px;font-family:${mono};font-size:15px;font-weight:600;color:${colors.text};word-break:break-all;">${escapeHtml(value)}</td>
  </tr>`;
}

function instructionsHtml(instructions: string) {
  if (!instructions) return '';
  return `<h2 style="margin:28px 0 10px;font-size:16px;font-weight:700;color:${colors.text};">Work instructions</h2>
  <div style="color:${colors.muted};font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(instructions)}</div>`;
}

/** Onboarding email with work credentials, sent when a candidate is offered. */
export function selectionEmail(input: SelectionEmailInput): EmailContent {
  const greeting = greetingFor(input.name);
  const intro = `Great news — you've been offered a place on ${input.projectTitle}. Below are the work account details you'll use for the assessment and onboarding.`;
  const instructions = input.workInstructions ?? '';
  const year = new Date().getFullYear();

  const text = [
    greeting,
    '',
    `Congratulations! You've been selected for ${input.projectTitle}.`,
    '',
    'Your work account',
    `Email: ${input.workEmail}`,
    `Password: ${input.workPassword}`,
    '',
    ...(instructions ? ['Work instructions', instructions, ''] : []),
    'Keep these details private. Change the password after your first login if the platform allows it.',
    ...(input.projectsUrl ? ['', `My Projects: ${input.projectsUrl}`] : []),
    '',
    `Application: ${input.applicationNo}`,
    '— Titan Freelance',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <title>Next Steps</title>
  </head>
  <body style="margin:0;padding:0;background-color:${colors.page};font-family:${fontStack};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">You've been offered a place on ${escapeHtml(input.projectTitle)}.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${colors.page};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
            <tr>
              <td style="padding:0 4px 24px;">
                <span style="font-size:22px;font-weight:800;letter-spacing:-0.02em;color:${colors.text};">Titan<span style="color:${colors.primary};">.</span></span>
                <span style="display:block;margin-top:2px;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${colors.primary};">Freelance</span>
              </td>
            </tr>
            <tr>
              <td style="background-color:${colors.card};border:1px solid ${colors.border};border-radius:16px;padding:36px 32px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${colors.primary};">&#9679;&nbsp; Next Steps</p>
                <h1 style="margin:0 0 20px;font-size:26px;line-height:1.25;font-weight:800;color:${colors.text};">Welcome to the next step &#127881;</h1>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${colors.text};">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${colors.muted};">${escapeHtml(intro)}</p>

                <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${colors.text};">Your work account</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${colors.codeBg};border:1px solid ${colors.primary};border-radius:12px;">
                  ${credentialRow('Email', input.workEmail)}
                  ${credentialRow('Password', input.workPassword)}
                </table>
                <p style="margin:10px 0 0;font-size:12px;line-height:1.6;color:${colors.muted};">Keep these details private. Change the password after your first login if the platform allows it.</p>

                ${instructions ? instructionsHtml(instructions) : ''}

                ${
                  input.projectsUrl
                    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;">
                  <tr>
                    <td style="background-color:${colors.primary};border-radius:10px;">
                      <a href="${escapeHtml(input.projectsUrl)}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Open My Projects</a>
                    </td>
                  </tr>
                </table>`
                    : ''
                }

                <hr style="margin:28px 0 20px;border:none;border-top:1px solid ${colors.border};" />
                <p style="margin:0;font-size:13px;line-height:1.6;color:${colors.muted};">Questions? Reply to this email or reach us on WhatsApp from your dashboard.</p>
                <p style="margin:8px 0 0;font-size:12px;color:${colors.muted};">Application ${escapeHtml(input.applicationNo)}</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 4px 0;font-size:12px;line-height:1.6;color:${colors.muted};">
                &copy; ${year} Titan Freelance · The human layer behind AI
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject: `Next Steps on ${input.projectTitle}`,
    text,
    html,
  };
}

export function selectionConfirmationEmail(input: {
  name?: string | null;
  projectTitle: string;
  applicationNo: string;
  projectsUrl?: string | null;
}): EmailContent {
  const greeting = greetingFor(input.name);
  const steps = [
    'Review the project details and resources in My Projects.',
    'Complete any remaining onboarding or payment profile steps.',
    'Wait for the project team to confirm your start instructions.',
  ];
  const text = [
    greeting,
    '',
    `Congratulations! You have completed the assessment and have been selected for ${input.projectTitle}.`,
    '',
    'Next steps',
    ...steps,
    ...(input.projectsUrl ? ['', `My Projects: ${input.projectsUrl}`] : []),
    '',
    `Application: ${input.applicationNo}`,
    '— Titan Freelance',
  ].join('\n');
  const stepsHtml = steps
    .map(
      (step, index) => `<tr>
        <td style="width:28px;padding:0 10px 12px 0;vertical-align:top;font-size:14px;font-weight:700;color:${colors.primary};">${index + 1}.</td>
        <td style="padding:0 0 12px;font-size:14px;line-height:1.6;color:${colors.muted};">${escapeHtml(step)}</td>
      </tr>`,
    )
    .join('');
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <title>Congratulations! You're selected</title>
  </head>
  <body style="margin:0;padding:0;background-color:${colors.page};font-family:${fontStack};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Congratulations! You've been selected for ${escapeHtml(input.projectTitle)}.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${colors.page};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
            <tr>
              <td style="padding:0 4px 24px;">
                <span style="font-size:22px;font-weight:800;letter-spacing:-0.02em;color:${colors.text};">Titan<span style="color:${colors.primary};">.</span></span>
                <span style="display:block;margin-top:2px;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${colors.primary};">Freelance</span>
              </td>
            </tr>
            <tr>
              <td style="background-color:${colors.card};border:1px solid ${colors.border};border-radius:16px;padding:36px 32px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${colors.primary};">&#9679;&nbsp; Selected</p>
                <h1 style="margin:0 0 20px;font-size:26px;line-height:1.25;font-weight:800;color:${colors.text};">Congratulations! &#127881;</h1>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${colors.text};">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${colors.muted};">You have completed the assessment and have been selected for ${escapeHtml(input.projectTitle)}.</p>
                <h2 style="margin:0 0 14px;font-size:16px;font-weight:700;color:${colors.text};">Next Steps</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${stepsHtml}</table>
                ${
                  input.projectsUrl
                    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 0;">
                  <tr>
                    <td style="background-color:${colors.primary};border-radius:10px;">
                      <a href="${escapeHtml(input.projectsUrl)}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Open My Projects</a>
                    </td>
                  </tr>
                </table>`
                    : ''
                }
                <hr style="margin:28px 0 20px;border:none;border-top:1px solid ${colors.border};" />
                <p style="margin:0;font-size:13px;line-height:1.6;color:${colors.muted};">Questions? Reply to this email or reach us on WhatsApp from your dashboard.</p>
                <p style="margin:8px 0 0;font-size:12px;color:${colors.muted};">Application ${escapeHtml(input.applicationNo)}</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 4px 0;font-size:12px;line-height:1.6;color:${colors.muted};">&copy; ${new Date().getFullYear()} Titan Freelance · The human layer behind AI</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  return {
    subject: `Congratulations! You're selected for ${input.projectTitle}`,
    text,
    html,
  };
}
