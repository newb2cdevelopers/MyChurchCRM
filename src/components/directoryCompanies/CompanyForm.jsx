import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import BackdropLoader from '../common/backdroploader';
import styles from './styles.module.css';
import { B2C_BASE_URL } from '../../constants';
import {
  genericPostService,
  genericPutService,
} from '../../api/externalServices';

const defaultSocialNetworks = {
  facebook: '',
  instagram: '',
  x: '',
  tiktok: '',
  linkedin: '',
};

const normalizeSocialNetworks = rawSocialNetworks => {
  if (!rawSocialNetworks) {
    return { ...defaultSocialNetworks };
  }

  if (typeof rawSocialNetworks === 'string') {
    try {
      const parsedNetworks = JSON.parse(rawSocialNetworks);
      return normalizeSocialNetworks(parsedNetworks);
    } catch {
      return { ...defaultSocialNetworks };
    }
  }

  if (Array.isArray(rawSocialNetworks)) {
    const arrayAsObject = rawSocialNetworks.reduce((accumulator, item) => {
      const key = String(item?.name || item?.Name || '').toLowerCase();
      const value = item?.profile || item?.Profile || '';

      if (key) {
        accumulator[key] = value;
      }

      return accumulator;
    }, {});

    return {
      ...defaultSocialNetworks,
      ...arrayAsObject,
    };
  }

  if (typeof rawSocialNetworks === 'object') {
    return {
      ...defaultSocialNetworks,
      ...rawSocialNetworks,
    };
  }

  return { ...defaultSocialNetworks };
};

const normalizeCategoryId = category => {
  if (!category) {
    return null;
  }

  if (typeof category === 'string' || typeof category === 'number') {
    return category;
  }

  return (
    category.Id ||
    category.id ||
    category.categoryId ||
    category.CategoryId ||
    null
  );
};

export default function CompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const user = useSelector(state => state.user);
  const [error, setError] = useState('');
  const [logoFileName, setLogoFileName] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState('');
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
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

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const abortController = new AbortController();

    const fetchCompany = async () => {
      try {
        setIsLoadingCompany(true);

        const response = await fetch(
          `${B2C_BASE_URL}/companyDirectories/${id}`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          throw new Error('No se pudo cargar la empresa para edición.');
        }

        const data = await response.json();
        const companyPayload =
          data?.data && typeof data.data === 'object' ? data.data : data;

        const rawCategories =
          companyPayload.categories ||
          companyPayload.Categories ||
          companyPayload.companyCategories ||
          companyPayload.CompanyCategories ||
          [];

        let categoryIds = [];

        if (typeof rawCategories === 'string') {
          try {
            const parsedCategories = JSON.parse(rawCategories);
            categoryIds = Array.isArray(parsedCategories)
              ? parsedCategories.map(normalizeCategoryId).filter(Boolean)
              : [];
          } catch {
            categoryIds = [];
          }
        } else if (Array.isArray(rawCategories)) {
          categoryIds = rawCategories.map(normalizeCategoryId).filter(Boolean);
        }

        const rawSocialNetworks =
          companyPayload.socialNetworks ||
          companyPayload.SocialNetworks ||
          companyPayload.companySocialNetworks ||
          companyPayload.CompanySocialNetworks ||
          defaultSocialNetworks;

        setFormValues({
          name:
            companyPayload.name ||
            companyPayload.Name ||
            companyPayload.companyName ||
            companyPayload.CompanyName ||
            '',
          description:
            companyPayload.description ||
            companyPayload.Description ||
            companyPayload.companyDescription ||
            companyPayload.CompanyDescription ||
            '',
          phone:
            companyPayload.phone ||
            companyPayload.Phone ||
            companyPayload.companyPhone ||
            companyPayload.CompanyPhone ||
            '',
          website:
            companyPayload.website ||
            companyPayload.Website ||
            companyPayload.companyWebPage ||
            companyPayload.CompanyWebPage ||
            '',
          categories: categoryIds,
          socialNetworks: normalizeSocialNetworks(rawSocialNetworks),
        });

        const existingLogoUrl =
          companyPayload.logoUrl ||
          companyPayload.LogoUrl ||
          companyPayload.companyLogo ||
          companyPayload.CompanyLogo ||
          '';

        setCurrentLogoUrl(existingLogoUrl);

        if (existingLogoUrl) {
          setLogoFileName('Logo actual cargado');
        }
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return;
        }
        toast.error('No fue posible cargar la empresa para editar.');
        navigate('/company-directory/internal');
      } finally {
        setIsLoadingCompany(false);
      }
    };

    fetchCompany();

    return () => {
      abortController.abort();
    };
  }, [id, isEditMode, navigate]);

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

    if (isSaving || isLoadingCompany) {
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

      const requestUrl = isEditMode
        ? `${B2C_BASE_URL}/companyDirectories/${id}`
        : `${B2C_BASE_URL}/companyDirectories`;

      const requestMethod = isEditMode ? genericPutService : genericPostService;

      const results = await requestMethod(requestUrl, payload, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

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
        toast.success(
          isEditMode
            ? 'Empresa actualizada exitosamente.'
            : 'Empresa guardada exitosamente.',
        );
        navigate('/company-directory/internal');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <BackdropLoader
        show={isSaving || isLoadingCompany}
        message={isLoadingCompany ? 'Cargando empresa' : 'Guardando cambios'}
      />
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>
          {isEditMode ? 'Editar Empresa' : 'Nueva Empresa'}
        </h1>
        <p className={styles.descriptionText}>
          {isEditMode
            ? 'Actualiza la información de la empresa.'
            : 'Registra una empresa y asígnale múltiples categorías.'}
        </p>

        <form className={styles.form} onSubmit={submitForm}>
          <input
            className={styles.input}
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Nombre de la empresa"
            disabled={isSaving || isLoadingCompany}
          />

          <textarea
            className={styles.textarea}
            name="description"
            value={formValues.description}
            onChange={handleChange}
            placeholder="Descripción"
            disabled={isSaving || isLoadingCompany}
          />

          <div className={styles.rowTwoColumns}>
            <input
              className={styles.input}
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="Teléfono"
              disabled={isSaving || isLoadingCompany}
            />
            <input
              className={styles.input}
              name="website"
              value={formValues.website}
              onChange={handleChange}
              placeholder="Sitio web"
              disabled={isSaving || isLoadingCompany}
            />
          </div>

          <div>
            <p className={styles.sectionTitle}>Logo de la empresa</p>
            {isEditMode && currentLogoUrl ? (
              <div className={styles.detailHeader}>
                <img
                  className={styles.companyLogo}
                  src={currentLogoUrl}
                  alt={`Logo de ${formValues.name || 'la empresa'}`}
                />
              </div>
            ) : null}
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={isSaving || isLoadingCompany}
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
                    disabled={isSaving || isLoadingCompany}
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
                disabled={isSaving || isLoadingCompany}
              />
              <input
                className={styles.input}
                name="instagram"
                value={formValues.socialNetworks.instagram}
                onChange={handleSocialNetworkChange}
                placeholder="Instagram"
                disabled={isSaving || isLoadingCompany}
              />
              <input
                className={styles.input}
                name="x"
                value={formValues.socialNetworks.x}
                onChange={handleSocialNetworkChange}
                placeholder="X / Twitter"
                disabled={isSaving || isLoadingCompany}
              />
              <input
                className={styles.input}
                name="tiktok"
                value={formValues.socialNetworks.tiktok}
                onChange={handleSocialNetworkChange}
                placeholder="TikTok"
                disabled={isSaving || isLoadingCompany}
              />
              <input
                className={styles.input}
                name="linkedin"
                value={formValues.socialNetworks.linkedin}
                onChange={handleSocialNetworkChange}
                placeholder="LinkedIn"
                disabled={isSaving || isLoadingCompany}
              />
            </div>
          </div>

          {error ? <p className={styles.errorText}>{error}</p> : null}

          <div className={styles.actionRow}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSaving || isLoadingCompany}
            >
              {isSaving ? 'Guardando...' : 'Guardar empresa'}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/dashboard')}
              disabled={isSaving || isLoadingCompany}
            >
              Regresar
            </button>
            <Link
              className={`${styles.primaryButton} ${isSaving || isLoadingCompany ? styles.disabledLinkButton : ''}`}
              to="/company-directory/internal"
              aria-disabled={isSaving || isLoadingCompany}
              tabIndex={isSaving || isLoadingCompany ? -1 : 0}
            >
              Administrar Directorio
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
