$("document").ready(homePageIsReady);

//--------------------------------------------------------
// running when document is ready
//--------------------------------------------------------
function homePageIsReady() {

    // get and show all artists
    get_artists();

    // add artist click listener --> open the form
    $(".add_artist").click(function(e) {
        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];

        // open the modal
        span.onclick = function() {
            modal.style.display = "none";
        }
        modal.style.display = "block";

        // client-side form validation of the inputes
        formValidation();
        // process the form
        $("#artist_form").submit(function(event) {
            if (!$("#artist_form").valid()) return;
            // get the variables from the form fileds
            var details = getFormVariables();
            // ajax request --> add artist
            addArtist(details);
            modal.style.display = "none";
            event.preventDefault();
        });
    });
}

//--------------------------------------------------------
// client-side validation of the form fields
//--------------------------------------------------------
function formValidation() {
    $("form[name='artist_form']").validate({
        rules: {
            id_field: {
                required: true,
                digits: true
            },
            birthyear: {
                required: true,
                digits: true,
                maxlength: 4, // birth year limited by 4 digits
                minlength: 3
            }
        },
        // Specify validation error messages
        messages: {
            field_id: "Please enter only digits"
        }
    });
}

//--------------------------------------------------------
// get all the fileds values (artist details)
//--------------------------------------------------------
function getFormVariables() {
    return [$("#art_name").val(),
        $("#id_field").val(),
        $("#birthyear").val(),
        $("#img_url").val()
    ]
}

//--------------------------------------------------------
// send the artist detailes to the related function in the server-side
//--------------------------------------------------------
function addArtist(artistDetails) {
    console.log("add artist - client");
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: 'http://localhost:3001/artists', // the url where we want to POST
        contentType: 'application/json',
        data: JSON.stringify({
            "name": artistDetails[0],
            "id": artistDetails[1],
            "birth_year": artistDetails[2],
            "picture": artistDetails[3],
            "songs": []
        }),
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            console.log(data);
            document.getElementById("artist_form").reset(); //reset the form
            get_artists(); //TODO uncomment
            // show_artists(data);
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

//--------------------------------------------------------
// send GET request to get the artists list (sorted)
//--------------------------------------------------------
function get_artists() {
    console.log("get artists - client");
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3001/artists',
        success: function(data) {
            console.log(data);
            show_artists(data);
        },
        error: function(data) {
            alert(data);
        }
    });
}

//--------------------------------------------------------
// send DELETE request to delete an artist
//--------------------------------------------------------
function delArtist(e) {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3001/artists/' + e.target.id,
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            console.log(data);
            get_artists();
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

//--------------------------------------------------------
// send POST request to add song to an artist
//--------------------------------------------------------
function addSong(e) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3001/songs/' + e.target.id,
        dataType: 'text',
        data: $("#in" + e.target.id).val(),
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            console.log(data);
            get_artists();
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

//--------------------------------------------------------
// send DELETE request to delete song of an artist
//--------------------------------------------------------
function delSong(e) {
    var song_id = e.target.id
    var artist_id = song_id.substr(0, song_id.indexOf("d"));
    var song_id = song_id.substr(song_id.indexOf("l") + 1, song_id.length);
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3001/songs/' + artist_id,
        dataType: 'text',
        data: song_id,
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            console.log(data);
            get_artists();
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

//--------------------------------------------------------
// the front-end side --> show the list, add buttons & listeners
//--------------------------------------------------------
function show_artists(data) {
    $("table").remove(); // remove the previous elements
    for (val in data) {
        // add table, and generic buttons for each artist
        var mylist = $("<table></table>");
        mylist.append("<br>");
        mylist.append($("<tr></tr>"));
        var button1 = $('<input class="delart" id="' + data[val].id + '" type="button" value="delete artist">');
        mylist.append(button1);
        var button2 = $('<input class="addsong" id="' + data[val].id + '" type="button" value="add song">');
        mylist.append(button2);
        var input = $('<input class="in" id="in' + data[val].id + '" type="input" placeholder="Song name...">');
        mylist.append(input);
        mylist.append($("<tr></tr>"));
        for (i in data[val]) {
            // ignore the mongo information
            if (data[val][i] == data[val]._id || data[val][i] == data[val].createdAt ||
                data[val][i] == data[val].updatedAt || data[val][i] == data[val].__v) {
                continue;
            }
            mylist.append($("<tr></tr>"));
            mylist.append($("<th></th>").text(i));

            if (data[val][i] == data[val].picture) {
                mylist.append('<img src="' + data[val][i] + '">');
                continue;
            }
            // if this is the songs field --> need another table
            if (Array.isArray(data[val][i])) {
                var songs = $("<table></table>");
                for (j in data[val][i]) {
                    songs.append($("<tr></tr>"));
                    songs.append($("<td></td>").text(data[val][i][j]));
                    songs.append($("<td></td>"));
                    var button = $('<input class="deletebtn" id="' + data[val].id + "del" + j + '" type="button" value="delete">');
                    songs.append(button);
                }
                songs.appendTo(mylist);
                continue;
            }
            // else --> append the field and value
            mylist.append($("<td></td>").text(data[val][i]));
        }
        // add space between artists
        mylist.append($("<tr></tr>"));
        mylist.append("<br>");
        mylist.appendTo($("#artists_list"));
    }

    // add event listeners
    $(".delart").click(function(e) {
        delArtist(e);
    });
    $(".addsong").click(function(e) {
        if ($("#in" + e.target.id).val() == '') return;
        addSong(e);
    });
    $(".deletebtn").click(function(e) {
        delSong(e);
    });
}