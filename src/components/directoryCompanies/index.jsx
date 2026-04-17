import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { getCompanies } from './companyDirectoryStorage';

export default function DirectoryCompanies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const companies = getCompanies();

  const categories = useMemo(() => {
    return [
      ...new Set(companies.flatMap(company => company.companyCategories)),
    ].sort();
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesName = company.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(category =>
          company.companyCategories.includes(category),
        );

      return matchesName && matchesCategory;
    });
  }, [companies, searchTerm, selectedCategories]);

  const toggleCategory = category => {
    setSelectedCategories(previous => {
      if (previous.includes(category)) {
        return previous.filter(item => item !== category);
      }

      return [...previous, category];
    });
  };

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>Directorio de Empresas</h1>
        <p className={styles.descriptionText}>
          Consulta, filtra y explora empresas de la comunidad.
        </p>

        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar por nombre de empresa"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        </div>

        <div className={styles.filtersContainer}>
          <p className={styles.filterLabel}>Filtrar por categorías:</p>
          <div className={styles.categoriesContainer}>
            {categories.map(category => (
              <label key={category} className={styles.categoryOption}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {filteredCompanies.length > 0 ? (
          <div className={styles.grid}>
            {filteredCompanies.map(company => (
              <Link
                key={company.id}
                to={`/company-directory/${company.id}`}
                className={styles.card}
              >
                <h3 className={styles.cardTitle}>{company.companyName}</h3>
                <p className={styles.cardDescription}>
                  {company.companyDescription}
                </p>
                <div className={styles.cardTags}>
                  {company.companyCategories.map(category => (
                    <span
                      key={`${company.id}-${category}`}
                      className={styles.tag}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>
            No hay resultados con los filtros seleccionados.
          </p>
        )}
      </section>

      {/* <aside className={styles.rightMenu}>
        <h3 className={styles.menuTitle}>Opciones</h3>
        <button className={styles.menuOption} type="button">
          Directorio Empresas
        </button>
      </aside> */}
    </div>
  );
}
