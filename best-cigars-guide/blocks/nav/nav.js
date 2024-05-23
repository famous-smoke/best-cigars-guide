/* eslint-disable max-len */

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
        anchor.textContent = item.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize words
      }

      span.appendChild(anchor);
    } else {
      span.className = 'breadcrumb-last';
      span.setAttribute('aria-current', 'page');
      span.textContent = item.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize words
    }

    pElement.appendChild(span);

    if (index < pathArray.length - 1) {
      pElement.appendChild(document.createTextNode(' » ')); // Add the separator
    }
  });

  breadcrumbDiv.appendChild(pElement);
  return breadcrumbDiv;
}

// Function to create the categories dropdown
function createCategoriesDropdown() {
  return null;
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
  const startingTag = document.querySelector('body > main > div');
  const navDiv = document.createElement('div');
  navDiv.className = 'nav-row';

  // Create Breadcrumbs
  if (addBreadcrumb) {
    const breadcrumbDiv = createBreadcrumbs();
    navDiv.append(breadcrumbDiv);
  }

  // Create Categoreis Dropdown
  if (addCategoriesDropdown) {
    const categoriesDropdownDiv = createCategoriesDropdown();
    navDiv.append(categoriesDropdownDiv);
  }

  // Append nav to the dom
  startingTag.prepend(navDiv);
}
