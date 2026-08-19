/* =========================================================
   LAWANG INJECTOR
   Developer Test Interface
========================================================= */


/* =========================================================
   GLOBAL ELEMENTS
========================================================= */

const screens = document.querySelectorAll(".app-screen");

const navigationButtons =
  document.querySelectorAll(".nav-button");

const loginScreen =
  document.getElementById("loginScreen");

const app =
  document.getElementById("app");


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
    behavior: "instant"
  });

}


/* =========================================================
   AUTH ELEMENTS
========================================================= */

const loginButton =
  document.getElementById("loginButton");

const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const loginMessage =
  document.getElementById("loginMessage");

const registerForm =
  document.getElementById("registerForm");

const loginForm =
  document.getElementById("loginForm");

const forgotForm =
  document.getElementById("forgotForm");


/* =========================================================
   AUTH SCREEN SWITCHING
========================================================= */

function showLoginForm() {

  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  forgotForm.classList.add("hidden");

}


function showRegisterForm() {

  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  forgotForm.classList.add("hidden");

}


function showForgotForm() {

  loginForm.classList.add("hidden");
  registerForm.classList.add("hidden");
  forgotForm.classList.remove("hidden");

}


document
  .getElementById("showRegister")
  ?.addEventListener(
    "click",
    showRegisterForm
  );


document
  .getElementById("showLogin")
  ?.addEventListener(
    "click",
    showLoginForm
  );


document
  .getElementById("showForgot")
  ?.addEventListener(
    "click",
    showForgotForm
  );


document
  .getElementById("forgotBack")
  ?.addEventListener(
    "click",
    showLoginForm
  );


/* =========================================================
   REGISTER
========================================================= */

const registerButton =
  document.getElementById("registerButton");


registerButton?.addEventListener(
  "click",
  () => {

    const username =
      document
        .getElementById("registerUsername")
        .value
        .trim();

    const password =
      document
        .getElementById("registerPassword")
        .value
        .trim();

    const confirm =
      document
        .getElementById("registerConfirm")
        .value
        .trim();

    const message =
      document.getElementById(
        "registerMessage"
      );


    if (!username || !password || !confirm) {

      message.textContent =
        "Please complete all fields.";

      return;
    }


    if (password !== confirm) {

      message.textContent =
        "Passwords do not match.";

      return;
    }


    if (username.length < 3) {

      message.textContent =
        "Username must contain at least 3 characters.";

      return;
    }


    if (password.length < 4) {

      message.textContent =
        "Password must contain at least 4 characters.";

      return;
    }


    /*
      Demo/local account.

      This is intentionally local storage only.
      For a real production account system,
      use a proper backend authentication service.
    */

    const account = {
      username: username,
      password: password
    };


    localStorage.setItem(
      "lawangAccount",
      JSON.stringify(account)
    );


    message.textContent =
      "Account created successfully.";


    document.getElementById(
      "registerUsername"
    ).value = "";

    document.getElementById(
      "registerPassword"
    ).value = "";

    document.getElementById(
      "registerConfirm"
    ).value = "";


    setTimeout(() => {

      showLoginForm();

      usernameInput.value =
        username;

      loginMessage.textContent =
        "Account created. Please login.";

    }, 700);

  }
);


/* =========================================================
   LOGIN
========================================================= */

loginButton?.addEventListener(
  "click",
  () => {

    const username =
      usernameInput.value.trim();

    const password =
      passwordInput.value.trim();


    if (!username || !password) {

      loginMessage.textContent =
        "Please enter username and password.";

      return;
    }


    const savedAccount =
      JSON.parse(
        localStorage.getItem(
          "lawangAccount"
        ) || "null"
      );


    /*
      If no account exists yet,
      create a simple developer-test account
      from the entered credentials.
    */

    if (!savedAccount) {

      const account = {
        username: username,
        password: password
      };


      localStorage.setItem(
        "lawangAccount",
        JSON.stringify(account)
      );

    }


    const account =
      JSON.parse(
        localStorage.getItem(
          "lawangAccount"
        )
      );


    if (
      username !== account.username ||
      password !== account.password
    ) {

      loginMessage.textContent =
        "Invalid username or password.";

      return;
    }


    localStorage.setItem(
      "lawangUser",
      username
    );


    updateProfile(username);


    loginMessage.textContent = "";


    loginScreen.classList.add(
      "hidden"
    );

    app.classList.remove(
      "hidden"
    );


    openScreen(
      "homeScreen"
    );


    addLog(
      "Developer account logged in"
    );

  }
);


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
      username;

  }


  const avatar =
    document.querySelector(
      ".avatar"
    );

  if (avatar && username) {

    avatar.textContent =
      username
        .charAt(0)
        .toUpperCase();

  }

}


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
   POV
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

    povValue.textContent =
      `${povSlider.value}°`;

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

    speedValue.textContent =
      `${Number(
        speedSlider.value
      ).toFixed(1)}x`;

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

  const activeCount =
    document.getElementById(
      "activeCount"
    );

  if (activeCount) {

    activeCount.textContent =
      `${getActiveTests()} Active`;

  }

}


testInputs.forEach(input => {

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

    }
  );

});


/* =========================================================
   APPLY CONFIGURATION
========================================================= */

document
  .getElementById("applyConfig")
  ?.addEventListener(
    "click",
    () => {

      const configuration = {

        activeTests:
          Array.from(
            document.querySelectorAll(
              "input[data-test]:checked"
            )
          ).map(
            input =>
              input.dataset.name ||
              "Test"
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
        "lawangTestConfig",
        JSON.stringify(
          configuration
        )
      );


      addLog(
        `${configuration.activeTests.length} test option(s) configured`
      );


      const statusText =
        document.getElementById(
          "statusText"
        );

      if (statusText) {

        statusText.textContent =
          "TEST CONFIG READY";

      }


      openScreen(
        "logsScreen"
      );

    }
  );


/* =========================================================
   RESET CONFIGURATION
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

        povValue.textContent =
          "90°";

      }


      if (speedValue) {

        speedValue.textContent =
          "1.0x";

      }


      localStorage.removeItem(
        "lawangTestConfig"
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
    new Date()
      .toLocaleTimeString();


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
   ANTI-CHEAT CONTROLLED TEST EVENTS
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
          `Anti-cheat test: ${eventName}`
        );


        const statusText =
          document.getElementById(
            "statusText"
          );


        if (statusText) {

          statusText.textContent =
            "TEST EVENT GENERATED";

        }


        /*
          These are only simulated events.
          They do not modify or inject into a game.
        */

        button.textContent =
          "DONE";


        setTimeout(() => {

          button.textContent =
            "TEST";

        }, 900);

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
    "lawangUser"
  );


  app.classList.add(
    "hidden"
  );

  loginScreen.classList.remove(
    "hidden"
  );


  usernameInput.value =
    "";

  passwordInput.value =
    "";


  loginMessage.textContent =
    "";


  showLoginForm();


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
   FORGOT PASSWORD
========================================================= */

document
  .getElementById("forgotButton")
  ?.addEventListener(
    "click",
    () => {

      const username =
        document
          .getElementById(
            "forgotUsername"
          )
          .value
          .trim();


      const message =
        document.getElementById(
          "forgotMessage"
        );


      const account =
        JSON.parse(
          localStorage.getItem(
            "lawangAccount"
          ) || "null"
        );


      if (
        !username ||
        !account ||
        username !== account.username
      ) {

        message.textContent =
          "Account not found.";

        return;

      }


      message.textContent =
        "Demo recovery request completed. Please create a new account if needed.";

    }
  );


/* =========================================================
   LOAD SAVED CONFIGURATION
========================================================= */

function loadConfiguration() {

  const saved =
    JSON.parse(
      localStorage.getItem(
        "lawangTestConfig"
      ) || "null"
    );


  if (!saved) return;


  if (
    povSlider &&
    typeof saved.pov === "number"
  ) {

    povSlider.value =
      saved.pov;

    povValue.textContent =
      `${saved.pov}°`;

  }


  if (
    speedSlider &&
    typeof saved.speed === "number"
  ) {

    speedSlider.value =
      saved.speed;

    speedValue.textContent =
      `${Number(
        saved.speed
      ).toFixed(1)}x`;

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
   SAVED LOGIN
========================================================= */

const savedUser =
  localStorage.getItem(
    "lawangUser"
  );


if (savedUser) {

  updateProfile(
    savedUser
  );


  loginScreen.classList.add(
    "hidden"
  );

  app.classList.remove(
    "hidden"
  );


  openScreen(
    "homeScreen"
  );

}


/* =========================================================
   INITIAL STATE
========================================================= */

loadConfiguration();

updateActiveCount();