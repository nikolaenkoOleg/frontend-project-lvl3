import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import crc32 from 'crc-32';
import axios from 'axios';
import _ from 'lodash';
import retry from 'async-retry';

import parseRss from './rssParser';
import isValid from './urlValidator';
import en from './locales/en';
import {
  watchForm,
  watchData,
  watchValidation,
} from './watchers';

i18next.init({
  lng: 'en',
  resources: {
    en,
  },
});

const main = () => {
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

  const getContent = (rss, url) => {
    const parsedRss = parseRss(rss);
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

    const posts = [...feedPosts].reduce((acc, post) => {
      const { title, link } = post;
      const id = Math.abs(crc32.str(title));

      return [...acc, {
        id,
        feedId: currentFeedId,
        link,
        title,
      }];
    }, []);

    return { feed, posts };
  };

  const fillStateWithContent = (content) => {
    const { feed, posts } = content;

    const newFeeds = _.differenceBy([feed], state.feeds, 'id');
    if (newFeeds.length > 0) {
      newFeeds.forEach((item) => {
        state.feeds.push(item);
      });
    }

    const newPosts = _.differenceBy(posts, state.posts, 'id');
    if (newPosts.length > 0) {
      newPosts.forEach((item) => {
        state.posts.push(item);
      });
    }
  };

  const updateFeed = (url, time) => {
    const delay = time;

    retry(() => {
      axios.get(url)
        .then((response) => {
          const content = getContent(response.data, url);
          fillStateWithContent(content);
        });
    }, {
      minTimeout: time,
    });

    setTimeout(updateFeed, 5000, url, delay);
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
        state.form.errors.validationError = err;
      });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value;
    state.form.state = 'sending';

    axios.get(url)
      .then((response) => {
        const content = getContent(response.data, url);
        fillStateWithContent(content);
        state.form.state = 'finished';

        updateFeed(url, 5000);
      })
      .catch(() => {
        state.form.state = 'failed';
        state.form.errors.requestError = 'errors.requestError';
      });
  });

  watchForm(state);
  watchData(state);
  watchValidation(state);
};

main();


// https://cors-anywhere.herokuapp.com/rss.cnn.com/rss/cnn_topstories.rss
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed?unit=second&interval=1
