import { watch } from 'melanke-watchjs';
import renderForm from './renderers/formRender';
import renderContent from './renderers/contentRender';
import renderError from './renderers/errorsRender';

const watchForm = (state) => {
  watch(state.form, 'state', () => {
    renderForm(state);
  });
};

const watchData = (state) => {
  watch(state, 'feeds', () => {
    renderContent(state);
  });

  watch(state, 'posts', () => {
    renderContent(state);
  });
};

const watchErrors = (state) => {
  watch(state.form.error, 'validationError', () => {
    renderError(state, 'validationError');
  });

  watch(state.form.error, 'requestError', () => {
    renderError(state, 'requestError');
  });
};

export {
  watchForm,
  watchData,
  watchErrors,
};
