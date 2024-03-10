
document.addEventListener("DOMContentLoaded", async function () {

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

  const assetCountApiUrl = "/asset/getAssetCount";
  let user_name = localStorage.getItem("admin_name");
  console.log(user_name);
  document.getElementById('user-name').textContent = `Hi, ${user_name}`;

  const cardContainer = document.querySelector(".card-deck");



  // Add event listener to the container element
  cardContainer.addEventListener("click", async function (event) {
    // Check if the clicked element is a card
    if (event.target.classList.contains("card")) {
      // Get the ID of the clicked card
      const cardId = event.target.id;
      // Fetch data based on the card ID
      const data = await fetchCardData(cardId);
      if (data) {
        // Populate the asset details table with the fetched data
        populateAssetDetailsTable(data);
        // Show the modal or perform any other action as needed
        //$("#assetDetailsModal").modal("show");
      }
    }
  });

  let budgetApiUrl = '/asset/getBudget';

  async function getBudget() {
    try {
      const response = await fetch(budgetApiUrl, {
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
        }), 1000);
      }

      const data = await response.json();
      // if(data.data.length == 0 {})
      populateBudgetCards(data.data[0]);
      populateUpdateBudgetModal(data.data[0])


    } catch (error) {
      console.error("Error fetching budget data:", error);
    }
  }

  getBudget();

  function populateBudgetCards(data) {

    // Update allocated budget
    document.getElementById("allocatedBudget").innerText = data.budget_allocated;

    // Update utilized budget
    document.getElementById("budgetUtilised").innerText = data.utilised_budget;

    // Update available budget
    document.getElementById("budgetAvailable").innerText = data.available_budget;
  }


  var availableBudgetData;
  // Function to populate the update budget modal with data
  function populateUpdateBudgetModal(data) {

    let createdAt = formatDate(data.created_at)
    let modifiedAt = formatDate(data.modified_at)
    document.getElementById('updateAllocatedBudget').value = data.budget_allocated;
    document.getElementById('updateUtilizedBudget').value = data.utilised_budget;
    document.getElementById('updateAvailableBudget').value = data.available_budget;
    availableBudgetData = data.available_budget;
    document.getElementById('createdBy').value = data.created_by_username;
    document.getElementById('createdAt').value = createdAt;
    document.getElementById('modifiedBy').value = data.modified_by_username;
    document.getElementById('modifiedAt').value = modifiedAt;
    document.getElementById('updateBudgetYear').value = data.budget_year;

  }



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
      }), 1000);
    }

    const data = await response.json();
    // if(data.data.length == 0 {})
    populateCards(data.data[0]);
  } catch (error) {
    console.error("Error fetching asset count data:", error);
  }




  function populateCards(data) {
    // Update total assets
    document.getElementById("totalAssetsNumber").innerText = data.total_asset_count;

    // Update allocated assets
    document.getElementById("allocatedAssetsNumber").innerText = data.total_allocated_assets;

    // Update unallocated assets
    document.getElementById("unallocatedAssetsNumber").innerText = data.total_unallocated_assets;

    // Update laptop assets
    document.getElementById("laptopAssetsNumber").innerText = data.total_laptop_assets;

    // Update dongle assets
    document.getElementById("dongleAssetsNumber").innerText = data.total_dongle_assets;

    // Update desktop assets
    document.getElementById("desktopAssetsNumber").innerText = data.total_desktop_assets;

    // Update mobile assets
    document.getElementById("mobileAssetsNumber").innerText = data.total_mobile_assets;

    // Update YNA assets
    document.getElementById("ynaAssetsNumber").innerText = data.total_yna_assets;

    // Update OSS assets
    document.getElementById("ossAssetsNumber").innerText = data.total_oss_assets;

    // Update ETI assets
    document.getElementById("eitAssetsNumber").innerText = data.total_eti_assets;

    // Update SAP assets
    document.getElementById("sapAssetsNumber").innerText = data.total_sap_assets;

    // Update Microsoft assets
    document.getElementById("microsoftAssetsNumber").innerText = data.total_microsoft_assets;
  }





  //Get the container element that holds all the cards
  var cards = document.querySelectorAll('.card');

  // Iterate over each card and add event listener
  // cards.forEach(function (card) {
  //   card.addEventListener("click", async function (event) {
  //     // Check if the clicked element is a card
  //     if (event.target.classList.contains("card")) {
  //       // Get the ID of the clicked card
  //       const cardId = event.target.id;
  //       // Fetch data based on the card ID
  //       const data = await fetchCardData(cardId);
  //       if (data) {
  //         // Populate the asset details table with the fetched data
  //         populateAssetDetailsTable(data);
  //         // Show the modal or perform any other action as needed
  //         //$("#assetDetailsModal").modal("show");
  //       }
  //     }
  //   });
  // });

  var allocatedBudgetCard = document.getElementById('allocatedBudgetCard')
  allocatedBudgetCard.addEventListener("click", async function () {
    document.getElementById('updateAllocatedBudget').value = document.getElementById('allocatedBudget').innerText
    $("#updateBudgetModal").modal("show");

  });

  var budgetAvailableCard = document.getElementById('budgetAvailableCard')
  budgetAvailableCard.addEventListener("click", async function () {
    document.getElementById('updateAllocatedBudget').value = document.getElementById('allocatedBudget').innerText
    $("#updateBudgetModal").modal("show");

  });

  var budgetUtilisedCard = document.getElementById('budgetUtilisedCard')
  budgetUtilisedCard.addEventListener("click", async function () {
    document.getElementById('updateAllocatedBudget').value = document.getElementById('allocatedBudget').innerText
    $("#updateBudgetModal").modal("show");

  });

  var totalAssetsCard = document.getElementById('totalAssetsCard')
  totalAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'totalAssetsCard');
    window.location.href = '/assetDetails'

  });

  var allocatedAssetsCard = document.getElementById('allocatedAssetsCard')
  allocatedAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'allocatedAssetsCard');
    window.location.href = '/assetDetails'
    // const data = await fetchCardData('allocatedAssetsCard');

  });

  var unallocatedAssetsCard = document.getElementById('unallocatedAssetsCard')
  unallocatedAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'unallocatedAssetsCard');
    window.location.href = '/assetDetails'

  });

  var laptopAssetsCard = document.getElementById('laptopAssetsCard')
  laptopAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'laptopAssetsCard');
    window.location.href = '/assetDetails'

  });

  var dongleAssetsCard = document.getElementById('dongleAssetsCard')
  dongleAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'dongleAssetsCard');
    window.location.href = '/assetDetails'

  });

  var desktopAssetsCard = document.getElementById('desktopAssetsCard')
  desktopAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'desktopAssetsCard');
    window.location.href = '/assetDetails'

  });

  var mobileAssetsCard = document.getElementById('mobileAssetsCard')
  mobileAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'mobileAssetsCard');
    window.location.href = '/assetDetails'

  });

  var ynaAssetsCard = document.getElementById('ynaAssetsCard')
  ynaAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'ynaAssetsCard');
    window.location.href = '/assetDetails'

  });

  var ossAssetsCard = document.getElementById('ossAssetsCard')
  ossAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'ossAssetsCard');
    window.location.href = '/assetDetails'

  });

  var eitAssetsCard = document.getElementById('eitAssetsCard')
  eitAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'eitAssetsCard');
    window.location.href = '/assetDetails'

  });


  var sapAssetsCard = document.getElementById('sapAssetsCard')
  sapAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'sapAssetsCard');
    window.location.href = '/assetDetails'

  });

  var microsoftAssetsCard = document.getElementById('microsoftAssetsCard')
  microsoftAssetsCard.addEventListener("click", async function () {
    localStorage.setItem('cardId', 'microsoftAssetsCard');
    window.location.href = '/assetDetails'

  });


  var addBudget = document.getElementById('add-budget')
  addBudget.addEventListener("click", function () {
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    document.getElementById('budgetYearInput').value = currentYear
    $('#addBudgetModal').modal("show");
  })

  var addBudgetForm = document.getElementById('addBudgetForm');
  // Add event listener for form submission
  addBudgetForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create a new FormData object to store form data


    var allocatedBudget = document.getElementById('newAllocatedBudget').value
    var budgetYear = document.getElementById('budgetYearInput').value
    // Parse the input value to ensure it's a valid number
    var budgetAmount = parseFloat(allocatedBudget);

    // Check if the budget amount is 0 or negative
    if (budgetAmount <= 0 || isNaN(budgetAmount)) {
      // Show an error message using Swal.fire
      Swal.fire({
        icon: 'error',
        title: 'Invalid Budget Amount',
        text: 'Allocated budget must be a positive number greater than 0.',
      });
      // Return to prevent further actions or form submission
      return;
    } else {

      let user_id = localStorage.getItem('admin_id');
      let formData = {
        allocatedBudget: allocatedBudget,
        budgetYear: budgetYear,
        user_id: user_id
      }

      try {
        // Make the API call to '/asset/addBudget'
        const response = await fetch('/asset/registerBudget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        // Check if the response is successful
        if (response.ok) {
          // Show success message using SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Budget added successfully'
          }).then((result) => {
            // Reload the page after showing the success message
            location.reload();
          });
        } else {
          // Show error message using SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Budget for ${budgetYear} already exists`
          });
        }
      } catch (error) {
        // Show error message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while processing your request'
        });
        console.error('Error:', error);
      }
    }
  });


  // Close modals when clicking on blank space
  $(".modal").on("click", function (e) {
    if ($(e.target).hasClass("modal")) {
      $(this).modal("hide");
    }
  });




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
    const teamDropdown = document.getElementById('newTeam');
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



  // Function to fetch asset statuses and populate dropdown for request new asset
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

  // Function to fetch asset vendors and populate vendor dropdown
  const getAssetVendors = async () => {

    try {
      const response = await fetch(`/asset/getVendor`);
      if (!response.ok) {
        throw new Error('Failed to fetch asset vendors');
      }
      const data = await response.json();
      populateVendorDropdown(data.data);
    } catch (error) {
      console.error('Error fetching asset vendors:', error);
    }
  };

  var vendorData = []

  const populateVendorDropdown = (assetVendors) => {
    const assetVendorsDropdown = document.getElementById('newAssetVendors');

    // Clear existing options
    assetVendorsDropdown.innerHTML = '';


    // Create placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = 'Select Asset Vendors';
    placeholderOption.disabled = true;
    placeholderOption.selected = true; // Select the placeholder option by default
    assetVendorsDropdown.appendChild(placeholderOption);

    // Iterate through each asset status and create an option element
    assetVendors.forEach(vendor => {
      const option = document.createElement('option');
      option.value = vendor.vendor_name;
      option.textContent = vendor.vendor_name;
      assetVendorsDropdown.appendChild(option);
      // Save vendor name and price in the array
      vendorData.push({ name: vendor.vendor_name, price: vendor.vendor_price, category: vendor.asset_category });
    });

    // Add event listener to the vendor dropdown to update Asset Price

    assetVendorsDropdown.addEventListener('change', () => {
      const selectedVendorName = assetVendorsDropdown.value;
      const selectedAssetCategory = document.getElementById('newAssetCategory').value
      // Find the selected vendor in the vendorData array
      const selectedVendor = vendorData.find(vendor => vendor.name === selectedVendorName && vendor.category === selectedAssetCategory);
      if (selectedVendor) {
        // Update the Asset Price field with the price of the selected vendor
        document.getElementById('newAssetPrice').value = selectedVendor.price;
      } else {
        // If no vendor is selected, clear the Asset Price field
        document.getElementById('newAssetPrice').value = '';
      }
    });
  };

  getAssetVendors();

  // Add event listener to the asset category dropdown
  let assetCategoryDropdown = document.getElementById('newAssetCategory');
  assetCategoryDropdown.addEventListener('change', () => {
    const selectedAssetCategory = assetCategoryDropdown.value;
    document.getElementById('newAssetPrice').value = ''
    // Filter the vendor data array based on the selected category
    const filteredVendors = vendorData.filter(vendor => vendor.category === selectedAssetCategory);
    const assetVendorsDropdown = document.getElementById('newAssetVendors');

    // Clear existing options
    assetVendorsDropdown.innerHTML = '';


    // Create placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = 'Select Asset Vendors';
    placeholderOption.disabled = true;
    placeholderOption.selected = true; // Select the placeholder option by default
    assetVendorsDropdown.appendChild(placeholderOption);

    // Iterate through each asset status and create an option element
    filteredVendors.forEach(vendor => {
      const option = document.createElement('option');
      option.value = vendor.name;
      option.textContent = vendor.name;
      assetVendorsDropdown.appendChild(option);
    });
  });


  // Function to handle change event on asset status dropdown
  const handleAssetStatusChange = () => {
    const assetStatusDropdown = document.getElementById('newAssetStatus');
    const allocatedToInput = document.getElementById('newAllocatedTo');
    const assetTeamInput = document.getElementById('newTeam').value;

    assetStatusDropdown.addEventListener('change', () => {
      const selectedStatus = assetStatusDropdown.value;
      // If asset status is 'Unallocated', disable the allocated to input field
      if (selectedStatus.toLowerCase() === 'unallocated') {
        allocatedToInput.disabled = true;
        allocatedToInput.value = '';
        document.getElementById('teamBlock').classList.add('d-none'); //
        document.getElementById('allocatedToBlock').classList.add('d-none')// Clear the input field
      } else {
        allocatedToInput.disabled = false;
        document.getElementById('teamBlock').classList.remove('d-none'); //
        document.getElementById('allocatedToBlock').classList.remove('d-none')
      }
    });
  };

  // Function to handle change event on asset status dropdown
  // const handleAssetTeamChange = () => {
  //   const assetTeamDropdown = document.getElementById('newTeam');
  //   const allocatedToInput = document.getElementById('newAllocatedTo');
  //   const assetStatusInput = document.getElementById('newAssetStatus').value;

  //   assetTeamDropdown.addEventListener('change', () => {
  //     const selectedStatus = assetTeamDropdown.value;
  //     // If asset status is 'Unallocated', disable the allocated to input field
  //     if (selectedStatus.toLowerCase() === 'not allocated' && assetStatusInput.toLowerCase() === 'unallocated') {
  //       allocatedToInput.disabled = true;
  //       allocatedToInput.value = ''; // Clear the input field
  //     }
  //   });
  // };

  // Show Register New Asset modal on navbar link click
  const registerAssetLink = document.getElementById('add-asset');

  registerAssetLink.addEventListener('click', async () => {
    // Call the functions to fetch asset categories and statuses
    await getAssetCategories();
    await getAssetStatuses();
    await getEmployees();

    $('#registerAssetModal').modal('show');
    // Call the function to handle asset status change event
    handleAssetStatusChange();

  });

  // Call the function to handle asset status change event
  handleAssetStatusChange();
  //handleAssetTeamChange();


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


    employees.forEach(employee => {
      const listItem = document.createElement('li');
      listItem.classList.add('dropdown-item');
      listItem.value = employee.id;
      listItem.textContent = `${employee.id} - ${employee.name}`;
      listItem.addEventListener('click', function () {
        document.getElementById('newAllocatedTo').value = `${employee.id} - ${employee.name}`;
        document.getElementById('newAllocatedTo').dataset.employeeID = `${employee.id}`;

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


  // Function to populate the dropdown on change of team
  var filteredEmployeesTeamWise
  document.getElementById('newTeam').addEventListener('change', function () {
    var team = document.getElementById('newTeam').value;
    //var assetStatusDropdown = document.getElementById('newAssetStatus');
    if (team === 'Not Allocated') {

      //document.getElementById('newAllocatedTo').disabled = true;
      filteredEmployeesTeamWise = employeeList
      populateEmployeeDropdown(filteredEmployeesTeamWise);

    } else {
      //assetStatusDropdown.querySelector('option[value="Allocated"]').selected = true;
      //document.getElementById('newAllocatedTo').disabled = false;
      filteredEmployeesTeamWise = employeeList.filter(employee =>
        employee.team.includes(team)
      );
      populateEmployeeDropdown(filteredEmployeesTeamWise);
      //document.getElementById('allocatedToDropdown').style.display = 'block';
    }
  });


  // Function to handle input in allocated field
  document.getElementById('newAllocatedTo').addEventListener('input', function () {
    const searchQuery = this.value.toUpperCase();
    var team = document.getElementById('newTeam').value;
    if (searchQuery) {
      // Filter employees based on search query
      const filteredEmployees = filteredEmployeesTeamWise.filter(employee =>
        employee.id.includes(searchQuery) || employee.name.toLowerCase().startsWith(searchQuery.toLowerCase()) && employee.team.includes(team)
      );

      populateEmployeeDropdown(filteredEmployees);
      document.getElementById('allocatedToDropdown').style.display = 'block';
    } else {
      // Populate with all employees if search query is empty
      populateEmployeeDropdown(employeeList);
      document.getElementById('allocatedToDropdown').style.display = 'block';
    }
  });

  // Function to handle input in allocated field
  document.getElementById('newAllocatedTo').addEventListener('focus', function () {
    document.getElementById('allocatedToDropdown').style.display = 'block';
  })

  // Function to handle input in allocated field
  document.getElementById('newAllocatedTo').addEventListener('click', function () {
    document.getElementById('allocatedToDropdown').style.display = 'block';
  })

  // Hide dropdown menu when clicking outside of it
  document.addEventListener('click', function (event) {
    const dropdownToggle = document.getElementById('newAllocatedTo');
    const dropdownMenu = document.getElementById('allocatedToDropdown');
    if (!dropdownToggle.contains(event.target)) {
      dropdownMenu.style.display = 'none';
      //dropdownMenu.classList.remove('show');
    }
  });



  // Form submission and validation for registering new asset
  const registerAssetForm = document.getElementById('registerAssetForm');
  registerAssetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    //let registerAssetForm = document.getElementById('registerAssetForm');
    let newAssetPrice = document.getElementById('newAssetPrice').value;
    newAssetPrice = parseInt(newAssetPrice)
    availableBudgetData = parseInt(availableBudgetData)
    if ((newAssetPrice) > (availableBudgetData)) {
      Swal.fire({
        icon: 'warning',
        title: 'Asset Price Exceeds Available Budget',
        text: 'The price of the asset exceeds the available budget.'
      });
      return;
    }

    // Validate all fields are filled
    const assetCategory = document.getElementById('newAssetCategory').value;
    let assetStatus = document.getElementById('newAssetStatus').value;
    let allocatedTo = document.getElementById('newAllocatedTo').value
    let team = document.getElementById('newTeam').value

    if (assetStatus === 'allocated' || assetStatus === 'Allocated' || !team === 'Not Allocated') {



      allocatedTo = document.getElementById('newAllocatedTo').value.trim().toLowerCase();
      allocatedTo = allocatedTo.split(' ')[0]
      let allocatedToDataSet = document.getElementById('newAllocatedTo').dataset.employeeID


      if (allocatedTo.startsWith('ym')) {
        try {
          newfilteredEmployees = employeeList.filter(employee =>
            employee.id.toLowerCase() === allocatedToDataSet.toLowerCase()
          );

        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please select from the options below'
          });
          return;
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select from the options below'
        });
        return;
      }


      let selectedEmployee
      if (newfilteredEmployees.length === 0) {
        try {
          newfilteredEmployees = employeeList.filter(employee =>
            employee.id.toLowerCase() === allocatedToDataSet.toLowerCase() ||
            employee.name.toLowerCase() === allocatedToDataSet.toLowerCase()
          );
          if (newfilteredEmployees.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please Choose from options'
            });
            return;
          } else {
            selectedEmployee = newfilteredEmployees[0].id
          }
        } catch (error) {
          if (newfilteredEmployees.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please Choose from the options'
            });
            return;
          }
        }
      } else {
        selectedEmployee = newfilteredEmployees[0].id
      }


      // Assuming you want to select the first employee in the filtered list

      //let selectedEmployee = newfilteredEmployees[0].id;

      allocatedTo = selectedEmployee.replace('YM', '');
      allocatedTo = parseInt(allocatedTo);

      if (!allocatedTo) {
        // Show error message if any field is empty
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please Enter Employee ID'
        });
        return; // Exit function if any field is empty
      }
    }

    const userId = localStorage.getItem('admin_id');
    const user_name = localStorage.getItem('admin_name');
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

    if (assetStatus === 'unallocated' || assetStatus === 'Unallocated' && !team === 'Not Allocated') {

      allocatedTo = 'null'
    }
    assetStatus = assetStatus.toLowerCase();


    // Prepare data for API call

    let assetVendor = document.getElementById('newAssetVendors').value
    if (assetVendor === null || assetVendor === undefined || assetVendor === "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No vendor is available'
      })

      return
    }

    let assetPrice = document.getElementById('newAssetPrice').value
    if (assetPrice === null || assetPrice === undefined || assetPrice === "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'asset price is not available'
      })

      return
    }

    const formData = {
      asset_category: assetCategory,
      asset_status: assetStatus,
      allocated_to: allocatedTo,
      team: team,
      user_id: userId,
      user_name: user_name,
      assetVendor: assetVendor,
      assetPrice: assetPrice

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
          // Close swal after 2 seconds
        })
          .then(async () => {
            // Redirect to dashboard after success message
            await UpdateBudgetFormSubmit(assetPrice)
            window.location.href = '/adminPortal';
          });


      } else {
        if (response.status === 400) {

          Swal.fire({
            icon: 'error',
            title: 'error',
            text: 'Invalid Employee Id',
            showConfirmButton: false,
            // Close swal after 2 seconds
          })
            .then(() => {
              // Redirect to dashboard after success message
              window.location.href = '/adminPortal';
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
            window.location.href = '/adminPortal';
          });
          throw new Error('Failed to register asset');
        }
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

  // Function to handle form submission
  const UpdateBudgetFormSubmit = async (assetPrice) => {

    // Get form data
    //const formData = new FormData(document.getElementById('updateBudgetForm'));

    const allocatedBudget = document.getElementById('updateAllocatedBudget').value;
    var utilizedBudget = document.getElementById('updateUtilizedBudget').value;
    utilizedBudget = parseInt(utilizedBudget) + parseInt(assetPrice)
    let user_id = localStorage.getItem('admin_id');
    const budgetYear = document.getElementById('updateBudgetYear').value
    let formData = {
      allocatedBudget: allocatedBudget,
      budgetUsed: utilizedBudget,
      user_id: user_id,
      budgetYear: budgetYear
    }
    try {
      const response = await fetch('/asset/updateBudget', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        Swal.fire({
          icon: 'error', title: 'Error', text: 'Budget update failed'
        })
        throw new Error('Failed to update budget');
      }
      Swal.fire({
        icon: 'success', title: 'Success', text: 'Budget Updated Successfully'
      }).then(() => {
        // If response is ok, call function to get updated budget data
        getBudget();
      })
    } catch (error) {
      console.error('Error updating budget:', error);
      // Optionally, display an error message to the user
    }
  };

  // Function to handle form submission
  const handleUpdateBudgetFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    //const formData = new FormData(document.getElementById('updateBudgetForm'));

    var allocatedBudget = document.getElementById('updateAllocatedBudget').value;
    var currentAllocatedBudget = document.getElementById('allocatedBudget').innerText;
    allocatedBudget = parseInt(allocatedBudget);
    currentAllocatedBudget = parseInt(currentAllocatedBudget);

    if (parseInt(allocatedBudget) < parseInt(currentAllocatedBudget)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'New budget cannot be less than current allocation.'
      })
      return
    }
    const utilizedBudget = document.getElementById('updateUtilizedBudget').value;
    let user_id = localStorage.getItem('admin_id');
    const budgetYear = document.getElementById('updateBudgetYear').value
    let formData = {
      allocatedBudget: allocatedBudget,
      budgetUsed: utilizedBudget,
      user_id: user_id,
      budgetYear: budgetYear
    }
    try {
      const response = await fetch('/asset/updateBudget', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        Swal.fire({
          icon: 'error', title: 'Error', text: 'Budget update failed'
        })
        throw new Error('Failed to update budget');
      }
      Swal.fire({
        icon: 'success', title: 'Success', text: 'Budget Update Successfully'
      }).then(() => {
        window.location.href = '/adminPortal'
      })
      // If response is ok, call function to get updated budget data
      //getBudget();
    } catch (error) {
      console.error('Error updating budget:', error);
      // Optionally, display an error message to the user
      Swal.fire({
        icon: 'error', title: 'Error', text: 'Internal Server Error'
      })
    }
  };

  // Add event listener to the form for submit event
  document.getElementById('updateBudgetForm').addEventListener('submit', handleUpdateBudgetFormSubmit);


});
