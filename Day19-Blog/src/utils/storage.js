export const getBlogsFromStorage = () => {
  const data = localStorage.getItem('my_blogs');
  return data ? JSON.parse(data) : [];
};

export const saveBlogsToStorage = (blogs) => {
  localStorage.setItem('my_blogs', JSON.stringify(blogs));
};
