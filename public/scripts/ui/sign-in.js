const SignInForm = (function () {
  const initialize = function () {
    console.log("Sign-in form initialized");

    $("#sign-in-form").submit(function (event) {
      event.preventDefault();
      console.log("Sign-in form submitted");

      const username = $("#username").val();
      const password = $("#password").val();

      // Send a signin request
      Authentication.signin(
        username,
        password,
        () => {
          $("#hint").text("Sign in successful,  redirecting to game page...");
          $("#hint").removeClass("text-danger");
          $("#hint").addClass("text-success");
          console.log("Sign in successful");

          // Redirect to the chat page after 0.5 secs
          setTimeout(() => {
            window.location.href = "/game-rooms";
            Socket.connect();
          }, 500);
        },
        (error) => {
          $("#hint").text(error);
          $("#hint").addClass("text-danger");
          console.log("Sign in failed : ", error);
        }
      );
    });
  };

  return {
    initialize,
  };
})();
