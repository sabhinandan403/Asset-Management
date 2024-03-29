document.addEventListener('DOMContentLoaded', async () => {
    if ($.fn.DataTable.isDataTable('#issueDetailTable')) {
        $('#issueDetailTable').DataTable().destroy();
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

    let issueId = localStorage.getItem('issueId');
    let requestId = localStorage.getItem('requestId');
    let totalIssuesCardId = localStorage.getItem('totalIssues');
    let user_name = localStorage.getItem("admin_name");
    console.log(user_name);
    document.getElementById('user-name').textContent = `Hi, ${user_name}`;
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
    // try {
    //      issueId = localStorage.getItem('issueId')
    //     if (issueId === undefined) {
    //          requestId = localStorage.getItem('requestId')
    //         if (requestId === undefined) {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: ' Cannot get issue id or new asset request is'
    //             }).then(() => {
    //                 window.location.href = '/pendingIssues';
    //             })
    //         }
    //     }
    // } catch (error) {
    //     console.log('Error in getting issue id or asset request id :', error);
    // }

    // Function to populate asset request table
    function populateIssueDetailTable(data) {
        console.log(data)
        $('#issueDetailTable').DataTable({
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
                { "data": 'issue_description' },
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

            scrollY: 'calc(100vh - 200px)', // Adjust the height as needed
            ordering: true,
            paging: true,
            scrollCollapse: true,
            language: {
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
            }

        });

    }

    // Function to populate asset request table
    function populateRequestDetailTable(data) {
        $('#assetRequestDetailTable').DataTable({
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
                { "data": 'request_description' },
                { "data": 'request_status' },
                { "data": 'raised_by' },
                {
                    "data": 'raised_at',
                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data);
                    }
                },

            ],

            scrollY: 'calc(100vh - 200px)', // Adjust the height as needed
            ordering: true,
            paging: true,
            scrollCollapse: true,
            language: {
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
            }

        });

    }

    if (issueId) {
        document.getElementById('issue-id').innerText = `Issue Details Issue ID : ${issueId}`
        try {

            const response = await fetch(`/asset/getIssueDetails/${issueId}`);
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to fetch issue data');
            }
            const data = await response.json();
            //document.getElementById('requestDetail').style.display = 'none'
            //document.getElementById('issueDetail').style.display = 'block'
            document.getElementById('issueDetail').classList.remove("d-none")
            populateIssueDetailTable(data.data);

        } catch (error) {
            console.error('Error fetching resolved issues:', error);
        }
    } else if (requestId) {
        document.getElementById('request-id').innerText = `Request Detail ${requestId}`;
        // Function to populate request detail table
        try {

            const response = await fetch(`/asset/getRequestDetails/${requestId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch issue data');
            }
            const data = await response.json();
            //document.getElementById('issueDetail').style.display = 'none'
            //document.getElementById('requestDetail').style.display = 'block'
            document.getElementById('requestDetail').classList.remove("d-none")
            populateRequestDetailTable(data.data);

        } catch (error) {
            console.error('Error fetching resolved issues:', error);
        }
    } else if (totalIssuesCardId) {

    }


    else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error in fetching data based on issueId or requestId'
        }).then(() => {
            window.location.href = '/pendingIssues'
        })

    }


});