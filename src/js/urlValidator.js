import * as yup from 'yup';

yup.setLocale({
  mixed: {
    notOneOf: 'errors.duplicateUrlError',
    required: 'errors.requiredUrlError',
  },
  string: {
    url: 'errors.incorrectUrlError',
  },
});

export default (url, urls) => {
  const validation = yup.object().shape({
    url: yup
      .string()
      .required()
      .url()
      .notOneOf(urls),
  });

  return validation.validate({ url })
    .then((valid) => valid)
    .catch((err) => Promise.reject(err));
};
