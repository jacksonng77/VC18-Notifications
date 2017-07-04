(function () {

    var userid;
    var email;
    var password;
    var description;
    var profileimage;
    var imgNewUserPictureName;

    $(document).on("pagebeforecreate", function () {
        printheader();
    });

    $(document).ready(function () {

        getProfile();

        $("#ChangePasswordForm").validate({
            rules: {
                txtNewPasswordAgain: {
                    equalTo: "#txtNewPassword"
                }
            },
            messages: {
                txtOldPassword: "old password is required",
                txtNewPassword: "new password is required",
                txtNewPasswordAgain: "new password again is required and must be the same as new password",
            },
            focusInvalid: false,
            submitHandler: function () {
                return false;
            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parent().parent().after());
            },
        });

        $("#btnSavePassword").bind("click", function () {

            if ($("#ChangePasswordForm").valid()) {
                changePassword();
            }
        });

        $("#btnSelectImage").bind("click", function () {
            capturePhoto();
        });

        $("#btnSaveDescription").bind("click", function () {
            changeDescription();
        });

    });


    //Profile Section
    function getProfile() {
        var url = serverURL() + "/getprofile.php";

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
                _getProfileResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _getProfileResult(arr) {
        userid = arr[0].userid;
        email = arr[0].email;
        password = arr[0].password;
        description = arr[0].description;
        profileimage = arr[0].profileimage;

        $("#txtProfileUsername").html("User ID: " + userid);
        $("#txtProfileEmail").html("Email: " + email);
        $("#txtDescription").val(description);
        $("#imgProfilePicture").attr("src", serverURL() + "/images/" + profileimage + "_s");
    }

    //Password Section
    function changePassword() {
        var oldpassword = $("#txtOldPassword").val();
        var newpassword = $("#txtNewPassword").val();

        var url = serverURL() + "/savenewpassword.php";

        var JSONObject = {
            "userid": localStorage.getItem("userid"),
            "oldpassword": oldpassword,
            "newpassword": newpassword
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _changePasswordResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _changePasswordResult(arr) {
        if (arr[0].result === 1) {
            localStorage.setItem($("#txtNewPassword").val(), userid);
            validationMsgs("Password changed", "Validation", "OK");

            $("#txtOldPassword").val("");
            $("#txtNewPassword").val("");
            $("#txtNewPasswordAgain").val("");
        }
        else {
            validationMsgs("Password update failed", "Validation", "Try Again");
        }
    }


    //Description Section
    function changeDescription() {
        var newdescription = $("#txtDescription").val();

        var url = serverURL() + "/savenewdescription.php";

        var JSONObject = {
            "userid": localStorage.getItem("userid"),
            "description": newdescription
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _changeDescriptionResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _changeDescriptionResult(arr) {
        if (arr[0].result === 1) {
            validationMsgs("Description changed", "Validation", "OK");
        }
        else {
            validationMsgs("Description update failed", "Validation", "Try Again");
        }
    }

    //Profile Image Section
    function capturePhoto() {
        var source = navigator.camera.PictureSourceType.PHOTOLIBRARY;
        navigator.camera.getPicture(_onPhotoURISuccess, _failCapture, { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: source });
    }

    function _failUpload(error) {
        validationMsgs("Error:" + error.code, "Upload Error", "Try Again");
    }

    function _failCapture(message) {
        validationMsgs("Error:" + message, "Image Error", "Try Again");
    }

    function _onPhotoURISuccess(imageURI) {
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        options.chunkedMode = false;
        options.headers = { Connection: "close" };
        var ft = new FileTransfer();
        ft.upload(imageURI, serverURL() + "/upload.php", _winUpload, _failUpload, options);
    }

    function _winUpload(r) {
        if (profileimage !== "") {
            _deleteOldImg(profileimage);
        }
        var arr = JSON.parse(r.response);
        imgNewUserPictureName = arr[0].result;
        $("#imgProfilePicture").attr("src", serverURL() + "/images/" + imgNewUserPictureName + "_s");

        var url = serverURL() + "/savenewimage.php";

        var JSONObject = {
            "userid": localStorage.getItem("userid"),
            "profileimage": imgNewUserPictureName
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _saveImageResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _saveImageResult(arr) {
        if (arr[0].result === 1) {
            validationMsgs("Update success", "Validation", "OK");
            profileimage = imgNewUserPictureName;
        }
        else {
            validationMsgs("Update failed", "Validation", "Try Again");
        }
    }

    function _deleteOldImg(oldImg) {
        var url = serverURL() + "/deleteimg.php";

        var JSONObject = {
            "imgfile": oldImg
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _deleteImgResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _deleteImgResult(arr) {
        if (arr[0].result !== "1") {
            validationMsgs("Error deleteing old image", "Upload Error", "Try Again");
        }
    }

})();