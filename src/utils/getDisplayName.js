/**
 * Builds the name shown for the logged-in user: first name + first last name.
 *
 * Users may have several names and last names stored as free text
 * (e.g. "María Elena" / "García López"), but the UI shows a short label.
 *
 * @param {string} name - First name(s) as stored in the user record.
 * @param {string} lastName - Last name(s) as stored in the user record.
 * @returns {string} e.g. "María García", or '' when both values are empty.
 */
export function getDisplayName(name, lastName) {
  const firstName = (name || '').trim().split(/\s+/)[0] || '';
  const firstLastName = (lastName || '').trim().split(/\s+/)[0] || '';

  return [firstName, firstLastName].filter(Boolean).join(' ');
}

export default getDisplayName;
