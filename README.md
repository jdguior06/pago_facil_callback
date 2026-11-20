# PagoFácil — Servidor de callbacks

Pequeño servidor que **recibe las notificaciones de pago de la pasarela PagoFácil (Bolivia)** y actualiza el estado del pago en la base de datos. Complementa el sistema [escuela](https://github.com/jdguior06/escuela).

> 🎓 Proyecto académico desarrollado en la U.A.G.R.M. (Ingeniería en Sistemas), 2026.

## Tecnologías

Node.js, Express, PostgreSQL (`pg`).

## Cómo funciona

- `POST /callback`: recibe el pedido y su estado desde PagoFácil y actualiza el pago correspondiente.
- `GET /health`: verifica que el servidor está activo.

Estados que reconoce: `1` pendiente, `2` pagado, `3` revertido, `4` anulado.

## Cómo ejecutarlo

```bash
npm install
cp .env.example .env
```

Completa en `.env` los datos de tu base de datos (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) y el `PORT`. Luego:

```bash
npm start
```

## Autor

Juan Diego Guirapoigua Oregua · [@jdguior06](https://github.com/jdguior06)
