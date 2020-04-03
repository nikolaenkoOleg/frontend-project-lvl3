import axios from 'axios';

export default (url) => {
  const delay = 5000;
  const getResponse = () => {
    axios.get(url)
      .then((response) => response.data)
      .then((data) => {
        const parser = new DOMParser();
        return parser.parseFromString(data, 'text/xml');
      })
      .then((str) => {
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
