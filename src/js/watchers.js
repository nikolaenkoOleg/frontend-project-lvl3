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
  watch(state, ['feeds', 'posts'], () => {
    renderContent(state);
  });
};

const watchErrors = (state) => {
  watch(state.form.errors, ['validation', 'request'], () => {
    renderError(state);
  });
};

export {
  watchForm,
  watchData,
  watchErrors,
};
