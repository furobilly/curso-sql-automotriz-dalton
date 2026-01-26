-- ==========================================================
-- EL CÓDICE DALTON: SEMILLERO DE DATOS (RESTAURACIÓN v1.0)
-- Enero 2026 - Analista: Toño
-- ==========================================================

-- 1. TABLA: Catálogo de Modelos (La esencia)
CREATE TABLE Dim_Modelos (
    ModeloID INTEGER PRIMARY KEY,
    Nombre_Modelo TEXT,
    Marca TEXT, -- Toyota, Honda, Kia, etc.
    Segmento TEXT, -- SUV, Pickup, Sedán
    Tipo_Unidad TEXT, -- Nuevo, Seminuevo
    Precio_Lista REAL
);

-- 2. TABLA: Agencias (El territorio)
CREATE TABLE Dim_Agencias (
    AgenciaID INTEGER PRIMARY KEY,
    Nombre_Agencia TEXT, -- Dalton Toyota GDL, Dalton Honda SLP, etc.
    Ciudad TEXT,
    Region TEXT -- Occidente, Bajío, Centro
);

-- 3. TABLA: Financieras (El respaldo)
CREATE TABLE Dim_Financieras (
    FinancieraID INTEGER PRIMARY KEY,
    Nombre_Entidad TEXT, -- BBVA, Toyota Financial Services, Banorte
    Tasa_Interes REAL
);

-- 4. TABLA: Asesores (Los guerreros)
CREATE TABLE Dim_Asesores (
    AsesorID INTEGER PRIMARY KEY,
    Nombre_Asesor TEXT,
    Nomina TEXT,
    Es_Multimarca INTEGER -- 1 = Sí, 0 = No
);

-- 5. TABLA: Clientes (Persona Moral y Flotillas)
CREATE TABLE Dim_Clientes (
    ClienteID INTEGER PRIMARY KEY,
    Nombre_Empresa TEXT,
    RFC TEXT,
    Giro_Comercial TEXT, -- Logística, Alimentos, Construcción
    Tipo_Persona TEXT -- Moral (obligatorio para este nivel)
);

-- 6. TABLA: Ventas Master (Tabla de Hechos - El Corazón)
CREATE TABLE Fact_Ventas (
    VentaID INTEGER PRIMARY KEY,
    Fecha TEXT, -- Formato AAAA-MM-DD
    ClienteID INTEGER,
    ModeloID INTEGER,
    AsesorID INTEGER,
    AgenciaID INTEGER,
    FinancieraID INTEGER, -- NULL si es Contado
    Es_Flotilla INTEGER, -- 1 = Sí, 0 = No
    Es_Arrendamiento INTEGER, -- 1 = Sí, 0 = No
    Metodo_Pago TEXT, -- Crédito, Contado, Arrendamiento
    Monto_Final REAL,
    FOREIGN KEY (ClienteID) REFERENCES Dim_Clientes(ClienteID),
    FOREIGN KEY (ModeloID) REFERENCES Dim_Modelos(ModeloID),
    FOREIGN KEY (AsesorID) REFERENCES Dim_Asesores(AsesorID),
    FOREIGN KEY (AgenciaID) REFERENCES Dim_Agencias(AgenciaID),
    FOREIGN KEY (FinancieraID) REFERENCES Dim_Financieras(FinancieraID)
);

-- ==========================================================
-- CARGA DE DATOS (MUESTRA DE RESTAURACIÓN 2025-2026)
-- ==========================================================

INSERT INTO Dim_Modelos VALUES (1, 'Hilux Doble Cabina', 'Toyota', 'Pickup', 'Nuevo', 550000.00);
INSERT INTO Dim_Modelos VALUES (2, 'CR-V Turbo', 'Honda', 'SUV', 'Nuevo', 720000.00);
INSERT INTO Dim_Modelos VALUES (3, 'Corolla Hybrid', 'Toyota', 'Sedán', 'Seminuevo', 410000.00);

INSERT INTO Dim_Agencias VALUES (1, 'Dalton Toyota GDL', 'Guadalajara', 'Occidente');
INSERT INTO Dim_Agencias VALUES (2, 'Dalton Honda SLP', 'San Luis Potosí', 'Bajío');

INSERT INTO Dim_Asesores VALUES (101, 'Ana Martínez', 'D-998', 1); -- Ana es multimarca
INSERT INTO Dim_Asesores VALUES (102, 'Roberto Gómez', 'D-552', 0);

INSERT INTO Dim_Clientes VALUES (501, 'Logística Global SA', 'LGL900101ABC', 'Transporte', 'Moral');
INSERT INTO Dim_Clientes VALUES (502, 'Constructora del Bajío', 'CBA850505XYZ', 'Construcción', 'Moral');

INSERT INTO Dim_Financieras VALUES (1, 'Toyota Financial', 12.5);
INSERT INTO Dim_Financieras VALUES (2, 'BBVA', 14.2);

-- Ventas de 2025 y 2026
INSERT INTO Fact_Ventas VALUES (1001, '2025-11-15', 501, 1, 101, 1, 1, 1, 0, 'Crédito', 545000.00);
INSERT INTO Fact_Ventas VALUES (1002, '2026-01-20', 502, 2, 102, 2, NULL, 0, 1, 'Arrendamiento', 720000.00);
