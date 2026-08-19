/* =========================================================
   LAWANGEN INJECTOR
   Developer Test Interface — UI / SIMULATION ONLY
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

const loginButton =
  document.getElementById("loginButton");

const usernameInput =
  document.getElementById("username");

/*
  Password is removed.
  Your HTML should contain:

  <input id="key" type="text" placeholder="Enter your key">
*/

const keyInput =
  document.getElementById("key");

const loginMessage =
  document.getElementById("loginMessage");


function performLogin() {

  const username =
    usernameInput?.value.trim() || "";

  const key =
    keyInput?.value.trim() || "";

  if (!username || !key) {

    if (loginMessage) {
      loginMessage.textContent =
        "Please enter username and key.";
    }

    return;
  }

  /*
    UI / demo login only.
    No real game authentication or injection.
  */

  localStorage.setItem(
    "lawangenUser",
    username
  );

  updateProfile(username);

  if (loginMessage) {
    loginMessage.textContent = "";
  }

  loginScreen?.classList.add("hidden");
  app?.classList.remove("hidden");

  openScreen("homeScreen");

  addLog(
    "Developer test login successful"
  );
}


loginButton?.addEventListener(
  "click",
  performLogin
);


/* ================= ENTER KEY LOGIN ================= */

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


/* ================= PROFILE BUTTON ================= */

document
  .getElementById("profileButton")
  ?.addEventListener(
    "click",
    () => {
      openScreen("profileScreen");
    }
  );


/* ================= BACK BUTTONS ================= */

document
  .querySelectorAll(".back-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        /*
          Return to Selection for test pages.
        */

        openScreen("selectionScreen");

      }
    );

  });


/* ================= POV ================= */

const povSlider =
  document.getElementById("povSlider");

const povValue =
  document.getElementById("povValue");

povSlider?.addEventListener(
  "input",
  () => {

    if (povValue) {

      povValue.textContent =
        `${povSlider.value}°`;

    }

  }
);


/* ================= SPEED ================= */

const speedSlider =
  document.getElementById("speedSlider");

const speedValue =
  document.getElementById("speedValue");

speedSlider?.addEventListener(
  "input",
  () => {

    if (speedValue) {

      speedValue.textContent =
        `${Number(speedSlider.value).toFixed(1)}x`;

    }

  }
);


/* =========================================================
   TEST OPTIONS
========================================================= */

const testInputs =
  document.querySelectorAll(
    "input[data-test]"
  );


/* ================= ACTIVE COUNT ================= */

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


/* =========================================================
   NEW OPTIONS
=========================================================

   These names are supported automatically
   when added to index.html:

   AWM Killing
   AWM Headshot
   AWM Auto Headshot
   ESP Name
   Running
   Fast Running

========================================================= */


testInputs.forEach(input => {

  input.addEventListener(
    "change",
    () => {

      updateActiveCount();

      const name =
        input.dataset.name ||
        input.getAttribute("aria-label") ||
        "Test option";

      addLog(
        `${name}: ${
          input.checked
            ? "ENABLED"
            : "DISABLED"
        }`
      );

    }
  );

});


/* =========================================================
   RUNNING MULTIPLIER
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
      `${runningSlider.value}x`;

  }

}


runningSlider?.addEventListener(
  "input",
  updateRunningValue
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
            input.getAttribute("aria-label") ||
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
            : 1

      };


      localStorage.setItem(
        "lawangenTestConfig",
        JSON.stringify(configuration)
      );


      addLog(
        `${activeTests.length} test option(s) configured`
      );


      const statusText =
        document.getElementById(
          "statusText"
        );

      if (statusText) {

        statusText.textContent =
          "TEST CONFIG READY";

      }


      openScreen("logsScreen");

    }
  );


/* =========================================================
   RESET
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
   SIMULATION EVENTS
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


        const statusText =
          document.getElementById(
            "statusText"
          );


        if (statusText) {

          statusText.textContent =
            "SIMULATION EVENT GENERATED";

        }


        const originalText =
          button.textContent;


        button.textContent =
          "DONE";


        setTimeout(
          () => {

            button.textContent =
              originalText || "TEST";

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

    }
  );


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem(
    "lawangenUser"
  );


  app?.classList.add("hidden");

  loginScreen?.classList.remove(
    "hidden"
  );


  if (usernameInput) {
    usernameInput.value = "";
  }


  if (keyInput) {
    keyInput.value = "";
  }


  if (loginMessage) {
    loginMessage.textContent = "";
  }


  openScreen("homeScreen");

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
        `${Number(saved.speed).toFixed(1)}x`;

    }

  }


  /* ---------- RUNNING ---------- */

  if (
    runningSlider &&
    typeof saved.runningMultiplier === "number"
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

  updateProfile(savedUser);

  loginScreen?.classList.add(
    "hidden"
  );

  app?.classList.remove(
    "hidden"
  );

  openScreen("homeScreen");

}


/* =========================================================
   INITIALIZE
========================================================= */

loadConfiguration();
updateRunningValue();
updateActiveCount();