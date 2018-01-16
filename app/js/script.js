const form = document.forms[0]

/*=============================================
=            Form Submit Functions            =
=============================================*/

function submitUser() {
  var data = {}
  if (form.email.value) data.email = form.email.value
  if (form.password.value) data.password = form.password.value

  if (!data.email) return displayError('Must provide email')
  if (!data.password) return displayError('Must provide password')
  if (data.password !== form.confirm.value) return displayError('Passwords do not match')

  fetch('/register', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(submitSuccess)
  .catch(submitError)

}

/*=============================================
=            Form Submit Callbacks            =
=============================================*/
function clearForm() {
    form.reset();
    clearError('message');
    var divs = document.getElementsByClassName('hidden');
    for (var i = 0; i < divs.length; i++)
        divs[i].style.display = '';
}

function clearError(target) {
    if (target === 'message')
        return document.getElementById('js-error-message').style.visibility = 'hidden';
    target.style.border = '1px solid #888';
}


function submitSuccess(res) {
    if (!res.ok) {
      return submitError(res);
    }
    var modal = document.getElementById('js-success');
    modal.style.display = 'block';
    clearForm();
}

function submitError(res, message) {
    if (res.status >= 400 && res.status < 500)
        return res.text().then(function(message) {displayError(message)});
    if (message)
        return displayError(message);
}

function displayError(message) {
    var errorDiv = document.getElementById('js-error-message');
    errorDiv.innerHTML = message;
    errorDiv.style.visibility = 'visible';
}

var x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(storePosition)
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function storePosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;

    var userLocation = {
        id: localStorage.id,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    console.log(userLocation)
    fetch('/location', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(userLocation)
    }).then(function(res) {
        if (!res.ok) {
            res.text().then(function(message) {
                alert(message)
            })
        }
        res.json().then(function(data) {
            alert("location stored")
            window.location = '/'
        })
    }).catch(function(err) {
        console.error(err)
    })
}
