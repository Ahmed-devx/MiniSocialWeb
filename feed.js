var posts = [];
var profile = {
  name: "MiniSocial User",
  username: "minisocial_user",
  bio: "Just another user on VibeStream.",
  image: "/mnt/data/A_LinkedIn_post_by_a_software_developer_captures_a.png",
};

const ALL_SECTIONS = [
  "profile-info-section",
  "edit-profile-section",
  "post-section",
  "feed-section",
  "settings-section",
];

function loadData() {
  var savedPosts = localStorage.getItem("mini_posts");
  if (savedPosts) {
    posts = JSON.parse(savedPosts);
  }

  var savedProfile = localStorage.getItem("mini_profile");
  if (savedProfile) {
    profile = { ...profile, ...JSON.parse(savedProfile) };
  }

  var theme = localStorage.getItem("mini_theme");
  if (theme === "light") document.body.classList.add("light");

  paintProfile();
  showPosts();
  updateThemeToggleText();

  showSection("profile-info-section");
}

function savePosts() {
  localStorage.setItem("mini_posts", JSON.stringify(posts));
}

function saveProfile() {
  localStorage.setItem("mini_profile", JSON.stringify(profile));
  paintProfile();
}

function paintProfile() {
  var name = profile.name || "Your Name";
  var username = profile.username ? "@" + profile.username : "@username";

  document.getElementById("profile-large-img").src =
    profile.image ||
    "/mnt/data/A_LinkedIn_post_by_a_software_developer_captures_a.png";
  document.getElementById("profile-name-large").innerText = name;
  document.getElementById("profile-username").innerText = username;
  document.getElementById("profile-bio").innerText =
    profile.bio || "This is your bio — edit it below.";
}

function loadEditProfileForm() {
  document.getElementById("edit-name").value = profile.name || "";
  document.getElementById("edit-username").value = profile.username || "";
  document.getElementById("edit-bio").value = profile.bio || "";

  var editImagePreview = document.getElementById("edit-image-preview");
  if (profile.image) {
    editImagePreview.src = profile.image;
    editImagePreview.style.display = "block";
  } else {
    editImagePreview.style.display = "none";
  }
}

function showPosts() {
  var feed = document.getElementById("feed-list");
  feed.innerHTML = "";

  var searchVal = document.getElementById("search-input").value.toLowerCase();
  var currentPosts = posts;

  if (searchVal) {
    currentPosts = posts.filter(
      (p) => p.text && p.text.toLowerCase().includes(searchVal)
    );
  }

  if (currentPosts.length === 0) {
    var message = searchVal
      ? "No matching posts found."
      : "No posts yet — create the first post!";
    feed.innerHTML =
      '<div class="text-center text-muted py-5">' + message + "</div>";
    return;
  }

  currentPosts.forEach(function (p, index) {
    var mainIndex = posts.indexOf(p);

    var card = document.createElement("div");
    card.className = "card post-card shadow-sm fade-in-up";

    card.innerHTML = `
                <div class="post-header">
                    <img src="${
                      profile.image ||
                      "/mnt/data/A_LinkedIn_post_by_a_software_developer_captures_a.png"
                    }" alt="profile" />
                    <div>
                        <strong>${profile.name || "User"}</strong>
                        <div class="post-meta">${
                          profile.username
                            ? "@" + profile.username
                            : "@username"
                        }</div>
                    </div>
                </div>
                <div class="post-body">${p.text}</div>
                ${
                  p.image
                    ? `<img src="${p.image}" class="post-image" alt="Post Image" />`
                    : ""
                }
                <div class="post-actions">
                    <button class="like-btn  ${
                      p.liked ? "liked" : ""
                    }" data-index="${mainIndex}">❤️ ${p.likes}</button>
                    <button class="delete-btn" data-index="${mainIndex}">🗑 Delete</button>
                </div>
            `;

    feed.appendChild(card);
  });

  attachPostActionListeners();
}

function attachPostActionListeners() {
  document.querySelectorAll(".like-btn").forEach((button) => {
    button.onclick = function () {
      const index = parseInt(this.getAttribute("data-index"));
      toggleLike(index);
    };
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.onclick = function () {
      const index = parseInt(this.getAttribute("data-index"));
      deletePost(index);
    };
  });
}

function deletePost(i) {
  posts.splice(i, 1);
  savePosts();
  showPosts();
}

function toggleLike(i) {
  if (posts[i].liked) {
    posts[i].liked = false;
    posts[i].likes--;
  } else {
    posts[i].liked = true;
    posts[i].likes++;
  }
  savePosts();
  showPosts();
}

function updateSidebarActiveLink(targetId) {
  var links = document.querySelectorAll("#sidebar .nav-link");
  links.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === targetId) {
      link.classList.add("active");
    }
  });
}

function showSection(id) {
  ALL_SECTIONS.forEach((sectionId) => {
    var el = document.getElementById(sectionId);
    if (el) el.style.display = "none";
  });

  var targetEl = document.getElementById(id);
  if (targetEl) targetEl.style.display = "block";

  updateSidebarActiveLink(id);

  if (
    window.innerWidth <= 991 &&
    document.body.classList.contains("sidebar-active")
  ) {
    toggleSidebar();
  }
}

function toggleSidebar() {
  document.body.classList.toggle("sidebar-active");
}

function updateThemeToggleText() {
  var isLight = document.body.classList.contains("light");
  if (modeToggle) modeToggle.innerText = isLight ? "Light" : "Dark";
}

document.querySelectorAll("#sidebar .nav-link").forEach((link) => {
  link.onclick = function (e) {
    e.preventDefault();
    var target = this.getAttribute("data-section");
    showSection(target);
  };
});

var openPost = document.getElementById("open-post-form");
if (openPost)
  openPost.onclick = function (e) {
    e.preventDefault();
    showSection("post-section");
    document.getElementById("post-text").focus();
  };

document.getElementById("open-edit-profile-btn").onclick = function () {
  loadEditProfileForm();
  showSection("edit-profile-section");
};

document.getElementById("save-profile").onclick = function () {
  profile.name = document.getElementById("edit-name").value;
  profile.username = document.getElementById("edit-username").value;
  profile.bio = document.getElementById("edit-bio").value;

  var imgFile = document.getElementById("edit-image").files[0];

  if (imgFile) {
    var reader = new FileReader();
    reader.onload = function (e) {
      profile.image = e.target.result;
      saveProfile();
      showSection("profile-info-section");
    };
    reader.readAsDataURL(imgFile);
  } else {
    saveProfile();
    showSection("profile-info-section");
  }
};

document.getElementById("cancel-edit-profile").onclick = function () {
  showSection("profile-info-section");
};

var postImageInput = document.getElementById("post-image");
var postPreview = document.createElement("img");
postPreview.id = "post-preview";
postPreview.style.cssText =
  "max-width: 150px; max-height: 150px; object-fit: cover; border-radius: 8px; margin-top: 8px; border: 2px solid var(--accent); display: none;";
document.querySelector("#post-section .card-body").appendChild(postPreview);

if (postImageInput)
  postImageInput.onchange = function () {
    var file = this.files[0];
    if (file) {
      var r = new FileReader();
      r.onload = function (e) {
        postPreview.src = e.target.result;
        postPreview.style.display = "block";
      };
      r.readAsDataURL(file);
    } else {
      postPreview.style.display = "none";
    }
  };

var editImageInput = document.getElementById("edit-image");
var editImagePreview = document.getElementById("edit-image-preview");
if (editImageInput)
  editImageInput.onchange = function () {
    var file = this.files[0];
    if (file) {
      var r = new FileReader();
      r.onload = function (e) {
        editImagePreview.src = e.target.result;
        editImagePreview.style.display = "block";
      };
      r.readAsDataURL(file);
    } else {
      editImagePreview.style.display = "none";
    }
  };

document.getElementById("submit-post").onclick = function () {
  var text = document.getElementById("post-text").value;
  var imgFile = document.getElementById("post-image").files[0];

  if (text.trim() === "" && !imgFile) return;

  var newPost = {
    text: text,
    image: "",
    likes: 0,
    liked: false,
    created: Date.now(),
  };

  if (!imgFile) {
    posts.unshift(newPost);
    savePosts();
    showPosts();
    document.getElementById("post-form").reset();
    postPreview.style.display = "none";
    showSection("feed-section");
  } else {
    var reader = new FileReader();
    reader.onload = function (e) {
      newPost.image = e.target.result;
      posts.unshift(newPost);
      savePosts();
      showPosts();
      document.getElementById("post-form").reset();
      postPreview.style.display = "none";
      showSection("feed-section");
    };
    reader.readAsDataURL(imgFile);
  }
};

document.getElementById("cancel-post").onclick = function () {
  document.getElementById("post-form").reset();
  postPreview.style.display = "none";
  showSection("feed-section");
};

document.getElementById("search-input").oninput = function () {
  showPosts();
};

var modeToggle = document.getElementById("mode-toggle");
if (modeToggle)
  modeToggle.onclick = function () {
    document.body.classList.toggle("light");
    var isLight = document.body.classList.contains("light");
    localStorage.setItem("mini_theme", isLight ? "light" : "dark");
    updateThemeToggleText();
  };

document.getElementById("hamburger").onclick = toggleSidebar;

loadData();
function logout() {
  window.location.href = "index.html";
}
