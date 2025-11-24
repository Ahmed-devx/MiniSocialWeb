var firstBox = document.getElementsByClassName("firstBox")[0];
var secondBox = document.getElementsByClassName("secondBox")[0];

function signup() {
  var email = document.getElementById("signupEmail").value;
  var password = document.getElementById("signupPassword").value;

  if (email && password) {
    var user = {
      email: email,
      password: password,
    };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Signup successful!");
    document.getElementById("signupEmail").value = "";
    document.getElementById("signupPassword").value = "";
    firstBox.style.display = "none";
    secondBox.style.display = "block";
  } else {
    alert("Please fill all fields!");
  }
}

function login() {
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;
  var storedUser = JSON.parse(localStorage.getItem("user"));
  if (
    storedUser &&
    storedUser.email === email &&
    storedUser.password === password
  ) {
    alert("Login successful!");

    window.location.href = "feed.html";

    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
  } else {
    alert("Incorrect email or password!");
  }
}

function firstLogin() {
  firstBox.style.display = "none";
  secondBox.style.display = "block";
}

function againSignup() {
  secondBox.style.display = "none";
  firstBox.style.display = "block";
}
const modeToggle = document.getElementById("mode-toggle");
const THEME_KEY = "mini_theme";

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "light") {
  document.body.classList.add("light");
} else {
  document.body.classList.remove("light");
}

if (modeToggle) {
  modeToggle.onclick = function () {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");

    localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
  };
}
