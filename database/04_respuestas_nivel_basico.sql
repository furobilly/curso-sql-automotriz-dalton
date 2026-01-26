-- =============================================
-- Solucionario: Nivel Básico - Dalton
-- Compara tus resultados con estas consultas.
-- =============================================

-- RESPUESTA RETO 1: Filtrar por Marca
-- Debe devolver 2 filas (Hilux y Corolla).
SELECT * FROM Catalogo_Modelos 
WHERE Marca = 'Toyota';


-- RESPUESTA RETO 2: Ventas de Alto Valor
-- Debe devolver las ventas 5001 y 5002.
SELECT VentaID, FechaVenta, MontoTotal 
FROM Ventas_Dalton 
WHERE MontoTotal > 500000;


-- RESPUESTA RETO 3: Búsqueda por Patrón
-- Debe devolver la fila del auto color 'Gris'.
SELECT * FROM Inventario_Autos 
WHERE Color LIKE 'G%';
