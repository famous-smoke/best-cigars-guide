import { fetchCategoryList } from '../../scripts/scripts.js';

function getRelatedArticles() {
  const wrap = document.createElement('div');
  wrap.className = 'sidebar-related-articles';

  const heading = document.createElement('h3');
  heading.textContent = 'Related Articles';
  wrap.append(heading);

  const list = document.createElement('ul');

  // todo: related article magic  🪄
  list.innerHTML = '<li><a href="/best-cigars-guide">Dummy list item</a></li><li><a href="/best-cigars-guide">Dummy list item 2</a></li>';

  wrap.append(list);

  return wrap;
}

async function getCategories() {
  const wrap = document.createElement('div');
  wrap.className = 'sidebar-categories';

  const heading = document.createElement('h3');
  heading.textContent = 'CATEGORY';
  wrap.append(heading);

  const currentCategoryPath = window.location.pathname.split('/').slice(0, 3).join('/');
  const categoriesList = await fetchCategoryList();
  // get the current category name
  categoriesList.forEach((category) => {
    const categoryPath = category.path.split('/')
      .slice(0, 3)
      .join('/');

    if (categoryPath === currentCategoryPath) {
      heading.innerText = category.path
        .split('/')
        .pop()
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  });

  const list = document.createElement('ul');

  // todo: fetch sub-categories from index
  list.innerHTML = '<li><a href="/best-cigars-guide">Dummy list item</a></li><li><a href="/best-cigars-guide">Dummy list item 2</a></li>';

  wrap.append(list);

  return wrap;
}

export default async function decorate(block) {
  const categories = await getCategories();
  block.append(categories);

  const relatedArticles = getRelatedArticles();
  block.append(relatedArticles);

  return block;
}
