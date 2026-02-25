function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {

            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userName", data.name);

            window.location.href = "Dashboard.html";
        } else {
            document.getElementById("error-message").innerText =
                "Invalid Email or Password";
        }
    })
    .catch(error => {
        console.error("Login error:", error);
    });
}
