import express from 'express';
import publicRoutes from './src/routes/public.js';
import privateRoutes from './src/routes/private.js';
import auth from './src/middlewares/auth.js';
import cors from 'cors';

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api", publicRoutes)
app.use("/api", auth, privateRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});