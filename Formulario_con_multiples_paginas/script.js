document.addEventListener('DOMContentLoaded', () => {
    updateRecordList();
    navigatePage(1); 
});

let currentRecordId = null; 

function navigatePage(page) {
    const activePage = document.querySelector('.form-page.active');
    const targetPage = document.getElementById('page' + page);

    if (activePage) {
        activePage.classList.remove('active');
    }
    if (targetPage) {
        targetPage.classList.add('active');
    }

    document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
    const activeTab = document.querySelector(`.tab-item[data-page="${page}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    if (page === 5) {
        displayReviewData();
    }
}


function createDynamicRow(className, fields) {
    const row = document.createElement("div");
    row.className = className;

    let innerHTML = '';
    fields.forEach(field => {
        const type = field.type || 'text';
        const minAttr = field.min ? `min="${field.min}"` : '';
        innerHTML += `<input type="${type}" placeholder="${field.placeholder}" data-field="${field.dataField}" ${minAttr}>`;
    });

    innerHTML += `<button type="button" class="btn-remove" onclick="removeDynamicRow(this)">Eliminar</button>`;
    row.innerHTML = innerHTML;
    return row;
}

function addFamiliarRow() {
    const container = document.getElementById("familiares-container");
    const fields = [
        { placeholder: "Nombre", dataField: "nombre" },
        { placeholder: "Parentesco", dataField: "parentesco" },
        { placeholder: "Edad", dataField: "edad", type: "number", min: "0" }
    ];
    container.appendChild(createDynamicRow("familiar-row", fields));
}

function addCondicionRow() {
    const container = document.getElementById("condiciones-container");
    const fields = [
        { placeholder: "Enfermedad", dataField: "enfermedad" },
        { placeholder: "Tiempo con la enfermedad", dataField: "tiempo" }
    ];
    container.appendChild(createDynamicRow("condicion-row", fields));
}

function addInternamientoRow() {
    const container = document.getElementById("internamientos-container");
    const fields = [
        { placeholder: "Fecha", dataField: "fecha", type: "date" },
        { placeholder: "Centro Médico", dataField: "centro" },
        { placeholder: "Diagnóstico", dataField: "diagnostico" }
    ];
    container.appendChild(createDynamicRow("internamiento-row", fields));
}

function removeDynamicRow(btn) {
    btn.parentElement.remove();
}


function collectData() {
    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        cedula: document.getElementById("cedula").value.trim(), 
        edad: document.getElementById("edad").value,
        sexo: document.getElementById("sexo").value,            
        ocupacion: document.getElementById("ocupacion").value.trim(), 
        direccion: document.getElementById("direccion").value.trim(), 
        familiares: [],
        condiciones: [],
        internamientos: []
    };

    document.querySelectorAll("#familiares-container .familiar-row").forEach(row => {
        const inputs = row.querySelectorAll("input");
        if (inputs[0].value.trim()) { 
            datos.familiares.push({
                nombre: inputs[0].value.trim(),
                parentesco: inputs[1].value.trim(),
                edad: inputs[2].value
            });
        }
    });

    document.querySelectorAll("#condiciones-container .condicion-row").forEach(row => {
        const inputs = row.querySelectorAll("input");
        if (inputs[0].value.trim()) {
            datos.condiciones.push({
                enfermedad: inputs[0].value.trim(),
                tiempo: inputs[1].value.trim()
            });
        }
    });

    document.querySelectorAll("#internamientos-container .internamiento-row").forEach(row => {
        const inputs = row.querySelectorAll("input");
        if (inputs[0].value.trim()) { 
            datos.internamientos.push({
                fecha: inputs[0].value,
                centro: inputs[1].value.trim(),
                diagnostico: inputs[2].value.trim()
            });
        }
    });

    return datos;
}

function displayReviewData() {
    const data = collectData();
    const reviewDiv = document.getElementById("review-data");
    reviewDiv.innerHTML = `<h3>Datos a Grabar:</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
}


function getRecords() {
    return JSON.parse(localStorage.getItem("registros_salud")) || [];
}

function updateRecordList() {
    const registros = getRecords();
    const select = document.getElementById("selectRecord");
    select.innerHTML = '<option value="">Selecciona un registro</option>';

    registros.forEach((record, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${record.nombre} ${record.apellido} (${record.cedula}) - Reg #${index + 1}`;
        select.appendChild(option);
    });
}

function saveData() {
    const data = collectData();

    if (!data.nombre || !data.apellido || !data.cedula || !data.edad || !data.sexo) {
        alert("Por favor, complete los campos Nombre, Apellido, Cédula/ID, Edad y Sexo en la Página 1 antes de grabar.");
        navigatePage(1);
        return;
    }

    let registros = getRecords();

    if (currentRecordId !== null) {
        registros[currentRecordId] = data;
        alert(`Registro de ${data.nombre} ${data.apellido} actualizado exitosamente (ID: ${currentRecordId + 1}).`);
    } else {
        registros.push(data);
        alert(`Nuevo registro de ${data.nombre} ${data.apellido} grabado exitosamente.`);
    }

    localStorage.setItem("registros_salud", JSON.stringify(registros));
    updateRecordList();
    clearFormAndStartNew(); 
}

function loadRecordForEditing(index) {
    if (index === "") {
        clearFormAndStartNew();
        document.getElementById('recordStatus').textContent = '';
        return;
    }

    const registros = getRecords();
    const record = registros[parseInt(index)];

    if (!record) return;

    document.getElementById("nombre").value = record.nombre;
    document.getElementById("apellido").value = record.apellido;
    document.getElementById("cedula").value = record.cedula;
    document.getElementById("edad").value = record.edad;
    document.getElementById("sexo").value = record.sexo;    
    document.getElementById("ocupacion").value = record.ocupacion; 
    document.getElementById("direccion").value = record.direccion; 

    const familiaresContainer = document.getElementById("familiares-container");
    familiaresContainer.innerHTML = '';
    record.familiares.forEach(f => {
        addFamiliarRow(); 
        const lastRow = familiaresContainer.lastElementChild.querySelectorAll('input');
        lastRow[0].value = f.nombre;
        lastRow[1].value = f.parentesco;
        lastRow[2].value = f.edad;
    });

    if (record.familiares.length === 0) addFamiliarRow();

    const condicionesContainer = document.getElementById("condiciones-container");
    condicionesContainer.innerHTML = '';
    record.condiciones.forEach(c => {
        addCondicionRow();
        const lastRow = condicionesContainer.lastElementChild.querySelectorAll('input');
        lastRow[0].value = c.enfermedad;
        lastRow[1].value = c.tiempo;
    });
    if (record.condiciones.length === 0) addCondicionRow();

    const internamientosContainer = document.getElementById("internamientos-container");
    internamientosContainer.innerHTML = '';
    record.internamientos.forEach(i => {
        addInternamientoRow();
        const lastRow = internamientosContainer.lastElementChild.querySelectorAll('input');
        lastRow[0].value = i.fecha;
        lastRow[1].value = i.centro;
        lastRow[2].value = i.diagnostico;
    });
    if (record.internamientos.length === 0) addInternamientoRow();

    currentRecordId = parseInt(index);
    document.getElementById('recordStatus').textContent = `Editando: ${record.nombre} ${record.apellido}`;
    document.getElementById('saveBtn').textContent = 'Actualizar';
    
    navigatePage(1);
}

function clearFormAndStartNew() {
    document.getElementById('healthForm').reset(); 

    document.getElementById("familiares-container").innerHTML = '';
    addFamiliarRow();
    document.getElementById("condiciones-container").innerHTML = '';
    addCondicionRow();
    document.getElementById("internamientos-container").innerHTML = '';
    addInternamientoRow();

    currentRecordId = null;
    document.getElementById('selectRecord').value = "";
    document.getElementById('recordStatus').textContent = 'Creando Nuevo Registro';
    document.getElementById('saveBtn').textContent = 'Grabar';

    navigatePage(1);
}