// Environment Variable Validation
// Run this before starting the app to ensure all required env vars are present

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const optionalEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_GA_ID',
];

function validateEnv() {
  console.log('🔍 Validating environment variables...\n');
  
  let hasErrors = false;
  
  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      console.error(`❌ Missing required environment variable: ${varName}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName}`);
    }
  });
  
  // Check optional variables
  console.log('\n📋 Optional variables:');
  optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}`);
    } else {
      console.log(`⚠️  ${varName} (not set)`);
    }
  });
  
  if (hasErrors) {
    console.error('\n❌ Environment validation failed!');
    console.error('Please check your .env.local file and ensure all required variables are set.');
    console.error('See .env.example for reference.\n');
    process.exit(1);
  }
  
  console.log('\n✅ Environment validation passed!\n');
}

// Only run validation if this file is executed directly
if (require.main === module) {
  validateEnv();
}

module.exports = { validateEnv };
