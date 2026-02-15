const API_URL = "http://localhost:3000";

// --- Registrar paciente ---
document.getElementById("patientForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        full_name: document.getElementById("full_name").value,
        rut: document.getElementById("rut").value,
        birth_date: document.getElementById("birth_date").value,
        sex: document.getElementById("sex").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value
    };

    await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    loadPatients();
    e.target.reset();
});

// --- Cargar pacientes ---
async function loadPatients() {
    const res = await fetch(`${API_URL}/patients`);
    const patients = await res.json();

    const tbody = document.querySelector("#patientsTable tbody");
    tbody.innerHTML = "";

    patients.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.full_name}</td>
                <td>${p.rut}</td>
                <td>${p.phone || "-"}</td>
            </tr>
        `;
    });
}

loadPatients();
