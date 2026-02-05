import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelector } from 'react-redux';
import './toolTip.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import FamilyGroupForm from './familyGroupForm/familyGroupForm';
import FamilyGroupAttendeeList from '../components/familyGroupAttendee/familyGroupAttendeeList';
import FamilyGroupAttendanceList from '../components/familyGroupAttendee/familyGroupAttendanceList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function FamilyGroupList() {
  const [open, setOpen] = useState(false);
  const [, setIsUpdateRequired] = useState(false);
  const [familyGroups, setFamilyGroups] = useState([]);
  const [familyGroupsList, setFamilyGroupsList] = useState([]);
  const user = useSelector(state => state.user);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemToView, setSelectedItemToView] = useState(null);
  const [value, setValue] = useState(0);
  const [showFamilyGroupsAttendee, setShowFamilyGroupsAttendee] =
    useState(true);
  const [showAttendance, setShowAttendance] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setSelectedItem(null);
    setIsUpdateRequired(false);
    setOpen(true);
  };

  // Navigation is handled by rendering tabs/components; the URL does not change.

  useEffect(() => {
    const fetchFamilyGroups = async () => {
      const headers = getAuthHeaders(user.token);
      return await genericGetService(`${B2C_BASE_URL}/familyGroup`, headers);
    };

    fetchFamilyGroups().then(data => {

      if (data[0] && data[0].length > 0) {
        setFamilyGroups(data[0]);
        setFamilyGroupsList(data[0]);
        return;
      }
      alert('Error');
    });
  }, [open, user.token]);

  useEffect(() => {
    setShowFamilyGroupsAttendee(value === 0 ? true : false);
    setShowAttendance(value === 1 ? true : false);
  }, [value]);

  const selectedFamilyGroupToEdit = _code => {
    let _selectedFamilyGroup = familyGroups.filter(familyGroup => {
      return familyGroup.code === _code;
    });

    setSelectedItem(_selectedFamilyGroup[0]);
    setIsUpdateRequired(true);
    setOpen(true);
  };

  const selectedFamilyGroupToView = _code => {
    let _selectedFamilyGroup = familyGroups.filter(familyGroup => {
      return familyGroup.code === _code;
    });

    setSelectedItemToView(_selectedFamilyGroup[0]);
  };

  const searchFamilyGroup = code => {
    setSelectedItemToView(null);

    if (code !== '' && code.length >= 3) {
      let _filteredFamilyGroups = familyGroups.filter(familyGroup => {
        return familyGroup.code.toString().indexOf(code) >= 0;
      });

      if (_filteredFamilyGroups && _filteredFamilyGroups.length > 0) {
        setFamilyGroupsList(_filteredFamilyGroups);
      } else {
        setFamilyGroupsList(familyGroups);
      }
    } else {
      setFamilyGroupsList(familyGroups);
    }
  };

  return (
    <div className={styles.MainContainer}>
      <h1>Administrar grupos familiares</h1>
      <div>
        <div style={{ display: 'inline-block' }}>
          <div>
            <div className="input-group flex-nowrap input-group-sm mb-3">
              <span
                className="input-group-text"
                id="inputGroup-sizing-sm"
                style={{ fontWeight: '700' }}
              >
                Buscar por código del grupo familiar:
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese el código"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                onChange={e => {
                  searchFamilyGroup(e.target.value);
                }}
              />
            </div>
            <span style={{ fontWeight: '700' }}>
              <p style={{ marginRight: '300px' }}>
                Cantidad de registros: {familyGroupsList.length}
              </p>
            </span>
          </div>
          <div>
            <div>
              <div
                className={styles.createNewContainer}
                onClick={() => handleOpen()}
              >
                <AddCircleIcon
                  style={{ height: '40px', width: '40px' }}
                ></AddCircleIcon>
              </div>
            </div>
          </div>
        </div>
        <div className={`table-responsive-lg`}>
          <table
            className={`${styles.table} table table-striped table-hover table-dark table-borderless`}
          >
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Código</th>
                <th>Líder principal</th>
                <th>Dirección</th>
                <th>Barrio</th>
                <th>Zona</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Celular / Teléfono</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {familyGroupsList && familyGroupsList.length > 0 ? (
                familyGroupsList.map((familyGroup, index) => {
                  return (
                    <tr key={familyGroup._id || familyGroup.code || index}>
                      <td>
                        <div>
                          <div
                            style={{
                              cursor: 'pointer',
                              display: 'inline-block',
                              position: 'relative',
                              right: '10px',
                              paddingLeft: '10px',
                            }}
                            onClick={e => {
                              selectedFamilyGroupToEdit(familyGroup.code);
                            }}
                          >
                            <ModeEditIcon />
                          </div>
                          <div
                            alt="Ver detalles"
                            style={{
                              cursor: 'pointer',
                              display: 'inline-block',
                            }}
                            onClick={e => {
                              selectedFamilyGroupToView(familyGroup.code);
                            }}
                          >
                            <VisibilityIcon />
                          </div>
                        </div>
                      </td>
                      <td>{familyGroup.code}</td>
                      <td>{familyGroup.leader?.fullName.toUpperCase()}</td>
                      <td>{familyGroup.address}</td>
                      <td>{familyGroup.neighborhood?.name}</td>
                      <td>{familyGroup.neighborhood?.name}</td>
                      <td>{familyGroup.day}</td>
                      <td>{familyGroup.time}</td>
                      <td>{familyGroup.leader?.mobilePhone}</td>
                      <td
                        style={{
                          color:
                            familyGroup.status === 'Activo'
                              ? '#2cf72c'
                              : familyGroup.status === 'Suspendido'
                                ? 'orange'
                                : 'red',
                        }}
                      >
                        {familyGroup.status}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td style={{ textAlign: 'center' }}>Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <FamilyGroupForm
        open={open}
        setOpen={setOpen}
        selectedItem={selectedItem}
      />
      {selectedItemToView !== null ? (
        <div>
          <br />
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable force tabs example"
              className={styles.tabDetailsContainer}
            >
              <Tab
                label="INTENGRANTES DEL GRUPO FAMILIAR"
                className={styles.tabs}
                style={{ borderRadius: ' 4px 0px 0px 4px' }}
              />
              <Tab
                label="ASISTENCIAS AL GRUPO FAMILIAR"
                className={styles.tabs}
                style={{ borderRadius: '0px 4px 4px 0px' }}
              />
            </Tabs>
            <div>
              {showFamilyGroupsAttendee ? (
                <div>
                  <br />
                  <h1>Integrantes del grupo familiar</h1>
                  <FamilyGroupAttendeeList
                    perfil={'coordinator'}
                    familyGroupId={selectedItemToView?._id}
                  />
                </div>
              ) : showAttendance ? (
                <div>
                  <br />
                  <h1>Reporte de Asistencia al gurpo familiar</h1>
                  <FamilyGroupAttendanceList
                    perfil={'coordinator'}
                    familyGroupId={selectedItemToView?._id}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </Box>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
