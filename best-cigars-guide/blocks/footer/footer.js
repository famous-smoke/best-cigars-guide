import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { isInternal, isCategory, isArticlePage, fetchArticleInfo } from '../../scripts/scripts.js';
import { addLdJsonScript } from '../../scripts/linking-data.js';

function dateToISOString(input) {
  let date;

  try {
    // Check if the input is a number (Unix timestamp)
    if (typeof input === 'number') {
      date = new Date(input * 1000);
    } else if (typeof input === 'string') {
      // Check if the string is a Unix timestamp
      if (/^\d+$/.test(input)) {
        date = new Date(parseInt(input, 10) * 1000);
      } else {
        // Otherwise, assume it's a date string
        date = new Date(input);
      }
    } else {
      return null; // Return null if the input is neither a number nor a string
    }

    // Check if the date is valid
    if (date.isNaN) {
      return null;
    }
    // Convert the Date object to ISO string format
    return date.toISOString();
  } catch (error) {
    // Return null if there is an error
    return null;
  }
}

function createBreadcrumbsSchema() {
  const breadcrumbDiv = document.querySelector('.breadcrumb #breadcrumbs');

  if (!breadcrumbDiv) {
    return null;
  }

  const spans = breadcrumbDiv.querySelectorAll('span');
  const itemListElement = [];

  spans.forEach((span, index) => {
    const anchor = span.querySelector('a');
    const position = index + 1;
    const item = {
      '@type': 'ListItem',
      position,
      item: {},
    };

    if (anchor) {
      item.item['@id'] = anchor.href;
      item.item.name = anchor.textContent;
    } else {
      item.item['@id'] = window.location.href;
      item.item.name = span.textContent;
    }

    itemListElement.push(item);
  });

  const breadcrumbsSchema = {
    '@type': 'BreadcrumbList',
    itemListElement,
  };

  return breadcrumbsSchema;
}

async function buildLdJson(container) {
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
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.famous-smoke.com/best-cigars-guide/search?q={query}',
      query: 'required',
    },
  };

  // Change type for category pages
  if (isCategory()) {
    ldJson['@type'] = 'CollectionPage';
  }

  // Add Article Page Data
  if (isArticlePage()) {
    // Add datePublished from metadata
    const datePublished = dateToISOString(getMetadata('publisheddate'));
    if (datePublished) {
      ldJson.datePublished = datePublished;
    }

    // Add dateModified
    const articleInfo = await fetchArticleInfo();
    if (articleInfo) {
      const lastModified = dateToISOString(articleInfo.lastModified);
      ldJson.dateModified = lastModified;
    }
  }

  // Add breadcrumb when available
  const breadcrumbsSchema = createBreadcrumbsSchema();
  if (breadcrumbsSchema) {
    ldJson.breadcrumb = breadcrumbsSchema;
  }

  // Add image from metadata
  const primaryImage = getMetadata('og:image');
  if (primaryImage) {
    ldJson.primaryImageOfPage = {
      '@type': 'ImageObject',
      contentUrl: getMetadata('og:image'),
    };
  }

  console.log(ldJson);

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

function addLinkToFooter(newLink, separator, footer) {
  // Find the paragraph containing the links
  const footerParagraph = footer.querySelector('.default-content-wrapper p:last-of-type');

  if (footerParagraph) {
    // Find the last link in the paragraph
    const lastLink = footerParagraph.querySelector('a:last-of-type');

    // Insert the new link after the last existing link
    if (lastLink) {
      lastLink.parentNode.insertBefore(separator, lastLink.nextSibling);
      lastLink.parentNode.insertBefore(newLink, separator.nextSibling);
    } else {
      // If no links found, just append to the paragraph
      footerParagraph.appendChild(newLink);
    }
  }
}

function addAccessibeLink(footer) {
  // Create the new link element
  const accessibilityLink = document.createElement('a');
  accessibilityLink.href = '#';
  accessibilityLink.textContent = 'Accessibility';
  accessibilityLink.setAttribute('data-acsb-custom-trigger', 'true');

  // Separator element
  const separator = document.createTextNode(' | ');

  // Add link to footer
  addLinkToFooter(accessibilityLink, separator, footer);
}

function addTrueVaultCaliforniaPolicyLink(footer) {
  // Create the new link element
  const caPolicyLink = document.createElement('a');
  caPolicyLink.className = 'truevault-polaris-privacy-notice';
  caPolicyLink.href = 'https://privacy.famous-smoke.com/privacy-policy#california-privacy-notice';
  caPolicyLink.rel = 'noreferrer noopener';
  caPolicyLink.hidden = true;
  caPolicyLink.textContent = 'California Privacy Notice';

  // Separator element
  const separator = document.createElement('span');
  separator.className = 'truevault-polaris-privacy-notice';
  separator.rel = 'noreferrer noopener';
  separator.hidden = true;
  separator.textContent = ' | ';

  // Add link to footer
  addLinkToFooter(caPolicyLink, separator, footer);
}

function addTrueVaultOptOut(footer) {
  // Create the new link element for "Your Privacy Choices"
  const privacyChoicesLink = document.createElement('a');
  privacyChoicesLink.className = 'truevault-polaris-optout';
  privacyChoicesLink.href = 'https://privacy.famous-smoke.com/opt-out';
  privacyChoicesLink.rel = 'noreferrer noopener';
  privacyChoicesLink.hidden = true;

  // Create the image element
  const img = document.createElement('img');
  img.src = 'https://polaris.truevaultcdn.com/static/assets/icons/optout-icon-black.svg';
  img.alt = 'California Consumer Privacy Act (CCPA) Opt-Out Icon';
  img.style.verticalAlign = 'middle';
  img.height = 14;

  // Append the image and text to the "Your Privacy Choices" link
  privacyChoicesLink.appendChild(img);
  privacyChoicesLink.appendChild(document.createTextNode(' Your Privacy Choices'));

  // Separator element
  const separator = document.createElement('span');
  separator.className = 'truevault-polaris-optout';
  separator.rel = 'noreferrer noopener';
  separator.hidden = true;
  separator.textContent = ' | ';

  // Add link to footer
  addLinkToFooter(privacyChoicesLink, separator, footer);
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

  // Add Accessibe
  addAccessibeLink(footer);

  // Add TrueVault California Policy
  addTrueVaultCaliforniaPolicyLink(footer);

  // Add TrueVault Opt Out
  addTrueVaultOptOut(footer);

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
