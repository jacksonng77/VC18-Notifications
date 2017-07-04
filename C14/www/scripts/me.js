(function () {

    $(document).on("pagebeforecreate", function () {
        printheader();
    });

    $(document).ready(function () {

        mywall();
        getRelationships();

        $("#WallForm").validate({
            messages: {
                txtShout: "please shout"
            },
            focusInvalid: false,
            submitHandler: function () {
                return false;
            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parent().parent().after());
            },
        });

        $("#btnShout").bind("click", function () {
            writeWall();
        });

        $("#btnMe").bind("click", function () {
            mywall();
        });

        $("#btnFriend").bind("click", function () {
            friendwall();
        });

        $("#btnView").bind("click", function () {
            viewFriendsWall();
        });
    });

    function viewFriendsWall() {
        var url = serverURL() + "/viewwall.php";
        var JSONObject;

        if ($("#selMeRelationship").val() === "-1") {
            JSONObject = {
                "userid": localStorage.getItem("userid"),
                "relationshipid": "",
                "view": "friends"
            };
        }
        else {
            JSONObject = {
                "userid": localStorage.getItem("userid"),
                "relationshipid": $("#selMeRelationship").val(),
                "view": "friends"
            };
        }

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            data: JSONObject,
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _viewfriendswallresult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _viewfriendswallresult(arr) {
        var i;
        
        $("#wallcontentset").empty();
        for (i = 0; i < arr.length; i++) {
            $("#wallcontentset").append("<b>" + arr[i].userid + " " + arr[i].timeofposting + "</b><br/>" + arr[i].message + "<hr>");
        }
        
        $("#relationshipdialog").popup("close");
    }

    function friendwall() {
        $("#relationshipdialog").popup("open");
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

    function mywall() {
        var url = serverURL() + "/viewwall.php";

        var JSONObject = {
            "userid": localStorage.getItem("userid"),
            "relationshipid": "",
            "view": "me"
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _mywallresult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _mywallresult(arr) {
        var i;

        $("#wallcontentset").empty();
        for (i = 0; i < arr.length; i++) {
            $("#wallcontentset").append("<b>" + arr[i].timeofposting + "</b><br/>" + arr[i].message + "<hr>");
        }
    }


    function writeWall() {
        if ($("#WallForm").valid()) {

            var url = serverURL() + "/savenewwallpost.php";

            var JSONObject = {
                "userid": localStorage.getItem("userid"),
                "shout": $("#txtShout").val()
            };

            $.ajax({
                url: url,
                type: 'GET',
                data: JSONObject,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (arr) {
                    _writeWallResult(arr);
                },
                error: function () {
                    validationMsg();
                }
            });
        }
    }

    function _writeWallResult(arr) {
        if (arr[0].result === 1) {
            $("#txtShout").val("");
            mywall();
            validationMsgs("Shouted", "Information", "OK");
        }
        else {
            validationMsgs("Shout failed", "Error", "Try Again");
        }
    } 
})();