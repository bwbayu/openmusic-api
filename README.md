# openmusic-api
submission dicoding

# install package global
npm install @hapi/hapi dotenv joi nanoid node-pg-migrate pg auto-bind@4 bcrypt @hapi/jwt

# install package development
npm install nodemon --save-dev

# membuat database dengan postgres di cmd
1. psql --username postgres
2. CREATE DATABASE openmusic;
3. GRANT ALL ON DATABASE openmusic TO developer;
4. ALTER DATABASE openmusic OWNER TO developer;

# membuat file migration untuk tabel database dan menjalankan file migration
1. npm run migrate create "create table albums"
2. npm run migrate create "create table songs"
3. npm run migrate create "create table users"
4. npm run migrate create "create table authentications"
5. npm run migrate create "create table playlists"
6. npm run migrate create "create table playlist_songs"
7. npm run migrate create "create table collaborations"
8. npm run migrate create "create table playlist_songs_activities"
- npm run migrate up
- truncate albums, songs

# generate access token key
- require('crypto').randomBytes(64).toString('hex');

# TODO
- beresin api user dan authentications + testing
- validator, service, api playlist -> post, get, delete
- validator, service, api playlist_songs -> post, get, delete
- validator, service, api playlist song activities
- validator, service, api collaboration

