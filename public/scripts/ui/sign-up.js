const SignUpForm = (function () {
  const initialize = function () {
    console.log("Sign-up form initialized");

    $("#sign-up-form").submit(function (event) {
      event.preventDefault();
      console.log("Sign-up form submitted");

      const username = $("#username").val();
      const password = $("#password").val();
      const confirmPassword = $("#confirm-password").val();

      if (password !== confirmPassword) {
        $("#hint").text("Passwords do not match");
        $("#hint").addClass("text-danger");
        return;
      }

      // Send a signin request
      Authentication.signup(
        username,
        password,
        () => {
          $("#hint").text("Sign-up successful");
          $("#hint").addClass("text-success");
          console.log("Sign-up successful");
        },
        (error) => {
          $("#hint").text(error);
          $("#hint").addClass("text-danger");
          console.log("Sign-up failed : ", error);
        }
      );
    });
  };

  return {
    initialize,
  };
})();
