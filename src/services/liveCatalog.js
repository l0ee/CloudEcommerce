export function filterCatalog(products, { query = '', category = '' } = {}) {
  const search = query.trim().toLowerCase();
  const selected = category.trim().toLowerCase();
  return products.filter((product) => (
    (!search || `${product.name} ${product.description || ''}`.toLowerCase().includes(search))
    && (!selected || [product.category, product.categorySlug, product.categoryId].some((value) => String(value || '').toLowerCase() === selected))
  ));
}
