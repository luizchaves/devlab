import { randomUUID } from 'node:crypto';
import express from 'express';

import { hosts } from './data/hosts.js';

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

const router = express.Router();

router.post('/hosts', (req, res) => {
  const { name, address } = req.body ?? {};

  if (!name || !address) {
    throw new HttpError('Error when passing parameters');
  }

  const newHost = { id: randomUUID(), name, address };

  hosts.push(newHost);

  return res.status(201).json(newHost);
});

router.get('/hosts', (req, res) => {
  const { name } = req.query;

  if (name) {
    const filteredHosts = hosts.filter((host) => host.name.includes(name));

    return res.json(filteredHosts);
  }

  return res.json(hosts);
});

router.get('/hosts/:id', (req, res) => {
  const { id } = req.params;

  const index = hosts.findIndex((host) => host.id === id);

  if (!hosts[index]) {
    throw new HttpError('Host not found', 404);
  }

  return res.json(hosts[index]);
});

router.put('/hosts/:id', (req, res) => {
  const { name, address } = req.body ?? {};

  const { id } = req.params;

  if (!name || !address) {
    throw new HttpError('Error when passing parameters');
  }

  const index = hosts.findIndex((host) => host.id === id);

  if (!hosts[index]) {
    throw new HttpError('Host not found', 404);
  }

  const newHost = { id, name, address };

  hosts[index] = newHost;

  return res.json(newHost);
});

router.delete('/hosts/:id', (req, res) => {
  const { id } = req.params;

  const index = hosts.findIndex((host) => host.id === id);

  if (!hosts[index]) {
    throw new HttpError('Host not found', 404);
  }

  hosts.splice(index, 1);

  return res.sendStatus(204);
});

// 404 handler
router.use((req, res) => {
  res.status(404).json({ message: 'Content not found!' });
});

// Error handler
router.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Something broke!' });
});

export default router;
