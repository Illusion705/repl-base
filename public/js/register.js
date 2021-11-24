// show password
$("#show-password").change(() => {
  if ($("#show-password").is(":checked")) {
    $("#password").attr("type", "text");
    $("#confirm-password").attr("type", "text");
  } else {
    $("#password").attr("type", "password");
    $("#confirm-password").attr("type", "password");
  }
});

// next button disable/enable
async function checkValidUsername() {
  let username = $("#username").val();

  if (username.length > 2 || username == "") {
    for (let i = 0; i < username.length; i++) {
      if (!"abcdefghijklmnopqrstuvwxyz1234567890-_".includes(username[i])) {
        return "Username can only contain characters a-z, 0-9, -, and _";
      }
    }

    if (username == "") {
      return "";
    }

    return await fetch("/api/username/" + username)
      .then(response => response.json())
      .then(data => {
        if (data.status == "available") {
          return ""; 
        } else {
          return "Username taken";
        }
      });
  } else {
    return "Username must contain 3 or more characters";
  }
}

function checkValidPassword() {
  let password = $("#password").val();
  let confirmPassword = $("#confirm-password").val();

  if (password.length > 7 || !password) {
    if (password == confirmPassword || !password || !confirmPassword) {
      return "";
    } else {
      return "Passwords don't match";
    }
  } else {
    return "Password must contain 8 or more characters";
  }
}

function checkValidPasswordConfirmation() {
  let password = $("#password").val();
  let confirmPassword = $("#confirm-password").val();

  if (password == confirmPassword || !password || !confirmPassword) {
    return "";
  } else {
    return "Passwords don't match";
  }
}

async function updateNextButtonState() {
  if (await checkValidUsername() != "" || checkValidPassword() != "" || checkValidPasswordConfirmation() != "" || !$("#username").val() || !$("#password").val() || !$("#confirm-password").val()) {
    $("#next-button").css("background", "#26596b");
    $("#next-button").css("cursor", "not-allowed");
    $("#next-button").attr("disabled", true);
  } else {
    $("#next-button").css("background", "#4196b5");
    $("#next-button").css("cursor", "pointer");
    $("#next-button").attr("disabled", false);
  }
}

updateNextButtonState();

$("#username").on("keyup paste change", async () => {
  updateNextButtonState();

  if ($("#username-alert").text() != await checkValidUsername()) {
    $("#username-alert").text("");
  }
});

$("#username").on("focusout", async () => {
  $("#username-alert").text(await checkValidUsername());
});

$("#password").on("keyup paste change", () => {
  updateNextButtonState();

  if ($("#password-alert").text() != checkValidPassword()) {
    $("#password-alert").text("");
  }
  if ($("#confirm-password-alert").text() != checkValidPasswordConfirmation()) {
    $("#confirm-password-alert").text("");
  }
});

$("#password").on("focusout", () => {
  $("#password-alert").text(checkValidPassword());
});

$("#confirm-password").on("keyup paste change", () => {
  updateNextButtonState();

  if ($("#password-alert").text() != checkValidPassword()) {
    $("#password-alert").text("");
  }
  if ($("#confirm-password-alert").text() != checkValidPasswordConfirmation()) {
    $("#confirm-password-alert").text("");
  }
});

$("#confirm-password").on("focusout", () => {
  $("#confirm-password-alert").text(checkValidPasswordConfirmation());
});

// next button click
$("#next-button").click(() => {
  let translateX1 = 0;
  let animation1 = setInterval(() => {
    $("#account-info").css("transform", `translateX(${translateX1}px)`);
    $("#connect-replit-account").css("transform", `translateX(${translateX1}px)`);
    translateX1 -= 8

    if (translateX1 == -248) {
      clearInterval(animation1);
      $("#step").text("Step 2: Connect Replit Account");
    }
  }, 5);
});