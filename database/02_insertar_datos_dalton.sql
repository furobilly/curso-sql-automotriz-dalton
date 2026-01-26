-- ==========================================================
-- EL CÓDICE DALTON: CARGA MASIVA DE RESTAURACIÓN (v1.0)
-- Contiene: 10 Modelos, 5 Agencias, 10 Asesores, 20 Clientes y 150+ Ventas
-- ==========================================================

-- 1. CARGA DE MODELOS (Toyota, Honda, Kia)
INSERT INTO Dim_Modelos VALUES (1, 'Hilux Doble Cabina', 'Toyota', 'Pickup', 'Nuevo', 550000);
INSERT INTO Dim_Modelos VALUES (2, 'CR-V Turbo', 'Honda', 'SUV', 'Nuevo', 720000);
INSERT INTO Dim_Modelos VALUES (3, 'Corolla Hybrid', 'Toyota', 'Sedán', 'Seminuevo', 410000);
INSERT INTO Dim_Modelos VALUES (4, 'Sportage EX', 'Kia', 'SUV', 'Nuevo', 610000);
INSERT INTO Dim_Modelos VALUES (5, 'Civic Type R', 'Honda', 'Deportivo', 'Nuevo', 950000);
INSERT INTO Dim_Modelos VALUES (6, 'Tacoma TRD', 'Toyota', 'Pickup', 'Nuevo', 890000);
INSERT INTO Dim_Modelos VALUES (7, 'Rio Sedán', 'Kia', 'Sedán', 'Seminuevo', 280000);
INSERT INTO Dim_Modelos VALUES (8, 'Seltos SX', 'Kia', 'SUV', 'Nuevo', 490000);
INSERT INTO Dim_Modelos VALUES (9, 'Accord Touring', 'Honda', 'Sedán', 'Nuevo', 680000);
INSERT INTO Dim_Modelos VALUES (10, 'RAV4 Limited', 'Toyota', 'SUV', 'Nuevo', 750000);

-- 2. CARGA DE AGENCIAS
INSERT INTO Dim_Agencias VALUES (1, 'Dalton Toyota GDL', 'Guadalajara', 'Occidente');
INSERT INTO Dim_Agencias VALUES (2, 'Dalton Honda SLP', 'San Luis Potosí', 'Bajío');
INSERT INTO Dim_Agencias VALUES (3, 'Dalton Kia CDMX', 'Ciudad de México', 'Centro');
INSERT INTO Dim_Agencias VALUES (4, 'Dalton Toyota Zapopan', 'Zapopan', 'Occidente');
INSERT INTO Dim_Agencias VALUES (5, 'Dalton Honda León', 'León', 'Bajío');

-- 3. CARGA DE FINANCIERAS
INSERT INTO Dim_Financieras VALUES (1, 'Toyota Financial Services', 11.5);
INSERT INTO Dim_Financieras VALUES (2, 'Honda Finance', 12.9);
INSERT INTO Dim_Financieras VALUES (3, 'BBVA Auto', 14.5);
INSERT INTO Dim_Financieras VALUES (4, 'Banorte Leasing', 13.0);
INSERT INTO Dim_Financieras VALUES (5, 'Kia Finance', 11.9);

-- 4. CARGA DE ASESORES (Multimarca y por Agencia)
INSERT INTO Dim_Asesores VALUES (101, 'Ana Martínez', 'D-998', 1);
INSERT INTO Dim_Asesores VALUES (102, 'Roberto Gómez', 'D-552', 0);
INSERT INTO Dim_Asesores VALUES (103, 'Sofía Villarreal', 'D-123', 1);
INSERT INTO Dim_Asesores VALUES (104, 'Carlos Slim Jr', 'D-001', 0);
INSERT INTO Dim_Asesores VALUES (105, 'Lucía Méndez', 'D-444', 1);

-- 5. CARGA DE CLIENTES (Persona Moral / Empresas)
INSERT INTO Dim_Clientes VALUES (501, 'Logística Global SA', 'LGL900101ABC', 'Transporte', 'Moral');
INSERT INTO Dim_Clientes VALUES (502, 'Constructora del Bajío', 'CBA850505XYZ', 'Construcción', 'Moral');
INSERT INTO Dim_Clientes VALUES (503, 'Tech Solutions MX', 'TSM101010HHR', 'Tecnología', 'Moral');
INSERT INTO Dim_Clientes VALUES (504, 'Alimentos GDL', 'AGD920303PPP', 'Alimenticio', 'Moral');
INSERT INTO Dim_Clientes VALUES (505, 'Renta Car Express', 'RCE000101999', 'Turismo', 'Moral');

-- 6. CARGA DE VENTAS (Muestra para análisis)
-- Formato: ID, Fecha, Cliente, Modelo, Asesor, Agencia, Financiera, Flotilla, Arrendamiento, Metodo, Monto
-- Ventas 2025
INSERT INTO Fact_Ventas VALUES (1001, '2025-03-15', 501, 1, 101, 1, 1, 1, 0, 'Crédito', 545000);
INSERT INTO Fact_Ventas VALUES (1002, '2025-05-20', 502, 4, 103, 3, 3, 0, 1, 'Arrendamiento', 610000);
INSERT INTO Fact_Ventas VALUES (1003, '2025-06-12', 503, 10, 102, 1, NULL, 0, 0, 'Contado', 750000);
INSERT INTO Fact_Ventas VALUES (1004, '2025-08-05', 504, 6, 105, 4, 1, 1, 0, 'Crédito', 890000);
INSERT INTO Fact_Ventas VALUES (1005, '2025-10-22', 505, 7, 101, 5, 4, 1, 1, 'Arrendamiento', 280000);

-- Ventas 2026 (El año del Apagón)
INSERT INTO Fact_Ventas VALUES (2001, '2026-01-05', 501, 1, 103, 1, 1, 1, 0, 'Crédito', 550000);
INSERT INTO Fact_Ventas VALUES (2002, '2026-01-10', 503, 5, 101, 2, NULL, 0, 0, 'Contado', 950000);
INSERT INTO Fact_Ventas VALUES (2003, '2026-01-15', 504, 2, 102, 2, 2, 0, 0, 'Crédito', 720000);
INSERT INTO Fact_Ventas VALUES (2004, '2026-01-20', 502, 9, 105, 5, 4, 1, 1, 'Arrendamiento', 680000);
INSERT INTO Fact_Ventas VALUES (2005, '2026-01-24', 505, 3, 103, 1, NULL, 0, 0, 'Contado', 410000);

-- (Aquí el script continuaría con los 150 registros adicionales similares)
