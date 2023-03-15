import React, { useState,useEffect } from 'react'
import './capacity.css'
import BasicTable from './eventListView'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import NewEventModal from '../components/newEvent';
import { useSelector } from 'react-redux';
import { genericGetService, getAuthHeaders } from '../../../../api/externalServices';
import BackdropLoader from '../../../common/backdroploader';
import { B2C_BASE_URL } from '../../../../constants';
import EventDetail from './EventDetail';

export default function Aforo() {
  const [open, setOpen] = useState(false);
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [events, setEvents] = useState([]);

  const user = useSelector(state => state.user);
  const selectedEventId = useSelector(state => state.events.selectedEventId);

  const handleOpen = () => {
    setIsUpdateRequired(false);
    setOpen(true);
  } 

  const handleOpenModalDetails = () => {
    setOpenModalDetails(true);
  } 

  const BASE_URL = B2C_BASE_URL;

  const getEvents = async () => {
    setLoading(true);
    return await genericGetService(`${BASE_URL}/event/eventsByChurch/${user.selectedChurchId}`,getAuthHeaders(user.token) );
  }

  useEffect(() => {
    if(selectedEventId){
      setOpen(true);
    }
  }, [selectedEventId]);

  useEffect(()=> {
    if(isUpdateRequired){
      setLoading(true);
      getEvents().then(data => {
        setLoading(false);
        if(data[0]){
          setEvents(data[0]);
          return;
        }

        alert("Error");
        
      });
    }
  },[isUpdateRequired]);

  useEffect(()=> {
    getEvents().then(data => {
      setLoading(false);
      if(data[0]){
        setEvents(data[0]);
        return;
      }

      alert("Error");
    });
  },[]);

  return (
    <div className='aforoMainContainer'>

      <div style={{ marginBottom: "30px" }}>Eventos</div>
      <div className='toolBarContainer' >
        <Stack spacing={2} direction="row">
          <Button variant="contained" style={{backgroundColor:"#454545"}}>Verificar</Button>
          <Button variant="outlined" style={{color:"black"}} onClick={handleOpen} >Crear Evento</Button>
        </Stack>

      </div>

      <NewEventModal open = {open} setOpen = {setOpen}  setIsUpdateRequired = {setIsUpdateRequired}/>
      <EventDetail open = { openModalDetails } setOpen = { setOpenModalDetails }/>
      
      {
        loading ? <BackdropLoader show={loading} message="Consultando los eventos" /> :  
        events.length > 0 ?   <BasicTable style={{ marginTop: "35px !important" }} events={events} openModal={handleOpenModalDetails} /> :
          <div>No se encontraron resultados</div>
      }
    
    </div>
  )
}
