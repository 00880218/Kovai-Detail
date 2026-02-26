import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("kovai_detail.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    service_type TEXT NOT NULL,
    address TEXT NOT NULL,
    lat REAL,
    lng REAL,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed Admin if not exists
const adminEmail = "kovaidetail@gmail.com";
const existingAdmin = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail);
if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin",
    adminEmail,
    hashedPassword,
    "admin"
  );
}

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
app.post("/api/auth/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const info = db.prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)").run(
      name, email, phone, hashedPassword
    );
    const token = jwt.sign({ id: info.lastInsertRowid, email, role: 'user' }, JWT_SECRET);
    res.json({ token, user: { id: info.lastInsertRowid, name, email, role: 'user' } });
  } catch (error) {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post("/api/bookings", authenticateToken, (req: any, res) => {
  const {
    fullName, phoneNumber, email, vehicleType, vehicleModel,
    serviceType, address, lat, lng, preferredDate, preferredTime, notes
  } = req.body;

  try {
    db.prepare(`
      INSERT INTO bookings (
        user_id, full_name, phone_number, email, vehicle_type, vehicle_model,
        service_type, address, lat, lng, preferred_date, preferred_time, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id, fullName, phoneNumber, email, vehicleType, vehicleModel,
      serviceType, address, lat, lng, preferredDate, preferredTime, notes
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

app.get("/api/bookings", authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    const bookings = db.prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    return res.json(bookings);
  }
  const bookings = db.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all();
  res.json(bookings);
});

app.patch("/api/bookings/:id/status", authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  const { status } = req.body;
  db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ success: true });
});

app.get("/api/admin/stats", authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  
  const totalBookings = db.prepare("SELECT COUNT(*) as count FROM bookings").get() as any;
  const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get() as any;
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = ?").get(today) as any;
  
  const serviceBreakdown = db.prepare("SELECT service_type, COUNT(*) as count FROM bookings GROUP BY service_type").all();

  res.json({
    totalBookings: totalBookings.count,
    totalCustomers: totalCustomers.count,
    todayBookings: todayBookings.count,
    serviceBreakdown
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
