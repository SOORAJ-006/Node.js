
function Close(id) {
  let idd = id;
  document.getElementById(idd).style.display = "none";
  overlayClose();
}

function display(id) {
  let idd = id;
  document.getElementById(idd).style.display = "block";
  overlayOpen()
  clearAddLabel()
}

function overlayClose() {
  document.getElementById('overlay').style.display = 'none'
  document.getElementById('addEmployee').style.display = "none";
  document.getElementById('empEdit').style.display = "none";
  document.getElementById('empDelete').style.display = "none";
}

function overlayOpen() {
  document.getElementById('overlay').style.display = 'block'
}

fetchData();

let currentPage = 1;
let itemsPerPage = 5;
let totalItems = 0;
let tableContents = [];

// pagination

function pageNation() {

  let totalPages = Math.ceil(tableContents.length / itemsPerPage);
  const pageNationUl = document.getElementById('paginationContaioner')
  pageNationUl.innerHTML = '';

  // back skip button <

  const backskip = document.createElement('li');
  backskip.innerHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous">
    <span aria-hidden="true">&laquo;</span>
  </a>
</li>`;
  pageNationUl.appendChild(backskip);

  backskip.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
    }
    else {
      currentPage = 1;
    }
    displayData(currentPage);
  });

  // skip button " 1 2 3 "

  for (let i = 1; i <= totalPages; i++) {
    const pageItems = document.createElement('li');
    pageItems.innerHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous">
    <span aria-hidden="true">${i}</span>
  </a>
</li>`;
    pageNationUl.appendChild(pageItems);
    pageItems.addEventListener('click', () => {
      currentPage = i;
      displayData(currentPage);

    });
  }

  // front skipp button

  const frontSkip = document.createElement('li');
  frontSkip.innerHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>`;

  pageNationUl.appendChild(frontSkip);
  frontSkip.addEventListener('click', () => {
    if (currentPage <= totalPages - 1) {
      currentPage++;
    }
    else {
      currentPage = totalPages;
    }
    displayData(currentPage);
  });
}

// fetching data from the json

document.addEventListener("DOMContentLoaded", async function() {
  const token = localStorage.getItem('token');
  if (!token) {
      window.location.href = '/login';
      return;
  }

  
async function fetchData() {
  await fetch(`http://localhost:5001/employees`,{
    method:'GET',
    headers: {
      'content-type' : 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then((data) => {

      return data.json();
    }).then((objectData) => {
      tableContents = objectData.reverse();

      // table count
      document.getElementById('count').addEventListener('change', () => {
        dataCount = document.getElementById('count');
        if (dataCount.value == 'max') {
          itemsPerPage = objectData.length

        }
        else {
          itemsPerPage = parseInt(dataCount.value);
        }
        displayData(currentPage);
        pageNation();

      });

      displayData(currentPage);
      pageNation();

    })
    .catch(err => alert("Server Not Connected"))
}



const input = document.getElementById('input')
input.addEventListener('input', () => {
  inputTriggered = true;
  fetchData()
  itemsPerPage = tableContents.length;
  displayData(currentPage);
  document.getElementById('count').value = "max"

});


function displayData(page) {

  document.getElementById('totalContnets').innerText = tableContents.length
  // search bar using filter
  let querry = input.value;

  // end
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage

  // let start = (page - 1) * itemsPerPage;
  // let end = start + itemsPerPage



  let pageinatedData = tableContents.filter((eventData) => {

    if (querry === '') {
      return eventData
    }
    else if (eventData.firstName.toLowerCase().includes(querry.toLowerCase()) || eventData.email.toLowerCase().includes(querry.toLowerCase())
      || eventData.phone.toLowerCase().includes(querry.toLowerCase()) || eventData.gender.toLowerCase().includes(querry.toLowerCase())
      || eventData.country.toLowerCase().includes(querry.toLowerCase())) {
      return eventData
    }

  })

    .slice(start, end);

  let tableData = "";
  let i = start;

  pageinatedData
    .map((values) => {
      i++;
      totalItems++;

      let slNumber = i > 9 ? `#${i}` : `#0${i}`;
      console.log("values.img : ", values.image);
      tableData += `<tr>
        <th id="id">${slNumber}</th>
        <td id="Name"><img class="emp-img" src="http://localhost:5001/uploads/${values._id}.jpg"> ${values.salutation} ${values.firstName} ${values.lastName}</td>
        <td id="Email">${values.email}</td>
        <td id="Mob">${values.phone}</td>
        <td id="Gender">${values.gender}</td>
        <td id="Dob">${values.dob}</td>
        <td id="Country">${values.country}</td>
        <td><div class="dropdown">
            <button class="btn btn-secondary " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
            <ul class="dropdown-menu">
              <li ><a class="dropdown-item" href="http://localhost:5001/viewDetails?id=${values._id}">View Details</a></li>
              <li onclick="editEmployee('${values._id}')"><a class="dropdown-item" href="#">Edit </a></li>
              <li onclick="deleteEmployee('${values._id}')"><a class="dropdown-item" href="#">Delete</a></li>
            </ul>
          </div>
        </td>
    </tr>`
    });

  document.getElementById("tableBody").innerHTML = tableData;
}

// ---------------------------Add Form Validation-------------------------------
function clearEditLabel() {
  document.getElementById("editSalutationError").textContent = "";
  document.getElementById("editFirstNameError").textContent = "";
  document.getElementById("editLastNameError").textContent = "";
  document.getElementById("editEmailError").textContent = "";
  document.getElementById("editPhoneError").textContent = "";
  document.getElementById("editUserNameError").textContent = "";
  document.getElementById("editPasswordError").textContent = "";
  document.getElementById("editDobError").textContent = "";
  document.getElementById("editGenderError").textContent = "";
  document.getElementById("editAddressError").textContent = "";
  document.getElementById("editQualificationError").textContent = "";
  document.getElementById("editCountryError").textContent = "";
  document.getElementById("editStateError").textContent = "";
  document.getElementById("editCityError").textContent = "";
  document.getElementById("editPinError").textContent = "";
}

function clearAddLabel() {
  document.getElementById("addSalutationError").textContent = "";
  document.getElementById("addFirstNameError").textContent = "";
  document.getElementById("addLastNameError").textContent = "";
  document.getElementById("addEmailError").textContent = "";
  document.getElementById("addPhoneError").textContent = "";
  document.getElementById("adduserNameError").textContent = "";
  document.getElementById("addPasswordError").textContent = "";
  document.getElementById("addDobError").textContent = "";
  document.getElementById("errorGender").textContent = "";
  document.getElementById("addAddressError").textContent = "";
  document.getElementById("addqualificationError").textContent = "";
  document.getElementById("addCountryError").textContent = "";
  document.getElementById("addStateError").textContent = "";
  document.getElementById("addCityError").textContent = "";
  document.getElementById("addPinError").textContent = "";
}

function clearAddForm() {
  document.getElementById("addSalutation").value = "";
  document.getElementById("addFirstName").value = "";
  document.getElementById("addLastName").value = "";
  document.getElementById("addEmail").value = "";
  document.getElementById("addPhone").value = "";
  document.getElementById("adduserName").value = "";
  document.getElementById("addPassword").value = "";
  document.getElementById("addDob").value = "";
  document.getElementById("addAddress").value = "";
  document.getElementById("addQualification").value = "";
  document.getElementById("addCountry").value = "";
  document.getElementById("addState").value = "";
  document.getElementById("addCity").value = "";
  document.getElementById("addPin").value = "";
  document.querySelector(`input[name='gender'][value='']`).checked = true;
}

function addFormValidation() {
  const salutation = document.getElementById("addSalutation").value.trim();
  const firstName = document.getElementById("addFirstName").value.trim();
  const lastName = document.getElementById("addLastName").value.trim();
  const email = document.getElementById("addEmail").value.trim();
  const phone = document.getElementById("addPhone").value.trim();
  const address = document.getElementById("addAddress").value.trim();
  const country = document.getElementById("addCountry").value.trim();
  const state = document.getElementById("addState").value.trim();
  const city = document.getElementById("addCity").value.trim();
  const pin = document.getElementById("addPin").value.trim();
  const username = document.getElementById("adduserName").value.trim();
  const password = document.getElementById("addPassword").value.trim();
  const qualifications = document.getElementById("addqualification").value.trim();

  // DOB

  const dob = document.getElementById("addDob")
  const addDovValidation = document.getElementById('addDobError')
  const dobvalue = dob.value.trim();

  const gender = document.querySelector('input[name="gender"]:checked')
  const addGenderValidation = document.getElementById('errorGender')

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phonePattern = /^\d{10}$/
  const namePattern = /^[A-Za-z]+$/

  let isValid = true;

  // validating DOB and Gender

  if (gender) {
    addGenderValidation.textContent = ""

  }
  else {
    addGenderValidation.textContent = "* please select gender"
    isValid = false
  }

  if (dobvalue === "") {
    addDovValidation.textContent = "* please select Date of Birth"
    isValid = false
  }

  // validating rest

  if (!phonePattern.test(phone)) {
    document.getElementById('addPhoneError').textContent = "* phone number should contain 10n digits"
    isValid = false
  }

  if (!emailPattern.test(email)) {
    document.getElementById('addEmailError').textContent = "* Invalid email"
    isValid = false
  }

  if (!namePattern.test(firstName)) {
    document.getElementById('addFirstNameError').textContent = "* please enter first name"
    isValid = false
  }

  if (!namePattern.test(lastName)) {
    document.getElementById('addLastNameError').textContent = "* please enter first name"
    isValid = false
  }

  if (password == "") {
    document.getElementById('addPasswordError').textContent = "* please enter password"
    isValid = false
  }

  if (salutation == "" || salutation == "select") {
    document.getElementById('addSalutationError').textContent = "* saluration is needed"
    isValid = false
  }

  if (username == "") {
    document.getElementById('adduserNameError').textContent = "* username is needed"
    isValid = false
  }

  if (address == "") {
    document.getElementById('addAddressError').textContent = "* address is needed"
    isValid = false
  }

  if (qualifications == "") {
    document.getElementById('addqualificationError').textContent = "* qualification is needed"
    isValid = false
  }

  if (country == "" || country == "select") {
    document.getElementById('addCountryError').textContent = "* country is needed"
    isValid = false
  }

  if (state == "" || state == "select") {
    document.getElementById('addStateError').textContent = "* state is needed"
    isValid = false
  }

  if (city == "" || city == "select") {
    document.getElementById('addCityError').textContent = "* city is needed"
    isValid = false
  }

  if (pin == "") {
    document.getElementById('addPinError').textContent = "* pin is needed"
    isValid = false
  }

  // validation text event

  document.getElementById('addEmployee').addEventListener('input', (event) => {
    inputId = event.target.id;
    const errorId = `${inputId}Error`;
    document.getElementById(errorId).textContent = "";
  })

  // gender validation

  const male = document.getElementById("forMale")
  const female = document.getElementById("forFemale")

  male.addEventListener("click", () => {
    document.getElementById("errorGender").textContent = "";
  })

  female.addEventListener("click", () => {
    document.getElementById("errorGender").textContent = "";
  })

  return isValid;
}

// ------------------------------ADD EMPLOYEE ---------------------------------

function AddImgPreview() {
  let preview = document.getElementById("addEmpImg");
  preview.style.display = 'block'
  preview.src = URL.createObjectURL(event.target.files[0]);
}


const addEmployeeSubmit = document.getElementById('addEmployeeBtn');
addEmployeeSubmit.addEventListener('click', () => {
  const validation = addFormValidation();
  if (!validation) {
    return;
  } else {
    addEmpsubmit()
  }
})



function addEmpsubmit() {

  const salutation = document.getElementById("addSalutation").value;
  const firstName = document.getElementById("addFirstName").value;
  const lastName = document.getElementById("addLastName").value;
  const email = document.getElementById("addEmail").value;
  const dob = document.getElementById("addDob").value;
  const phone = document.getElementById("addPhone").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const address = document.getElementById("addAddress").value;
  const country = document.getElementById("addCountry").value;
  const state = document.getElementById("addState").value;
  const city = document.getElementById("addCity").value;
  const pin = document.getElementById("addPin").value;
  const username = document.getElementById("adduserName").value;
  const password = document.getElementById("addPassword").value;

  const qualifications = document.getElementById("addqualification").value;
  const originalDateString = dob;

  // Parse the original date string
  let parts = originalDateString.split("-");
  let year = parts[0];
  let month = parts[1];
  let day = parts[2];
  // Construct the reversed date string
  let reversedDateString = `${day}-${month}-${year}`;
  const dobb = reversedDateString;

  const newData = {
    salutation,
    firstName,
    lastName,
    email,
    phone,
    dob: dobb,
    gender,
    qualifications,
    address,
    city,
    state,
    pin,
    country,
    username,
    password
  }
  postData(newData);
}

//  post data -------------------------- 

let addFlag = 0
document.getElementById('img-upload').addEventListener('change', () => {
  addFlag = 1
})

function postData(newData) {
  fetch('http://localhost:5001/employees', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(newData)
  })

    .then(response => {

      if (!response.ok) {
        console.log("addEmp response", response);
        alert('Fields connot be empty')
      }
      else {
        return response.json();
      }
      // return response.json();
    })
    .then(data => {

      // image upload-------------------------------------
      if (addFlag == 1) {

        const profileImg = document.getElementById('img-upload');
        var imgObject = new FormData();
        // avatarImage = profileImg.files[0]

        imgObject.append("avatar", profileImg.files[0]);
        console.log("img addd id : ", data._id);

        fetch(`http://localhost:5001/employees/${data.id}/image`, {
          method: "POST",
          body: imgObject,
        })
          .then((response) => {
            if (!response) {
              console.log('image not addedddd');
            }
          })
          .catch(err => console.log("add img error",err))
      }
    })
    .then(() => {
      swal.fire({
        icon: "success",
        title: "ADD EMPLOYEE SUCCESSFULL",
        showConfirmButton: false,
        timer: 1500,
      });
      Close('addEmployee')

      fetchData()
    })
    .catch(err => {
      console.log('error ' + err);
    });
  clearAddForm()
}


//  edit employee Get


async function editEmployee(empid) {

  console.log(empid, "log id");

  let a = document.getElementById('empEdit')
  a.style.display = "block";
  document.getElementById('overlay').style.display = 'block'

  //   fetching data from json and planting it to empEdit

  await fetch(`http://localhost:5001/employees/${empid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }) //getting all the data in the id
    .then((response) => response.json())
    .then((data) => {
  
      var image = document.getElementById('image-box')
      image.src = `http://localhost:5001/uploads/${data._id}.jpg`;


      document.getElementById('editSalutation').value = data.salutation;
      document.getElementById('editFirstName').value = data.firstName;
      document.getElementById('editLastName').value = data.lastName;
      document.getElementById('editEmail').value = data.email;
      document.getElementById('editPhone').value = data.phone;
      document.getElementById('editUserName').value = data.username;
      document.getElementById('editPassword').value = data.password;
      document.getElementById('editAddress').value = data.address;
      document.getElementById('editQualification').value = data.qualifications;
      document.getElementById('editCountry').value = data.country;
      document.getElementById('editState').value = data.state;
      document.getElementById('editCity').value = data.city;
      document.getElementById('editPin').value = data.pin;

      // dob change

      const [day, month, year] = data.dob.split("-");
      const newDob = `${year}-${month}-${day}`;
      document.getElementById('editDob').value = newDob;

      // gender  

      document.querySelector(`input[name='editGender'][value='${data.gender}']`).checked = true;

      // const gender = document.querySelector('input[name="gender"]:checked').value;
    })
    .catch(err => alert(err))

  // image preview in edit employee form

  // const editpreview = document.getElementById('image-box')
  // editpreview.src = `http://localhost:5001/uploads/${values._id}.jpg`;


  const editsubmit = document.getElementById("saveEdit");
  editsubmit.addEventListener('click', () => {
    const editValidation = EditFormValidation();
    if (!editValidation) {
      return;
    } else {
      saveChanges(empid);
    }

  })
  clearEditLabel()

}

function avatarPreview() {
  const preview = document.getElementById("image-box");
  preview.src = URL.createObjectURL(event.target.files[0]);

}


// Edit Employee Validation

function EditFormValidation() {
  const salutation = document.getElementById("editSalutation").value.trim();
  const firstName = document.getElementById("editFirstName").value.trim();
  const lastName = document.getElementById("editLastName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const address = document.getElementById("editAddress").value.trim();
  const country = document.getElementById("editCountry").value.trim();
  const state = document.getElementById("editState").value.trim();
  const city = document.getElementById("editCity").value.trim();
  const pin = document.getElementById("editPin").value.trim();
  const username = document.getElementById("editUserName").value.trim();
  const password = document.getElementById("editPassword").value.trim();
  const qualifications = document.getElementById("editQualification").value.trim();

  // DOB

  const dob = document.getElementById("editDob")
  const addDovValidation = document.getElementById('editDobError')
  const dobvalue = dob.value.trim();

  const gender = document.querySelector('input[name="editGender"]:checked')
  const addGenderValidation = document.getElementById('editGenderError')

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phonePattern = /^\d{10}$/
  const namePattern = /^[A-Za-z]+$/

  let isValid = true;

  // validating DOB and Gender

  if (gender) {
    addGenderValidation.textContent = ""

  }
  else {
    addGenderValidation.textContent = "* please select gender"
    isValid = false
  }

  if (dobvalue === "") {
    addDovValidation.textContent = "* please select Date of Birth"
    isValid = false
  }

  // validating rest

  if (!phonePattern.test(phone)) {
    document.getElementById('editPhoneError').textContent = "* phone number should contain 10n digits"
    isValid = false
  }

  if (!emailPattern.test(email)) {
    document.getElementById('editEmailError').textContent = "* Invalid email"
    isValid = false
  }

  if (!namePattern.test(firstName)) {
    document.getElementById('editFirstNameError').textContent = "* please enter first name"
    isValid = false
  }

  if (!namePattern.test(lastName)) {
    document.getElementById('editLastNameError').textContent = "* please enter last name"
    isValid = false
  }

  if (password == "") {
    document.getElementById('editPasswordError').textContent = "* please enter password"
    isValid = false
  }

  if (salutation == "" || salutation == "select") {
    document.getElementById('editSalutationError').textContent = "* saluration is needed"
    isValid = false

  }

  if (username == "") {
    document.getElementById('editUserNameError').textContent = "* username is needed"
    isValid = false

  }

  if (address == "") {
    document.getElementById('editAddressError').textContent = "* address is needed"
    isValid = false

  }

  if (qualifications == "") {
    document.getElementById('editQualificationError').textContent = "* qualification is needed"
    isValid = false

  }

  if (country == "" || country == "select") {
    document.getElementById('editCountryError').textContent = "* country is needed"
    isValid = false

  }

  if (state == "" || state == "select") {
    document.getElementById('editStateError').textContent = "* state is needed"
    isValid = false

  }

  if (city == "" || city == "select") {
    document.getElementById('editCityError').textContent = "* city is needed"
    isValid = false

  }

  if (pin == "") {
    document.getElementById('editPinError').textContent = "* pin is needed"
    isValid = false

  }

  // validation text event

  document.getElementById('empEdit').addEventListener('input', (event) => {
    inputId = event.target.id;
    const errorId = `${inputId}Error`;
    document.getElementById(errorId).textContent = "";
  })

  // gender validation

  const male = document.getElementById("editMale")
  const female = document.getElementById("editFemale")

  male.addEventListener("click", () => {
    document.getElementById("editGenderError").textContent = "";
  })

  female.addEventListener("click", () => {
    document.getElementById("editGenderError").textContent = "";
  })

  return isValid;
}

// posting edited data to json

let editFlag = 0
document.getElementById('imge-upload').addEventListener('change', () => {
  editFlag = 1
})


function saveChanges(empid) {

  const salutation = document.getElementById("editSalutation").value;
  const firstName = document.getElementById("editFirstName").value;
  const lastName = document.getElementById("editLastName").value;
  const email = document.getElementById("editEmail").value;
  const dob = document.getElementById("editDob").value;
  const phone = document.getElementById("editPhone").value;
  const gender = document.querySelector('input[name="editGender"]:checked').value;
  const address = document.getElementById("editAddress").value;
  const country = document.getElementById("editCountry").value;
  const state = document.getElementById("editState").value;
  const city = document.getElementById("editCity").value;
  const pin = document.getElementById("editPin").value;
  const username = document.getElementById("editUserName").value;
  const password = document.getElementById("editPassword").value;
  const qualifications = document.getElementById("editQualification").value;

  const originalDateString = dob;
  // Parse the original date string
  let parts = originalDateString.split("-");
  let year = parts[0];
  let month = parts[1];
  let day = parts[2];
  // Construct the reversed date string
  let reversedDateString = `${day}-${month}-${year}`;
  console.log(reversedDateString);
  const dobb = reversedDateString;

  const newData = {
    salutation,
    firstName,
    lastName,
    email,
    phone,
    dob: dobb,
    gender,
    qualifications,
    address,
    city,
    state,
    pin,
    country,
    username,
    password
  }

  console.log(newData);

  fetch(`http://localhost:5001/employees/${empid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData)
  })
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        alert('something went Wrong')
      }
      else {
        return response.json();
      }

    })
    .then((data) => {

      // posting image through edit form----------------------------------

      if (editFlag == 1) {
        const profileimg = document.getElementById('imge-upload');
        var imgObject = new FormData();
        imgObject.append("avatar", profileimg.files[0]);

        fetch(`http://localhost:5001/employees/${empid}/image`, {
          method: "POST",
          body: imgObject,
        })
          .then((response) => {
            if (!response.ok) {
              console.log('image not added');
            }
          })
      }
    })
    .then(() => {
      swal.fire({
        icon: "success",
        title: "EMPLOYEE UPDATED SUCCESSFULL",
        showConfirmButton: false,
        timer: 1500,
      });
      // end of img posting ---------------------------------------
    }).then(() => {
      fetchData()
      Close('empEdit');
    })


}

// Deleting Data from Json

function deleteEmployee(empid) {
  display('empDelete');
  let deleteEmploye = document.getElementById('deleteEmployee')
  deleteEmploye.addEventListener("click", () => {
    confirmDelete(empid);
  })
}


function confirmDelete(id) {
  fetch(`http://localhost:5001/employees/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => {
      if (!response.ok) {
        Close('empDelete');
      }
      else {
        return response.json;
      }
    })
    .then(() => {

      swal.fire({
        icon: "success",
        title: "EMPLOYEE DELETED SUCCESSFULL",
        showConfirmButton: false,
        timer: 1500,
      })
      Close('empDelete');
      fetchData()
    })
}


