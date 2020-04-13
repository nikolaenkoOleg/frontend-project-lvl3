import i18next from 'i18next';

export default (state) => {
  const requestErrorBlock = document.querySelector('.error_block');
  const requestErrorContent = document.querySelector('.alert-content');
  const validationUrlFeedbackBlock = document.querySelector('.feedback');
  const input = document.querySelector('#input-url');
  const submit = document.querySelector('button[type="submit"]');

  const closeBtn = document.querySelector('.close');
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // eslint-disable-next-line no-param-reassign
    state.form.errors.request = null;
  });

  if (state.form.errors.validation) {
    validationUrlFeedbackBlock.textContent = i18next.t(state.form.errors.validation);
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

  if (state.form.errors.request) {
    input.value = '';
    const errorText = i18next.t(state.form.errors.request);
    requestErrorContent.prepend(errorText);
    requestErrorBlock.style.display = 'block';
  } else {
    requestErrorContent.textContent = '';
    requestErrorBlock.style.display = 'none';
  }
};
