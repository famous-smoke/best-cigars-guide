/* eslint-disable max-len */
// eslint-disable-next-line object-curly-newline
import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSections,
  loadSection,
  loadCSS,
  decorateBlock,
  loadBlock,
} from './aem.js';

const CATEGORY_INDEX_PATH = '/best-cigars-guide/index/category-index.json';
const ARTICLE_INDEX_PATH = '/best-cigars-guide/index/query-index.json';
const SUBFOLDER_PATH = '/best-cigars-guide';

let categoryIndexData;
let articleIndexData;

/**
 * Fetches category list.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of category path objects.
 */
export async function fetchCategoryList() {
  if (!categoryIndexData) {
    try {
      const resp = await fetch(CATEGORY_INDEX_PATH);
      if (resp.ok) {
        const jsonData = await resp.json();
        categoryIndexData = jsonData.data.map((item) => ({ path: item.path, title: item.title }));
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch category list:', resp.status);
        return [];
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching category list:', error);
      return [];
    }
  }
  return categoryIndexData;
}

/**
 * Fetches article list.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of article path objects.
 */
export async function fetchArticleList() {
  if (!articleIndexData) {
    try {
      const resp = await fetch(ARTICLE_INDEX_PATH);
      if (resp.ok) {
        const jsonData = await resp.json();
        articleIndexData = jsonData.data.map((item) => ({ path: item.path, title: item.title, lastModified: item.lastModified, publishedDate: item.published, image: item.image }));
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch category article list:', resp.status);
        return [];
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error category article list:', error);
      return [];
    }
  }
  return articleIndexData;
}

/**
 * Fetches article information.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of article path objects.
 */
export async function fetchArticleInfo() {
  // Fetch article list
  if (!articleIndexData) {
    articleIndexData = await fetchArticleList();
  }

  // Get the current URL path
  const currentPath = window.location.pathname;

  // Find the article that matches the current URL path
  const matchingArticle = articleIndexData.find((article) => article.path === currentPath);

  return matchingArticle || null;
}

export async function fetchArticlesInCategory() {
  // Fetch article list
  if (!articleIndexData) {
    articleIndexData = await fetchArticleList();
  }

  // Get the current category path
  const currentCategoryPath = window.location.pathname.split('/').slice(0, 3).join('/');

  // Find the articles that contain the current category path in their path
  const matchingArticles = articleIndexData.filter((article) => article.path.includes(currentCategoryPath));

  return matchingArticles.length > 0 ? matchingArticles : null;
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * require subfolder for image path
 * works with <image> <picture> <meta> string
 */
export function requireSubfolderImagePath(element) {
  const url = new URL(element.src || element.srcset || element.content || element, window.location.origin);

  // Check if the pathname begins with "/best-cigars-guide"
  if (!url.pathname.startsWith(SUBFOLDER_PATH)) {
    // Prepend "/best-cigars-guide" to the pathname
    url.pathname = `${SUBFOLDER_PATH}${url.pathname}`;
  }

  if (element.tagName === 'IMG') {
    element.src = url.href;
  } else if (element.tagName === 'SOURCE') {
    element.srcset = url.href;
  } else if (element.tagName === 'META') {
    element.content = url.href;
  }

  return url.href;
}

/**
 * check if this is an article page
 */
export function isArticlePage() {
  // Select the div with class 'breadcrumb'
  const breadcrumbDiv = document.querySelector('.breadcrumb');

  // Check if the breadcrumb div exists
  if (breadcrumbDiv) {
    // Select all span tags within the breadcrumb div
    const spans = breadcrumbDiv.querySelectorAll('span');

    // Check if there are exactly 3 span tags
    if (spans.length === 3) {
      return true;
    }
  }
  return false;
}

/**
 * check if this is a category listing page
 */
export function isCategory() {
  return !!document.querySelector('.article-list-container, main.error');
}

/**
 * check if this is the search page
 */
export function isSearchPage() {
  return !!document.querySelector('#search');
}

/**
 * builds sidebar block appends to main
 * @param {Element} main The container element
 */
function buildSidebarBlock(main) {
  const sidebarBlock = document.querySelector('main aside');

  if (!isCategory() && !isSearchPage() && !sidebarBlock && main.tagName === 'MAIN') {
    const container = document.querySelector('main');
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar-wrapper';

    const block = buildBlock('sidebar', '');
    sidebar.append(block);
    decorateBlock(block);
    loadBlock(block);

    container.classList.add('article-wrapper');
    container.append(sidebar);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  buildSidebarBlock(main);
}

/**
 * Checks if the given path is an external URL.
 * @param {string} path - The path to be checked.
 * @returns {boolean} - Returns true if the path is an external URL, false otherwise.
 */
export function isInternal(path) {
  try {
    const url = new URL(path);
    return window.location.hostname === url.hostname && url.pathname.startsWith('/best-cigars-guide');
  } catch (error) {
    return true;
  }
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
