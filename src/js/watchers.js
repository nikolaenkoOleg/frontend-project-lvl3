import { watch } from 'melanke-watchjs';
import renderForm from './renderers/formRender';
import renderContent from './renderers/contentRender';
import renderValidation from './renderers/validationRender';

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

const watchValidation = (state) => {
  watch(state.form.errors, 'validationError', () => {
    renderValidation(state);
  });
};

export default (state) => {
  watchForm(state);
  watchData(state);
  watchValidation(state);
};
