## Installation Instructions

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

## Usage Instructions

Below is an example of how to use the package with an Express server:

```js
const createServer = require("skola77-api");

const app = createServer({
  port: 5051,
  corsOrigin: "http://localhost:3000",
  noStart: true, 
});

app.listen(5051, () => console.log("Custom server running on port 5051"));
```

Feel free to adjust the configuration options to suit your needs.