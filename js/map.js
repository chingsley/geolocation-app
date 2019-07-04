// destructure console
// declare locations for kampala, lagos, nairobi   { lat: -1.292066, lng: 36.821945 }
// DOM queryselector for the buttons and inputs .btn-address, .address, .footer-content, .coordinates, .btn-coordinates, .btn-get-current-location, ".spinner-window"
// initialise the markder
// add event listene to btnAddress and implement geolocation for finding input address
// move the implementation to a function geolocateInput
// use geolocateInput for the coordinate input for locatin places based on input coordinates
// implement getCurrentPosition
// integrate the spinner

const addressInput = document.querySelector(".address");
const btnFindByAddress = document.querySelector(".btn-address");
const footerContent = document.querySelector(".footer-content");
const coordinatesInput = document.querySelector(".coordinates");
const btnFindByCoordinates = document.querySelector(".btn-coordinates");
const btnGetCurrentLocation = document.querySelector(
  ".btn-get-current-location"
);
const spinnerWindow = document.querySelector(".spinner-window");

const africa = { lat: -8.783195, lng: 34.508522 };
const kampala = { lat: 0.347596, lng: 32.58252 };
const nairobi = { lat: -1.292066, lng: 36.821945 };
const lagos = { lat: 6.524379, lng: 3.379206 };

const { log } = console;
let map;

const setMarker = position => {
  return new google.maps.Marker({ map: map, position: position });
};

const geocodeInput = async location => {
  log(addressInput.value);
  const geocoder = new google.maps.Geocoder();
  try {
    await geocoder.geocode({ address: location }, (results, status) => {
      log(results, status);
      if (status === "OK") {
        const [
          {
            formatted_address: formattedAddress,
            geometry: {
              location: { lat, lng }
            }
          }
        ] = results;
        log(formattedAddress, lat(), lng());
        map.setCenter({ lat: lat(), lng: lng() });
        const marker = setMarker({ lat: lat(), lng: lng() });

        const infowindow = new google.maps.InfoWindow();
        infowindow.setContent(formattedAddress);
        infowindow.open(map, marker);
        footerContent.textContent = formattedAddress;

        coordinatesInput.value = `${lat()}, ${lng()}`;
        addressInput.value = formattedAddress;
      } else {
        alert(status) || log(status);
      }
    });
    stopLoader();
  } catch (error) {
    log(error);
  }
};

function initMap() {
  log(google.maps);
  map = new google.maps.Map(document.querySelector(".map"), {
    center: nairobi,
    zoom: 12
  });

  setMarker(nairobi);
}

btnFindByAddress.addEventListener("click", () => {
  startLoader();
  geocodeInput(addressInput.value);
});

btnFindByCoordinates.addEventListener("click", () => {
  startLoader();
  geocodeInput(coordinatesInput.value);
});

[addressInput, coordinatesInput].map((input, index) => {
  input.addEventListener("keyup", event => {
    if (event.keyCode === 13) {
      index === 0 ? btnFindByAddress.click() : btnFindByCoordinates.click();
    }
  });
});

const onPositionRetrieved = position => {
  log(position);
  const {
    timestamp,
    coords: { latitude: lat, longitude: lng }
  } = position;
  log(timestamp, lat, lng);
  log(`${lat}`, `${lng}`);
  geocodeInput(`${lat}, ${lng}`);
};

onErrorOccured = error => {
  log(error);
};

const startLoader = () => {
  spinnerWindow.style.visibility = "visible";
};

const stopLoader = () => {
  spinnerWindow.style.visibility = "hidden";
};

btnGetCurrentLocation.addEventListener("click", async () => {
  startLoader();
  log(window.navigator);
  const {
    navigator: { geolocation }
  } = window;
  if (geolocation) {
    log("geolocation enabled");
    await geolocation.getCurrentPosition(onPositionRetrieved, onErrorOccured);
    log("time waits for no man");
  } else {
    alert("please enable your geolocation, and try again.");
  }
});
