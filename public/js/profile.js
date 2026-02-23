// let name = document.querySelector('#name');
// let email = document.querySelector('#email');
// let storedName = localStorage.getItem('name');
// let storedEmail = localStorage.getItem('email');

// let btn = document.querySelector('.btn-primary');
// btn.addEventListener('click', function() {
//     let newName = storedName.value
//     let newEmail =  storedEmail.value
//     if (newName) {
//         name.textContent = newName.value;
//         localStorage.setItem('name', newName);
//     }
//     if (newEmail) {
//         email.textContent = newEmail.value;
//         localStorage.setItem('email', newEmail);
//     }
// });

// header elements
let headerName = document.querySelector('#headerName');
let headerEmail = document.querySelector('#headerEmail');

// input fields
let nameInput = document.querySelector('#nameInput');
let emailInput = document.querySelector('#emailInput');


// button click
let btn = document.querySelector('.btn-primary');
btn.addEventListener('click', function () {

    let newName = nameInput.value;
    let newEmail = emailInput.value;

    if (newName) {
        headerName.textContent = newName;
        localStorage.setItem('name', newName);
    }

    if (newEmail) {
        headerEmail.textContent = newEmail;
        localStorage.setItem('email', newEmail);
    }
});
{/* <h2>Harsh Raj</h2>
            <p>harshraj@email.com</p> */}