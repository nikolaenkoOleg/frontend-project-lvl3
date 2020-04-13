const yup = require('yup');

export default (state) => {
  const { url } = state.form.data;
  const urls = state.feeds.map((item) => item.url);

  const validation = yup.object().shape({
    url: yup
      .string()
      .url('errors.incorrectUrlError')
      .notOneOf(urls, 'errors.duplicateUrlError'),
  });

  return validation.validate({ url })
    .then((valid) => valid)
    .catch((err) => Promise.reject(err.errors[0]));
};
