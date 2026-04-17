import mockCompanies from './mockCompanies';

const DIRECTORY_STORAGE_KEY = 'mychurchcrm_company_directory';

const normalizeCompany = company => {
  return {
    id: company.id || String(Date.now()),
    companyName: company.companyName || company.CompanyName || '',
    companyDescription:
      company.companyDescription || company.CompanyDescription || '',
    companyCategories:
      company.companyCategories || company.CompanyCategories || [],
    companyPhone: company.companyPhone || company.CompanyPhone || '',
    companyWebPage: company.companyWebPage || company.CompanyWebPage || '',
    companySocialNetworks: company.companySocialNetworks ||
      company.CompanySocialNetworks || {
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
      return mockCompanies;
    }

    return parsedDirectory.map(normalizeCompany);
  } catch {
    return mockCompanies;
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
