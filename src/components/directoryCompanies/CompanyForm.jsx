import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import BackdropLoader from '../common/backdroploader';
import styles from './styles.module.css';
import { B2C_BASE_URL } from '../../constants';
import { genericPostService } from '../../api/externalServices';

const defaultSocialNetworks = {
  facebook: '',
  instagram: '',
  x: '',
  tiktok: '',
  linkedin: '',
};

export default function CompanyForm() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [error, setError] = useState('');
  const [logoFileName, setLogoFileName] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    phone: '',
    website: '',
    categories: [],
    socialNetworks: defaultSocialNetworks,
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
      socialNetworks: {
        ...previous.socialNetworks,
        [name]: value,
      },
    }));
  };

  const handleCategoryChange = category => {
    setFormValues(previous => {
      const wasSelected = previous.categories.includes(category.Id);
      return {
        ...previous,
        categories: wasSelected
          ? previous.categories.filter(item => item !== category.Id)
          : [...previous.categories, category.Id],
      };
    });
  };

  const handleLogoChange = event => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setLogoFileName('');
      setLogoFile(null);
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('El logo debe ser una imagen.');
      setLogoFileName('');
      setLogoFile(null);
      event.target.value = '';
      return;
    }

    setLogoFileName(selectedFile.name);
    setLogoFile(selectedFile);
    setError('');
  };

  const submitForm = async event => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    if (!formValues.name || !formValues.description || !formValues.phone) {
      setError('Nombre, descripción y teléfono son obligatorios.');
      return;
    }

    if (formValues.categories.length === 0) {
      setError('Seleccione al menos una categoría.');
      return;
    }

    setError('');
    setIsSaving(true);

    // Transform social networks from {facebook: 'url', ...} to [{Name: 'Facebook', Profile: 'url'}, ...]
    const transformedSocialNetworks = Object.entries(formValues.socialNetworks)
      .filter(([_, profile]) => profile.trim() !== '')
      .map(([name, profile]) => ({
        Name: name.charAt(0).toUpperCase() + name.slice(1),
        Profile: profile,
      }));

    try {
      const payload = new FormData();
      payload.append('name', formValues.name);
      payload.append('description', formValues.description);
      payload.append('phone', formValues.phone);
      if (formValues.website) {
        payload.append('website', formValues.website);
      }
      payload.append('categories', JSON.stringify(formValues.categories));
      payload.append(
        'socialNetworks',
        JSON.stringify(transformedSocialNetworks),
      );
      payload.append('isActive', 'true');

      if (logoFile) {
        payload.append('logo', logoFile);
      }

      const results = await genericPostService(
        `${B2C_BASE_URL}/companyDirectories`,
        payload,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (results[1]) {
        // Try to parse error response
        try {
          const errorData = results[1].response?.data;
          if (errorData?.message) {
            const errorMessage = Array.isArray(errorData.message)
              ? errorData.message.join(', ')
              : errorData.message;
            toast.error(errorMessage);
          } else {
            toast.error('Se ha presentado un error al guardar la empresa.');
          }
        } catch {
          toast.error('Se ha presentado un error al guardar la empresa.');
        }
      } else {
        toast.success('Empresa guardada exitosamente.');
        navigate('/company-directory');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <BackdropLoader show={isSaving} message="Guardando cambios" />
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>Nueva Empresa</h1>
        <p className={styles.descriptionText}>
          Registra una empresa y asígnale múltiples categorías.
        </p>

        <form className={styles.form} onSubmit={submitForm}>
          <input
            className={styles.input}
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Nombre de la empresa"
            disabled={isSaving}
          />

          <textarea
            className={styles.textarea}
            name="description"
            value={formValues.description}
            onChange={handleChange}
            placeholder="Descripción"
            disabled={isSaving}
          />

          <div className={styles.rowTwoColumns}>
            <input
              className={styles.input}
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="Teléfono"
              disabled={isSaving}
            />
            <input
              className={styles.input}
              name="website"
              value={formValues.website}
              onChange={handleChange}
              placeholder="Sitio web"
              disabled={isSaving}
            />
          </div>

          <div>
            <p className={styles.sectionTitle}>Logo de la empresa</p>
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={isSaving}
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
                    checked={formValues.categories.includes(category.Id)}
                    onChange={() => handleCategoryChange(category)}
                    disabled={isSaving}
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
                value={formValues.socialNetworks.facebook}
                onChange={handleSocialNetworkChange}
                placeholder="Facebook"
                disabled={isSaving}
              />
              <input
                className={styles.input}
                name="instagram"
                value={formValues.socialNetworks.instagram}
                onChange={handleSocialNetworkChange}
                placeholder="Instagram"
                disabled={isSaving}
              />
              <input
                className={styles.input}
                name="x"
                value={formValues.socialNetworks.x}
                onChange={handleSocialNetworkChange}
                placeholder="X / Twitter"
                disabled={isSaving}
              />
              <input
                className={styles.input}
                name="tiktok"
                value={formValues.socialNetworks.tiktok}
                onChange={handleSocialNetworkChange}
                placeholder="TikTok"
                disabled={isSaving}
              />
              <input
                className={styles.input}
                name="linkedin"
                value={formValues.socialNetworks.linkedin}
                onChange={handleSocialNetworkChange}
                placeholder="LinkedIn"
                disabled={isSaving}
              />
            </div>
          </div>

          {error ? <p className={styles.errorText}>{error}</p> : null}

          <div className={styles.actionRow}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar empresa'}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/dashboard')}
              disabled={isSaving}
            >
              Regresar
            </button>
            <Link
              className={`${styles.primaryButton} ${isSaving ? styles.disabledLinkButton : ''}`}
              to="/company-directory"
              target="_blank"
              rel="noreferrer"
              aria-disabled={isSaving}
              tabIndex={isSaving ? -1 : 0}
            >
              Ver Directorio
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
