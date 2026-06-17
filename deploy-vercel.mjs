import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const TOKEN = process.env.VERCEL_TOKEN || process.argv[2];
const SITE_NAME = 'knotbyfimihan';

async function main() {
  const files = [];

  function addFile(localDir, relPath) {
    const fullPath = path.join(localDir, relPath);
    const content = fs.readFileSync(fullPath);
    const sha = crypto.createHash('sha1').update(content).digest('hex');
    files.push({ file: relPath.replace(/\\/g, '/'), size: content.length, sha });
  }

  function readDir(localDir, prefix = '') {
    const entries = fs.readdirSync(localDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(localDir, entry.name);
      const relPath = prefix ? path.join(prefix, entry.name) : entry.name;
      if (entry.isDirectory()) {
        readDir(fullPath, relPath);
      } else {
        const content = fs.readFileSync(fullPath);
        const sha = crypto.createHash('sha1').update(content).digest('hex');
        files.push({ file: relPath.replace(/\\/g, '/'), size: content.length, sha });
      }
    }
  }

  // Read static files from dist/
  readDir('dist');

  // Read API serverless functions from api/
  if (fs.existsSync('api')) {
    readDir('api', 'api');
  }

  // Read vercel.json from root
  if (fs.existsSync('vercel.json')) {
    addFile('.', 'vercel.json');
  }

  console.log('Local files:', files.length);

  const deployBody = {
    name: SITE_NAME,
    files,
    target: 'production',
    projectSettings: { framework: null, outputDirectory: '.' }
  };

  console.log('Creating deployment...');
  const res = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(deployBody)
  });
  let data = await res.json();
  console.log('Status:', res.status);

  if (res.status === 400 && data.error?.code === 'missing_files' && data.error?.missing?.length > 0) {
    const missing = data.error.missing;
    console.log('Uploading', missing.length, 'missing file(s)...');
    for (const sha of missing) {
      const fileMeta = files.find(f => f.sha === sha);
      if (!fileMeta) {
        console.log('  Cannot find local file for SHA:', sha);
        continue;
      }
      const localPath = fileMeta.file.startsWith('api/') ? path.join('api', fileMeta.file.slice(4)) : path.join('dist', fileMeta.file);
      const content = fs.readFileSync(localPath);
      console.log('  Uploading:', fileMeta.file, '(' + content.length + ' bytes)');
      const upRes = await fetch('https://api.vercel.com/v1/now/files', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + TOKEN,
          'Content-Type': 'application/octet-stream',
          'Content-Length': content.length.toString(),
          'x-now-digest': sha
        },
        body: content
      });
      const upData = await upRes.json().catch(() => ({}));
      console.log('    ->', upRes.status, JSON.stringify(upData).substring(0, 100) || '');
    }

    console.log('Retrying deployment creation...');
    const retryRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deployBody)
    });
    data = await retryRes.json();
    console.log('Retry Status:', retryRes.status);

    if (!retryRes.ok) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }
  } else if (!res.ok) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log('Deploy ID:', data.id);
  console.log('State:', data.readyState);
  console.log('URL:', data.url);

  if (data.requiredFiles && data.requiredFiles.length > 0) {
    console.log('Uploading', data.requiredFiles.length, 'files...');
    for (const fileInfo of data.requiredFiles) {
      const filePath = fileInfo.file;
      let localPath;
      if (filePath.startsWith('api/')) {
        localPath = path.join('api', filePath.slice(4));
      } else if (filePath === 'vercel.json') {
        localPath = 'vercel.json';
      } else {
        localPath = path.join('dist', filePath);
      }
      const content = fs.readFileSync(localPath);
      console.log('  Uploading:', filePath, '(' + content.length + ' bytes)');

      const upRes = await fetch('https://api.vercel.com/v13/deployments/' + data.id + '/files', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + TOKEN,
          'Content-Type': 'application/octet-stream',
          'Content-Length': content.length.toString(),
          'x-vercel-digest': fileInfo.sha || crypto.createHash('sha1').update(content).digest('hex')
        },
        body: content
      });
      const upData = await upRes.json().catch(() => ({}));
      console.log('    ->', upRes.status, upData.file || '');
    }
  } else if (data.readyState === 'READY') {
    console.log('All files were cached! Deploy ready.');
  }

  console.log('');
  console.log('Site will be at: https://' + data.url);
  console.log('Production: https://' + SITE_NAME + '-herdeydeji.vercel.app');
}

main().catch(console.error);
