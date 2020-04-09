import axios from 'axios';

export default (url) => axios.get(url)
  .then((response) => response.data)
  .then((rss) => rss)
  .catch((error) => error);
