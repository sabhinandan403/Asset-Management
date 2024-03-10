document.addEventListener("DOMContentLoaded", async function () {
    const assetCountApiUrl = "/asset/getAssetCount";
    let user_name = localStorage.getItem("user_name");
    console.log(user_name);
    document.getElementById('user-name').textContent = `Hi, ${user_name}`;

    try {
        const response = await fetch(assetCountApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });
        if (!response.ok) {

            setTimeout(() => Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Record Not Found'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            }), 1000
            )
        }
        const data = await response.json();
        populateTable(data.data[0]);
    } catch (error) {
        console.error("Error fetching asset count data:", error);
    }


    function populateTable(data) {
        const tableBody = document.querySelector("#property-table tbody");

        // Loop through each header cell
        const headerCells = document.querySelectorAll("#property-table th");
        headerCells.forEach(headerCell => {
            // Get the property name from the header cell ID
            const property = headerCell.id.replace(/^total-/, "total_").replace(/-header/, "").replace(/-/g, "_");

            // Check if the property exists in the data object
            if (data.hasOwnProperty(property)) {
                // Find the corresponding table row index based on the header's column index
                const columnIndex = headerCell.cellIndex;
                let row = tableBody.rows[0]; // Assuming the header row is the first row

                // If the row doesn't exist, create it
                if (!row) {
                    row = tableBody.insertRow();
                }

                // Insert the value into the cell corresponding to the header's column index
                const value = data[property];
                const cell = row.insertCell(columnIndex);
                cell.textContent = value;
            }
        });
    }
    // Function to fetch data for a specific header ID
    async function fetchHeaderData(headerId) {
        let apiUrl;
        switch (headerId) {
            case "total-asset-count-header":
                apiUrl = "/asset/getAllAssets";
                break;
            case "total-allocated-assets-header":
                apiUrl = "/asset/getAllocatedAssets";
                break;
            case "total-unallocated-assets-header":
                apiUrl = "/asset/getUnallocatedAssets";
                break;

            case "total-laptop-assets-header":
                apiUrl = "/asset/getCategorywiseAssets/laptop";
                break;

            case "total-dongle-assets-header":
                apiUrl = "/asset/getCategorywiseAssets/dongle";
                break;

            case "total-mobile-assets-header":
                apiUrl = "/asset/getCategorywiseAssets/mobile";
                break;

            case "total-desktop-assets-header":
                apiUrl = "/asset/getCategorywiseAssets/desktop";
                break;

            case "total-sap-assets-header":
                apiUrl = "/asset/getTeamwiseAssets/SAP";
                break;

            case "total-eti-assets-header":
                apiUrl = "/asset/getTeamwiseAssets/ETI";
                break;

            case "total-oss-assets-header":
                apiUrl = "/asset/getTeamwiseAssets/OSS";
                break;

            case "total-microsoft-assets-header":
                apiUrl = "/asset/getTeamwiseAssets/Microsoft";
                break;

            case "total-yna-assets-header":
                apiUrl = "/asset/getTeamwiseAssets/YNA";
                break;



            default:
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cannot get asset data based on table headers'
                });
                //setTimeout(window.location.reload(), 2000)
                return null;

            // Add cases for other headers if needed
        }
        //$("#assetDetailsModal").modal("hide");
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            //$("#assetDetailsModal").modal("hide");
            if (!response.ok) {
                $("#assetDetailsModal").find(".modal-body").empty();
                $("#assetDetailsModal").find(".modal fade").modal("hide");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Record Not Found'
                }).then((result) => {
                    if (result.isConfirmed) {

                        window.location.reload();
                    }
                });


                //setTimeout(() => window.location.reload(), 8000);
                throw new Error(`Failed to fetch data for header ${headerId}`);
            } else {
                var data = await response.json();
                return data.data
            }
        } catch (error) {
            console.error(`Error fetching data for header ${headerId}:`, error);
            return null;
        }
    }


    // Function to handle logout
    // async function logout() {
    //     try {
    //         const response = await fetch("/logout");
    //         if (response.ok) {
    //             window.location.href = "/";
    //         } else {
    //             throw new Error("Logout failed");
    //         }
    //     } catch (error) {
    //         console.error("Logout failed:", error);
    //     }

    // }

    // Add event listeners to header cells
    const headerCells = document.querySelectorAll("#property-table th");
    headerCells.forEach(cell => {
        cell.addEventListener("click", async function () {
            const headerId = cell.id;
            const data = await fetchHeaderData(headerId);
            if (data) {
                populateAssetDetailsTable(data);
                //$("#assetDetailsModal").modal("show");
            }
        });
    });

    const formatDate = (timestamp) => {

        if (timestamp === null || timestamp === undefined || timestamp === '') {
            return ''; // Return empty string
        }
        const dateParts = timestamp.split('T')[0].split('-');
        const timeParts = timestamp.split('T')[1].split('.')[0].split(':');

        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        const hours = timeParts[0];
        const minutes = timeParts[1];
        const seconds = timeParts[2];

        //return `${year}/${month}/${day}  ${hours}:${minutes}:${seconds}`;

        return `${day}/${month}/${year}  ${hours}:${minutes}:${seconds}`;

    };

    function populateAssetDetailsTable(data) {
        const tableBody = document.querySelector("#assetDetailsTable tbody");

        // Clear existing table rows
        tableBody.innerHTML = "";



        // Populate the table with data
        data.forEach(asset => {
            const row = tableBody.insertRow();

            const formattedDate = formatDate(asset.created_at);
            row.insertCell().textContent = asset.asset_id;
            row.insertCell().textContent = asset.asset_category;
            row.insertCell().textContent = asset.asset_status;
            row.insertCell().textContent = asset.allocated_to;
            row.insertCell().textContent = asset.team;
            row.insertCell().textContent = formattedDate;
            row.insertCell().textContent = asset.created_by;
            row.insertCell().textContent = asset.modified_by;

            // Add view button
            const viewButtonCell = row.insertCell();
            const viewButton = document.createElement("button");
            viewButton.textContent = "View";
            viewButton.className = "btn btn-primary btn-sm";
            viewButton.dataset.assetId = asset.asset_id; // Store asset_id in button's dataset
            viewButton.addEventListener("click", onViewButtonClick);
            viewButtonCell.appendChild(viewButton);

            // Add update button
            const updateButtonCell = row.insertCell();
            const updateButton = document.createElement("button");
            updateButton.textContent = "Update";
            updateButton.className = "btn btn-success btn-sm";
            updateButton.dataset.assetId = asset.asset_id; // Store asset_id in button's dataset
            updateButton.addEventListener("click", onUpdateButtonClick);
            updateButtonCell.appendChild(updateButton);
        });

    }
    // Function to handle view button click
    async function onViewButtonClick(event) {
        const assetId = event.target.dataset.assetId;
        try {
            const response = await fetch(`/asset/getAssetHistory/${assetId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch asset history");
            }
            const data = await response.json();
            $("#assetDetailsModal").modal("hide");
            populateAssetHistoryTable(data.data);
            //$("#viewAssetHistoryModal").modal("show");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'History does not exist for this asset'
            }).then(() => {
                window.location.reload()
            });
            console.error("Error fetching asset history:", error);
        }
    }

    // Function to handle update button click
    async function onUpdateButtonClick(event) {
        const assetId = event.target.dataset.assetId;
        try {
            const response = await fetch(`/asset/getAssetDetails/${assetId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch asset details");
            }
            const data = await response.json();
            $("#assetDetailsModal").modal("hide");
            populateUpdateAssetForm(data.data);
            //$("#updateAssetModal").modal("show");
        } catch (error) {
            console.error("Error fetching asset details:", error);
        }
    }
    // Populate asset history table
    function populateAssetHistoryTable(data) {
        const tableBody = document.querySelector("#assetHistoryTable tbody");
        // Clear existing table rows
        tableBody.innerHTML = "";

        let header = document.getElementById("viewAssetHistoryModalLabel")
        // Populate the table with data
        data.forEach(history => {
            const row = tableBody.insertRow();
            const formattedDate = formatDate(history.modified_at);
            //row.insertCell().textContent = history.history_id;
            // row.insertCell().textContent = history.asset_id;
            row.insertCell().textContent = history.asset_category;
            row.insertCell().textContent = history.asset_status;
            row.insertCell().textContent = formattedDate;
            row.insertCell().textContent = history.created_by;
            row.insertCell().textContent = history.allocated_to;
            row.insertCell().textContent = history.modified_by;
        });
        header.textContent = `History Asset ID: ${data[0].asset_id} `;
        $("#viewAssetHistoryModal").modal("show");
    }


    try {
        const response = await fetch('/asset/getStatusType');
        if (!response.ok) {
            throw new Error('Failed to fetch status types');
        }
        const data = await response.json();
        populateStatusDropdown(data.data);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error fetching status types'
        });
        setTimeout(() => window.location.reload(), 2000);
        console.error('Error fetching status types:', error);
    }

    try {
        const response = await fetch('/asset/getTeamType');
        if (!response.ok) {
            throw new Error('Failed to fetch status types');
        }
        const data = await response.json();
        populateTeamDropdown(data.data);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error fetching status types'
        });
        setTimeout(() => window.location.reload(), 2000);
        console.error('Error fetching status types:', error);
    }

    function populateStatusDropdown(data) {
        const statusDropdown = document.getElementById('assetStatus');
        // Clear existing options
        statusDropdown.innerHTML = '';
        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = 'Select Asset Status';
        placeholderOption.disabled = true;
        placeholderOption.selected = true; // Select the placeholder option by default
        statusDropdown.appendChild(placeholderOption);

        // Populate options from the data
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.asset_status;
            option.id = item.asset_status.toLowerCase();
            option.value = item.asset_status;
            statusDropdown.appendChild(option);
        });
    }

    function populateTeamDropdown(data) {
        const teamDropdown = document.getElementById('team');
        // Clear existing options
        statusDropdown.innerHTML = '';
        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = 'Select Asset Team';
        placeholderOption.disabled = true;
        placeholderOption.selected = true; // Select the placeholder option by default
        teamDropdown.appendChild(placeholderOption);

        // Populate options from the data
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.asset_status;
            option.id = item.team;
            option.value = item.team;
            teamDropdown.appendChild(option);
        });
    }

    // Populate update asset form
    function populateUpdateAssetForm(data) {
        const formData = data
        // Prefill input fields with data from the response
        document.getElementById("assetId").value = formData.asset_id;
        document.getElementById("assetCategory").value = formData.asset_category;
        //document.getElementById("assetStatus").value = formData.asset_status;
        document.getElementById("allocatedTo").value = formData.allocated_to || "";

        // Disable allocatedTo field if asset status is 'Unallocated'
        const allocatedToField = document.getElementById('allocatedTo');
        if (formData.asset_status_name === 'Unallocated') {
            allocatedToField.value = ''; // Clear the value
            allocatedToField.disabled = true;
        } else {
            allocatedToField.disabled = false;
        }
        document.getElementById("team").value = formData.team !== undefined ? formData.team : "";

        const assetStatusDropdown = document.getElementById('assetStatus');
        const selectedStatus = formData.asset_status;
        const option = assetStatusDropdown.querySelector(`option[value="${selectedStatus}"]`);
        if (option) {
            option.selected = true;
        } else {
            console.error(`Element with ID '${selectedStatus}' not found.`);
        }

        const teamNameDropdown = document.getElementById('team')
        const teamSelected = formData.team
        const teamOption = teamNameDropdown.querySelector(`option[value="${teamSelected}"]`);
        if(teamOption) {

            teamOption.selected = true;
        }else{
            console.error(`Element with ID '${teamSelected}' not found.`);
        }

        $("#updateAssetModal").modal("show");

    }
    // Event listener for asset status dropdown change
    document.getElementById('assetStatus').addEventListener('change', function (event) {
        const selectedStatus = event.target.value;
        const allocatedToField = document.getElementById('allocatedTo');
        if (selectedStatus === 'Unallocated') {
            allocatedToField.value = ''; // Clear the value
            allocatedToField.disabled = true;
        } else {
            allocatedToField.disabled = false;
        }
    });

    

    // Event listener for form submission
    const updateAssetForm = document.getElementById('updateAssetForm');
    updateAssetForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(updateAssetForm);
        // const asset_id = formData.get('assetId');
        // const asset_status = formData.get('assetStatus');
        // const allocated_to = formData.get('allocatedTo');
        // const team = formData.get('team');
        // const user_id = localStorage.getItem('user_id')

        const asset_id = document.getElementById('assetId').value;
        let asset_status = document.getElementById('assetStatus').value;
        let allocated_to = document.getElementById('allocatedTo').value;
        const team = document.getElementById('team').value;
        const user_id = localStorage.getItem('user_id');
        const user_name  = localStorage.getItem('user_name');

        if (asset_status === 'unallocated' || asset_status === 'Unallocated') {

            allocated_to = 'null'
        }
        asset_status = asset_status.toLowerCase();

        if (asset_status === 'allocated' || asset_status === 'Allocated') {

            if (!team) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please add team name'
                });
                return
            } else if (!allocated_to) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please fill Allocated To field'
                });
                return
            }
        }

        // Perform update action with form data
        try {
            const response = await fetch(`/asset/updateAsset`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    asset_id,
                    user_id,
                    asset_status,
                    allocated_to,
                    team,
                    user_name
                }),
            });
            if (response.ok) {
                // Asset updated successfully
                console.log('Asset updated successfully');
                Swal.fire({
                    icon: 'success',
                    title: 'Sucess',
                    text: 'Asset updated successfully'
                });
                setTimeout(() => window.location.reload(), 2000);
                $("#updateAssetModal").modal("hide");
                window.location.reload()
                // Optionally, you can handle redirection or show a success message here
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update asset'
                });
                setTimeout(() => window.location.reload(), 2000);
                throw new Error('Failed to update asset');
            }
        } catch (error) {
            console.error('Error updating asset:', error);
            // Optionally, you can display an error message to the user
        }
    });

    // Close modals when clicking on blank space
    $(".modal").on("click", function (e) {
        if ($(e.target).hasClass("modal")) {
            $(this).modal("hide");
        }
    });


    // Function to fetch asset categories and populate dropdown
    const getAssetCategories = async () => {
        try {
            const response = await fetch('/asset/getCategoryType');
            if (!response.ok) {
                throw new Error('Failed to fetch asset categories');
            }
            const data = await response.json();
            populateAssetCategories(data.data);
        } catch (error) {
            console.error('Error fetching asset categories:', error);
        }
    };

    const populateAssetCategories = (assetCategories) => {
        const assetCategoryDropdown = document.getElementById('newAssetCategory');

        // Clear existing options
        assetCategoryDropdown.innerHTML = '';

        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = 'Select Asset Category';
        placeholderOption.disabled = true;
        placeholderOption.selected = true; // Select the placeholder option by default
        assetCategoryDropdown.appendChild(placeholderOption);

        // Iterate through each asset category and create an option element
        assetCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.asset_category;
            option.textContent = category.asset_category;
            assetCategoryDropdown.appendChild(option);
        });
    };

    // Function to fetch asset statuses and populate dropdown
    const getAssetStatuses = async () => {
        try {
            const response = await fetch('/asset/getStatusType');
            if (!response.ok) {
                throw new Error('Failed to fetch asset statuses');
            }
            const data = await response.json();
            populateAssetStatuses(data.data);
        } catch (error) {
            console.error('Error fetching asset statuses:', error);
        }
    };

    const populateAssetStatuses = (assetStatuses) => {
        const assetStatusDropdown = document.getElementById('newAssetStatus');

        // Clear existing options
        assetStatusDropdown.innerHTML = '';


        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = 'Select Asset Status';
        placeholderOption.disabled = true;
        placeholderOption.selected = true; // Select the placeholder option by default
        assetStatusDropdown.appendChild(placeholderOption);

        // Iterate through each asset status and create an option element
        assetStatuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status.asset_status;
            option.textContent = status.asset_status;
            assetStatusDropdown.appendChild(option);
        });
    };

    // Function to handle change event on asset status dropdown
    const handleAssetStatusChange = () => {
        const assetStatusDropdown = document.getElementById('newAssetStatus');
        const allocatedToInput = document.getElementById('newAllocatedTo');

        assetStatusDropdown.addEventListener('change', () => {
            const selectedStatus = assetStatusDropdown.value;
            // If asset status is 'Unallocated', disable the allocated to input field
            if (selectedStatus.toLowerCase() === 'unallocated') {
                allocatedToInput.disabled = true;
                allocatedToInput.value = ''; // Clear the input field
            } else {
                allocatedToInput.disabled = false;
            }
        });
    };

    // Show Register New Asset modal on navbar link click
    const registerAssetLink = document.getElementById('add-asset');

    registerAssetLink.addEventListener('click', async () => {
        // Call the functions to fetch asset categories and statuses
        await getAssetCategories();
        await getAssetStatuses();

        $('#registerAssetModal').modal('show');
        // Call the function to handle asset status change event
        handleAssetStatusChange();

    });

    // Call the function to handle asset status change event
    handleAssetStatusChange();



    // Form submission and validation for registering new asset
    const registerAssetForm = document.getElementById('registerAssetForm');
    registerAssetForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        //let registerAssetForm = document.getElementById('registerAssetForm');

        // Validate all fields are filled
        const assetCategory = document.getElementById('newAssetCategory').value;
        let assetStatus = document.getElementById('newAssetStatus').value;
        let allocatedTo = document.getElementById('newAllocatedTo').value;
        const team = document.getElementById('newTeam').value;
        const userId = localStorage.getItem('user_id');
        const user_name = localStorage.getItem('user_name');
        console.log(userId);

        if (!assetCategory || !assetStatus || !team) {
            // Show error message if any field is empty
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill all fields'
            });
            return; // Exit function if any field is empty
        }

        if (assetStatus === 'unallocated' || assetStatus === 'Unallocated') {

            allocatedTo = 'null'
        }
        assetStatus = assetStatus.toLowerCase();

        // if(assetStatus === 'allocated'){
        //     if(!allocatedTo){
        //         Swal.fire({
        //             icon: 'error',
        //             title:'error',
        //             text: 'Please fill the allocated to field'});
        // }

        // Prepare data for API call
        const formData = {
            asset_category: assetCategory,
            asset_status: assetStatus,
            allocated_to: allocatedTo,
            team: team,
            user_id: userId,
            user_name: user_name
        };

        try {
            const response = await fetch('/asset/registerasset', {
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
                    text: 'Asset registered successfully',
                    showConfirmButton: false,
                    timer: 2000 // Close swal after 2 seconds
                }).then(() => {
                    // Redirect to dashboard after success message
                    window.location.href = '/dashboard';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'error',
                    text: 'Asset is already registered',
                    showConfirmButton: false,
                    // Close swal after 2 seconds
                }).then(() => {
                    // Redirect to dashboard after success message
                    window.location.href = '/dashboard';
                });
                throw new Error('Failed to register asset');
            }
        } catch (error) {
            console.error('Error registering asset:', error);
            // Show error message if registration fails
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to register asset'
            });
        }
    });

}); 
