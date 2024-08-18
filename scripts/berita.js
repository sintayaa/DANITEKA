// Fungsi untuk register user
function registerUser() {
  const fullname = document.getElementById("regFullname").value;
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  if (localStorage.getItem(username)) {
    alert("Username sudah terdaftar!");
  } else {
    const user = {
      fullname: fullname,
      password: password,
    };
    localStorage.setItem(username, JSON.stringify(user));
    alert("Registrasi berhasil! - Silakan login di sini...");
    window.location.href = "./login.html"; // Redirect ke halaman login setelah registrasi
  }
}

// Fungsi untuk login user
function loginUser() {
  const username = document.getElementById("logUsername").value;
  const password = document.getElementById("logPassword").value;

  const user = JSON.parse(localStorage.getItem(username));

  if (user && user.password === password) {
    alert("Login berhasil!");
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ username: username, fullname: user.fullname }),
    ); // Simpan data sesi pengguna yang sedang login
    window.location.href = "./dashboard.html"; // Redirect ke halaman dashboard setelah login
  } else {
    alert("Username atau password salah!");
  }
}

// Fungsi untuk menampilkan nama pengguna yang sedang login
function displayUsername() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser && loggedInUser.fullname) {
    const namaAlumniElem = document.getElementById("namaAlumni");
    if (namaAlumniElem) {
      namaAlumniElem.textContent = loggedInUser.fullname;
    }
  }
}

// Fungsi untuk menampilkan data pengguna yang sedang login dan mengisi form dengan data yang sudah ada
function displayUserData() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    const { username, fullname } = loggedInUser;
    document.getElementById("dashboardTitle").textContent = fullname;
    document.getElementById("nama").value = fullname;
    document.getElementById("nim").value = username;

    // Jika ada data tambahan yang disimpan sebelumnya, tampilkan di form
    const userData = JSON.parse(localStorage.getItem(username + "_data"));
    if (userData) {
      document.getElementById("tahunAkt").value = userData.tahunAkt || "";
      document.getElementById("jk").value = userData.jeniskelamin || "";
      document.getElementById("ttl").value = userData.ttl || "";
      document.getElementById("pekerjaan").value = userData.pekerjaan || "";
      document.getElementById("email").value = userData.email || "";
      document.getElementById("password").value = userData.password || "";
      if (userData.profil) {
        document
          .getElementById("profil")
          .setAttribute("data-file", userData.profil);
      }
    }
  }
}

// Fungsi untuk menyimpan data pengguna dari form dashboard
function saveUserData() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    const username = loggedInUser.username;

    // Update nama dan simpan kembali ke localStorage
    const fullname = document.getElementById("nama").value;
    loggedInUser.fullname = fullname;
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    // Simpan data tambahan
    const userData = {
      fullname: fullname,
      tahunAkt: document.getElementById("tahunAkt").value,
      jeniskelamin: document.getElementById("jk").value,
      ttl: document.getElementById("ttl").value,
      pekerjaan: document.getElementById("pekerjaan").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      profil: document.getElementById("profil").files[0]
        ? document.getElementById("profil").files[0].name
        : document.getElementById("profil").getAttribute("data-file") || "",
    };

    localStorage.setItem(username + "_data", JSON.stringify(userData));
    alert("Data berhasil disimpan!");

    // Update placeholders dengan data yang telah disimpan
    displayUserData();
    // Alihkan ke alumni.html
    window.location.href = "alumnilogin.html";
  } else {
    alert("User tidak ditemukan. Silakan login terlebih dahulu.");
  }
}

// Fungsi untuk logout user
function logoutUser() {
  localStorage.removeItem("loggedInUser"); // Hapus data sesi pengguna yang sedang login
  alert("Anda telah logout.");
  window.location.href = "index.html"; // Redirect ke halaman login setelah logout
}

document.addEventListener("DOMContentLoaded", function () {
  displayUsername(); // Panggil fungsi displayUsername saat halaman dimuat
  displayUserData(); // Panggil fungsi displayUserData saat halaman dimuat
});

// Fungsi untuk menampilkan semua user terdaftar dalam format tabel
function displayRegisteredUsers() {
  const users = Object.keys(localStorage).filter(
    (key) => key !== "loggedInUser" && !key.includes("_data"),
  );
  const userTable = document.getElementById("userTable");

  userTable.innerHTML = "";

  // Membuat header tabel
  const headerRow = document.createElement("tr");
  headerRow.innerHTML =
    "<th>Username</th><th>Fullname</th><th>Tahun Akt</th><th>Jenis Kelamin</th><th>TTL</th><th>Pekerjaan</th><th>Email</th><th>Password</th><th>Profil</th><th>Aksi</th>";
  userTable.appendChild(headerRow);

  users.forEach(function (username) {
    const user = JSON.parse(localStorage.getItem(username));
    const userData = JSON.parse(localStorage.getItem(username + "_data")) || {};

    const row = document.createElement("tr");

    row.innerHTML = `<td>${username}</td>
                         <td>${user.fullname || ""}</td>
                         <td>${userData.tahunAkt || ""}</td>
                         <td>${userData.jeniskelamin || ""}</td>
                         <td>${userData.ttl || ""}</td>
                         <td>${userData.pekerjaan || ""}</td>
                         <td>${userData.email || ""}</td>
                         <td>${user.password || ""}</td>
                         <td>${userData.profil || ""}</td>
                         <td>
                             <button class="edit" onclick="editUser('${username}')">Edit</button> | 
                             <button class="delete" onclick="deleteUser('${username}')">Hapus</button>
                         </td>`;
    userTable.appendChild(row);
  });
}

// Fungsi untuk menghapus user dari localStorage
function deleteUser(username) {
  if (confirm(`Apakah Anda yakin ingin menghapus user ${username}?`)) {
    localStorage.removeItem(username);
    localStorage.removeItem(username + "_data"); // Hapus juga data tambahan jika ada
    displayRegisteredUsers(); // Refresh daftar user setelah penghapusan
  }
}

// Fungsi untuk mengedit user di localStorage
function editUser(username) {
  const newPassword = prompt(`Masukkan password baru untuk user ${username}:`);
  if (newPassword) {
    const user = JSON.parse(localStorage.getItem(username));
    user.password = newPassword;
    localStorage.setItem(username, JSON.stringify(user));
    displayRegisteredUsers(); // Refresh daftar user setelah pengeditan
  }
}

function openModal() {
  document.getElementById("myModal").style.display = "block";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
