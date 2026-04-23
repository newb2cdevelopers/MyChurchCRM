import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { B2C_BASE_URL } from '../../constants';

const parseCategoryName = category => {
  if (!category) {
    return null;
  }

  if (typeof category === 'string') {
    return category;
  }

  return (
    category.name ||
    category.Name ||
    category.categoryName ||
    category.CategoryName ||
    null
  );
};

const getNormalizedCategories = company => {
  const rawCategories =
    company.categories ||
    company.Categories ||
    company.companyCategories ||
    company.CompanyCategories ||
    [];

  if (typeof rawCategories === 'string') {
    try {
      const parsedCategories = JSON.parse(rawCategories);
      if (Array.isArray(parsedCategories)) {
        return parsedCategories.map(parseCategoryName).filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  }

  if (!Array.isArray(rawCategories)) {
    return [];
  }

  return rawCategories.map(parseCategoryName).filter(Boolean);
};

const normalizeSocialNetworks = company => {
  const rawSocialNetworks =
    company.socialNetworks ||
    company.SocialNetworks ||
    company.companySocialNetworks ||
    company.CompanySocialNetworks ||
    {};

  const defaultNetworks = {
    facebook: '',
    instagram: '',
    x: '',
    tiktok: '',
    linkedin: '',
  };

  if (typeof rawSocialNetworks === 'string') {
    try {
      const parsedNetworks = JSON.parse(rawSocialNetworks);
      if (Array.isArray(parsedNetworks)) {
        const arrayAsObject = parsedNetworks.reduce((accumulator, item) => {
          const key = String(item?.name || item?.Name || '').toLowerCase();
          const value = item?.profile || item?.Profile || '';

          if (key) {
            accumulator[key] = value;
          }

          return accumulator;
        }, {});

        return {
          ...defaultNetworks,
          ...arrayAsObject,
        };
      }

      if (parsedNetworks && typeof parsedNetworks === 'object') {
        return {
          ...defaultNetworks,
          ...parsedNetworks,
        };
      }
    } catch {
      return defaultNetworks;
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
      ...defaultNetworks,
      ...arrayAsObject,
    };
  }

  if (rawSocialNetworks && typeof rawSocialNetworks === 'object') {
    return {
      ...defaultNetworks,
      ...rawSocialNetworks,
    };
  }

  return defaultNetworks;
};

const normalizeCompany = company => {
  return {
    id: String(
      company.id ||
        company.Id ||
        company.companyDirectoryId ||
        company.CompanyDirectoryId ||
        Date.now(),
    ),
    companyName:
      company.name ||
      company.Name ||
      company.companyName ||
      company.CompanyName ||
      '',
    companyDescription:
      company.description ||
      company.Description ||
      company.companyDescription ||
      company.CompanyDescription ||
      '',
    companyCategories: getNormalizedCategories(company),
    companyPhone:
      company.phone ||
      company.Phone ||
      company.companyPhone ||
      company.CompanyPhone ||
      '',
    companyWebPage:
      company.website ||
      company.Website ||
      company.companyWebPage ||
      company.CompanyWebPage ||
      '',
    companyLogo:
      company.logoUrl ||
      company.LogoUrl ||
      company.logo ||
      company.Logo ||
      company.companyLogo ||
      company.CompanyLogo ||
      '',
    companySocialNetworks: normalizeSocialNetworks(company),
  };
};

export default function CompanyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Empresa no encontrada');
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    const loadCompany = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${B2C_BASE_URL}/companyDirectories/${id}`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          if (response.status === 404) {
            setCompany(null);
            setError('Empresa no encontrada');
            return;
          }
          throw new Error('No se pudo consultar la empresa.');
        }

        const data = await response.json();
        const companyPayload =
          data?.data && typeof data.data === 'object' ? data.data : data;

        setCompany(normalizeCompany(companyPayload));
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return;
        }
        setCompany(null);
        setError('No fue posible consultar la empresa en este momento.');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();

    return () => {
      abortController.abort();
    };
  }, [id]);

  const hasSocialNetworks = useMemo(() => {
    if (!company) {
      return false;
    }

    return Object.values(company.companySocialNetworks).some(value => !!value);
  }, [company]);

  if (loading) {
    return (
      <div className={styles.page}>
        <section className={styles.content}>
          <p className={styles.emptyState}>Cargando empresa...</p>
        </section>
      </div>
    );
  }

  if (!company || error) {
    return (
      <div className={styles.page}>
        <section className={styles.content}>
          <h1 className={styles.pageTitle}>Empresa no encontrada</h1>
          {error ? <p className={styles.errorText}>{error}</p> : null}
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => navigate('/company-directory')}
          >
            Volver al directorio
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <div className={styles.detailHeader}>
          {company.companyLogo ? (
            <img
              className={styles.companyLogo}
              src={company.companyLogo}
              alt={`Logo de ${company.companyName}`}
            />
          ) : (
            <div className={styles.emptyLogoState}>No hay logo registrado</div>
          )}

          <div>
            <h1 className={styles.pageTitle}>{company.companyName}</h1>
          </div>
        </div>

        <div className={styles.detailBlock}>
          <p className={styles.detailLabel}>Descripción</p>
          <p>{company.companyDescription}</p>
        </div>

        <div className={styles.detailGrid}>
          <section className={styles.infoCard}>
            <p className={styles.detailLabel}>Categorías</p>
            <div className={styles.cardTags}>
              {company.companyCategories.map(category => (
                <span key={`${company.id}-${category}`} className={styles.tag}>
                  {category}
                </span>
              ))}
            </div>
          </section>

          <section className={styles.infoCard}>
            <p className={styles.detailLabel}>Información de contacto</p>
            <p className={styles.infoText}>
              {company.companyPhone || 'No registrado'}
            </p>
          </section>

          <section className={styles.infoCard}>
            <p className={styles.detailLabel}>Redes Sociales</p>

            <div className={styles.socialLinksGroup}>
              <p className={styles.infoSubLabel}>Sitio web</p>
              {company.companyWebPage ? (
                <a
                  className={styles.detailLink}
                  href={company.companyWebPage}
                  target="_blank"
                  rel="noreferrer"
                >
                  {company.companyWebPage}
                </a>
              ) : (
                <p className={styles.infoText}>No registrado</p>
              )}
            </div>

            <div className={styles.socialLinksGroup}>
              <p className={styles.infoSubLabel}>Redes sociales</p>
              <ul className={styles.socialList}>
                {Object.entries(company.companySocialNetworks)
                  .filter(([, value]) => !!value)
                  .map(([network, value]) => (
                    <li key={network}>
                      <strong>{network}: </strong>
                      <a href={value} target="_blank" rel="noreferrer">
                        {value}
                      </a>
                    </li>
                  ))}
                {!hasSocialNetworks ? <li>No registradas</li> : null}
              </ul>
            </div>
          </section>
        </div>

        <div className={styles.actionRow}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => navigate('/company-directory')}
          >
            Volver
          </button>
        </div>
      </section>
    </div>
  );
}
