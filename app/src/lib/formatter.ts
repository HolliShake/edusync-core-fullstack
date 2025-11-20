export const formatId = (year: number, poolNo: number): string => {
  const poolNoStr = poolNo.toString().padStart(6, '0');
  return `${year}${poolNoStr}`;
};

export const dateToWord = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
};
