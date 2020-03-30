import parseRss from '../rssParser';

export default (rss) => {
  const feedList = document.querySelector('.feed-list');
  const { name, description } = parseRss(rss);

  const feedItem = document.createElement('a');
  const isActiveItem = feedList.children.length === 0 ? 'active' : 'inactive';
  feedItem.classList.add('list-group-item', 'list-group-item-action', isActiveItem);

  const titleBlock = document.createElement('div');
  titleBlock.classList.add('d-flex', 'w-100', 'justify-content-between');

  const feedTitle = document.createElement('h5');
  feedTitle.classList.add('mb-1');
  feedTitle.textContent = name;

  const feedDescription = document.createElement('p');
  feedDescription.classList.add('mb-1');
  feedDescription.textContent = description;

  titleBlock.append(feedTitle);
  feedItem.append(titleBlock);
  feedItem.append(feedDescription);
  feedList.append(feedItem);
};
