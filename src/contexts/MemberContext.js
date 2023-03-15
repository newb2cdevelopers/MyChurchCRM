import { createContext } from 'react';

 const MemberContext = createContext({
    areTabsDisabled: true,
    setAreTabsDisabled: () => {},
    value: 0,
    setValue: () => {},
    currentMember: null,
    setCurrentMember: () => {},
    currentMemberAcademicStudy: null,
    setCurrentMemberAcademicStudy: () => {},
    currentRelative: null,
    setCurrentRelative: () => {},
    currentMinistryStudy: null,
    setCurrentMinistryStudy: () => {},
    currentWorkFront: null,
    setCurrentWorkFront: () => {}
  });

  export default MemberContext;
  