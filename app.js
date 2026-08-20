/* =========================================================
   LAWANGEN INJECTOR
   Developer / Admin Panel
========================================================= */

const API_BASE =
  "https://buner-ff.akberawaakbera.workers.dev";


/* =========================================================
   CONFIG
========================================================= */

const APP_NAME = "LAWANGEN INJECTOR";

const DEVELOPER_USERNAME = "LAWANGIN 444";

const USER_STORAGE_KEY = "lawangenUser";
const CONFIG_STORAGE_KEY = "lawangenConfig";
const LOGO_STORAGE_KEY = "lawangenDeveloperLogo";
const ADMIN_TOKEN_STORAGE_KEY = "lawangenAdminToken";


/* =========================================================
   ELEMENTS
========================================================= */

const screens =
  document.querySelectorAll(".app-screen");

const loginScreen =
  document.getElementById("loginScreen");

const app =
  document.getElementById("app");

const loginButton =
  document.getElementById("loginButton");

const guestButton =
  document.getElementById("guestButton");

const usernameInput =
  document.getElementById("username");

const keyInput =
  document.getElementById("key") ||
  document.getElementById("password");

const loginMessage =
  document.getElementById("loginMessage");


/* =========================================================
   SCREEN NAVIGATION
========================================================= */

function openScreen(screenId) {

  document
    .querySelectorAll(".app-screen")
    .forEach(screen => {

      screen.classList.toggle(
        "active",
        screen.id === screenId
      );

    });

  document
    .querySelectorAll("[data-screen]")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.screen === screenId
      );

    });

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });

}


/* =========================================================
   STATUS
========================================================= */

function setStatus(text) {

  const element =
    document.getElementById("statusText");

  if (element) {
    element.textContent = text;
  }

}


/* =========================================================
   LOGIN MESSAGE
========================================================= */

function showLoginMessage(
  message,
  type = ""
) {

  if (!loginMessage) return;

  loginMessage.textContent =
    message;

  loginMessage.className =
    `message ${type}`.trim();

}


/* =========================================================
   PROFILE
========================================================= */

function updateProfile(username) {

  const profileName =
    document.getElementById("profileName");

  if (profileName) {

    profileName.textContent =
      username || DEVELOPER_USERNAME;

  }

}


/* =========================================================
   API REQUEST HELPER
========================================================= */

async function apiRequest(
  path,
  options = {}
) {

  const response =
    await fetch(
      `${API_BASE}${path}`,
      {
        cache: "no-store",
        ...options
      }
    );

  let data = {};

  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  if (!response.ok) {

    throw new Error(
      data.error ||
      `HTTP ${response.status}`
    );

  }

  return data;

}


/* =========================================================
   API HEALTH
========================================================= */

async function checkAPI() {

  try {

    setStatus(
      "CONNECTING TO LAWANGEN API..."
    );

    const data =
      await apiRequest(
        "/api/health"
      );

    if (data.success) {

      setStatus(
        "LAWANGEN API ONLINE"
      );

      return true;

    }

  }
  catch (error) {

    console.error(
      "API error:",
      error
    );

    setStatus(
      "API CONNECTION ERROR"
    );

  }

  return false;

}


/* =========================================================
   DATABASE HEALTH
========================================================= */

async function checkDatabase() {

  try {

    const data =
      await apiRequest(
        "/api/db-test"
      );

    if (
      data.success &&
      data.database === "connected"
    ) {

      setStatus(
        "D1 DATABASE CONNECTED"
      );

      return true;

    }

  }
  catch (error) {

    console.error(
      "D1 error:",
      error
    );

    setStatus(
      "D1 DATABASE ERROR"
    );

  }

  return false;

}


/* =========================================================
   LOGIN
========================================================= */

async function performLogin() {

  const username =
    usernameInput?.value.trim() || "";

  const key =
    keyInput?.value.trim() || "";


  if (!username) {

    showLoginMessage(
      "Please enter your username.",
      "error"
    );

    usernameInput?.focus();

    return;

  }


  if (!key) {

    showLoginMessage(
      "Please enter your key.",
      "error"
    );

    keyInput?.focus();

    return;

  }


  /*
    Developer access is local UI access.
    Real activation-key validation should be
    handled by the Worker API.
  */

  localStorage.setItem(
    USER_STORAGE_KEY,
    username
  );


  updateProfile(username);


  loginScreen?.classList.add(
    "hidden"
  );

  app?.classList.remove(
    "hidden"
  );


  openScreen(
    "homeScreen"
  );


  setStatus(
    "LAWANGEN APP READY"
  );


  addLog(
    "Developer login completed"
  );


  updateDeveloperControls();
  loadDeveloperLogo();

  await checkAPI();
  await checkDatabase();

}


loginButton?.addEventListener(
  "click",
  performLogin
);


/* =========================================================
   GUEST
========================================================= */

guestButton?.addEventListener(
  "click",
  () => {

    const guestName =
      "Guest Developer";

    localStorage.setItem(
      USER_STORAGE_KEY,
      guestName
    );

    updateProfile(
      guestName
    );

    loginScreen?.classList.add(
      "hidden"
    );

    app?.classList.remove(
      "hidden"
    );

    openScreen(
      "homeScreen"
    );

    setStatus(
      "LAWANGEN GUEST MODE"
    );

    addLog(
      "Guest mode started"
    );

    updateDeveloperControls();
    loadDeveloperLogo();
    checkAPI();

  }
);


/* =========================================================
   ENTER KEY
========================================================= */

usernameInput?.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      keyInput?.focus();
    }

  }
);


keyInput?.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      performLogin();
    }

  }
);


/* =========================================================
   NAVIGATION
========================================================= */

document
  .querySelectorAll("[data-screen]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const target =
          button.dataset.screen;

        if (target) {
          openScreen(target);
        }

      }
    );

  });


/* =========================================================
   PROFILE BUTTON
========================================================= */

document
  .getElementById("profileButton")
  ?.addEventListener(
    "click",
    () => {

      openScreen(
        "profileScreen"
      );

      updateDeveloperControls();
      loadDeveloperLogo();

    }
  );


/* =========================================================
   DEVELOPER CHECK
========================================================= */

function isDeveloper() {

  const username =
    localStorage.getItem(
      USER_STORAGE_KEY
    );

  return (
    username ===
    DEVELOPER_USERNAME
  );

}


function updateDeveloperControls() {

  document
    .querySelectorAll(".developer-only")
    .forEach(element => {

      element.style.display =
        isDeveloper()
          ? ""
          : "none";

    });

}


/* =========================================================
   ADMIN TOKEN
========================================================= */

const adminTokenInput =
  document.getElementById(
    "adminToken"
  );


function getAdminToken() {

  const current =
    adminTokenInput?.value.trim();

  if (current) {

    localStorage.setItem(
      ADMIN_TOKEN_STORAGE_KEY,
      current
    );

    return current;

  }

  return localStorage.getItem(
    ADMIN_TOKEN_STORAGE_KEY
  ) || "";

}


function clearAdminToken() {

  localStorage.removeItem(
    ADMIN_TOKEN_STORAGE_KEY
  );

  if (adminTokenInput) {
    adminTokenInput.value = "";
  }

}


/* =========================================================
   KEY GENERATION ELEMENTS
========================================================= */

const generateKeyButton =
  document.getElementById(
    "generateKey"
  );

const keyDaysInput =
  document.getElementById(
    "keyDays"
  );

const generatedKeyOutput =
  document.getElementById(
    "generatedKey"
  );

const keyMessage =
  document.getElementById(
    "keyMessage"
  );


function showKeyMessage(
  message,
  type = ""
) {

  if (!keyMessage) return;

  keyMessage.textContent =
    message;

  keyMessage.className =
    `message ${type}`.trim();

}


/* =========================================================
   GENERATE KEY
========================================================= */

async function generateAdminKey() {

  const token =
    getAdminToken();

  const days =
    Number(
      keyDaysInput?.value || 30
    );


  if (!token) {

    showKeyMessage(
      "Admin Token enter کریں۔",
      "error"
    );

    adminTokenInput?.focus();

    return;

  }


  if (
    !Number.isFinite(days) ||
    days < 1 ||
    days > 3650
  ) {

    showKeyMessage(
      "Days 1 سے 3650 کے درمیان رکھیں۔",
      "error"
    );

    return;

  }


  if (generateKeyButton) {

    generateKeyButton.disabled =
      true;

    generateKeyButton.textContent =
      "GENERATING...";

  }


  showKeyMessage(
    "Key generate ہو رہی ہے...",
    ""
  );


  try {

    const data =
      await apiRequest(
        "/api/admin/keys/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Authorization":
              `Bearer ${token}`
          },

          body:
            JSON.stringify({
              days
            })
        }
      );


    const keyCode =
      data.key?.key_code;


    if (!keyCode) {

      throw new Error(
        "Worker نے key واپس نہیں کی۔"
      );

    }


    if (generatedKeyOutput) {

      generatedKeyOutput.value =
        keyCode;

    }


    showKeyMessage(
      "Activation key generated successfully.",
      "success"
    );


    addLog(
      "Activation key generated"
    );


    setStatus(
      "KEY GENERATED"
    );


    loadAdminKeys();

  }
  catch (error) {

    console.error(
      "Generate key error:",
      error
    );


    showKeyMessage(
      error.message ||
      "Key generation failed.",
      "error"
    );


    setStatus(
      "KEY GENERATION ERROR"
    );

  }
  finally {

    if (generateKeyButton) {

      generateKeyButton.disabled =
        false;

      generateKeyButton.textContent =
        "GENERATE KEY";

    }

  }

}


generateKeyButton?.addEventListener(
  "click",
  generateAdminKey
);


/* =========================================================
   COPY GENERATED KEY
========================================================= */

document
  .getElementById("copyGeneratedKey")
  ?.addEventListener(
    "click",
    async () => {

      const key =
        generatedKeyOutput?.value.trim();

      if (!key) {

        showKeyMessage(
          "پہلے key generate کریں۔",
          "error"
        );

        return;

      }

      try {

        await navigator.clipboard.writeText(
          key
        );

        showKeyMessage(
          "Key copied.",
          "success"
        );

      }
      catch {

        showKeyMessage(
          "Key copy نہیں ہو سکی۔",
          "error"
        );

      }

    }
  );


/* =========================================================
   ADMIN KEY LIST
========================================================= */

const keysContainer =
  document.getElementById(
    "keysContainer"
  );


async function loadAdminKeys() {

  const token =
    getAdminToken();

  if (!token) return;


  try {

    const data =
      await apiRequest(
        "/api/admin/keys",
        {
          method: "GET",

          headers: {
            "Authorization":
              `Bearer ${token}`
          }
        }
      );


    renderAdminKeys(
      data.keys || []
    );


  }
  catch (error) {

    console.error(
      "Load keys error:",
      error
    );

    if (keysContainer) {

      keysContainer.innerHTML = `
        <div class="empty-log">
          ${escapeHTML(
            error.message
          )}
        </div>
      `;

    }

  }

}


/* =========================================================
   RENDER KEYS
========================================================= */

function renderAdminKeys(keys) {

  if (!keysContainer) return;


  if (!keys.length) {

    keysContainer.innerHTML = `
      <div class="empty-log">
        No activation keys yet.
      </div>
    `;

    return;

  }


  keysContainer.innerHTML = "";


  keys.forEach(key => {

    const item =
      document.createElement(
        "div"
      );

    item.className =
      "key-item";


    item.innerHTML = `
      <strong>
        ${escapeHTML(
          key.key_code || ""
        )}
      </strong>

      <small>
        Status:
        ${escapeHTML(
          key.status || ""
        )}
      </small>

      <small>
        Expires:
        ${escapeHTML(
          key.expires_at || "Never"
        )}
      </small>

      <div class="key-actions">

        <button
          type="button"
          data-key-status="${key.id}"
          data-status="${
            key.status === "active"
              ? "disabled"
              : "active"
          }">

          ${
            key.status === "active"
              ? "DISABLE"
              : "ENABLE"
          }

        </button>

        <button
          type="button"
          data-key-reset="${key.id}">

          RESET DEVICE

        </button>

      </div>
    `;


    keysContainer.appendChild(
      item
    );

  });

}


/* =========================================================
   KEY ACTIONS
========================================================= */

document.addEventListener(
  "click",
  async event => {

    const statusButton =
      event.target.closest(
        "[data-key-status]"
      );

    const resetButton =
      event.target.closest(
        "[data-key-reset]"
      );


    if (statusButton) {

      await changeKeyStatus(
        statusButton.dataset.keyStatus,
        statusButton.dataset.status
      );

    }


    if (resetButton) {

      await resetKeyDevice(
        resetButton.dataset.keyReset
      );

    }

  }
);


/* =========================================================
   CHANGE KEY STATUS
========================================================= */

async function changeKeyStatus(
  id,
  status
) {

  const token =
    getAdminToken();

  if (!token) return;


  try {

    await apiRequest(
      `/api/admin/keys/${id}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${token}`
        },

        body:
          JSON.stringify({
            status
          })
      }
    );


    addLog(
      `Key ${id}: ${status.toUpperCase()}`
    );


    loadAdminKeys();


  }
  catch (error) {

    showKeyMessage(
      error.message,
      "error"
    );

  }

}


/* =========================================================
   RESET DEVICE
========================================================= */

async function resetKeyDevice(id) {

  const token =
    getAdminToken();

  if (!token) return;


  try {

    await apiRequest(
      `/api/admin/keys/${id}/reset`,
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${token}`
        }
      }
    );


    addLog(
      `Device binding reset for key ${id}`
    );


    loadAdminKeys();


  }
  catch (error) {

    showKeyMessage(
      error.message,
      "error"
    );

  }

}


/* =========================================================
   LOGO MANAGER
========================================================= */

const developerLogoInput =
  document.getElementById(
    "developerLogoInput"
  );

const developerLogoPreview =
  document.getElementById(
    "developerLogoPreview"
  );

const applyDeveloperLogoButton =
  document.getElementById(
    "applyDeveloperLogo"
  );

const resetDeveloperLogoButton =
  document.getElementById(
    "resetDeveloperLogo"
  );

const logoManagerMessage =
  document.getElementById(
    "logoManagerMessage"
  );


function showLogoMessage(
  message,
  type = ""
) {

  if (!logoManagerMessage) return;

  logoManagerMessage.textContent =
    message;

  logoManagerMessage.className =
    `message ${type}`.trim();

}


/* =========================================================
   APPLY LOGO TO UI
========================================================= */

function applyDeveloperLogo(
  imageData
) {

  if (
    !imageData ||
    typeof imageData !== "string"
  ) return;


  document
    .querySelectorAll(
      ".logo-mark img, .small-logo img, img[data-app-logo]"
    )
    .forEach(image => {

      image.src =
        imageData;

    });


  const ids = [
    "loginLogo",
    "topLogo",
    "homeLogo",
    "profileLogo",
    "developerLogoPreview"
  ];


  ids.forEach(id => {

    const image =
      document.getElementById(id);

    if (image) {
      image.src =
        imageData;
    }

  });

}


/* =========================================================
   SELECT LOGO
========================================================= */

developerLogoInput?.addEventListener(
  "change",
  event => {

    const file =
      event.target.files?.[0];

    if (!file) return;


    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif"
    ];


    if (!allowed.includes(file.type)) {

      showLogoMessage(
        "PNG, JPG, WEBP یا GIF منتخب کریں۔",
        "error"
      );

      developerLogoInput.value =
        "";

      return;

    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      showLogoMessage(
        "Logo 5MB سے کم ہونا چاہیے۔",
        "error"
      );

      developerLogoInput.value =
        "";

      return;

    }


    const reader =
      new FileReader();


    reader.onload = () => {

      const imageData =
        reader.result;


      sessionStorage.setItem(
        "lawangenPendingLogo",
        imageData
      );


      if (developerLogoPreview) {

        developerLogoPreview.src =
          imageData;

      }


      showLogoMessage(
        "Logo selected. اب APPLY LOGO دبائیں۔",
        "success"
      );

    };


    reader.onerror = () => {

      showLogoMessage(
        "Image read نہیں ہو سکی۔",
        "error"
      );

    };


    reader.readAsDataURL(file);

  }
);


/* =========================================================
   APPLY SELECTED LOGO
========================================================= */

applyDeveloperLogoButton?.addEventListener(
  "click",
  () => {

    const pending =
      sessionStorage.getItem(
        "lawangenPendingLogo"
      );


    if (!pending) {

      showLogoMessage(
        "پہلے gallery سے logo select کریں۔",
        "error"
      );

      return;

    }


    try {

      localStorage.setItem(
        LOGO_STORAGE_KEY,
        pending
      );

    }
    catch {

      showLogoMessage(
        "Logo بہت بڑا ہے، اسے save نہیں کیا جا سکتا۔",
        "error"
      );

      return;

    }


    applyDeveloperLogo(
      pending
    );


    sessionStorage.removeItem(
      "lawangenPendingLogo"
    );


    showLogoMessage(
      "LAWANGEN logo successfully applied.",
      "success"
    );


    setStatus(
      "LOGO UPDATED"
    );


    addLog(
      "Developer logo updated"
    );


    if (developerLogoInput) {
      developerLogoInput.value =
        "";
    }

  }
);


/* =========================================================
   RESET LOGO
========================================================= */

resetDeveloperLogoButton?.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      LOGO_STORAGE_KEY
    );

    sessionStorage.removeItem(
      "lawangenPendingLogo"
    );


    const defaultLogo =
      "./assets/logo.png";


    applyDeveloperLogo(
      defaultLogo
    );


    if (developerLogoPreview) {

      developerLogoPreview.src =
        defaultLogo;

    }


    showLogoMessage(
      "Default logo restored.",
      "success"
    );


    setStatus(
      "DEFAULT LOGO RESTORED"
    );


    addLog(
      "Developer logo reset"
    );

  }
);


/* =========================================================
   LOAD LOGO
========================================================= */

function loadDeveloperLogo() {

  const saved =
    localStorage.getItem(
      LOGO_STORAGE_KEY
    );


  const logo =
    saved ||
    "./assets/logo.png";


  applyDeveloperLogo(
    logo
  );


  if (developerLogoPreview) {

    developerLogoPreview.src =
      logo;

  }

}


/* =========================================================
   LOAD PENDING LOGO
========================================================= */

function loadPendingLogo() {

  const pending =
    sessionStorage.getItem(
      "lawangenPendingLogo"
    );


  if (
    pending &&
    developerLogoPreview
  ) {

    developerLogoPreview.src =
      pending;

  }

}


/* =========================================================
   CONFIGURATION
========================================================= */

const povSlider =
  document.getElementById(
    "povSlider"
  );

const povValue =
  document.getElementById(
    "povValue"
  );

const speedSlider =
  document.getElementById(
    "speedSlider"
  );

const speedValue =
  document.getElementById(
    "speedValue"
  );


povSlider?.addEventListener(
  "input",
  () => {

    if (povValue) {

      povValue.textContent =
        `${povSlider.value}°`;

    }

  }
);


speedSlider?.addEventListener(
  "input",
  () => {

    if (speedValue) {

      speedValue.textContent =
        `${Number(
          speedSlider.value
        ).toFixed(1)}x`;

    }

  }
);


/* =========================================================
   TEST SWITCHES
========================================================= */

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

  const element =
    document.getElementById(
      "activeCount"
    );

  if (element) {

    element.textContent =
      `${getActiveTests()} Active`;

  }

}


testInputs.forEach(
  input => {

    input.addEventListener(
      "change",
      () => {

        updateActiveCount();

        const name =
          input.dataset.name ||
          "Test option";

        addLog(
          `${name}: ${
            input.checked
              ? "ENABLED"
              : "DISABLED"
          }`
        );

        setStatus(
          input.checked
            ? `${name} ENABLED`
            : `${name} DISABLED`
        );

      }
    );

  }
);


/* =========================================================
   SAVE CONFIG
========================================================= */

document
  .getElementById("applyConfig")
  ?.addEventListener(
    "click",
    () => {

      const activeTests =
        Array.from(
          document.querySelectorAll(
            "input[data-test]:checked"
          )
        ).map(
          input =>
            input.dataset.name ||
            "Test"
        );


      const config = {

        activeTests,

        pov:
          povSlider
            ? Number(
                povSlider.value
              )
            : 90,

        speed:
          speedSlider
            ? Number(
                speedSlider.value
              )
            : 1,

        savedAt:
          new Date().toISOString()

      };


      localStorage.setItem(
        CONFIG_STORAGE_KEY,
        JSON.stringify(config)
      );


      addLog(
        `${activeTests.length} test option(s) configured`
      );


      setStatus(
        "CONFIGURATION SAVED"
      );

    }
  );


/* =========================================================
   RESET CONFIG
========================================================= */

document
  .getElementById("resetConfig")
  ?.addEventListener(
    "click",
    () => {

      testInputs.forEach(
        input => {
          input.checked =
            false;
        }
      );


      if (povSlider) {
        povSlider.value =
          90;
      }


      if (speedSlider) {
        speedSlider.value =
          1;
      }


      if (povValue) {
        povValue.textContent =
          "90°";
      }


      if (speedValue) {
        speedValue.textContent =
          "1.0x";
      }


      localStorage.removeItem(
        CONFIG_STORAGE_KEY
      );


      updateActiveCount();


      setStatus(
        "CONFIG RESET"
      );


      addLog(
        "Developer configuration reset"
      );

    }
  );


/* =========================================================
   LOG SYSTEM
========================================================= */

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
    document.createElement(
      "div"
    );


  item.className =
    "log-item";


  const strong =
    document.createElement(
      "strong"
    );

  strong.textContent =
    text;


  const small =
    document.createElement(
      "small"
    );

  small.textContent =
    new Date().toLocaleTimeString();


  item.appendChild(
    strong
  );

  item.appendChild(
    small
  );


  logsContainer.prepend(
    item
  );

}


/* =========================================================
   CLEAR LOGS
========================================================= */

document
  .getElementById("clearLogs")
  ?.addEventListener(
    "click",
    () => {

      if (!logsContainer) return;

      logsContainer.innerHTML = `
        <div class="empty-log">
          No activity yet.
        </div>
      `;

      setStatus(
        "LOGS CLEARED"
      );

    }
  );


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem(
    USER_STORAGE_KEY
  );

  localStorage.removeItem(
    CONFIG_STORAGE_KEY
  );


  app?.classList.add(
    "hidden"
  );

  loginScreen?.classList.remove(
    "hidden"
  );


  if (usernameInput) {
    usernameInput.value =
      "";
  }


  if (keyInput) {
    keyInput.value =
      "";
  }


  showLoginMessage(
    "",
    ""
  );


  openScreen(
    "homeScreen"
  );

}


document
  .getElementById("logoutButton")
  ?.addEventListener(
    "click",
    logout
  );


document
  .getElementById("logoutButtonSettings")
  ?.addEventListener(
    "click",
    logout
  );


/* =========================================================
   LOAD CONFIG
========================================================= */

function loadConfiguration() {

  let saved = null;


  try {

    saved =
      JSON.parse(
        localStorage.getItem(
          CONFIG_STORAGE_KEY
        ) || "null"
      );

  }
  catch {

    saved = null;

  }


  if (!saved) {

    updateActiveCount();

    return;

  }


  if (
    povSlider &&
    typeof saved.pov ===
      "number"
  ) {

    povSlider.value =
      saved.pov;

    if (povValue) {

      povValue.textContent =
        `${saved.pov}°`;

    }

  }


  if (
    speedSlider &&
    typeof saved.speed ===
      "number"
  ) {

    speedSlider.value =
      saved.speed;

    if (speedValue) {

      speedValue.textContent =
        `${Number(
          saved.speed
        ).toFixed(1)}x`;

    }

  }


  if (
    Array.isArray(
      saved.activeTests
    )
  ) {

    testInputs.forEach(
      input => {

        input.checked =
          saved.activeTests.includes(
            input.dataset.name
          );

      }
    );

  }


  updateActiveCount();

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   SAVED USER
========================================================= */

const savedUser =
  localStorage.getItem(
    USER_STORAGE_KEY
  );


if (savedUser) {

  updateProfile(
    savedUser
  );

  loginScreen?.classList.add(
    "hidden"
  );

  app?.classList.remove(
    "hidden"
  );

  openScreen(
    "homeScreen"
  );

  checkAPI();

}


/* =========================================================
   INITIALIZE
========================================================= */

loadConfiguration();

updateActiveCount();

loadDeveloperLogo();

loadPendingLogo();

updateDeveloperControls();


/* =========================================================
   END — LAWANGEN INJECTOR
========================================================= */