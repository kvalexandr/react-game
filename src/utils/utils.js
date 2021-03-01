export const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
}

export const getStorage = (storageName) => {
  const data = JSON.parse(localStorage.getItem(storageName) || '[]');
  return data;
}

export const addStorage = (data, storageName) => {
  localStorage.setItem(storageName, JSON.stringify(data));
}

export function getTime(timer) {
  let minute = Math.floor(timer / 60);
  minute = minute < 10 ? `0${minute}` : minute;

  let second = timer - minute * 60;
  second = second < 10 ? `0${second}` : second;

  return [minute, second];
}

export function getTimeText(timer) {
  const [minute, second] = getTime(timer);
  return `${minute}:${second}`;
}
