import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom Middleware for Authentication
server.post('/api/v1/authentication/sign-in', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for: ${username}`);

    const db = router.db;
    const user = db.get('users').find({ userName: username }).value();

    if (user) {
        // Should check password here in real app, but for mock we just accept it or check if user exists
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

    // Simple mock signup - just return success
    res.jsonp({
        message: "User created successfully"
    });
});

// Rewrite rules
server.use(jsonServer.rewriter({
    "/api/v1/*": "/$1"
}));

server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running on port 3000 with custom auth middleware');
});
