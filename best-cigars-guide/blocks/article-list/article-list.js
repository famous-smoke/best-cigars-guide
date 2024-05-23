import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
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
      } else if (!div.querySelector('picture') && li.querySelector('.article-list-card-body') === null) {
        // second div is for the article body
        div.className = 'article-list-card-body';
      } else {
        // remaining divs are appended to prior article body div
        div.previousSibling.append(div.firstElementChild);
        // Set class names for the first and second paragraphs within the article-list-card-body
        const paragraphs = div.previousSibling.querySelectorAll('p');
        if (paragraphs.length > 0) {
          // change article title to an h3
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
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // Remove any empty div tags
  [...ul.querySelectorAll('div')].forEach((div) => {
    if (div.children.length === 0 && div.textContent.trim() === '') {
      div.parentNode.removeChild(div);
    }
  });

  block.textContent = '';
  block.append(ul);
}
