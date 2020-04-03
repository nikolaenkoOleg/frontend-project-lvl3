export default (state) => {
  const feedList = document.querySelector('.feed-list');
  const postsList = document.querySelector('.posts');
  const input = document.querySelector('#input-url');
  const { feeds, posts } = state;

  input.value = '';
  feedList.innerHTML = '';
  postsList.innerHTML = '';

  feeds.forEach((item) => {
    const { title, description } = item;

    const feedItem = document.createElement('a');
    feedItem.classList.add('list-group-item', 'list-group-item-action');

    const titleBlock = document.createElement('div');
    titleBlock.classList.add('d-flex', 'w-100', 'justify-content-between');

    const feedTitle = document.createElement('h5');
    feedTitle.classList.add('mb-1');
    feedTitle.textContent = title;

    const feedDescription = document.createElement('p');
    feedDescription.classList.add('mb-1');
    feedDescription.textContent = description;

    titleBlock.append(feedTitle);
    feedItem.append(titleBlock);
    feedItem.append(feedDescription);
    feedList.append(feedItem);
  });

  posts.forEach((post) => {
    const { postUrl, postTitle } = post;

    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'post');

    const postLink = document.createElement('a');
    postLink.href = postUrl;
    postLink.textContent = postTitle;
    postItem.append(postLink);
    postsList.append(postItem);
  });
};
