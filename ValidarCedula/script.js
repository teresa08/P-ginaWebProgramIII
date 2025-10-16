function validarCedula() {
  const input = document.getElementById("cedula");
  const resultadoDiv = document.getElementById("resultado");
  let cedula = input.value.trim();
  cedula = cedula.replace(/\D/g, "");
  if (cedula.length !== 11) {
    resultadoDiv.className = "incorrecta";
    resultadoDiv.textContent = "CÉDULA ES INCORRECTA";
    return;
  }
  if (!/^\d{11}$/.test(cedula)) {
    resultadoDiv.className = "incorrecta";
    resultadoDiv.textContent = "CÉDULA ES INCORRECTA";
    return;
  }

  const digitos = cedula.substring(0, 10).split('').map(Number);
  const verificadorReal = parseInt(cedula[10], 10);

  const coeficientes = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];

  let suma = 0;
  for (let i = 0; i < 10; i++) {
    let producto = digitos[i] * coeficientes[i];
    if (producto >= 10) {
      producto = Math.floor(producto / 10) + (producto % 10);
    }
    suma += producto;
  }

  const modulo = suma % 10;
  const verificadorCalculado = modulo === 0 ? 0 : 10 - modulo;

  if (verificadorCalculado === verificadorReal) {
    resultadoDiv.className = "correcta";
    resultadoDiv.textContent = "CÉDULA ES CORRECTA";
  } else {
    resultadoDiv.className = "incorrecta";
    resultadoDiv.textContent = "CÉDULA ES INCORRECTA";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const inputCedula = document.getElementById("cedula");
  if (inputCedula) {
    inputCedula.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        validarCedula();
      }
    });
  }
});