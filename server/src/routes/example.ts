import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

router.get('/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from backend' });
});

export default router;
