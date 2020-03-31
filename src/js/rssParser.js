export default (rss) => {
  const name = rss.querySelector('title').textContent;
  const description = rss.querySelector('description').textContent;
  const posts = rss.querySelectorAll('item');

  const postsLinks = [...posts].map((post) => post.querySelector('link').textContent);
  const postsTitles = [...posts].map((post) => post.querySelector('title').textContent);

  return {
    name,
    description,
    postsLinks,
    postsTitles,
  };
};
