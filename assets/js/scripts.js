// Attach event listeners
document.getElementById("generate-btn").addEventListener("click", generateQRCode);
document.getElementById("copy-btn").addEventListener("click", copyCredentials);
document.getElementById("download-btn").addEventListener("click", downloadQRCode);
document.getElementById("print-btn").addEventListener("click", printQRCode);
document.getElementById("toggle-password").addEventListener("click", togglePasswordVisibility);

// Function to generate QR Code
function generateQRCode() {
  const ssid = document.getElementById("wifi-name").value.trim();
  const password = document.getElementById("wifi-password").value.trim();
  const encryption = document.getElementById("encryption-type").value.trim();
  const hidden = document.getElementById("hidden").checked ? "true" : "false";

  if (!ssid) {
    alert("Please enter Wi-Fi name (SSID)!");
    return;
  }

  const qrText = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};;`;

  const qrContainer = document.getElementById("qr-container");
  qrContainer.innerHTML = "<p class='print-card-title'><i class='fa fa-wifi'></i> Wi-Fi Login Details</p><p class='instructions'>📱 Point your phone's camera at the QR code to connect to WiFi automatically</p>";

  const qr = new QRious({
    element: document.createElement("canvas"),
    value: qrText,
    size: 200,
    foreground: "#5c1e88",
    background: "#ffffff",
  });

  qrContainer.appendChild(qr.element);
  displayWifiDetails(ssid, password);
  displayBuildUsing();
}

// Display WiFi details after QR code is generated
function displayWifiDetails(ssid, password) {
  const qrContainer = document.getElementById("qr-container");

  const wifiDetailsSSID = document.createElement("p");
  wifiDetailsSSID.textContent = `Wi-Fi Name (SSID): ${ssid}`;
  qrContainer.appendChild(wifiDetailsSSID);

  // Only show password if visible
  if (document.getElementById("wifi-password").type === "text") {
    const wifiDetailsPassword = document.createElement("p");
    wifiDetailsPassword.textContent = `Password: ${password}`;
    qrContainer.appendChild(wifiDetailsPassword);
  }
}

// Display BuildUsing details after QR code is generated
function displayBuildUsing() {
  const qrContainer = document.getElementById("qr-container");

  const buildUsingDetails = document.createElement("p");
  buildUsingDetails.className = "print-card-subtitle";
  buildUsingDetails.innerHTML = `Generated using <strong><a href="https://mohitshrestha.github.io/wi-fi-qr-card-generator/">Wi-Fi QR Card Generator</a></strong> <br> Developed by <a href="https://mohitshrestha.com.np/">Mohit Shrestha</a> <br> Website: <a href="https://mohitshrestha.github.io/wi-fi-qr-card-generator/" target="_blank" style="font-size: 13px;">https://mohitshrestha.github.io/wi-fi-qr-card-generator/</a>`;

  qrContainer.appendChild(buildUsingDetails);
}

// Copy WiFi credentials to clipboard
function copyCredentials() {
  const ssid = document.getElementById("wifi-name").value.trim();
  const password = document.getElementById("wifi-password").value.trim();

  if (!ssid) {
    alert("Please enter Wi-Fi name (SSID)!");
    return;
  }

  const text = `SSID: ${ssid}\nPassword: ${password}`;
  navigator.clipboard.writeText(text).then(() => {
    alert("Wi-Fi credentials copied to clipboard!");
  });
}

// Download the QR Code as an image
function downloadQRCode() {
  const qrCanvas = document.querySelector("#qr-container canvas");

  if (!qrCanvas) {
    alert("Generate a QR code first!");
    return;
  }

  const link = document.createElement("a");
  link.href = qrCanvas.toDataURL();
  link.download = "wifi-qr-code.png";
  link.click();
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("wifi-password");
    const icon = document.getElementById("password-icon");

    // Toggle password visibility and change the icon
    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Show password
        icon.textContent = "Hide"; // Change text to "Hide"
    } else {
        passwordInput.type = "password"; // Hide password
        icon.textContent = "Show"; // Change text to "Show"
    }
}

// Print the entire webpage
function printQRCode() {
  window.print();
}