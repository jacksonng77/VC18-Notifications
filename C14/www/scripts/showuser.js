(function () {

    var profileuserid;
    var profileemail;

    $(document).on("pagebeforecreate", function () {
        printheader();
    });

    $(document).ready(function () {
        showfriend();

        $("#btnAddFriend").bind("click", function () {
            addfriend();
        });

    });

    function showfriend(userid) {
        var url = serverURL() + "/getprofile.php";

        profileuserid = decodeURIComponent(getUrlVars()["userid"]);

        var JSONObject = {
            "userid": decodeURIComponent(getUrlVars()["userid"]),
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _showfriendResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _showfriendResult(arr) {
        if (arr[0].currentlocation.trim() === "") {
            $("#lblProfileLocation").html("Location: Not specified");
        }
        else {
            $("#lblProfileLocation").html("Current Location: <a href='#' id='btnMap'>" + arr[0].currentlocation + "</a>");

            $("#btnMap").bind("click", function () {
                showmap(arr[0].currentlocation.trim());
            });
        }

        profileemail = arr[0].email;
        $("#imgProfileImage").attr("src", serverURL() + "/images/" + arr[0].profileimage);
        $("#lblProfileUsername").html(arr[0].userid);
        $("#lblProfileDescription").html(arr[0].description);
        getRelationships();

    }

    function showmap(location) {
        var ref = window.open('http://maps.google.com/maps?q=' + location, '_blank', 'location=no,toolbar=no');
        ref.show();
    }

    function getRelationships() {
        var url = serverURL() + "/getrelationships.php";

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _getRelationshipsResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _getRelationshipsResult(arr) {

        $('#selMeRelationship')
            .find('option')
            .remove()
            .end();

        $("#selMeRelationship").append($("<option>", {
            value: "-1",
            text: "select a relationship"
        }));

        for (var i = 0; i < arr.length; i++) {
            $("#selMeRelationship").append($("<option>", {
                value: arr[i].relationshipid,
                text: arr[i].description
            }));
        }

        $("#selMeRelationship").val("-1").change();
    }

    function addfriend() {
        if (_validate()) {
            var url = serverURL() + "/newfriend.php";

            var JSONObject = {
                "userid": localStorage.getItem("userid"),
                "friendid": profileuserid,
                "relationshipid": $('#selMeRelationship').val()
            };

            $.ajax({
                url: url,
                type: 'GET',
                data: JSONObject,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (arr) {
                    _getAddFriendResult(arr);
                },
                error: function () {
                    validationMsg();
                }
            });
        }
        else {
            validationMsgs("Please select a relationship", "Error", "OK");
        }
    }

    function _getAddFriendResult(arr) {
        if (arr[0].result === 1) {
            validationMsgs("Friend added.", "Info", "OK");
            informUser(profileemail);
        }
        else {
            validationMsgs("Friend not added. Was this person already your friend?", "Error", "OK");
        }
    }

    function informUser(you) {
        var url = serverURL() + "/newnotifications.php";

        var JSONObject = {
            "emails": you,
            "message": localStorage.getItem("userid") + " has added you as a friend.",
        };
        alert(localStorage.getItem("userid") + " has added you as a friend.");
        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _getInformUserResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _getInformUserResult() {
        if (arr[0].result !== 1) {
            validationMsgs("Friend not informed", "Error", "OK");
        }
    }

    function _validate() {
        if ($('#selMeRelationship').val() === "-1") {
            return false;
        }
        else {
            return true;
        }
    }  


})();