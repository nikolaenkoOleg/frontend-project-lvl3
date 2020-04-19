const yup = require('yup');

const urls = [];

export default (url) => {
  const validation = yup.object().shape({
    url: yup
      .string()
      .required('errors.requiredUrlError')
      .url('errors.incorrectUrlError')
      .notOneOf(urls, 'errors.duplicateUrlError'),
  });

  return validation.validate({ url })
    .then((valid) => {
      urls.push(url);
      return valid;
    })
    .catch((err) => {
      const errorKey = err.errors[0];

      return Promise.reject(errorKey);
    });
};
