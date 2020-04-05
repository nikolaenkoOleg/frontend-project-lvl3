import axios from 'axios';

export default (url) => new Promise((resolve, reject) => {
  axios.get(url)
    .then((response) => response.data)
    .then((data) => {
      const parser = new DOMParser();
      return parser.parseFromString(data, 'text/xml');
    })
    .then((rss) => {
      resolve(rss);
    })
    .catch(() => {
      reject();
    });
});
