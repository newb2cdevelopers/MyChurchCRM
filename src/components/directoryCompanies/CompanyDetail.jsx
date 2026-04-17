import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { getCompanyById } from './companyDirectoryStorage';

export default function CompanyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const company = getCompanyById(id);

  if (!company) {
    return (
      <div className={styles.page}>
        <section className={styles.content}>
          <h1 className={styles.pageTitle}>Empresa no encontrada</h1>
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
        <h1 className={styles.pageTitle}>{company.companyName}</h1>

        <div className={styles.detailBlock}>
          <p className={styles.detailLabel}>Descripción</p>
          <p>{company.companyDescription}</p>
        </div>

        <div className={styles.detailBlock}>
          <p className={styles.detailLabel}>Categorías</p>
          <div className={styles.cardTags}>
            {company.companyCategories.map(category => (
              <span key={`${company.id}-${category}`} className={styles.tag}>
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.detailBlock}>
          <p className={styles.detailLabel}>Teléfono</p>
          <p>{company.companyPhone || 'No registrado'}</p>
        </div>

        <div className={styles.detailBlock}>
          <p className={styles.detailLabel}>Sitio web</p>
          {company.companyWebPage ? (
            <a href={company.companyWebPage} target="_blank" rel="noreferrer">
              {company.companyWebPage}
            </a>
          ) : (
            <p>No registrado</p>
          )}
        </div>

        <div className={styles.detailBlock}>
          <p className={styles.detailLabel}>Redes sociales</p>
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
            {Object.values(company.companySocialNetworks).every(
              value => !value,
            ) ? (
              <li>No registradas</li>
            ) : null}
          </ul>
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

      <aside className={styles.rightMenu}>
        <h3 className={styles.menuTitle}>Opciones</h3>
        <button className={styles.menuOption} type="button">
          Directorio Empresas
        </button>
      </aside>
    </div>
  );
}
