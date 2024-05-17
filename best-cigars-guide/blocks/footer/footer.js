import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { isInternal } from '../../scripts/scripts.js';

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

function addAccessibeLink(footer) {
  // Find the Privacy Policy link
  const privacyPolicyLink = footer.querySelector('a[title="Privacy Policy"]');

  if (privacyPolicyLink) {
    // Create the new link element
    const accessibilityLink = document.createElement('a');
    accessibilityLink.href = '#';
    accessibilityLink.textContent = 'Accessibility';
    accessibilityLink.setAttribute('data-acsb-custom-trigger', 'true');

    // Separator element
    const separator = document.createTextNode(' | ');

    // Insert the new link after the Privacy Policy link
    privacyPolicyLink.parentNode.insertBefore(separator, privacyPolicyLink.nextSibling);
    privacyPolicyLink.parentNode.insertBefore(accessibilityLink, separator.nextSibling);
  }
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

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Add the Famous logo
  footer.prepend(getFamousLogo());

  // Add Accessibe
  addAccessibeLink(footer);

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
