function printheader() {
    $("#header").html("<h1>FriendsZone</h1>");
    $("#header").append("<a href='#' id='btnHome' class='ui-btn ui-icon-home ui-btn-icon-left'>Home</a><a href='#' id='btnLogout' data-icon='power' class='ui-btn-right'>Logout</a>");

    var navbarstr = "<div data-role='navbar'><ul>";
    navbarstr += "<li><a id='btnLocation' href='#' data-icon='location'>Location</a></li>";
    navbarstr += "<li><a id='btnProfile' href='#' data-icon='user'>Profile</a></li>";
    navbarstr += "<li><a id='btnSearch' href='#' data-icon='search'>Search</a></li>";
    navbarstr += "</ul></div>";

    var myNavbar = $(navbarstr);
    $("#header").append(myNavbar).trigger('create');

    $("#btnLocation").bind("click", function () {
        window.location = "location.html";
    });

    $("#btnProfile").bind("click", function () {
        window.location = "profile.html";
    });

    $("#btnSearch").bind("click", function () {
        window.location = "search.html";
    });

    $("#btnHome").bind("click", function () {
        window.location = "me.html";
    });

    $("#btnLogout").bind("click", function () {
        localStorage.removeItem("userid");
        localStorage.removeItem("password");
        window.location = "index.html";
    });
 }

function serverURL() {
    return "http://jacksonng.org/friendszone";
}

function validationMsgs(message, title, button) {
    navigator.notification.alert(
        message,
        function () { },
        title,
        button
    );
}

function validationMsg() {
    validationMsgs("Unable to connect to server. Please try again later.", "Connection Problem", "OK");
}

function getRadioValue(groupName) {
    var _result;
    try {
        var o_radio_group = document.getElementsByName(groupName);
        for (var a = 0; a < o_radio_group.length; a++) {
            if (o_radio_group[a].checked) {
                _result = o_radio_group[a].value;
                break;
            }
        }
    } catch (e) { }
    return _result;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
