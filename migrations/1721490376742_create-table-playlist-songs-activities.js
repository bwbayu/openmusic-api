exports.up = (pgm) => {
  pgm.createTable('playlist_songs_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'TEXT',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMP',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.addConstraint(
    'playlist_songs_activities',
    'fk_playlist_songs_activities.playlist_id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs_activities');
};
