const createRequest = async (options = {}, callback) => { // eslint-disable-line 

  fetch(options.url, {
    method: options.method,
    body: JSON.stringify(options.data),
  })
    .then((response) => {
      if (response.status === 204) {
        callback();
        return;
      }
      response.json()
        .then((result) => callback(result));
    })
    .catch((e) => {
      console.error('Произошла ошибка: ', e);
    });
};

export default createRequest;
