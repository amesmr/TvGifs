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
  if ($(window).width() <= '480') {
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
  } else if ($(window).width() <= '768') {
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
  } else if ($(this).width() <= '980') {
    $("#tv").css({
      "height": "220px",
      "top": "10px",
      "left": "25px",
    });
    $("#lucy").css({
      "height": "165px",
      "left": "-271px",
    });
    $("button").attr("class", "btn btn-primary btn-md");
    $("#images").attr("class", "col-md-9");
    $("#add").attr("class", "col-md-2");
    $("#clear").attr("class", "col-md-1");
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
    $("button").attr("class", "btn btn-primary btn-md");
    $("#images").attr("class", "col-lg-8");
    $("#add").attr("class", "col-lg-2");
    $("#clear").attr("class", "col-lg-1");
  }
}

function displayShow(title) {

  var formattedTitle = title.replace(" ", "+").toLowerCase();
  // build the query
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + formattedTitle + "&limit=10&offset=" + showOffset[showsAry.indexOf(title)];
  console.log("queryURL = " + queryURL);

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    var i;
    console.log(response);
    // response should be an array of 10 objects
    var stillImageUrl;
    var animatedImageUrl;

    // so that we don't keep reaching for the same 10 gifs
    showOffset[showsAry.indexOf(title)] += 10;

    for (i = 0; i < 10; i++) {
      if (screen.width <= '480') {
        stillImageUrl = response.data[i].images.fixed_height_small_still.url;
        animatedImageUrl = response.data[i].images.fixed_height_small.url;
      } else {
        stillImageUrl = response.data[i].images.original_still.url;
        animatedImageUrl = response.data[i].images.original.url;
      }
      var img = $("<img>");
      var p = $("<p>");
      // we have to append first, then we can set attributes
      $("#images").append(img).append(p);
      // configure the gif
      img.attr("src", stillImageUrl);
      img.attr("alt", title);
      img.attr("still_url", stillImageUrl);
      img.attr("animated_url", animatedImageUrl);
      img.attr("class", "gif");
      img.attr("state", "still");
      p.html("Rating: " + response.data[i].rating);
      ReSize();
    }
  }).fail(function(err) {
    // user entered bogus search param
    // remove the show from the array
    showsAry.pop();
    showOffset.pop()
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

  $("body").on("click", "img", function() {
    if ($(this).attr("state") == "still") {
      $(this).attr("src", $(this).attr("animated_url"));
      $(this).attr("state", "animated");
    } else {
      $(this).attr("src", $(this).attr("still_url"));
      $(this).attr("state", "still");
    }
  });

  $("body").on("click", "#shows", function() {
    $("#images").empty();
    $(".dropdown-content").empty();
    $(".dropdown").hide();
    displayShow($(this).data("title"));
  });

  $("#clear-btn").click(function(event) {
    event.preventDefault();
  });
  $("#clear-btn").on("click", function(event) {
    $("#images").empty();
    $("#list").empty();
    $(".dropdown").hide();
    $("#newShowName").val("")
  });
  $("#addShow").on("click", function(event) {
    event.preventDefault();
    var newName = $("#newShowName").val().toUpperCase();
    var i;
    // go ahead and clear out the gifs
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
      var queryURL = "https://api.tvmaze.com/search/shows?q=" + newName;
      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(response) {
        console.log(response);
        if (response.length == 0) {
          alert("that's not a TV show.  Try again.");
          $("#newShowName").val("");
          return false;
        } else if (response.length > 1) {
          // show the user's the options and let them pick the correct one
          $("#dropbtn").html("Which \"" + response[0].show.name + "?\"<br>");
          for (i = 0; i < response.length; i++) {
            console.log("i=" + i);
            var item = $("<li>");
            item.addClass("list-item list-image");

            var htmlContent = "";
            item.attr("showName", response[i].show.name)
            if (response[i].show.image != null) {
              htmlContent += "<img class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\"  src=" + response[i].show.image.medium + " alt=" + response[i].show.name + " height=100<p class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">";
            }
            htmlContent += " <strong>Show Name: </strong>" + response[i].show.name + "<br><strong>Premier Date: </strong>" + response[i].show.premiered + "<br>";
            if (response[i].show.network != null) {
              htmlContent += "<strong>Network: </strong>" + response[i].show.network.name + "<br><strong>Summary: </strong>" + response[i].show.summary + "<hr></p>";
            } else {
              htmlContent += "<strong>Summary: </strong>" + response[i].show.summary + "<hr></p>";
            }
            item.html(htmlContent);
            $("#list").append(item);
          }
          $(".dropdown").show();
          ReSize();
          return false;
        } else {
          // query returned a single result
          showsAry.push(response[0].show.name.toUpperCase());
          showOffset.push(0);
          addButton(response[0].show.name.toUpperCase());
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

  $("body").on("click", ".list-item", function() {
    var show = $(this).attr("showName")
    addButton(show.toUpperCase());
    // clear out and hide the dropdown list
    showsAry.push(show.toUpperCase());
    showOffset.push(0)
    $("#list").empty();
    $(".dropdown").hide();

  });

  $(window).resize(function() {
    ReSize();
  });

  ReSize();
});
