import { DATE_FORMAT_ISO } from "@constants";
import moment from "moment";

export const getCurrentDate = (): string => {
  return moment().format(DATE_FORMAT_ISO);
};

export const getLastDateOfPreviousMonth = (): string => {
  const currentDate = moment();
  const date = currentDate.subtract(1, 'months').endOf('month');

  return date.format(DATE_FORMAT_ISO);
};

export const getFirstDateOfPreviousMonth = (): string => {
  const currentDate = moment();
  const date = currentDate.subtract(1, 'months').startOf('month');

  return date.format(DATE_FORMAT_ISO);
};

export const getDayOfCurrentMonth = (day: number): string => {
  const currentDate = moment();
  const date = currentDate.date(day);

  return date.format(DATE_FORMAT_ISO);
};

export const getPreviousMonthName = (): string => {
  const currentDate = moment();
  return currentDate.subtract(1, 'months').format('MMMM');
};
