Revisa este pull request de un frontend en Next.js 16 / React 19 con TypeScript:
- Señala lógica vaga o poco clara (estado, efectos, condicionales de render)
- Detecta edge cases que el código no cubre (loading, error, listas vacías,
  valores null/undefined, datos aún sin cargar)
- Marca duplicación de lógica (ej. helpers que reimplementan chequeos que ya
  cubre una utilidad, un hook o un tipo existente)
- Vigila fronteras client/server (uso indebido de "use client", datos sensibles
  o secretos filtrados al cliente, fetch en el lugar equivocado)
- Revisa accesibilidad y tipado obvios (props sin tipar, any innecesario)
- Sugiere simplificaciones, no reescrituras completas
