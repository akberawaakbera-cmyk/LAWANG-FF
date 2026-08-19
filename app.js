const pages = document.querySelectorAll(".page");
const tabs = document.querySelectorAll(".tab");

function showPage(pageName) {
  pages.forEach(page => {
    page.classList.toggle("active", page.id === pageName);
  });

  tabs.forEach(tab => {
    tab.classList.toggle(
      "active",
      tab.dataset.page === pageName
    );
  });
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    showPage(tab.dataset.page);
  });
});

document.querySelectorAll("[data-page-target]").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.pageTarget);
  });
});


/* POV */

const pov = document.getElementById("pov");
const povValue = document.getElementById("povValue");

pov.addEventListener("input", () => {
  povValue.textContent = `${pov.value}°`;
});


/* SPEED */

const speed = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");

speed.addEventListener("input", () => {
  speedValue.textContent =
    `${Number(speed.value).toFixed(1)}x`;
});


/* ACTIVE TEST COUNT */

const enabledCount = document.getElementById("enabledCount");

function updateCount() {
  const active =
    document.querySelectorAll(
      'input[data-test]:checked'
    ).length;

  enabledCount.textContent = active;
}

document.querySelectorAll("input[data-test]").forEach(input => {
  input.addEventListener("change", updateCount);
});


/* APPLY */

const message = document.getElementById("message");

document.getElementById("apply").addEventListener("click", () => {

  const active =
    document.querySelectorAll(
      'input[data-test]:checked'
    ).length;

  message.textContent =
    `${active} test option(s) configured.`;

  document.getElementById("statusText").textContent =
    "TEST CONFIG READY";
});


/* RESET */

document.getElementById("reset").addEventListener("click", () => {

  document.querySelectorAll(
    'input[data-test]'
  ).forEach(input => {
    input.checked = false;
  });

  pov.value = 90;
  speed.value = 1;

  povValue.textContent = "90°";
  speedValue.textContent = "1.0x";

  updateCount();

  message.textContent =
    "Configuration reset.";

  document.getElementById("statusText").textContent =
    "TEST MODE READY";
});


/* PROFILES */

const profileName =
  document.getElementById("profileName");

const profilesList =
  document.getElementById("profilesList");

let profiles =
  JSON.parse(
    localStorage.getItem("testProfiles") || "[]"
  );

function renderProfiles() {

  profilesList.innerHTML = "";

  profiles.forEach((profile, index) => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <div class="profile">
        <strong>${profile}</strong>
        <button
          class="delete-profile"
          data-index="${index}">
          DELETE
        </button>
      </div>
    `;

    profilesList.appendChild(card);
  });

  document.getElementById("profileCount")
    .textContent = profiles.length;

  document.querySelectorAll(".delete-profile")
    .forEach(button => {

      button.addEventListener("click", () => {

        profiles.splice(
          Number(button.dataset.index),
          1
        );

        localStorage.setItem(
          "testProfiles",
          JSON.stringify(profiles)
        );

        renderProfiles();
      });

    });
}

document.getElementById("saveProfile")
  .addEventListener("click", () => {

    const name = profileName.value.trim();

    if (!name) return;

    profiles.push(name);

    localStorage.setItem(
      "testProfiles",
      JSON.stringify(profiles)
    );

    profileName.value = "";

    renderProfiles();
  });

renderProfiles();