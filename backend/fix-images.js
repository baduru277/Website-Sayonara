require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { Item } = require('./models');

const uploadsDir = path.join(__dirname, 'uploads/products');

async function fixImages() {
  try {
    const files = fs.readdirSync(uploadsDir);
    console.log('📁 Files found:', files);

    const items = await Item.findAll();
    console.log(`📦 Total items: ${items.length}`);

    for (const item of items) {
      const titleKeywords = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
      const matchingFiles = files.filter(f =>
        f.toLowerCase().replace(/[^a-z0-9]/g, '').includes(titleKeywords)
      );

      if (matchingFiles.length > 0) {
        const imageUrls = matchingFiles.map(f => `/uploads/products/${f}`);
        await item.update({ images: imageUrls });
        console.log(`✅ Updated "${item.title}" → ${imageUrls}`);
      } else {
        console.log(`⚠️  No match for "${item.title}"`);
      }
    }

    const allItems = await Item.findAll();
    console.log('\n📊 Final state:');
    allItems.forEach(i => console.log(`  "${i.title}" → ${JSON.stringify(i.images)}`));
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixImages();
