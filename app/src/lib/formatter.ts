export const formatId = (year: number, poolNo: number): string => {
  const poolNoStr = poolNo.toString().padStart(6, '0');
  return `${year}${poolNoStr}`;
};
