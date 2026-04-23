import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { B2C_BASE_URL } from '../../constants';
import { createCompany, getCompanies } from './companyDirectoryStorage';

const defaultSocialNetworks = {
  facebook: '',
  instagram: '',
  x: '',
  tiktok: '',
  linkedin: '',
};

export default function CompanyForm() {
  const navigate = useNavigate();
  const companies = getCompanies();
  const [error, setError] = useState('');
  const [logoFileName, setLogoFileName] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    companyName: '',
    companyDescription: '',
    companyPhone: '',
    companyWebPage: '',
    companyLogo: '',
    companyCategories: [],
    companySocialNetworks: defaultSocialNetworks,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${B2C_BASE_URL}/CompanyCategories`);
        if (response.ok) {
          const data = await response.json();
          setAvailableCategories(data.sort());
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormValues(previous => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSocialNetworkChange = event => {
    const { name, value } = event.target;

    setFormValues(previous => ({
      ...previous,
      companySocialNetworks: {
        ...previous.companySocialNetworks,
        [name]: value,
      },
    }));
  };

  const handleCategoryChange = category => {
    setFormValues(previous => {
      const wasSelected = previous.companyCategories.includes(category.Id);
      return {
        ...previous,
        companyCategories: wasSelected
          ? previous.companyCategories.filter(item => item !== category.Id)
          : [...previous.companyCategories, category.Id],
      };
    });
  };

  const handleLogoChange = event => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setLogoFileName('');
      setFormValues(previous => ({
        ...previous,
        companyLogo: '',
      }));
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('El logo debe ser una imagen.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => {
      setLogoFileName(selectedFile.name);
      setError('');
      setFormValues(previous => ({
        ...previous,
        companyLogo: String(loadEvent.target?.result || ''),
      }));
    };

    reader.onerror = () => {
      setError('No fue posible leer el archivo del logo.');
      event.target.value = '';
    };

    reader.readAsDataURL(selectedFile);
  };

  const submitForm = event => {
    event.preventDefault();

    if (!formValues.companyName || !formValues.companyDescription) {
      setError('Nombre y descripción son obligatorios.');
      return;
    }

    if (formValues.companyCategories.length === 0) {
      setError('Seleccione al menos una categoría.');
      return;
    }

    setError('');

    const createdCompany = createCompany(formValues);
    navigate(`/company-directory/${createdCompany.id}`);
  };

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>Nueva Empresa</h1>
        <p className={styles.descriptionText}>
          Registra una empresa y asígnale múltiples categorías.
        </p>

        <form className={styles.form} onSubmit={submitForm}>
          <input
            className={styles.input}
            name="companyName"
            value={formValues.companyName}
            onChange={handleChange}
            placeholder="Nombre de la empresa"
          />

          <textarea
            className={styles.textarea}
            name="companyDescription"
            value={formValues.companyDescription}
            onChange={handleChange}
            placeholder="Descripción"
          />

          <div className={styles.rowTwoColumns}>
            <input
              className={styles.input}
              name="companyPhone"
              value={formValues.companyPhone}
              onChange={handleChange}
              placeholder="Teléfono"
            />
            <input
              className={styles.input}
              name="companyWebPage"
              value={formValues.companyWebPage}
              onChange={handleChange}
              placeholder="Sitio web"
            />
          </div>

          <div>
            <p className={styles.sectionTitle}>Logo de la empresa</p>
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
            {logoFileName ? (
              <p className={styles.helperText}>
                Archivo seleccionado: {logoFileName}
              </p>
            ) : null}
          </div>

          <div>
            <p className={styles.sectionTitle}>Categorías</p>
            <p className={styles.helperText}>
              Puede seleccionar varias categorías.
            </p>
            <div className={styles.categoriesContainer}>
              {availableCategories.map(category => (
                <label key={category.Id} className={styles.categoryOption}>
                  <input
                    type="checkbox"
                    checked={formValues.companyCategories.includes(category.Id)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category.Name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className={styles.sectionTitle}>Redes sociales</p>
            <div className={styles.rowTwoColumns}>
              <input
                className={styles.input}
                name="facebook"
                value={formValues.companySocialNetworks.facebook}
                onChange={handleSocialNetworkChange}
                placeholder="Facebook"
              />
              <input
                className={styles.input}
                name="instagram"
                value={formValues.companySocialNetworks.instagram}
                onChange={handleSocialNetworkChange}
                placeholder="Instagram"
              />
              <input
                className={styles.input}
                name="x"
                value={formValues.companySocialNetworks.x}
                onChange={handleSocialNetworkChange}
                placeholder="X / Twitter"
              />
              <input
                className={styles.input}
                name="tiktok"
                value={formValues.companySocialNetworks.tiktok}
                onChange={handleSocialNetworkChange}
                placeholder="TikTok"
              />
              <input
                className={styles.input}
                name="linkedin"
                value={formValues.companySocialNetworks.linkedin}
                onChange={handleSocialNetworkChange}
                placeholder="LinkedIn"
              />
            </div>
          </div>

          {error ? <p className={styles.errorText}>{error}</p> : null}

          <div className={styles.actionRow}>
            <button type="submit" className={styles.primaryButton}>
              Guardar empresa
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/dashboard')}
            >
              Regresar
            </button>
            <Link
              className={styles.primaryButton}
              to="/company-directory"
              target="_blank"
              rel="noreferrer"
            >
              Ver Directorio
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
