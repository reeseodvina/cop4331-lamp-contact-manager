

// Use relative path so it works on both mudkip.space and IP
const API_BASE = "/LAMPAPI/";

// -------------------- LOGIN PAGE --------------------
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    try {
      const res = await fetch(API_BASE + "LoginContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, password })
      });

      const data = await res.json();
      console.log("Login API response:", data);

      if (data.error === "") {
        localStorage.setItem("userId", data.id);
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("lastName", data.lastName);
        window.location.href = "dashboard.html";
      } else {
        alert("Login failed: " + data.error);
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      alert("Could not reach login API");
    }
  });
}

// -------------------- SIGNUP PAGE --------------------
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = signupForm.firstName.value.trim();
    const lastName = signupForm.lastName.value.trim();
    const username = signupForm.username.value.trim();
    const password = signupForm.password.value.trim();

    try {
      const res = await fetch(API_BASE + "RegisterContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, login: username, password })
      });

      const data = await res.json();
      console.log("Register API response:", data);

      if (data.error === "") {
        alert("Account created! Please login.");
        window.location.href = "http://mudkip.space"; // consistent redirect
      } else {
        alert("Signup failed: " + data.error);
      }
    } catch (err) {
      console.error("Signup fetch error:", err);
      alert("Could not reach signup API");
    }
  });
}

// -------------------- DASHBOARD PAGE --------------------
const searchForm = document.getElementById("search-form");
const contactsList = document.getElementById("contacts-list");
const addForm = document.getElementById("add-form");

// Fill welcome banner with name if available
const welcomeName = document.getElementById("welcome-name");
if (welcomeName) {
  welcomeName.textContent = `${localStorage.getItem("firstName") || ""} ${localStorage.getItem("lastName") || ""}`;
}

// Logout button
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "http://mudkip.space";
  });
}

// Load contacts (search or all)
async function loadContacts(query = "") {
  const userId = localStorage.getItem("userId");

  const res = await fetch(API_BASE + "SearchContact.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ search: query, userId })
  });

  const data = await res.json();

  contactsList.innerHTML = "";
  if (data.results && data.results.length > 0) {
    data.results.forEach((c) => {
      const div = document.createElement("div");
      div.className = "contact-item";
      div.innerHTML = `
        <p>
          <strong>${c.Name || ((c.FirstName || "") + " " + (c.LastName || ""))}</strong><br>
          Email: ${c.Email || ""}<br>
          Phone: ${c.Phone || ""}
        </p>
        <div class="contact-actions">
          <button class="login-btn edit-btn" data-id="${c.ID || c.id}">Edit</button>
          <button class="signup-btn delete-btn" data-id="${c.ID || c.id}">Delete</button>
        </div>
      `;
      contactsList.appendChild(div);
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => editContactPrompt(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteContact(btn.dataset.id));
    });
  } else {
    contactsList.innerHTML = "<p>No contacts found.</p>";
  }
}

// Handle search
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("search-input").value.trim();
    loadContacts(query); // empty → all, typed → filter
  });
}

// Handle add contact
if (addForm) {
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const firstName = addForm.firstName.value.trim();
    const lastName = addForm.lastName.value.trim();
    const email = addForm.email.value.trim();
    const phone = addForm.phone.value.trim();

    const res = await fetch(API_BASE + "addContact.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, userId })
    });

    const data = await res.json();
    if (data.success) {
      alert("Contact added!");
      addForm.reset();

      // ✅ Only reload if a search term is present
      const query = document.getElementById("search-input").value.trim();
      if (query) {
        loadContacts(query);
      }
    } else {
      alert("Add failed: " + data.error);
    }
  });
}

// -------------------- EDIT CONTACT --------------------
function editContactPrompt(contactId) {
  console.log("✏️ Editing contact with ID:", contactId);

  const contactDiv = document.querySelector(`.contact-item [data-id="${contactId}"]`).closest(".contact-item");

  const nameText = contactDiv.querySelector("strong").textContent.split(" ");
  const currentFirst = nameText[0] || "";
  const currentLast = nameText[1] || "";
  const currentEmail = contactDiv.querySelector("p").innerHTML.match(/Email: (.*)<br>/)[1];
  const currentPhone = contactDiv.querySelector("p").innerHTML.match(/Phone: (.*)/)[1];

  contactDiv.innerHTML = `
    <form class="edit-form">
      <input type="text" name="firstName" value="${currentFirst}" required />
      <input type="text" name="lastName" value="${currentLast}" required />
      <input type="email" name="email" value="${currentEmail}" required />
      <input type="text" name="phone" value="${currentPhone}" required />
      <button type="submit" class="login-btn">Save</button>
      <button type="button" class="signup-btn cancel-btn">Cancel</button>
    </form>
  `;

  const editForm = contactDiv.querySelector(".edit-form");
  const cancelBtn = contactDiv.querySelector(".cancel-btn");

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const firstName = editForm.firstName.value.trim();
    const lastName = editForm.lastName.value.trim();
    const email = editForm.email.value.trim();
    const phone = editForm.phone.value.trim();

    const res = await fetch(API_BASE + "editContact.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactId,
        firstName,
        lastName,
        email,
        phone,
        userId
      })
    });

    const data = await res.json();
    if (data.success) {
      alert("Contact updated!");
      // reload search if one exists
      const query = document.getElementById("search-input").value.trim();
      loadContacts(query);
    } else {
      alert("Update failed: " + data.error);
    }
  });

  cancelBtn.addEventListener("click", () => {
    const query = document.getElementById("search-input").value.trim();
    loadContacts(query);
  });
}

// -------------------- DELETE CONTACT --------------------
async function deleteContact(contactId) {
  console.log("🗑️ Deleting contact with ID:", contactId);

  if (!confirm("Are you sure you want to delete this contact?")) return;

  const res = await fetch(API_BASE + "deleteContact.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contactId })
  });

  const data = await res.json();
  if (data.success) {
    alert("Contact deleted!");
    // reload search if one exists
    const query = document.getElementById("search-input").value.trim();
    loadContacts(query);
  } else {
    alert("Delete failed: " + data.error);
  }
}
