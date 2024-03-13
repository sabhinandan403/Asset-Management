document.addEventListener("DOMContentLoaded", async function () {

    let previousTotalIssuesCount = 0;
    let previousPendingIssuesCount = 0;
    let previousPendingSoftwareIssueCount = 0; // Variable to store the previous length of pending issues data
    let previousPendingHardwareIssueCount = 0; // Variable to store the previous length of pending issues data
    let previousPendingDamageIssueCount = 0; // Variable to store the previous length of pending issues data
    let previousPendingReplacementIssueCount = 0; // Variable to store the previous length of pending issues data
    let previousNewAssetRequestCount = 0;
    let previousPendingLaptopRequestCount = 0; // Variable to store the previous length of pending request data
    let previousPendingDesktopRequestCount = 0; // Variable to store the previous length of pending request data
    let previousPendingDongleRequestCount = 0; // Variable to store the previous length of pending request data
    let previousPendingMobileRequestCount = 0;// Variable to store the previous length of pending request data
    let flag = false;
    let alertCount = 0;
    var userName = localStorage.getItem('admin_name');
    document.getElementById('user-name').innerText = `Hi, ${userName}`
    const getPendingIssuesCount = async () => {
        try {
            const response = await fetch('/asset/getPendingIssueCount');
            if (!response.ok) {
                throw new Error('Failed to fetch pending issues');
            }
            const data = await response.json();

            // Check if there's a change in the length of pending issues data
            if (!flag) {
                //populateCards(data.data);
                previousTotalIssuesCount = data.data.total_issues_count;
                previousPendingIssuesCount = data.data.total_pending_issues;
                previousPendingSoftwareIssueCount = data.data.total_software_issues;
                previousPendingHardwareIssueCount = data.data.total_hardware_issues
                previousPendingDamageIssueCount = data.data.total_damage_issues
                previousPendingReplacementIssueCount = data.data.total_replacement_issues
                previousNewAssetRequestCount = data.data.total_request_count
                previousPendingLaptopRequestCount = data.data.total_laptop_request
                previousPendingDesktopRequestCount = data.data.total_desktop_request
                previousPendingDongleRequestCount = data.data.total_dongle_request;
                previousPendingMobileRequestCount = data.data.total_mobile_request;
                flag = true
            }
            else if (data.data.total_software_issues !== previousPendingSoftwareIssueCount ||
                data.data.total_hardware_issues !== previousPendingHardwareIssueCount ||
                data.data.total_damage_issues !== previousPendingDamageIssueCount ||
                data.data.total_replacement_issues !== previousPendingReplacementIssueCount ||
                data.data.total_request_count !== previousNewAssetRequestCount ||
                data.data.total_issues_count !== previousTotalIssuesCount ||
                data.data.total_pending_issues !== previousPendingIssuesCount ||
                data.data.total_laptop_request !== previousPendingLaptopRequestCount ||
                data.data.total_desktop_request !== previousPendingDesktopRequestCount ||
                data.data.total_dongle_request !== previousPendingDongleRequestCount ||
                data.data.total_mobile_request !== previousPendingMobileRequestCount) {

                alertCount = ((parseInt(data.data.total_software_issues) - parseInt(previousPendingSoftwareIssueCount)) + (parseInt(data.data.total_hardware_issues) - parseInt(previousPendingHardwareIssueCount))
                    + (parseInt(data.data.total_damage_issues) - parseInt(previousPendingDamageIssueCount))
                    + (parseInt(data.data.total_replacement_issues) - parseInt(previousPendingReplacementIssueCount))
                  
                    + (parseInt(data.data.total_laptop_request) - parseInt(previousPendingLaptopRequestCount))
                    + (parseInt(data.data.total_desktop_request) - parseInt(previousPendingDesktopRequestCount))
                    + (parseInt(data.data.total_dongle_request) - parseInt(previousPendingDongleRequestCount))
                    + (parseInt(data.data.total_mobile_request) - parseInt(previousPendingMobileRequestCount))
                )

                document.getElementById('issue-number').innerText = alertCount
                if (alertCount != 0) {
                    alert('New request is raised ')
                }
                previousTotalIssuesCount = data.data.total_issues_count;
                previousPendingIssuesCount = data.data.total_pending_issues;
                previousPendingSoftwareIssueCount = data.data.total_software_issues; // Update the previous length
                previousPendingHardwareIssueCount = data.data.total_hardware_issues
                previousPendingDamageIssueCount = data.data.total_damage_issues
                previousPendingReplacementIssueCount = data.data.total_replacement_issues
                previousNewAssetRequestCount = data.data.total_request_count
                previousPendingLaptopRequestCount = data.data.total_laptop_request // Variable to store the previous length of pending request data
                previousPendingDesktopRequestCount = data.data.total_desktop_request // Variable to store the previous length of pending request data
                previousPendingDongleRequestCount = data.data.total_dongle_request; // Variable to store the previous length of pending request data
                previousPendingMobileRequestCount = data.data.total_mobile_request;

            }
        } catch (error) {
            console.error('Error fetching pending issues:', error);
        }
    };

    getPendingIssuesCount();

    // Set interval to fetch pending issues every 10 seconds
    setInterval(getPendingIssuesCount, 10000);
    
    let user_name = localStorage.getItem("admin_name");
    console.log(user_name);
    document.getElementById('user-name').textContent = `Hi, ${user_name}`;
    // Function to fetch user types and populate dropdown
    const getUserTypes = async () => {
        try {
            const response = await fetch('/getUserType');
            if (!response.ok) {
                throw new Error('Failed to fetch user types');
            }
            const data = await response.json();
            populateUserRoles(data.data);
        } catch (error) {
            console.error('Error fetching user types:', error);
        }
    };

    const getTeam = async () => {
        try {
            const response = await fetch('/getTeam');
            if (!response.ok) {
                throw new Error('Failed to fetch user teams');
            }
            const data = await response.json();
            populateTeam(data.data);
        } catch (error) {
            console.error('Error fetching user teams:', error);
        }
    }

    const populateTeam = (userTeam) => {
        const userTeamDropdown = document.getElementById('team');
        // Clear existing options
        userTeamDropdown.innerHTML = '';
        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = 'Select Team';
        placeholderOption.disabled = true;
        placeholderOption.selected = true; // Select the placeholder option by default
        userTeamDropdown.appendChild(placeholderOption);


        userTeam.forEach(team => {
            const option = document.createElement('option');
            option.value = team.team;
            option.id = team.team;
            option.textContent = team.team;
            userTeamDropdown.appendChild(option);
        });
    }

    // Populate user roles dropdown with data from the response
    const populateUserRoles = (userTypes) => {
        const userRoleDropdown = document.getElementById('userRoleDropdown');
        // Clear existing options
        userRoleDropdown.innerHTML = '';
        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = 'Select User Role';
        placeholderOption.disabled = true;
        placeholderOption.selected = true; // Select the placeholder option by default
        userRoleDropdown.appendChild(placeholderOption);


        userTypes.forEach(userType => {
            const option = document.createElement('option');
            option.value = userType.user_role;
            option.id = userType.user_role;
            option.textContent = userType.user_role;
            userRoleDropdown.appendChild(option);
        });
    };

    // Call the function to fetch user types on DOMContentLoaded
    getUserTypes();
    getTeam();

    document.getElementById('userRoleDropdown').addEventListener('change', function () {
        var selectedRole = this.value; // Get the selected role
        var teamDropdown = document.getElementById('teamDropdown');

        // Set the selected option based on the selected role
        if (selectedRole === 'admin') {
            // Find the option with value 'IT Infra' and set it as selected
            teamDropdown.querySelector('option[value="IT Infra"]').selected = true;
        } else if (selectedRole === 'employee') {
            // Set the placeholder option as selected (assuming its value is an empty string)
            teamDropdown.querySelector('option[value=""]').selected = true;
        }
    });

    // Function to validate password
    function validatePassword() {
        var passwordInput = document.getElementById("password");
        var password = passwordInput.value;

        // Regular expressions for password validation
        var digitPattern = /(?=.*\d)/;
        var lowercasePattern = /(?=.*[a-z])/;
        var uppercasePattern = /(?=.*[A-Z])/;
        var specialCharPattern = /(?=.*[!@#$%^&*()_+}{'\":;?/>.<,])/;
        var lengthPattern = /.{8,}/;

        // Check each validation rule
        if (!digitPattern.test(password)) {
            showAlert("Password must contain at least one digit");
            return false;
        }
        if (!lowercasePattern.test(password)) {
            showAlert("Password must contain at least one lowercase letter");
            return false;
        }
        if (!uppercasePattern.test(password)) {
            showAlert("Password must contain at least one uppercase letter");
            return false;
        }
        if (!specialCharPattern.test(password)) {
            showAlert("Password must contain at least one special character");
            return false;
        }
        if (!lengthPattern.test(password)) {
            showAlert("Password must be at least 8 characters long");
            return false;
        }

        // If all validations pass
        return true;
    }

    // Function to show SweetAlert popup with error message
    function showAlert(message) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: message,
        });
    }

    // Form submission and validation for user registration
    // Add event listener to the register button in the first form
    const registerButton = document.getElementById('registerUserForm');
    registerButton.addEventListener('click', async (event) => {
        //event.preventDefault();
        // Form submission logic...

        // Validate all fields are filled
        const username = document.getElementById('username').value;

        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
            });
            return
            emailInput.focus();

            // Optionally, focus back on the email input field
        }
        const userRole = userRoleDropdown.value;
        var password = document.getElementById('password').value

        if (!validatePassword(password)) {
            return
        }

        if (!username || !email || !userRole || !password) {
            // Show error message if any field is empty
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill all fields'
            });
            return; // Exit function if any field is empty
        }

        var team
        if (userRole === 'admin') {
            team = '';
        } else if (userRole === 'employee') {
            var team = document.getElementById('team').value;
        }

        // Validate password field if user role is admin
        if (userRole === "admin" && !document.getElementById("password").value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Admin users must have a password.'
            })
            return;
        }

        if (userRole === 'employee' && !team) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select team.'
            })
            return;
        }
        // Prepare data for API call
        let formData = {
            user_name: username,
            user_email: email,
            user_role: userRole,
            team: team,
            password: password
        };

        if (userRole === "admin") {
            formData.password = document.getElementById("password").value;
        }

        try {
            const response = await fetch('/registerUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Show success message if registration is successful
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'User registered successfully',
                    showConfirmButton: false,
                    timer: 2000 // Close swal after 2 seconds
                }).then(() => {
                    // Redirect to dashboard after success message
                    window.location.href = '/adminPortal';
                });
            } else if (response.status == 409) {
                // User already exists
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'User already exists',
                    showConfirmButton: true
                })
                setTimeout(() => {
                    window.location.href = '/addUser'
                }, 2000);
            } else {
                // Other server errors
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to register user'
                });
            }
        } catch (error) {
            console.error('Error registering user:', error);
            // Show error message if registration fails
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to register user'
            });
        }

    });

    // Function to handle logout
    async function logout() {
        try {
            const response = await fetch("/logout");
            if (response.ok) {
                window.location.href = "/";
            } else {
                throw new Error("Logout failed");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }

    }

    // Function to fetch asset categories and populate dropdown
    // const getAssetCategories = async () => {
    //     try {
    //         const response = await fetch('/asset/getCategoryType');
    //         if (!response.ok) {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: 'Cannot get Category Type'
    //             })
    //                 .then((result) => {
    //                     if (result.isConfirmed) {
    //                         window.location.reload();
    //                     }
    //                 }), 1000

    //             throw new Error('Failed to fetch asset categories');
    //         }
    //         const data = await response.json();
    //         populateAssetCategories(data.data);
    //     } catch (error) {
    //         console.error('Error fetching asset categories:', error);
    //     }
    // };

    // // Populate asset categories dropdown with data from the response
    // const populateAssetCategories = (assetCategories) => {
    //     const assetCategoryDropdown = document.getElementById('assetCategory');

    //     // Clear existing options
    //     assetCategoryDropdown.innerHTML = '';

    //     // Create placeholder option
    //     const placeholderOption = document.createElement('option');
    //     placeholderOption.value = "";
    //     placeholderOption.textContent = 'Select Asset Category';
    //     placeholderOption.disabled = true;
    //     placeholderOption.selected = true; // Select the placeholder option by default
    //     assetCategoryDropdown.appendChild(placeholderOption);

    //     assetCategories.forEach(category => {
    //         const option = document.createElement('option');
    //         option.value = category.asset_category;
    //         option.id = category.asset_category;
    //         option.textContent = category.asset_category;
    //         assetCategoryDropdown.appendChild(option);
    //     });
    // };

    // // Function to fetch asset statuses and populate dropdown
    // const getAssetStatuses = async () => {
    //     try {
    //         const response = await fetch('/asset/getStatusType');
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch asset statuses');
    //         }
    //         const data = await response.json();
    //         populateAssetStatuses(data.data);
    //     } catch (error) {
    //         console.error('Error fetching asset statuses:', error);
    //     }
    // };

    // // Populate asset statuses dropdown with data from the response
    // const populateAssetStatuses = (assetStatuses) => {
    //     const assetStatusDropdown = document.getElementById('assetStatus');

    //     // Clear existing options
    //     assetStatusDropdown.innerHTML = '';


    //     // Create placeholder option
    //     const placeholderOption = document.createElement('option');
    //     placeholderOption.value = "";
    //     placeholderOption.textContent = 'Select Asset Status';
    //     placeholderOption.disabled = true;
    //     placeholderOption.selected = true; // Select the placeholder option by default
    //     assetStatusDropdown.appendChild(placeholderOption);

    //     assetStatuses.forEach(status => {
    //         const option = document.createElement('option');
    //         option.value = status.asset_status;
    //         option.id = status.asset_status;
    //         option.textContent = status.asset_status;
    //         assetStatusDropdown.appendChild(option);
    //     });
    // };

    // // Function to handle change event on asset status dropdown
    // const handleAssetStatusChange = () => {
    //     const assetStatusDropdown = document.getElementById('assetStatus');
    //     const allocatedToInput = document.getElementById('allocatedTo');

    //     assetStatusDropdown.addEventListener('change', () => {
    //         const selectedStatus = assetStatusDropdown.value;
    //         // If asset status is 'Unallocated', disable the allocated to input field
    //         if (selectedStatus.toLowerCase() === 'unallocated') {
    //             allocatedToInput.disabled = true;
    //             allocatedToInput.value = ''; // Clear the input field
    //         } else {
    //             allocatedToInput.disabled = false;
    //         }
    //     });
    // };

    // // Call the functions to fetch asset categories and statuses
    // getAssetCategories();
    // getAssetStatuses();


    // // Show Register New Asset modal on navbar link click
    // const registerAssetLink = document.getElementById('add-asset');
    // registerAssetLink.addEventListener('click', () => {
    //     $('#registerAssetModal').modal('show');
    // });


    // // Call the function to handle asset status change event
    // handleAssetStatusChange();

    // // Call the function to handle asset status change event
    // //handleAssetStatusChange();

    // // Form submission and validation for registering new asset
    // const registerAssetForm = document.getElementById('registerAssetForm');
    // registerAssetForm.addEventListener('submit', async (event) => {
    //     event.preventDefault();

    //     // Validate all fields are filled
    //     const assetCategory = document.getElementById('assetCategory').value;
    //     let asset_status = document.getElementById('assetStatus').value;
    //     let allocated_to = document.getElementById('allocatedTo').value;
    //     const team = document.getElementById('team').value;
    //     const userId = localStorage.getItem('admin_id');
    //     const user_name = localStorage.getItem('admin_name');

    //     if (!assetCategory || !asset_status || !team) {
    //         // Show error message if any field is empty
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'Please fill all fields'
    //         });
    //         return; // Exit function if any field is empty
    //     }

    //     if (asset_status === 'unallocated' || asset_status === 'Unallocated') {

    //         allocated_to = 'null'
    //     }
    //     asset_status = asset_status.toLowerCase();
    //     // Prepare data for API call
    //     const formData = {
    //         asset_category: assetCategory,
    //         asset_status: asset_status,
    //         allocated_to: allocated_to,
    //         team: team,
    //         user_id: userId,
    //         user_name: user_name
    //     };

    //     try {
    //         const response = await fetch('/asset/registerAsset', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(formData),
    //         });

    //         if (response.ok) {
    //             // Show success message if registration is successful
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: 'Success',
    //                 text: 'Asset registered successfully',
    //                 showConfirmButton: false,
    //                 timer: 2000 // Close swal after 2 seconds
    //             }).then(() => {
    //                 // Redirect to dashboard after success message
    //                 window.location.href = '/adminPortal';
    //             });
    //         } else {
    //             if (response.status === 400) {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'error',
    //                     text: 'Invalid Employee Id in Allocated To field',
    //                     showConfirmButton: false,

    //                     // Close swal after 2 seconds
    //                 }).then(() => {
    //                     // Redirect to dashboard after success message
    //                     window.location.href = '/signup';
    //                 });
    //             } else {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'error',
    //                     text: 'Asset is already registered',
    //                     showConfirmButton: false,

    //                     // Close swal after 2 seconds
    //                 }).then(() => {
    //                     // Redirect to dashboard after success message
    //                     window.location.href = '/signup';
    //                 });

    //                 throw new Error('Failed to register asset');
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error registering asset:', error);
    //         // Show error message if registration fails
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'Failed to register asset'
    //         });
    //     }
    // });
});
