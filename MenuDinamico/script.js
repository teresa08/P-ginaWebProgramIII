const menuContainer = document.getElementById("menu");
const form = document.getElementById("form");
const padreSelect = document.getElementById("padre");
const hamburger = document.getElementById("hamburger");
const itemSelect = document.getElementById("itemSelect");
const nuevoNombre = document.getElementById("nuevoNombre");
const nuevoEnlace = document.getElementById("nuevoEnlace");
const btnActualizar = document.getElementById("btnActualizar");
const btnEliminar = document.getElementById("btnEliminar");

let menuData = [];

fetch("menu.json")
  .then(res => res.json())
  .then(data => {
    menuData = data.menu;
    renderMenu();
    updateSelects();
  })
  .catch(() => {
    console.error("Error al cargar menu.json");
  });

function renderMenu() {
  menuContainer.innerHTML = "";
  menuData.forEach(item => {
    const li = createMenuItem(item);
    menuContainer.appendChild(li);
  });
}

function createMenuItem(item) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.textContent = item.nombre;
  a.href = item.enlace || "#";
  li.appendChild(a);

  if (item.submenu && item.submenu.length > 0) {
    const ul = document.createElement("ul");
    item.submenu.forEach(sub => {
      ul.appendChild(createMenuItem(sub));
    });
    li.appendChild(ul);
  }

  return li;
}

function updateSelects() {
  padreSelect.innerHTML = '<option value="">-- Sin padre (principal) --</option>';
  itemSelect.innerHTML = '<option value="">Seleccione un ítem</option>';

  const fillOptions = (items, prefix = "") => {
    items.forEach(item => {
      const option1 = document.createElement("option");
      option1.value = item.id;
      option1.textContent = prefix + item.nombre;
      padreSelect.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = item.id;
      option2.textContent = prefix + item.nombre;
      itemSelect.appendChild(option2);

      if (item.submenu) fillOptions(item.submenu, prefix + "-- ");
    });
  };

  fillOptions(menuData);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const enlace = document.getElementById("enlace").value.trim();
  const padre = padreSelect.value;

  const newItem = { id: Date.now(), nombre, enlace, submenu: [] };

  if (padre) {
    const parentItem = findItemById(padre, menuData);
    if (!parentItem.submenu) parentItem.submenu = [];
    parentItem.submenu.push(newItem);
  } else {
    menuData.push(newItem);
  }

  renderMenu();
  updateSelects();
  form.reset();
});

function findItemById(id, items) {
  for (let item of items) {
    if (item.id == id) return item;
    if (item.submenu) {
      const found = findItemById(id, item.submenu);
      if (found) return found;
    }
  }
  return null;
}

btnActualizar.addEventListener("click", () => {
  const id = itemSelect.value;
  if (!id) return alert("Seleccione un ítem para actualizar.");

  const item = findItemById(id, menuData);
  if (item) {
    if (nuevoNombre.value) item.nombre = nuevoNombre.value;
    if (nuevoEnlace.value) item.enlace = nuevoEnlace.value;
    renderMenu();
    updateSelects();
    alert("Ítem actualizado correctamente.");
  }
});

btnEliminar.addEventListener("click", () => {
  const id = itemSelect.value;
  if (!id) return alert("Seleccione un ítem para eliminar.");

  if (confirm("¿Seguro que desea eliminar este ítem?")) {
    menuData = deleteItemById(id, menuData);
    renderMenu();
    updateSelects();
    alert("Ítem eliminado correctamente.");
  }
});
 
function deleteItemById(id, items) {
  return items.filter(item => {
    if (item.submenu) item.submenu = deleteItemById(id, item.submenu);
    return item.id != id;
  });
}

hamburger.addEventListener("click", () => {
  menuContainer.classList.toggle("active");
});
