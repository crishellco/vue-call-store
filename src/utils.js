const decorateStore = (store) => {
  store.trackRequest = (payload, promise) => {
    store.dispatch('calls/start', payload, { root: true });

    return new Promise((resolve, reject) => {
      promise
        .then(async (data) => {
          await store.dispatch('calls/end', payload, { root: true });
          resolve(data);
        })
        .catch(async (err) => {
          await store.dispatch('calls/fail', { ...payload, message: err }, { root: true });
          reject(err);
        });
    });
  };
};

export { decorateStore };
