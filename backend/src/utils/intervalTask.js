const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const runTaskEveryInterval = async (task, intervalTime) => {
  while (true) {
    await task();
    await delay(intervalTime);
  }
};

export default runTaskEveryInterval;
