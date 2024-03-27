const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
const showErrorAlert = (message) => {
    Toast.fire({
        icon: 'error',
        title: 'Error',
        text: message,
    });
};
const showSuccessAlert = (message) => {
    Toast.fire({
        icon: 'success',
        title: 'Success',
        text: message,
    });
};

const checkEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const checkPasswordLength = (password) => {
    return password.length >= 6;
};

const loginUser = async () => {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate password length
        if (!checkPasswordLength(password)) {
            showErrorAlert('Password should be at least 6 characters long');
            return;
        }

        // Validate email format
        if (!checkEmailFormat(email)) {
            showErrorAlert('Invalid email format');
            return;
        }

        // Validate email and password presence
        if (!email || !password) {
            showErrorAlert('Email and password are mandatory');
            return;
        }

        const data = {
            email,
            password,
        };

        const response = await fetch('/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.status == 200) {
            const result = await response.json();

            // Assuming the server sends a JWT token in the response
            if (result.success) {
                showSuccessAlert('Login successful!');


                localStorage.setItem('user_role', result.data.user_role);
                let user_role = result.data.user_role;

                if (user_role === 1) {
                    localStorage.setItem('employee_name', result.data.user_name);
                    localStorage.setItem('employee_id', result.data.user_id);
                    setTimeout(() => { window.location.href = '/employeePortal' }, 2000);
                } else {
                    // Redirect to user profile page or any other page
                    localStorage.setItem('admin_id', result.data.user_id);
                    localStorage.setItem('admin_name', result.data.user_name);
                    setTimeout(() => { window.location.href = '/adminPortal' }, 2000);
                }
                // Redirect to user profile page or any other page
                //setTimeout(() => { window.location.href = '/newDashboard' }, 2000);
            } else if (result.message === 'Incorrect password') {
                showErrorAlert('Invalid password');
                setTimeout(() => {
                    // Reload the page
                    location.reload();
                }, 2000);
            }
        } else if (response.status === 400) {
            showErrorAlert('User Unauthorized');
            setTimeout(() => {
                // Reload the page
                location.reload();
            }, 2000);
        }
        else {
            const errorData = await response.json();
            showErrorAlert(errorData.message || 'User Not Found');
            setTimeout(() => {
                // Reload the page
                location.reload();
            }, 2000);
        }
    } catch (error) {
        console.error('Error during login', error);
        showErrorAlert('Error during login');
        setTimeout(() => {
            // Reload the page
            location.reload();
        }, 2000);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        loginUser();

        // Find the button element
        const githubButton = document.querySelector('.button--github');

        // Add event listener for button click
        githubButton.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent default behavior of anchor element

            try {
                // Perform fetch request to '/auth/github'
                const response = await fetch('/auth/github');

                // Check if response is successful
                if (response.ok) {
                    // Redirect user to GitHub authentication page
                    window.location.href = response.url;
                } else {
                    // Handle error response
                    console.error('Failed to authenticate with GitHub');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });

    });
});
