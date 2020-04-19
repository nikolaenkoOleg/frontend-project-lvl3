export default (state) => {
  const feedList = document.querySelector('.feed-list');
  const postsList = document.querySelector('.posts');
  const input = document.querySelector('#input-url');
  const { feeds, posts } = state;
  input.value = '';
  feedList.innerHTML = '';
  postsList.innerHTML = '';

  feeds.forEach((item) => {
    const { feedTitle, feedDescription } = item;

    const feedItem = document.createElement('a');
    feedItem.classList.add('list-group-item', 'list-group-item-action');

    const titleBlock = document.createElement('div');
    titleBlock.classList.add('d-flex', 'w-100', 'justify-content-between');

    const title = document.createElement('h5');
    title.classList.add('mb-1');
    title.textContent = feedTitle;

    const description = document.createElement('p');
    description.classList.add('mb-1');
    description.textContent = feedDescription;

    titleBlock.append(title);
    feedItem.append(titleBlock);
    feedItem.append(description);

    feedList.append(feedItem);
  });

  posts.forEach((post) => {
    console.log(post);
    const { link, title } = post;

    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'post');

    const postLink = document.createElement('a');
    postLink.href = link;
    postLink.textContent = title;
    postItem.append(postLink);
    postsList.append(postItem);
  });
};
