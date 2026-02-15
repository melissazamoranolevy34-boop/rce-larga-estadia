import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// --- "Base de datos" en memoria ---
let patients = [];
let medications = [];
let medicationOrders = [];
let medicationAdministrations = [];
let inventory = [];
let nextId = 1;

// --- Pacientes ---

app.get("/patients", (req, res) => {
  res.json(patients);
});

app.post("/patients", (req, res) => {
  const patient = {
    id: nextId++,
    full_name: req.body.full_name,
    rut: req.body.rut,
    birth_date: req.body.birth_date,
    sex: req.body.sex,
    phone: req.body.phone,
    address: req.body.address,
    admission_date: req.body.admission_date,
    legal_responsible: req.body.legal_responsible,
    emergency_contact: req.body.emergency_contact,
    diagnoses: req.body.diagnoses,
    allergies: req.body.allergies,
    dependency_level: req.body.dependency_level,
    mobility: req.body.mobility,
    feeding: req.body.feeding,
    risks: req.body.risks
  };
  patients.push(patient);
  res.json(patient);
});

// --- Medicamentos (catálogo) ---

app.get("/medications", (req, res) => {
  res.json(medications);
});

app.post("/medications", (req, res) => {
  const med = {
    id: nextId++,
    name: req.body.name,
    presentation: req.body.presentation,
    route: req.body.route
  };
  medications.push(med);
  inventory.push({
    medicationId: med.id,
    stock: req.body.initial_stock || 0,
    min_stock: req.body.min_stock || 0
  });
  res.json(med);
});

// --- Inventario ---

app.get("/inventory", (req, res) => {
  const detailed = inventory.map((item) => {
    const med = medications.find((m) => m.id === item.medicationId);
    return {
      medicationId: item.medicationId,
      name: med?.name,
      presentation: med?.presentation,
      stock: item.stock,
      min_stock: item.min_stock
    };
  });
  res.json(detailed);
});

app.post("/inventory/add", (req, res) => {
  const { medicationId, quantity } = req.body;
  const item = inventory.find((i) => i.medicationId === medicationId);
  if (!item) return res.status(404).json({ error: "Medicamento no encontrado en inventario" });
  item.stock += quantity;
  res.json(item);
});

// --- Indicaciones de medicamentos por paciente ---

app.get("/patients/:id/medication-orders", (req, res) => {
  const patientId = Number(req.params.id);
  const orders = medicationOrders.filter((o) => o.patientId === patientId);
  res.json(orders);
});

app.post("/patients/:id/medication-orders", (req, res) => {
  const patientId = Number(req.params.id);
  const order = {
    id: nextId++,
    patientId,
    medicationId: req.body.medicationId,
    dose: req.body.dose,
    frequency: req.body.frequency,
    route: req.body.route,
    schedule: req.body.schedule,
    notes: req.body.notes
  };
  medicationOrders.push(order);
  res.json(order);
});

// --- Administración de medicamentos ---

app.get("/patients/:id/medication-administrations", (req, res) => {
  const patientId = Number(req.params.id);
  const admin = medicationAdministrations.filter((a) => a.patientId === patientId);
  res.json(admin);
});

app.post("/patients/:id/medication-administrations", (req, res) => {
  const patientId = Number(req.params.id);
  const { medicationId, dose, administered_by, datetime } = req.body;

  const invItem = inventory.find((i) => i.medicationId === medicationId);
  if (!invItem) return res.status(404).json({ error: "Medicamento sin inventario" });
  if (invItem.stock <= 0) return res.status(400).json({ error: "Sin stock" });

  invItem.stock -= 1;

  const admin = {
    id: nextId++,
    patientId,
    medicationId,
    dose,
    administered_by,
    datetime: datetime || new Date().toISOString()
  };
  medicationAdministrations.push(admin);
  res.json({ admin, inventory: invItem });
});

// --- Servidor ---

const PORT = 3000;
app.listen(PORT, () => {
  console.log("RCE simple corriendo en puerto " + PORT);
});
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// --- "Base de datos" en memoria ---
let patients = [];
let medications = [];
let medicationOrders = [];
let medicationAdministrations = [];
let inventory = [];
let nextId = 1;

// --- Pacientes ---

app.get("/patients", (req, res) => {
  res.json(patients);
});

app.post("/patients", (req, res) => {
  const patient = {
    id: nextId++,
    full_name: req.body.full_name,
    rut: req.body.rut,
    birth_date: req.body.birth_date,
    sex: req.body.sex,
    phone: req.body.phone,
    address: req.body.address,
    admission_date: req.body.admission_date,
    legal_responsible: req.body.legal_responsible,
    emergency_contact: req.body.emergency_contact,
    diagnoses: req.body.diagnoses,
    allergies: req.body.allergies,
    dependency_level: req.body.dependency_level,
    mobility: req.body.mobility,
    feeding: req.body.feeding,
    risks: req.body.risks
  };
  patients.push(patient);
  res.json(patient);
});

// --- Medicamentos (catálogo) ---

app.get("/medications", (req, res) => {
  res.json(medications);
});

app.post("/medications", (req, res) => {
  const med = {
    id: nextId++,
    name: req.body.name,
    presentation: req.body.presentation,
    route: req.body.route
  };
  medications.push(med);
  inventory.push({
    medicationId: med.id,
    stock: req.body.initial_stock || 0,
    min_stock: req.body.min_stock || 0
  });
  res.json(med);
});

// --- Inventario ---

app.get("/inventory", (req, res) => {
  const detailed = inventory.map((item) => {
    const med = medications.find((m) => m.id === item.medicationId);
    return {
      medicationId: item.medicationId,
      name: med?.name,
      presentation: med?.presentation,
      stock: item.stock,
      min_stock: item.min_stock
    };
  });
  res.json(detailed);
});

app.post("/inventory/add", (req, res) => {
  const { medicationId, quantity } = req.body;
  const item = inventory.find((i) => i.medicationId === medicationId);
  if (!item) return res.status(404).json({ error: "Medicamento no encontrado en inventario" });
  item.stock += quantity;
  res.json(item);
});

// --- Indicaciones de medicamentos por paciente ---

app.get("/patients/:id/medication-orders", (req, res) => {
  const patientId = Number(req.params.id);
  const orders = medicationOrders.filter((o) => o.patientId === patientId);
  res.json(orders);
});

app.post("/patients/:id/medication-orders", (req, res) => {
  const patientId = Number(req.params.id);
  const order = {
    id: nextId++,
    patientId,
    medicationId: req.body.medicationId,
    dose: req.body.dose,
    frequency: req.body.frequency,
    route: req.body.route,
    schedule: req.body.schedule,
    notes: req.body.notes
  };
  medicationOrders.push(order);
  res.json(order);
});

// --- Administración de medicamentos ---

app.get("/patients/:id/medication-administrations", (req, res) => {
  const patientId = Number(req.params.id);
  const admin = medicationAdministrations.filter((a) => a.patientId === patientId);
  res.json(admin);
});

app.post("/patients/:id/medication-administrations", (req, res) => {
  const patientId = Number(req.params.id);
  const { medicationId, dose, administered_by, datetime } = req.body;

  const invItem = inventory.find((i) => i.medicationId === medicationId);
  if (!invItem) return res.status(404).json({ error: "Medicamento sin inventario" });
  if (invItem.stock <= 0) return res.status(400).json({ error: "Sin stock" });

  invItem.stock -= 1;

  const admin = {
    id: nextId++,
    patientId,
    medicationId,
    dose,
    administered_by,
    datetime: datetime || new Date().toISOString()
  };
  medicationAdministrations.push(admin);
  res.json({ admin, inventory: invItem });
});

// --- Servidor ---

const PORT = 3000;
app.listen(PORT, () => {
  console.log("RCE simple corriendo en puerto 3000");
});
