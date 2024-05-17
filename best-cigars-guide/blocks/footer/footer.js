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

function addTrueVaultCaliforniaPolicyLink(footer) {
  // Find the paragraph containing the links
  const footerParagraph = footer.querySelector('.default-content-wrapper p:last-of-type');

  if (footerParagraph) {
    // Create the new link element
    const newLink = document.createElement('a');
    newLink.className = 'truevault-polaris-privacy-notice';
    newLink.href = 'https://privacy.famous-smoke.com/privacy-policy#california-privacy-notice';
    newLink.rel = 'noreferrer noopener';
    newLink.hidden = true;
    newLink.textContent = 'California Privacy Notice';

    // Find the last link in the paragraph
    const lastLink = footerParagraph.querySelector('a:last-of-type');

    // Optionally, add a separator if needed
    const separator = document.createElement('span');
    separator.className = 'truevault-polaris-privacy-notice';
    separator.rel = 'noreferrer noopener';
    separator.hidden = true;
    separator.textContent = ' | ';

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

function addTrueVaultOptOut(footer) {
  // Find the paragraph containing the links
  const footerParagraph = footer.querySelector('.default-content-wrapper p:last-of-type');

  if (footerParagraph) {
    // Create the new link element for "Your Privacy Choices"
    const yourPrivacyChoicesLink = document.createElement('a');
    yourPrivacyChoicesLink.className = 'truevault-polaris-optout';
    yourPrivacyChoicesLink.href = 'https://privacy.famous-smoke.com/opt-out';
    yourPrivacyChoicesLink.rel = 'noreferrer noopener';
    yourPrivacyChoicesLink.hidden = true;

    // Create the image element
    const img = document.createElement('img');
    img.src = 'https://polaris.truevaultcdn.com/static/assets/icons/optout-icon-black.svg';
    img.alt = 'California Consumer Privacy Act (CCPA) Opt-Out Icon';
    img.style.verticalAlign = 'middle';
    img.height = 14;

    // Append the image and text to the "Your Privacy Choices" link
    yourPrivacyChoicesLink.appendChild(img);
    yourPrivacyChoicesLink.appendChild(document.createTextNode(' Your Privacy Choices'));

    // Optionally, add a separator if needed
    const separator = document.createElement('span');
    separator.className = 'truevault-polaris-optout';
    separator.rel = 'noreferrer noopener';
    separator.hidden = true;
    separator.textContent = ' | ';

    // Find the last link in the paragraph
    const lastLink = footerParagraph.querySelector('a:last-of-type');

    // Insert the new link after the last existing link
    if (lastLink) {
      lastLink.parentNode.insertBefore(separator, lastLink.nextSibling);
      lastLink.parentNode.insertBefore(yourPrivacyChoicesLink, separator.nextSibling);
    } else {
      // If no links found, just append to the paragraph
      footerParagraph.appendChild(yourPrivacyChoicesLink);
    }
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
