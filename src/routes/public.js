import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const userData = req.body;

  try {
    if (!userData.email || !userData.name || !userData.password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      }
    });

    res.status(201).json({ message: "User created successfully", user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email }, token: token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/healthcheck", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

export default router;