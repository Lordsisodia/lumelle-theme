const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration - you'll need to fill these in
const SHOP = 'lumelletest.myshopify.com';
const THEME_ID = '195886022998';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// If no token, try to get it from CLI config
async function getAccessToken() {
  if (ACCESS_TOKEN) return ACCESS_TOKEN;
  
  // Try to read from shopify CLI config
  const { execSync } = require('child_process');
  try {
    const result = execSync('shopify auth info', { encoding: 'utf8' });
    console.log('Auth info:', result);
  } catch (e) {
    console.log('Could not get auth info');
  }
  return null;
}

function uploadAsset(filePath, key) {
  return new Promise((resolve, reject) => {
    const base64 = fs.readFileSync(filePath).toString('base64');
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg', 
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }[ext] || 'application/octet-stream';

    const postData = JSON.stringify({
      asset: {
        key: key,
        attachment: base64
      }
    });

    const options = {
      hostname: SHOP,
      path: `/admin/api/2024-01/themes/${THEME_ID}/assets.json`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Shopify-Access-Token': ACCESS_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  const token = await getAccessToken();
  if (!token) {
    console.log('\n❌ No access token found.');
    console.log('Please provide a Shopify Admin API access token:');
    console.log('  1. Go to Shopify Admin > Settings > Apps and sales channels');
    console.log('  2. Click "Develop apps" > "Create an app"');
    console.log('  3. Configure Admin API scopes: read/write themes');
    console.log('  4. Install app and get access token');
    console.log('  5. Run: SHOPIFY_ACCESS_TOKEN=your_token node upload-images.js');
    process.exit(1);
  }

  const assetsDir = path.join(__dirname, 'assets/images');
  const files = fs.readdirSync(assetsDir).filter(f => 
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f)
  );

  console.log(`Found ${files.length} image files to upload`);

  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const key = `assets/images/${file}`;
    console.log(`Uploading ${file}...`);
    try {
      await uploadAsset(filePath, key);
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.log(`  ✗ ${file}: ${err.message}`);
    }
  }
  
  console.log('\nDone! Images should now be available at:');
  console.log(`  https://cdn.shopify.com/s/files/1/09145672346/assets/images/`);
}

main().catch(console.error);
