const TOKEN = process.env.VERCEL_TOKEN || process.argv[2];
const PID = process.env.VERCEL_PROJECT_ID || process.argv[3];

// Try to update project to disable deployment protection
const body = {
  ssoProtection: null,
  passwordProtection: null
};

const res = await fetch('https://api.vercel.com/v9/projects/' + PID, {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer ' + TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});
const data = await res.json();
console.log('Status:', res.status);
console.log(JSON.stringify(data, null, 2));

// Try deploying with additional options
const DEPLOY_BODY = {
  name: 'knotbyfimihan',
  project: PID,
  target: 'production',
  autoAssignDomains: true,
  projectSettings: {
    framework: null,
    outputDirectory: '.'
  }
};
// We can't do a full deploy without files, so let's just check the project settings
