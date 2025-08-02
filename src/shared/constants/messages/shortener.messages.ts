export const ShortenerMessages = {
  id: 'ID',
  userId: 'User ID',
  originalUrl: 'Original URL',
  shortUrl: 'Short URL',
  shortCode: 'ShortCode',
  clicks: 'Number of clicks',
  createdAt: 'Creation date',
  updatedAt: 'Last update date',
  deletedAt: 'Deletion date',
  listItens: 'List of shortener items',
  search:
    'Search for shortener items by partial match on shortCode or originalUrl (case-insensitive)',
  createdFrom: 'Filter by creation date (from)',
  createdTo: 'Filter by creation date (to)',
  minClicks: 'Filter by minimum clicks',
  maxClicks: 'Filter by maximum clicks',
  list: {
    summary: 'List all shortener items',
    description: 'Retrieve a paginated list of all shortened URLs',
    success: 'Shortener items found',
  },
  create: {
    summary: 'Create a new shortener item',
    description: 'Create a new short URL from the original URL',
    success: 'Shortener item created',
  },
  update: {
    summary: 'Update a shortener item',
    description: 'Update the original URL for a given shortCode',
    success: 'Shortener item updated',
  },
  delete: {
    summary: 'Delete a shortener item',
    description: 'Soft delete a shortener item by shortCode',
    success: 'Shortener item deleted',
  },
  get: {
    summary: 'Get a shortener item by shortCode',
    description: 'Returns the original URL and data for a shortCode',
    success: 'Shortener item found',
  },
  getAll: {
    summary: 'Get all shortener items by user',
    description: 'Returns all shortener items for a given user',
    success: 'Shortener items found',
  },
  redirect: {
    summary: 'Redirect to the original URL',
    description: 'Redirects to the original URL for a given shortCode',
    success: 'Redirect successful',
  },
};
