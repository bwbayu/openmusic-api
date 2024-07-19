# openmusic-api
submission dicoding

# install package global
npm install @hapi/hapi dotenv joi nanoid node-pg-migrate pg auto-bind@4

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
3. npm run migrate up