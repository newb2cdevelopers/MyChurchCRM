import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
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
  };
};

export default function DirectoryCompanies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${B2C_BASE_URL}/companyDirectories?isActive=true`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          throw new Error('No se pudieron cargar las empresas.');
        }

        const data = await response.json();
        const apiCompanies = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setCompanies(apiCompanies.map(normalizeCompany));
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return;
        }
        setError('No fue posible consultar el directorio en este momento.');
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();

    return () => {
      abortController.abort();
    };
  }, []);

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

  const filteredCategoriesForDropdown = useMemo(() => {
    return categories.filter(category =>
      category.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categories, categorySearch]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => {
      if (prev) {
        setCategorySearch('');
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setCategorySearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>Directorio de Empresas</h1>
        <p className={styles.descriptionText}>
          Consulta, filtra y explora empresas de la comunidad.
        </p>

        <div className={styles.searchFilterRow}>
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar por nombre de empresa"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
          </div>

          <div className={styles.filterDropdown} ref={dropdownRef}>
            <button
              type="button"
              className={styles.filterDropdownToggle}
              onClick={toggleDropdown}
            >
              <span>
                {selectedCategories.length > 0
                  ? `Categorías (${selectedCategories.length})`
                  : 'Categorías'}
              </span>
              <svg
                className={`${styles.filterDropdownArrow}${isDropdownOpen ? ` ${styles.filterDropdownArrowOpen}` : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>

            {selectedCategories.length > 0 ? (
              <div className={styles.filterDropdownChips}>
                {selectedCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    className={`${styles.categoryChip} ${styles.categoryChipActive}`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                    <svg
                      className={styles.chipCloseIcon}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : null}

            {isDropdownOpen ? (
              <div className={styles.filterDropdownMenu}>
                <input
                  className={styles.filterDropdownSearch}
                  type="text"
                  placeholder="Buscar categoría..."
                  value={categorySearch}
                  onChange={event => setCategorySearch(event.target.value)}
                  autoFocus
                />
                <div className={styles.filterDropdownList}>
                  {filteredCategoriesForDropdown.map(category => (
                    <button
                      key={category}
                      type="button"
                      className={`${styles.categoryChip}${selectedCategories.includes(category) ? ` ${styles.categoryChipActive}` : ''}`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                  {filteredCategoriesForDropdown.length === 0 ? (
                    <p className={styles.filterDropdownEmpty}>Sin resultados</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {loading ? (
          <p className={styles.emptyState}>Cargando empresas...</p>
        ) : null}

        {!loading && error ? <p className={styles.errorText}>{error}</p> : null}

        {!loading && !error && filteredCompanies.length > 0 ? (
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
        ) : null}

        {!loading && !error && filteredCompanies.length === 0 ? (
          <p className={styles.emptyState}>
            No hay resultados con los filtros seleccionados.
          </p>
        ) : null}
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
