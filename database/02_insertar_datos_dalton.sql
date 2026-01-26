-- =============================================
-- Script: Inserción de Datos de Prueba - Dalton
-- Objetivo: Poblar las tablas para realizar los primeros SELECT.
-- =============================================

-- 1. Insertar Modelos
INSERT INTO Catalogo_Modelos (ModeloID, NombreModelo, Marca, TipoVehiculo) VALUES 
(101, 'Hilux', 'Toyota', 'Pickup'),
(102, 'Corolla', 'Toyota', 'Sedán'),
(103, 'CR-V', 'Honda', 'SUV');

-- 2. Insertar Autos al Inventario
INSERT INTO Inventario_Autos (AutoID, ModeloID, Color, PrecioLista, Estatus) VALUES 
(1, 101, 'Blanco', 550000.00, 'Disponible'),
(2, 101, 'Gris', 555000.00, 'Vendido'),
(3, 102, 'Rojo', 410000.00, 'Disponible'),
(4, 103, 'Negro', 680000.00, 'Vendido');

-- 3. Insertar Ventas Reales (Ejemplo Dalton GDL y SLP)
INSERT INTO Ventas_Dalton (VentaID, AgenciaID, AutoID, FechaVenta, MontoTotal, VendedorID) VALUES 
(5001, 1, 2, '2026-01-20', 555000.00, 10), -- Venta en GDL
(5002, 2, 4, '2026-01-22', 680000.00, 15); -- Venta en SLP
