import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const TOKEN = process.env.VERCEL_TOKEN || process.argv[2];
const DIST = 'dist';
const SITE_NAME = 'knotbyfimihan';

async function main() {
  // Build file manifest
  const files = [];
  function readDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(DIST, fullPath).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        readDir(fullPath);
      } else {
        const content = fs.readFileSync(fullPath);
        const sha = crypto.createHash('sha1').update(content).digest('hex');
        files.push({
          file: relPath,
          size: content.length,
          sha
        });
      }
    }
  }
  readDir(DIST);
  console.log('Local files:', files.length);

  // Step 1: Create deployment with file manifest
  const deployBody = {
    name: SITE_NAME,
    files,
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

  // Handle 400/missing_files: upload missing files and retry
  if (res.status === 400 && data.error?.code === 'missing_files' && data.error?.missing?.length > 0) {
    const missing = data.error.missing;
    console.log('Uploading', missing.length, 'missing file(s)...');
    for (const sha of missing) {
      const fileMeta = files.find(f => f.sha === sha);
      if (!fileMeta) {
        console.log('  Cannot find local file for SHA:', sha);
        continue;
      }
      const localPath = path.join(DIST, fileMeta.file);
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

    // Retry with same manifest (Vercel now has the files)
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

  // Step 2: Check which files are needed
  if (data.requiredFiles && data.requiredFiles.length > 0) {
    console.log('Uploading', data.requiredFiles.length, 'files...');
    for (const fileInfo of data.requiredFiles) {
      const filePath = fileInfo.file;
      const localPath = path.join(DIST, filePath);
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
