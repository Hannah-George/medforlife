const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
let cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())
app.use(express.static('public'));

// Add these to your package.json dependencies:
// "bcrypt": "^5.0.1",
// "jsonwebtoken": "^8.5.1"

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'medforlife_db',
    password: '12345',
    port: 5432,
});

const JWT_SECRET = '123'; // Use a secure secret in production

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Shop login endpoint
app.post('/api/shop/login', async (req, res) => {

    console.log('helloooo');

    try {
        const { email, password } = req.body;

        const result = await pool.query(
            'SELECT * FROM shop_users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if (!user || !await bcrypt.compare(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, shopId: user.shop_id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ message: "login successfull", token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/signup', async (req, res) => {

    console.log(req.body);



    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userCheck = await pool.query("SELECT * FROM shop_users WHERE email = $1", [email]);

        console.log(userCheck);

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const newUser = await pool.query(
            "INSERT INTO shop_users (email, password_hash) VALUES ($1, $2)",
            [email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (error) {
        console.log(error);

    }

})

// Get shop inventory
app.get('/api/shop/inventory', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT i.id, m.name as medicine_name, i.stock, i.price
             FROM inventory i
             JOIN medicines m ON i.medicine_id = m.id
             WHERE i.shop_id = $1`,
            [req.user.shopId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Inventory fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Update inventory
app.post('/api/shop/inventory/update', authenticateToken, async (req, res) => {
    try {
        const { medicineName, stock, price } = req.body;

        // Start transaction
        await pool.query('BEGIN');

        // Get or create medicine
        let medicineResult = await pool.query(
            'SELECT id FROM medicines WHERE name = $1',
            [medicineName]
        );

        let medicineId;
        if (medicineResult.rows.length === 0) {
            const newMedicine = await pool.query(
                'INSERT INTO medicines (name) VALUES ($1) RETURNING id',
                [medicineName]
            );
            medicineId = newMedicine.rows[0].id;
        } else {
            medicineId = medicineResult.rows[0].id;
        }

        // Update or insert inventory
        await pool.query(
            `INSERT INTO inventory (shop_id, medicine_id, stock, price)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (shop_id, medicine_id)
             DO UPDATE SET stock = $3, price = $4`,
            [req.user.shopId, medicineId, stock, price]
        );

        await pool.query('COMMIT');
        res.json({ message: 'Inventory updated successfully' });
    } catch (error) {
        await pool
        await pool.query('ROLLBACK');
        console.error('Inventory update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete inventory item
app.delete('/api/shop/inventory/:itemId', authenticateToken, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM inventory WHERE id = $1 AND shop_id = $2',
            [req.params.itemId, req.user.shopId]
        );
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files for shop portal
app.get('/shop/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/shop-login.html'));
});

app.get('/shop/inventory.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/shop-inventory.html'));
});





const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Search for nearby pharmacies with the medicine
app.get("/search", (req, res) => {
    const { medicine, latitude, longitude } = req.query;
    if (!medicine || !latitude || !longitude) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const nearbyPharmacies = pharmacies.filter(pharmacy =>
        pharmacy.medicines.includes(medicine) &&
        getDistanceFromLatLonInKm(userLat, userLon, pharmacy.latitude, pharmacy.longitude) < 10 // 10 km radius
    );

    res.json(nearbyPharmacies);
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


