const form = document.forms[0]

/*=============================================
=            Form Submit Functions            =
=============================================*/

function submitUser() {
  // TODO: update keys in data object to match schema
  var data = {}
  if (form.firstName.value) data.firstName = form.firstName.value
  if (form.lastName.value) data.lastName = form.lastName.value
  if (form.email.value) data.email = form.email.value
  if (form.password.value) data.password = form.password.value
  if (form.confirm.value) data.confirm = form.confirm.value
  if (form.phone.value) data.phoneNumber = form.phone.value
  if (form.classYear.value) data.classYear = form.classYear.value
  if (form.house.value) data.house = form.house.value

  if (!data.firstName) return displayError('Must provide first name')
  if (!data.lastName) return displayError('Must provide last name')
  if (!data.email) return displayError('Must provide email')
  if (!data.password) return displayError('Must provide password')
  if (data.password !== form.confirm.value) return displayError('Passwords do not match')
  if (!data.phoneNumber) return displayError('Must provide phone number')
  if (!data.classYear) return displayError('Must provide class year')
  if (!data.house) return displayError('Must provide house')

  fetch('/register', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(function (data) {
    submitSuccess(data)
    window.location = '/classes'
  })
  .catch(submitError)

}

function addClass() {
  var course = ''
  if (form.class.value) course = form.class.value
  else displayError('Need to select a course')

  var stored_courses
  if (localStorage.courses) {
    stored_courses = JSON.parse(localStorage.courses)
    console.log('there are stored courses! ' + stored_courses)
  } else {
    console.log('no stored courses yet')
    stored_courses = []
  }
  
  stored_courses.push(course)
  localStorage.setItem('courses', JSON.stringify(stored_courses))

  window.location = '/classes'
}

function deleteClass(course) {
  var courses = JSON.parse(localStorage.courses)
  courses.map(function (el) {
    el != course
  })
  localStorage.setItem('courses', JSON.stringify(courses))
  renderClasses()
}

function renderClasses() {
  var table_class = document.getElementsByClassName('table')[0]
  var table = document.createElement('table')
  table_class.appendChild(table)
  var courses = JSON.parse(localStorage.courses)

  for (i in courses) {
    var row = document.createElement('tr')
    var el = document.createElement('td')
    el.innerHTML = courses[i] + ' <button class=\'x-button\' onclick=\'deleteClass(\'' + courses[i] + '\')\'>&#10006</button>'

    row.appendChild(el)
    table.appendChild(row)
  }
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
    /*
    var errorDiv = document.getElementById('js-error-message');
    errorDiv.innerHTML = message;
    errorDiv.style.visibility = 'visible';
    */
    alert(message.toString())
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

// authentication
function login() {
  var data = {}
  if (form.email.value) {
    data.email = form.email.value
  } else {
    return displayError('Must provide email')
  }
  if (form.password.value) {
    data.password = form.password.value
  } else {
    return displayError('Must provide password')
  }

  fetch('/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(function (res) {
    if (!res.ok) {alert('ERROR')}
    res.json()
    .then(function (data) {
      console.log('res: ' + JSON.stringify(data))
      localStorage.token = data.token
      localStorage._id = data.userId
      console.log('localStorage.token: ' + localStorage.token + ' localStorage._id: ' + localStorage._id)
      window.location = '/'
    })
  })
  .catch(submitError)
}

function logout(id) {
  console.log('logging out')
  data = { _id: localStorage._id }
  fetch('/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(function (res) {
    localStorage.removeItem('token')
    localStorage.removeItem('_id')
    window.location = '/login'
  })
  .catch(submitError)

  return
}


var tree

function makeTree(classesArray) {
  // initialize tree
  // level 0
  tree = { start: {} }

  // level 1
  tree.start = {
    work: {},
    play: {},
    eat: {}
  }

  // level 2
  for (i in classesArray) {
    tree.start.work[classesArray[i]] = {}
  }

  tree.start.play = {
    chill: {},
    tv: {},
    workout: {},
    'board games': {},
    'video games': {}
  }

  tree.start.eat = {
    dhall: {},
    'eat out': {}
  }
  // level 3
  console.log(tree.start.work)
  for (i in tree.start.work) {
    tree.start.work[i] = {
      hw: {},
      study: {}
    }
  }
  console.log('made tree: ' + JSON.stringify(tree))
}

// dynamically render form options
function renderTree(node) {

  if (!tree) {
    // fetch classes
    console.log("making tree")
    makeTree(['ls1a', 'ec10a', 'cs50', 'sls20'])
  }

  var options = []
  for (i in eval(node))
    options.push(i)

  console.log("options [" + options + "], number of buttons needed: " + options.length)

  var buttons = document.getElementById('buttons')
  buttons.innerHTML = ''
  
  for (i in options) {
    var option = document.createElement('button')
    option.innerHTML = options[i]
    option.setAttribute('onclick', 'renderTree(\'' + node.replace(/'/g, '\\\'') + '[\\\'' + options[i] + '\\\']' + '\')')
    var height = 100 / options.length
    option.setAttribute('style', 'height: ' + height + '%;' + 'font-size: ' + (parseFloat(height)/2.5).toString() + 'vh')
    buttons.appendChild(option)
  }

  var path_id = document.getElementById('path')
  path_id.innerHTML = ''

  // start
  var start_button = document.createElement('button')
  start_button.setAttribute('style', 'clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%); -webkit-clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%); opacity: .4')
  start_button.setAttribute('onclick', 'renderTree(\'tree[\\\'start\\\']\')')
  start_button.innerHTML = 'START'
  path_id.appendChild(start_button)

  // other buttons
  // replace [ with .
  node = node.replace(/\[/g, '.')
  // remove ] and '
  node = node.replace(/\]/g, '')
  node = node.replace(/\'/g, '')

  var arr = node.split('.')
  console.log('replaced node: ' + arr + ' length: ' + arr.length)
  var path_arr = arr // node.split('.')
  for (i in path_arr) {
    if (i > 1) {
      var path_button = document.createElement('button')
      path_button.innerHTML = path_arr[i].toUpperCase()
      // making path with brackets
      var path_string = path_arr[0]
      for (var ind = 1; ind < parseInt(i) + 1; ind++) {
        path_string += '[\\\'' + path_arr[ind] + '\\\']'
      }
      // renderTree(\'path_string\')
        // path_string: tree['start']
      path_button.setAttribute('onclick', 'renderTree(\'' + path_string + '\')')
      path_button.setAttribute('style', 'opacity: ' + parseFloat(.4+0.1*(i)))
      path_id.appendChild(path_button)
    }
  }

  var find_button = document.createElement('button')
  find_button.setAttribute('id', 'find')
  find_button.setAttribute('onclick', 'alert(\'hi\')')
  if (path_arr.length == 2) {
    find_button.innerHTML = 'SURPRISE ME'
  } else {
    find_button.innerHTML = 'FIND PEOPLE'
  }
  path_id.appendChild(find_button)

  return

  // tree.findNode(node)
  // findPeopleNowButton(node)

}