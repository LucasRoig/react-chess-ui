let history = null;

export default {
  getHistory: () => {
    if (history) {
      return history;
    } else {
      throw Error("History is null !!")
    }
  },
  setHistory: h => history = h
}
