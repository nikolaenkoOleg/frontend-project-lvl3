import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import i18next from 'i18next';

import isValid from './urlValidator';
import en from './locales/en';
import {
  watchUrl,
  watchSubmit,
  watchData,
  watchErrors,
} from './watchers';

const form = document.querySelector('form');
const input = document.querySelector('#input-url');

const state = {
  isValidUrl: true,
  urlPool: [],
  submitDisabled: false,
  errors: {
    validationError: null,
    requestError: null,
  },
  rssData: null,
  processingRequest: false,
};

i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en,
  },
});

input.addEventListener('input', () => {
  state.isValidUrl = false;
  const url = input.value;

  isValid(url, state.urlPool)
    .then(({ valid, key }) => {
      if (valid) {
        state.isValidUrl = true;
        state.errors.validationError = key;
        state.submitDisabled = false;
      } else {
        state.isValidUrl = false;
        state.errors.validationError = key;
        state.submitDisabled = true;
      }
    });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = input.value;
  state.processingRequest = true;

  axios.get(url)
    .then((response) => response.data)
    .then((data) => {
      const parser = new DOMParser();
      return parser.parseFromString(data, 'text/xml');
    })
    .then((str) => {
      state.rssData = str;
      state.processingRequest = false;
      state.urlPool.push(url);
    })
    .catch(() => {
      state.errors.requestError = 'errors.requestError';
      state.processingRequest = false;
    });
});


watchUrl(state);
watchData(state);
watchSubmit(state);
watchErrors(state);

// https://cors-anywhere.herokuapp.com/rss.cnn.com/rss/cnn_topstories.rss
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed?unit=second&interval=30
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed?unit=minute&interval=30
