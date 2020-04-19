import i18next from 'i18next';

export default (state) => {
  const validationUrlFeedbackBlock = document.querySelector('.feedback');
  const input = document.querySelector('#input-url');
  const submit = document.querySelector('button[type="submit"]');

  if (state.form.validationState === 'invalid') {
    validationUrlFeedbackBlock.textContent = i18next.t(state.form.errors.validation);
    validationUrlFeedbackBlock.style.display = 'block';
    validationUrlFeedbackBlock.classList.add('invalid-feedback');
    input.classList.add('is-invalid');
    submit.disabled = true;
  }

  if (state.form.validationState === 'valid') {
    validationUrlFeedbackBlock.textContent = '';
    validationUrlFeedbackBlock.style.display = 'none';
    validationUrlFeedbackBlock.classList.remove('invalid-feedback');
    input.classList.remove('is-invalid');
    submit.disabled = false;
  }
};
