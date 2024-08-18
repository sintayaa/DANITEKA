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

        // Simpan data pengguna yang baru login
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify({ username: username, fullname: fullname }),
        );

        alert("Registrasi berhasil dan Anda telah login!");

        // Buka Tracer Study di tab baru
        openTS();

        // Redirect ke dashboard di tab yang sama
        redirectToDashboard();
    }
}

// Fungsi untuk login user
function loginUser() {
    const username = document.getElementById("logUsername").value;
    const password = document.getElementById("logPassword").value;

    // Pengecekan khusus untuk admin
    if (username === "admin" && password === "admin") {
        alert("Login sebagai admin berhasil!");
        window.location.href = "admin.html";
        return;
    }
    // Pengecekan untuk user biasa
    const user = JSON.parse(localStorage.getItem(username));

    if (user && user.password === password) {
        alert("Login berhasil!");
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify({ username: username, fullname: user.fullname }),
        ); // Simpan data sesi pengguna yang sedang login

        // Cek apakah data pengguna sudah lengkap
        const userData = JSON.parse(localStorage.getItem(username + "_data"));
        if (
            userData &&
            userData.tahunAkt &&
            userData.jeniskelamin &&
            userData.ttl &&
            userData.pekerjaan &&
            userData.email
        ) {
            // Jika data lengkap, redirect ke alumni.html
            window.location.href = "alumnilogin.html";
        } else {
            // Jika data tidak lengkap, redirect ke dashboard.html
            window.location.href = "dashboard.html";
        }
    } else {
        alert("Username atau password salah!");
    }
}

// Fungsi untuk login user
function loginTS() {
    const username = document.getElementById("logUsername").value;
    const password = document.getElementById("logPassword").value;

    const user = JSON.parse(localStorage.getItem(username));

    if (user && user.password === password) {
        alert("Login berhasil!");
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify({ username: username, fullname: user.fullname }),
        ); // Simpan data sesi pengguna yang sedang login

        // Cek apakah data pengguna sudah lengkap
        const userData = JSON.parse(localStorage.getItem(username + "_data"));
        if (
            userData &&
            userData.tahunAkt &&
            userData.jeniskelamin &&
            userData.ttl &&
            userData.pekerjaan &&
            userData.email
        ) {
            // Jika data lengkap, redirect ke alumni.html
            // Buka Tracer Study di tab baru
            openTS();
            window.location.href = "alumnilogin.html";
        } else {
            // Jika data tidak lengkap, redirect ke dashboard.html
            // Buka Tracer Study di tab baru
            openTS();
            window.location.href = "dashboard.html";
        }
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
            document.getElementById("pekerjaan").value =
                userData.pekerjaan || "";
            document.getElementById("email").value = userData.email || "";
            document.getElementById("password").value = userData.password || "";

            if (userData.profil) {
                document
                    .getElementById("profil")
                    .setAttribute("data-file", userData.profil);
                document.querySelector(".dropbtn").src = userData.profil; // Update profil image di header
            }
        }
    }
}

// Fungsi untuk menyimpan data pengguna dari form dashboard
function saveUserData() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const username = loggedInUser.username;

        // Ambil nilai dari semua field
        const fullname = document.getElementById("nama").value;
        const tahunAkt = document.getElementById("tahunAkt").value;
        const jeniskelamin = document.getElementById("jk").value;
        const ttl = document.getElementById("ttl").value;
        const pekerjaan = document.getElementById("pekerjaan").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validasi apakah semua field sudah diisi
        if (
            !fullname ||
            !tahunAkt ||
            !jeniskelamin ||
            !ttl ||
            !pekerjaan ||
            !email
        ) {
            alert("Semua field harus diisi!"); // Pop-up jika ada field yang belum diisi
            return;
        }

        // Update nama dan simpan kembali ke localStorage
        loggedInUser.fullname = fullname;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        // Simpan data tambahan
        const fileInput = document.getElementById("profil");
        const file = fileInput.files[0];
        let profilSrc = "";

        if (file) {
            // Cek ukuran file (maksimal 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB dalam bytes
            if (file.size > maxSize) {
                alert("Ukuran file terlalu besar! Maksimal 5MB.");
                return; // Hentikan proses jika file terlalu besar
            }

            // Cek jenis file yang diizinkan
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(file.type)) {
                alert(
                    "Tipe file tidak diizinkan! Hanya file JPG, JPEG, atau PNG yang diperbolehkan.",
                );
                return; // Hentikan proses jika tipe file tidak diizinkan
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                profilSrc = e.target.result;
                updateUserData(username, fullname, profilSrc);
            };
            reader.readAsDataURL(file);
        } else {
            profilSrc =
                document.getElementById("profil").getAttribute("data-file") ||
                "";
            updateUserData(username, fullname, profilSrc);
        }
    } else {
        alert("User tidak ditemukan. Silakan login terlebih dahulu.");
    }
}

function updateUserData(username, fullname, profilSrc) {
    const userData = {
        fullname: fullname,
        tahunAkt: document.getElementById("tahunAkt").value,
        jeniskelamin: document.getElementById("jk").value,
        ttl: document.getElementById("ttl").value,
        pekerjaan: document.getElementById("pekerjaan").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        profil: profilSrc,
    };

    localStorage.setItem(username + "_data", JSON.stringify(userData));
    alert("Data berhasil disimpan!");

    // Update placeholders dengan data yang telah disimpan
    displayUserData();

    // Alihkan ke alumni.html jika semua field sudah lengkap
    window.location.href = "alumnilogin.html";
}

function updateUserData(username, fullname, profilSrc) {
    const userData = {
        fullname: fullname,
        tahunAkt: document.getElementById("tahunAkt").value,
        jeniskelamin: document.getElementById("jk").value,
        ttl: document.getElementById("ttl").value,
        pekerjaan: document.getElementById("pekerjaan").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        profil: profilSrc,
    };

    localStorage.setItem(username + "_data", JSON.stringify(userData));
    alert("Data berhasil disimpan!");

    // Update placeholders dengan data yang telah disimpan
    displayUserData();
    // Alihkan ke alumni.html
    window.location.href = "alumnilogin.html";
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

function displayRegisteredUsers() {
    const users = Object.keys(localStorage).filter(
        (key) => key !== "loggedInUser" && !key.includes("_data"),
    );
    const userTable = document.getElementById("userTable");
    const totalUsersElem = document.getElementById("totalUsers");

    userTable.innerHTML = "";

    // Membuat header tabel
    const headerRow = document.createElement("tr");
    headerRow.innerHTML =
        "<th>Username</th><th>Fullname</th><th>Tahun Akt</th><th>Jenis Kelamin</th><th>TTL</th><th>Pekerjaan</th><th>Email</th><th>Password</th><th>Profil</th><th>Aksi</th>";
    userTable.appendChild(headerRow);

    users.forEach(function (username) {
        const user = JSON.parse(localStorage.getItem(username));
        const userData =
            JSON.parse(localStorage.getItem(username + "_data")) || {};

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

    // Update jumlah total user terdaftar
    totalUsersElem.textContent = users.length;
}

// Fungsi untuk menghapus user dari localStorage
function deleteUser(username) {
    if (confirm(`Apakah Anda yakin ingin menghapus user ${username}?`)) {
        localStorage.removeItem(username);
        localStorage.removeItem(username + "_data"); // Hapus juga data tambahan jika ada
        displayRegisteredUsers(); // Refresh daftar user setelah penghapusan
    }
}

// Fungsi untuk mengedit password user
function editUser(username) {
    const newPassword = prompt(
        `Masukkan password baru untuk user ${username}:`,
    );
    if (newPassword) {
        const user = JSON.parse(localStorage.getItem(username));
        user.password = newPassword;
        localStorage.setItem(username, JSON.stringify(user));
        displayRegisteredUsers(); // Refresh daftar user setelah pengeditan
        alert(`Password untuk ${username} berhasil diperbarui.`);
    }
}

function resetPassword() {
    const enteredUsername = prompt("Masukkan username untuk reset password:");

    if (enteredUsername) {
        const user = JSON.parse(localStorage.getItem(enteredUsername));
        if (user) {
            const newPassword = prompt(
                `Masukkan password baru untuk user ${enteredUsername}:`,
            );
            if (newPassword) {
                user.password = newPassword;
                localStorage.setItem(enteredUsername, JSON.stringify(user));
                alert("Password berhasil direset!");
                window.location.href = "login.html"; // Kembali ke halaman login setelah reset
            } else {
                alert("Password baru tidak boleh kosong!");
            }
        } else {
            alert("Username tidak ditemukan!");
        }
    } else {
        alert("Username tidak boleh kosong!");
    }
}
function redirectToDashboard() {
    window.location.href = "dashboard.html";
}

function openTS() {
    window.open("https://forms.gle/66BJMPgzstn5V8PV9", "_blank");
}

// Fungsi untuk memuat dan menampilkan gambar profil dari localStorage
function loadProfileImage() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const username = loggedInUser.username;
        const userData = JSON.parse(localStorage.getItem(username + "_data"));
        if (userData && userData.profil) {
            document.querySelector(".dropbtn").src = userData.profil;
            document.getElementById("namaAlumni").textContent =
                userData.fullname || "Nama Alumni";
        }
    }
}
