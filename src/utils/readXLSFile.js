import {read,utils } from "xlsx";

export const ReadExcelFile  = (file, setExcelData, setFileValidationError) => {

    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* Convert array of arrays */
      const data = utils.sheet_to_json(ws, { header: 1 });
        console.log(data);
        if(data.length === 0 || data.length === 1){
            setFileValidationError("La plantilla no puede estar vacía")
            return
        }
        if(data[1].length !== 9){
            setFileValidationError("La plantilla no tiene las columnas solicitadas")
            return
        }

      /* Update state */
      var result = mappedData(data);
      setExcelData(result)
   
    };

    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
}

const mappedData = (data) => {

    let result = [];

    if (data.length  <= 1) {
        return result
    }

    for (let index = 1; index < data.length; index++) {
        const item = data[index];

        let objectItem = {}
        for (let x = 0; x < data[0].length; x++) {
            if (item[x]) {
                objectItem[objectMap[x]] = item[x]
            }else{
                objectItem[objectMap[x]] = ""
            }
        }

        result.push(objectItem)
    }

    return result
}

const objectMap = [
    "name",
    "documentType",
    "documentNumber",
    "email",
    "phone",
    "emergencyContactName",
    "emergencyContactPhone",
    "front",
    "level"
];

const make_cols = refstr => {
    let o = [],
      C = utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = { name: utils.encode_col(i), key: i };
    return o;
  };