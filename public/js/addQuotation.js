document.addEventListener('DOMContentLoaded', async () => {
    if ($.fn.DataTable.isDataTable('#quotation-table')) {
        $('#quotation-table').DataTable().destroy();
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
    document.getElementById('user-name').textContent = `Hi, ${user_name}`

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

    // Function to populate asset request table
    function populateVendorQuotationTable(data) {
        $('#quotation-table').DataTable({
            data: data,
            "columns": [
                { "data": 'vendor_id', className: 'dt-body-left' },
                { "data": 'vendor_name' },
                { "data": 'asset_category' },
                { "data": 'vendor_price', className: 'dt-body-left' },
                { "data": 'added_by' },
                {
                    "data": 'added_at',
                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data);
                    }
                },

                {
                    "data": null,
                    render: function (data, type, row) {
                        let updateButton = '<button type="button" class="btn btn-primary btn-sm update-details" style="margin-left:3px;color:white" data-vendor-id="' + row.vendor_id + '">Update Details</button>';
                        if (Object.keys(data.quotation_url).length === 0) {
                            return '<button type="button" class="cloudinary-button btn btn-success btn-sm update" style="width:fit-content; background-color:rgb(75, 156, 75);border:0.8px;padding:5px;height:30px;">Add Quotation</button>' + updateButton+
                                '<button type="button" class="btn btn-primary btn-sm view" style="width:112px; margin-left:3px" hidden>View</button> ' 
                                ;
                        } else {
                            return '<button type="button" class="cloudinary-button btn btn-success btn-sm update" style="width:fit-content; background-color:rgb(75, 156, 75);border:0.8px;padding:5px;height:30px;">Add Quotation</button>' + updateButton+
                                '<button type="button" class="btn btn-primary btn-sm view" style="width:112px;  margin-left:3px">View</button> ' ;

                        }
                    }
                }

            ],

            scrollY: 'calc(100vh - 200px)', // Adjust the height as needed
            ordering: true,
            paging: true,
            scrollCollapse: true,
            searching: true,
            language: {
                paginate: {
                    next: '<i class="fa-solid fa-forward-step"></i>',
                    previous: '<i class="fa-solid fa-backward-step"></i>',
                    first: '<i class="fa-solid fa-angle-double-left"></i>',
                    last: '<i class="fa-solid fa-angle-double-right"></i>'
                }
            },
            pageLength: 10,
            lengthMenu: [10, 12, 15],
            columnDefs: [{ orderable: false, targets: 6 }],
            drawCallback: function (settings) {
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
    $('#quotation-table tbody').on('click', 'button.view', function () {
        // Get the data of the row clicked
        // if ($.fn.DataTable.isDataTable('#assetHistoryTable')) {
        //     $('#assetHistoryTable').DataTable().destroy();
        // }
        const rowData = $('#quotation-table').DataTable().row($(this).parents('tr')).data();
        // Perform actions for viewing the row data (e.g., display in modal)
        let vendorId = rowData.vendor_id;
        localStorage.setItem('vendorId', vendorId);

        window.location.href = '/quotationDetails'
    });

    let vendorID
    // Handle click event for update button
    $('#quotation-table tbody').on('click', 'button.update', async function () {
        // Get the data of the row clicked
        const rowData = $('#quotation-table').DataTable().row($(this).parents('tr')).data();
        console.log(rowData)
        // Perform actions for updating the row data (e.g., open update form)
        // Extract the asset_id from the rowData
        const vendorId = rowData.vendor_id;
        vendorID = vendorId
        // Call the function and pass the asset_id
        await onUpdateButtonClick(vendorId)
        // .then((fileCount) => {
        //     console.log('Final fileCount is :', fileCount)
        //     if (fileCount > 0) {
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Success',
        //             text: 'File uploaded successfully'
        //         })
        //     }
        // });
        console.log('Updating data:', rowData);
    });
    let quotation_url = {}
    let quotation_filename = {}
    let fileCount = 0

    var widget = cloudinary.createUploadWidget({
        cloudName: 'dfgpafstm',
        uploadPreset: 'zseaaimx',
        sources: ['local', 'url'],
        multiple: true,
        showCompletedButton: true,
        showUploadMoreButton: true,
        clientAllowedFormats: ['pdf', 'doc', 'docx'], // Specify the allowed formats here
        showInsecurePreview: true, // Specify the allowed formats here
        //inlineContainer: '#myModal',
        resourceType: 'auto',
    }, (error, result) => {
        if (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while uploading files!',
            });
        } else if (result && result.event === "success") {
            console.log('Done uploading..: ', result.info);
            console.log('Done uploading..: ', result.info.url);
            fileCount = fileCount + 1;
            console.log('fileCount in the widget ', fileCount);

            // Store the URL and filename with fileCount as key
            quotation_url[fileCount] = result.info.url;
            let format = result.info.format ? result.info.format : 'docx';
            quotation_filename[fileCount] = result.info.original_filename + '.' + format;
            //quotation_filename[fileCount] = result.info.original_filename;
        } else if (result && result.event === "close") {
            // Call the insertQuotationUrl function
            insertQuotationUrl(vendorID, quotation_url, quotation_filename);
        } else if (result && result.event === "abort") {
            location.reload();
        }
    });

    // Function to insert quotation URL and filename
    async function insertQuotationUrl(vendorId, quotation_url, quotation_filename) {
        // Implement this function to insert the quotation URL and filename into the database
        console.log('Inserting quotation URLs and filenames into the database...');
        console.log('Vendor ID:', vendorId);
        console.log('Quotation URLs:', quotation_url);
        console.log('Quotation Filenames:', quotation_filename);
        let vendorDetails = {
            vendorID: vendorId,
            quotation_url: quotation_url,
            quotation_filename: quotation_filename
        }

        try {
            const response = await fetch(`/insertQuotationDetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vendorDetails)
            })
            if (response.ok) {
                const data = await response.json();
                console.log('Insert vendor quotation details are successfully :', data.data)
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'File Uploaded Successfully'
                }).then(() => {
                    location.reload();
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'File Upload Failed'
                }).then(() => {
                    location.reload();
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error uploading quotation file'
            });
            //setTimeout(() => window.location.reload(), 2000);
            console.error('Error uploading quotation files:', error);
        }
    }



    async function onUpdateButtonClick(vendorId) {
        vendorId = vendorId

        await widget.open();
        console.log('fileCount in function onUpdateButtonClick ', fileCount)
        return fileCount

        // Call update asset_vendor_master table for inserting urls, filename and delete_token 
    }

    // Function to populate the update vendor details modal
    function populateUpdateVendorModal(data) {
        // Populate modal with vendor details
        document.getElementById('vendorId').value = data.vendor_id;
        document.getElementById('vendorName').value = data.vendor_name;
        document.getElementById('assetCategory').value = data.asset_category;
        document.getElementById('vendorAssetPrice').value = data.vendor_price;
        document.getElementById('vendorAddress').value = data.vendor_address;
        document.getElementById('vendorContactNumber').value = data.vendor_contact_number;
        document.getElementById('vendorEmail').value = data.vendor_email;
    
        // Show the modal
        //document.getElementById('updateVendorModal').classList.add('show');
        $('#updateVendorModal').modal('show');
    }
    // Add click event listener for "Update Details" button
    $('#quotation-table').on('click', '.update-details', async function () {
        const vendorId = $(this).data('vendor-id');

        try {
            const response = await fetch(`/getVendorDetails/${vendorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            if (response.ok) {
                // Asset updated successfully
                console.log('Vendors Data fetched successfully');

                const data = await response.json();
                console.log(data.data)

                populateUpdateVendorModal(data.data[0]);


            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch vendor details'
                });
                setTimeout(() => window.location.reload(), 2000);
                throw new Error('Failed to update asset');
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
            // Optionally, you can display an error message to the user
        }
    });

    document.getElementById('updateVendorBtn').addEventListener('click', async function (event) {
        var vendorId = document.getElementById('vendorId').value
        var vendorAssetPrice = document.getElementById('vendorAssetPrice').value;
        var vendorAddress = document.getElementById('vendorAddress').value;
        var vendorContactNumber = document.getElementById('vendorContactNumber').value;;
        var vendorEmail = document.getElementById('vendorEmail').value

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

        if (vendorAssetPrice <= 0) {
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

        // Validate contact number length
        const contactNumberRegex = /^\d{10}$/;
        if (!contactNumberRegex.test(vendorContactNumber)) {
            // If the contact number doesn't match the regex pattern
            console.error('Invalid contact number');
            // Optionally, you can show a Swal.fire error message
            Swal.fire({
                icon: 'error',
                title: 'Invalid Contact Number',
                text: 'Contact number should be a 10-digit number with no special characters and alphabets.',
            });
            return
        }

        var body = {
            vendorId : vendorId,
            vendorAssetPrice:vendorAssetPrice,
            vendorAddress:vendorAddress,
            vendorContactNumber:vendorContactNumber,
            vendorEmail:vendorEmail
        }


        try{
            const response = await fetch(`/updateVendorDetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
    
            });
            if (response.ok) {
                // Vendor updated successfully
                console.log('Vendors Data updated successfully');
                Swal.fire({
                    icon:'success',
                    title:'Success',
                    text:'Vendors Data Updated Successfully'
                }).then(()=>{
                    location.reload();
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update vendor details'
                });
                setTimeout(() => window.location.reload(), 2000);
                throw new Error('Failed to update asset');
            }
        }catch(error){
            Swal.fire({
                icon:'error',
                title:'Error',
                text:'Error updating vendor details'
            }).then(()=>{
                location.reload();
            })
        }
    })

    try {
        const response = await fetch(`/getVendorDetails`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });
        if (response.ok) {
            // Asset updated successfully
            console.log('Vendors Data fetched successfully');

            const data = await response.json();
            console.log(data.data)

            populateVendorQuotationTable(data.data);


        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch vendor details'
            });
            setTimeout(() => window.location.reload(), 2000);
            throw new Error('Failed to update asset');
        }
    } catch (error) {
        console.error('Error fetching vendors:', error);
        // Optionally, you can display an error message to the user
    }
























});