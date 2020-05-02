import i18next from 'i18next';

export default (state) => {
  const input = document.querySelector('input[type="text"]');
  const submit = document.querySelector('button[type="submit"]');
  const submitText = document.querySelector('.button-text');
  const submitSpinner = document.querySelector('.button-spinner');
  const feedback = document.querySelector('.feedback');
  const requestErrorBlock = document.querySelector('.error_block');
  const requestErrorContent = document.querySelector('.alert-content');

  if (state.form.state === 'active') {
    input.disabled = false;
    submit.disabled = false;
    submitText.textContent = i18next.t('button.submit');
    submitSpinner.style.display = 'none';

    requestErrorContent.textContent = '';
    requestErrorBlock.style.display = 'none';
  }

  if (state.form.state === 'sending') {
    input.disabled = true;
    submit.disabled = true;
    submitText.textContent = i18next.t('button.loading');
    submitSpinner.removeAttribute('style');
  }

  if (state.form.state === 'failed') {
    const errorText = i18next.t(state.form.errors.requestError);

    submit.disabled = false;
    submitText.textContent = i18next.t('button.submit');
    submitSpinner.style.display = 'none';

    input.value = '';
    input.disabled = false;

    requestErrorContent.prepend(errorText);
    requestErrorBlock.style.display = 'block';
  }

  if (state.form.state === 'finished') {
    input.disabled = false;
    submit.disabled = false;
    submitText.textContent = i18next.t('button.submit');
    submitSpinner.style.display = 'none';

    feedback.textContent = i18next.t('finished');
    feedback.classList.add('valid-feedback');
    feedback.style.display = 'block';

    setTimeout(() => {
      feedback.textContent = '';
      feedback.classList.remove('valid-feedback');
      feedback.style.display = 'none';
    }, 7000);
  }
};
