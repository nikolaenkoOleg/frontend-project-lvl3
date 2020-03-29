import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import isValid from './urlValidator';
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

input.addEventListener('input', () => {
  state.isValidUrl = false;
  const url = input.value;

  isValid(url, state.urlPool)
    .then(({ valid, message }) => {
      if (valid) {
        state.isValidUrl = true;
        state.errors.validationError = message;
        state.submitDisabled = false;
      } else {
        state.isValidUrl = false;
        state.errors.validationError = message;
        state.submitDisabled = true;
        console.log(state);
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
      input.value = '';
      state.processingRequest = false;
      state.urlPool.push(url);
    })
    .catch((error) => {
      input.value = '';
      state.errors.requestError = error;
      state.processingRequest = false;
    });
});

watchUrl(state);
watchData(state);
watchSubmit(state);
watchErrors(state);

// https://cors-anywhere.herokuapp.com/rss.cnn.com/rss/cnn_topstories.rss
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed
