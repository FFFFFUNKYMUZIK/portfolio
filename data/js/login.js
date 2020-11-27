const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();

    const password = loginForm.password.value;
    if (!(password && password.trim())){
      alert('password empty');
      return;
    }

    fetch('/login', {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        id : 'dummy',
        pw : password,
      }),
      redirect: 'follow'
    })
    .then((res) =>{

       if (res.url === window.location.href){
            loginErrorMsg.style.opacity = 1;
            loginForm.password.value = '';
            /* TODO : async sleep & turn off the error message with count which is protected by mutex-like mechanism */
       }
       else if (res.redirected){
          /* manual redirect */
          /* alert("Welcome!"); */
          window.location.href = res.url;
          location.reload();
        }
    });
})

/*
function resizeToMinimum(w,h){
    w=w>window.outerWidth?w:window.outerWidth;
    h=h>window.outerHeight?h:window.outerHeight;
    window.resizeTo(w, h);
};
window.addEventListener('resize', function(){resizeToMinimum(320,240)}, false);
*/
/*
window.onresize = function() {
    if (window.innerWidth < 900 || window.innerHeight < 600) {
        window.resizeTo(1024,800);
    }
  };
  */