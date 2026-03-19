// Environment variable validation — runs at import time

interface EnvConfig {
  required: string[];
  optional: string[];
}

const config: EnvConfig = {
  required: [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
  ],
  optional: [
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_MONTHLY',
    'STRIPE_PRICE_LIFETIME',
    'PAGESPEED_API_KEY',
    'ANTHROPIC_API_KEY',
  ],
};

export function validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of config.required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Warn about optional but important vars
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    warnings.push('Google OAuth not configured — Google sign-in will not work');
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    warnings.push('Stripe not configured — payments will not work');
  }

  return { valid: missing.length === 0, missing, warnings };
}

// Run validation on module load in production
if (process.env.NODE_ENV === 'production') {
  const result = validateEnv();
  if (!result.valid) {
    console.error(`[ENV] Missing required environment variables: ${result.missing.join(', ')}`);
  }
  result.warnings.forEach(w => console.warn(`[ENV] ${w}`));
}
