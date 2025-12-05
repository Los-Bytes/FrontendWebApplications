import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'server', 'db.json'));
const middlewares = jsonServer.defaults({
    static: path.join(__dirname, 'dist')
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom Middleware for Authentication
server.post('/api/v1/authentication/sign-in', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for: ${username}`);

    const db = router.db;
    const user = db.get('users').find({ userName: username }).value();

    if (user) {
        console.log(`User found: ${user.userName}`);
        res.jsonp({
            id: user.id,
            username: user.userName,
            token: "mock-jwt-token-123456"
        });
    } else {
        console.log('User not found');
        res.status(401).jsonp({ error: "Invalid credentials" });
    }
});

server.post('/api/v1/authentication/sign-up', (req, res) => {
    console.log('Sign up request');
    const { username, password } = req.body;
    res.jsonp({
        message: "User created successfully"
    });
});

// Mount router at /api/v1 to match frontend expectations
server.use('/api/v1', router);

// Catch-all to serve index.html for SPA client-side routing
// This must be after API routes
server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});
