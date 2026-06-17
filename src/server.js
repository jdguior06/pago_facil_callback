'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const ESTADO_MAP = {
  1: 'pendiente',
  2: 'pagado',
  3: 'revertido',
  4: 'anulado',
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/callback', async (req, res) => {
  const { PedidoID, Estado, Fecha, Hora, MetodoPago } = req.body;

  const pedidoId = String(PedidoID).trim();
  const estadoNum = parseInt(Estado, 10);
  const estadoTexto = ESTADO_MAP[estadoNum];

  console.log(`[callback] PedidoID=${pedidoId} Estado=${estadoNum} (${estadoTexto ?? 'desconocido'}) Fecha=${Fecha} Hora=${Hora} MetodoPago=${MetodoPago}`);

  if (!estadoTexto) {
    console.warn(`[callback] Estado desconocido: ${estadoNum}`);
    return res.json({ error: 0, status: 1, message: 'Estado no reconocido.', values: false });
  }

  try {
    const result = await pool.query(
      `UPDATE pago
         SET estado_pago     = $1,
             actualizado_en  = CURRENT_TIMESTAMP
       WHERE nro_pedido = $2`,
      [estadoTexto, pedidoId]
    );

    if (result.rowCount === 0) {
      console.warn(`[callback] PedidoID=${pedidoId} no encontrado en la BD.`);
      return res.json({ error: 0, status: 1, message: 'Pago no encontrado.', values: false });
    }

    console.log(`[callback] PedidoID=${pedidoId} actualizado a '${estadoTexto}'.`);
    return res.json({ error: 0, status: 1, message: 'Pago actualizado correctamente.', values: true });
  } catch (err) {
    console.error(`[callback] Error al actualizar PedidoID=${pedidoId}:`, err.message);
    return res.json({ error: 0, status: 1, message: 'Error interno.', values: false });
  }
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`pagofacil-callback escuchando en el puerto ${PORT}`);
});
