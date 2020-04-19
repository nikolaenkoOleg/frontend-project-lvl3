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
    state: 'active',
    errors: {
      validation: null,
      request: null,
    },
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

  isValid(url)
    .then(() => {
      state.form.validation = 'valid';
      state.form.errors.validation = '';
    })
    .catch((err) => {
      state.form.validation = 'invalid';
      state.form.errors.validation = err;
    });
});

const getContent = (rss, url) => {
  const doc = parseRss(rss);
  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;
  const feedPosts = doc.querySelectorAll('item');

  const currentFeedId = Math.abs(crc32.str(feedTitle));
  const feed = {
    id: currentFeedId,
    url,
    feedTitle,
    feedDescription,
  };

  const posts = [...feedPosts].reduce((acc, post) => {
    const link = post.querySelector('link').textContent;
    const title = post.querySelector('title').textContent;
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
  const stateFeedsIds = state.feeds.map((item) => item.id);

  if (!stateFeedsIds.includes(feed.id)) {
    state.feeds.push(feed);
  }
  const statePostIds = state.posts.map((post) => post.id);

  posts.forEach((post) => {
    if (!statePostIds.includes(post.id)) {
      state.posts.push(post);
    }
  });
};

const updateFeed = (url, time) => {
  let delay = time;
  loadRss(url)
    .then((rss) => {
      const content = getContent(rss, url);
      fillStateWithContent(content);
    })
    .catch(() => {
      delay *= 2;
    });

  setTimeout(updateFeed, 5000, url, delay);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = input.value;
  state.form.state = 'sending';

  loadRss(url)
    .then((rss) => {
      const content = getContent(rss, url);
      fillStateWithContent(content);
      state.form.state = 'finished';

      updateFeed(url, 5000);
    })
    .catch(() => {
      state.form.errors.request = 'errors.requestError';
      state.form.state = 'active';
    });
});


watchForm(state);
watchData(state);
watchErrors(state);

// https://cors-anywhere.herokuapp.com/rss.cnn.com/rss/cnn_topstories.rss
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed?unit=second&interval=1
