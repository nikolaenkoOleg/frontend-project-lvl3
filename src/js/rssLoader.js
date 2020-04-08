import axios from 'axios';

export default (url) => axios.get(url)
  .then((response) => response.data)
  .then((data) => {
    const parser = new DOMParser();
    return parser.parseFromString(data, 'text/xml');
  })
  .then((rss) => rss)
  .catch((error) => error);
