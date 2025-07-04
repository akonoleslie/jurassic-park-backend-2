document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();

  const API_BASE_URL = "http://localhost:3000/api";
  const token = localStorage.getItem("token");

  // -------------------- PAGE D'ACCUEIL / LOGIN --------------------
  if (currentPage === "index.html" || currentPage === "") {
    const welcomeSection = document.getElementById("welcomeSection");
    const loginSection = document.getElementById("loginSection");
    const goToLoginBtn = document.getElementById("goToLoginBtn");
    const backToWelcomeBtn = document.getElementById("backToWelcomeBtn");
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");

    goToLoginBtn?.addEventListener("click", () => {
      welcomeSection.style.display = "none";
      loginSection.style.display = "block";
    });

    backToWelcomeBtn?.addEventListener("click", () => {
      loginSection.style.display = "none";
      welcomeSection.style.display = "block";
      loginError.style.display = "none";
      loginForm.reset();
    });

    loginForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      console.log(email, password)

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, motDePasse: password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "dashboard.html";
        } else {
          loginError.textContent = "Identifiants incorrects.";
          loginError.style.display = "block";
        }
      } catch (err) {
        console.error("Erreur lors de la connexion :", err);
        loginError.textContent = "Erreur serveur. Veuillez réessayer.";
        loginError.style.display = "block";
      }
    });
  }

  // -------------------- PAGE DASHBOARD --------------------
  else if (currentPage === "dashboard.html") {
    if (!token) return (window.location.href = "index.html");

    const logoutBtn = document.getElementById("logoutBtn");
    const filterZone = document.getElementById("filterZone");
    const filterType = document.getElementById("filterType");
    const filterUrgence = document.getElementById("filterUrgence");
    const tbody = document.querySelector("#incidentTable tbody");

    logoutBtn?.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });

    async function fetchAndRenderIncidents() {
      try {
        const response = await fetch(`${API_BASE_URL}/incidents`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Non autorisé");
        const incidents = await response.json();
        renderIncidents(incidents);
      } catch (err) {
        alert("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem("token");
        window.location.href = "index.html";
      }
    }

    function renderIncidents(incidents) {
      tbody.innerHTML = "";

      const filtered = incidents.filter((incident) => {
        return (
          (!filterZone.value || incident.zone === filterZone.value) &&
          (!filterType.value || incident.type === filterType.value) &&
          (!filterUrgence.value || incident.urgence === filterUrgence.value)
        );
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">Aucun incident trouvé.</td></tr>`;
        return;
      }

      filtered.forEach((incident) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${incident.titre}</td>
          <td>${incident.description}</td>
          <td>${incident.type}</td>
          <td>${incident.zone}</td>
          <td>${incident.urgence}</td>
          <td>
            <select data-id="${incident.id}" class="form-select statusSelect">
              <option value="En cours" ${incident.statut === "En cours" ? "selected" : ""}>En cours</option>
              <option value="Résolu" ${incident.statut === "Résolu" ? "selected" : ""}>Résolu</option>
            </select>
          </td>
          <td>
            <button data-id="${incident.id}" class="btn btn-sm btn-danger deleteBtn">Supprimer</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      document.querySelectorAll(".deleteBtn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          if (confirm("Supprimer cet incident ?")) {
            await fetch(`${API_BASE_URL}/incidents/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchAndRenderIncidents();
          }
        });
      });

      document.querySelectorAll(".statusSelect").forEach((select) => {
        select.addEventListener("change", async (e) => {
          const id = e.target.getAttribute("data-id");
          const newStatus = e.target.value;
          await fetch(`${API_BASE_URL}/incidents/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ statut: newStatus }),
          });
        });
      });
    }

    filterZone?.addEventListener("change", fetchAndRenderIncidents);
    filterType?.addEventListener("change", fetchAndRenderIncidents);
    filterUrgence?.addEventListener("change", fetchAndRenderIncidents);

    fetchAndRenderIncidents();
  }

  // -------------------- PAGE AJOUT --------------------
  else if (currentPage === "ajout.html") {
    if (!token) return (window.location.href = "index.html");

    const form = document.getElementById("incidentForm");
    const backBtn = document.getElementById("backToDashboardBtn");

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const Incident = {
        titre: form.titre.value.trim(),
        description: form.description.value.trim(),
        type: form.type.value,
        zone: form.zoneId.value,
        urgence: form.urgence.value,
      };

      console.log(Incident)

      try {
        const response = await fetch(`${API_BASE_URL}/incidents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(Incident),
        });

        if (!response.ok) throw new Error("Échec création incident");
        window.location.href = "dashboard.html";
      } catch (err) {
        alert("Erreur lors de la création de l'incident.");
      }
    });

    backBtn?.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }


  // get des zones 
  if (currentPage === "ajout.html") {
  const zoneSelect = document.getElementById("zoneSelect");

  // Appel API pour récupérer les zones
  fetch(`${API_BASE_URL}/zone/`)
    .then((response) => response.json())
    .then((zones) => {
      zones.forEach((zone) => {
        console.log(zone)
        const option = document.createElement("option");
        option.value = zone.id;
        option.textContent = zone.nom;
        zoneSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des zones :", error);
    });
}

});
