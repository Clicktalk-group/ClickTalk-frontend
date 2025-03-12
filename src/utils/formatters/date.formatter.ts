import { format, formatDistanceToNow, isSameDay, parse, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formats a date to a string with the specified format
 * @param date Date to format
 * @param formatStr Format string (date-fns format)
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  formatStr: string = 'dd/MM/yyyy'
): string => {
  if (!date) return '';
  
  const dateObj = ensureDate(date);
  return isValid(dateObj) ? format(dateObj, formatStr, { locale: fr }) : '';
};

/**
 * Formats a date to a relative time string (e.g. "il y a 5 minutes")
 * @param date Date to format
 * @param options Options for formatting
 * @returns Relative time string
 */
export const formatRelativeTime = (
  date: Date | string | number | null | undefined,
  options: { addSuffix?: boolean } = { addSuffix: true }
): string => {
  if (!date) return '';
  
  const dateObj = ensureDate(date);
  return isValid(dateObj) 
    ? formatDistanceToNow(dateObj, { locale: fr, addSuffix: options.addSuffix })
    : '';
};

/**
 * Returns a smart formatted date string based on how recent the date is
 * - Today: HH:mm
 * - This year: d MMM
 * - Older: d MMM yyyy
 * @param date Date to format
 * @returns Smart formatted date
 */
export const formatSmartDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = ensureDate(date);
  if (!isValid(dateObj)) return '';
  
  const now = new Date();
  
  // Today
  if (isSameDay(dateObj, now)) {
    return format(dateObj, 'HH:mm', { locale: fr });
  }
  
  // This year
  if (dateObj.getFullYear() === now.getFullYear()) {
    return format(dateObj, 'd MMM', { locale: fr });
  }
  
  // Older
  return format(dateObj, 'd MMM yyyy', { locale: fr });
};

/**
 * Converts various date formats to a Date object
 * @param date Date in various formats
 * @returns Date object
 */
const ensureDate = (date: Date | string | number | null | undefined): Date => {
  if (!date) return new Date(0); // Invalid date
  
  if (date instanceof Date) return date;
  
  if (typeof date === 'number') return new Date(date);
  
  // Handle string dates
  try {
    // Try to parse ISO format first
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) return parsedDate;
    
    // Try to parse with common formats
    for (const formatStr of ['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy']) {
      const parsedDate = parse(date, formatStr, new Date());
      if (isValid(parsedDate)) return parsedDate;
    }
    
    // Fallback to Date constructor
    return new Date(date);
  } catch {
    return new Date(0); // Invalid date
  }
};

/**
 * Determines if a date separator should be shown for a message
 * @param currentMessageDate Date of the current message
 * @param previousMessageDate Date of the previous message (if any)
 * @returns true if a date separator should be shown
 */
export const shouldShowDateSeparator = (
  currentMessageDate: Date | string | number,
  previousMessageDate?: Date | string | number | null
): boolean => {
  if (!previousMessageDate) return true; // Always show for first message
  
  const currentDate = ensureDate(currentMessageDate);
  const previousDate = ensureDate(previousMessageDate);
  
  if (!isValid(currentDate) || !isValid(previousDate)) return false;
  
  // Return true if the dates are on different days
  return !isSameDay(currentDate, previousDate);
};

/**
 * Format a date for the chat date separator
 * @param date Date to format
 * @returns Formatted date for separator
 */
export const formatDateSeparator = (date: Date | string | number): string => {
  const dateObj = ensureDate(date);
  if (!isValid(dateObj)) return '';
  
  const now = new Date();
  
  // Today
  if (isSameDay(dateObj, now)) {
    return "Aujourd'hui";
  }
  
  // Yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(dateObj, yesterday)) {
    return "Hier";
  }
  
  // This week (within 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 6);
  if (dateObj >= oneWeekAgo) {
    return format(dateObj, 'EEEE', { locale: fr });
  }
  
  // This year
  if (dateObj.getFullYear() === now.getFullYear()) {
    return format(dateObj, 'd MMMM', { locale: fr });
  }
  
  // Other years
  return format(dateObj, 'd MMMM yyyy', { locale: fr });
};
