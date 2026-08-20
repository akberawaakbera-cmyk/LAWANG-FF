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

/*
   Change this username to your own developer username.

   This is only a frontend/UI restriction.
   It is NOT a secure authentication system.
*/

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
      username || "LAWANGIN 444";

  }


  /*
    Do NOT replace the profile logo
    with the username letter.
  */

  const avatar =
    document.querySelector(".avatar");

  if (
    avatar &&
    !avatar.querySelector("img") &&
    username
  ) {

    avatar.textContent =
      username.charAt(0).toUpperCase();

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
   DEVELOPER LOGO SYSTEM
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
   CREATE LOGO PICKER
========================================================= */

function createDeveloperLogoPicker() {

  const profileBox =
    document.querySelector(
      ".profile-box"
    );

  if (!profileBox) return;


  /*
    Don't create it twice.
  */

  if (
    document.getElementById(
      "developerLogoControls"
    )
  ) {
    return;
  }


  const controls =
    document.createElement("div");

  controls.id =
    "developerLogoControls";

  controls.style.marginTop =
    "18px";


  const fileInput =
    document.createElement("input");

  fileInput.type =
    "file";

  fileInput.id =
    "developerLogoInput";

  fileInput.accept =
    "image/png,image/jpeg,image/webp,image/gif";

  fileInput.style.display =
    "none";


  const chooseButton =
    document.createElement("button");

  chooseButton.type =
    "button";

  chooseButton.className =
    "secondary-button";

  chooseButton.textContent =
    "CHANGE DEVELOPER LOGO";


  const resetButton =
    document.createElement("button");

  resetButton.type =
    "button";

  resetButton.className =
    "secondary-button";

  resetButton.textContent =
    "RESET LOGO";


  chooseButton.addEventListener(
    "click",
    () => {

      fileInput.click();

    }
  );


  fileInput.addEventListener(
    "change",
    event => {

      const file =
        event.target.files?.[0];

      if (!file) return;


      /*
        Limit large files.
        5 MB maximum.
      */

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        alert(
          "Logo must be smaller than 5 MB."
        );

        fileInput.value = "";

        return;

      }


      const reader =
        new FileReader();


      reader.onload =
        () => {

          const imageData =
            reader.result;


          if (
            typeof imageData !==
            "string"
          ) {
            return;
          }


          localStorage.setItem(
            "lawangenDeveloperLogo",
            imageData
          );


          applyDeveloperLogo(
            imageData
          );


          addLog(
            "Developer logo changed"
          );


          setStatus(
            "DEVELOPER LOGO UPDATED"
          );

        };


      reader.readAsDataURL(file);

    }
  );


  resetButton.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "lawangenDeveloperLogo"
      );


      location.reload();

    }
  );


  controls.appendChild(
    fileInput
  );

  controls.appendChild(
    chooseButton
  );

  controls.appendChild(
    resetButton
  );


  profileBox.appendChild(
    controls
  );

}


/* =========================================================
   APPLY LOGO EVERYWHERE
========================================================= */

function applyDeveloperLogo(
  imageData
) {

  if (!imageData) return;


  const logos =
    document.querySelectorAll(
      "img[src='assets/logo.png'], .profile-logo img"
    );


  logos.forEach(
    img => {

      img.src =
        imageData;

    }
  );

}


/* =========================================================
   LOAD SAVED LOGO
========================================================= */

function loadDeveloperLogo() {

  const savedLogo =
    localStorage.getItem(
      "lawangenDeveloperLogo"
    );


  if (savedLogo) {

    applyDeveloperLogo(
      savedLogo
    );

  }

}


/* =========================================================
   DEVELOPER CONTROLS
========================================================= */

function updateDeveloperControls() {

  const controls =
    document.getElementById(
      "developerLogoControls"
    );


  if (isDeveloper()) {

    createDeveloperLogoPicker();

  }
  else {

    if (controls) {
      controls.remove();
    }

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

updateDeveloperControls();