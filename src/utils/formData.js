/**
 * Builds a FormData object for News submission.
 * @param {Object} data - The news data containing title, content, and optionally thumbnail.
 * @returns {FormData}
 */
export const buildNewsFormData = (data) => {
  const formData = new FormData();
  
  if (data.title) formData.append('title', data.title);
  if (data.content) formData.append('content', data.content);
  if (data.thumbnail instanceof File) {
    formData.append('thumbnail', data.thumbnail);
  } else if (data.thumbnail === null) {
    formData.append('remove_thumbnail', 'true');
  }

  return formData;
};

/**
 * Builds a FormData object for Product submission.
 * @param {Object} data - The product data containing name, description, price, and optionally image.
 * @returns {FormData}
 */
export const buildProductFormData = (data) => {
  const formData = new FormData();
  
  if (data.name) formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.price) formData.append('price', data.price);
  if (data.image instanceof File) {
    formData.append('image', data.image);
  } else if (data.image === null) {
    formData.append('remove_image', 'true');
  }

  return formData;
};
