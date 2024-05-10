import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Add nav
  // @todo sytle the nav
  const mainTag = document.querySelector('.article-list-container');
  const navDiv = document.createElement('div');
  navDiv.className = 'nav-row';
  mainTag.prepend(navDiv);

  // Add breadcrumbs
  // @todo style breadcrumbs
  const h1 = document.querySelector('h1');
  const h1Text = h1.textContent.trim();

  const breadcrumbDiv = document.createElement('div');
  breadcrumbDiv.className = 'breadcrumb';
  breadcrumbDiv.innerHTML += `
  <p id="breadcrumbs">
    <span><a href="https://www.famous-smoke.com/best-cigars-guide/">Home</a></span> » <span class="breadcrumb_last" aria-current="page">${h1Text}</span>
  </p>
  `;
  navDiv.append(breadcrumbDiv);

  // Add dropdown list (copied from existing site)
  // @todo build list dynamically and style it
  const dropdownListDiv = document.createElement('div');
  breadcrumbDiv.className = 'category-dropdown';
  dropdownListDiv.innerHTML += `
    <form action="https://www.famous-smoke.com/best-cigars-guide/" method="get" class="dropcats">
    <select name="cat" id="cat" class="postform" onchange="return this.form.submit()">
    <option value="-1">Select a Category</option>
    <option class="level-0" value="2" selected="selected">Best Cigars by Country</option>
    <option class="level-0" value="3">Best Cigars by Occasion</option>
    <option class="level-0" value="4">Best Cigars by Food/Drink Pairing</option>
    <option class="level-0" value="5">Best Cigars by Shape, Type &amp; Size</option>
    <option class="level-0" value="6">Best Cigars by Year</option>
    <option class="level-0" value="7">Best Cigar Accessories</option>
    </select>
    <noscript><input type="submit" value="View" /></noscript>
    </form> 
  `;
  navDiv.append(dropdownListDiv);

  // Add Article list
  /* change to ul, li */
  const ul = document.createElement('ul');
  // loop over each row of import file
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    // For each row child, a new <li> is created.
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Find the last div and extract the href from its link
    const lastDiv = li.querySelector('div:last-child');
    const link = lastDiv ? lastDiv.querySelector('a') : null;
    const href = link ? link.href : '#'; // Default to '#' if no link is found

    // The second div contains the title for links and buttons
    const secondDiv = li.children[1]; // direct access to the second child assuming it's a div
    const title = secondDiv ? secondDiv.textContent.trim() : ''; // Get the text content as title

    // loop over each li
    [...li.children].forEach((div) => {
      // first div is for the article image
      if (div.querySelector('picture')) {
        div.className = 'article-list-card-image';
        const picture = div.querySelector('picture');
        if (picture) {
          const anchor = document.createElement('a');
          anchor.href = href;
          anchor.title = title;
          picture.parentNode.insertBefore(anchor, picture);
          anchor.appendChild(picture);
        }
      } else if (
        !div.querySelector('picture') &&
        li.querySelector('.article-list-card-body') === null
      ) {
        // second div is for the article body
        div.className = 'article-list-card-body';
      } else {
        // remaining divs are appended to prior article body div
        div.previousSibling.append(div.firstElementChild);
        // Set class names for the first and second paragraphs within the article-list-card-body
        const paragraphs = div.previousSibling.querySelectorAll('p');
        if (paragraphs.length > 0) {
          //change article title to an h3
          const h3 = document.createElement('h3');
          h3.className = 'article-title';
          h3.textContent = paragraphs[0].textContent;
          div.previousSibling.replaceChild(h3, paragraphs[0]);
        }
        if (paragraphs.length > 1) {
          paragraphs[1].className = 'article-description';
        }
      }

      // Create and append a new div with a button
      if (!li.querySelector('a.button')) {
        const newDiv = document.createElement('div');
        newDiv.className = 'article-button-container';
        const newLink = document.createElement('a');
        newLink.href = href;
        newLink.className = 'button';
        newLink.textContent = 'View List';
        newLink.title = title;
        newDiv.appendChild(newLink);
        li.appendChild(newDiv);
      }

      ul.append(li);
    });

    // Remove the last div that contained the original link
    const linkDiv = li.children[2];
    if (linkDiv && linkDiv.parentNode) {
      linkDiv.parentNode.removeChild(linkDiv);
    }
  });

  // optimize images
  ul.querySelectorAll('img').forEach((img) =>
    img
      .closest('picture')
      .replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
      )
  );

  // Remove any empty div tags
  [...ul.querySelectorAll('div')].forEach((div) => {
    if (div.children.length === 0 && div.textContent.trim() === '') {
      div.parentNode.removeChild(div);
    }
  });

  block.textContent = '';
  block.append(ul);
}
