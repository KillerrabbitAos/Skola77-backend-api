# Installation Instructions

1. **Install the package:**
    ```sh
    npm install
    ```

2. **Run PostgreSQL server:**
    Ensure you have PostgreSQL installed. Start the PostgreSQL server with the following credentials:
    - **Server name:** postgres
    - **User:** postgres
    - **Password:** postgres

    You can start the server using the following command:
    ```sh
    pg_ctl -D /usr/local/var/postgres start
    ```

    Or, if you are using a different setup, ensure the server is running with the specified credentials.