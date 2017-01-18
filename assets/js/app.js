"use strict"
var showsAry = ["FAMILY GUY", "THE SIMPSONS", "SOUTHPARK", "RICK AND MORTY", "ROBOT CHICKEN"];
var showOffset = [0, 0, 0, 0, 0];

function initPage() {
  var i;
  for (i = 0; i < showsAry.length; i++) {
    addButton(showsAry[i]);
  }
  $(".dropdown").hide();
}

function ReSize() {
  if ($(window).width() <= 480) {
    $("button").attr("class", "btn btn-primary btn-xs");
    $("#tv").css({
      "height": "125px",
      "top": "5px",
      "left": "5px",
    });
    $("#lucy").css({
      "height": "100px",
      "left": "-168px",
    });
    $("#add").css({
      "top": "5px",
      "left": "10px",
    });
    $("#clear").css({
      "top": "5px",
      "left": 0,
    });
    $("#add").attr("class", "col-xs-8");
    $("#clear").attr("class", "col-xs-3");
    $(".gif").each(function() {
      if ($(this).attr("state") == "still") {
        $(this).attr("src", $(this).attr("small_still_url"));
      } else {
        $(this).attr("src", $(this).attr("small_animated_url"));
      }
    });
  } else if ($(window).width() <= 768) {
    $("button").attr("class", "btn btn-primary btn-sm");
    $("#tv").css({
      "height": "200px",
      "top": "5px",
      "left": "-248px",
    });
    $("#lucy").css({
      "height": "150px",
      "left": "-518px",
    });
    $("#add").css({
      "top": "5px",
      "left": "300px",
    });
    $("#clear").css({
      "top": "5px",
      "left": "290px",
    });
    $("#add").attr("class", "col-sm-3");
    $("#clear").attr("class", "col-sm-1");
    $(".gif").each(function() {
      if ($(this).attr("state") == "still") {
        $(this).attr("src", $(this).attr("small_still_url"));
      } else {
        $(this).attr("src", $(this).attr("small_animated_url"));
      }
    });
  } else if ($(window).width() <= 980) {
    $("#tv").css({
      "height": "220px",
      "top": "10px",
      "left": "25px",
    });
    $("#lucy").css({
      "height": "165px",
      "left": "-271px",
    });
    $("#add").css({
      "top": "38px",
      "left": "-160px",
    });
    $("#clear").css({
      "top": "5px",
      "left": "-160px",
    });
    $("button").attr("class", "btn btn-primary btn-md");
    $("#images").attr("class", "col-md-9");
    $("#add").attr("class", "col-md-2");
    $("#clear").attr("class", "col-md-1");
    $(".gif").each(function() {
      if ($(this).attr("state") == "still") {
        $(this).attr("src", $(this).attr("still_url"));
      } else {
        $(this).attr("src", $(this).attr("animated_url"));
      }
    });
  } else {
    $("#tv").css({
      "height": "220px",
      "top": "10px",
      "left": "25px",
    });
    $("#lucy").css({
      "height": "165px",
      "left": "-271px",
    });
    $("#add").css({
      "top": "40px",
      "left": "-160px",
    });
    $("#clear").css({
      "top": "5px",
      "left": "-160px",
    });
    $("button").attr("class", "btn btn-primary btn-md");
    $("#images").attr("class", "col-lg-8");
    $("#add").attr("class", "col-lg-2");
    $("#clear").attr("class", "col-lg-1");
    $(".gif").each(function() {
      if ($(this).attr("state") == "still") {
        $(this).attr("src", $(this).attr("still_url"));
      } else {
        $(this).attr("src", $(this).attr("animated_url"));
      }
    });
  }
}

function displayShow(title) {

  var formattedTitle = title.replace(" ", "+").toLowerCase();
  // build the query
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + formattedTitle + "&limit=10&offset=" + showOffset[showsAry.indexOf(title)];
  console.log("queryURL = " + queryURL);
  // fetch
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    var i;
    console.log(response);
    // response should be an array of 10 objects
    var stillImageUrl;
    var animatedImageUrl;
    var smallStillImageUrl;
    var smallAnimatedImageUrl;
    var thisStill;

    // so that we don't keep reaching for the same 10 gifs
    showOffset[showsAry.indexOf(title)] += 10;

    // present the user with the 10 gifs
    for (i = 0; i < response.data.length; i++) {
      smallStillImageUrl = response.data[i].images.fixed_height_small_still.url;
      smallAnimatedImageUrl = response.data[i].images.fixed_height_small.url;
      stillImageUrl = response.data[i].images.original_still.url;
      animatedImageUrl = response.data[i].images.original.url;
      if (screen.width <= '768') {
        // use the small gifs for phones
        thisStill = smallStillImageUrl;
      } else {
        thisStill = stillImageUrl;
      }
      // in this row, create an image for the show
      var img = $("<img>");
      // a p element to hold the rating
      var p = $("<p>");
      // we have to append first, then we can set attributes
      $("#images").append(img).append(p);
      // configure the gif
      img.attr("src", thisStill);
      img.attr("alt", title);
      img.attr("still_url", stillImageUrl);
      img.attr("animated_url", animatedImageUrl);
      img.attr("small_still_url", smallStillImageUrl);
      img.attr("small_animated_url", smallAnimatedImageUrl);
      img.attr("class", "gif");
      img.attr("state", "still");
      // add the rating
      p.html("Rating: " + response.data[i].rating);
      ReSize();
    }
  }).fail(function(err) {
    // user entered bogus search param
    // remove the show from the array
    showsAry.pop();
    showOffset.pop();
    throw err;
  });
}

function toggleGif(gif) {
  if ($(gif).attr("state") == "still") {
    $(gif).attr("src", $(gif).attr("animated_url"));
    $(gif).attr("state", "animated");
  } else {
    $(gif).attr("src", $(gif).attr("still_url"));
    $(gif).attr("state", "still");
  }
}

function addButton(title) {
  var btn = $("<button>");
  $("#buttons").append(btn);
  // configure the button
  btn.html(title);
  btn.attr("id", "shows");
  btn.data("title", title);
  ReSize();
}

$(document).ready(function() {

  initPage();

  $("body").on("click touch", "img", function() {
    toggleGif($(this));
  });

  $("body").on("click touch", "#shows", function() {
    // clear out any previous images or list items
    $("#images").empty();
    $(".dropdown-content").empty();
    $(".dropdown").hide();
    // go get the gifs
    displayShow($(this).data("title"));
  });

  // clear everything except the show buttons
  $("#clear-btn").on("click", function() {
    $("#images").empty();
    $("#list").empty();
    $(".dropdown").hide();
    $("#newShowName").val("")
  });

  $("#addShow").on("click", function() {
    var newName = $("#newShowName").val().toUpperCase();
    var i;
    // go ahead and clear out the gifs and the list if it isn't empty
    $("#images").empty();
    $("#list").empty();
    if (newName == "") {
      return false;
    }
    // check to see if it is already on the page
    if (showsAry.indexOf(newName) >= 0) {
      alert("This show is aready on the page");
    } else {
      // Let's find out if this is really a tv show
      // set up the AJAX query
      var queryURL = "https://api.tvmaze.com/search/shows?q=" + newName;
      // go get the data
      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(response) {
        // console.log(response);

        // Good test shows:
        // "top gear" will return the full list of 10 candidates
        // "son of zorn" will return a single candidate (simply gets added without presenting the list)
        // "criminal minds" will give 3 potential candidates

        if (response.length == 0) {
          // nope.  it's not a TV show
          alert("that's not a TV show.  Try again.");
          $("#newShowName").val("");
          return false;
        } else if (response.length == 1) {
          // query returned a single result
          // push the appropriate data into both arrays
          showsAry.push(response[0].show.name.toUpperCase());
          showOffset.push(0);
          // add the button
          addButton(response[0].show.name.toUpperCase());
        } else {
          // show the user's the options and let them pick the correct one
          $("#dropbtn").html("Which \"" + response[0].show.name + "?\"<br>");
          for (i = 0; i < response.length; i++) {
            // console.log("i=" + i);
            var item = $("<li>");
            var image = $("<img>");
            var p = $("<p>");
            item.addClass("list-item list-image");
            item.attr("showName", response[i].show.name);
            p.addClass("col-xs-10 col-sm-10 col-md-10 col-lg-10");
            image.addClass("col-xs-2 col-sm-2 col-md-2 col-lg-2");
            image.attr("src", response[i].show.image.medium);
            image.attr("alt", response[i].show.name);
            image.attr("height", "100");
            // clear it out from the last time through the loop
            var imgContent = "";
            var pContent = "";

            pContent = "<strong>Show Name: </strong>" + response[i].show.name + "<br><strong>Premier Date: </strong>" + response[i].show.premiered + "<br>";
            // not all shows will have a network associated with them
            // either way, put an hr tag on the end to separate list items
            if (response[i].show.network != null) {
              pContent += "<strong>Network: </strong>" + response[i].show.network.name + "<br><strong>Summary: </strong>" + response[i].show.summary + "<hr>";
            } else {
              pContent += "<strong>Summary: </strong>" + response[i].show.summary + "<hr>";
            }
            // set the content
            item.html(pContent);
            // add to page
            $(item).prependTo($("#list"));
            $(image).prependTo($(item));
            $(image).append(p);
          }
          // show the hidden dropdown list
          $(".dropdown").show();
          ReSize();
          return false;
        }
      }).fail(function(err) {
        // user entered bogus search param
        // remove the show from the array
        throw err;
      });
    }
    // clear out the text box
    $("#newShowName").val("");
    ReSize();
    return false;
  });

  $("body").on("click touch", ".list-item", function() {
    var show = $(this).attr("showName")
      // add the button to the page
    addButton(show.toUpperCase());
    // push the correct data to the arrays
    showsAry.push(show.toUpperCase());
    showOffset.push(0)
      // clear out and hide the dropdown list
    $("#list").empty();
    $(".dropdown").hide();

  });

  $(window).resize(function() {
    ReSize();
  });

  ReSize();
});

