export default (rss) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, 'text/xml');

  const items = doc.querySelectorAll('item');

  const posts = [...items].map((post) => {
    const title = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;

    return { title, link };
  });

  return {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
    posts,
  };
};
