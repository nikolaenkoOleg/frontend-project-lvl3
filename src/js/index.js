import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import renderFeed from './renderFeed';
import isValid from './urlValidator';

const form = document.querySelector('form');
const input = document.querySelector('input[type="text"]');
const submit = document.querySelector('button[type="submit"]');
const errorBlock = document.querySelector('.error_block');
const feedsList = document.querySelector('.feeds-list > .list-group');

const state = {
  isValidUrl: true,
  submitDisabled: true,
  rssData: null,
};

input.addEventListener('input', () => {
  state.isValidUrl = false;
  const { value } = input;

  isValid(value)
    .then((valid) => {
      if (valid) {
        state.isValidUrl = true;
      } else {
        state.isValidUrl = false;
      }
    });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = input.value;

  axios.get(url)
    .then((response) => response.data)
    .then((data) => {
      const parser = new DOMParser();
      return parser.parseFromString(data, 'text/xml');
    })
    .then((str) => {
      state.rssData = str;
      console.log(state);
    })
    .catch((error) => {
      const errorContent = document.createElement('p');
      errorContent.style.textAlign = 'center';
      errorContent.style.margin = 0;
      errorContent.textContent = `Ups... we have ${error}`;

      errorBlock.append(errorContent);
      errorBlock.style.display = 'block';
    });
});

// https://cors-anywhere.herokuapp.com/rss.cnn.com/rss/cnn_topstories.rss
// https://cors-anywhere.herokuapp.com/lorem-rss.herokuapp.com/feed