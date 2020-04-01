const { string, object } = require('yup');

export default (url, pool) => {
  const schema = object().shape({
    url: string().url(),
  });

  if (pool.includes(url)) {
    const promise = new Promise((resolve) => {
      const valid = false;
      const key = 'errors.duplicateUrlError';

      resolve({ valid, key });
    });

    return promise;
  }

  return schema
    .isValid({
      url,
    })
    .then((valid) => {
      if (valid === false) {
        const key = 'errors.incorrectUrlError';
        return { valid, key };
      }

      return { valid, message: null };
    });
};
