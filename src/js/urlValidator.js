const { string, object } = require('yup');

export default (url, pool) => {
  const schema = object().shape({
    url: string().url(),
  });

  if (pool.includes(url)) {
    const promise = new Promise((resolve) => {
      const valid = false;
      const message = 'urls should not be duplicated!';

      resolve({ valid, message });
    });

    return promise;
  }

  return schema
    .isValid({
      url,
    })
    .then((valid) => {
      if (valid === false) {
        const message = 'url is not correct';
        return { valid, message };
      }

      return { valid, message: null };
    });
};
