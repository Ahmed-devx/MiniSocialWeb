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

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode")
    ? "Dark Mode"
    : "Light Mode";
});
