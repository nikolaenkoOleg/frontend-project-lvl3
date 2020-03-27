const { string, object } = require('yup');

export default (url) => {
  const schema = object().shape({
    url: string().url(),
  });

  return schema
    .isValid({
      url,
    })
    .then((valid) => valid);
};
