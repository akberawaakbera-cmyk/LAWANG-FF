/* =========================================================
   LAWANGEN INJECTOR
   Developer Test Interface
   UI / CONTROLLED SIMULATION ONLY
========================================================= */


/* =========================================================
   GLOBAL
========================================================= */

const screens = document.querySelectorAll(".app-screen");
const navigationButtons = document.querySelectorAll("[data-screen]");

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

const loginButton = document.getElementById("loginButton");
const guestButton = document.getElementById("guestButton");

const usernameInput = document.getElementById("username");

/*
  IMPORTANT:
  Your current HTML uses id="password".
  This code supports BOTH:
  id="key"
  and
  id="password"
*/
const keyInput =
  document.getElementById("key") ||
  document.getElementById("password");

const loginMessage =
  document.getElementById("loginMessage");


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
   LOGIN MESSAGE
========================================================= */

function showLoginMessage(message, type = "") {

  if (!loginMessage) return;

  loginMessage.textContent = message;

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
      username || "LAWANGIN 444";
  }


  const avatar =
    document.querySelector(".avatar");

  if (avatar && username) {

    avatar.textContent =
      username
        .charAt(0)
        .toUpperCase();

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


  /* ---------- VALIDATION ---------- */

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
    Controlled local UI login.

    No real game authentication.
    No game injection.
  */

  localStorage.setItem(
    "lawangenUser",
    username
  );


  updateProfile(username);


  showLoginMessage(
    "",
    ""
  );


  loginScreen?.classList.add("hidden");
  app?.classList.remove("hidden");


  openScreen("homeScreen");


  setStatus(
    "LOGIN SUCCESSFUL"
  );


  addLog(
    "Developer test login successful"
  );

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

  }
);


/* =========================================================
   ENTER KEY LOGIN
========================================================= */

usernameInput?.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      if (keyInput) {
        keyInput.focus();
      }

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
   STATUS
========================================================= */

function setStatus(text) {

  const statusText =
    document.getElementById(
      "statusText"
    );

  if (statusText) {

    statusText.textContent =
      text;

  }

}


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

        runningMultiplier:
          runningSlider
            ? Number(
                runningSlider.value
              )
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

          input.checked =
            false;

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
        povValue.textContent =
          "90°";
      }


      if (speedValue) {
        speedValue.textContent =
          "1.0x";
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

  if (!logsContainer) {
    return;
  }


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
   TEST TRIGGER EVENTS
========================================================= */

document
  .querySelectorAll(
    ".test-trigger"
  )
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


        button.disabled =
          true;


        setTimeout(
          () => {

            button.textContent =
              originalText ||
              "TEST";

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
  .getElementById(
    "clearLogs"
  )
  ?.addEventListener(
    "click",
    () => {

      if (!logsContainer) {
        return;
      }


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
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem(
    "lawangenUser"
  );


  localStorage.removeItem(
    "lawangenTestConfig"
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
  .getElementById(
    "logoutButton"
  )
  ?.addEventListener(
    "click",
    logout
  );


document
  .getElementById(
    "logoutButtonSettings"
  )
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

  } catch (error) {

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