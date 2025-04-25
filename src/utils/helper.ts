import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en"; // English locale

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("en");

export const DATE_FORMAT = {
  DAY_MONTH_YEAR: "DD/MM/YYYY",
  DASH_YEAR_MONTH_DAY: "YYYY-MM-DD",
  DATE_TIME: "MMMM D, YYYY, hh:mm:ss A",
  DAY_MONTH_YEAR_TIME: "DD MMM YYYY, HH:mm A",
  MONTH_DAY_YEAR: "MMM DD, YYYY",
  DAY__MONTH__YEAR: "DD MMM, YYYY",
  DATE_MONTH_YEAR: "D MMM, YYYY",
  D_M_YYYY: "d/M/yyyy",
};

type FormatterValue = Date | string;

interface Props {
  amount: string;
  currency?: string;
  fraction?: boolean;
  locale?: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatDateWithLocale = (value: FormatterValue, format: string) => {
  const formattedDate = dayjs(value).format(format);

  return formattedDate;
};

export const dayMonthYearFormatter = (value: FormatterValue) => {
  return formatDateWithLocale(value, DATE_FORMAT.DAY__MONTH__YEAR);
};

export const getFormattedAmount = ({
  amount,
  currency,
  fraction = true,
  locale,
}: Props) => {
  // const language =
  //   getDataFromCookies(CookiesKey.NextLocale) ?? LangEnum.English;
  // const finalLocale = languageLocaleMapping[language];
  let formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    useGrouping: true,
    minimumFractionDigits: fraction ? 2 : 0,
    maximumFractionDigits: fraction ? 2 : 0,
  }).format(parseFloat(amount || "0"));

  if (currency === "USD" && !formattedAmount.includes(" ")) {
    formattedAmount = formattedAmount.replace("US$", "USD ");
    formattedAmount = formattedAmount.replace("$", "USD ");
  }

  return formattedAmount;
};
