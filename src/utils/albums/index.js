const mapDBToModelAlbums = ({
  id, name, year, created_at, updated_at, cover_url,
}) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModelAlbums };
