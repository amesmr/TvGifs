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
  btn.attr("class", "shows btn btn-primary btn-md");
  btn.data("title", title);
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

  $("body").on("click", ".shows", function() {
    $("#images").empty();
    displayShow($(this).data("title"));
  });

  $("#clear").on("click", function() {
    $("#images").empty();
    $("#list").empty();
    $(".dropdown").hide();
    $("#newShowName").val("")
  });

  $("#addShow").on("click", function() {
    var newName = $("#newShowName").val().toUpperCase();
    var i;
    // go ahead and clear out the gifs
    $("#images").empty();
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
          $(".dropbtn").html("Which \"" + response[0].show.name + "?\"");
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
});
