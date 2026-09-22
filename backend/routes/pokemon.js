import { Router } from 'express';
import axios from 'axios';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

// Buscar un Pokémon en la PokéAPI por nombre o id (no requiere auth, es solo consulta)
router.get('/search/:query', async (req, res) => {
  const { query } = req.params;

  try {
    const response = await axios.get(`${POKEAPI_BASE}/pokemon/${query.toLowerCase()}`);
    const data = response.data;

    res.json({
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      height: data.height,
      weight: data.weight,
      stats: data.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al consultar la PokéAPI' });
  }
});

// Ver la colección del usuario logueado
router.get('/collection', requireAuth, (req, res) => {
  const items = db
    .prepare('SELECT * FROM collection WHERE user_id = ? ORDER BY added_at DESC')
    .all(req.user.id);

  const parsed = items.map((item) => ({
    ...item,
    types: item.types ? JSON.parse(item.types) : [],
  }));

  res.json(parsed);
});

// Agregar un Pokémon a la colección
router.post('/collection', requireAuth, (req, res) => {
  const { pokemon_id, pokemon_name, sprite_url, nickname, types } = req.body;

  if (!pokemon_id || !pokemon_name) {
    return res.status(400).json({ error: 'pokemon_id y pokemon_name son requeridos' });
  }

  const result = db
    .prepare(
      'INSERT INTO collection (user_id, pokemon_id, pokemon_name, sprite_url, nickname, types) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(req.user.id, pokemon_id, pokemon_name, sprite_url || null, nickname || null, types ? JSON.stringify(types) : null);

  res.status(201).json({ id: result.lastInsertRowid });
});

// Eliminar un Pokémon de la colección
router.delete('/collection/:id', requireAuth, (req, res) => {
  const { id } = req.params;

  const item = db.prepare('SELECT * FROM collection WHERE id = ?').get(id);

  if (!item) {
    return res.status(404).json({ error: 'No encontrado' });
  }

  if (item.user_id !== req.user.id) {
    return res.status(403).json({ error: 'No tienes permiso para eliminar esto' });
  }

  db.prepare('DELETE FROM collection WHERE id = ?').run(id);
  res.json({ message: 'Eliminado correctamente' });
});

export default router;