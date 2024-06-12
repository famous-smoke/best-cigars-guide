/*
 * AEM Article Import Script for Best Cigars Guide Articles
 * Run aem import to use this file
 */

// Add Nav Block
const createNavBlock = (post, document) => {
  const nav = [['Nav']];
  nav.push([['Breadcrumbs'], ['Categories']]);
  const navBlock = WebImporter.DOMUtils.createTable(nav, document);
  post.append(navBlock);
};

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

  // Get the published date
  const published = new Date(document.querySelector('[property="article:published_time"]').content);
  meta.publishedDate = `${published.getDate()} ${published.toLocaleDateString('default', { month: 'long' })} ${published.getFullYear()}`;
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
    return;
  }

  for (const item of items) {
    // Calculate rating
    let rating = item.querySelectorAll('.star-rating img[src$="star.png"]').length;
    if (item.querySelector('.star-rating img[src$="star-half.png"]')) {
      rating = rating + 0.5;
    }

    // Find general item attributes
    const cell = [['Item'], ['Name', item.querySelector('h3') ? item.querySelector('h3').textContent : ''], ['Link', item.querySelector('a').href.replace('http://localhost:3001', 'https://www.famous-smoke.com')], ['Description', item.querySelector('.cigar-info p').textContent], ['Image', item.querySelector('img')], ['Rating', rating]];

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

// Add the related post links
const createRelatedLinkBlock = (post, document) => {
  const relatedLinks = document.querySelectorAll('.related li');

  if (!relatedLinks || relatedLinks.length === 0) {
    // no related links to add
    return;
  }

  const cell = [];
  cell.push(['Related']);
  for (const link of relatedLinks) {
    cell.push([link.textContent, link.querySelector('a').href.replace('http://localhost:3001', 'https://www.famous-smoke.com')]);
  }

  const block = WebImporter.DOMUtils.createTable(cell, document);
  post.append(block);
}

export default {
  transformDOM: ({ document }) => {
    const post = document.querySelector('article.post');
    createNavBlock(post, document);
    createItemBlocks(post, document);
    createRelatedLinkBlock(post, document);
    createMetadataBlock(post, document);
    return post;
  },

  generateDocumentPath: ({ document, url, html, params }) => {
    return document.querySelector("link[rel='canonical']").getAttribute('href');
  },
};
