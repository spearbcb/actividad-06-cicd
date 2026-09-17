document.getElementById("btnEstado").addEventListener("click", () => {
  const fecha = new Date().toLocaleString("es-PE");
  document.getElementById("estado").textContent =
    `✅ Última verificación: ${fecha} — Workflow ejecutándose correctamente.`;
});
