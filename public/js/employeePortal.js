document.addEventListener('DOMContentLoaded', () => {
    if ($.fn.DataTable.isDataTable('#asset-table')) {
        $('#asset-table').DataTable().destroy();
    }

    var userName = localStorage.getItem('employee_name');
    document.getElementById('user-name').innerText = `Hi, ${userName}`;


    // Function to populate the Allocated Assets table
    const populateAllocatedAssetsTable = async () => {
        try {
            const userId = localStorage.getItem('employee_id');
            console.log(userId) // Assuming you have a function to get the user ID
            const response = await fetch(`/asset/getEmployeeAssets/${userId}`);
            //console.log('response for assets is ', response.json().data)
            if (!response.ok) {
                if (response.status === 401) {
                    let data = []
                    //console.log(data.length)
                    populateAssetTable(data)
                } else {
                    throw new Error('Failed to fetch allocated assets');
                }
            }
            const data = await response.json();
            // if ($.fn.DataTable.isDataTable('#asset-table')) {
            //     $('#asset-table').DataTable().destroy();
            // }

            populateAssetTable(data.data);
            // Add report issue button to each row
            //addReportIssueButton();
        } catch (error) {
            console.error('Error fetching allocated assets:', error);
        }
    };

    // Function to check for status changes
    // Function to check for status changes
    const checkForStatusChanges = (currentData) => {
        currentData.forEach(currentIssue => {
            const previousIssueIndex = previousStatuses.findIndex(prev => prev.issueId === currentIssue.issue_id);
            if (previousIssueIndex !== -1) {
                const previousIssue = previousStatuses[previousIssueIndex];
                if (previousIssue.issueStatus !== currentIssue.issue_status) {
                    // Update issue status in previousStatuses array
                    previousStatuses[previousIssueIndex].issueStatus = currentIssue.issue_status;
                    // Display alert for status change
                    document.getElementById('issue-number').innerText = '1';
                    alert(`Issue ${currentIssue.issue_id} status has changed to ${currentIssue.issue_status}`);
                }
            }
        });
    };

    // Initialize array to store issue IDs and statuses
    let previousStatuses = [];

    // Flag to indicate first time loading data
    let isFirstLoad = true;

    // Function to populate the Asset Issues table
    const populateAssetIssuesTable = async () => {
        try {
            const userId = localStorage.getItem('employee_id'); // Assuming you have a function to get the user ID
            const response = await fetch(`/asset/getEmployeeIssueData/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch asset issues');
            }
            const data = await response.json();

            // If not the first load, check for status changes
            if (!isFirstLoad) {
                checkForStatusChanges(data.data);
            } else {
                isFirstLoad = false;
            }
            // if ($.fn.DataTable.isDataTable('#issues-table')) {
            //     $('#issues-table').DataTable().destroy();
            // }
            populateIssueTable(data.data);
            // Update previousStatuses array
            data.data.forEach(issue => {
                previousStatuses.push({
                    issueId: issue.issue_id,
                    issueStatus: issue.issue_status
                });
            });

        } catch (error) {
            console.error('Error fetching asset issues:', error);
        }

    };



    // Function to populate the Issue Type dropdown
    const populateIssueTypeDropdown = async () => {
        try {
            const response = await fetch('/asset/getIssueType');
            if (!response.ok) {
                throw new Error('Failed to fetch issue types');
            }
            const data = await response.json();
            const selectElement = document.getElementById('reportIssueType');
            // Clear existing options
            selectElement.innerHTML = '<option value="" disabled selected>Select Issue Type</option>';
            // Populate dropdown with issue types
            data.data.forEach(type => {
                const option = document.createElement('option');
                option.value = type.issue_type;
                option.textContent = type.issue_type;
                option.id = type.issue_type;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching issue types:', error);
        }
    };

    // Populate Allocated Assets table on page load
    populateAllocatedAssetsTable();

    // Populate Asset Issues table on page load
    populateAssetIssuesTable();

    setInterval(populateAssetIssuesTable, 10000);

    // Populate Issue Type dropdown on page load
    populateIssueTypeDropdown();


    // Add event listener to Report Issue form submission
    const reportIssueForm = document.getElementById('reportIssueForm');
    reportIssueForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(reportIssueForm);
        var user_name = localStorage.getItem('employee_name');
        var user_id = localStorage.getItem('employee_id');
        var reportAssetID = document.getElementById('reportAssetId').value
        var reportAssetCategory = document.getElementById('reportAssetCategory').value
        var reportIssueType = document.getElementById('reportIssueType').value
        var reportIssueDescription = document.getElementById('reportIssueDescription').value

        formData.user_name = user_name;
        formData.reportAssetID = reportAssetID
        formData.reportAssetCategory = reportAssetCategory
        formData.reportIssueType = reportIssueType
        formData.reportIssueDescription = reportIssueDescription
        formData.user_id = user_id

        try {
            const response = await fetch('/asset/reportIssue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to report issue');
            }
            Swal.fire({ icon: "success", title: "Success", text: "Issue reported successfully!" })
                .then(() => {
                    location.reload();
                });
        } catch (error) {
            console.error('Error reporting issue:', error);
            Swal.fire({ title: "Error!", text: "Failed to report issue", icon: "error" })
                .then(() => {
                    location.reload();
                });
        }
    });

    // Add event listener to Request New Asset button in navbar
    const requestAssetButton = document.getElementById('add-asset');
    requestAssetButton.addEventListener('click', () => {
        $('#requestAssetModal').modal('show');
    });

    // Populate Request New Asset modal dropdowns on page load
    const populateRequestAssetDropdowns = async () => {
        try {
            // Populate Asset Category dropdown
            const categoryResponse = await fetch('/asset/getCategoryType');
            if (!categoryResponse.ok) {
                throw new Error('Failed to fetch asset categories');
            }
            const categoryData = await categoryResponse.json();
            populateAssetCategoryDropdown('#requestAssetCategory', categoryData.data);

        } catch (error) {
            console.error('Error fetching asset dropdown data:', error);
        }
    };

    var vendorData = []


    const populateAssetCategoryDropdown = (selector, data) => {
        const dropdown = document.querySelector(selector);
        dropdown.innerHTML = '<option value="" disabled selected>Select...</option>';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.asset_category;
            option.textContent = item.asset_category;
            dropdown.appendChild(option);
        });
    };

    // Populate Request New Asset modal dropdowns on page load
    populateRequestAssetDropdowns();

    // Add event listener to the asset category dropdown
    // let assetCategoryDropdown = document.getElementById('requestAssetCategory');
    // assetCategoryDropdown.addEventListener('change', () => {
    //     const selectedAssetCategory = assetCategoryDropdown.value;

    //     // Filter the vendor data array based on the selected category
    //     const filteredVendors = vendorData.filter(vendor => vendor.category === selectedAssetCategory);
    //     const assetVendorsDropdown = document.getElementById('requestAssetVendor');

    //     // Clear existing options
    //     assetVendorsDropdown.innerHTML = '';


    //     // Create placeholder option
    //     const placeholderOption = document.createElement('option');
    //     placeholderOption.value = "";
    //     placeholderOption.textContent = 'Select Asset Vendors';
    //     placeholderOption.disabled = true;
    //     placeholderOption.selected = true; // Select the placeholder option by default
    //     assetVendorsDropdown.appendChild(placeholderOption);

    //     // Iterate through each asset status and create an option element
    //     filteredVendors.forEach(vendor => {
    //         const option = document.createElement('option');
    //         option.value = vendor.name;
    //         option.textContent = vendor.name;
    //         assetVendorsDropdown.appendChild(option);
    //     });
    // });

    // Add event listener to Request New Asset form submission
    const requestAssetForm = document.getElementById('requestAssetForm');
    requestAssetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        //const formData = new FormData(requestAssetForm);
        //let assetVendor = document.getElementById('requestAssetVendor').value;
        let assetCategory = document.getElementById('requestAssetCategory').value;
        let requestDescription = document.getElementById('requestAssetDescription').value;
        let user_id = localStorage.getItem('employee_id');
        let formData = {
            //assetVendor: assetVendor,
            requestDescription: requestDescription,
            assetCategory: assetCategory,
            user_id: user_id
        }

        try {
            const response = await fetch('/asset/requestNewAsset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to request new asset');
            }
            Swal.fire({ title: "Success!", text: "Asset requested successfully!", icon: "success" })
                .then(() => {
                    location.reload();
                });
        } catch (error) {
            console.error('Error requesting new asset:', error);
            Swal.fire({ title: "Error!", text: "Failed to request new asset", icon: "error" })
                .then(() => {
                    location.reload();
                });
        }
    });
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


    const populateAssetTable = (data) => {
        console.log('allocated assets data is :', data)
        var dataTable = $.fn.DataTable.isDataTable('#asset-table') ?
        $('#table').DataTable().clear().rows.add(data).draw() :
        $('#asset-table').DataTable({
            data: data,
            "columns": [
                { "data": 'asset_id', className: 'dt-body-left' },
                { "data": 'asset_category' },
                { "data": 'asset_vendor' },
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
                        return '<button type="button" class="btn btn-primary btn-sm update">Report Issue</button>';
                    }
                }


            ],
            // Add search field on top of the table
            // dom: 'lfrtip',

            scrollY: '100px', // Adjust the height as needed
            ordering: true,
            paging: true,
            scrollCollapse: true,
            responsive: true,
            columnDefs: [{ orderable: false, targets: 4 }],
            language:{
                emptyTable: 'No asset is allocated' ,
                paginate: {
                    next: '<i class="fa-solid fa-forward-step"></i>',
                    previous: '<i class="fa-solid fa-backward-step"></i>',
                    first: '<i class="fa-solid fa-angle-double-left"></i>',
                    last: '<i class="fa-solid fa-angle-double-right"></i>'
                }
            },
           
            lengthMenu:[2,4],
            pageLength: 2,
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

    // Handle click event for update button
    $('#asset-table tbody').on('click', 'button.update', function () {
        // Get the data of the row clicked
        const rowData = $('#asset-table').DataTable().row($(this).parents('tr')).data();
        console.log(rowData)
        // Perform actions for updating the row data (e.g., open update form)
        // Extract the asset_id from the rowData
        const assetId = rowData.asset_id;
        const assetCategory = rowData.asset_category;
        document.getElementById('reportAssetId').value = assetId;
        document.getElementById('reportAssetCategory').value = assetCategory;
        $('#reportIssueModal').modal('show');
        // Call the function and pass the asset_id
        //onUpdateButtonClick(assetId);
        console.log('Updating data:', rowData);
    });

    let issueFlag = false;


    const populateIssueTable = (data) => {

        var dataTable = $.fn.DataTable.isDataTable('#issues-table') ?
        $('#issues-table').DataTable().clear().rows.add(data).draw() :


        $('#issues-table').DataTable({
            data: data,
            "columns": [
                { "data": 'issue_id', className: 'dt-body-left' },
                { "data": 'issue_type' },
                { "data": 'asset_category' },
                {
                    "data": 'raised_at',
                    "width": "10%",
                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data);
                    }
                },


                { "data": 'issue_status' },

                { "data": 'modified_by' },
                {
                    "data": 'modified_at',

                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data);
                    }
                },


            ],
            // Add search field on top of the table
            // dom: 'lfrtip',

            scrollY: '150px', // Adjust the height as needed
            ordering: true,
            paging: true,
            scrollCollapse: true,
            responsive: true,
            retrieve: true,
            language:{
                emptyTable: 'No issue record found',
                paginate: {
                    next: '<i class="fa-solid fa-forward-step"></i>',
                    previous: '<i class="fa-solid fa-backward-step"></i>',
                    first: '<i class="fa-solid fa-angle-double-left"></i>',
                    last: '<i class="fa-solid fa-angle-double-right"></i>'
                }
            },
            
            lengthMenu : [3,5,7],
            pageLength: 3,

        });

        //$('#issues-table').DataTable().draw();

    };

    $(".modal").on("click", function (e) {
        if ($(e.target).hasClass("modal")) {
            $(this).modal("hide");
        }
    });
});

