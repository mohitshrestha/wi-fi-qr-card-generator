// Global QRCodeStyling instance for reuse
let qrCodeInstance = null;

// Event listeners for all buttons
document.getElementById("generate-btn").addEventListener("click", generateQRCode);
document.getElementById("copy-btn").addEventListener("click", copyCredentials);
document.getElementById("download-btn").addEventListener("click", downloadQRCode);
document.getElementById("print-btn").addEventListener("click", printQRCode);
document.getElementById("toggle-password").addEventListener("click", togglePasswordVisibility);

/**
 * Generate the Wi-Fi QR Code
 */
function generateQRCode() {
    const ssid = document.getElementById("wifi-name").value.trim();
    const password = document.getElementById("wifi-password").value.trim();
    const encryption = document.getElementById("encryption-type").value;
    const hidden = document.getElementById("hidden").checked;
    const logoUrl = document.getElementById("wifi-logo-webaddress").value.trim();
    const logoFile = document.getElementById("wifi-logo-upload").files[0];

    // Validate required SSID
    if (!ssid) {
        alert("Please enter a Wi-Fi name (SSID).");
        return;
    }

    // Construct Wi-Fi QR Code data string
    const qrData = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};;`;

    // Prepare the container by clearing previous content and adding titles/instructions
    const qrContainer = document.getElementById("qr-container");
    qrContainer.innerHTML = `
        <p class='print-card-title'><i class='fa fa-wifi'></i> Wi-Fi Login Details</p>
        <p class='instructions'>📱 Point your phone's camera at the QR code to connect to WiFi automatically</p>
    `;

    // Helper to render QR code with optional logo image
    const renderQRCode = (logoImage = null) => {
        qrCodeInstance = new QRCodeStyling({
            width: 200, // Set the width and height of the QR code
            height: 200,
            type: "svg", // You can choose other types like png, canvas
            data: qrData,
            image: logoImage || null, // Path to your logo image
            imageSize: 0.2, // Size of the logo in the QR code
            imageMargin: 10, // Margin around the logo
            dotsOptions: {
                color: "#5c1e88", // Color of the dots
                type: "rounded" // Dot shape rounded or square
            },
            backgroundOptions: {
                color: "#ffffff" // Background color of the QR code
            },
            cornersSquareOptions: {
              type: "extra-rounded", // How the corners look
              color: "#5c1e88", // Color of the corners
            },
            cornersDotOptions: {
              type: "dot", // Dot appearance in the corners
              color: "#5c1e88", // Dot color
            },
            imageOptions: {
                crossOrigin: "anonymous",
                imageSize: 0.2,
                margin: 2,
                hideBackgroundDots: true
            },
        });

        qrCodeInstance.append(qrContainer);

        // Display SSID and password
        displayWifiDetails(ssid, password);

        // Display attribution
        displayBuildUsing();
    };

    // If file uploaded, read it as Data URL
    if (logoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            renderQRCode(e.target.result);
        };
        reader.readAsDataURL(logoFile);
    } else {
        renderQRCode(logoUrl || null);
    }
}

/**
 * Copy Wi-Fi credentials to clipboard
 */
function copyCredentials() {
    const ssid = document.getElementById("wifi-name").value.trim();
    const password = document.getElementById("wifi-password").value.trim();
    const encryption = document.getElementById("encryption-type").value;
    const hidden = document.getElementById("hidden").checked;

    if (!ssid) {
        alert("Please enter a Wi-Fi name (SSID).");
        return;
    }

    const credentials = `Wi-Fi Name (SSID): ${ssid}\nEncryption: ${encryption}\nPassword: ${password}\nHidden: ${hidden ? "Yes" : "No"}`;

    navigator.clipboard.writeText(credentials).then(() => {
        alert("Wi-Fi credentials copied to clipboard!");
    }).catch(err => {
        alert("Failed to copy credentials.");
        console.error(err);
    });
}

/**
 * Download QR code as PNG
 */
function downloadQRCode() {
    if (!qrCodeInstance) {
        alert("Please generate a QR code first.");
        return;
    }

    qrCodeInstance.download({
        name: "wifi-qr-code",
        extension: "png"
    });
}

// Print the entire webpage
function printQRCode() {
    window.print();
  }

/**
 * Toggle password field visibility
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("wifi-password");
    const toggleIcon = document.getElementById("password-icon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        toggleIcon.textContent = "Show";
    }
}

/**
 * Display WiFi details below the QR code
 */
function displayWifiDetails(ssid, password) {
    const qrContainer = document.getElementById("qr-container");

    const wifiDetailsSSID = document.createElement("p");
    wifiDetailsSSID.innerHTML = `
        Generated using <strong>`;
    wifiDetailsSSID.textContent = `Wi-Fi Name (SSID): ${ssid}`;
    qrContainer.appendChild(wifiDetailsSSID);

    // Only show password if visible
    if (document.getElementById("wifi-password").type === "text") {
        const wifiDetailsPassword = document.createElement("p");
        wifiDetailsPassword.textContent = `Password: ${password}`;
        qrContainer.appendChild(wifiDetailsPassword);
    }
}

/**
 * Display "Generated by" and attribution info
 */
function displayBuildUsing() {
    const qrContainer = document.getElementById("qr-container");

    const buildUsingDetails = document.createElement("p");
    buildUsingDetails.className = "print-card-subtitle";
    buildUsingDetails.innerHTML = `
        Generated using <strong><a href="https://mohitshrestha.github.io/wi-fi-qr-card-generator/" target="_blank">Wi-Fi QR Card Generator</a></strong><br>
        Developed by <a href="https://mohitshrestha.com.np/" target="_blank">Mohit Shrestha</a><br> 
        Visit Website:<br>
        <a href="https://mohitshrestha.github.io/wi-fi-qr-card-generator/" target="_blank" style="font-size: 12px;">https://mohitshrestha.github.io/wi-fi-qr-card-generator/</a>
    `;

    qrContainer.appendChild(buildUsingDetails);
}
