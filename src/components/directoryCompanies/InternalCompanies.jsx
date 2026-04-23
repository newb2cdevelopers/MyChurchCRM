import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { B2C_BASE_URL } from '../../constants';
import { genericDeleteService } from '../../api/externalServices';

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
    companyPhone:
      company.phone ||
      company.Phone ||
      company.companyPhone ||
      company.CompanyPhone ||
      '',
    companyCategories: getNormalizedCategories(company),
  };
};

export default function InternalCompanies() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

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
        setError('No fue posible consultar las empresas en este momento.');
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

  const handleEdit = companyId => {
    navigate(`/company-directory/${companyId}/edit`);
  };

  const handleDelete = async companyId => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      return;
    }

    setDeleting(companyId);

    try {
      const deleteUrl = `${B2C_BASE_URL}/companyDirectories/${companyId}`;
      await genericDeleteService(deleteUrl, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Remove from UI on success
      setCompanies(previous =>
        previous.filter(company => company.id !== companyId),
      );
    } catch (deleteError) {
      console.error('Error al eliminar empresa:', deleteError);
      setError('No fue posible eliminar la empresa. Intenta de nuevo.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>Gestionar Empresas</h1>
        <p className={styles.descriptionText}>
          Administra las empresas del directorio: edita información o elimina
          empresas.
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

        {loading ? (
          <p className={styles.emptyState}>Cargando empresas...</p>
        ) : null}

        {!loading && error ? <p className={styles.errorText}>{error}</p> : null}

        {!loading && !error && filteredCompanies.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre de Empresa</th>
                  <th>Categorías</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map(company => (
                  <tr key={company.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{company.companyName}</td>
                    <td className={styles.tableCell}>
                      <div className={styles.categoriesList}>
                        {company.companyCategories.map(category => (
                          <span
                            key={`${company.id}-${category}`}
                            className={styles.categoryBadge}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {company.companyPhone || '-'}
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(company.id)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(company.id)}
                        disabled={deleting === company.id}
                        type="button"
                      >
                        {deleting === company.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!loading && !error && filteredCompanies.length === 0 ? (
          <p className={styles.emptyState}>
            No hay resultados con los filtros seleccionados.
          </p>
        ) : null}
      </section>
    </div>
  );
}
