type DebounceItem = {
  index?: number;
  delay: number;
  callback: Function;
  args: any[];
  timeId?: NodeJS.Timeout;
};

const debounceManager: Array<DebounceItem> = [];

export default function debounce(this: any, delay: number, callback: Function, ...args: any[]) {
  const debounceItem = debounceManager.find((item) => item.callback === callback) || { delay, callback, args };
  if (debounceItem.timeId) {
    clearTimeout(debounceItem.timeId);
  }
  const context = this;
  debounceItem.timeId = setTimeout(() => {
    callback.apply(context, args);
    if (debounceItem.index !== undefined) {
      debounceManager.splice(debounceItem.index, 1);
    }
  }, debounceItem.delay);
  if (debounceItem.index === undefined) {
    debounceItem.index = debounceManager.push(debounceItem);
  }
}
