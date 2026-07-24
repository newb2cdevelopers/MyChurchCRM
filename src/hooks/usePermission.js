import { useSelector } from 'react-redux';

export function usePermission(route, action) {
  const { roles } = useSelector(state => state.user);

  const moduleRole = (roles || []).find(r =>
    r.accesses?.some(a => a.route === route),
  );
  const functionality = moduleRole?.accesses?.find(a => a.route === route);
  const actionObj = functionality?.actions?.find(a => a.name === action);

  return actionObj?.enabled ?? false;
}

export default usePermission;
