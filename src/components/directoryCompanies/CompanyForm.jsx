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
  whatsapp: '',
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
    address: '',
    website: '',
    categories: [],
    socialNetworks: defaultSocialNetworks,
  });
  const [products, setProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductImage, setNewProductImage] = useState(null);
  const [newProductPreviewUrl, setNewProductPreviewUrl] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

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
          address:
            companyPayload.address ||
            companyPayload.Address ||
            companyPayload.companyAddress ||
            companyPayload.CompanyAddress ||
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

        const existingProducts =
          companyPayload.Products || companyPayload.products || [];
        setProducts(existingProducts);
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

  const handleNewProductImageChange = event => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setNewProductImage(null);
      setNewProductPreviewUrl('');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen.');
      event.target.value = '';
      return;
    }

    if (newProductPreviewUrl) {
      URL.revokeObjectURL(newProductPreviewUrl);
    }

    setNewProductImage(selectedFile);
    setNewProductPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleAddProduct = async () => {
    if (!newProductTitle || !newProductImage) {
      toast.error('Título e imagen son obligatorios.');
      return;
    }

    if (isEditMode) {
      setIsAddingProduct(true);

      try {
        const payload = new FormData();
        payload.append('title', newProductTitle);
        payload.append('image', newProductImage);

        if (newProductDescription) {
          payload.append('description', newProductDescription);
        }

        const response = await fetch(
          `${B2C_BASE_URL}/companyDirectories/${id}/products`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            body: payload,
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.message || 'Error al agregar producto');
        }

        const updatedCompany = await response.json();
        const companyData = updatedCompany?.data || updatedCompany;

        setProducts(companyData?.Products || companyData?.products || []);
      } catch (error) {
        toast.error(error.message || 'No fue posible agregar el producto.');
        setIsAddingProduct(false);
        return;
      }
    } else {
      setPendingProducts(prev => [
        ...prev,
        {
          title: newProductTitle,
          description: newProductDescription,
          image: newProductImage,
          previewUrl: newProductPreviewUrl,
        },
      ]);
    }

    setNewProductTitle('');
    setNewProductDescription('');
    setNewProductImage(null);

    if (newProductPreviewUrl) {
      URL.revokeObjectURL(newProductPreviewUrl);
    }

    setNewProductPreviewUrl('');

    if (isEditMode) {
      setIsAddingProduct(false);
      toast.success('Producto agregado exitosamente.');
    }
  };

  const handleDeleteProduct = async index => {
    if (isEditMode) {
      setIsAddingProduct(true);

      try {
        const response = await fetch(
          `${B2C_BASE_URL}/companyDirectories/${id}/products/${index}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Error al eliminar producto');
        }

        const updatedCompany = await response.json();
        const companyData = updatedCompany?.data || updatedCompany;

        setProducts(companyData?.Products || companyData?.products || []);
        toast.success('Producto eliminado exitosamente.');
      } catch (error) {
        toast.error(error.message || 'No fue posible eliminar el producto.');
      } finally {
        setIsAddingProduct(false);
      }
    } else {
      const removed = pendingProducts[index];

      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }

      setPendingProducts(prev => prev.filter((_, i) => i !== index));
    }
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
      if (formValues.address) {
        payload.append('address', formValues.address);
      }
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
        if (!isEditMode) {
          const responseData = results[0]?.data || results[0];
          const newId = responseData?.Id || responseData?.id;

          if (newId && pendingProducts.length > 0) {
            for (const product of pendingProducts) {
              const productPayload = new FormData();
              productPayload.append('title', product.title);
              productPayload.append('image', product.image);

              if (product.description) {
                productPayload.append('description', product.description);
              }

              try {
                await fetch(
                  `${B2C_BASE_URL}/companyDirectories/${newId}/products`,
                  {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                    body: productPayload,
                  },
                );
              } catch {
                toast.warn(
                  `No se pudo subir el producto "${product.title}". Puedes agregarlo después.`,
                );
              }
            }

            setPendingProducts([]);
          }

          toast.success('Empresa guardada exitosamente.');

          if (newId) {
            navigate(`/company-directory/${newId}/edit`);
          } else {
            navigate('/company-directory/internal');
          }
        } else {
          toast.success('Empresa actualizada exitosamente.');
          navigate('/company-directory/internal');
        }
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

          <input
            className={styles.input}
            name="address"
            value={formValues.address}
            onChange={handleChange}
            placeholder="Dirección"
            disabled={isSaving || isLoadingCompany}
          />

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
              <input
                className={styles.input}
                name="whatsapp"
                value={formValues.socialNetworks.whatsapp}
                onChange={handleSocialNetworkChange}
                placeholder="WhatsApp (ej: 573001234567)"
                disabled={isSaving || isLoadingCompany}
              />
            </div>
          </div>

          <div className={styles.productSection}>
            <p className={styles.sectionTitle}>Productos destacados</p>

            {(() => {
              const displayProducts = isEditMode ? products : pendingProducts;

              return (
                <>
                  {displayProducts.length > 0 ? (
                    <div className={styles.productList}>
                      {displayProducts.map((product, index) => (
                        <div key={index} className={styles.productCard}>
                          <div className={styles.productImagePreview}>
                            <img
                              src={
                                product.ImageUrl ||
                                product.imageUrl ||
                                product.previewUrl
                              }
                              alt={product.Title || product.title}
                            />
                          </div>
                          <div className={styles.productInfo}>
                            <p className={styles.productInfoTitle}>
                              {product.Title || product.title}
                            </p>
                            {product.Description || product.description ? (
                              <p className={styles.productInfoDescription}>
                                {product.Description || product.description}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            className={styles.productDeleteButton}
                            onClick={() => handleDeleteProduct(index)}
                            disabled={isAddingProduct || isSaving}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {displayProducts.length >= 5 ? (
                    <p className={styles.productLimitMessage}>
                      Has alcanzado el límite de 5 productos
                    </p>
                  ) : (
                    <div className={styles.addProductForm}>
                      <p className={styles.helperText}>
                        Agregar nuevo producto
                      </p>

                      <div className={styles.addProductPreview}>
                        {newProductPreviewUrl ? (
                          <img
                            src={newProductPreviewUrl}
                            alt="Vista previa del producto"
                          />
                        ) : (
                          <span className={styles.addProductPreviewPlaceholder}>
                            Imagen del producto
                          </span>
                        )}
                      </div>

                      <input
                        className={styles.input}
                        type="file"
                        accept="image/*"
                        onChange={handleNewProductImageChange}
                        disabled={isAddingProduct || isSaving}
                      />

                      <input
                        className={styles.input}
                        placeholder="Título del producto"
                        value={newProductTitle}
                        onChange={e => setNewProductTitle(e.target.value)}
                        disabled={isAddingProduct || isSaving}
                      />

                      <textarea
                        className={styles.textarea}
                        placeholder="Descripción (opcional)"
                        value={newProductDescription}
                        onChange={e => setNewProductDescription(e.target.value)}
                        disabled={isAddingProduct || isSaving}
                      />

                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={handleAddProduct}
                        disabled={
                          isAddingProduct ||
                          isSaving ||
                          !newProductTitle ||
                          !newProductImage
                        }
                      >
                        {isAddingProduct ? 'Agregando...' : 'Agregar producto'}
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
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
