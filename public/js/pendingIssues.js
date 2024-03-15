document.addEventListener("DOMContentLoaded", async function () {
    if ($.fn.DataTable.isDataTable('#pendingIssueTable')) {
        $('#pendingIssueTable').DataTable().destroy();
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
                    this.location.reload();
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

    let issueCardId = localStorage.getItem('issueCardId');
    let user_id = localStorage.getItem('admin_id')

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


    // Function to populate the dropdown for issue status
    const populateIssueStatusDropdown = (data) => {
        const issueStatusDropdown = document.getElementById('update-issue-status');
        issueStatusDropdown.innerHTML = ''; // Clear existing options

        // Add a placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Select Issue Status';
        issueStatusDropdown.appendChild(placeholderOption);

        // Create option elements for each issue status
        data.forEach((status, index) => {
            const option = document.createElement('option');
            option.value = status.issue_status; // Set the value to the issue_status property
            option.textContent = status.issue_status; // Set the text content to the issue_status property
            option.id = `option-${index}`; // Generate unique ID for each option
            issueStatusDropdown.appendChild(option);
        });
    };



    // Function to populate the update issue modal
    const populateUpdateIssuesModal = (issueData) => {
        // Populate issue ID
        document.getElementById('update-issue-id').value = issueData.issue_id;
        document.getElementById('update-issue-id').innerText = issueData.issue_id

        // Populate issue type
        document.getElementById('update-issue-type').value = issueData.issue_type;

        // Get the select element for issue status
        const issueStatusDropdown = document.getElementById('update-issue-status');

        // Iterate over the options to find and select the one that matches the issue status
        for (let option of issueStatusDropdown.options) {
            if (option.value === issueData.issue_status) {
                option.selected = true;
                break;
            }
        }


        // Populate created by
        document.getElementById('update-raised-by').value = issueData.raised_by;

        // Populate created at
        var dateCreatedAt = formatDate(issueData.raised_at);
        document.getElementById('update-created-at').value = dateCreatedAt;

        // Show updateIssueModal
        // Check if issueDetailsModal is currently displayed
        const issueDetailsModal = $("#updateIssueModal");
        if (issueDetailsModal.hasClass("show")) {
            // If issueDetailsModal is displayed, hide it
            issueDetailsModal.modal("hide");
        }
        $("#updateIssueModal").modal("show");
    };


    const onIssueUpdateButtonClick = async (data) => {
        let issueId = data
        try {
            const response = await fetch(`/asset/getIssueStatus`);
            if (!response.ok) {
                throw new Error('Failed to fetch resolved issues');
            }
            const data = await response.json();
            console.log(' result from getIssueStatus', data.data)
            populateIssueStatusDropdown(data.data);

        } catch (error) {
            console.error('Error fetching resolved issues:', error);
        }
        // Call API to get issue details by ID and populate the updateIssueModal
        try {
            const response = await fetch(`/asset/getIssueDetails/${issueId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch issues details');
            }
            const data = await response.json();
            populateUpdateIssuesModal(data.data[0]);
        } catch (error) {
            console.error('Error fetching resolved issues:', error);
        }
        // Show updateIssueModal
        $("#updateIssueModal").modal("show");
    }




    const populatePendingIssues = (data) => {
        $('#pendingIssueTable').DataTable({
            data: data,
            "columns": [
                { "data": 'issue_id', className: 'dt-body-left' },
                { "data": 'issue_type' },
                { "data": 'asset_category' },
                { "data": 'raised_by' },

                {
                    "data": 'raised_at',
                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data);
                    }
                },


                { "data": 'issue_status' },
                {
                    "data": null,
                    render: function (data, type, row) {
                        if (row.issue_status === 'Resolved') {
                            return '<button type="button" class="btn btn-primary btn-sm view" style="width:70px">View</button> ' +
                                '<button type="button" class="btn btn-success btn-sm update" style="width:70px" disabled>Update</button>';
                        } else {
                            return '<button type="button" class="btn btn-primary btn-sm view" style="width:70px">View</button> ' +
                                '<button type="button" class="btn btn-success btn-sm update" style="width:70px">Update</button>';
                        }
                    }
                }
            ],
            // Add search field on top of the table
            // dom: 'lfrtip',
            scrollY: 'calc(100vh - 200px)', // Adjust the height as needed
            ordering: true,
            paging: true,
            scrollCollapse: true,
            columnDefs: [{ orderable: false, targets: 6 }],
            language: {
                emptyTable: 'No pending issues found',
                paginate: {
                    next: '<i class="fa-solid fa-forward-step"></i>',
                    previous: '<i class="fa-solid fa-backward-step"></i>',
                    first: '<i class="fa-solid fa-angle-double-left"></i>',
                    last: '<i class="fa-solid fa-angle-double-right"></i>'
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
            },
        });


    }
    // Handle click event for view button
    $('#pendingIssueTable tbody').on('click', 'button.view', function () {
        // Get the data of the row clicked
        // if ($.fn.DataTable.isDataTable('#pendingIssueTable')) {
        //     $('#pendingIssueTable').DataTable().destroy();
        // }
        const rowData = $('#pendingIssueTable').DataTable().row($(this).parents('tr')).data();
        // Perform actions for viewing the row data (e.g., display in modal)
        let issueId = rowData.issue_id;
        localStorage.setItem('issueId', issueId);
        localStorage.removeItem('requestId')
        console.log('Viewing data:', rowData);
        window.location.href = '/issueDetails'
    });

    // Handle click event for update button
    $('#pendingIssueTable tbody').on('click', 'button.update', function () {
        // Get the data of the row clicked
        const rowData = $('#pendingIssueTable').DataTable().row($(this).parents('tr')).data();
        console.log(rowData)
        // Perform actions for updating the row data (e.g., open update form)
        // Extract the asset_id from the rowData
        const issueId = rowData.issue_id;
        // Call the function and pass the asset_id
        onIssueUpdateButtonClick(issueId);
        console.log('Updating data:', rowData);
    });



    // Function to populate asset request table
    function populateAssetRequest(data) {
        $('#requestNewAssetTable').DataTable({
            data: data,
            "columns": [
                { "data": 'request_id', className: 'dt-body-left' },
                {
                    "data": null,
                    render: function (data, type, row) {
                        // Check if issue_type exists in the row data
                        if (row.issue_type) {
                            // If it exists, render the issue_type value
                            return row.issue_type;
                        } else {
                            // If it doesn't exist, render your custom text
                            return 'New Asset Request';
                        }
                    }
                },
                { "data": 'asset_category' },
                { "data": 'raised_by' },
                {
                    "data": 'raised_at',
                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data);
                    }
                },
                { "data": 'request_status' },
                {
                    "data": null,
                    render: function (data, type, row) {
                        if (row.request_status === 'Resolved') {
                            return '<button type="button" class="btn btn-primary btn-sm view" style="width:70px">View</button> ' +
                                '<button type="button" class="btn btn-success btn-sm update" style="width:70px" disabled>Update</button>';
                        } else {
                            return '<button type="button" class="btn btn-primary btn-sm view" style="width:70px">View</button> ' +
                                '<button type="button" class="btn btn-success btn-sm update" style="width:70px">Update</button>';
                        }
                    }
                }
            ],
            // Add search field on top of the table
            // dom: 'lfrtip',
            scrollY: 'calc(100vh - 200px)', // Adjust the height as needed
            ordering: true,
            paging: true,
            scrollCollapse: true,
            columnDefs: [{ orderable: false, targets: 6 }],
            language: {
                emptyTable: 'There are no new asset requests found.',
                next: '<i class="fa-solid fa-forward-step"></i>',
                previous: '<i class="fa-solid fa-backward-step"></i>',
                first: '<i class="fa-solid fa-angle-double-left"></i>',
                last: '<i class="fa-solid fa-angle-double-right"></i>'
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

    }

    // Function to populate the dropdown for issue status
    const populateRequestStatusDropdown = (data) => {
        const issueStatusDropdown = document.getElementById('update-request-status');
        issueStatusDropdown.innerHTML = ''; // Clear existing options

        // Add a placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Select Request Status';
        issueStatusDropdown.appendChild(placeholderOption);

        // Create option elements for each issue status
        data.forEach((status, index) => {
            console.log('Status in the request status dropdown: ' + status)
            const option = document.createElement('option');
            option.value = status.issue_status; // Set the value to the issue_status property
            option.textContent = status.issue_status; // Set the text content to the issue_status property
            option.id = `option-${index}`; // Generate unique ID for each option
            issueStatusDropdown.appendChild(option);
        });
    };
    // Function to populate the update issue modal
    const populateRequestupdateModal = (issueData) => {
        // Populate issue ID
        document.getElementById('update-request-id').value = issueData.request_id;
        document.getElementById('update-request-type').value = "New Asset Request"

        // Populate request Vendor


        // Populate issue type
        document.getElementById('update-request-category').value = issueData.asset_category;

        // Get the select element for issue status
        const requestStatusDropdown = document.getElementById('update-request-status');

        // Iterate over the options to find and select the one that matches the issue status
        for (let option of requestStatusDropdown.options) {
            if (option.value === issueData.request_status) {
                option.selected = true;
                break;
            }
        }


        // Populate created by
        document.getElementById('update-request-raised-by').value = issueData.raised_by;

        // Populate created at
        var dateCreatedAt = formatDate(issueData.raised_at);
        document.getElementById('update-request-created-at').value = dateCreatedAt;

        // Show updateIssueModal
        // Check if issueDetailsModal is currently displayed
        const issueDetailsModal = $("#updateRequestModal");
        if (issueDetailsModal.hasClass("show")) {
            // If issueDetailsModal is displayed, hide it
            issueDetailsModal.modal("hide");
        }
        $("#updateRequestModal").modal("show");
    };

    const onRequestUpdateButtonClick = async (data) => {
        let issueId = data
        try {
            const response = await fetch(`/asset/getIssueStatus`);
            if (!response.ok) {
                throw new Error('Failed to fetch resolved issues');
            }
            const data = await response.json();
            console.log(' result from getIssueStatus', data.data)
            populateRequestStatusDropdown(data.data);

        } catch (error) {
            console.error('Error fetching resolved issues:', error);
        }
        try {
            const response = await fetch(`/asset/getRequestDetails/${issueId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch issue data');
            }
            const data = await response.json();
            populateRequestupdateModal(data.data[0]);
        } catch (error) {
            console.error('Error fetching resolved issues:', error);
        }
        // Show issueDetailsModal
        // Check if issueDetailsModal is currently displayed
        const issueDetailsModal = $("#updateIssueModal");
        if (issueDetailsModal.hasClass("show")) {
            // If issueDetailsModal is displayed, hide it
            issueDetailsModal.modal("hide");
        }
        $("#updateRequestModal").modal("show");
    }


    // Handle click event for view button
    $('#requestNewAssetTable tbody').on('click', 'button.view', function () {
        // Get the data of the row clicked
        // if ($.fn.DataTable.isDataTable('#requestNewAssetTable')) {
        //     $('#requestNewAssetTable').DataTable().destroy();
        // }
        const rowData = $('#requestNewAssetTable').DataTable().row($(this).parents('tr')).data();
        // Perform actions for viewing the row data (e.g., display in modal)
        let requestId = rowData.request_id;
        localStorage.removeItem('issueId')
        localStorage.setItem('requestId', requestId);
        console.log('Viewing data:', rowData);
        window.location.href = '/issueDetails'
    });

    // Handle click event for update button
    $('#requestNewAssetTable tbody').on('click', 'button.update', function () {
        // Get the data of the row clicked
        const rowData = $('#requestNewAssetTable').DataTable().row($(this).parents('tr')).data();
        console.log(rowData)
        // Perform actions for updating the row data (e.g., open update form)
        // Extract the asset_id from the rowData
        const requestId = rowData.request_id;
        // Call the function and pass the asset_id
        onRequestUpdateButtonClick(requestId);
        console.log('Updating data:', rowData);
    });


    async function fetchCardData(issueCardId) {
        let apiUrl;
        switch (issueCardId) {
            case "totalAssetIssues":
                apiUrl = "/asset/getTotalAssetIssues";
                document.getElementById('issue-data').innerText = 'Asset Issues & Request';
                break;
            case "pendingIssues":
                apiUrl = "/asset/getTotalPendingIssues";
                document.getElementById('issue-data').innerText = 'Total Pending Issues';
                break;
            case "softwareIssues":
                apiUrl = "/asset/getPendingIssue/Software";
                document.getElementById('issue-data').innerText = 'Pending Software Issues';
                break;
            case "softwareIssues":
                apiUrl = "/asset/getPendingIssue/Software";
                document.getElementById('issue-data').innerText = 'Pending Software Issues';
                break;
            case "hardwareIssues":
                apiUrl = "/asset/getPendingIssue/Hardware";
                document.getElementById('issue-data').innerText = 'Pending Hardware Issues';
                break;
            case "damageIssues":
                apiUrl = "/asset/getPendingIssue/Damage";
                document.getElementById('issue-data').innerText = 'Pending Damage Issues';
                break;
            case "replacementIssues":
                apiUrl = "/asset/getPendingIssue/Replacement";
                document.getElementById('issue-data').innerText = 'Pending Replacement Issues';
                break;
            case "newAssetRequest":
                apiUrl = 'asset/getNewAssetRequest';
                document.getElementById('request-asset-data').innerText = 'Total New Asset Requests';
                break;
            case "desktopRequest":
                apiUrl = 'asset/getCategoryWiseAssetRequest/Desktop';
                document.getElementById('request-asset-data').innerText = 'Pending New Desktop Requests';
                break;
            case "laptopRequest":
                apiUrl = 'asset/getCategoryWiseAssetRequest/Laptop';
                document.getElementById('request-asset-data').innerText = 'Pending New Laptop Requests';
                break;
            case "dongleRequest":
                apiUrl = 'asset/getCategoryWiseAssetRequest/Dongle';
                document.getElementById('request-asset-data').innerText = 'Pending New Dongle Requests';
                break;
            case "mobileRequest":
                apiUrl = 'asset/getCategoryWiseAssetRequest/Mobile';
                document.getElementById('request-asset-data').innerText = 'Pending New Mobile Requests';
                break;


            default:
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cannot get issue data based on card ID'
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

    try {
        if (!issueCardId.includes('Request')) {
            let pendingIssueDetailsData = await fetchCardData(issueCardId)
            if (pendingIssueDetailsData) {
                // Populate the asset details table with the fetched data
                document.getElementById('issueDetails').classList.remove("d-none")
                populatePendingIssues(pendingIssueDetailsData);

            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'info',
                    text: 'No records found'
                }).then(() => {
                    window.location.href = '/trackIssues'

                })
            }
        } else {
            let newAssetRequestDetailsData = await fetchCardData(issueCardId)
            if (newAssetRequestDetailsData) {
                document.getElementById('requestNewAsset').classList.remove("d-none")
                populateAssetRequest(newAssetRequestDetailsData)

            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'info',
                    text: 'No records found'
                }).then(() => {
                    window.location.href = '/trackIssues'

                })
            }
        }

    } catch (error) {
        console.log(`Error fetching issues data `, error);
    }

    const updateIssueForm = document.getElementById('updateIssueForm');
    updateIssueForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(updateIssueForm); // Get form data
        const issueId = document.getElementById('update-issue-id').value; // Get the issue ID
        let user_name = localStorage.getItem('admin_name'); //
        let issue_status = document.getElementById('update-issue-status').value; // Get the selected issue status from the dropdown
        formData.user_name = user_name;
        formData.issue_status = issue_status;
        formData.issue_id = issueId //
        try {
            const response = await fetch(`/asset/updateIssueStatus`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update issue status');
            }

            // Show success swal API
            Swal.fire({ icon: 'success', title: "Success", text: "Issue Updated Successfully!" })
                .then(() => {
                    // Reload the page
                    location.reload();
                });
        } catch (error) {
            console.error('Error updating issue status:', error);

            // Show error swal and reload the page
            Swal.fire({ icon: "error", title: 'Error', text: "Failed to update issue status" })
                .then(() => {
                    // Reload the page
                    location.reload();
                });
        }
    });

    const updaterequestForm = document.getElementById('updateRequestForm');
    updaterequestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // const formData = new FormData(updateIssueForm); // Get form data
        const requestId = document.getElementById('update-request-id').value; // Get the issue ID
        let user_id = localStorage.getItem('admin_id'); //
        let issueStatus = document.getElementById('update-request-status').value; // Get the selected issue status from the dropdown
        let formData = {
            requestId: requestId,
            user_id: user_id,
            issueStatus: issueStatus
        }

        try {
            const response = await fetch(`/asset/updateNewAssetRequest`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update issue status');
            }

            // Show success swal API
            Swal.fire({ icon: 'success', title: "Success", text: "Issue Updated Successfully!" })
                .then(() => {
                    // Reload the page
                    location.reload();
                });
        } catch (error) {
            console.error('Error updating issue status:', error);

            // Show error swal and reload the page
            Swal.fire({ icon: "error", title: 'Error', text: "Failed to update issue status" })
                .then(() => {
                    // Reload the page
                    location.reload();
                });
        }
    });

    // Close modals when clicking on blank space
    $(".modal").on("click", function (e) {
        if ($(e.target).hasClass("modal")) {
            $(this).modal("hide");
        }
    });


})