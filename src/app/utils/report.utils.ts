export const calculateSalary = (rate: number, salary: number): string => {
  return (salary * rate).toFixed(2);
};
