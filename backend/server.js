const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const pool = require('./db')
const jwt = require('jsonwebtoken')
const app = express()
app.use(cors())
app.use(express.json())

// --- Middleware ---
function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided.' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' })
        }

        req.user = decoded
        next()

    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' })
    }
}

// GET APIs
app.get('/', async (req, res) => {
    res.send("API Server is running...")
})

app.get('/api/health', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  res.json({ dbTime: result.rows[0] })
})

app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, COALESCE(SUM(v.stock), 0) AS total_stock
            FROM products p
            LEFT JOIN product_variants v ON v.product_id = p.id
            GROUP BY p.id
            ORDER BY p.id DESC
        `)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not fetch products.' })
    }
})

app.post('/api/products', verifyAdmin, async (req, res) => {
    const {product, descriptions, sku, category, type, price, image, stock} = req.body

    try {
        const result = await pool.query(
            `INSERT INTO products (product_name, descriptions, sku, category, type, price, image_url, stock)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
             [product, descriptions, sku, category, type, price, image, stock]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        if (err.code === '23505') {
            return res.status(409).json({ error: ' SKU already exists.' })
        }
        res.status(500).json({ error: 'Could not create product.' })
    }
})

// POST APIs
app.post('/api/register', async (req, res) => {
    const { fullName, email, password, phone } = req.body

    try {
      const passwordHash = await bcrypt.hash(password, 10)

      const result = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, phone, role)
         VALUES ($1, $2, $3, $4, 'customer')
         RETURNING id, full_name, email, phone, role, created_at`,
        [fullName, email, passwordHash, phone]
      )

      res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)

        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already registered.' })
        }

        res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
})



app.post('/api/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await pool.query(
            'SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1',
            [email]
        )

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' })
        }

        const user = result.rows[0]
        const passwordMatches = await bcrypt.compare(password, user.password_hash)

        if (!passwordMatches) {
            return res.status(401).json({ error:'Invalid email or password.'})
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        res.status(200).json({
            token,
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong. Please try again.'})
    }
    
})


app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params

    try {
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        )
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found.' })
        }

        res.status(200).json({ message: 'Product deleted.', deleted: result.rows[0] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not delete product.' })
    }

})

app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params

    try {
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found.' })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not fetch product.' })
    }
})

app.put('/api/products/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params
    const { product, descriptions, sku, category, type, price, image, stock } = req.body

    try {
        const result = await pool.query(
            `UPDATE products
            SET product_name = $1, descriptions = $2, sku = $3, category = $4,
                type = $5, price = $6, image_url = $7, stock = $8
            WHERE id = $9
            RETURNING *`,
            [product, descriptions, sku, category, type, price, image, stock, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found.' })
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not update product.' })
    }
})

// Get all variants for a specific product
app.get('/api/products/:id/variants', async (req, res) => {
    const { id } = req.params

    try {
        const result = await pool.query(
            'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY color, size',
            [id]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not fetch variants.' })
    }
})

// Add a new variant to a product
app.post('/api/products/:id/variants', verifyAdmin, async (req, res) => {
    const { id } = req.params
    const { color, size, stock } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO product_variants (product_id, color, size, stock)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [id, color, size, stock]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        if (err.code === '23505') {
            return res.status(409).json({ error: 'This color/size combination already exists.' })
        }
        res.status(500).json({ error: 'Could not add variant.' })
    }
})

// Update a variant's stock
app.put('/api/variants/:variantId', verifyAdmin, async (req, res) => {
    const { variantId } = req.params
    const { stock } = req.body

    try {
        const result = await pool.query(
            'UPDATE product_variants SET stock = $1 WHERE id = $2 RETURNING *',
            [stock, variantId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Variant not found.' })
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not update variant.' })
    }
})

// Delete a variant
app.delete('/api/variants/:variantId', verifyAdmin, async (req, res) => {
    const { variantId } = req.params

    try {
        const result = await pool.query(
            'DELETE FROM product_variants WHERE id = $1 RETURNING *',
            [variantId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Variant not found.' })
        }

        res.status(200).json({ message: 'Variant deleted.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not delete variant.' })
    }
})

app.listen(5000, () => console.log('Server running on http://localhost:5000'))