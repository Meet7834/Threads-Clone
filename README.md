# Threads Clone

This project is a clone of Instagram Threads with added chatting functionality. It is built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The application allows users to create threads, post updates, follow/unfollow users and chat with friends in real-time.

## Features

- **User Authentication**: Users can sign up, log in, and log out securely.
- **Thread Creation**: Users can create threads to group their friends and post replies within those threads.
- **Real-time Chatting**: Users can engage in real-time chat conversations within threads.
- **Image Sharing**: Users can post images in threads.
- **Follow Users**: Users can follow/unfollow any user.
- **Responsive Design**: The application is designed to be responsive and work seamlessly across various devices.

## Technologies Used

- **MongoDB**: Database to store user data, threads, and messages.
- **Express.js**: Backend framework for handling server-side logic and routing.
- **React.js**: Frontend library for building the user interface.
- **Node.js**: JavaScript runtime environment for server-side scripting.
- **Socket.io**: Library for enabling real-time, bidirectional communication between web clients and servers.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed locally or accessible remotely.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/instagram-threads-clone.git
    ```

2. Navigate to the project directory:

    ```bash
    cd threads
    ```

3. Install dependencies:

    ```bash
    cd backend
    npm install
    cd ..
    cd frontend
    npm install
    ```

4. Set up environment variables:
   
   Create a `.env` file in the root backend directory of the project and add the following variables:

    ```plaintext
    MONGODB_URI=your_mongodb_uri
    PORT=8080
    CLOUDINARY_CLOUD_NAME=your_cloudinary_credentials
    CLOUDINARY_API_KEY=your_cloudinary_credentials
    CLOUDINARY_API_SECRET=your_cloudinary_credentials
    JWT_SECRET=your_secret
    ```

5. [If you are on windows]:

   Change these two scripts in package.json file at the root location of project to:

    ```
    "scripts": {
        ...
        "dev": "SET NODE_ENV=development & nodemon backend/app.js",
        "start": "SET NODE_ENV=production & node backend/app.js",
        ...
      },
    ``` 

5. Start the backend server:

    ```bash
    cd backend
    npm run dev
    ```

6. Start the frontend:

    ```bash
    cd frontend
    npm run dev
    ```

7. Navigate to `http://localhost:3000` in your browser to use the application.

## Contributing

Contributions are welcome! If you want to contribute to this project, please fork the repository and submit a pull request with your changes.
