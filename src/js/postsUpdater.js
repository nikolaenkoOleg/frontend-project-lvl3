import axios from 'axios';

const feeds = [
  {
    id: 1,
    url: 'lalal',
    title: 'aaaaa',
    description: 'bbbb',
  },
];

const posts = [
  {
    id: '1',
    feedId: '2',
    url: 'lalal',
    title: 'lslsls',
  },
];


export default (url) => {
  const delay = 5000;
  axios.get(url)
    .then((response) => response.data)
    .then((data) => {
      const parser = new DOMParser();
      return parser.parseFromString(data, 'text/xml');
    }) // TODO начать от сюда. это первый и главный запрос
    .then((str) => {
      state.rssData = str;
      state.processingRequest = false;
      state.urlPool.push(url);
      updatePosts(url);
    })
    .catch(() => {
      state.errors.requestError = 'errors.requestError';
      state.processingRequest = false;
    });

  const getResponse = () => {
    axios.get(url)
      .then((response) => response.data)
      .then((data) => {
        const parser = new DOMParser();
        return parser.parseFromString(data, 'text/xml');
      })
      .then((str) => {
        state.rssData = str;
      })
      .catch(() => {
        state.errors.requestError = 'errors.requestError';
        state.processingRequest = false;
      });

    setTimeout(getResponse, delay);
  };

  setTimeout(getResponse, delay);
};


// этот модуль делает первый запрос и получает данные, а дальше обновляет урл каждые 5 сек.
// потом парсер парсит эти данные.
// затем меняются стейты feeds и posts
// вотчеры это отлавливают
// рендер рендирит
// ВСЕ!!!
