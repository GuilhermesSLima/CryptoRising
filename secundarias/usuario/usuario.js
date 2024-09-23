var storedUsername = localStorage.getItem("username");
var storedEmail = localStorage.getItem("email");
var storedBio = localStorage.getItem("bio");
var storedImage = localStorage.getItem("image");

previewImage();

if (storedUsername) {
    document.getElementById("username").textContent = storedUsername;
}
if (storedEmail) {
    document.getElementById("email").textContent = storedEmail;
}
if (storedBio) {
    document.getElementById("bio").textContent = storedBio;
}
if (storedImage) {
    document.getElementById("profileImage").src = storedImage;
    document.getElementById("defaultImage").src = storedImage;
} else {
    document.getElementById("profileImage").src = "../img/user-black.png";
    document.getElementById("defaultImage").src = "../img/user-black.png";
}

document.getElementById("editButton").addEventListener("click", function() {
    document.getElementById("editForm").style.display = "block";
});

document.getElementById("editProfileForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var newUsername = document.getElementById("newUsername").value;
    var newEmail = document.getElementById("newEmail").value;
    var newBio = document.getElementById("newBio").value;
    if (newUsername.trim() !== "" && newEmail.trim() !== "" && newBio.trim() !== "") {
        document.getElementById("username").textContent = newUsername;
        document.getElementById("email").textContent = newEmail;
        document.getElementById("bio").textContent = newBio;
        localStorage.setItem("username", newUsername);
        localStorage.setItem("email", newEmail);
        localStorage.setItem("bio", newBio);
        localStorage.setItem("image", document.getElementById("profileImage").src);
        document.getElementById("editForm").style.display = "none";
        document.getElementById("editProfileForm").reset();
    } else {
        showToast("Por favor, preencha todos os campos.");
    }
});

function previewImage() {
    var fileInput = document.getElementById('newImage');
    var profileImage = document.getElementById('profileImage');
    var defaultImage = document.getElementById('defaultImage');
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onloadend = function() {
        profileImage.src = reader.result;
        defaultImage.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        profileImage.src = "";
        defaultImage.src = "../src/img/user-black.png";
    }
}

document.getElementById("deleteButton").addEventListener("click", function() {
    var toastMessage = "Tem certeza de que deseja apagar seu perfil? ";
    showToastConfirmation(toastMessage);
});

function showToastConfirmation(message) {
    var confirmToast = document.getElementById("confirmToast");
    confirmToast.textContent = message;
    confirmToast.style.display = "block";

    var confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirmar";
    confirmButton.classList.add("confirm-button"); 
    confirmButton.addEventListener("click", function() {
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("bio");
        localStorage.removeItem("image");
        location.reload();
    });
    confirmToast.appendChild(confirmButton);

    var cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.classList.add("cancel-button"); 
    cancelButton.addEventListener("click", function() {
        confirmToast.style.display = "none";
    });
    confirmToast.appendChild(cancelButton);
}


function showToast(message) {
    var toast = document.getElementById("toastMessage");
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(function() {
        toast.style.display = "none";
    }, 3000);
}
