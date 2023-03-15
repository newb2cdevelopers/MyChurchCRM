export const capitalizeName = (name) => {

    if(name === "" || name === null || name === undefined || typeof(name) !== "string"){
      return name
    }

    let arrName = name.split(" ");
    for (let i = 0; i < arrName.length; i++) {
      arrName[i] = arrName[i].charAt(0).toUpperCase() + arrName[i].slice(1).toLowerCase();
    }
    let fullName = arrName.join(" ")
    return fullName;
  }