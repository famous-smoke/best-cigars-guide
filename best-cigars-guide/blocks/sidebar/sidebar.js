import { fetchCategoryList, fetchArticleList } from '../../scripts/scripts.js';

// get the current category name
const currentCategoryPath = window.location.pathname.split('/').slice(0, 3).join('/');

async function getRelatedArticles() {
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

  const categoriesList = await fetchCategoryList();

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

  const articleList = await fetchArticleList();
  const currentArticlePath = window.location.pathname;

  articleList.forEach((article) => {
    const articleCategoryPath = article.path.split('/')
      .slice(0, 3)
      .join('/');

    //List all the articles in this category, but not this article itself
    if (articleCategoryPath === currentCategoryPath && article.path !== currentArticlePath) {
      const listElement = document.createElement('li');
      const listLink = document.createElement('a');
      const articleTitle = article.title.split('|')[0].trim();
      listLink.href = article.path;
      listLink.innerHTML = articleTitle;
      listElement.appendChild(listLink);
      list.appendChild(listElement);
    }
  });
  
  wrap.append(list);

  return wrap;
}

export default async function decorate(block) {
  const categories = await getCategories();
  block.append(categories);

  const relatedArticles = await getRelatedArticles();
  block.append(relatedArticles);

  return block;
}
