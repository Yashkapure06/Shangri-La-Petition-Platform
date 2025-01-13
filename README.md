# Shangri-La Petition Platform (SLPP)

<img src="/screenshots/landing.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">

---

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework to style the components.
- **Vite**: A fast and lightweight build tool for React development.

### Backend

- **Node.js**: A JavaScript runtime to run backend services.
- **Express.js**: Web framework for Node.js to handle routing and API management.
- **MongoDB**: NoSQL database to store the user data and petition details.
- **JWT**: JSON Web Tokens for securing the APIs and managing user authentication.

---

## Features

### Frontend

- **Table with Sorting Functionality**:
  - In the frontend, there is a table where you can view petitions.
  - The table supports sorting functionality by clicking on the column headers.
  - You can sort the table based on:
    - **Status** of the petition (e.g., "Closed", "Open")
    - **Petition Title**
    - **Description**
    - **Created By** (the user who created the petition)
      This functionality is implemented to help users easily manage and navigate the petition data.

### Backend

- **Authentication Middleware**: All API endpoints are protected, ensuring that requests can only be made if the correct headers are passed (for token validation).
- **Models**: The `models` folder contains the Mongoose schemas that define the structure of the data in MongoDB.
- **Routes**: The `routes` folder contains API endpoints for handling the creation, retrieval, and management of petitions and users.
- **JWT Authentication**: Authentication is handled via JWT tokens, ensuring secure access to the platform.

## Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Yashkapure06/Shangri-La-Petition-Platform.git
   cd Shangri-La-Petition-Platform
   ```

   inside `Shangri-La-Petition-Platform` there are two main folders one is `client` which is for frontend and `server` which is for backend.

### Frontend

1. **Install dependencies :**
   Run the following command to install all dependencies:

   ```bash
   unzip client.zip
   cd client
   npm install --force (make sure to copy command properly*)
   ```

2. **Start the development server:**
   Run the following command to start the frontend server:

   ```bash
   npm run dev
   ```

   The local server should be running on localhost.

3. **You will see following User Interface:**
   <img src="/screenshots/landing.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">

4. **When you click on Admin Login on right corner you will see the following screen:**
   Make sure to use the default credentials as mentioned in requirement.

   ```bash
   email: admin@petition.parliament.sr
   password: 2025%shangrila
   ```

   <img src="/screenshots/admin-login.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">

   After Successful Login you will see the main dashboard where in you can update the _**threshold**_ value globally and update the _**response**_ for particular petition.

   <img src="/screenshots/admin-dashboard.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">

5. **Similarly when you register there is a feature of scanning the QR code while registering and logging in by scanning QR Code**

- This is for logging in the petitioner
  <img src="/screenshots/petitioner-sign-in-qr.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">
- This is for registration of New Petitioner
  <img src="/screenshots/petitioner-registration.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">
- Petitioner Dashboard
  <img src="/screenshots/petitioner-dashboard.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">
- Petitioner Profile
  <img src="/screenshots/petitioner-profile-2.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">

### Backend

1. **Install dependencies:**
   In the backend directory, run the following command:

   ```bash
   unzip server.zip
   cd server
   npm install
   ```

2. **Start the backend server:**
   The main entry point for the backend is `index.js`. To start the backend, run:

   ```bash
   node index.js
   ```

   - The backend server should now be running on the default port provided in the code, and the API should be accessible for requests. As soon as the command is executed the server gets connected to database.

3. **Used MongoDB to store and manage data**

   - The **models** folder defines MongoDB schemas for user data, petitions, and bioIds entities used in the platform.
     <img src="/screenshots/mongodb-compass.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">

---

## Features

### Authentication

- Middleware is used to ensure that all APIs require authentication.
- JWT tokens are used to authenticate users and protect routes.
- `bcryptjs` and `passport` for converting the password into hased password
  <img src="/screenshots/mongodb-users.png" style="border-radius: 15px; width: 100%; object-fit: cover;" alt="Shangri-La Petition Platform">

### Models

- The **models** folder defines MongoDB schemas for user data, petitions, and other entities used in the platform.

### API Endpoints

- Routes are defined inside the **routes** folder, where each endpoint corresponds to a specific feature of the platform.

---

## API Authentication

- All API requests require authentication via **Bearer Token**.
- You can obtain the JWT token by logging in through the platform, which will be used for subsequent requests.

---

## Postman Collection

You can also import the [Postman collection](./Shangri-la%20Petition%20API.postman_collection.json) to test the API endpoints. This will help you test and interact with the backend directly without using the frontend.
