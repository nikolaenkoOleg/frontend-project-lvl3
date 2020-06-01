import * as yup from 'yup';

export default (url, urls) => {
  const validation = yup.object().shape({
    url: yup
      .string()
      .required()
      .url()
      .notOneOf(urls),
  });

  return validation.validate({ url });
};
