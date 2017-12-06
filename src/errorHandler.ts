let listener;
export default {
  subscribe: l => (listener = l),
  throwError: error => listener(error)
};
