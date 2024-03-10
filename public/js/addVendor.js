document.addEventListener('DOMContentLoaded', () => {

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
                    + (parseInt(data.data.total_request_count) - parseInt(previousNewAssetRequestCount))
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
    let fileCount = 0;

    // Upload Files to cloudinary
//     var widget = cloudinary.createUploadWidget({
//         cloudName: 'dfgpafstm',
//         uploadPreset: 'zseaaimx',
//         sources: ['local', 'url'],
//         multiple: true,
//         showCompletedButton: true,
//         showUploadMoreButton: true,
//         clientAllowedFormats: ['pdf', 'doc', 'docx'], // Specify the allowed formats here
//         showInsecurePreview: true, // Specify the allowed formats here
//         //inlineContainer: '#myModal',
//         resourceType: 'auto',
//     }, (error, result) => {
//         if (!error && result && result.event === "success") {
//             console.log('Done uploading..: ', result.info);
//             console.log('Done uploading..: ', result.info.url);
//             fileCount = fileCount + 1;
//             console.log(fileCount)
//             showUploadedFile(result.info.url,result.info.original_filename, result.info.delete_token);

//         }
//     });
    
//     document.getElementById("upload_widget").addEventListener("click", function () {

//         //$("#myModal").modal("show");
//         widget.open();
//     });

//    // Function to show uploaded file as a list item
// function showUploadedFile(fileUrl, fileName,deleteToken) {
//     // Create list item
//     var listItem = document.createElement('li');
//     listItem.classList.add('uploaded-file-item', 'list-group-item');
  
//     // Create check icon
//     var checkIcon = document.createElement('i');
//     checkIcon.classList.add('fas', 'fa-check', 'text-success', 'mr-2');
  
//     // Create filename element
//     var filenameElement = document.createElement('span');
//     filenameElement.textContent = fileName;
  
//     // Create delete button
//     var deleteButton = document.createElement('i');
//     deleteButton.classList.add('fas', 'fa-times', 'text-danger', 'ml-2', 'delete-file');
//     deleteButton.dataset.url = fileUrl;
//     deleteButton.addEventListener('click', function() {
//       deleteFile(deleteToken, listItem);
//     });
  
//     // Append elements to list item
//     listItem.appendChild(checkIcon);
//     listItem.appendChild(filenameElement);
//     listItem.appendChild(deleteButton);
  
//     // Append list item to container
//     var uploadedFilesContainer = document.getElementById('uploadedFilesContainer');
//     var fileList = uploadedFilesContainer.querySelector('ul');
//     fileList.appendChild(listItem);
//   }
  
//   // Function to delete uploaded file
//   function deleteFile(deleteToken, listItem) {
//     // Here you can write code to delete the file from Cloudinary or any other backend storage

//     $.cloudinary.delete_by_token(deleteToken);
//     // For demonstration, let's remove the list item from the DOM
//     listItem.remove();
//   }
  


    // Function to fetch asset categories and populate dropdown
    const getAssetCategories = async () => {
        try {
            const response = await fetch('/asset/getCategoryType');
            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cannot get Category Type'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
                throw new Error('Failed to fetch asset categories');
            }
            const data = await response.json();
            populateAssetCategories(data.data);
        } catch (error) {
            console.error('Error fetching asset categories:', error);
        }
    };

    // Populate asset categories dropdown with data from the response
    const populateAssetCategories = (assetCategories) => {
        const assetCategoryDropdown = document.getElementById('assetCategoryDropdown');

        // Clear existing options
        assetCategoryDropdown.innerHTML = '';

        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = 'Select Asset Category';
        placeholderOption.disabled = true;
        placeholderOption.selected = true; // Select the placeholder option by default
        assetCategoryDropdown.appendChild(placeholderOption);

        assetCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.asset_category;
            option.id = category.asset_category;
            option.textContent = category.asset_category;
            assetCategoryDropdown.appendChild(option);
        });
    };

    // Fetch asset categories on DOM content load
    getAssetCategories();

    // Handle form submission for registering a vendor
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // console.log(registrationForm.value);

        // //const form = e.target;
        // const form = document.querySelector('#registrationForm');
        // console.log('Form data:', form);

        //var formData = new FormData();
        // console.log('FormData:', formData);
        // // const formData = {}
        const assetCategory = document.getElementById('assetCategoryDropdown').value;
        const vendorName = document.getElementById('vendorName').value;
        const vendorEmail = document.getElementById('vendorEmail').value;
        const vendorAddress = document.getElementById('vendorAddress').value;
        const assetPricePerUnit = document.getElementById('assetPricePerUnit').value;
        const user_id = localStorage.getItem('admin_id');
        const vendorContactNumber = document.getElementById('vendorContactNumber').value;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


        if (!emailRegex.test(vendorEmail)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
            });
            return

            // Optionally, focus back on the email input field
        }

        if (assetPricePerUnit <= 0) {
            // Display an error message or take appropriate action
            console.error('Asset price per unit must be greater than or equal to zero');
            // Optionally, you can show a Swal.fire error message
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Asset price per unit must be greater than zero.',
            });
            return
        }
        // formData.assetCategory = assetCategory;
        // formData.vendorName = vendorName;
        // formData.vendorEmail = vendorEmail;
        // formData.vendorAddress = vendorAddress;
        // formData.assetPricePerUnit = assetPricePerUnit;
        // formData.vendorContactNumber = vendorContactNumber;
        // formData.user_id = user_id;

        // Append data to the FormData object
        // formDataa.append('assetCategory', assetCategory);
        // formDataa.append('vendorName', vendorName);
        // formDataa.append('vendorEmail', vendorEmail);
        // formDataa.append('vendorAddress', vendorAddress);
        // formDataa.append('assetPricePerUnit', assetPricePerUnit);
        // formDataa.append('user_id', user_id);
        // formDataa.append('vendorContactNumber', vendorContactNumber);

        // const quotationFileInput = document.querySelector('#uploadQuotation');
        // const quotationFile = quotationFileInput.files[0]; // Get the selected file

        //const contactNumber = formData.get('vendorContactNumber');
        //const vendorContactNumber = formData.vendorContactNumber;

        // Validate contact number length
        const contactNumberRegex = /^\d{10}$/;

        if (!contactNumberRegex.test(vendorContactNumber)) {
            // If the contact number doesn't match the regex pattern
            console.error('Invalid contact number');
            // Optionally, you can show a Swal.fire error message
            Swal.fire({
                icon: 'error',
                title: 'Invalid Contact Number',
                text: 'Contact number should be a 10-digit number with no special characters.',
            });
            return
        }

        let formData = {
            assetCategory: assetCategory,
            vendorName: vendorName,
            vendorEmail: vendorEmail,
            vendorAddress: vendorAddress,
            assetPricePerUnit: assetPricePerUnit,
            user_id: user_id,
            vendorContactNumber: vendorContactNumber
        }

        // Append the file to FormData object if it exists
        // if (quotationFile) {
        //     if (FormData.length == 0) {
        //         formData.uploadQuotation = quotationFile;
        //     } else {
        //         formData.append("uploadQuotation", quotationFile);
        //     }
        // }
        // formData.uploadQuotation = quotationFile;

        try {
            const response = await fetch('/asset/registerVendor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {

                if (response.status === 404) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Employee Id not found'
                    }).then(() => {
                        window.location.href = '/adminPortal';
                    });
                }
                console.log('Vendor cannot be added')
                throw new Error('Failed to add vendor');
            }

            // Vendor added successfully
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Vendor added successfully'
            }).then(() => {
                window.location.href = '/addQuotation';
            });
        } catch (error) {
            // Error adding vendor
            console.error('Error adding vendor:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Vendor cannot be added'
            });
        }
    });
});
