// Businesslist data array for filling in info box
var businessListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the listing table on initial page load
  populateTable();

  // ownername link click
	$('#businessList table tbody').on('click', 'td a.linkshowlisting', showListingInfo);

	 // Add Listing button click
  $('#btnAddListing').on('click', addListing);

  // Filter Listings on button click
  $('#btnFilterListings').on('click', filterListings);

   // Delete Listing link click
  $('#businessList table tbody').on('click', 'td a.linkdeletelisting', deleteListing);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON('/listings/businesslist', function(data) {

  	businessListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      if (this.matched) {
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowlisting" rel="' + this.businessname + '">' + this.businessname + '</a></td>';
        tableContent += '<td>' + this.businesstype + '</td>';
        tableContent += '<td>' + this.location + '</td>';
        tableContent += '<td>' + this.description + '</td>';
        tableContent += '<td><a href="#" class="linkdeletelisting" rel="' + this._id + '">delete</a></td>';
        tableContent += '</tr>';
      }
    });

    // Inject the whole content string into our existing HTML table
    $('#businessList table tbody').html(tableContent);
  });
};

function repopulateTable() {

  // Empty content string
  var tableContent = '';

  // For each item in our JSON, add a table row and cells to the content string
  businessListData.forEach(function(businessListing) {
    if (businessListing.matched) {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowlisting" rel="' + businessListing.businessname + '">' + businessListing.businessname + '</a></td>';
      tableContent += '<td>' + businessListing.businesstype + '</td>';
      tableContent += '<td>' + businessListing.location + '</td>';
      tableContent += '<td>' + businessListing.description + '</td>';
      tableContent += '<td><a href="#" class="linkdeletelisting" rel="' + businessListing._id + '">delete</a></td>';
      tableContent += '</tr>';
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
  var thisBusinessName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = businessListData.map(function(arrayItem) { return arrayItem.businessname; }).indexOf(thisBusinessName);

  // Get our Listing Object
  var thisListingObject = businessListData[arrayPosition];

  //Populate Info Box
  $('#listingInfoOwnerName').text(thisListingObject.ownername);
  $('#listingInfoGradYear').text(thisListingObject.gradyear);
  $('#listingInfoDescription').text(thisListingObject.description);
  $('#listingInfoLocation').text(thisListingObject.location);
};

// Add Listing
function addListing(event) {

  // prevent link from firing
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addListing input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all listing info into one object
    var newListing = {
      'ownername': $('#addListing fieldset input#inputOwnerName').val(),
      'email': $('#addListing fieldset input#inputOwnerEmail').val(),
      'gradyear': $('#addListing fieldset input#inputGradYear').val(),
      'businessname': $('#addListing fieldset input#inputBusinessName').val(),
      'businesstype': $('#addListing fieldset select#inputBusinessType').val(),
      'location': $('#addListing fieldset input#inputLocation').val(),
      'description': $('#addListing fieldset input#inputDescription').val(),
      'matched': true
    }

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

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

function filterListings(event) {
  // prevent link from firing
  event.preventDefault();

  if ($('#filterListings input#inputLocation') != 0) {
    businessListData.forEach(function(businessListing) {
      console.log(businessListing.matched);
      if (businessListing.businesstype != $('#filterListings select#inputBusinessType').val() ||
          businessListing.location != $('#filterListings input#inputLocation').val()) {
            businessListing.matched = false;
        }
        console.log(businessListing.matched);
    });
  }
  else {
    alert('Please fill in all fields');
  }

  repopulateTable();
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

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};
