export const emailValidation = (email) => {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return validRegex.test(email)
}

export const isExcelFile = file => {
    const validExtension = ["vnd.openxmlformats-officedocument.spreadsheetml.sheet", "vnd.ms-excel"];
    const fileExtension = file.type.split("/")[1];
    return validExtension.includes(fileExtension);
}