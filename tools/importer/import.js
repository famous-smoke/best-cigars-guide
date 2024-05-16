/*
* AEM Article Import Script for Best Cigars Guide Articles
* Run aem import to use this file
*/

// Import meta data
// Taken from https://github.com/adobe/helix-importer-ui/blob/main/importer-guidelines.md
const createMetadataBlock = (post, document) => {
  const meta = {};

  // find the <title> element
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  // find the <meta property="og:description"> element
  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  // Modified for best-cigars-guide: get the WP hero image
  const img = document.querySelector('.lrg-image img');
  if (img) {
    // create an <img> element
    const el = document.createElement('img');
    el.src = img.src;
    meta.Image = el;
  }
  // end modified

  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);

  // append the block to the main element
  post.append(block);

  // returning the meta object might be usefull to other rules
  return meta;
};

// Create the individual item blocks for each cigar/accessory on the page
const createItemBlocks = (post, document) => {
  const items = document.querySelectorAll('.cigars-listing .cigar');
  if (!items || items.length === 0) {
    // no blocks to add
    return [];
  }

  for (const item of items) {
    // Find general item attributes
    const cell = [
      ['Item'],
      ['Name', item.querySelector('h3') ? item.querySelector('h3').textContent : ''],
      ['Link', item.querySelector('a').href.replace('http://localhost:3001', 'https://www.famous-smoke.com')],
      ['Description', item.querySelector('.cigar-info p').textContent],
      ['Image', item.querySelector('img')],
      ['Rating', item.querySelectorAll('.star-rating img[src$="star.png"]').length],
    ];

    // Add in cigar specific attributes
    if (item.querySelector('.cigar-stats .stat1 p:last-child')) {
      cell.push(['Country', item.querySelector('.cigar-stats .stat1 p:last-child').textContent]);
    }
    if (item.querySelector('.cigar-stats .stat2 p:last-child')) {
      cell.push(['Strength', item.querySelector('.cigar-stats .stat2 p:last-child').textContent]);
    }
    if (item.querySelector('.cigar-stats .stat3 p:last-child')) {
      cell.push(['Wrapper', item.querySelector('.cigar-stats .stat3 p:last-child').textContent]);
    }
    if (item.querySelector('.cigar-stats .stat4 p:last-child')) {
      cell.push(['Color', item.querySelector('.cigar-stats .stat4 p:last-child').textContent]);
    }

    // Add the block and remove the non-block HTML
    const block = WebImporter.DOMUtils.createTable(cell, document);
    post.append(block);
    if (document.querySelector('.cigars-listing')) {
      document.querySelector('.cigars-listing').remove();
    }
  }
};

export default {
  transformDOM: ({ document }) => {
    const post = document.querySelector('article.post');
    createItemBlocks(post, document);
    createMetadataBlock(post, document);
    return post;
  },
};
