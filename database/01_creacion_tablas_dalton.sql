-- =============================================
-- Script: Creación de Tablas Base - Dalton
-- Nivel: 0 y Básico
-- Objetivo: Establecer la estructura para el análisis de ventas.
-- =============================================

-- 1. Tabla de Catálogo de Modelos (Marcas como Toyota, Honda, etc.)
CREATE TABLE Catalogo_Modelos (
    ModeloID INT PRIMARY KEY,
    NombreModelo VARCHAR(100),
    Marca VARCHAR(50), 
    TipoVehiculo VARCHAR(50) -- Ejemplo: Sedán, SUV, Pickup
);

-- 2. Tabla de Inventario de Autos
CREATE TABLE Inventario_Autos (
    AutoID INT PRIMARY KEY,
    ModeloID INT,
    Color VARCHAR(30),
    PrecioLista DECIMAL(18, 2),
    Estatus VARCHAR(20), -- Disponible, Vendido, Apartado
    FOREIGN KEY (ModeloID) REFERENCES Catalogo_Modelos(ModeloID)
);

-- 3. Tabla de Ventas (El corazón del análisis)
CREATE TABLE Ventas_Dalton (
    VentaID INT PRIMARY KEY,
    AgenciaID INT, -- 1: GDL, 2: SLP, 3: MEX
    AutoID INT,
    FechaVenta DATE,
    MontoTotal DECIMAL(18, 2),
    VendedorID INT,
    FOREIGN KEY (AutoID) REFERENCES Inventario_Autos(AutoID)
);
