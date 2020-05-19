import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import crc32 from 'crc-32';
import axios from 'axios';
// import retry from 'async-retry';
import axiosRetry from 'axios-retry';
import _ from 'lodash';

import parseRss from './rssParser';
import isValid from './urlValidator';
import en from './locales/en';
import watch from './watchers';

export default () => {
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
    newFeeds.forEach((item) => {
      state.feeds.push(item);
    });


    const newPosts = _.differenceBy(posts, state.posts, 'id');
    newPosts.forEach((item) => {
      state.posts.push(item);
    });
  };

  const updateFeed = (url) => {
    axiosRetry(axios, { retries: 5 });

    const promise = axios.get(url)
      .then(() => setTimeout(updateFeed, 5000, url))
      .catch((err) => {
        setTimeout(updateFeed, 5000, url);
        return Promise.reject(err);
      });

    console.log(promise);
    return promise;
  };

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    state.form.errors.requestError = null;
    state.form.state = 'active';
  });

  input.addEventListener('input', () => {
    const url = input.value;
    const currentUrls = state.feeds.map((feed) => feed.url);

    isValid(url, currentUrls)
      .then(() => {
        state.form.validationState = 'valid';
        state.form.errors.validationError = '';
      })
      .catch((err) => {
        state.form.validationState = 'invalid';

        const errorKey = err.errors[0];
        state.form.errors.validationError = errorKey;
      });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value;
    state.form.state = 'sending';

    axios.get(url)
      .then((response) => {
        const parsedRss = parseRss(response.data);
        const content = getContent(parsedRss, url);
        fillStateWithContent(content);
        state.form.state = 'finished';
      })
      .then(() => {
        updateFeed(url).catch((err) => console.log('errooooor', err));
      })
      .catch(() => {
        state.form.state = 'failed';
        state.form.errors.requestError = 'errors.requestError';
      });
  });

  watch(state);
};


// https://cors-anywhere.herokuapp.com/rss.cnn.com/rss/cnn_topstories.rss
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed?unit=second&interval=1
