import parseRss from '../rssParser';

export default (rss) => {
  const feedList = document.querySelector('.feed-list');
  const postsList = document.querySelector('.posts');
  const {
    name,
    description,
    postsLinks,
    postsTitles,
  } = parseRss(rss);

  console.log(parseRss(rss));

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

  for (let i = 0; i < postsLinks.length; i += 1) {
    const url = postsLinks[i];
    const title = postsTitles[i];

    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'post');

    const postLink = document.createElement('a');
    postLink.href = url;
    postLink.textContent = title;
    postItem.append(postLink);
    postsList.append(postItem);
  }
};
