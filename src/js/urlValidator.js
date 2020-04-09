const yup = require('yup');

export default (url, state) => {
  const pool = state.feeds.map((item) => item.url);

  yup.addMethod(yup.string, 'noDouble', function (urls, message) {
    return this.test('noDouble', message, (value) => !urls.includes(value));
  });

  const schema = yup.object().shape({
    url: yup.string().url().noDouble(pool, 'doubleUrl'),
  });

  yup.setLocale({
    mixed: {
      default: 'Não é válido',
    },
    number: {
      min: 'Deve ser maior que ${min}',
    },
  });

  // now use Yup schemas AFTER you defined your custom dictionary
  let schema2 = yup.object().shape({
    name: yup.string(),
    age: yup.number().min(18),
  });

  schema2.validate({ name: 'jimmy', age: 11 }).catch(function(err) {
    console.log(err.name, err.errors);
    // err.name; // => 'ValidationError'
    // err.errors; // => ['Deve ser maior que 18']
  });

  return schema
    .isValid({
      url,
    })
    .then((valid) => {
      if (valid === false) {
        const key = 'errors.incorrectUrlError';
        return { valid, key };
      }

      return { valid, key: null };
    });
};
