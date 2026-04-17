import mockCompanies from './mockCompanies';

const DIRECTORY_STORAGE_KEY = 'mychurchcrm_company_directory';

const getMockCompanyById = companyId => {
  return mockCompanies.find(mockCompany => mockCompany.id === companyId);
};

const normalizeCompany = (company, fallbackCompany = {}) => {
  return {
    id: company.id || fallbackCompany.id || String(Date.now()),
    companyName:
      company.companyName ||
      company.CompanyName ||
      fallbackCompany.companyName ||
      '',
    companyDescription:
      company.companyDescription ||
      company.CompanyDescription ||
      fallbackCompany.companyDescription ||
      '',
    companyCategories:
      company.companyCategories ||
      company.CompanyCategories ||
      fallbackCompany.companyCategories ||
      [],
    companyPhone:
      company.companyPhone ||
      company.CompanyPhone ||
      fallbackCompany.companyPhone ||
      '',
    companyWebPage:
      company.companyWebPage ||
      company.CompanyWebPage ||
      fallbackCompany.companyWebPage ||
      '',
    companyLogo:
      company.companyLogo ||
      company.CompanyLogo ||
      fallbackCompany.companyLogo ||
      '',
    companySocialNetworks: company.companySocialNetworks ||
      company.CompanySocialNetworks ||
      fallbackCompany.companySocialNetworks || {
        facebook: '',
        instagram: '',
        x: '',
        tiktok: '',
        linkedin: '',
      },
  };
};

const readDirectory = () => {
  const directory = window.localStorage.getItem(DIRECTORY_STORAGE_KEY);

  if (!directory) {
    window.localStorage.setItem(
      DIRECTORY_STORAGE_KEY,
      JSON.stringify(mockCompanies),
    );
    return mockCompanies;
  }

  try {
    const parsedDirectory = JSON.parse(directory);

    if (!Array.isArray(parsedDirectory)) {
      return mockCompanies.map(company => normalizeCompany(company, company));
    }

    return parsedDirectory.map(company => {
      const fallbackCompany = getMockCompanyById(company.id) || {};
      return normalizeCompany(company, fallbackCompany);
    });
  } catch {
    return mockCompanies.map(company => normalizeCompany(company, company));
  }
};

export const getCompanies = () => {
  return readDirectory();
};

export const getCompanyById = companyId => {
  return readDirectory().find(company => company.id === companyId);
};

export const createCompany = company => {
  const companies = readDirectory();
  const companyToPersist = normalizeCompany({
    ...company,
    id: String(Date.now()),
  });

  const updatedCompanies = [companyToPersist, ...companies];

  window.localStorage.setItem(
    DIRECTORY_STORAGE_KEY,
    JSON.stringify(updatedCompanies),
  );

  return companyToPersist;
};
