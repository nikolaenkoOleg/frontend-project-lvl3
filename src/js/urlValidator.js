const yup = require('yup');

export default (url, state) => {
  const pool = state.feeds.map((item) => item.url);

  yup.addMethod(yup.string, 'noDouble', function (urls, message) {
    return this.test('noDouble', message, (value) => {
      const { path, createError } = this;
      if (!urls.includes(value)) {
        return true;
      }

      return createError({ path, message: 'dwdsd' });
    });
  });

  const validation = yup.object().shape({
    url: yup.string().url('errors.incorrectUrlError').noDouble(pool, 'erros.duplicateUrlError'),
  });

  return validation.validate({ url })
    .then((valid) => valid)
    .catch((err) => {
      console.log('err', err.errors);
    });
};
