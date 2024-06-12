import { fetchCategoryList } from '../../scripts/scripts.js';

// Function to create the breadcrumb structure
function createBreadcrumbs() {
  const breadcrumbDiv = document.createElement('div');
  breadcrumbDiv.className = 'breadcrumb';

  const pElement = document.createElement('p');
  pElement.id = 'breadcrumbs';

  const pathArray = window.location.pathname.split('/').filter((item) => item);
  const basePath = window.location.origin;

  pathArray.forEach((item, index) => {
    const span = document.createElement('span');

    if (index < pathArray.length - 1) {
      const anchor = document.createElement('a');
      anchor.href = `${basePath}/${pathArray.slice(0, index + 1).join('/')}`;
      if (index === 0) {
        anchor.textContent = 'Home';
      } else {
        anchor.textContent = item.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
      }

      span.appendChild(anchor);
    } else {
      span.className = 'breadcrumb-last';
      span.setAttribute('aria-current', 'page');
      const h1 = document.querySelector('h1');
      const lastBreadcrumb = h1 ? h1.textContent : item.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
      span.textContent = lastBreadcrumb;
    }

    pElement.appendChild(span);

    if (index < pathArray.length - 1) {
      pElement.appendChild(document.createTextNode(' » ')); // Add the separator
    }
  });

  breadcrumbDiv.appendChild(pElement);

  // Return the breadcrumb div
  return breadcrumbDiv;
}

// Function to create the categories dropdown
async function createCategoriesDropdown() {
  // Create the category dropdown container div
  const categoryDropdownDiv = document.createElement('div');
  categoryDropdownDiv.className = 'category-dropdown';

  // Create the form element
  const form = document.createElement('form');
  form.method = 'get';
  form.className = 'dropcats';

  // Set the form action to use the current domain
  form.action = `${window.location.origin}/best-cigars-guide/`;

  // Create the select element
  const select = document.createElement('select');
  select.name = 'cat';
  select.id = 'cat';
  select.className = 'postform';
  function categoryDropdownOnChange() {
    window.location.href = select.options[select.selectedIndex].value;
  }
  select.onchange = categoryDropdownOnChange;

  // Get the category path, the first two parts of the current path
  const currentCategoryPath = window.location.pathname.split('/').slice(0, 3).join('/');

  // populate categories list
  const categoriesList = await fetchCategoryList();

  // Create and append options to the select element
  categoriesList.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.path;
    option.textContent = category.title.split('|')[0].trim();
    const categoryPath = category.path.split('/').slice(0, 3).join('/');
    if (categoryPath === currentCategoryPath) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  // Append the select element to the form
  form.appendChild(select);

  // Create and append the noscript element with a submit button
  const noscript = document.createElement('noscript');
  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = 'View';
  noscript.appendChild(submitButton);
  form.appendChild(noscript);

  // Append the form to the category dropdown container div
  categoryDropdownDiv.appendChild(form);

  // Return the category dropdown div
  return categoryDropdownDiv;
}

export default function decorate(block) {
  // find breadcrumbs block to determine if they should be displayed
  const breadcrumbSetting = block.querySelector('div > div:nth-child(1) > p');
  const addBreadcrumb = !!(breadcrumbSetting && breadcrumbSetting.textContent.trim());

  // find categories block to determine if they should be displayed
  const categoriesSetting = block.querySelector('div > div:nth-child(2) > p');
  const addCategoriesDropdown = !!(categoriesSetting && categoriesSetting.textContent.trim());

  // Remove nav block
  block.remove();

  // Create nav
  const startingTag = document.querySelector('body > header');
  const navDiv = document.createElement('nav');
  navDiv.className = 'nav-row';

  // Create Breadcrumbs
  if (addBreadcrumb) {
    const breadcrumbDiv = createBreadcrumbs();
    navDiv.append(breadcrumbDiv);
  }

  // Create Categories Dropdown
  async function awaitCategoriesDropdown() {
    if (addCategoriesDropdown) {
      const categoriesDropdownDiv = await createCategoriesDropdown();
      navDiv.append(categoriesDropdownDiv);
    }
  }
  awaitCategoriesDropdown();

  // Append nav to the dom
  startingTag.after(navDiv);
}
