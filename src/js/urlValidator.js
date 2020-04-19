const yup = require('yup');

const urls = [];

export default (url) => {
  const validation = yup.object().shape({
    url: yup
      .string()
      .url('errors.incorrectUrlError')
      .notOneOf(urls, 'errors.duplicateUrlError'),
  });

  return validation.validate({ url })
    .then((valid) => {
      urls.push(url);
      return valid;
    })
    .catch((err) => Promise.reject(err.errors[0]));
};
