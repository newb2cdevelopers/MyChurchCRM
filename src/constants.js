// Use environment variable if available, otherwise fallback to localhost
export const B2C_BASE_URL =
  process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:4000';

// Alternative URLs commented for reference
// export const B2C_BASE_URL = "http://localhost:4000";
// export const B2C_BASE_URL = "https://mychurchcrm.azurewebsites.net/api";
// export const B2C_BASE_URL = "https://b2c-back.herokuapp.com";

export const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'RC', label: 'Registro civil' },
  { value: 'NIT', label: 'NIT' },
  { value: 'Pasaporte', label: 'Pasaporte' },
];

export const getDocumentTypeLabel = value =>
  DOCUMENT_TYPES.find(dt => dt.value === value)?.label || value;
