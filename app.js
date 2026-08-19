const pov = document.getElementById("pov");
const speed = document.getElementById("speed");

const povValue = document.getElementById("povValue");
const speedValue = document.getElementById("speedValue");

const apply = document.getElementById("apply");
const reset = document.getElementById("reset");
const message = document.getElementById("message");

pov.addEventListener("input", () => {
  povValue.textContent = `${pov.value}°`;
});

speed.addEventListener("input", () => {
  speedValue.textContent = `${Number(speed.value).toFixed(1)}x`;
});

apply.addEventListener("click", () => {
  message.textContent =
    "Test configuration saved locally. No game connection.";
});

reset.addEventListener("click", () => {
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.checked = false;
  });

  pov.value = 90;
  speed.value = 1;

  povValue.textContent = "90°";
  speedValue.textContent = "1.0x";

  message.textContent = "Configuration reset.";
});