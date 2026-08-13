export const getFormatedTodayDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  return (today = yyyy + '-' + mm + '-' + dd);
};

export const getCurrentHour = () => {
  let today = new Date();
  let hours = today.getHours();
  let minutes = String(today.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

/**
 * Calculates the exact age in completed years from a birth date.
 * @param {string|Date} birthDate - Date string (YYYY-MM-DD) or Date object.
 * @returns {number|null} Age in completed years, or null when the date is invalid.
 */
export const getAgeFromBirthDate = birthDate => {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
};

const COLOMBIA_TIME_ZONE = 'America/Bogota';

/**
 * Returns the current date in Colombia (UTC-5) as a Date at local midnight.
 * The app is Colombia-only, so "today" must not depend on the device timezone.
 * @returns {Date} Today's date in Colombia at 00:00:00.
 */
export const getColombiaToday = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: COLOMBIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const values = {};
  parts.forEach(part => {
    if (part.type !== 'literal') values[part.type] = part.value;
  });

  return new Date(`${values.year}-${values.month}-${values.day}T00:00:00`);
};
