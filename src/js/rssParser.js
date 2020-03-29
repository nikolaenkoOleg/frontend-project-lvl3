export default (rss) => {
  const rssTitle = rss.querySelector('title').textContent;
  const rssDescription = rss.querySelector('description').textContent;

  return { rssTitle, rssDescription };
};
