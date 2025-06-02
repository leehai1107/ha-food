import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const roleId = req.query.roleId ? parseInt(req.query.roleId as string) : undefined;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } }
        ];
      }
      if (roleId) where.roleId = roleId;

      const [accounts, total] = await Promise.all([
        prisma.account.findMany({
          where,
          skip,
          take: limit,
          include: {
            role: true,
            _count: { select: { orders: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.account.count({ where })
      ]);

      const safeAccounts = accounts.map(({ passwordHash, ...account }) => account);

      return res.json({
        success: true,
        data: {
          accounts: safeAccounts,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        message: 'Accounts retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch accounts'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, password, phone, address, roleId } = req.body;
      const requiredFields = ['name', 'email', 'password', 'roleId'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Invalid email format'
        });
      }
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const account = await prisma.account.create({
        data: { name, email, passwordHash, phone, address, roleId },
        include: { role: true }
      });

      const { passwordHash: _, ...safeAccount } = account;
      return res.status(201).json({
        success: true,
        data: safeAccount,
        message: 'Account created successfully'
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Email already exists'
        });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Invalid role ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create account'
      });
    }
  }

  // Method Not Allowed
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}