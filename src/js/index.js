import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import axios from 'axios';
import crc32 from 'crc-32';

import parseRss from './rssParser';
// import makeRequests from './postsUpdater';
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
  submitDisabled: false,
  processingRequest: false,
  errors: {
    validationError: null,
    requestError: null,
  },
  feeds: [],
  posts: [],
};

i18next.init({
  lng: 'en',
  resources: {
    en,
  },
});

input.addEventListener('input', () => {
  state.isValidUrl = false;
  const url = input.value;

  isValid(url, state)
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
    .then((rss) => {
      state.processingRequest = false;

      const {
        name,
        description,
        postsLinks,
        postsTitles,
      } = parseRss(rss);

      const currentFeedId = Math.abs(crc32.str(name));
      const feed = {
        id: currentFeedId,
        url,
        title: name,
        description,
      };

      state.feeds.push(feed);

      const postsCount = postsTitles.length;
      for (let i = 0; i < postsCount; i += 1) {
        const postTitle = postsTitles[i];
        const postUrl = postsLinks[i];

        const post = {
          id: Math.abs(crc32.str(postTitle)),
          feedId: currentFeedId,
          postUrl,
          postTitle,
        };

        state.posts.push(post);
      }
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
