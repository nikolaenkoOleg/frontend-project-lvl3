export default (rss) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, 'text/xml');
  const name = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const posts = doc.querySelectorAll('item');

  const postsLinks = [...posts].map((post) => post.querySelector('link').textContent);
  const postsTitles = [...posts].map((post) => post.querySelector('title').textContent);

  return {
    name,
    description,
    postsLinks,
    postsTitles,
  };
};
