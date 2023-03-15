import { useEffect, useState } from "react"
import {ReadExcelFile} from "../../utils/readXLSFile";
import styles from "./styles.module.css";
import { capitalizeName } from "../../utils/capitalizeName";
import BackdropLoader from "../common/backdroploader";
import { genericPostService } from "../../api/externalServices";
import { B2C_BASE_URL } from "../../constants";
import { isExcelFile } from "../../utils/validations";
import { Alert } from "@mui/material";

function BulkLoad() {

  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [fileValitationError, setFileValidationError] = useState("");
  const [message, setMessage] = useState(null);

  useEffect ( () => {
    if(fileValitationError !== ""){
      setMessage({severity: "error", message: fileValitationError})
      setExcelData([])
      setResultsData([])
    }
  }, [fileValitationError])

  useEffect( () => {
    if(excelData.length > 0){
      setResultsData([])
    }
  }, [excelData])

  const selectFile = (e) => {
    if (e.target.files.length > 0) {
        setFileValidationError("");
        const file = e.target.files[0]; 
        if(isExcelFile(file)){
          ReadExcelFile(file, setExcelData, setFileValidationError)
        }else{
          setMessage({severity: "error", message: "Solamente se permiten archivos de excel"})
        }        
    }
  }

  const sentAttendeeTemplate = async () => {
    setLoading(true);
    const results = await genericPostService(`${B2C_BASE_URL}/attendee/CreateCollection`, excelData);
    console.log(results);
    setLoading(false);
    if(results[1]){
      setMessage({severity: "error", message: "Se presentó un error cargando plantilla"})
      return
    }
    setResultsData(results[0])
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.customMessage}>
          {message && <Alert variant="filled" severity={message.severity} onClick={()=>{setMessage(null)}}>{message.message}</Alert>}
        </div>
        <BackdropLoader show={loading} message="Subiendo plantilla" />
        <div className={styles.leftSideContainer}>
          <h2>Adjunte la Planilla de Asistentes</h2>
          <label className={styles.button} htmlFor="button">Adjuntar Planilla</label>
          <input id="button" type="file" onChange={selectFile} onClick={()=>{setMessage(null)}} name="file" />
          { excelData.length > 0 ? 
            <button className={styles.sendTemplate} onClick={() => {sentAttendeeTemplate()}}>Enviar Plantilla</button>
            : null}
          <a className={styles.downloadTemplate} href="/template/plantillaAsistentes.xlsx" download>Descargar Plantilla</a>
          
        </div>
        <div className={styles.rightSideContainer}>
        { excelData.length > 0 ? 
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Tipo de Documento</th>
                  <th>Número de Documento</th>
                  <th>Correo</th>
                  <th>Celular</th>
                  <th>Contacto de Emergencia</th>
                  <th>Teléfono</th>
                  <th>Frente de Trabajo</th>
                  <th>Nivel</th>
                </tr>
              </thead>
              <tbody>
                {excelData.map( row => {
                  return <tr>
                          <td>{capitalizeName(row.name)}</td>
                          <td>{row.documentType.toUpperCase()}</td>
                          <td>{row.documentNumber}</td>
                          <td>{row.email.toLowerCase()}</td>
                          <td>{row.phone}</td>
                          <td>{capitalizeName(row.emergencyContactName)}</td>
                          <td>{row.emergencyContactPhone}</td>
                          <td>{capitalizeName(row.front)}</td>
                          <td>{capitalizeName(row.level)}</td>
                         </tr>
                })}
              </tbody>
            </table>
          </div>
          : <div className={styles.noTableData}>
            Vista previa no disponible
            </div>}
        </div>
         <div>
          {resultsData.length > 0 ? 
            <div className={styles.resultsWrapper}>
              <h2>Resultados</h2>
              <p>Registros Procesados Totales: {resultsData.length}</p>
              <p>Registros Procesados Exitosos: {resultsData.filter(result => {return result.isSaved}).length}</p>
              <p>Registros con Novedades: {resultsData.filter(result => {return !result.isSaved}).length}</p>
              <p>Lista de Registros con Novedades:</p> 
                <ul>
                  {resultsData.filter(result => {return !result.isSaved}).map(result => {
                    return <li>{result.message}</li>
                  })}
                </ul>
            </div>
          : null}
        </div>
      </div>
   
  )
}

export default BulkLoad