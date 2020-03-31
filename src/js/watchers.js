import { watch } from 'melanke-watchjs';
import renderForm from './renderers/formRender';
import renderContent from './renderers/contentRender';
import renderError from './renderers/errorsRender';

const watchUrl = (state) => {
  watch(state, 'isValidUrl', () => {
    renderForm(state, 'url');
  });
};

const watchSubmit = (state) => {
  watch(state, 'processingRequest', () => {
    renderForm(state, 'request');
  });

  watch(state, 'submitDisabled', () => {
    renderForm(state, 'submit');
  });
};

const watchData = (state) => {
  watch(state, 'rssData', () => {
    const { rssData } = state;
    renderContent(rssData);
  });
};

const watchErrors = (state) => {
  watch(state.errors, 'validationError', () => {
    renderError(state.errors, 'validationError');
  });

  watch(state.errors, 'requestError', () => {
    renderError(state.errors, 'requestError');
  });
};

export {
  watchUrl,
  watchSubmit,
  watchData,
  watchErrors,
};
