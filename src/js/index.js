import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import crc32 from 'crc-32';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { setLocale } from 'yup';
import _ from 'lodash';

import parseRss from './rssParser';
import validate from './urlValidator';
import en from './locales/en';
import watch from './watchers';

export default () => {
  setLocale({
    mixed: {
      notOneOf: 'errors.duplicateUrlError',
      required: 'errors.requiredUrlError',
    },
    string: {
      url: 'errors.incorrectUrlError',
    },
  });

  i18next.init({
    lng: 'en',
    resources: {
      en,
    },
  });

  const form = document.querySelector('form');
  const input = document.querySelector('#input-url');
  const closeBtn = document.querySelector('.close');

  const state = {
    form: {
      validationState: 'valid',
      state: 'active',
      errors: {
        validationError: null,
        requestError: null,
      },
    },
    feeds: [],
    posts: [],
  };

  const getContent = (parsedRss, url) => {
    const feedTitle = parsedRss.title;
    const feedDescription = parsedRss.description;
    const feedPosts = parsedRss.posts;

    const currentFeedId = Math.abs(crc32.str(feedTitle));
    const feed = {
      id: currentFeedId,
      url,
      feedTitle,
      feedDescription,
    };

    const posts = feedPosts.map((post) => {
      const { title, link } = post;
      const id = Math.abs(crc32.str(title));

      return {
        id,
        feedId: currentFeedId,
        link,
        title,
      };
    });

    return { feed, posts };
  };

  const fillStateWithContent = (content) => {
    const { feed, posts } = content;

    const newFeeds = _.differenceBy([feed], state.feeds, 'id');
    state.feeds.push(...newFeeds);

    const newPosts = _.differenceBy(posts, state.posts, 'id');
    state.posts.push(...newPosts);
  };

  const updateFeed = async (url) => {
    axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

    try {
      const response = await axios.get(url);
      const parsedRss = parseRss(response.data);
      const content = getContent(parsedRss, url);
      fillStateWithContent(content);
    } finally {
      setTimeout(updateFeed, 5000, url);
    }
  };

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    state.form.errors.requestError = null;
    state.form.state = 'active';
  });

  input.addEventListener('input', async () => {
    const url = input.value;
    const currentUrls = state.feeds.map((feed) => feed.url);

    const validationResponse = await validate(url, currentUrls);

    if (validationResponse.type === 'error') {
      state.form.validationState = 'invalid';

      const errorKey = validationResponse.errorKeys[0];
      state.form.errors.validationError = errorKey;
    } else {
      state.form.validationState = 'valid';
      state.form.errors.validationError = '';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = input.value;
    state.form.state = 'sending';

    try {
      const response = await axios.get(url);

      const parsedRss = parseRss(response.data);
      const content = getContent(parsedRss, url);

      fillStateWithContent(content);
      state.form.state = 'finished';

      updateFeed(url);
    } catch {
      state.form.state = 'failed';
      state.form.errors.requestError = 'errors.requestError';
    }
  });

  watch(state);
};


// https://cors-anywhere.herokuapp.com/rss.cnn.com/rss/cnn_topstories.rss
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed?unit=second&interval=1
