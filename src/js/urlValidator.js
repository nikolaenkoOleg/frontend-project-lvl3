import * as yup from 'yup';

export default (url, urls) => {
  const validation = yup.object().shape({
    url: yup
      .string()
      .required('errors.requiredUrlError')
      .url('errors.incorrectUrlError')
      .notOneOf(urls, 'errors.duplicateUrlError'),
  });

  return validation.validate({ url })
    .then((valid) => valid)
    .catch((err) => {
      const errorKey = err.errors[0];

      return Promise.reject(errorKey);
    });
};
