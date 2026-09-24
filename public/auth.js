const registerName = document.getElementById("registerName");
const registerPassword = document.getElementById("registerPassword");
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", () => {
    signup();
});

async function signup() {
    try {
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                 name: registerName.value,
                password: registerPassword.value
            })
        });

       console.log(res.status);
console.log(await res.text());

    } catch (error) {
        console.log(error);
    }
}