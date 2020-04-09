export default (rss) => {
  const parser = new DOMParser();
  const processedRss = parser.parseFromString(rss, 'text/xml');
  const name = processedRss.querySelector('title').textContent;
  const description = processedRss.querySelector('description').textContent;
  const posts = processedRss.querySelectorAll('item');

  const postsLinks = [...posts].map((post) => post.querySelector('link').textContent);
  const postsTitles = [...posts].map((post) => post.querySelector('title').textContent);

  return {
    name,
    description,
    postsLinks,
    postsTitles,
  };
};
