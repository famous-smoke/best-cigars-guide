/**
 * parse block row data into a js object
 * @param block
 * @returns {{}}
 */
function parseData(block) {
  const rows = block.children;
  const data = {};

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rows.length; i++) {
    const fieldName = rows[i].firstElementChild.textContent;

    if (fieldName === 'Image') {
      data[fieldName] = rows[i].lastElementChild.innerHTML;
    } else if (fieldName === 'Rating') {
      data[fieldName] = Number(rows[i].lastElementChild.textContent);
    } else {
      data[fieldName] = rows[i].lastElementChild.textContent;
    }
  }

  return data;
}

/**
 * render rating stats html
 * @param data
 */
function renderRatingStars(data) {
  let output = '';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 5; i++) {
    if (i + 0.5 === data.Rating) {
      output += '<img src="/best-cigars-guide/icons/star-half.png" alt="">';
    } else if (i < data.Rating) {
      output += '<img src="/best-cigars-guide/icons/star.png" alt="">';
    } else {
      output += '<img src="/best-cigars-guide/icons/star-empty.png" alt="">';
    }
  }

  return output;
}

/**
 * render individual item stats
 * @param data
 * @returns {string}
 */
function renderStats(data) {
  // list of possible stat fields from block data
  const stats = ['Country', 'Strength', 'Wrapper', 'Color'];

  let output = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < stats.length; i++) {
    if (stats[i] in data) {
      output += `
        <div class="item-stat">
            <p class="label">${stats[i]}</p>
            <p>${data[stats[i]]}</p>
        </div>
      `;
    }
  }

  return output;
}

function render(data) {
  const ratingLabel = data.Rating ? `Rated ${data.Rating} out of 5 stars.` : 'No ratings yet.';

  return `
    <h3>${data.Name}</h3>
    <a href="${data.Link}" target="_blank">
        ${data.Image}
    </a>
    <div class="item-info">
        <p>${data.Description}</p>
        <div class="item-stats">
            ${renderStats(data)}
        </div>
        <div class="item-subinfo">
            <div class="item-star-rating" data-rating="${data.Rating}" title="${ratingLabel}">
                ${renderRatingStars(data)}
            </div>
            <div class="item-buy-now">
                <a href="${data.Link}" target="_blank">Buy Now</a>
            </div>
        </div>
    </div>
  `;
}

/**
 * loads and decorates the item
 * @param {Element} block The item element
 */
export default async function decorate(block) {
  const data = parseData(block);
  block.innerHTML = render(data);
  return block;
}
