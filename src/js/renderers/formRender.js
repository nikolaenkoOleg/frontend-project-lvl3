export default (state, key) => {
  const input = document.querySelector('input[type="text"]');
  const submit = document.querySelector('button[type="submit"]');

  switch (key) {
    case 'submit':
      if (state.submitDisabled === true) {
        submit.disabled = true;
      } else {
        submit.disabled = false;
      }

      break;
    case 'request':
      if (state.processingRequest === true) {
        submit.disabled = true;
      } else {
        submit.disabled = false;
      }

      break;
    case 'url':
      if (state.isValidUrl === false) {
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }

      break;
    default:
      throw new Error(`Unknown key - ${key}`);
  }
};
