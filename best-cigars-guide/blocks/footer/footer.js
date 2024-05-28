import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { isInternal } from '../../scripts/scripts.js';
import { addLdJsonScript } from '../../scripts/linking-data.js';

function buildLdJson(container) {
  // Base page LD+JSON
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': window.location.href,
    url: window.location.href,
    description: getMetadata('description'),
    author: {
      '@type': 'Organization',
      '@id': 'https://www.famous-smoke.com',
    },
    inLanguage: 'en-US',
  };

  // Change type for category pages
  if (document.querySelector('.article-list-container')) {
    ldJson['@type'] = 'CollectionPage';
  }

  // Add image from metadata
  const primaryImage = getMetadata('og:image');
  if (primaryImage) {
    ldJson.primaryImageOfPage = {
      '@type': 'ImageObject',
      contentUrl: getMetadata('og:image'),
    };
  }

  addLdJsonScript(container, ldJson);
}

function getFamousLogo() {
  // Create the image element
  const image = document.createElement('img');
  image.src = '/best-cigars-guide/icons/famous-smoke-shop-logo-gray.png';
  image.className = 'footer-logo';

  // Add the Famous link, with the logo inside of it
  const link = document.createElement('a');
  link.href = 'https://www.famous-smoke.com';
  link.className = 'footer-logo-link';
  link.appendChild(image);

  // Wrap it up
  const wrap = document.createElement('div');
  wrap.className = 'footer-logo-wrap';
  wrap.appendChild(link);

  return wrap;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/best-cigars-guide/footer';
  const fragment = await loadFragment(footerPath);

  // add json-ld data for the page
  buildLdJson(document.body);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Add the Famous logo
  footer.prepend(getFamousLogo());

  // Open external links in new tab
  footer.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (!isInternal(href)) {
      a.setAttribute('target', '_blank');
    }
  });

  // Set copyright year to current year
  const currentYear = new Date().getFullYear();
  footer.innerHTML = footer.innerHTML.replaceAll('{year}', currentYear.toString());

  block.append(footer);
}
