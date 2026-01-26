-- =============================================
-- Ejercicios Nivel Básico: El arte de filtrar
-- Objetivo: Aprender a usar WHERE, AND, OR y LIKE
-- =============================================

-- RETO 1: ¿Qué autos tenemos de la marca Toyota?
-- Explicación: Usamos WHERE para filtrar por una columna específica.
SELECT * FROM Catalogo_Modelos 
WHERE Marca = 'Toyota';


-- RETO 2: Ventas mayores a $500,000 (Ventas de alto valor)
-- Explicación: Los números no llevan comillas. Usamos operadores de comparación (>).
SELECT VentaID, FechaVenta, MontoTotal 
FROM Ventas_Dalton 
WHERE MontoTotal > 500000;


-- RETO 3: Buscando colores específicos (Uso de LIKE)
-- Explicación: El símbolo % significa "cualquier cosa que siga". 
-- Esto buscará autos cuyos colores empiecen con 'G' (como Gris).
SELECT * FROM Inventario_Autos 
WHERE Color LIKE 'G%';
