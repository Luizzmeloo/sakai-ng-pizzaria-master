const path = require('path');
const fs = require('fs');
require('dotenv').config();  // Load environment variables from a .env file

const envConfigFile = `
export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${process.env.FIREBASE_DATABASE_URL}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}'
  }
};
`;

const environmentsPath = path.join(__dirname, 'src', 'environments');

// Ensure the directory exists
if (!fs.existsSync(environmentsPath)) {
  fs.mkdirSync(environmentsPath, { recursive: true });
}

fs.writeFileSync(path.join(environmentsPath, 'environment.prod.ts'), envConfigFile);
fs.writeFileSync(path.join(environmentsPath, 'environment.ts'), envConfigFile);
console.log('Environment config file generated');
