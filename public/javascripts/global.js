// Businesslist data array for filling in info box and for filtering listings
var businessListData = [];

var userReportData = [];

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");

    return (parts.length == 2 ? parts.pop().split(";").shift() : "");
}
var sessId = "";
var userIdstr = "";

// DOM Ready =============================================================
$(document).ready(function () {
    // Populate the business list and unverified list table on initial page load


    var page = ($('#inputPage').length ? $('#inputPage').val() : "");
    sessId = $('input#inputSessionId').val();
    userIdstr = $('input#inputUserId').val();
    if ((page !== 'login') && (page !== 'create-account') && (page !== 'report')) {
        populateBusinessList();
    } else if (page === 'report') {
        populateUserReport();
    }

    if (page !== 'login') {
        if (page === 'create-account') {
            $('#btnCancel').on('click', '', goToLoginPage);
        } else {
            $('#logoutLink').on('click', '', logout);
        }
    } else {
        $('#btnCreateAccount').on('click', '', goToCreateAccountPage);
    }

    if (page === 'create-account') {
        $('#btnVerifyCreateAccount').on('click', '', verifyCreateAccountForm);
    }

    if ($('#isAdmin').length > 0) {
        if ($('#isAdmin').val() === '1') {
            $("#verifyLink").removeClass("hidden");
            $("#reportLink").removeClass("hidden");
        }
    }

    // ownerName link click
    $('#businessList table tbody').on('click', 'td a.linkshowlisting', showListingInfo);

    // Add Listing button click
    $('#btnAddListing').on('click', addListing);

    // Add Listing button click
    $('#btnMyListingLink').on('click', goToPage);
    // Filter Listings on key up
    $('#filterLocation').on('keyup', filterListings);
    // Filter Listings on type change

    $('#filterOwnerName').on('keyup', filterListings);

    $('#filterBusinessType').on('change', filterListings);

    $('#filterGradYear').on('keyup', filterListings);

    $('#filterBusinessName').on('keyup', filterListings);


    // Approve Listing button click
    $('#unverifiedBusinessList table tbody').on('click', 'td a.linkapprovelisting', approveListing);

    // uverifiedBusinessList ownerName link click
    $('#unverifiedBusinessList table tbody').on('click', 'td a.linkshowlisting', showListingInfo);

    // unverifiedBusinessList Deny (Delete) Listing link click
    $('#unverifiedBusinessList table tbody').on('click', 'td a.linkdenylisting', deleteListing);
    // unverifiedBusinessList Deny (Delete) Listing link click
    $('#businessList table tbody').on('click', 'td a.linkdenylisting', deleteListing);
});

// Functions =============================================================
function verifyCreateAccountForm() {
    // we will just verify that each field has data and that the two passwords match
    if ($('input#firstName').val().trim() === "") {
        alert("Please enter a first name");
        return false;
    }

    if ($('input#lastName').val().trim() === "") {
        alert("Please enter a last name");
        return false;
    }

    if ($('input#username').val().trim() === "") {
        alert("Please enter your email address");
        return false;
    }

    if ($('input#gradYear').val().trim() === "") {
        alert("Please enter the year you graduated");
        return false;
    }
    var now = new Date();
    var gradYear = $('input#gradYear').val().trim();
    if (isNaN(gradYear) || (parseInt(gradYear, 10) < 1940) || (parseInt(gradYear, 10) > now.getFullYear())) {
        alert("Please enter a valid year for graduation");
        return false;
    }

    var password = $('input#password').val().trim();
    if (password === "") {
        alert("Please enter a password");
        return false;
    }
    if (password.length < 6) {
        alert("Your password needs to be 6 or more characters");
        return false;
    }

    if ($('input#password').val().trim() !== $('input#verifyPassword').val().trim()) {
        alert("Your passwords do not match");
        return false;
    }

    // submit the form
    $('form#create-account').submit();
}

function goToLoginPage() {
    goToPage('/login', true);
}
function goToCreateAccountPage() {
    goToPage('/create-account', true);
}
function logout() {
    // jQuery AJAX call for JSON
    goToPage('/logout');
}
// Fill businessList table with data from database
function populateUserReport() {
    // jQuery AJAX call for JSON
    $.getJSON('/listings/users?sessId=' + sessId, function (data) {
        if (data && data.status && data.status === 401) {
            // user is not logged in so redirect to login page
            goToPage('/login', true);
        } else {
            userReportData = data;
            renderUserReport();
        }
    });
}

function renderUserReport() {
    // For each item in our JSON, add a table row and cells to the content string
    var tableContent = '';
    var users = [];

    $.each(userReportData, function () {
        var userId = this.userId;

        if (!users[userId]) {
            // we initialise if its the first record for this user
            users[userId] = {};
            users[userId].verified = 0;
            users[userId].unverified = 0;
            users[userId].ownerName = this.ownerName;
            users[userId].gradYear = this.gradYear;
            users[userId].email = this.email;
            users[userId].created = this.created;
        }

        users[userId].verified += this.verified;
        users[userId].unverified += (this.verified === 0 ? 1 : 0);
    });

    $.each(users, function () {
        if (this.ownerName !== undefined) {
            tableContent += '<tr>';
            tableContent += '<td>' + this.ownerName + '</td>';
            tableContent += '<td>' + this.gradYear + '</td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td>' + this.created.substr(0, 10) + '</td>';
            tableContent += '<td>' + this.verified + '</td>';
            tableContent += '<td>' + this.unverified + '</td>';
            tableContent += '</tr>';
        }
    });

    var selector = '#searchersReport table tbody';
    // Inject the whole content string into our existing HTML table
    $(selector).html(tableContent);
}

// Fill businessList table with data from database
function populateBusinessList() {
    // jQuery AJAX call for JSON
    $.getJSON('/listings?sessId=' + sessId, function (data) {
        if (data && data.status && data.status === 401) {
            // user is not logged in so redirect to login page
            goToPage('/login', true);
        } else {
            businessListData = data;
            renderBusinessList();
        }
    });
}

function renderBusinessList() {
    // For each item in our JSON, add a table row and cells to the content string
    var tableContent = '';

    var verify = $('input#inputPage').val() === "aomp";
    var myList = $('input#inputPage').val() === "my-listings";
    $.each(businessListData, function () {
        var showRow = (myList ? (this.userId == userIdstr) : (verify ? this.verified === 0 : this.verified === 1));
        if (showRow) {
            if (this.matched === 1) {
                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowlisting" rel="' + this.id + '">' + this.businessName + '</a></td>';
                if (!myList) {
                    tableContent += '<td>' + this.ownerName + '</td>';
                }
                tableContent += '<td>' + this.businessType + '</td>';
                tableContent += '<td>' + this.location + '</td>';
                tableContent += '<td>' + this.description + '</td>';
                if (verify || myList) {
                    tableContent += '<td>' + this.created.substr(0, 10) + '</td>';
                    tableContent += '<td>' + this.updated.substr(0, 10) + '</td>';
                }
                if (verify) {
                    tableContent += '<td><a href="#" class="linkapprovelisting" rel="' + this.id + '">APPROVE</a></td>';
                    tableContent += '<td><a href="#" class="linkdenylisting" rel="' + this.id + '">DENY</a></td>';
                }
                if (myList) {
                    tableContent += '<td>' + (this.verified ? 'Yes' : 'No') + '</td>';
                    tableContent += '<td><a href="#" class="linkdenylisting" rel="' + this.id + '">DELETE</a></td>';
                }
                tableContent += '</tr>';
            }
        }
    });

    var selector = '#' + (!verify ? 'businessList' : 'unverifiedBusinessList') + ' table tbody';
    // Inject the whole content string into our existing HTML table
    $(selector).html(tableContent);
}

function getBusinessListingIndex(elmVal) {
    return businessListData.map(function (arrayItem) {
        return arrayItem.id;
    }).indexOf(getBusinessListingId(elmVal));
}

function getBusinessListingId(elmVal) {
    return parseInt(elmVal, 10);
}

// Show Listing Info
function showListingInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    var busListId = getBusinessListingIndex($(this).attr('rel'));

    // Get our Listing Object
    var thisListingObject = businessListData[busListId];

    //Populate Info Box
    $('#listingInfoBusinessName').text(thisListingObject.businessName);
    $('#listingInfoOwnerName').text(thisListingObject.ownerName);
    $('#listingInfoGradYear').text(thisListingObject.gradYear);
    $('#listingInfoEmail').text(thisListingObject.email);
};

// Add Listing to business listings table
function addListing(event) {

    // prevent link from firing
    event.preventDefault();

    // If it is, compile all listing info into one object
    var newListing = {
        'ownerName': $('#addListing fieldset input#inputOwnerName').val(),
        'email': $('#addListing fieldset input#inputOwnerEmail').val(),
        'gradYear': $('#addListing fieldset input#inputGradYear').val(),
        'businessName': $('#addListing fieldset input#inputBusinessName').val(),
        'businessType': $('#addListing fieldset select#inputBusinessType').val(),
        'location': $('#addListing fieldset input#inputLocation').val(),
        'description': $('#addListing fieldset textarea#inputDescription').val(),
        'matched': 1,
        'verified': 0,
        'sessId': sessId
    };
    if (newListing.ownerName == '') {
        alert('Owner Name not entered; Listing not submitted.')
        return false;
    }
    if (newListing.businessName == '') {
        alert('Business Name not entered; Listing not submitted.')
        return false;
    }
    if (newListing.location == '') {
        alert('Location not entered; Listing not submitted.')
        return false;
    }
    if (newListing.businessType == 'Unselected')
        newListing.businessType = 'Not Selected';

    // Use AJAX to post the object to our addlisting service
    $.ajax({
        type: 'POST',
        data: newListing,
        url: '/listings',
        dataType: 'JSON'
    }).done(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {

            // Clear the form inputs
            $('#addListing fieldset input').val('');
            alert("The business listing has been added and is awaiting approval before it will appear on the list.");
            populateBusinessList();
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + JSON.stringify(response.msg));
        }
    });
}

// Event function for the alumni office manager page to verify listings
function approveListing(event) {
    // prevent link from firing
    event.preventDefault();

    // Check and make sure the listing confirmed
    if (confirm('Are you sure you want to approve this listing?')) {
        var busListId = getBusinessListingId($(this).attr('rel'));
        var data = {
            'verified': 1,
            'id': busListId,
            'sessId': sessId
        };

        // Use AJAX to update the listing object using the PUT method
        $.ajax({
            type: 'PUT',
            data: data,
            url: '/listings',
            dataType: 'JSON'
        }).done(function (response) {

            // Check for successful (blank) response
            if (response.msg === '') {
                // Update the tables
                populateBusinessList();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + JSON.stringify(response.msg));

            }
        });
    } else {
        return false;
    }
}

// Filter business listings table according to Location and Business Type criteria
function filterListings(event) {
    // prevent link from firing
    event.preventDefault();

    businessListData.forEach(function (businessListing) {
        var enteredLocation = $('#filterListings input#filterLocation').val().toLowerCase().trim();
        var enteredType = $('#filterListings select#filterBusinessType').val().toLowerCase().trim();
        var enteredOwnerName = $('#filterListings input#filterOwnerName').val().toLowerCase().trim();
        var enteredGradYear = $('#filterListings input#filterGradYear').val().toString().toLowerCase().trim();
        var enteredBusinessName = $('#filterListings input#filterBusinessName').val().toLowerCase().trim();
        var matchedType = (enteredType === "unselected") || (enteredType === businessListing.businessType.toLowerCase().trim());
        var matchedOwnerName = (enteredOwnerName === "") || (businessListing.ownerName.toLowerCase().indexOf(enteredOwnerName) >= 0);
        var matchedLocation = (enteredLocation === "") || (businessListing.location.toLowerCase().indexOf(enteredLocation) >= 0);
        var matchedGradYear = (enteredGradYear === "") || (businessListing.gradYear.toString().toLowerCase().indexOf(enteredGradYear) >= 0);
        var matchedBusinessName = (enteredBusinessName === "") || (businessListing.businessName.toLowerCase().indexOf(enteredBusinessName) >= 0);

        if (matchedType == 1 && matchedLocation == 1 && matchedGradYear == 1 && matchedBusinessName == 1 && matchedOwnerName == 1)
          businessListing.matched = 1;
        else
          businessListing.matched = 0;
    });

    renderBusinessList(true);
}

// Delete Listing
function deleteListing(event) {
    // prevent link from firing
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this listing?');

    // Check and make sure the listing confirmed
    if (confirmation === true) {
        var busListId = getBusinessListingId($(this).attr('rel'));
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/listings/' + busListId + '?sessId=' + sessId
        }).done(function (response) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateBusinessList();
        });

    }
}

function goToPage(page, hideSessId) {
    // jQuery AJAX call for JSON
    location.href= page + (!hideSessId ? "?sessId=" + sessId : '');
}
