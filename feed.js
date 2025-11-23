 
var feed = document.getElementById('feed');
var nameInput = document.getElementById('nameInput');
var textInput = document.getElementById('textInput');
var imageInput = document.getElementById('imageInput');
var postBtn = document.getElementById('postBtn');
var clearBtn = document.getElementById('clearBtn');
var searchInput = document.getElementById('searchInput');
var preview = document.getElementById('preview');

var editModal = document.getElementById('editModal');
var editText = document.getElementById('editText');
var editSave = document.getElementById('editSave');
var editCancel = document.getElementById('editCancel');

var themeToggle = document.getElementById('themeToggle');
var logoutBtn = document.getElementById('logoutBtn');

var posts = JSON.parse(localStorage.getItem('mini_posts') || '[]');
var imageFile = null;
var editingId = null;

 
if (!posts.length) {
  posts.push({
    id: Date.now(),
    name: 'Ahmed',
    text: 'Demo post — image preview from uploaded file',
    img: '/mnt/data/0a8a7337-eb3c-4ec9-9084-2022215388b8.png',
    likes: 2,
    created: new Date().toISOString()
  });
  localStorage.setItem('mini_posts', JSON.stringify(posts));
}

 
imageInput.addEventListener('change', function(e){
  var f = e.target.files[0];
  if (!f) { imageFile = null; preview.textContent=''; return; }
  if (!f.type.startsWith('image/')) { preview.textContent = 'Choose an image file'; imageFile = null; return; }
  var reader = new FileReader();
  reader.onload = function(ev){ imageFile = ev.target.result; preview.textContent = 'Image selected ✓'; }
  reader.readAsDataURL(f);
});

 
clearBtn.addEventListener('click', function(){
  textInput.value = '';
  imageInput.value = '';
  imageFile = null;
  preview.textContent = '';
});

 
postBtn.addEventListener('click', function(){
  var name = nameInput.value.trim();
  var text = textInput.value.trim();
  if (!name) return alert('Please enter your name.');
  if (!text && !imageFile) return alert('Write something or add an image.');

  posts.unshift({
    id: Date.now(),
    name: name,
    text: text,
    img: imageFile,
    likes: 0,
    created: new Date().toISOString()
  });

  localStorage.setItem('mini_posts', JSON.stringify(posts));
  textInput.value = '';
  imageInput.value = '';
  imageFile = null;
  preview.textContent = '';
  render();
});

 
function render(){
  feed.innerHTML = '';
  var q = (searchInput.value || '').trim().toLowerCase();
  for (var i=0;i<posts.length;i++){
    var p = posts[i];
    if (q && p.name.toLowerCase().indexOf(q) === -1) continue;

    var div = document.createElement('div');
    div.className = 'post card';

    var head = '<div class="post-head">' +
                 '<div class="avatar">' + escapeHtml(p.name.charAt(0).toUpperCase()) + '</div>' +
                 '<div class="post-meta"><div class="name">' + escapeHtml(p.name) + '</div>' +
                 '<div class="time muted">' + new Date(p.created).toLocaleString() + '</div></div></div>';

    var body = '<div class="post-body">' + escapeHtml(p.text || '') + '</div>';

    var img = p.img ? ('<div class="post-img"><img src="' + p.img + '" alt="post image"></div>') : '';

    var actions = '<div class="post-actions">' +
                   '<div class="action like" data-id="' + p.id + '"><i class="fa-regular fa-heart"></i><span class="count"> ' + (p.likes||0) + '</span></div>' +
                   '<div class="pill edit" data-id="' + p.id + '">Edit</div>' +
                   '<div class="pill del" data-id="' + p.id + '">Delete</div>' +
                   '</div>';

    div.innerHTML = head + body + img + actions;
    feed.appendChild(div);
  }
}
 
feed.addEventListener('click', function(e){
  var el = e.target;
  
  while (el && el !== feed && !el.dataset.id && !el.classList.contains('like') && !el.classList.contains('edit') && !el.classList.contains('del')) {
    el = el.parentElement;
  }
  if (!el || el === feed) return;

  
  var likeEl = el.closest('.like') || (el.classList && el.classList.contains('like') ? el : null);
  if (likeEl) {
    var id = Number(likeEl.dataset.id);
    for (var k=0;k<posts.length;k++){
      if (posts[k].id === id){ posts[k].likes = (posts[k].likes||0) + 1; break; }
    }
    localStorage.setItem('mini_posts', JSON.stringify(posts));
    render();
    return;
  }

   
  var editEl = el.closest('.edit') || (el.classList && el.classList.contains('edit') ? el : null);
  if (editEl) {
    var id2 = Number(editEl.dataset.id);
    var p = posts.find(function(x){ return x.id === id2 });
    if (!p) return;
    editingId = id2;
    editText.value = p.text || '';
    editModal.classList.remove('hidden');
    return;
  }

   
  var delEl = el.closest('.del') || (el.classList && el.classList.contains('del') ? el : null);
  if (delEl) {
    var id3 = Number(delEl.dataset.id);
    if (confirm('Delete this post?')) {
      posts = posts.filter(function(x){ return x.id !== id3 });
      localStorage.setItem('mini_posts', JSON.stringify(posts));
      render();
    }
    return;
  }
});

 
editCancel.addEventListener('click', function(){ editingId = null; editModal.classList.add('hidden'); });
editSave.addEventListener('click', function(){
  var txt = editText.value;
  for (var i=0;i<posts.length;i++){
    if (posts[i].id === editingId){ posts[i].text = txt; break; }
  }
  localStorage.setItem('mini_posts', JSON.stringify(posts));
  editingId = null;
  editModal.classList.add('hidden');
  render();
});

 
searchInput.addEventListener('input', render);

 
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
themeToggle.addEventListener('click', function(){
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

 
logoutBtn.addEventListener('click', function(){ alert('Logout clicked — demo only'); });

 
function escapeHtml(str){
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

 
render();
function logout() {
 
  window.location.href = "index.html";
}