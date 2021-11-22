import { ISong } from "./models/ISong";
import { IArtist } from "./models/IArtist";

window.onload = function () {
  document
    .getElementById("search-button")
    .addEventListener("click", searchShazamArtist);
  document.getElementById("modal-close").addEventListener("click", closeModal);
};

let defaultArtistImage: string =
  /* "../../assets/r.jpg" */ "https://img.discogs.com/AUHU02l-_SVtXwKaa-85DgGEIvI=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2574977-1420859083-1672.jpeg.jpg";

let defaultCoverImage: string =
  "https://media.istockphoto.com/vectors/vinyl-records-vector-id542290570?k=20&m=542290570&s=612x612&w=0&h=nKQYVVUXByWoMZ6YXH-thC8HzPTDiwfw-MODsmi6cTc=";

function searchShazamArtist() {
  let seachInput: HTMLInputElement = document.getElementById(
    "search-input"
  ) as HTMLInputElement;
  let serachInputValue: string = seachInput.value;
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
}

function createArtistHtml(result: IArtist[]) {
  let container: HTMLDivElement = document.createElement("div");

  container.id = "container";

  for (let i = 0; i < result.length; i++) {
    let artistContainer: HTMLDivElement = document.createElement("div");
    artistContainer.addEventListener("click", () => {
      searchTracks(result[i].id);
    });
    let artistNameParagraph: HTMLParagraphElement = document.createElement("p");
    let imageContainer: HTMLDivElement = document.createElement("div");
    let artistImage: HTMLImageElement = document.createElement("img");

    imageContainer.className = "image-container";

    artistContainer.id = "artist-container";

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
  document.body.appendChild(container);
}

function searchTracks(artistId: string) {
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
  let containerTwo: HTMLDivElement = document.createElement("div");
  for (let i = 0; i < result.length; i++) {
    let songContainer: HTMLDivElement = document.createElement("div");
    songContainer.addEventListener("click", () => {
      checkShazams(result[i].id);
    });

    let songTitle: HTMLParagraphElement = document.createElement("p");
    let songImgContainer: HTMLDivElement = document.createElement("div");
    let coverArt: HTMLImageElement = document.createElement("img");

    songImgContainer.className = "song-image-container";

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
  document.body.appendChild(containerTwo);
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
  console.log(result.total);

  let modal: HTMLDivElement = document.getElementById(
    "modal"
  ) as HTMLDivElement;
  let container: HTMLDivElement = document.createElement("div");
  let shazamsParagrah: HTMLParagraphElement = document.createElement("p");

  shazamsParagrah.id = "shazams-paragraph";

  shazamsParagrah.innerHTML = result.total;

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
  document.getElementById("shazams-paragraph").innerHTML = "";

  modalBackground.classList.remove("modal-background-class-visible");
}
