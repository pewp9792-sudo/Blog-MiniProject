if (!token) location.href = "../index.html";
const profileID = document.querySelector("#profile-id");
const email = document.querySelector("#email");
const firstname = document.querySelector("#firstname");
const lastname = document.querySelector("#lastname");
const registerAt = document.querySelector("#registered-at");
const username = document.querySelector("#username");
const avatar = document.querySelector("#avatar");
const usernames = document.querySelector("#usernames");

// Get Profile
function getInfo(){
  if (!baseUrl) return; // Safety check
  fetch(URL + "/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((item) => {
      if (profileID) profileID.value = item.data.id;
      if (email) email.value = item.data.email;
      if (firstname) firstname.value = item.data.firstName;
      if (lastname) lastname.value = item.data.lastName;
      if (registerAt) registerAt.value = formatDate(item.data.registeredAt);
      if (username) username.value = "@" + item.data.firstName + " " + item.data.lastName;
      if (avatar) avatar.src = item.data.avatar;
      if (usernames) usernames.textContent = "@" + item.data.firstName + " " + item.data.lastName;
      
      // Update editProfile form if it exists
      const fnameElement = document.querySelector("#fname");
      const lnameElement = document.querySelector("#lname");
      const emailEditElement = document.querySelector("#emailEdit");
      
      if (fnameElement) fnameElement.value = item.data.firstName;
      if (lnameElement) lnameElement.value = item.data.lastName;
      if (emailEditElement) emailEditElement.value = item.data.email;
    })
    .catch(err => console.error("Error fetching profile:", err));
}

if (token) {
  getInfo();
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
