const Authentication = (function () {
  // This stores the current signed-in user
  let user = null;

  // This function gets the signed-in user
  const getUser = function () {
    return user;
  };

  // This function sends a sign-in request to the server
  const signin = function (username, password, onSuccess, onError) {
    const data = JSON.stringify({ username, password });
    fetch("/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.status === "error") {
          if (onError) {
            return onError(json.message);
          }
        } else {
          if (onSuccess) {
            user = json.user;
            return onSuccess();
          }
        }
      });
  };

  // This function sends a validate request to the server
  const validate = function (onSuccess, onError) {
    fetch("/auth/validate", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.status === "error") {
          if (onError) {
            return onError(json.message);
          }
        } else {
          if (onSuccess) {
            user = json.user;
            return onSuccess();
          }
        }
      });
  };

  // This function sends a sign-out request to the server
  const signout = function () {
    fetch("/auth/sign-out", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json);
        if (json.status === "success") {
          window.location.href = "/";
        }
      });
  };

  // This function sends a register request to the server
  const signup = function (username, password, onSuccess, onError) {
    const data = JSON.stringify({ username, password });
    fetch("/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.status === "error") {
          if (onError) {
            return onError(json.message);
          }
        } else {
          if (onSuccess) {
            return onSuccess();
          }
        }
      });
  };

  return { getUser, signin, validate, signout, signup };
})();
