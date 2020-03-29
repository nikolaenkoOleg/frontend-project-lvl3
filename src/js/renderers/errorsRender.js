export default (errorState, errorType) => {
  const requestErrorBlock = document.querySelector('.error_block');
  const requestErrorContent = document.querySelector('.alert-content');
  const validationUrlFeedbackBlock = document.querySelector('.feedback');

  const closeBtn = document.querySelector('.close');
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // eslint-disable-next-line no-param-reassign
    errorState.requestError = null;
  });

  switch (errorType) {
    case 'validationError':
      if (errorState.validationError) {
        validationUrlFeedbackBlock.textContent = `Url is not valid: ${errorState.validationError}`;
        validationUrlFeedbackBlock.style.display = 'block';
        validationUrlFeedbackBlock.classList.add('invalid-feedback');
      } else {
        validationUrlFeedbackBlock.textContent = '';
        validationUrlFeedbackBlock.style.display = 'none';
        validationUrlFeedbackBlock.classList.remove('invalid-feedback');
      }

      break;
    case 'requestError':
      if (errorState.requestError) {
        const errorText = `Ups... we have ${errorState.requestError}. Try again later.`;
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
