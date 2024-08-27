# Microservice Client

This is the frontend client application for the Course Microservice project. It is built using Angular, integrated with various microservices for course management, user authentication, basket management, and order processing.

### Table of Contents
-----------------

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Getting Started](#getting-started)
-   [Running the Application](#running-the-application)
-   [Project Structure](#project-structure)
-   [Contributing](#contributing)
-   [License](#license)

### Features
--------

-   **User Authentication:** Users can register, log in, and manage their sessions using JWT tokens.
-   **Course Management:** View and manage course details, including adding courses to the shopping cart.
-   **Basket Management:** Handle items in the shopping cart, apply discount codes, and proceed to checkout.
-   **Real-time Notifications:** Get real-time notifications related to orders and other user-specific events.
-   **Order Processing:** Integration with backend services to handle order creation, tracking, and history.

### Technologies Used
-----------------

-   **Angular 16**: The main framework for building the single-page application.
-   **Angular Material**: For UI components and styling.
-   **RxJS**: To manage state and handle asynchronous operations.
-   **NgRx**: For state management (if applicable).
-   **JwtModule**: For handling JWT authentication.
-   **ngx-cookie-service**: To manage cookies in the application.
-   **SignalR**: For real-time communication and notifications.
-   **Docker**: To containerize the application for consistent development and deployment.

## Getting Started

### Prerequisites

-   Node.js (version 16 or later)
-   Angular CLI (version 16 or later)
-   Docker (optional, for running the application in a containerized environment)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/BatuhanB/MicroserviceClient.git
    cd MicroserviceClient 
    ```

3.  **Install dependencies:**

    
    ```bash
    npm install
    ```

5.  **Environment setup:**

    Create a `.env` file in the root directory and configure the necessary environment variables. See the [Configuration](#configuration) section for details.

## Running the Application
-----------------------

### Development Mode

To start the application in development mode:

```bash
ng serve
```

This will serve the application at `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Production Mode

To build the application for production:

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

### Docker

To run the application inside a Docker container:

1.  **Build the Docker image:**

    ```bash
    docker build -t microservice-client .
    ```

3.  **Run the Docker container:**

    ```bash
    docker run -p 4200:80 microservice-client
    ```

The application will be accessible at `http://localhost:4200/`.

Project Structure
-----------------

```bash
src/
│
├── app/                  # Main application module
│   ├── components/       # Reusable components
│   ├── services/         # Services for API calls and business logic
│   ├── models/           # Application models/interfaces
│   ├── guards/           # Route guards for authentication
│   └── ...               # Other modules and components
│
├── assets/               # Static assets (images, icons, etc.)
├── environments/         # Environment-specific configuration
└── index.html            # Main HTML file
```

Contributing
------------

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes you would like to make.

License
-------

This project is licensed under the MIT License. See the LICENSE file for more details.
