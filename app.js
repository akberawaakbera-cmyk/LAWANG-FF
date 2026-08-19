/* =========================================================
   LAWANGEN INJECTOR
   Developer Test Interface — UI/SIMULATION ONLY
========================================================= */


/* ================= GLOBAL ================= */

const screens = document.querySelectorAll(".app-screen");
const navigationButtons = document.querySelectorAll("[data-screen]");

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

function openScreen(screenId) {
  screens.forEach(screen => {
    screen.classList.toggle(
      "active",
      screen.id === screenId
    );
  });

  navigationButtons.forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.screen === screenId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
}


/* ================= LOGIN ================= */

const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

loginButton?.addEventListener("click", () => {

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    loginMessage.textContent =
      "Please enter username and password.";
    return;
  }

  /*
    Demo login only.
    No real authentication backend is used.
  */

  localStorage.setItem("lawangenUser", username);

  updateProfile(username);

  loginMessage.textContent = "";

  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");

  openScreen("homeScreen");

  addLog("Developer test login successful");

});


/* ================= PROFILE ================= */

function updateProfile(username) {

  const profileName =
    document.getElementById("profileName");

  if (profileName) {
    profileName.textContent = username;
  }

  const avatar =
    document.querySelector(".avatar");

  if (avatar && username) {
    avatar.textContent =
      username.charAt(0).toUpperCase();
  }

}


/* ================= NAVIGATION ================= */

document
  .querySelectorAll("[data-screen]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const target = button.dataset.screen;

      if (target) {
        openScreen(target);
      }

    });

  });


/* ================= PROFILE BUTTON ================= */

document
  .getElementById("profileButton")
  ?.addEventListener("click", () => {

    openScreen("profileScreen");

  });


/* ================= BACK BUTTONS ================= */

document
  .querySelectorAll(".back-button")
  .forEach(button => {

    button.addEventListener("click", () => {

      openScreen("selectionScreen");

    });

  });


/* ================= POV ================= */

const povSlider =
  document.getElementById("povSlider");

const povValue =
  document.getElementById("povValue");

povSlider?.addEventListener("input", () => {

  povValue.textContent =
    `${povSlider.value}°`;

});


/* ================= SPEED ================= */

const speedSlider =
  document.getElementById("speedSlider");

const speedValue =
  document.getElementById("speedValue");

speedSlider?.addEventListener("input", () => {

  speedValue.textContent =
    `${Number(speedSlider.value).toFixed(1)}x`;

});


/* ================= TEST OPTIONS ================= */

const testInputs =
  document.querySelectorAll("input[data-test]");

function getActiveTests() {

  return document.querySelectorAll(
    "input[data-test]:checked"
  ).length;

}

function updateActiveCount() {

  const activeCount =
    document.getElementById("activeCount");

  if (activeCount) {
    activeCount.textContent =
      `${getActiveTests()} Active`;
  }

}


testInputs.forEach(input => {

  input.addEventListener("change", () => {

    updateActiveCount();

    const name =
      input.dataset.name || "Test option";

    addLog(
      `${name}: ${input.checked ? "ENABLED" : "DISABLED"}`
    );

  });

});


/* ================= APPLY ================= */

document
  .getElementById("applyConfig")
  ?.addEventListener("click", () => {

    const configuration = {

      activeTests:
        Array.from(
          document.querySelectorAll(
            "input[data-test]:checked"
          )
        ).map(
          input =>
            input.dataset.name || "Test"
        ),

      pov:
        povSlider
          ? Number(povSlider.value)
          : 90,

      speed:
        speedSlider
          ? Number(speedSlider.value)
          : 1

    };

    localStorage.setItem(
      "lawangenTestConfig",
      JSON.stringify(configuration)
    );

    addLog(
      `${configuration.activeTests.length} test option(s) configured`
    );

    const statusText =
      document.getElementById("statusText");

    if (statusText) {
      statusText.textContent =
        "TEST CONFIG READY";
    }

    openScreen("logsScreen");

  });


/* ================= RESET ================= */

document
  .getElementById("resetConfig")
  ?.addEventListener("click", () => {

    testInputs.forEach(input => {
      input.checked = false;
    });

    if (povSlider) {
      povSlider.value = 90;
    }

    if (speedSlider) {
      speedSlider.value = 1;
    }

    if (povValue) {
      povValue.textContent = "90°";
    }

    if (speedValue) {
      speedValue.textContent = "1.0x";
    }

    localStorage.removeItem(
      "lawangenTestConfig"
    );

    updateActiveCount();

    addLog("Test configuration reset");

  });


/* ================= LOG SYSTEM ================= */

const logsContainer =
  document.getElementById("logsContainer");

function addLog(text) {

  if (!logsContainer) return;

  const empty =
    logsContainer.querySelector(".empty-log");

  if (empty) {
    empty.remove();
  }

  const item =
    document.createElement("div");

  item.className = "log-item";

  const strong =
    document.createElement("strong");

  strong.textContent = text;

  const small =
    document.createElement("small");

  small.textContent =
    new Date().toLocaleTimeString();

  item.appendChild(strong);
  item.appendChild(small);

  logsContainer.prepend(item);

}


/* ================= SIMULATION EVENTS ================= */

document
  .querySelectorAll(".test-trigger")
  .forEach(button => {

    button.addEventListener("click", () => {

      const eventName =
        button.dataset.event || "TEST_EVENT";

      addLog(
        `Simulation event: ${eventName}`
      );

      const statusText =
        document.getElementById("statusText");

      if (statusText) {
        statusText.textContent =
          "SIMULATION EVENT GENERATED";
      }

      button.textContent = "DONE";

      setTimeout(() => {
        button.textContent = "TEST";
      }, 900);

    });

  });


/* ================= CLEAR LOGS ================= */

document
  .getElementById("clearLogs")
  ?.addEventListener("click", () => {

    if (!logsContainer) return;

    logsContainer.innerHTML = `
      <div class="empty-log">
        No test activity yet.
      </div>
    `;

  });


/* ================= LOGOUT ================= */

function logout() {

  localStorage.removeItem("lawangenUser");

  app.classList.add("hidden");
  loginScreen.classList.remove("hidden");

  usernameInput.value = "";
  passwordInput.value = "";

  loginMessage.textContent = "";

  openScreen("homeScreen");

}


document
  .getElementById("logoutButton")
  ?.addEventListener("click", logout);

document
  .getElementById("logoutButtonSettings")
  ?.addEventListener("click", logout);


/* ================= LOAD CONFIG ================= */

function loadConfiguration() {

  const saved =
    JSON.parse(
      localStorage.getItem(
        "lawangenTestConfig"
      ) || "null"
    );

  if (!saved) return;


  if (
    povSlider &&
    typeof saved.pov === "number"
  ) {

    povSlider.value = saved.pov;

    povValue.textContent =
      `${saved.pov}°`;

  }


  if (
    speedSlider &&
    typeof saved.speed === "number"
  ) {

    speedSlider.value = saved.speed;

    speedValue.textContent =
      `${Number(saved.speed).toFixed(1)}x`;

  }


  if (Array.isArray(saved.activeTests)) {

    testInputs.forEach(input => {

      input.checked =
        saved.activeTests.includes(
          input.dataset.name
        );

    });

  }

  updateActiveCount();

}


/* ================= SAVED LOGIN ================= */

const savedUser =
  localStorage.getItem("lawangenUser");

if (savedUser) {

  updateProfile(savedUser);

  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");

  openScreen("homeScreen");

}


/* ================= INITIAL ================= */

loadConfiguration();
updateActiveCount();