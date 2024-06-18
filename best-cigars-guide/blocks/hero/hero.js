/* eslint-disable max-len */

// Add second paragraph text and chevron to the hero image when available
function addSecondParagraphToHero() {
  // Select the div with class 'hero-container'
  const heroContainer = document.querySelector('.hero-container');
  const currentDomain = window.location.origin;

  // Find the first non-empty paragraph after the hero-container
  let firstNonEmptyParagraph = null;
  let nextElement = heroContainer.nextElementSibling;
  while (nextElement) {
    if (nextElement.tagName === 'P' && nextElement.textContent.trim() !== '') {
      firstNonEmptyParagraph = nextElement;
      break;
    }
    nextElement = nextElement.firstElementChild ? nextElement.firstElementChild : nextElement.nextElementSibling;
  }

  // Find the first h1 on the page
  const firstH1 = document.querySelector('h1');

  // Append the found paragraph to the first h1
  if (firstH1 && firstNonEmptyParagraph) {
    firstH1.insertAdjacentElement('afterend', firstNonEmptyParagraph);

    // Create the div element to contain the chevron image
    const imgContainer = document.createElement('div');
    imgContainer.style.display = 'inline-block';
    imgContainer.style.cursor = 'pointer'; // Make cursor a hand

    // Create the chevron image element
    const img = document.createElement('img');
    img.src = `${currentDomain}/best-cigars-guide/icons/arrow-down.png`;
    img.alt = 'arrow';
    img.className = 'arrow-down';

    // Append the chevron image to the div
    imgContainer.appendChild(img);

    // Add click event to scroll to the first element with the class 'article-list-container' when available
    const targetElement = document.querySelector('.article-list-container');
    if (targetElement) {
      imgContainer.addEventListener('click', () => {
        if (targetElement) {
          // Get the position of the target element
          const rect = targetElement.getBoundingClientRect();
          // Get the header height from the CSS variable
          const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
          const headerOffset = headerHeight ? parseInt(headerHeight, 10) : 90; // Convert to integer or default to 90
          const elementPosition = rect.top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      });
    }

    firstNonEmptyParagraph.insertAdjacentElement('afterend', imgContainer);
  }
}

// Format picture path
function formatPicturePath() {
  const picture = document.querySelector('.hero picture');
  if (picture) {
    picture.querySelectorAll('img, source').forEach((element) => {
      const url = new URL(element.src || element.srcset, window.location.origin);

      // Check if the pathname begins with "/best-cigars-guide"
      if (!url.pathname.startsWith('/best-cigars-guide')) {
        // Prepend "/best-cigars-guide" to the pathname
        url.pathname = `/best-cigars-guide${url.pathname}`;
      }

      if (element.tagName === 'IMG') {
        element.src = url.href;
      } else if (element.tagName === 'SOURCE') {
        element.srcset = url.href;
      }
    });
  }
}

export default function decorate() {
  addSecondParagraphToHero();
  formatPicturePath();
}
