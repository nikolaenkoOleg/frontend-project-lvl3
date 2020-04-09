import i18next from 'i18next';

export default (state) => {
  const input = document.querySelector('input[type="text"]');
  const submit = document.querySelector('button[type="submit"]');
  const submitText = document.querySelector('.button-text');
  const submitSpinner = document.querySelector('.button-spinner');

  if (state.form.state === 'active') {
    input.disabled = false;
    submit.disabled = false;
    submitText.textContent = i18next.t('button.submit');
    submitSpinner.style.display = 'none';
  }

  if (state.form.state === 'sending') {
    input.disabled = true;
    submit.disabled = true;
    submitText.textContent = i18next.t('button.loading');
    submitSpinner.removeAttribute('style');
  }
};
