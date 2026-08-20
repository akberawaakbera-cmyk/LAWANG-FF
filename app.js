/* =========================================================
   LAWANGEN INJECTOR
   Developer Test Interface
   UI / CONTROLLED SIMULATION ONLY
========================================================= */


/* =========================================================
   GLOBAL
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
   DEVELOPER CONFIG
========================================================= */

const DEVELOPER_USERNAME =
  "LAWANGIN 444";


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
    document.getElementById("profileName");

  if (profileName) {

    profileName.textContent =
      username || DEVELOPER_USERNAME;

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


  if (!key) {

    showLoginMessage(
      "Please enter your key.",
      "error"
    );

    keyInput?.focus();

    return;
  }


  localStorage.setItem(
    "lawangenUser",
    username
  );


  updateProfile(username);

  showLoginMessage("", "");


  loginScreen?.classList.add(
    "hidden"
  );

  app?.classList.remove(
    "hidden"
  );


  openScreen("homeScreen");

  setStatus(
    "LOGIN SUCCESSFUL"
  );


  addLog(
    "Developer test login successful"
  );


  updateDeveloperControls();

  loadDeveloperLogo();

}


/* =========================================================
   LOGIN BUTTON
========================================================= */

loginButton?.addEventListener(
  "click",
  performLogin
);


/* =========================================================
   GUEST LOGIN
========================================================= */

guestButton?.addEventListener(
  "click",
  () => {

    const guestName =
      "Guest Developer";


    localStorage.setItem(
      "lawangenUser",
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
      "GUEST MODE"
    );


    addLog(
      "Guest developer mode started"
    );


    updateDeveloperControls();

    loadDeveloperLogo();

  }
);


/* =========================================================
   ENTER KEY LOGIN
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
   RUNNING SLIDER
========================================================= */

const runningSlider =
  document.getElementById(
    "runningSlider"
  );

const runningValue =
  document.getElementById(
    "runningValue"
  );


function updateRunningValue() {

  if (
    runningSlider &&
    runningValue
  ) {

    runningValue.textContent =
      `${Number(
        runningSlider.value
      ).toFixed(1)}x`;

  }

}


runningSlider?.addEventListener(
  "input",
  updateRunningValue
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
          input.getAttribute(
            "aria-label"
          ) ||
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
            input.getAttribute(
              "aria-label"
            ) ||
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

        runningMultiplier:
          runningSlider
            ? Number(runningSlider.value)
            : 1,

        savedAt:
          new Date().toISOString()

      };


      localStorage.setItem(
        "lawangenTestConfig",
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


      if (runningSlider) {
        runningSlider.value = 1;
      }


      if (povValue) {
        povValue.textContent = "90°";
      }


      if (speedValue) {
        speedValue.textContent = "1.0x";
      }


      updateRunningValue();


      localStorage.removeItem(
        "lawangenTestConfig"
      );


      updateActiveCount();


      setStatus(
        "CONFIG RESET"
      );


      addLog(
        "Test configuration reset"
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
    document.createElement("div");

  item.className =
    "log-item";


  const strong =
    document.createElement("strong");

  strong.textContent =
    text;


  const small =
    document.createElement("small");

  small.textContent =
    new Date().toLocaleTimeString();


  item.appendChild(strong);
  item.appendChild(small);


  logsContainer.prepend(item);

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
          `Simulation event: ${eventName}`
        );


        setStatus(
          "SIMULATION EVENT GENERATED"
        );


        const originalText =
          button.textContent;


        button.textContent =
          "DONE";


        button.disabled = true;


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
      "lawangenUser"
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
   LOGO STORAGE KEY
========================================================= */

const LOGO_STORAGE_KEY =
  "lawangenDeveloperLogo";


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
   APPLY LOGO TO ALL APP LOCATIONS
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


  /*
    IMPORTANT:
    Use IDs instead of searching for
    src="assets/logo.png".

    This works even after the first
    logo has already been changed.
  */

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
   PREVIEW SELECTED LOGO
========================================================= */

function previewDeveloperLogo(
  imageData
) {

  if (
    developerLogoPreview &&
    imageData
  ) {

    developerLogoPreview.src =
      imageData;

  }

}


/* =========================================================
   FILE SELECT
========================================================= */

developerLogoInput?.addEventListener(
  "change",
  event => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    /* ---------- FILE TYPE ---------- */

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


    /* ---------- FILE SIZE ---------- */

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


    /* ---------- READ IMAGE ---------- */

    const reader =
      new FileReader();


    reader.onload = () => {

      const imageData =
        reader.result;


      if (
        typeof imageData !==
        "string"
      ) {

        showLogoMessage(
          "Could not read the selected image.",
          "error"
        );

        return;

      }


      /*
        Store temporarily as selected logo.

        It is NOT applied to the whole
        app until APPLY LOGO is pressed.
      */

      sessionStorage.setItem(
        "lawangenPendingLogo",
        imageData
      );


      previewDeveloperLogo(
        imageData
      );


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
        "lawangenPendingLogo"
      );


    if (!pendingLogo) {

      showLogoMessage(
        "First choose a logo from your gallery.",
        "error"
      );

      return;

    }


    /*
      Save permanently in localStorage.
    */

    try {

      localStorage.setItem(
        LOGO_STORAGE_KEY,
        pendingLogo
      );

    }
    catch (error) {

      showLogoMessage(
        "Logo is too large to save on this device.",
        "error"
      );

      return;

    }


    /*
      Apply everywhere immediately.
    */

    applyDeveloperLogo(
      pendingLogo
    );


    showLogoMessage(
      "Logo applied successfully.",
      "success"
    );


    setStatus(
      "DEVELOPER LOGO UPDATED"
    );


    addLog(
      "Developer logo applied"
    );


    /*
      Clear temporary selection.
    */

    sessionStorage.removeItem(
      "lawangenPendingLogo"
    );


    /*
      Reset file input so the same
      image can be selected again.
    */

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
      "lawangenPendingLogo"
    );


    const defaultLogo =
      "assets/logo.png";


    applyDeveloperLogo(
      defaultLogo
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
      "Developer logo reset"
    );

  }
);


/* =========================================================
   LOAD SAVED LOGO
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


  /*
    No custom logo saved.
    Use the original logo.
  */

  applyDeveloperLogo(
    "assets/logo.png"
  );


  if (developerLogoPreview) {

    developerLogoPreview.src =
      "assets/logo.png";

  }

}


/* =========================================================
   LOAD PENDING LOGO PREVIEW
========================================================= */

function loadPendingLogo() {

  const pendingLogo =
    sessionStorage.getItem(
      "lawangenPendingLogo"
    );


  if (
    pendingLogo &&
    developerLogoPreview
  ) {

    developerLogoPreview.src =
      pendingLogo;


    showLogoMessage(
      "Selected logo is waiting for APPLY LOGO.",
      ""
    );

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


  /*
    Your HTML already contains the
    Developer Logo Manager.

    We do NOT create another picker.
  */

  if (isDeveloper()) {

    manager.style.display =
      "block";

  }
  else {

    manager.style.display =
      "none";

  }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem(
    "lawangenUser"
  );

  localStorage.removeItem(
    "lawangenTestConfig"
  );


  /*
    Keep the saved developer logo.
    Logging out should NOT delete it.
  */


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
          "lawangenTestConfig"
        ) || "null"
      );

  }
  catch (error) {

    saved = null;

  }


  if (!saved) {

    updateRunningValue();
    updateActiveCount();

    return;

  }


  /* ---------- POV ---------- */

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


  /* ---------- SPEED ---------- */

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


  /* ---------- RUNNING ---------- */

  if (
    runningSlider &&
    typeof saved.runningMultiplier ===
      "number"
  ) {

    runningSlider.value =
      saved.runningMultiplier;

  }


  updateRunningValue();


  /* ---------- TEST OPTIONS ---------- */

  if (
    Array.isArray(
      saved.activeTests
    )
  ) {

    testInputs.forEach(
      input => {

        const name =
          input.dataset.name ||
          input.getAttribute(
            "aria-label"
          );


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
    "lawangenUser"
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

}


/* =========================================================
   INITIALIZE
========================================================= */

loadConfiguration();

updateRunningValue();

updateActiveCount();

loadDeveloperLogo();

loadPendingLogo();

updateDeveloperControls();


/* =========================================================
   END
========================================================= */