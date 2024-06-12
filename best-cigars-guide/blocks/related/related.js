export default async function decorate(block) {
  const links = block.querySelectorAll(':scope > div');
  if (!links || links.length === 0) {
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'sidebar-related-articles';

  const heading = document.createElement('h3');
  heading.textContent = 'Related Articles';
  wrap.append(heading);

  const list = document.createElement('ul');
  // eslint-disable-next-line no-restricted-syntax
  for (const link of links) {
    const el = document.createElement('li');

    const linkEl = document.createElement('a');
    linkEl.textContent = link.firstElementChild.textContent;
    linkEl.href = link.lastElementChild.textContent;
    linkEl.target = '_blank';
    el.appendChild(linkEl);

    list.appendChild(el);
  }

  wrap.append(list);

  const sidebar = document.querySelector('.sidebar-wrapper > div.sidebar');
  sidebar.append(wrap);
  block.remove();
}
