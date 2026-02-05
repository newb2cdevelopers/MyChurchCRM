import React, { useCallback, useEffect, useState } from 'react';
import styles from './workfrontAssignment.module.css';
import Button from '../../customComponents/button/button';
import Dropdown from '../../customComponents/dropdown/dropdown';
import { MEDIUM_GRAY, LIGTH_SEA_GREEN } from '../../styleConstanst';
import {
  genericGetService,
  getAuthHeaders,
  genericPostService,
} from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';
import { useSelector } from 'react-redux';

export default function WorkfrontAssignment() {
  const user = useSelector(state => state.user);

  const [userList, setUserList] = useState([]);
  const [frontList, setFrontlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedFront, setSelectedFront] = useState('');
  const [selectedUsers, setSelecterUsers] = useState([]);
  const [previewText, setPreviewText] = useState('');

  const getAssignmentData = useCallback(async (churchId, token) => {
    return await genericGetService(
      `${B2C_BASE_URL}/workfront/assignmentData/${churchId}`,
      getAuthHeaders(token),
    );
  }, []);

  useEffect(() => {
    // Wait until session restoration/login has populated required auth context
    if (!user.selectedChurchId || !user.token) {
      return;
    }

    let isMounted = true;

    setIsError(false);
    setIsLoading(true);

    getAssignmentData(user.selectedChurchId, user.token).then(data => {
      if (!isMounted) return;

      setIsLoading(false);
      if (data[0]) {
        setUserList(
          data[0].data.Users.map(user => {
            return {
              value: user.Id,
              label: user.Name,
            };
          }),
        );

        setFrontlist(
          data[0].data.Worfronts.map(worfront => {
            return {
              value: worfront.Id,
              label: worfront.Name,
            };
          }),
        );
        return;
      }
      setIsError(true);
    });

    return () => {
      isMounted = false;
    };
  }, [getAssignmentData, user.selectedChurchId, user.token]);

  useEffect(() => {
    if (selectedUsers.length > 0 || selectedFront !== '') {
      const previewHtml = (
        <>
          <p></p>
          <span>{selectedFront.label}</span>
          <ul>
            {selectedUsers.map((selectedUser, index) => {
              return <li key={index}>{selectedUser.label}</li>;
            })}
          </ul>
        </>
      );
      setPreviewText(previewHtml);
    } else {
      const noSelectionText = <p>Sin selección</p>;
      setPreviewText(noSelectionText);
    }
  }, [selectedUsers, selectedFront]);

  const handleClick = async () => {
    if (selectedFront && selectedUsers.length > 0) {
      const payload = {
        workfrontId: selectedFront.value,
        users: selectedUsers.map(selectedUser => {
          return selectedUser.value;
        }),
      };

      const apiResult = await genericPostService(
        `${B2C_BASE_URL}/workfront/saveAssignment`,
        payload,
      );

      if (apiResult[0]) {
        alert('Guardado existoso');

        setSelectedFront('');
        setSelecterUsers([]);

        return;
      }
      alert('Se presentó un error al guardar la asignación de frentes');
    } else {
      alert('Los datos seleccionados no son válidos');
    }
  };

  return (
    <div>
      {userList.length > 0 && frontList.length > 0 ? (
        <div>
          <h1>Asignación de Frentes</h1>
          <p> Frente al que desea asignar usuarios</p>
          <form>
            <Dropdown
              data={frontList}
              value={selectedFront}
              onchange={selectedFront => {
                setSelectedFront(selectedFront);
              }}
              multiple={false}
              placeholder="Seleccione el Frente"
              color={LIGTH_SEA_GREEN}
            />
            <Dropdown
              data={userList}
              value={selectedUsers}
              onchange={selectedUsers => {
                setSelecterUsers(selectedUsers);
              }}
              multiple={true}
              placeholder="Seleccione usuarios"
              color={LIGTH_SEA_GREEN}
            />
          </form>
          <p className={styles.preview}>Previsualización</p>
          <div className={styles.previewBox}>{previewText}</div>
          <div className={styles.buttons}>
            <Button
              buttonText="Cancelar"
              color={MEDIUM_GRAY}
              disable={false}
              onClick={() => {
                setSelectedFront('');
                setSelecterUsers([]);
              }}
            />
            <Button
              buttonText="Enviar"
              color={LIGTH_SEA_GREEN}
              disable={false}
              onClick={handleClick}
            />
          </div>
        </div>
      ) : isLoading ? (
        <div>Cargando información</div>
      ) : (
        isError && <div>Hubo un error consultando los datos</div>
      )}
    </div>
  );
}
