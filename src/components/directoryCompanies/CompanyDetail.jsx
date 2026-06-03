import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

const getSocialIcon = network => {
  const props = { viewBox: '0 0 24 24' };

  switch (network) {
    case 'facebook':
      return (
        <svg {...props}>
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...props}>
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
      );
    case 'x':
      return (
        <svg {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...props}>
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...props}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...props}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
  }
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
    whatsapp: '',
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
    companyAddress:
      company.address ||
      company.Address ||
      company.companyAddress ||
      company.CompanyAddress ||
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
  const [expanded, setExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const [descriptionOverflows, setDescriptionOverflows] = useState(false);

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

        // Fire-and-forget: record visit without blocking the render.
        fetch(`${B2C_BASE_URL}/companyDirectories/${id}/register-view`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
        }).catch(() => {
          // Do not interrupt the user experience if the visit registration fails.
        });

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

  useLayoutEffect(() => {
    const el = descriptionRef.current;

    if (!el) {
      return;
    }

    const originalDisplay = el.style.display;
    const originalWebkitLineClamp = el.style.webkitLineClamp;

    el.style.display = 'block';
    el.style.webkitLineClamp = 'unset';
    const fullHeight = el.scrollHeight;

    el.style.display = originalDisplay;
    el.style.webkitLineClamp = originalWebkitLineClamp;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;

    setDescriptionOverflows(fullHeight > lineHeight * 4);
    setExpanded(false);
  }, [company, loading]);

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
          <p
            ref={descriptionRef}
            className={`${styles.descriptionText}${!expanded ? ` ${styles.clampedDescription}` : ''}`}
          >
            {company.companyDescription}
          </p>
          {descriptionOverflows ? (
            <button
              type="button"
              className={styles.toggleDescriptionButton}
              onClick={() => setExpanded(previous => !previous)}
            >
              {expanded ? 'Ver menos' : 'Ver más'}
            </button>
          ) : null}
        </div>

        <div className={styles.detailGrid}>
          <section className={styles.infoCard}>
            <p className={styles.detailLabel}>Información de contacto</p>
            <p className={styles.infoText}>
              {company.companyPhone || 'No registrado'}
            </p>
            {company.companyAddress ? (
              <>
                <p className={styles.detailLabel}>Dirección</p>
                <p className={styles.infoText}>{company.companyAddress}</p>
              </>
            ) : null}
          </section>

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
        </div>

        <div className={styles.detailGridSocial}>
          <section className={styles.infoCard}>
            <p className={styles.detailLabel}>Redes Sociales</p>

            <div className={styles.socialLinksGroup}>
              <p className={styles.infoSubLabel}>Sitio web</p>
              {company.companyWebPage ? (
                <a
                  className={styles.detailLink}
                  href={company.companyWebPage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.companyWebPage}
                </a>
              ) : (
                <p className={styles.infoText}>No registrado</p>
              )}
            </div>

            <div className={styles.socialLinksGroup}>
              <p className={styles.infoSubLabel}>Redes sociales</p>
              {hasSocialNetworks ? (
                <div className={styles.socialIconsRow}>
                  {Object.entries(company.companySocialNetworks)
                    .filter(([, value]) => !!value)
                    .map(([network, value]) => {
                      if (network === 'whatsapp') {
                        const number = value.replace(/[^0-9]/g, '');
                        return (
                          <div key={network} className={styles.socialItem}>
                            <a
                              href={`https://wa.me/${number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.socialIconLink}
                            >
                              {getSocialIcon(network)}
                            </a>
                            <span className={styles.socialItemName}>
                              {network}
                            </span>
                            <span className={styles.socialItemValue}>
                              {number}
                            </span>
                          </div>
                        );
                      }

                      const isUrl =
                        value.startsWith('http://') ||
                        value.startsWith('https://');

                      return (
                        <div key={network} className={styles.socialItem}>
                          {isUrl ? (
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.socialIconLink}
                            >
                              {getSocialIcon(network)}
                            </a>
                          ) : (
                            <span className={styles.socialIconLink}>
                              {getSocialIcon(network)}
                            </span>
                          )}
                          <span className={styles.socialItemName}>
                            {network}
                          </span>
                          <span
                            className={`${styles.socialItemValue} ${isUrl ? '' : styles.socialItemValuePlain}`}
                          >
                            {value}
                          </span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className={styles.infoText}>No registradas</p>
              )}
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
