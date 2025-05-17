// Attach event listeners
document.getElementById("generate-btn").addEventListener("click", generateQRCode);
document.getElementById("copy-btn").addEventListener("click", copyCredentials);
document.getElementById("download-btn").addEventListener("click", downloadQRCode);
document.getElementById("print-btn").addEventListener("click", printQRCode);
document.getElementById("toggle-password").addEventListener("click", togglePasswordVisibility);

// Function to generate QR Code
function generateQRCode() {
  // Get user input values for Wi-Fi credentials and logo inputs
  const ssid = document.getElementById("wifi-name").value.trim();
  const password = document.getElementById("wifi-password").value.trim();
  const encryption = document.getElementById("encryption-type").value.trim();
  const hidden = document.getElementById("hidden").checked ? "true" : "false";
  const logoUrlInput = document.getElementById("wifi-logo-webaddress").value.trim();
  const logoUploadInput = document.getElementById("wifi-logo-upload");

  // Alert if SSID is missing and stop generating QR code
  if (!ssid) {
    alert("Please enter Wi-Fi name (SSID)!");
    return;
  }

  // Build the Wi-Fi QR code string according to standard format
  const qrText = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};;`;

  // Prepare the container by clearing previous content and adding titles/instructions
  const qrContainer = document.getElementById("qr-container");
  qrContainer.innerHTML = `
    <p class='print-card-title'><i class='fa fa-wifi'></i> Wi-Fi Login Details</p>
    <p class='instructions'>📱 Point your phone's camera at the QR code to connect to WiFi automatically</p>
  `;

  // Create a canvas element to draw the QR code
  const qrCanvas = document.createElement("canvas");

  // Use QRious to generate the QR code on the canvas with chosen colors and size
  const qr = new QRious({
    element: qrCanvas,
    value: qrText,
    size: 200,
    foreground: "#5c1e88",
    background: "#ffffff",
  });

  // Get 2D context for drawing on the canvas (for logo overlay)
  const ctx = qrCanvas.getContext("2d");

  // Create an Image object for the logo (can be uploaded or from URL)
  const logo = new Image();
  logo.crossOrigin = "anonymous"; // Handle CORS for external logos

  // Draw a white rounded rectangle background behind the logo and then the logo itself at the center of the QR code
  function drawLogo() {
    const logoSize = 50;
    const x = (qrCanvas.width - logoSize) / 2;
    const y = (qrCanvas.height - logoSize) / 2;

    const padding = 8;
    const bgX = x - padding / 2;
    const bgY = y - padding / 2;
    const bgSize = logoSize + padding;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 2;

    // Use native roundRect if supported, otherwise draw rounded rect path manually
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(bgX, bgY, bgSize, bgSize, 8);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(bgX + 8, bgY);
      ctx.lineTo(bgX + bgSize - 8, bgY);
      ctx.quadraticCurveTo(bgX + bgSize, bgY, bgX + bgSize, bgY + 8);
      ctx.lineTo(bgX + bgSize, bgY + bgSize - 8);
      ctx.quadraticCurveTo(bgX + bgSize, bgY + bgSize, bgX + bgSize - 8, bgY + bgSize);
      ctx.lineTo(bgX + 8, bgY + bgSize);
      ctx.quadraticCurveTo(bgX, bgY + bgSize, bgX, bgY + bgSize - 8);
      ctx.lineTo(bgX, bgY + 8);
      ctx.quadraticCurveTo(bgX, bgY, bgX + 8, bgY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw the logo image over the background at the center
    ctx.drawImage(logo, x, y, logoSize, logoSize);

    // Append the QR canvas (with logo) to the container BEFORE showing Wi-Fi details
    qrContainer.appendChild(qrCanvas);

    // Show Wi-Fi credentials and build attribution below the QR code
    displayWifiDetails(ssid, password);
    displayBuildUsing();
  }

  // Draw QR code without logo if no logo provided or logo loading fails
  function drawWithoutLogo() {
    qrContainer.appendChild(qrCanvas);
    displayWifiDetails(ssid, password);
    displayBuildUsing();
  }

  // Determine logo source: uploaded file has highest priority, then URL, otherwise no logo
  if (logoUploadInput.files && logoUploadInput.files[0]) {
    // Read the uploaded image file as a DataURL and load it into the logo image
    const reader = new FileReader();
    reader.onload = function (e) {
      logo.src = e.target.result;
      logo.onload = drawLogo;        // Draw QR with logo after loading image
      logo.onerror = drawWithoutLogo; // Fallback to QR only if logo loading fails
    };
    reader.readAsDataURL(logoUploadInput.files[0]);
  } else if (logoUrlInput) {
    // Load logo from the provided URL
    logo.src = logoUrlInput;
    logo.onload = drawLogo;
    logo.onerror = drawWithoutLogo;
  } else {
    // No logo provided, just draw QR code alone
    drawWithoutLogo();
  }
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
  buildUsingDetails.innerHTML = `Generated using <strong><a href="https://mohitshrestha.github.io/wi-fi-qr-card-generator/">Wi-Fi QR Card Generator</a></strong> <br> Developed by <a href="https://mohitshrestha.com.np/">Mohit Shrestha</a> <br> Visit Website: <br> <a href="https://mohitshrestha.github.io/wi-fi-qr-card-generator/" target="_blank" style="font-size: 12px;">https://mohitshrestha.github.io/wi-fi-qr-card-generator/</a></p>`;

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