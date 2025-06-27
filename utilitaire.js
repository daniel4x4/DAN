export function sendData(titre, data) {
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
