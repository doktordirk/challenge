export function delayedTest(test, wait) {
  return new Promise( (resolve, reject) => {
    setTimeout(() => {
      try {
        test();

        resolve();
      } catch (e) {
        reject(e);
      }
    }, wait);
  });
}
