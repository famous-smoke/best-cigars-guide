const createMetadataBlock = (main, document) => {
  const meta = {};

  // find the <title> element
  const title = document.querySelector("title");
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, "");
  }

  // find the <meta property="og:description"> element
  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  // set the <meta property="og:image"> element
  meta.image =
    "/best-cigars-guide/icons/best-cigars-guide.png";

  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);

  // append the block to the main element
  main.append(block);

  // returning the meta object might be usefull to other rules
  return meta;
};

const createArticleListBlock = (main, document) => {
  var categories = [["Article-list"]];
  var categoriesList = document.querySelector(".categories-list");
  var divElements = categoriesList.querySelectorAll("div");

  divElements.forEach(function (element) {
    var title = element.querySelector("h3").textContent.trim();
    var description = element.querySelector("p").textContent.trim();
    var image = element.querySelector("img");
    var imageSrc = image ? image.src : "";
    var linkElement = element.querySelector("a.button");
    var link = linkElement ? linkElement.href : "";

    var card = [
      [image, link],
      [title, description, linkElement],
    ];

    categories.push(card);
  });

  const articleList = WebImporter.DOMUtils.createTable(categories, document);

  main.append(articleList);

  // remove .categories-list from main because we just added it manually
  WebImporter.DOMUtils.remove(main, [".categories-list"]);

  return articleList;
};

const removeSectionsNotForImport = (main, document) => {
  // remove any section from main not needed for import
  WebImporter.DOMUtils.remove(main, [".category-dropdown"]);
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector("main");

    createMetadataBlock(main, document);
    createArticleListBlock(main, document);
    removeSectionsNotForImport(main, document);

    return main;
  },
};
