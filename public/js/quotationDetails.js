document.addEventListener('DOMContentLoaded', async () => {
  if ($.fn.DataTable.isDataTable('#quotation-details-table')) {
    $('#quotation-details-table').DataTable().destroy()
  }

  let previousTotalIssuesCount = 0
  let previousPendingIssuesCount = 0
  let previousPendingSoftwareIssueCount = 0 // Variable to store the previous length of pending issues data
  let previousPendingHardwareIssueCount = 0 // Variable to store the previous length of pending issues data
  let previousPendingDamageIssueCount = 0 // Variable to store the previous length of pending issues data
  let previousPendingReplacementIssueCount = 0 // Variable to store the previous length of pending issues data
  let previousNewAssetRequestCount = 0
  let previousPendingLaptopRequestCount = 0 // Variable to store the previous length of pending request data
  let previousPendingDesktopRequestCount = 0 // Variable to store the previous length of pending request data
  let previousPendingDongleRequestCount = 0 // Variable to store the previous length of pending request data
  let previousPendingMobileRequestCount = 0// Variable to store the previous length of pending request data
  let flag = false
  let alertCount = 0
  var userName = localStorage.getItem('admin_name')
  document.getElementById('user-name').innerText = `Hi, ${userName}`
  const getPendingIssuesCount = async () => {
    try {
      const response = await fetch('/asset/getPendingIssueCount')
      if (!response.ok) {
        throw new Error('Failed to fetch pending issues')
      }
      const data = await response.json()

      // Check if there's a change in the length of pending issues data
      if (!flag) {
        // populateCards(data.data);
        previousTotalIssuesCount = data.data.total_issues_count
        previousPendingIssuesCount = data.data.total_pending_issues
        previousPendingSoftwareIssueCount = data.data.total_software_issues
        previousPendingHardwareIssueCount = data.data.total_hardware_issues
        previousPendingDamageIssueCount = data.data.total_damage_issues
        previousPendingReplacementIssueCount = data.data.total_replacement_issues
        previousNewAssetRequestCount = data.data.total_request_count
        previousPendingLaptopRequestCount = data.data.total_laptop_request
        previousPendingDesktopRequestCount = data.data.total_desktop_request
        previousPendingDongleRequestCount = data.data.total_dongle_request
        previousPendingMobileRequestCount = data.data.total_mobile_request
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
        alertCount = ((parseInt(data.data.total_software_issues) - parseInt(previousPendingSoftwareIssueCount)) + (parseInt(data.data.total_hardware_issues) - parseInt(previousPendingHardwareIssueCount)) +
                    (parseInt(data.data.total_damage_issues) - parseInt(previousPendingDamageIssueCount)) +
                    (parseInt(data.data.total_replacement_issues) - parseInt(previousPendingReplacementIssueCount)) +
                    (parseInt(data.data.total_request_count) - parseInt(previousNewAssetRequestCount)) +
                    (parseInt(data.data.total_laptop_request) - parseInt(previousPendingLaptopRequestCount)) +
                    (parseInt(data.data.total_desktop_request) - parseInt(previousPendingDesktopRequestCount)) +
                    (parseInt(data.data.total_dongle_request) - parseInt(previousPendingDongleRequestCount)) +
                    (parseInt(data.data.total_mobile_request) - parseInt(previousPendingMobileRequestCount))
        )

        document.getElementById('issue-number').innerText = alertCount
        if (alertCount !== 0) {
          alert('New request is raised ')
        }
        previousTotalIssuesCount = data.data.total_issues_count
        previousPendingIssuesCount = data.data.total_pending_issues
        previousPendingSoftwareIssueCount = data.data.total_software_issues // Update the previous length
        previousPendingHardwareIssueCount = data.data.total_hardware_issues
        previousPendingDamageIssueCount = data.data.total_damage_issues
        previousPendingReplacementIssueCount = data.data.total_replacement_issues
        previousNewAssetRequestCount = data.data.total_request_count
        previousPendingLaptopRequestCount = data.data.total_laptop_request // Variable to store the previous length of pending request data
        previousPendingDesktopRequestCount = data.data.total_desktop_request // Variable to store the previous length of pending request data
        previousPendingDongleRequestCount = data.data.total_dongle_request // Variable to store the previous length of pending request data
        previousPendingMobileRequestCount = data.data.total_mobile_request
      }
    } catch (error) {
      console.error('Error fetching pending issues:', error)
    }
  // eslint-disable-next-line semi
  };

  getPendingIssuesCount()
  // Set interval to fetch pending issues every 10 seconds
  setInterval(getPendingIssuesCount, 10000)
  const formatDate = (timestamp) => {
    if (timestamp === null || timestamp === undefined || timestamp === '') {
      return '' // Return empty string
    }

    // Parse the timestamp into a Date object
    const date = new Date(timestamp)

    // Extract year, month, day, hours, minutes, and seconds from the adjusted date
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    // Return the formatted date string
    return `${day}/${month}/${year}  ${hours}:${minutes}:${seconds}`
  };

  const vendorId = localStorage.getItem('vendorId')
  const user_name = localStorage.getItem('admin_name')
  console.log(user_name)
  document.getElementById('user-name').textContent = `Hi, ${user_name}`
  document.getElementById('role').textContent = `Quotation Details Vendor Id :${vendorId}`
  const quotationData = []
  let quotationUrls
  let quotationFilenames
  let quotationTable
  var quotationDate
  // Function to convert JSON data to array of objects
  function convertDataToObjects (data) {
    const quotationData = []
    quotationUrls = data[0].quotation_url
    quotationFilenames = data[0].quotation_filename
    quotationDate = formatDate(data[0].quotation_timestamp)

    Object.keys(quotationFilenames).forEach(key => {
      const quotationName = quotationFilenames[key]
      const quotationUrl = quotationUrls[key]

      quotationData.push({
        key: key,
        quotationName: quotationName,
        quotationUrl: quotationUrl,
        quotationDate:quotationDate,
        action: `<button class="btn btn-danger btn-sm remove" data-key="${key}">Remove</button>
                    <button class="btn btn-success btn-sm download" data-url="${quotationUrl}">Download</button>`
      })
    })

    return quotationData
  }

  // Function to populate asset request table
  function populateQuotationTable (data) {
    $(document).ready(function () {
      quotationTable = $('#quotation-details-table').DataTable({
        data: convertDataToObjects(data),
        columns: [
          { title: 'Serial No.', data: 'key' },
          { title: 'Quotation', data: 'quotationName' },
          { title: 'Created At', data: 'quotationDate' },
          { title: 'Action', data: 'action', orderable: false }
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
        lengthMenu: [10, 15, 20],
        columnDefs: [
          { className: 'dt-body-left', targets: [0, 1, 2] } // Align text to left in all columns
        ],
        order: [[0, 'asc']],
        drawCallback: function (settings) {
          var api = this.api()
          var recordsTotal = api.page.info().recordsTotal
          var pageLength = api.page.len()

          if (recordsTotal <= pageLength) {
            // If the total records is less than or equal to the page length,
            // hide the pagination
            $('.paging_full_numbers').hide()
          } else {
            // Otherwise, show the pagination
            $('.paging_full_numbers').show()
          }
        }
      })
    })

    $(document).ready(function () {
      // Add event listener to download buttons
      $('#quotation-details-table').on('click', '.download', function () {
        const url = $(this).data('url')
        // Redirect to the URL
        window.location.href = url
      })
    })
  }

  // Function to remove item from quotationData and update keys
  function removeItemAndUpdateKeys (keyToRemove) {
    // Remove item from quotationData
    const indexToRemove = quotationData.findIndex(item => item.key === keyToRemove)
    quotationData.splice(indexToRemove, 1)

    // Update keys in quotationUrls and quotationFilenames
    delete quotationUrls[keyToRemove]
    delete quotationFilenames[keyToRemove]

    // Reassign keys to ensure they start from 1
    const newKeys = Object.keys(quotationFilenames)
    const updatedQuotationUrls = {}
    const updatedQuotationFilenames = {}
    newKeys.forEach((newKey, index) => {
      updatedQuotationUrls[index + 1] = quotationUrls[newKey]
      updatedQuotationFilenames[index + 1] = quotationFilenames[newKey]
    })

    quotationUrls = updatedQuotationUrls
    quotationFilenames = updatedQuotationFilenames

    // Update keys in quotationData
    quotationData.forEach((item, index) => {
      item.key = String(index + 1)
      item.quotationName = updatedQuotationFilenames[index + 1]
      item.quotationUrl = updatedQuotationUrls[index + 1]
    })

    const updatedData = convertDataToObjects([{ quotation_url: updatedQuotationUrls, quotation_filename: updatedQuotationFilenames }])
    quotationTable.clear().rows.add(updatedData).draw()

    return updatedData
  }

  // Event listener to download the file
  // $(document).ready(function () {
  //     // Add event listener to download buttons
  //     $('#quotation-details-table').on('click', '.download', function () {
  //         const url = $(this).data('url');
  //         // Redirect to the URL
  //         window.location.href = url;
  //     });
  // });

  function createQuotationObjects (updatedQuotationData) {
    const quotationNameObj = {}
    const quotationUrlObj = {}

    updatedQuotationData.forEach(item => {
      const key = item.key
      quotationNameObj[key] = item.quotationName
      quotationUrlObj[key] = item.quotationUrl
    })

    return {
      quotationName: quotationNameObj,
      quotationUrl: quotationUrlObj
    }
  }
  //Event listener for remove button remove quotationName and quotationUrl
  $(document).on('click', '.remove', function () {
    const keyToRemove = $(this).data('key')
    // const indexToRemove = quotationData.findIndex(item => item.key === keyToRemove);

    const updatedQuotationData = removeItemAndUpdateKeys(keyToRemove)

    // Update the database via fetch API
    const quotationObjects = createQuotationObjects(updatedQuotationData)
    const body = {
      vendorId: localStorage.getItem('vendorId'),
      quotationName: quotationObjects.quotationName,
      quotationUrl: quotationObjects.quotationUrl
    }

    fetch('/updateQuotationDetails', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Quotation removed successfully.'
          }).then(() => {
            // window.location.href='/addQuotation'; // Reload the page after successful removal
            location.reload() // Refresh the current page to see changes immediately
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to remove quotation.'
          })
        }
      })
      .catch(error => {
        console.error('Error:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while removing the quotation.'
        })
      })
  })

  try {
    const response = await fetch(`/getQuotationDetails/${vendorId}`)
    console.log(response)
    if (!response.ok) {
      throw new Error('Failed to fetch issue data')
    }
    const data = await response.json()

    populateQuotationTable(data.data)
  } catch (error) {
    console.error('Error fetching resolved issues:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed t get the quoation details'
    }).then(() => {
      window.location.href = '/addQuotation'
    })
  }
})
