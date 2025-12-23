export const parseFileName = (fileName: string) => {
  const nameArray = fileName.replace(/\.[^/.]+$/, '').split('@');
  const ratio = nameArray.length > 1 ? nameArray.pop() : '1';
  const maxRatio = ratio ? parseFloat(ratio.replace('x', '')) : 1;

  return {
    nameArray,
    ratio,
    maxRatio: isNaN(maxRatio) ? 1 : maxRatio,
  };
};
