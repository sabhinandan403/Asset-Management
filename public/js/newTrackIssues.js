

document.addEventListener('DOMContentLoaded', function () {
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
                populateCards(data.data);
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

                populateCards(data.data); // Refresh the table
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

    function populateCards(data) {

        //main first block
        document.getElementById("totalIssues").innerText = data.total_issues_count;
        document.getElementById("totalPendingIssues").innerText = data.total_pending_issues;
        document.getElementById("totalNewRequest").innerText = data.total_request_count;

        //mmain second block
        // Update total assets
        document.getElementById("totalSoftwareIssues").innerText = data.total_software_issues;

        // Update allocated assets
        document.getElementById("totalHardwareIssues").innerText = data.total_hardware_issues;

        // Update unallocated assets
        document.getElementById("totalDamageIssues").innerText = data.total_damage_issues;

        // Update laptop assets
        document.getElementById("totalReplacementIssues").innerText = data.total_replacement_issues;

        //Main third block
        document.getElementById("totalDesktopRequest").innerText = data.total_desktop_request;
        document.getElementById("totalLaptopRequest").innerText = data.total_laptop_request;
        document.getElementById("totalDongleRequest").innerText = data.total_dongle_request;
        document.getElementById("totalMobileRequest").innerText = data.total_mobile_request;
    }

    getPendingIssuesCount();
    //getResolvedIssues();

    // Set interval to fetch pending issues every 10 seconds
    setInterval(getPendingIssuesCount, 10000);

    // Add click event listeners to the cards in the first main block
    document.querySelectorAll('#totalAssetIssues, #pendingIssues, #newAssetRequest').forEach(function (card) {
        card.addEventListener('click', function () {
            // Save the card ID in localStorage
            localStorage.setItem('issueCardId', card.id);

            // Redirect to the issueDetails page
            window.location.href = '/pendingIssueDetails';
        });
    });

    // Add click event listeners to the cards in the second main block
    document.querySelectorAll('#softwareIssues, #hardwareIssues, #damageIssues, #replacementIssues').forEach(function (card) {
        card.addEventListener('click', function () {
            // Save the card ID in localStorage
            localStorage.setItem('issueCardId', card.id);

            // Redirect to the issueDetails page
            window.location.href = '/pendingIssueDetails';
        });
    });

    // Add click event listeners to the cards in the third main block
    document.querySelectorAll('#desktopRequest, #laptopRequest, #dongleRequest, #mobileRequest').forEach(function (card) {
        card.addEventListener('click', function () {
            // Save the card ID in localStorage
            localStorage.setItem('issueCardId', card.id);

            // Redirect to the issueDetails page
            window.location.href = '/pendingIssueDetails';
        });
    });
});
