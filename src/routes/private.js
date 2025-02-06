import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()

const prisma = new PrismaClient()

router.get("/users", async (req, res) => {
  const userId = req.userId; //Id do usuário logado

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;