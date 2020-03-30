export default (rss) => {
  const name = rss.querySelector('title').textContent;
  const description = rss.querySelector('description').textContent;
  const posts = rss.querySelectorAll('item');

  const postsLinlks = [];
  posts.forEach((post) => {
    postsLinlks.push(post.querySelector('link').textContent);
  });
  const postsTitles = [];
  posts.forEach((post) => {
    postsTitles.push(post.querySelector('title').textContent);
  });

  console.log({
    name,
    description,
    feedPostsUrls: postsLinlks,
    feedTitles: postsTitles,
  });

  return {
    name,
    description,
    feedPostsUrls: postsLinlks,
    feedTitles: postsTitles,
  };
};
