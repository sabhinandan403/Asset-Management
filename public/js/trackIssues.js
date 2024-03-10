document.addEventListener('DOMContentLoaded', () => {
    let previousPendingSoftwareIssueCount = 0; // Variable to store the previous length of pending issues data
    let previousPendingHardwareIssueCount = 0; // Variable to store the previous length of pending issues data
    let previousPendingDamageIssueCount = 0; // Variable to store the previous length of pending issues data
    let previousPendingReplacementIssueCount = 0;
    let previousNewAssetRequestCount = 0; // Variable to store the previous length of pending issues data
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
                populateCards(data.data); // Refresh the table
                previousPendingSoftwareIssueCount = data.data.total_software_issues; // Update the previous length
                previousPendingHardwareIssueCount = data.data.total_hardware_issues
                previousPendingDamageIssueCount = data.data.total_damage_issues
                previousPendingReplacementIssueCount = data.data.total_replacement_issues
                previousNewAssetRequestCount = data.data.total_asset_requests
                flag = true
            }
            else if (data.data.total_software_issues !== previousPendingSoftwareIssueCount ||
                data.data.total_hardware_issues !== previousPendingHardwareIssueCount ||
                data.data.total_damage_issues !== previousPendingDamageIssueCount ||
                data.data.total_replacement_issues !== previousPendingReplacementIssueCount ||
                data.data.total_asset_requests !== previousNewAssetRequestCount ) {
                populateCards(data.data); // Refresh the table
                alertCount = (parseInt(data.data.total_software_issues) - parseInt(previousPendingSoftwareIssueCount)) + (parseInt(data.data.total_hardware_issues) - parseInt(previousPendingHardwareIssueCount)) + (parseInt(data.data.total_damage_issues) - parseInt(previousPendingDamageIssueCount)) + (parseInt(data.data.total_replacement_issues) - parseInt(previousPendingReplacementIssueCount)+(parseInt(data.data.total_asset_requests) -parseInt(previousNewAssetRequestCount)))
                document.getElementById('issue-number').innerText = alertCount
                if (alertCount != 0) {
                    alert('New request is raised ')
                }
                previousPendingSoftwareIssueCount = data.data.total_software_issues; // Update the previous length
                previousPendingHardwareIssueCount = data.data.total_hardware_issues
                previousPendingDamageIssueCount = data.data.total_damage_issues
                previousPendingReplacementIssueCount = data.data.total_replacement_issues
                previousNewAssetRequestCount = data.data.total_asset_requests

            }
        } catch (error) {
            console.error('Error fetching pending issues:', error);
        }
    };

    const getResolvedIssues = async () => {
        try {
            const response = await fetch('/asset/getResolvedIssue');
            if (!response.ok) {
                throw new Error('Failed to fetch resolved issues');
            }
            const data = await response.json();
            populateResolvedIssues(data.data);
        } catch (error) {
            console.error('Error fetching resolved issues:', error);
        }
    };

    function populateCards(data) {
        // Update total assets
        document.getElementById("totalSoftwareIssues").innerText = data.total_software_issues;

        // Update allocated assets
        document.getElementById("totalHardwareIssues").innerText = data.total_hardware_issues;

        // Update unallocated assets
        document.getElementById("totalDamageIssues").innerText = data.total_damage_issues;

        // Update laptop assets
        document.getElementById("totalReplacementIssues").innerText = data.total_replacement_issues;

        // Update request assets
        document.getElementById("newAssetRequestIssues").innerText = data.total_asset_requests;

    }


    async function fetchCardData(cardId) {
        let apiUrl;
        switch (cardId) {
            case "softwareIssues":
                apiUrl = "/asset/getPendingIssue/Software";
                break;
            case "hardwareIssues":
                apiUrl = "/asset/getPendingIssue/Hardware";
                break;
            case "damageIssues":
                apiUrl = "/asset/getPendingIssue/Damage";
                break;
            case "replacementIssues":
                apiUrl = "/asset/getPendingIssue/Replacement";
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Record Not Found'
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

    async function fetchAssetRequestData(cardId) {
        let apiUrl;
        apiUrl = 'asset/getNewAssetRequest'

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


    //Get the container element that holds all the cards
    var cardBodies = document.querySelectorAll('.card');

    // Iterate over each card and add event listener
    // Iterate over each card body and add event listener
    cardBodies.forEach(function (cardBody) {
        cardBody.addEventListener("click", async function (event) {
            // Get the parent card element of the clicked card body
            const card = cardBody.closest('.card');

            // Fetch data based on the card ID
            if (card) {
                const cardId = card.id;
                if (cardId === 'newAssetRequest') {
                    localStorage.setItem('issueCardId','newAssetRequest');  //
                    window.location.href = '/pendingIssueDetails'
                    var assetRequestData = await fetchAssetRequestData(cardId)
                    
                    if (assetRequestData){
                        populateAssetRequest(assetRequestData)
                    }
                } else {
                    localStorage.setItem('issueCardId',`${card.id}`);
                    window.location.href = '/pendingIssueDetails'
                    const data = await fetchCardData(cardId);
                    if (data) {
                        // Populate the asset details table with the fetched data
                        populatePendingIssues(data);

                        // Show the modal or perform any other action as needed
                        //$("#assetDetailsModal").modal("show");
                    }
                }
            }
        });
    });

    const populateAssetRequest = (data) => {
        const requestAssetTableBody = document.querySelector('#request-asset-table tbody');
        requestAssetTableBody.innerHTML = ''; // Clear existing rows

        if (data.length === 0) {
            // If no data is available, create and append a row with a message
            const row = document.createElement('tr');
            const messageCell = document.createElement('td');
            messageCell.colSpan = 7; // Span across all columns
            messageCell.textContent = 'No data found';
            row.appendChild(messageCell);
            requestAssetTableBody.appendChild(row);
        } else {
            data.forEach(issue => {
                const row = document.createElement('tr');

                const issueIdCell = document.createElement('td');
                issueIdCell.textContent = issue.request_id;
                row.appendChild(issueIdCell);

                const issueTypeCell = document.createElement('td');
                issueTypeCell.textContent = "New Asset Request";
                row.appendChild(issueTypeCell);

                const assetCategoryCell = document.createElement('td');
                assetCategoryCell.textContent = issue.asset_category;
                row.appendChild(assetCategoryCell);

                const assetVendorCell = document.createElement('td');
                assetVendorCell.textContent = issue.asset_vendor;
                row.appendChild(assetVendorCell);

                const raisedByCell = document.createElement('td');
                raisedByCell.textContent = issue.raised_by;
                row.appendChild(raisedByCell);

                var raisedAt = formatDate(issue.raised_at)
                const raisedAtCell = document.createElement('td');
                raisedAtCell.textContent = raisedAt;
                row.appendChild(raisedAtCell);

                const issueStatusCell = document.createElement('td');
                issueStatusCell.textContent = issue.request_status;
                row.appendChild(issueStatusCell);

                const actionCell = document.createElement('td');
                const updateButton = document.createElement('button');
                updateButton.classList.add('btn', 'btn-success', 'update-request-modal');
                updateButton.textContent = 'Update';
                updateButton.dataset.issueId = issue.request_id;
                updateButton.dataset.bsToggle = 'modal';
                updateButton.dataset.bsTarget = '#updateRequestModal';
                actionCell.appendChild(updateButton);

                row.appendChild(actionCell);

                requestAssetTableBody.appendChild(row);
            });
        }

        $("#requestAssetIssueDetails").modal("show");
    };

    const populatePendingIssues = (data) => {
        const pendingIssuesTableBody = document.querySelector('#pending-issues-table tbody');
        pendingIssuesTableBody.innerHTML = ''; // Clear existing rows

        if (data.length === 0) {
            // If no data is available, create and append a row with a message
            const row = document.createElement('tr');
            const messageCell = document.createElement('td');
            messageCell.colSpan = 7; // Span across all columns
            messageCell.textContent = 'No data found';
            row.appendChild(messageCell);
            pendingIssuesTableBody.appendChild(row);
        } else {
            data.forEach(issue => {
                const row = document.createElement('tr');

                const issueIdCell = document.createElement('td');
                issueIdCell.textContent = issue.issue_id;
                row.appendChild(issueIdCell);

                const issueTypeCell = document.createElement('td');
                issueTypeCell.textContent = issue.issue_type;
                row.appendChild(issueTypeCell);

                const assetCategoryCell = document.createElement('td');
                assetCategoryCell.textContent = issue.asset_category;
                row.appendChild(assetCategoryCell);

                const raisedByCell = document.createElement('td');
                raisedByCell.textContent = issue.raised_by;
                row.appendChild(raisedByCell);

                var raisedAt = formatDate(issue.raised_at)
                const raisedAtCell = document.createElement('td');
                raisedAtCell.textContent = raisedAt;
                row.appendChild(raisedAtCell);

                const issueStatusCell = document.createElement('td');
                issueStatusCell.textContent = issue.issue_status;
                row.appendChild(issueStatusCell);

                const actionCell = document.createElement('td');
                const viewButton = document.createElement('button');
                viewButton.classList.add('btn', 'btn-primary', 'view-issue');
                viewButton.textContent = 'View';
                viewButton.dataset.issueId = issue.issue_id;
                viewButton.dataset.bsToggle = 'modal';
                viewButton.dataset.bsTarget = '#issueDetailsModal';
                actionCell.appendChild(viewButton);

                const updateButton = document.createElement('button');
                updateButton.classList.add('btn', 'btn-success', 'update-issue-status');
                updateButton.textContent = 'Update';
                updateButton.dataset.issueId = issue.issue_id;
                updateButton.dataset.bsToggle = 'modal';
                updateButton.dataset.bsTarget = '#updateIssueModal';
                actionCell.appendChild(updateButton);

                row.appendChild(actionCell);

                pendingIssuesTableBody.appendChild(row);
            });
        }

        $("#typewiseIssueDetails").modal("show");
    };

    

    const populateResolvedIssues = (data) => {
        $('#resolved-issues-table').DataTable({
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
                { "data": 'modified_by' },
                {
                    "data": 'modified_at',
                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data);
                    }
                },
                
                
                
            ],

            scrollY: 'calc(100vh - 200px)', // Adjust the height as needed
            ordering: true,
            paging: false,
            scrollCollapse: true,
            language:{
                emptyTable: 'No resolved issues record found',
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
    };

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
    getPendingIssuesCount();
    getResolvedIssues();

    // Set interval to fetch pending issues every 10 seconds
    setInterval(getPendingIssuesCount, 10000);


    
    
    // Close modals when clicking on blank space
    $(".modal").on("click", function (e) {
        if ($(e.target).hasClass("modal")) {
            $(this).modal("hide");
        }
    });
});
