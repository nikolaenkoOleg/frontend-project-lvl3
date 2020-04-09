import i18next from 'i18next';

export default (state, errorType) => {
  const requestErrorBlock = document.querySelector('.error_block');
  const requestErrorContent = document.querySelector('.alert-content');
  const validationUrlFeedbackBlock = document.querySelector('.feedback');
  const input = document.querySelector('#input-url');
  const submit = document.querySelector('button[type="submit"]');

  const closeBtn = document.querySelector('.close');
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // eslint-disable-next-line no-param-reassign
    state.form.error.requestError = null;
  });

  switch (errorType) {
    case 'validationError':
      if (state.form.error.validationError) {
        validationUrlFeedbackBlock.textContent = i18next.t(state.form.error.validationError);
        validationUrlFeedbackBlock.style.display = 'block';
        validationUrlFeedbackBlock.classList.add('invalid-feedback');
        input.classList.add('is-invalid');
        submit.disabled = true;
      } else {
        validationUrlFeedbackBlock.textContent = '';
        validationUrlFeedbackBlock.style.display = 'none';
        validationUrlFeedbackBlock.classList.remove('invalid-feedback');
        input.classList.remove('is-invalid');
        submit.disabled = false;
      }

      break;
    case 'requestError':
      if (state.form.error.requestError) {
        input.value = '';
        const errorText = i18next.t(state.form.error.requestError);
        requestErrorContent.prepend(errorText);
        requestErrorBlock.style.display = 'block';
      } else {
        requestErrorContent.textContent = '';
        requestErrorBlock.style.display = 'none';
      }

      break;
    default:
      throw new Error(`Unknown error - ${errorType}`);
  }
};
