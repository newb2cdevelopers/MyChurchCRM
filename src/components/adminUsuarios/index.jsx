import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import ModuleHeader from '../shared/ModuleHeader';
import ModuleTabs from '../shared/ModuleTabs';
import ROUTE_COMPONENTS from '../../utils/moduleComponentRegistry';

const MODULE_NAME = 'Administrar Usuarios';

function AdminUsuarios() {
  const { roles } = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const moduleRole = (roles || []).find(r => r.module === MODULE_NAME);
  const accesses = moduleRole?.accesses || [];

  const tabs = accesses.map(acc => {
    const Component = ROUTE_COMPONENTS[acc.route];
    return {
      label: acc.name,
      content: Component ? (
        <Component hideHeader />
      ) : (
        <Box sx={{ p: 4, color: 'text.secondary' }}>
          Funcionalidad no disponible
        </Box>
      ),
    };
  });

  return (
    <Box>
      <ModuleHeader
        title={MODULE_NAME}
        description="Gestión de usuarios, roles y asignación de frentes de trabajo"
      />
      <ModuleTabs tabs={tabs} value={activeTab} onChange={handleChange} />
    </Box>
  );
}

export default AdminUsuarios;
