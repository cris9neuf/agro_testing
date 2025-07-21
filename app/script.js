function createForm() {
  const date = document.getElementById("form-date").value;
  if (!date) {
    alert("Please select a date.");
    return;
  }
  // Save selected date in localStorage
  localStorage.setItem("currentFormDate", date);
  // Go to form screen
  window.location.href = "form.html";
}

// FORM SCREEN: Load date and handle save/cancel
if (window.location.pathname.endsWith("form.html")) {
  const dateLabel = document.getElementById("form-date-label");
  const currentDate = localStorage.getItem("currentFormDate");
  if (dateLabel && currentDate) {
    dateLabel.textContent = currentDate;
  }

  window.saveEntry = function () {
    const name = document.getElementById("name").value.trim();
    const height = parseFloat(document.getElementById("height").value);

    if (!name || isNaN(height)) {
      alert("Please enter a valid name and height.");
      return;
    }

    const entry = { name, height };
    const date = localStorage.getItem("currentFormDate");

    // Load existing data
    const data = JSON.parse(localStorage.getItem("formData") || "{}");

    // Add new entry under the date
    if (!data[date]) data[date] = [];
    data[date].push(entry);

    // Save updated data
    localStorage.setItem("formData", JSON.stringify(data));

    // Go to list
    window.location.href = "list.html";
  };

  window.cancel = function () {
    window.location.href = "list.html";
  };
}

// LIST PAGE: Show saved entries and sync
if (window.location.pathname.endsWith("list.html")) {
  const listDiv = document.getElementById("data-list");
  const data = JSON.parse(localStorage.getItem("formData") || "{}");

  for (const date in data) {
    const section = document.createElement("div");
    section.innerHTML = `<h3>${date}</h3>`;
    const ul = document.createElement("ul");
    data[date].forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `Name: ${entry.name}, Height: ${entry.height}`;
      ul.appendChild(li);
    });
    section.appendChild(ul);
    listDiv.appendChild(section);
  }

  window.syncData = async function () {
    try {
      const response = await fetch("https://your-server-url.com/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Upload failed");
      alert("Data synced successfully!");
    } catch (err) {
      alert("Sync failed: " + err.message);
    }
  };
}
