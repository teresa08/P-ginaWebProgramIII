document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const email = document.getElementById("email").value.trim();
  const direccion = document.getElementById("direccion").value.trim();

  let vCard = `BEGIN:VCARD
VERSION:3.0
FN:${nombre}
TEL:${telefono}
EMAIL:${email}
ADR:${direccion}
END:VCARD`;

  document.getElementById("qrcode").innerHTML = '';

  new QRCode(document.getElementById("qrcode"), {
    text: `text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`,
    width: 200,
    height: 200,
    correctLevel: QRCode.CorrectLevel.H
  });
});


function clearForm() {
    document.getElementById("contactForm").reset();
    
    document.getElementById("qrcode").innerHTML = '';
    
    alert("Formulario limpiado.");
}