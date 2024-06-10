/* eslint-disable max-len */

import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';

const searchParams = new URLSearchParams(window.location.search);

/**
 * Finds the next heading level based on the previous heading in the document.
 * @param {Element} el - The current element.
 * @returns {string} - The next heading level (e.g., "H2", "H3").
 */
function findNextHeading(el) {
  let preceedingEl = el.parentElement.previousElement || el.parentElement.parentElement;
  let h = 'H2';
  while (preceedingEl) {
    const lastHeading = [...preceedingEl.querySelectorAll('h1, h2, h3, h4, h5, h6')].pop();
    if (lastHeading) {
      const level = parseInt(lastHeading.nodeName[1], 10);
      h = level < 6 ? `H${level + 1}` : 'H6';
      preceedingEl = false;
    } else {
      preceedingEl = preceedingEl.previousElement || preceedingEl.parentElement;
    }
  }
  return h;
}

/**
 * Fetches data from the given source URL.
 * @param {string} source - The URL to fetch data from.
 * @returns {Promise<Array| null>} - The fetched data or null if an error occurs.
 */
export async function fetchData(source) {
  const response = await fetch(source);
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('error loading API response', response);
    return null;
  }

  const json = await response.json();
  if (!json) {
    // eslint-disable-next-line no-console
    console.error('empty API response', source);
    return null;
  }

  return json.data;
}

/**
 * Renders a result item into a list element.
 * @param {Object} result - The result object containing path, title, image, and description.
 * @returns {HTMLElement} - The rendered list item element.
 */
function renderResult(result) {
  // Extract the title before the pipe
  result.title = result.title.split('|')[0].trim();

  const li = document.createElement('li');

  const imageDiv = document.createElement('div');
  imageDiv.className = 'article-list-card-image';

  const imageLink = document.createElement('a');
  imageLink.href = result.path;
  imageLink.title = result.title;

  const picture = document.createElement('picture');
  const source = document.createElement('source');
  source.type = 'image/webp';
  source.srcset = result.image;

  const img = document.createElement('img');
  img.loading = 'lazy';
  img.alt = result.title;
  img.src = result.image;

  picture.appendChild(source);
  picture.appendChild(img);
  imageLink.appendChild(picture);
  imageDiv.appendChild(imageLink);

  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'article-list-card-body';

  const h3 = document.createElement('h3');
  h3.className = 'article-title';
  h3.textContent = result.title;

  const p = document.createElement('p');
  p.className = 'article-description';
  p.textContent = result.description;

  bodyDiv.appendChild(h3);
  bodyDiv.appendChild(p);

  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'article-button-container';

  const buttonLink = document.createElement('a');
  buttonLink.href = result.path;
  buttonLink.className = 'button';
  buttonLink.title = result.title;
  buttonLink.textContent = 'View List';

  buttonDiv.appendChild(buttonLink);

  li.appendChild(imageDiv);
  li.appendChild(bodyDiv);
  li.appendChild(buttonDiv);

  return li;
}

/**
 * Clears the search results from the specified block.
 * @param {HTMLElement} block - The block element containing search results.
 */
function clearSearchResults(block) {
  const searchResults = block.querySelector('.search-results');
  searchResults.innerHTML = '';
}

/**
 * Clears the search input and results, and updates the URL to remove search parameters.
 * @param {HTMLElement} block - The block element containing search results.
 */
function clearSearch(block) {
  clearSearchResults(block);
  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = '';
    searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  }
}

/**
 * Renders search results into the specified block.
 * @param {HTMLElement} block - The block element to render results into.
 * @param {Object} config - Configuration object.
 * @param {Array} filteredData - The filtered data to render.
 * @param {Array} searchTerms - The search terms used for filtering.
 */
async function renderResults(block, config, filteredData, searchTerms) {
  clearSearchResults(block);
  const searchResults = block.querySelector('.search-results');
  const headingTag = searchResults.dataset.h;

  if (filteredData.length) {
    searchResults.classList.remove('no-results');
    filteredData.forEach((result) => {
      const li = renderResult(result, searchTerms, headingTag);
      searchResults.append(li);
    });
    // optimize images
    searchResults.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  } else {
    const noResultsMessage = document.createElement('div');
    searchResults.classList.add('no-results');
    noResultsMessage.textContent = 'No results found.';
    searchResults.append(noResultsMessage);
  }
}

/**
 * Compares two search hits based on their minimum index values.
 * @param {Object} hit1 - The first search hit.
 * @param {Object} hit2 - The second search hit.
 * @returns {number} - The comparison result.
 */
function compareFound(hit1, hit2) {
  return hit1.minIdx - hit2.minIdx;
}

/**
 * Filters data based on search terms and excludes specified paths.
 * @param {Array} searchTerms - The search terms to filter by.
 * @param {Array} data - The data to filter.
 * @returns {Array} - The filtered data.
 */
function filterData(searchTerms, data) {
  const foundInHeader = [];
  const foundInMeta = [];
  const excludedPaths = ['/best-cigars-guide'];

  data.forEach((result) => {
    if (excludedPaths.includes(result.path)) return; // Exclude specific paths

    let minIdx = -1;

    searchTerms.forEach((term) => {
      const idx = (result.header || result.title).toLowerCase().indexOf(term);
      if (idx < 0) return;
      if (minIdx < idx) minIdx = idx;
    });

    if (minIdx >= 0) {
      foundInHeader.push({ minIdx, result });
      return;
    }

    const metaContents = `${result.title} ${result.description} ${result.text} ${result.path.split('/').pop()}`.toLowerCase();
    searchTerms.forEach((term) => {
      const idx = metaContents.indexOf(term);
      if (idx < 0) return;
      if (minIdx < idx) minIdx = idx;
    });

    if (minIdx >= 0) {
      foundInMeta.push({ minIdx, result });
    }
  });

  return [...foundInHeader.sort(compareFound), ...foundInMeta.sort(compareFound)].map((item) => item.result);
}

/**
 * Handles the search input event, filters data, and renders results.
 * @param {Event} e - The input event.
 * @param {HTMLElement} block - The block element containing search results.
 * @param {Object} config - Configuration object.
 */
async function handleSearch(e, block, config) {
  const searchValue = e.target.value;
  searchParams.set('q', searchValue);
  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = searchParams.toString();
    window.history.replaceState({}, '', url.toString());
  }

  if (searchValue.length < 3) {
    clearSearch(block);
    return;
  }
  const searchTerms = searchValue
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => !!term);

  const data = await fetchData(config.source);
  const filteredData = filterData(searchTerms, data);
  await renderResults(block, config, filteredData, searchTerms);
}

/**
 * Creates a container for search results.
 * @param {HTMLElement} block - The block element to contain search results.
 * @returns {HTMLElement} - The search results container.
 */
function searchResultsContainer(block) {
  const results = document.createElement('div');
  results.className = 'article-list block';
  const ul = document.createElement('ul');
  ul.className = 'search-results';
  ul.dataset.h = findNextHeading(block);
  results.append(ul);

  return results;
}

/**
 * Creates a search input element.
 * @param {HTMLElement} block - The block element to contain the search input.
 * @param {Object} config - Configuration object.
 * @returns {HTMLElement} - The search input element.
 */
function searchInput(block, config) {
  const input = document.createElement('input');
  input.setAttribute('type', 'search');
  input.className = 'search-input';

  const searchPlaceholder = 'Search...';
  input.placeholder = searchPlaceholder;
  input.setAttribute('aria-label', searchPlaceholder);

  input.addEventListener('input', (e) => {
    handleSearch(e, block, config);
  });

  input.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
      clearSearch(block);
    }
  });

  return input;
}

/**
 * Creates a search icon element.
 * @returns {HTMLElement} - The search icon element.
 */
function searchIcon() {
  const icon = document.createElement('span');
  icon.classList.add('icon', 'icon-search');
  return icon;
}

/**
 * Creates a search box element containing the search icon and input.
 * @param {HTMLElement} block - The block element to contain the search box.
 * @param {Object} config - Configuration object.
 * @returns {HTMLElement} - The search box element.
 */
function searchBox(block, config) {
  const box = document.createElement('div');
  box.classList.add('search-box');
  box.append(searchIcon(), searchInput(block, config));

  return box;
}

/**
 * Main function to decorate the block with search functionality.
 * @param {HTMLElement} block - The block element to be decorated.
 */
export default async function decorate(block) {
  const source = block.querySelector('a[href]') ? block.querySelector('a[href]').href : '/query-index.json';
  block.innerHTML = '';
  block.append(searchBox(block, { source }), searchResultsContainer(block));

  if (searchParams.get('q')) {
    const input = block.querySelector('input');
    input.value = searchParams.get('q');
    input.dispatchEvent(new Event('input'));
  }

  decorateIcons(block);
}
