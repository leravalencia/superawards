const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certsDir = path.join(process.cwd(), 'certs');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

// Generate self-signed certificate
const command = `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ${path.join(certsDir, 'localhost.key')} -out ${path.join(certsDir, 'localhost.crt')} -subj "/CN=localhost"`;

try {
  execSync(command);
  console.log('SSL certificates generated successfully!');
  console.log('Add these environment variables to your .env.local file:');
  console.log('SSL_KEY_PATH=certs/localhost.key');
  console.log('SSL_CERT_PATH=certs/localhost.crt');
} catch (error) {
  console.error('Error generating SSL certificates:', error);
} 