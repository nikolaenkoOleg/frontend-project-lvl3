import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import crc32 from 'crc-32';

import parseRss from './rssParser';
import loadRss from './rssLoader';
import isValid from './urlValidator';
import en from './locales/en';
import {
  watchForm,
  watchData,
  watchErrors,
} from './watchers';

const form = document.querySelector('form');
const input = document.querySelector('#input-url');

const state = {
  form: {
    error: {
      validationError: null,
      requestError: null,
    },
    state: 'active',
    validation: 'valid',
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
  const url = input.value;

  isValid(url, state)
    .then(() => {
      state.form.validation = 'valid';
    })
    .catch((err) => {
      console.log(err);
    });
});

const getContent = (data, url) => {
  const {
    name,
    description,
    postsLinks,
    postsTitles,
  } = parseRss(data);

  const currentFeedId = Math.abs(crc32.str(name));
  const feed = {
    id: currentFeedId,
    url,
    title: name,
    description,
  };

  const postsCount = postsTitles.length;
  const posts = [];
  for (let i = 0; i < postsCount; i += 1) {
    const postTitle = postsTitles[i];
    const postUrl = postsLinks[i];

    const post = {
      id: Math.abs(crc32.str(postTitle)),
      feedId: currentFeedId,
      postUrl,
      postTitle,
    };

    posts.push(post);
  }

  return { feed, posts };
};

let delay = 5000;
const listener = (rssUrl) => {
  loadRss(rssUrl)
    .then((rss) => {
      state.form.state = 'active';
      const { feed, posts } = getContent(rss, rssUrl);

      const feedId = feed.id;
      const stateFeedsIds = state.feeds.map((item) => item.id);

      if (!stateFeedsIds.includes(feedId)) {
        state.feeds.push(feed);
      }
      const statePostIds = state.posts.map((item) => item.id);

      posts.forEach((post) => {
        if (!statePostIds.includes(post.id)) {
          state.posts.push(post);
        }
      });
    })
    .catch(() => {
      delay *= 2;
      state.form.error.requestError = 'errors.requestError';
      state.form.state = 'active';
    });

  setTimeout(listener, delay, rssUrl);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = input.value;
  state.form.state = 'sending';

  listener(url);
});


watchForm(state);
watchData(state);
watchErrors(state);

// https://cors-anywhere.herokuapp.com/rss.cnn.com/rss/cnn_topstories.rss
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed?unit=second&interval=1
