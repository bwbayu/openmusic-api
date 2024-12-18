# Open Music API

## Project Description
Open Music API is a back-end API for managing music and playlists. Built using **Node.js (Hapi)** and various AWS services, the project offers comprehensive features for user authentication, playlist management, data export, caching, and more.

---

## Features
- **User Authentication**: Secure user registration and login using **JWT**.  
- **Playlist Management**: CRUD operations for playlists and collaborative playlist management.  
- **Data Validation**: Input validation using **Joi**.  
- **Data Export**: Export playlist data via **RabbitMQ** and send it through email with **Nodemailer**.  
- **File Storage**: Store album cover images.  
- **Caching**: Optimize performance with **Redis** for server-side caching.  
- **Likes System**: Implement like functionality for albums.  
- **Activity Logs**: Monitor playlist activities.  

---

## Tech Stack
- **Backend Framework**: Node.js with Hapi.js  
- **Database**: Postgres  
- **Message Broker**: RabbitMQ  
- **Caching**: Redis
- **Validation**: Joi

---

## Setup
1. Open postgres cli
    ```bash
    psql --username postgres
    ```
2. Create database
    ```bash
    CREATE DATABASE <database_name>;
    ```
3. Grant database access to database user
    ```bash
    GRANT ALL ON DATABASE <database_name> TO <database_user>;
    ```
    ```bash
    ALTER DATABASE <database_name> OWNER TO <database_user>;
    ```

## Installation
1. Clone this repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```bash
    cd open-music-api
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Copy .env.example then change to .env and fill it
5. Run database migrations:
    ```bash
    npm run migrate
    ```
6. Start the node.js server:
    ```bash
    npm run start:dev
    ```
7. Check the redis by using Powershell
    ```bash
    memurai-cli
    ```
7. Open the RabbitMQ by open http://localhost:15672

---

## Other
Run eslint:
```bash
npm run lint
```