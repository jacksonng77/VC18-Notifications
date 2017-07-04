(function () {

    $(document).on("pagebeforecreate", function () {
        printheader();
    });

    $(document).ready(function () {
        $("#SearchForm").validate({
            messages: {
                txtSearchTerm: "enter search term"
            },
            focusInvalid: false,
            submitHandler: function () {
                return false;
            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parent().parent().after());
            },
        });

        $("#btnSearchFriend").bind("click", function () {
            if ($("#SearchForm").valid()) {
                searchfriend();
            }
        });
    });

    function searchfriend() {
        var url = serverURL() + "/searchfriends.php";

        var JSONObject = {
            "userid": localStorage.getItem("userid"),
            "search": $("#txtSearchTerm").val()
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _getSearchResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _getSearchResult(arr) {

        var t;

        if ($.fn.dataTable.isDataTable('#searchresult')) {
            t = $('#searchresult').DataTable();
        }
        else {
            t = $('#searchresult').DataTable({
                "searching": false,
                "lengthChange": false
            });
        }

        t.clear();
        for (var i = 0; i < arr.length; i++) {
            t.row.add([
                arr[i].userid,
                "<img src='" + serverURL() + "/images/" + arr[i].profileimage + "_s" + "' width='50'>",
                arr[i].currentlocation,
                "<a href='#' class='ui-btn' id='btn" + arr[i].userid + "'>View</a>"
            ]).draw(false);

            $("#btn" + arr[i].userid).bind("click", { id: arr[i].userid }, function (event) {
                var data = event.data;
                showfriend(data.id);
            });

        }
        $("#searchresult").show();
    }

    function showfriend(userid) {
        window.location = "showuser.html?userid=" + userid;
    }

})();