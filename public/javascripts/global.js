// Businesslist data array for filling in info box and for filtering listings
var businessListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
  // Populate the business list and unverified list table on initial page load
  populateBusinessList();
  populateUnverifiedBusinessList();

  // ownername link click
	$('#businessList table tbody').on('click', 'td a.linkshowlisting', showListingInfo);

  // Add Listing button click
  $('#btnAddListing').on('click', addListing);

  // Filter Listings on button click
  $('#btnFilterListings').on('click', filterListings);

  // Delete Listing link click
  $('#businessList table tbody').on('click', 'td a.linkdeletelisting', deleteListing);

  // Approve Listing button click
  $('#unverifiedBusinessList table tbody').on('click', 'td a.linkapprovelisting', approveListing);

  // uverifiedBusinessList ownername link click
	$('#unverifiedBusinessList table tbody').on('click', 'td a.linkshowlisting', showListingInfo);

  // unverifiedBusinessList Deny (Delete) Listing link click
  $('#unverifiedBusinessList table tbody').on('click', 'td a.linkdenylisting', deleteListing);
});

// Functions =============================================================

// Fill businessList table with data from database
function populateBusinessList() {
  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON('/listings/businesslist', function(data) {

    businessListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function() {
      if (this.verified == 1) {
        if (this.matched == 1) {
          tableContent += '<tr>';
          tableContent += '<td><a href="#" class="linkshowlisting" rel="' + this._id + '">' + this.businessname + '</a></td>';
          tableContent += '<td>' + this.businesstype + '</td>';
          tableContent += '<td>' + this.location + '</td>';
          tableContent += '<td>' + this.description + '</td>';
          tableContent += '<td><a href="#" class="linkdeletelisting" rel="' + this._id + '">DELETE</a></td>';
          tableContent += '</tr>';
        }
      }
    });

    // Inject the whole content string into our existing HTML table
    $('#businessList table tbody').html(tableContent);
  });
};

// Fill unverifiedBusinessList table
function populateUnverifiedBusinessList() {
  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON('/listings/businesslist', function(data) {

    businessListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function() {
      if (this.verified == 0) {
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowlisting" rel="' + this._id + '">' + this.businessname + '</a></td>';
        tableContent += '<td>' + this.businesstype + '</td>';
        tableContent += '<td>' + this.location + '</td>';
        tableContent += '<td>' + this.description + '</td>';
        tableContent += '<td><a href="#" class="linkapprovelisting" rel="' + this._id + '">APPROVE</a></td>';
        tableContent += '<td><a href="#" class="linkdenylisting" rel="' + this._id + '">DENY</a></td>';
        tableContent += '</tr>';
      }
    });

    // Inject the whole content string into our existing HTML table
    $('#unverifiedBusinessList table tbody').html(tableContent);
  });
};

// Fill table with data from businessListData array
function repopulateBusinessList() {

  // Empty content string
  var tableContent = '';

  // For each item in our JSON, add a table row and cells to the content string
  businessListData.forEach(function(businessListing) {
    if (businessListing.verified == 1) {
      console.log(businessListing.matched);
      if (businessListing.matched == 1) {
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowlisting" rel="' + businessListing._id + '">' + businessListing.businessname + '</a></td>';
        tableContent += '<td>' + businessListing.businesstype + '</td>';
        tableContent += '<td>' + businessListing.location + '</td>';
        tableContent += '<td>' + businessListing.description + '</td>';
        tableContent += '<td><a href="#" class="linkdeletelisting" rel="' + businessListing._id + '">delete</a></td>';
        tableContent += '</tr>';
      }
    }
  });

  // Inject the whole content string into our existing HTML table
  $('#businessList table tbody').html(tableContent);
};

// Show Listing Info
function showListingInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve businessname from link rel attribute
  var thisBusinessID = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = businessListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisBusinessID);

  // Get our Listing Object
  var thisListingObject = businessListData[arrayPosition];

  //Populate Info Box
  $('#listingInfoBusinessName').text(thisListingObject.businessname);
  $('#listingInfoOwnerName').text(thisListingObject.ownername);
  $('#listingInfoGradYear').text(thisListingObject.gradyear);
  $('#listingInfoEmail').text(thisListingObject.email);
};

// Add Listing to business listings table
function addListing(event) {

  // prevent link from firing
  event.preventDefault();

  // If it is, compile all listing info into one object
  var newListing = {
    'ownername': $('#addListing fieldset input#inputOwnerName').val(),
    'email': $('#addListing fieldset input#inputOwnerEmail').val(),
    'gradyear': $('#addListing fieldset input#inputGradYear').val(),
    'businessname': $('#addListing fieldset input#inputBusinessName').val(),
    'businesstype': $('#addListing fieldset select#inputBusinessType').val(),
    'location': $('#addListing fieldset input#inputLocation').val(),
    'description': $('#addListing fieldset input#inputDescription').val(),
    'matched': 1,
    'verified': 0
  };
  if (newListing.ownername == '') {
    alert('Owner Name not entered; Listing not submitted.')
    return false;
  }
  if (newListing.businessname == '') {
    alert('Business Name not entered; Listing not submitted.')
    return false;
  }
  if (newListing.location == '') {
    alert('Location not entered; Listing not submitted.')
    return false;
  }
  if (newListing.businesstype == 'Unselected')
    newListing.businesstype = 'Not Selected';

  // Use AJAX to post the object to our addlisting service
  $.ajax({
    type: 'POST',
    data: newListing,
    url: '/listings/addlisting',
    dataType: 'JSON'
  }).done(function(response) {
    // Check for successful (blank) response
    if (response.msg === '') {

      // Clear the form inputs
      $('#addListing fieldset input').val('');
      //populateBusinessList();
    }
    else {
      // If something goes wrong, alert the error message that our service returned
      alert('Error: ' + response.msg);
    }
  });
};

// Event function for the alumni office manager page to verify listings
function approveListing(event) {

  // prevent link from firing
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to approve this listing?');

  // Check and make sure the listing confirmed
  if (confirmation === true) {
    // Retrieve businessID from link rel attribute
    var thisBusinessID = $(this).attr('rel');
    // Get Index of object based on id value
    var arrayPosition = businessListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisBusinessID);
    // Get our Listing Object
    var thisListingObject = businessListData[arrayPosition];
    // Create new verified listing object with verified property as 1
    var approvedListing = {
      'ownername': thisListingObject.ownername,
      'email': thisListingObject.email,
      'gradyear': thisListingObject.gradyear,
      'businessname': thisListingObject.businessname,
      'businesstype': thisListingObject.businesstype,
      'location': thisListingObject.location,
      'description': thisListingObject.description,
      'matched': thisListingObject.matched,
      'verified': 1,
    };

    // Delete the old listing
    $.ajax({
      type: 'DELETE',
      url: '/listings/deletelisting/' + thisBusinessID
    }).done(function(response) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the tables
      populateUnverifiedBusinessList();

    });

    // Use AJAX to post the updated listing object to our addlisting service
    $.ajax({
      type: 'POST',
      data: approvedListing,
      url: '/listings/addlisting',
      dataType: 'JSON'
    }).done(function(response) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Update the tables
        //populateBusinessList();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
  } else {
    return false;
  }
};

// Filter business listings table according to Location and Business Type criteria
function filterListings(event) {
  // prevent link from firing
  event.preventDefault();

  businessListData.forEach(function(businessListing) {
    if (businessListing.businesstype != $('#filterListings select#inputBusinessType').val() ||
        businessListing.location != $('#filterListings input#inputLocation').val()) {
      businessListing.matched = 0;
    }
  });

  // Populate table with only with matches (stored in businessListData array)
  repopulateBusinessList();
}

// Delete Listing
function deleteListing(event) {
  // prevent link from firing
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this listing?');

  // Check and make sure the listing confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/listings/deletelisting/' + $(this).attr('rel')
    }).done(function(response) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the tables
      populateBusinessList();
      populateUnverifiedBusinessList();
    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};
