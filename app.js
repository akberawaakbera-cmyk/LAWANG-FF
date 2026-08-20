/* =========================================================
   BUNER-FF
   Developer Test Interface
   UI / CONTROLLED SIMULATION ONLY
========================================================= */


/* =========================================================
   BUNER-FF API
========================================================= */

const API_BASE =
  "https://buner-ff.akberawaakbera.workers.dev";


/* =========================================================
   GLOBAL ELEMENTS
========================================================= */

const screens =
  document.querySelectorAll(".app-screen");

const navigationButtons =
  document.querySelectorAll("[data-screen]");

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
   BUNER-FF CONFIG
========================================================= */

const APP_NAME =
  "BUNER-FF";

const DEVELOPER_USERNAME =
  "LAWANGIN 444";

const USER_STORAGE_KEY =
  "bunerFFUser";

const CONFIG_STORAGE_KEY =
  "bunerFFTestConfig";

const LOGO_STORAGE_KEY =
  "bunerFFDeveloperLogo";


/* =========================================================
   SCREEN NAVIGATION
========================================================= */

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
    behavior: "auto"
  });

}


/* =========================================================
   STATUS
========================================================= */

function setStatus(text) {

  const statusText =
    document.getElementById("statusText");

  if (statusText) {
    statusText.textContent = text;
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
    document.getElementById(
      "profileName"
    );

  if (profileName) {

    profileName.textContent =
      username || DEVELOPER_USERNAME;

  }

}


/* =========================================================
   API HEALTH CHECK
========================================================= */

async function checkAPI() {

  try {

    setStatus(
      "CONNECTING TO BUNER-FF API..."
    );


    const response =
      await fetch(API_BASE, {
        method: "GET",
        cache: "no-store"
      });


    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }


    const data =
      await response.json();


    if (
      data &&
      data.success === true
    ) {

      setStatus(
        "BUNER-FF API ONLINE"
      );

      return true;

    }


    setStatus(
      "BUNER-FF API ONLINE"
    );

    return true;

  }
  catch (error) {

    console.error(
      "BUNER-FF API error:",
      error
    );


    setStatus(
      "API CONNECTION ERROR"
    );


    return false;

  }

}


/* =========================================================
   LOGIN
========================================================= */

function performLogin() {

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


  /*
    IMPORTANT:
    Key validation is intentionally
    NOT connected yet.

    We will add the real key system
    later after the API is stable.
  */

  if (!key) {

    showLoginMessage(
      "Please enter your test key.",
      "error"
    );

    keyInput?.focus();

    return;

  }


  localStorage.setItem(
    USER_STORAGE_KEY,
    username
  );


  updateProfile(username);


  showLoginMessage(
    "",
    ""
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
    "BUNER-FF APP READY"
  );


  addLog(
    "BUNER-FF developer test login"
  );


  updateDeveloperControls();

  loadDeveloperLogo();

  checkAPI();

}


/* =========================================================
   LOGIN BUTTON
========================================================= */

loginButton?.addEventListener(
  "click",
  performLogin
);


/* =========================================================
   GUEST MODE
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


    showLoginMessage(
      "",
      ""
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
      "BUNER-FF GUEST MODE"
    );


    addLog(
      "BUNER-FF guest mode started"
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
   BACK BUTTONS
========================================================= */

document
  .querySelectorAll(".back-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openScreen(
          "selectionScreen"
        );

      }
    );

  });


/* =========================================================
   POV / FOV
========================================================= */

const povSlider =
  document.getElementById(
    "povSlider"
  );

const povValue =
  document.getElementById(
    "povValue"
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


/* =========================================================
   SPEED
========================================================= */

const speedSlider =
  document.getElementById(
    "speedSlider"
  );

const speedValue =
  document.getElementById(
    "speedValue"
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
   TEST INPUTS
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

  const activeCount =
    document.getElementById(
      "activeCount"
    );

  if (activeCount) {

    activeCount.textContent =
      `${getActiveTests()} Active`;

  }

}


/* =========================================================
   TEST SWITCH EVENTS
========================================================= */

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
   APPLY CONFIGURATION
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


      const configuration = {

        activeTests,

        pov:
          povSlider
            ? Number(povSlider.value)
            : 90,

        speed:
          speedSlider
            ? Number(speedSlider.value)
            : 1,

        savedAt:
          new Date().toISOString()

      };


      localStorage.setItem(
        CONFIG_STORAGE_KEY,
        JSON.stringify(
          configuration
        )
      );


      addLog(
        `${activeTests.length} test option(s) configured`
      );


      setStatus(
        "TEST CONFIG READY"
      );


      openScreen(
        "logsScreen"
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
          input.checked = false;
        }
      );


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
        CONFIG_STORAGE_KEY
      );


      updateActiveCount();


      setStatus(
        "CONFIG RESET"
      );


      addLog(
        "BUNER-FF test configuration reset"
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
   TEST TRIGGERS
========================================================= */

document
  .querySelectorAll(".test-trigger")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const eventName =
          button.dataset.event ||
          "TEST_EVENT";


        addLog(
          `BUNER-FF Simulation: ${eventName}`
        );


        setStatus(
          "SIMULATION EVENT GENERATED"
        );


        const originalText =
          button.textContent;


        button.textContent =
          "DONE";


        button.disabled =
          true;


        setTimeout(
          () => {

            button.textContent =
              originalText || "TEST";

            button.disabled =
              false;

          },
          900
        );

      }
    );

  });


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
          No test activity yet.
        </div>
      `;


      setStatus(
        "LOGS CLEARED"
      );

    }
  );


/* =========================================================
   DEVELOPER CHECK
========================================================= */

function isDeveloper() {

  const currentUser =
    localStorage.getItem(
      USER_STORAGE_KEY
    );


  return (
    currentUser ===
    DEVELOPER_USERNAME
  );

}


/* =========================================================
   LOGO ELEMENTS
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


/* =========================================================
   LOGO MESSAGE
========================================================= */

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
   APPLY LOGO
========================================================= */

function applyDeveloperLogo(
  imageData
) {

  if (
    !imageData ||
    typeof imageData !== "string"
  ) {
    return;
  }


  const logoIds = [
    "loginLogo",
    "topLogo",
    "homeLogo",
    "profileLogo",
    "developerLogoPreview"
  ];


  logoIds.forEach(id => {

    const image =
      document.getElementById(id);

    if (image) {
      image.src = imageData;
    }

  });

}


/* =========================================================
   FILE SELECT
========================================================= */

developerLogoInput?.addEventListener(
  "change",
  event => {

    const file =
      event.target.files?.[0];


    if (!file) return;


    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif"
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      showLogoMessage(
        "Please select PNG, JPG, WEBP or GIF.",
        "error"
      );

      developerLogoInput.value = "";

      return;

    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      showLogoMessage(
        "Logo must be smaller than 5 MB.",
        "error"
      );

      developerLogoInput.value = "";

      return;

    }


    const reader =
      new FileReader();


    reader.onload = () => {

      const imageData =
        reader.result;


      if (
        typeof imageData !==
        "string"
      ) {
        return;
      }


      sessionStorage.setItem(
        "bunerFFPendingLogo",
        imageData
      );


      if (developerLogoPreview) {

        developerLogoPreview.src =
          imageData;

      }


      showLogoMessage(
        "Logo selected. Press APPLY LOGO.",
        "success"
      );

    };


    reader.onerror = () => {

      showLogoMessage(
        "Could not read this image.",
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

    const pendingLogo =
      sessionStorage.getItem(
        "bunerFFPendingLogo"
      );


    if (!pendingLogo) {

      showLogoMessage(
        "First choose a logo.",
        "error"
      );

      return;

    }


    try {

      localStorage.setItem(
        LOGO_STORAGE_KEY,
        pendingLogo
      );

    }
    catch (error) {

      showLogoMessage(
        "Logo is too large to save.",
        "error"
      );

      return;

    }


    applyDeveloperLogo(
      pendingLogo
    );


    sessionStorage.removeItem(
      "bunerFFPendingLogo"
    );


    showLogoMessage(
      "BUNER-FF logo applied successfully.",
      "success"
    );


    setStatus(
      "DEVELOPER LOGO UPDATED"
    );


    addLog(
      "BUNER-FF developer logo updated"
    );


    if (developerLogoInput) {
      developerLogoInput.value = "";
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
      "bunerFFPendingLogo"
    );


    applyDeveloperLogo(
      "./assets/logo.png"
    );


    if (developerLogoInput) {
      developerLogoInput.value = "";
    }


    showLogoMessage(
      "Default logo restored.",
      "success"
    );


    setStatus(
      "DEFAULT LOGO RESTORED"
    );


    addLog(
      "BUNER-FF logo reset"
    );

  }
);


/* =========================================================
   LOAD LOGO
========================================================= */

function loadDeveloperLogo() {

  const savedLogo =
    localStorage.getItem(
      LOGO_STORAGE_KEY
    );


  if (savedLogo) {

    applyDeveloperLogo(
      savedLogo
    );


    if (developerLogoPreview) {
      developerLogoPreview.src =
        savedLogo;
    }

    return;

  }


  applyDeveloperLogo(
    "./assets/logo.png"
  );


  if (developerLogoPreview) {

    developerLogoPreview.src =
      "./assets/logo.png";

  }

}


/* =========================================================
   LOAD PENDING LOGO
========================================================= */

function loadPendingLogo() {

  const pendingLogo =
    sessionStorage.getItem(
      "bunerFFPendingLogo"
    );


  if (
    pendingLogo &&
    developerLogoPreview
  ) {

    developerLogoPreview.src =
      pendingLogo;

  }

}


/* =========================================================
   DEVELOPER CONTROLS
========================================================= */

function updateDeveloperControls() {

  const manager =
    document.getElementById(
      "developerLogoManager"
    );


  if (!manager) return;


  manager.style.display =
    isDeveloper()
      ? "block"
      : "none";

}


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
    usernameInput.value = "";
  }


  if (keyInput) {
    keyInput.value = "";
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
   LOAD CONFIGURATION
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
  catch (error) {

    saved = null;

  }


  if (!saved) {

    updateActiveCount();

    return;

  }


  if (
    povSlider &&
    typeof saved.pov === "number"
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
    typeof saved.speed === "number"
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

        const name =
          input.dataset.name;


        input.checked =
          saved.activeTests.includes(
            name
          );

      }
    );

  }


  updateActiveCount();

}


/* =========================================================
   SAVED LOGIN
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
   END — BUNER-FF
========================================================= */