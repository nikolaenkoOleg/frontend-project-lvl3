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
        validation: null,
        request: null,
      },
    },
    feeds: [],
    posts: [],
  };

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

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    state.form.errors.request = null;
    state.form.state = 'active';
  });

  input.addEventListener('input', () => {
    const url = input.value;

    isValid(url)
      .then(() => {
        state.form.validationState = 'valid';
        state.form.errors.validation = '';
      })
      .catch((err) => {
        state.form.validationState = 'invalid';
        state.form.errors.validation = err;
      });
  });

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
        state.form.state = 'failed';
        state.form.errors.request = 'errors.requestError';
      });
  });

  watchForm(state);
  watchData(state);
  watchValidation(state);
};

main();


// https://cors-anywhere.herokuapp.com/rss.cnn.com/rss/cnn_topstories.rss
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed?unit=second&interval=1
