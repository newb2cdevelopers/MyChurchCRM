import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import ModuleHeader from '../shared/ModuleHeader';
import ModuleTabs from '../shared/ModuleTabs';
import ROUTE_COMPONENTS from '../../utils/moduleComponentRegistry';

function DynamicModulePage() {
  const { slug, functionalitySlug } = useParams();
  const navigate = useNavigate();
  const { roles } = useSelector(state => state.user);

  const role = (roles || []).find(r => r.accesses?.[0]?.module?.route === slug);

  if (!role) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        Módulo no encontrado
      </Box>
    );
  }

  const accesses = role.accesses || [];
  const moduleInfo = accesses[0]?.module;
  const title = moduleInfo?.name || slug;
  const description =
    moduleInfo?.description || 'Selecciona una funcionalidad para continuar.';

  const activeTab = functionalitySlug
    ? Math.max(
        0,
        accesses.findIndex(a => a.route === '/' + functionalitySlug),
      )
    : 0;

  const handleChange = (event, newValue) => {
    const route = accesses[newValue]?.route;
    if (route) {
      navigate(`/module/${slug}${route}`, { replace: true });
    }
  };

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
      <ModuleHeader title={title} description={description} />
      <ModuleTabs tabs={tabs} value={activeTab} onChange={handleChange} />
    </Box>
  );
}

export default DynamicModulePage;
