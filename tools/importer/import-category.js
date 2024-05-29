const formatUrl = (originalUrl) => {
  // Strip trailing slash
  originalUrl = originalUrl.replace(/\/$/, '');
  // Create a URL object based on the original URL
  const url = new URL(originalUrl);

  // Set the new domain (including protocol)
  url.hostname = 'main--best-cigars-guide--famous-smoke.hlx.page';
  url.protocol = 'https:';
  url.port = '';

  return url;
};

const createNavBlock = (main, document) => {
  const nav = [['Nav']];
  nav.push([['Breadcrumbs'], ['Categories']]);
  const navBlock = WebImporter.DOMUtils.createTable(nav, document);
  main.append(navBlock);
};

const createMetadataBlock = (main, document) => {
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

  // set the <meta property="og:image"> element
  meta.image = 'https://main--best-cigars-guide--famous-smoke.hlx.page/best-cigars-guide/icons/best-cigars-guide.png';

  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);

  // append the block to the main element
  main.append(block);

  // returning the meta object might be usefull to other rules
  return meta;
};

const createArticleListBlock = (main, document) => {
  const categories = [['Article-list']];
  const categoriesList = document.querySelector('.categories-list');
  const divElements = categoriesList.querySelectorAll('div');

  divElements.forEach((element) => {
    const title = element.querySelector('h3').textContent.trim();
    const description = element.querySelector('p').textContent.trim();
    const image = element.querySelector('img');

    const linkElement = element.querySelector('a.button');
    linkElement.class = 'button';
    const link = linkElement ? linkElement.href : '';

    const card = [[image], [title], [description], [formatUrl(link)]];

    categories.push(card);
  });

  const articleList = WebImporter.DOMUtils.createTable(categories, document);

  main.append(articleList);

  // remove .categories-list from main because we just added it manually
  WebImporter.DOMUtils.remove(main, ['.categories-list']);

  return articleList;
};

const removeSectionsNotForImport = (main, document) => {
  // remove any section from main not needed for import
  WebImporter.DOMUtils.remove(main, ['.category-dropdown', '.breadcrumb']);
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');

    createNavBlock(main, document);
    createArticleListBlock(main, document);
    createMetadataBlock(main, document);
    removeSectionsNotForImport(main, document);

    return main;
  },
  generateDocumentPath: ({ document, url, html, params }) => {
    return document.querySelector("link[rel='canonical']").getAttribute('href');
  },
};
