import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
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
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState({
    companyName: '',
    companyDescription: '',
    companyPhone: '',
    companyWebPage: '',
    companyCategories: [],
    companySocialNetworks: defaultSocialNetworks,
  });

  const availableCategories = useMemo(() => {
    const existingCategories = companies.flatMap(
      company => company.companyCategories,
    );
    return [...new Set(existingCategories)].sort();
  }, [companies]);

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
      const wasSelected = previous.companyCategories.includes(category);
      return {
        ...previous,
        companyCategories: wasSelected
          ? previous.companyCategories.filter(item => item !== category)
          : [...previous.companyCategories, category],
      };
    });
  };

  const addNewCategory = () => {
    const cleanedCategory = newCategory.trim();

    if (!cleanedCategory) {
      return;
    }

    setFormValues(previous => {
      if (previous.companyCategories.includes(cleanedCategory)) {
        return previous;
      }

      return {
        ...previous,
        companyCategories: [...previous.companyCategories, cleanedCategory],
      };
    });

    setNewCategory('');
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
            <p className={styles.sectionTitle}>Categorías</p>
            <p className={styles.helperText}>
              Puede seleccionar varias categorías.
            </p>
            <div className={styles.categoriesContainer}>
              {availableCategories.map(category => (
                <label key={category} className={styles.categoryOption}>
                  <input
                    type="checkbox"
                    checked={formValues.companyCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>

            <div className={styles.actionRow} style={{ marginTop: '10px' }}>
              <input
                className={styles.input}
                value={newCategory}
                onChange={event => setNewCategory(event.target.value)}
                placeholder="Agregar categoría personalizada"
              />
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={addNewCategory}
              >
                Agregar
              </button>
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
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <aside className={styles.rightMenu}>
        <h3 className={styles.menuTitle}>Opciones</h3>
        <Link
          className={styles.menuOption}
          to="/company-directory"
          target="_blank"
          rel="noreferrer"
        >
          Directorio Empresas
        </Link>
      </aside>
    </div>
  );
}
