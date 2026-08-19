const screens = document.querySelectorAll(".app-screen");
const navigationButtons = document.querySelectorAll(
  "[data-screen]"
);

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

const loginScreen =
  document.getElementById("loginScreen");

const app =
  document.getElementById("app");

const loginButton =
  document.getElementById("loginButton");

const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const loginMessage =
  document.getElementById("loginMessage");

loginButton.addEventListener("click", () => {

  const username =
    usernameInput.value.trim();

  const password =
    passwordInput.value.trim();

  if (!username || !password) {

    loginMessage.textContent =
      "Please enter username and password.";

    return;
  }

  localStorage.setItem(
    "lawangUser",
    username
  );

  document.getElementById(
    "profileName"
  ).textContent = username;

  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");

  openScreen("homeScreen");
});


/* ================= NAVIGATION ================= */

document
  .querySelectorAll("[data-screen]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const target =
        button.dataset.screen;

      openScreen(target);
    });

  });


/* ================= BACK BUTTONS ================= */

document
  .querySelectorAll(".back-button")
  .forEach(button => {

    button.addEventListener("click", () => {

      openScreen("selectionScreen");

    });

  });


/* ================= PROFILE ================= */

document
  .getElementById("profileButton")
  .addEventListener("click", () => {

    openScreen("profileScreen");

  });


/* ================= POV ================= */

const povSlider =
  document.getElementById("povSlider");

const povValue =
  document.getElementById("povValue");

povSlider.addEventListener("input", () => {

  povValue.textContent =
    `${povSlider.value}°`;

});


/* ================= SPEED ================= */

const speedSlider =
  document.getElementById("speedSlider");

const speedValue =
  document.getElementById("speedValue");

speedSlider.addEventListener("input", () => {

  speedValue.textContent =
    `${Number(speedSlider.value).toFixed(1)}x`;

});


/* ================= ACTIVE TESTS ================= */

const testInputs =
  document.querySelectorAll(
    "input[data-test]"
  );

function getActiveTests() {

  return document.querySelectorAll(
    "input[data-test]:checked"
  ).length;

}

function updateActiveCount() {

  const count =
    getActiveTests();

  const activeCount =
    document.getElementById("activeCount");

  if (activeCount) {

    activeCount.textContent =
      `${count} Active`;

  }

}

testInputs.forEach(input => {

  input.addEventListener(
    "change",
    updateActiveCount
  );

});


/* ================= APPLY CONFIG ================= */

document
  .getElementById("applyConfig")
  .addEventListener("click", () => {

    const count =
      getActiveTests();

    localStorage.setItem(
      "activeTests",
      count
    );

    addLog(
      `${count} test option(s) configured`
    );

    openScreen("logsScreen");

  });


/* ================= RESET ================= */

document
  .getElementById("resetConfig")
  .addEventListener("click", () => {

    testInputs.forEach(input => {

      input.checked = false;

    });

    povSlider.value = 90;
    speedSlider.value = 1;

    povValue.textContent = "90°";
    speedValue.textContent = "1.0x";

    updateActiveCount();

    addLog("Test configuration reset");

  });


/* ================= LOGS ================= */

const logsContainer =
  document.getElementById(
    "logsContainer"
  );

function addLog(text) {

  if (!logsContainer) return;

  const empty =
    logsContainer.querySelector(
      ".empty-log"
    );

  if (empty) {
    empty.remove();
  }

  const item =
    document.createElement("div");

  item.className = "log-item";

  item.innerHTML = `
    <strong>${text}</strong>
    <small>${new Date().toLocaleTimeString()}</small>
  `;

  logsContainer.prepend(item);

}


/* ================= LOGOUT ================= */

function logout() {

  localStorage.removeItem(
    "lawangUser"
  );

  app.classList.add("hidden");
  loginScreen.classList.remove("hidden");

  usernameInput.value = "";
  passwordInput.value = "";

  openScreen("homeScreen");

}

document
  .getElementById("logoutButton")
  .addEventListener(
    "click",
    logout
  );


document
  .getElementById("logoutBtn")
  ?.addEventListener(
    "click",
    logout
  );


/* ================= SAVED LOGIN ================= */

const savedUser =
  localStorage.getItem(
    "lawangUser"
  );

if (savedUser) {

  document.getElementById(
    "profileName"
  ).textContent = savedUser;

  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");

  openScreen("homeScreen");

}


/* ================= INITIAL STATE ================= */

updateActiveCount();