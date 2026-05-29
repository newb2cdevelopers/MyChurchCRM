import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import StepperModal from '../StepperModal';
import {
  genericPostService,
  genericPutService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import GeneralInfoStep from './GeneralInfoStep';
import FamilyStep from './FamilyStep';
import AcademicStep from './AcademicStep';
import MinistryStep from './MinistryStep';

export default function CreateMemberStepper({
  open,
  onClose,
  onSuccess,
  initialData,
}) {
  const user = useSelector(state => state.user);
  const generalStepRef = useRef(null);
  const familyStepRef = useRef(null);
  const academicStepRef = useRef(null);
  const ministryStepRef = useRef(null);
  const isEditing = Boolean(initialData);
  const [memberId, setMemberId] = useState(initialData?._id || null);

  useEffect(() => {
    setMemberId(initialData?._id || null);
  }, [initialData]);
  const dataChangedRef = useRef(false);

  const onSaved = useCallback(() => {
    dataChangedRef.current = true;
  }, []);

  const handleClose = useCallback(() => {
    if (dataChangedRef.current) {
      dataChangedRef.current = false;
      onSuccess?.();
    }
    onClose?.();
  }, [onSuccess, onClose]);

  const steps = [
    {
      id: 'general',
      title: 'Información General',
      description: 'Datos personales y de identificación',
      content: (
        <GeneralInfoStep ref={generalStepRef} initialData={initialData} />
      ),
    },
    {
      id: 'family',
      title: 'Información Familiar',
      description: 'Familiares del miembro',
      content: (
        <FamilyStep
          ref={familyStepRef}
          initialItems={initialData?.relatives}
          memberId={memberId}
          token={user.token}
          onSaved={onSaved}
        />
      ),
    },
    {
      id: 'studies',
      title: 'Estudios',
      description: 'Estudios y formaciones académicas',
      content: (
        <AcademicStep
          ref={academicStepRef}
          initialItems={initialData?.additionalAcademicStudies}
          memberId={memberId}
          token={user.token}
          onSaved={onSaved}
        />
      ),
    },
    {
      id: 'ministry',
      title: 'Formación Ministerial',
      description: 'Capacitación y formación ministerial',
      content: (
        <MinistryStep
          ref={ministryStepRef}
          initialItems={initialData?.ministryStudies}
          memberId={memberId}
          token={user.token}
          onSaved={onSaved}
        />
      ),
    },
  ];

  const handleStepSubmit = useCallback(
    async (stepIndex, accData) => {
      const headers = getAuthHeaders(user.token);

      if (stepIndex === 0) {
        if (isEditing && !generalStepRef.current?.isDirty?.()) {
          return { memberId: initialData._id };
        }

        const data = generalStepRef.current?.getData?.();
        if (!data) throw new Error('Validation failed');

        if (isEditing) {
          const results = await genericPutService(
            `${B2C_BASE_URL}/member/updateMemberInfo/${initialData._id}`,
            data,
            headers,
          );
          if (results[1]) throw new Error('Error al actualizar el miembro');
          if (!results[0]?.isSuccessful)
            throw new Error(
              results[0]?.message || 'Error al actualizar el miembro',
            );
          setMemberId(initialData._id);
          dataChangedRef.current = true;
          return { memberId: initialData._id };
        }

        const results = await genericPostService(
          `${B2C_BASE_URL}/member`,
          data,
          headers,
        );
        if (results[1]) throw new Error('Error al crear el miembro');
        if (!results[0]?.isSuccessful)
          throw new Error(results[0]?.message || 'Error al crear el miembro');
        const newId = results[0].data._id;
        setMemberId(newId);
        dataChangedRef.current = true;
        return { memberId: newId };
      }

      return {};
    },
    [user.token, isEditing, initialData],
  );

  const handleStepClick = useCallback(
    async (currentIndex, targetIndex) => {
      if (currentIndex === targetIndex) return true;

      if (!isEditing && !memberId && targetIndex > 0) return false;

      if (currentIndex === 0 && generalStepRef.current?.isDirty?.()) {
        const data = generalStepRef.current?.getData?.();
        if (!data) return false;

        const headers = getAuthHeaders(user.token);
        if (memberId) {
          const results = await genericPutService(
            `${B2C_BASE_URL}/member/updateMemberInfo/${memberId}`,
            data,
            headers,
          );
          if (results[1] || !results[0]?.isSuccessful) return false;
        } else {
          const results = await genericPostService(
            `${B2C_BASE_URL}/member`,
            data,
            headers,
          );
          if (results[1] || !results[0]?.isSuccessful) return false;
          setMemberId(results[0].data._id);
        }
        dataChangedRef.current = true;
      }

      return true;
    },
    [isEditing, memberId, user.token],
  );

  const handleFinish = useCallback(async () => {
    dataChangedRef.current = false;
    onSuccess?.();
  }, [onSuccess]);

  return (
    <StepperModal
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar miembro' : 'Nuevo miembro'}
      description={
        isEditing
          ? 'Actualice la información del miembro'
          : 'Complete el proceso de registro'
      }
      steps={steps}
      onStepSubmit={handleStepSubmit}
      onStepClick={handleStepClick}
      onFinish={handleFinish}
    />
  );
}
