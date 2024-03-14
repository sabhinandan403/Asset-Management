document.addEventListener("DOMContentLoaded", async function () {

    if ($.fn.DataTable.isDataTable('#assetTable')) {
        $('#assetTable').DataTable().destroy();
    }

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
    // Function to fetch data from API using localStorage.getItem('apiId')
    async function fetchCardData() {
        var cardId = localStorage.getItem('cardId');
        let apiUrl;
        switch (cardId) {
            case "totalAssetsCard":
                apiUrl = "/asset/getAllAssets";
                document.getElementById('assets-data').innerText = 'Assets Data';
                break;
            case "allocatedAssetsCard":
                apiUrl = "/asset/getAllocatedAssets";
                document.getElementById('assets-data').innerText = 'Allocated Assets ';
                break;
            case "unallocatedAssetsCard":
                apiUrl = "/asset/getUnallocatedAssets";
                document.getElementById('assets-data').innerText = ' Unallocated Assets ';
                break;
            case "laptopAssetsCard":
                apiUrl = "/asset/getCategorywiseAssets/Laptop";
                document.getElementById('assets-data').innerText = ' Laptop Assets';
                break;
            case "dongleAssetsCard":
                apiUrl = "/asset/getCategorywiseAssets/Dongle";
                document.getElementById('assets-data').innerText = 'Dongle Assets';
                break;
            case "mobileAssetsCard":
                apiUrl = "/asset/getCategorywiseAssets/Mobile";
                document.getElementById('assets-data').innerText = 'Mobile Assets';
                break;
            case "desktopAssetsCard":
                apiUrl = "/asset/getCategorywiseAssets/Desktop";
                document.getElementById('assets-data').innerText = 'Desktop Assets';
                break;
            case "sapAssetsCard":
                apiUrl = "/asset/getTeamwiseAssets/SAP";
                document.getElementById('assets-data').innerText = 'SAP Team Assets';
                break;
            case "eitAssetsCard":
                apiUrl = "/asset/getTeamwiseAssets/ETI";
                document.getElementById('assets-data').innerText = 'ETI Team Assets';
                break;
            case "ossAssetsCard":
                apiUrl = "/asset/getTeamwiseAssets/OSS";
                document.getElementById('assets-data').innerText = 'OSS Team Assets';
                break;
            case "microsoftAssetsCard":
                apiUrl = "/asset/getTeamwiseAssets/Microsoft";
                document.getElementById('assets-data').innerText = 'Microsoft Team Assets';
                break;
            case "ynaAssetsCard":
                apiUrl = "/asset/getTeamwiseAssets/YNA";
                document.getElementById('assets-data').innerText = 'YNA Team Assets';
                break;
            default:
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cannot get asset data based on card ID'
                });
                return null;
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Record Not Found'
                }).then(() => {
                    window.location.href = '/adminPortal'
                });
                return null;
            } else {
                const data = await response.json();
                return data.data;
            }
        } catch (error) {
            console.error(`Error fetching data for card ${cardId}:`, error);
            return null;
        }
    }

    const formatDate = (timestamp) => {
        if (timestamp === null || timestamp === undefined || timestamp === '') {
            return ''; // Return empty string
        }

        // Parse the timestamp into a Date object
        const date = new Date(timestamp);


        // Extract year, month, day, hours, minutes, and seconds from the adjusted date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Return the formatted date string
        return `${day}/${month}/${year}  ${hours}:${minutes}:${seconds}`;
    };


    // Function to populate the table with data
    const populateTable = (data) => {
        $('#assetTable').DataTable({
            data: data,
            "columns": [
                { "data": 'asset_id', className: 'dt-body-left' },
                { "data": 'asset_category' },
                { "data": 'asset_status' },
                { "data": 'allocated_to' },
                { "data": 'team' },
                {
                    "data": 'created_at',
                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data);
                    }
                },
                { "data": 'created_by' },

                { "data": 'modified_by' },
                {
                    "data": 'modified_at',
                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data);
                    }
                },

                {
                    "data": null,
                    render: function (data, type, row) {
                        return '<button type="button" class="btn btn-primary btn-sm view" style="width:70px">View</button> ' +
                            '<button type="button" class="btn btn-success btn-sm update" style="width:70px">Update</button>';
                    }
                }
            ],
            // Add search field on top of the table
            //dom: 'lfrtip',

            scrollY: 'calc(100vh - 200px)', // Adjust the height as needed
            ordering: true,
            paging: true,
            scrollCollapse: true,
            columnDefs: [{ orderable: false, targets: 9 }],
            lengthMenu: [10, 12, 14, 16],
            pageLength: 10,
            language: {
                paginate: {
                    next: '<i class="fa-solid fa-forward-step"></i>',
                    previous: '<i class="fa-solid fa-backward-step"></i>',
                    first: '<i class="fa-solid fa-angle-double-left"></i>',
                    last: '<i class="fa-solid fa-angle-double-right"></i>'
                }
            },
            style: {
                header: {
                    background: '#0d6efd', // Set your desired background color here
                    color: 'white' // Set text color if needed
                }
            },
            drawCallback: function(settings) {
                var api = this.api();
                var recordsTotal = api.page.info().recordsTotal;
                var pageLength = api.page.len();
        
                if (recordsTotal <= pageLength) {
                    // If the total records is less than or equal to the page length,
                    // hide the pagination
                    $('.paging_full_numbers').hide();
                } else {
                    // Otherwise, show the pagination
                    $('.paging_full_numbers').show();
                }
            }

        });
    };





    // Fetch data from API and populate the table on DOM content load
    fetchCardData().then(data => {
        // Convert array of objects to array of arrays
        //const dataArray = data.map(obj => Object.entries(obj));

        console.log(data);
        // Populate the DataTable with the fetched data
        populateTable(data);

        //Add show with the lenght menu in the data table
    //     var lengthMenuElement = document.querySelector('.dt-layout-cell dt-start ');
    //     var spanElement = document.createElement('span');
    //     spanElement.innerText = 'Show'
    //     lengthMenuElement.appendChild(spanElement);
     });



    // Handle click event for view button
    $('#assetTable tbody').on('click', 'button.view', function () {
        // Get the data of the row clicked
        if ($.fn.DataTable.isDataTable('#assetHistoryTable')) {
            $('#assetHistoryTable').DataTable().destroy();
        }
        const rowData = $('#assetTable').DataTable().row($(this).parents('tr')).data();
        // Perform actions for viewing the row data (e.g., display in modal)
        let assetId = rowData.asset_id;
        localStorage.setItem('assetId', assetId);
        console.log('Viewing data:', rowData);
        window.location.href = '/assetHistory'
    });

    // Handle click event for update button
    $('#assetTable tbody').on('click', 'button.update', function () {
        // Get the data of the row clicked
        const rowData = $('#assetTable').DataTable().row($(this).parents('tr')).data();
        console.log(rowData)
        // Perform actions for updating the row data (e.g., open update form)
        // Extract the asset_id from the rowData
        const assetId = rowData.asset_id;
        // Call the function and pass the asset_id
        onUpdateButtonClick(assetId);
        console.log('Updating data:', rowData);
    });


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
        //setTimeout(() => window.location.reload(), 2000);
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

    try {
        const response = await fetch('/asset/getTeamType');
        if (!response.ok) {
            throw new Error('Failed to fetch team types');
        }
        const data = await response.json();
        populateTeamDropdown(data.data);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error fetching team types'
        });
        //setTimeout(() => window.location.reload(), 2000);
        console.error('Error fetching team types:', error);
    }

    function populateTeamDropdown(data) {
        const teamDropdown = document.getElementById('team');
        // Clear existing options
        teamDropdown.innerHTML = '';


        // Populate options from the data
        data.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.team;
            option.id = item.team;
            option.value = item.team;
            teamDropdown.appendChild(option);
        });
    }


    // Function to Populate the Employee Dropdown
    const populateEmployeeDropdown = (employees) => {

        const dropdownMenu = document.getElementById('allocatedToDropdown');
        dropdownMenu.innerHTML = ''; // Clear previous results

        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = 'Select Employee';
        placeholderOption.disabled = true;
        placeholderOption.selected = true; // Select the placeholder option by default
        dropdownMenu.appendChild(placeholderOption);

        // employees.forEach(employee => {
        //   const option = document.createElement('option');
        //   option.value = employee.id;
        //   option.textContent = `${employee.id} - ${employee.name}`;
        //   dropdownMenu.appendChild(option);
        // });

        employees.forEach(employee => {
            const listItem = document.createElement('li');
            listItem.classList.add('dropdown-item');
            listItem.value = employee.id;
            listItem.textContent = `${employee.id} - ${employee.name}`;
            listItem.addEventListener('click', function () {
                document.getElementById('allocatedTo').value = `${employee.id} - ${employee.name}`;
                document.getElementById('allocatedTo').dataset.employeeID = `${employee.id}`;

            });
            dropdownMenu.appendChild(listItem);
        });

        if (employees.length === 0) {
            const listItem = document.createElement('li');
            listItem.classList.add('dropdown-item');
            listItem.textContent = 'No matching employees';
            listItem.addEventListener('click', function () {
                document.getElementById('newAllocatedTo').value = "";;
            });
            dropdownMenu.appendChild(listItem);
        }

        // Show the dropdown menu
        dropdownMenu.classList.add('show');
    }


    let employeeList = []; // List to store employees

    // Function to fetch asset statuses and populate dropdown
    const getEmployees = async () => {
        try {
            const response = await fetch(`/asset/getEmployees`);
            if (!response.ok) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch employees data' })
                throw new Error('Failed to fetch employees data');
            }
            const data = await response.json();

            // Save data in the employee list
            employeeList = data.data.map(employee => ({
                id: `YM${employee.user_id}`,
                name: employee.user_name,
                team: employee.team
            }));

            populateEmployeeDropdown(employeeList);
        } catch (error) {
            console.error('Error fetching asset statuses:', error);
        }
    };

    document.getElementById('team').addEventListener('change', function () {
        const team = document.getElementById('team').value;
        var assetStatusDropdown = document.getElementById('assetStatus');
        var filteredEmployeesTeamWise
        if (team === 'Not Allocated') {
            // Select the 'Unallocated' option in the assetStatus dropdown
            // const unallocatedOption = assetStatusDropdown.querySelector('option[value="Unallocated"]');
            // if (unallocatedOption) {
            //     unallocatedOption.selected = true;
            //     document.getElementById('allocatedTo').disabled = true;
            // }
            filteredEmployeesTeamWise = employeeList
            populateEmployeeDropdown(filteredEmployeesTeamWise)
        } else {
            
            filteredEmployeesTeamWise = employeeList.filter(employee =>
                employee.team.includes(team))

            document.getElementById('allocatedTo').value = ''
            populateEmployeeDropdown(filteredEmployeesTeamWise)
        }
    });

    // Function to handle input in allocated field
    document.getElementById('allocatedTo').addEventListener('input', function () {
        const searchQuery = this.value.toUpperCase();
        const team = document.getElementById('team').value;
        var filteredEmployeesTeamWise = employeeList.filter(employee =>
            employee.team.includes(team))
        //populateEmployeeDropdown(filteredEmployeesTeamWise);

        if (searchQuery) {
            // Filter employees based on search query
            const filteredEmployees = filteredEmployeesTeamWise.filter(employee =>
                employee.id.includes(searchQuery) || employee.name.toLowerCase().startsWith(searchQuery.toLowerCase()) 
            );

            populateEmployeeDropdown(filteredEmployees);
            document.getElementById('allocatedToDropdown').style.display = 'block';
        } else {
            // Populate with all employees if search query is empty
            populateEmployeeDropdown(employeeList);
            document.getElementById('allocatedToDropdown').style.display = 'block';
        }
    });

    document.getElementById('allocatedTo').addEventListener('focus', function () {
        document.getElementById('allocatedToDropdown').style.display = 'block';
    })

    document.getElementById('allocatedTo').addEventListener('click', function () {
        document.getElementById('allocatedToDropdown').style.display = 'block';
    })

    getEmployees();

    // Function to handle update button click
    async function onUpdateButtonClick(event) {
        const assetId = event
        try {
            const response = await fetch(`/asset/getAssetDetails/${assetId}`);
            if (!response.ok) {

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to get asset details'
                }).then(() => { window.location.href = '/assetDetails' });
                throw new Error("Failed to fetch asset details");
            }
            const data = await response.json();
            //$("#assetDetailsModal").modal("hide");
            populateUpdateAssetForm(data.data);
            //$("#updateAssetModal").modal("show");
        } catch (error) {
            console.error("Error fetching asset details:", error);
        }
    }

    // Populate update asset form
    function populateUpdateAssetForm(data) {
        const formData = data
        // Prefill input fields with data from the response
        document.getElementById("assetId").value = formData.asset_id;
        document.getElementById("assetCategory").value = formData.asset_category;
        //document.getElementById("assetStatus").value = formData.asset_status;
        let filteredEmployees = employeeList.filter(employee =>
            employee.id.toLowerCase().includes(formData.allocated_to) || employee.name.toLowerCase().includes(formData.allocated_to)
        );



        // Disable allocatedTo field if asset status is 'Unallocated'
        const allocatedToField = document.getElementById('allocatedTo');
        if (formData.asset_status === 'Unallocated') {
            allocatedToField.value = ''; // Clear the value
            allocatedToField.disabled = true;
            document.getElementById('teamField').style.display = 'none';
            document.getElementById('allocatedToField').style.display = 'none';
        } else {
            let selectedEmployee = filteredEmployees[0];

            // allocatedTo = selectedEmployee.replace('YM', '');
            // allocatedTo = parseInt(allocatedTo);

            document.getElementById("allocatedTo").value = `${selectedEmployee.id} - ${selectedEmployee.name}` || "";
            document.getElementById("allocatedTo").dataset.employeeID = `${selectedEmployee.id}`
            allocatedToField.disabled = false;
        }


        //document.getElementById("team").value = formData.team !== undefined ? formData.team : "";

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
        if (teamOption) {
            teamOption.selected = true;
        } else {
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
            document.getElementById('allocatedToField').style.display = 'none';
            document.getElementById('teamField').style.display = 'none';
            document.getElementById('team').value = 'Not Allocated';
        } else {
            allocatedToField.disabled = false;
            document.getElementById('allocatedToField').style.display = 'block';
            document.getElementById('teamField').style.display = 'block';
            //document.getElementById('team').value = '';
        }
    });

    // Event listener for form submission
    const updateAssetForm = document.getElementById('updateAssetForm');
    updateAssetForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission


        const asset_id = document.getElementById('assetId').value;
        let asset_status = document.getElementById('assetStatus').value;
        let allocated_to
        if (asset_status === 'allocated' || asset_status === 'Allocated') {
            allocated_to = document.getElementById('allocatedTo').value.trim().toLowerCase();
            if (allocated_to === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select employee'
                });
                return;
            }
            if (!allocated_to.startsWith('ym')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select from the options below'
                });
                return;
            }

            let allocatedToDataSet = document.getElementById('allocatedTo').value.toLowerCase().split(' ')
            if (allocatedToDataSet.length < 3) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select from the options below'
                });
                return;
            }

            let filteredEmployees = employeeList.filter(employee =>
                employee.id.toLowerCase().includes(allocatedToDataSet[0]) && employee.name.toLowerCase().includes(allocatedToDataSet[2])
            );
            if (filteredEmployees.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select from the options below'
                });
                return;
            }


            let selectedEmployee = filteredEmployees[0].id


            allocated_to = selectedEmployee.replace('YM', '');
            allocated_to = parseInt(allocated_to);
        }

        const team = document.getElementById('team').value;
        const user_id = localStorage.getItem('admin_id');
        const user_name = localStorage.getItem('admin_name');

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
                    text: 'Please Enter Employee Id or Employee Name'
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
                    text: 'Asset updated successfully',

                }).then(() => {
                    setTimeout(() => window.location.reload(), 1000);
                })
                setTimeout(() => window.location.reload(), 2000);
                $("#updateAssetModal").modal("hide");
                //window.location.reload()
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

    // Hide dropdown menu when clicking outside of it
    document.addEventListener('click', function (event) {
        const dropdownToggle = document.getElementById('allocatedTo');
        const dropdownMenu = document.getElementById('allocatedToDropdown');
        if (!dropdownToggle.contains(event.target)) {
            dropdownMenu.style.display = 'none';
            //dropdownMenu.classList.remove('show');
        }
    });



    // Populate asset history table
    // function populateAssetHistoryTable(data) {
    //     const tableBody = document.querySelector("#assetHistoryTable tbody");
    //     // Clear existing table rows
    //     tableBody.innerHTML = "";

    //     let header = document.getElementById("viewAssetHistoryModalLabel")
    //     // Populate the table with data
    //     $('#assetHistoryTable').DataTable({
    //         data: data,
    //         "columns": [
    //             { "data": 'asset_category' },
    //             { "data": 'asset_status' },
    //             { "data": 'team' },
    //             { "data": 'allocated_to' },

    //             {
    //                 "data": 'created_by',

    //             },
    //             {
    //                 "data": 'created_at',
    //                 render: function (data, type, row) {
    //                     // Call formatDate function to format the date
    //                     return formatDate(data);
    //                 }
    //             },
    //             { "data": 'modified_by' },
    //             {
    //                 "data": 'modified_at',
    //                 render: function (data, type, row) {
    //                     // Call formatDate function to format the date
    //                     return formatDate(data);
    //                 }
    //             }
    //         ],
    //         // Add search field on top of the table
    //         // dom: 'lfrtip',
    //         // Enable sorting on each column
    //         ordering: true,
    //         language: {
    //             paginate: {
    //                 next: '<i class="fa-solid fa-forward-step"></i>',
    //                 previous: '<i class="fa-solid fa-backward-step"></i>'
    //             }
    //         },

    //     });
    //     header.textContent = `History Asset ID: ${data[0].asset_id} `;
    //     $("#viewAssetHistoryModal").modal("show");
    // }



});