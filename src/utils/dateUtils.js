export const getFormatedTodayDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

  return today = yyyy + '-' + mm + '-' + dd;
}

export const getCurrentHour = () => {
    let today = new Date();
    let hours = today.getHours();
    let minutes = String(today.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}