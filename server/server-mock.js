// server/server-mock.js
// Mock server para IAM authentication con json-server (ES Modules)

import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Función para generar un token simple
function generateToken(userId, username) {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${userId}-${username}-${timestamp}-${randomPart}`;
}

// Middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// ==========================================
// SERVIR ARCHIVOS ESTÁTICOS DE VITE
// ==========================================
// Servir los archivos estáticos del build de Vite
server.use(express.static(join(__dirname, '../dist')));

// ==========================================
// POST /api/v1/sign-in
// ==========================================
server.post('/api/v1/sign-in', (req, res) => {
    console.log('🔐 Sign-in request:', req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
        console.log('❌ Missing credentials');
        return res.status(400).json({ 
            error: 'Username and password are required' 
        });
    }

    // Buscar usuario en db.json
    const db = router.db;
    const users = db.get('users').value();
    
    console.log('👥 Total users in DB:', users.length);
    
    const user = users.find(u => u.username === username);
    
    if (!user) {
        console.log('❌ User not found:', username);
        return res.status(401).json({ 
            error: 'Invalid credentials' 
        });
    }

    console.log('✅ User found:', user.username);

    // Verificar password
    if (user.password && user.password !== password) {
        console.log('❌ Invalid password');
        return res.status(401).json({ 
            error: 'Invalid credentials' 
        });
    }

    // Generar token
    const token = generateToken(user.id, user.username);

    console.log('✅ Sign-in successful for:', user.username);

    // Respuesta exitosa
    return res.status(200).json({
        id: user.id,
        username: user.username,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'technician',
        organization: user.organization || '',
        imgToImage: user.imgToImage || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
        suscriptionPlan: user.suscriptionPlan || 'Free',
        token: token
    });
});

// ==========================================
// POST /api/v1/sign-up
// ==========================================
server.post('/api/v1/sign-up', (req, res) => {
    console.log('📝 Sign-up request:', req.body);
    
    const { username, password, fullName, email, phone, role, organization } = req.body;
    
    // Validaciones
    if (!username || !password || !fullName || !email) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ 
            error: 'Username, password, full name, and email are required' 
        });
    }

    try {
        const db = router.db;
        const users = db.get('users').value();
        
        console.log('👥 Current users count:', users.length);
        
        // Verificar si el usuario ya existe
        const existingUser = users.find(u => 
            u.username === username || u.email === email
        );
        
        if (existingUser) {
            console.log('❌ User already exists:', username);
            return res.status(409).json({ 
                error: 'Username or email already exists' 
            });
        }

        // Calcular nuevo ID
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        console.log('🆕 Creating new user with ID:', newId);

        // Crear nuevo usuario
        const newUser = {
            id: newId,
            username: username,
            password: password, // En producción, hashearlo
            fullName: fullName,
            email: email,
            phone: phone || '',
            role: role || 'technician',
            organization: organization || '',
            documentRegistration: 'DNI',
            imgToImage: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
            suscriptionPlan: 'Free'
        };

        // Agregar usuario a la base de datos
        db.get('users').push(newUser).write();

        console.log('✅ User created successfully:', newUser.username);

        // Crear suscripción Free por defecto
        try {
            const subscriptions = db.get('subscriptions').value();
            const newSubId = subscriptions.length > 0 
                ? Math.max(...subscriptions.map(s => s.id)) + 1 
                : 1;

            const newSubscription = {
                id: newSubId,
                userId: newUser.id,
                planType: 'Free',
                startDate: new Date().toISOString(),
                endDate: null,
                maxMembers: 3,
                maxInventoryItems: 50,
                isActive: true
            };

            db.get('subscriptions').push(newSubscription).write();
            console.log('✅ Default subscription created for user:', newUser.username);
        } catch (subError) {
            console.log('⚠️ Could not create subscription:', subError.message);
        }

        // Respuesta exitosa
        return res.status(201).json({
            message: 'User registered successfully',
            id: newUser.id,
            username: newUser.username
        });

    } catch (error) {
        console.error('❌ Error during sign-up:', error);
        return res.status(500).json({ 
            error: 'Internal server error during registration',
            details: error.message 
        });
    }
});

// Usar el router por defecto para todas las demás rutas de API
server.use('/api/v1', router);

// ==========================================
// SPA FALLBACK - DEBE IR AL FINAL
// ==========================================
// Para todas las rutas que no sean de API, servir index.html
server.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Mock Server running on http://localhost:' + PORT);
    console.log('='.repeat(60));
    console.log('📝 Endpoints disponibles:');
    console.log('   POST http://localhost:' + PORT + '/api/v1/sign-in');
    console.log('   POST http://localhost:' + PORT + '/api/v1/sign-up');
    console.log('   GET  http://localhost:' + PORT + '/api/v1/users');
    console.log('   GET  http://localhost:' + PORT + '/api/v1/plans');
    console.log('='.repeat(60));
    console.log('');
    
    // Mostrar estado de la base de datos
    const db = router.db;
    const users = db.get('users').value();
    console.log('📊 Database status:');
    console.log('   Users:', users.length);
    console.log('');
});