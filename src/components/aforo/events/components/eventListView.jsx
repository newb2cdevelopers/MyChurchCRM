import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from "@mui/material/TableSortLabel";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useDispatch  } from 'react-redux'
import {setSelectedEvent, selectEventDetails} from '../../../../features/events/eventsSlice';

export default function BasicTable({events, openModal}) {

    const dispatch = useDispatch();
    const [rowData, setRowData] = useState(events);
    const [orderDirection, setOrderDirection] = useState("asc");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    useEffect(()=>{
        setRowData(events);
    }, [events]);
    
    const sortArray = (arr, orderBy, columnName) => {
        switch (orderBy) {
            case "asc":
            default:
                return arr.sort((a, b) =>
                    a[columnName] > b[columnName] ? 1 : b[columnName] > a[columnName] ? -1 : 0
                );
            case "desc":
                return arr.sort((a, b) =>
                    a[columnName] < b[columnName] ? 1 : b[columnName] < a[columnName] ? -1 : 0
                );
        }
    };

    const selectEvent = (event) => {
        dispatch(
            setSelectedEvent({
                selectedEventId: event
            })
        )
    };

    const getConfirmBookings = (bookings) => {
        return bookings.filter(booking => booking.status === "Confirmado").length
    }

    const handleSortRequest = (columnName) => {
        setRowData(sortArray(rowData, orderDirection, columnName));
        setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    };

    const search = (event) => {
        openModal()
        dispatch(
            selectEventDetails({
                selectedEventDetails: event
            })
        )
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table className='eventsTable' aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" onClick={() => handleSortRequest('date')}>
                                <TableSortLabel active={true} direction={orderDirection}>
                                    Fecha
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="center" onClick={() => handleSortRequest('name')}>
                                <TableSortLabel active={true} direction={orderDirection}>
                                    Nombre
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="center" onClick={() => handleSortRequest('time')}>
                                <TableSortLabel active={true} direction={orderDirection}>
                                    Hora
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="center" onClick={() => handleSortRequest('capacity')}>
                                <TableSortLabel active={true} direction={orderDirection}>
                                    Capacidad
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center" onClick={() => handleSortRequest('capacity')}>
                                <TableSortLabel active={true} direction={orderDirection}>
                                    Resevas
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center" onClick={() => handleSortRequest('capacity')}>
                                <TableSortLabel active={true} direction={orderDirection}>
                                    % Resevas
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center" onClick={() => handleSortRequest('capacity')}>
                                <TableSortLabel active={true} direction={orderDirection}>
                                    Asistencia
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center" onClick={() => handleSortRequest('status')}>
                                <TableSortLabel active={true} direction={orderDirection}>
                                    Estado
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowData.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell component="th" scope="row" align="center">
                                    {row.date?.split("T")[0]}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.time}</TableCell>
                                <TableCell align="center">{row.capacity}</TableCell>
                                <TableCell align="center">{row.Bookings.length}</TableCell>
                                <TableCell align="center">{((row.Bookings.length / row.capacity) * 100).toFixed(2)}</TableCell>
                                <TableCell align="center">{getConfirmBookings(row.Bookings)}</TableCell>
                                <TableCell align="center">{row.status}</TableCell>
                                <TableCell align="center">
                                    <Stack spacing={1} direction="row">
                                        <div style={{"cursor": "pointer"}}>
                                            <ModeEditIcon onClick = {() => {selectEvent(row)}}></ModeEditIcon>
                                        </div>
                                        <div style={{"cursor": "pointer"}}>
                                            <FindInPageRoundedIcon onClick = {() => {search(row)}}></FindInPageRoundedIcon>
                                        </div>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}