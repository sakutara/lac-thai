import fs from 'node:fs';
import path from 'node:path';

export interface ReservationChannelsFileConfig {
  googleSheet: {
    sheetName: string;
    spreadsheetUrl: string;
    webhookUrl: string;
  };
  emails: {
    generalManager: string;
    branchMacThiBuoi: string;
    branchXuanThuy: string;
    sendGuestConfirmation: boolean;
  };
  legacyEndpoint: {
    enableLegacyPost: boolean;
  };
}

export function syncEnvFromConfig(rootDir: string = process.cwd()): string {
  const configPath = path.join(rootDir, 'config', 'reservation-channels.json');
  const envPath = path.join(rootDir, '.env');

  const rawJson = fs.readFileSync(configPath, 'utf-8');
  const parsed = JSON.parse(rawJson) as ReservationChannelsFileConfig;

  const envLines = [
    '# Auto-generated from config/reservation-channels.json — DO NOT EDIT DIRECTLY',
    `VITE_RESERVATION_SHEET_URL="${parsed.googleSheet.spreadsheetUrl ?? ''}"`,
    `VITE_RESERVATION_WEBHOOK_URL="${parsed.googleSheet.webhookUrl ?? ''}"`,
    `VITE_RESERVATION_EMAIL_MANAGER="${parsed.emails.generalManager ?? 'info@lacthai.com.vn'}"`,
    `VITE_RESERVATION_EMAIL_MTB="${parsed.emails.branchMacThiBuoi ?? 'letan.q1@lacthai.com.vn'}"`,
    `VITE_RESERVATION_EMAIL_XT="${parsed.emails.branchXuanThuy ?? 'letan.thaodien@lacthai.com.vn'}"`,
    `VITE_RESERVATION_SEND_GUEST_EMAIL="${String(parsed.emails.sendGuestConfirmation ?? true)}"`,
    `VITE_RESERVATION_ENABLE_LEGACY_POST="${String(parsed.legacyEndpoint.enableLegacyPost ?? false)}"`,
    '',
  ];

  const envContent = envLines.join('\n');
  fs.writeFileSync(envPath, envContent, 'utf-8');
  return envContent;
}

if (process.argv[1] && process.argv[1].endsWith('sync-env-from-config.ts')) {
  syncEnvFromConfig();
  console.log('✓ Generated .env from config/reservation-channels.json');
}
