(function () {

    $(document).on("pagebeforecreate", function () {
        printheader();
    });

    $(document).ready(function () {
        $("#UpdateLocationForm").validate({
            messages: {
                txtNewLocation: "new location is required",
            },
            focusInvalid: false,
            submitHandler: function () {
                return false;
            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parent().parent().after());
            },
        });

        $("#btnUpdateLocation").bind("click", function () {
            if ($("#UpdateLocationForm").valid()) {
                setLocation();
            }
        });

        getcurrentlocation();

    });

    function getcurrentlocation() {
        var url = serverURL() + "/getcurrentlocation.php";

        var JSONObject = {
            "userid": localStorage.getItem("userid")
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _getLocationResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _getLocationResult(arr) {
        if (arr[0].currentlocation.trim() !== "") {
            $("#currentLocation").html("Current Location: <a href='#' id='btnMap'>" + arr[0].currentlocation + "</a>");

            $("#btnMap").bind("click", function () {
                showmap(arr[0].currentlocation.trim());
            });
        }
        else {
            $("#currentLocation").html("Current Location: Not Available");
        }
    }

    function showmap(location) {
        var ref = window.open('http://maps.google.com/maps?q=' + location, '_blank', 'location=no,toolbar=no');
        ref.show();
    }

    function setLocation() {
        var url = serverURL() + "/savenewlocation.php";

        var JSONObject = {
            "userid": localStorage.getItem("userid"),
            "location": $("#txtNewLocation").val()
        };
 
        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _saveLocationResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _saveLocationResult(arr) {
        if (arr[0].result === 1) {
            getcurrentlocation();
        }
        else {
            validationMsgs("Unable to update location", "Validation", "Try Again");
        }
    }

})();