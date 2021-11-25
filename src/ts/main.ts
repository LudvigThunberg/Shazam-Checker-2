import { ISong } from "./models/ISong";
import { IArtist } from "./models/IArtist";

window.onload = function () {
  document
    .getElementById("search-button")
    .addEventListener("click", searchShazamArtist);
  document
    .getElementById("search-input")
    .addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        searchShazamArtist();
      }
    });
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document
    .getElementById("modal-background")
    .addEventListener("click", closeModal);
};

let defaultArtistImage: string = "https://openclipart.org/image/800px/7645";
let defaultCoverImage: string =
  "https://media.istockphoto.com/vectors/vinyl-records-vector-id542290570?k=20&m=542290570&s=612x612&w=0&h=nKQYVVUXByWoMZ6YXH-thC8HzPTDiwfw-MODsmi6cTc=";

function searchShazamArtist() {
  let container: HTMLDivElement = document.getElementById(
    "container"
  ) as HTMLDivElement;
  let searchInput: HTMLInputElement = document.getElementById(
    "search-input"
  ) as HTMLInputElement;

  let serachInputValue: string = searchInput.value;

  container.innerHTML = "";

  fetch(
    "https://shazam-core.p.rapidapi.com/v1/artists/search?query=" +
      serachInputValue,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "shazam-core.p.rapidapi.com",
        "x-rapidapi-key": "9f1699e663mshd0bfd2ee994f84cp10d6f4jsnd852b4371c6e",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((result: IArtist[]) => {
      createArtistHtml(result);
    })
    .catch((err) => {
      console.error(err);
    });
  searchInput.value = null;
}

function createArtistHtml(result: IArtist[]) {
  let container: HTMLDivElement = document.getElementById(
    "container"
  ) as HTMLDivElement;
  let mainContainer: HTMLDivElement = document.getElementById(
    "mainContainer"
  ) as HTMLDivElement;

  for (let i = 0; i < result.length; i++) {
    let artistContainer: HTMLDivElement = document.createElement("div");
    let artistNameParagraph: HTMLParagraphElement = document.createElement(
      "h2"
    );
    let imageContainer: HTMLDivElement = document.createElement("div");
    let artistImage: HTMLImageElement = document.createElement("img");

    imageContainer.className = "image-container";
    artistContainer.id = "artist-container";

    artistContainer.addEventListener("click", () => {
      searchTracks(result[i].id);
    });

    artistNameParagraph.innerHTML = result[i].name;
    //artistImage.src = result[i].avatar?.default:defaulImage;

    if (result[i].avatar) {
      artistImage.src = result[i].avatar.default;
    } else {
      artistImage.src = defaultArtistImage;
    }

    container.appendChild(artistContainer);
    artistContainer.appendChild(artistNameParagraph);
    artistContainer.appendChild(imageContainer);
    imageContainer.appendChild(artistImage);
  }
  mainContainer.appendChild(container);
}

function searchTracks(artistId: string) {
  let containerTwo: HTMLDivElement = document.getElementById(
    "container-two"
  ) as HTMLDivElement;

  containerTwo.innerHTML = "";

  fetch(
    "https://shazam-core.p.rapidapi.com/v1/artists/tracks?artist_id=" +
      artistId +
      "&limit=10",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "shazam-core.p.rapidapi.com",
        "x-rapidapi-key": "9f1699e663mshd0bfd2ee994f84cp10d6f4jsnd852b4371c6e",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((result: ISong[]) => {
      createSongHtml(result);
    })
    .catch((err) => {
      console.error(err);
    });
}

function createSongHtml(result: ISong[]) {
  let containerTwo: HTMLDivElement = document.getElementById(
    "container-two"
  ) as HTMLDivElement;
  let mainContainer: HTMLDivElement = document.getElementById(
    "mainContainer"
  ) as HTMLDivElement;

  for (let i = 0; i < result.length; i++) {
    let songContainer: HTMLDivElement = document.createElement("div");
    let songTitle: HTMLParagraphElement = document.createElement("p");
    let songImgContainer: HTMLDivElement = document.createElement("div");
    let coverArt: HTMLImageElement = document.createElement("img");

    songImgContainer.className = "song-image-container";
    songContainer.className = "song-container";

    songContainer.addEventListener("click", () => {
      checkShazams(result[i].id);
    });

    songTitle.innerHTML = result[i].title;
    //coverArt.src = result[i].images?.coverart;

    if (result[i].images) {
      coverArt.src = result[i].images.coverart;
    } else {
      coverArt.src = defaultCoverImage;
    }

    songContainer.appendChild(songTitle);
    songImgContainer.appendChild(coverArt);
    songContainer.appendChild(songImgContainer);
    containerTwo.appendChild(songContainer);
  }
  mainContainer.appendChild(containerTwo);
}

function checkShazams(songId: string) {
  fetch(
    "https://shazam-core.p.rapidapi.com/v1/tracks/total-shazams?track_id=" +
      songId +
      "",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "shazam-core.p.rapidapi.com",
        "x-rapidapi-key": "9f1699e663mshd0bfd2ee994f84cp10d6f4jsnd852b4371c6e",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      createShazamsModalHtml(result);
    })
    .catch((err) => {
      console.error(err);
    });
}

function createShazamsModalHtml(result) {
  let modal: HTMLDivElement = document.getElementById(
    "modal"
  ) as HTMLDivElement;
  modal.innerHTML = "";
  let container: HTMLDivElement = document.createElement("div");
  let shazamsParagrah: HTMLParagraphElement = document.createElement("p");

  shazamsParagrah.className = "shazams-paragraph";

  shazamsParagrah.innerHTML = "Total Shazams: " + result.total;
  container.appendChild(shazamsParagrah);
  modal.appendChild(container);
  openModal();
}

function openModal() {
  let modalBackground: HTMLDivElement = document.getElementById(
    "modal-background"
  ) as HTMLDivElement;

  modalBackground.classList.add("modal-background-class-visible");
}

function closeModal() {
  let modalBackground: HTMLDivElement = document.getElementById(
    "modal-background"
  ) as HTMLDivElement;
  let modal: HTMLDivElement = document.getElementById(
    "modal"
  ) as HTMLDivElement;
  modalBackground.classList.remove("modal-background-class-visible");
  console.log(modal.innerHTML);
}
