import i18next from 'i18next';

export default (state, errorType) => {
  const requestErrorBlock = document.querySelector('.error_block');
  const requestErrorContent = document.querySelector('.alert-content');
  const validationUrlFeedbackBlock = document.querySelector('.feedback');
  const input = document.querySelector('#input-url');

  const closeBtn = document.querySelector('.close');
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // eslint-disable-next-line no-param-reassign
    state.errors.requestError = null;
  });

  switch (errorType) {
    case 'validationError':
      if (state.errors.validationError) {
        validationUrlFeedbackBlock.textContent = i18next.t(state.errors.validationError);
        validationUrlFeedbackBlock.style.display = 'block';
        validationUrlFeedbackBlock.classList.add('invalid-feedback');
      } else {
        validationUrlFeedbackBlock.textContent = '';
        validationUrlFeedbackBlock.style.display = 'none';
        validationUrlFeedbackBlock.classList.remove('invalid-feedback');
      }

      break;
    case 'requestError':
      if (state.errors.requestError) {
        input.value = '';
        const errorText = i18next.t(state.errors.requestError);
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
