describe("shazam-checker test", () => {
  it("should search shazam api", () => {
    cy.intercept("GET", "https://shazam-core.p.rapidapi.com/v1/artists/*", {
      fixture: "shazamartistresponse.json",
    }).as("getArtists");

    cy.visit("http://localhost:1234");
    cy.get("#search-input").type("abba");
    cy.get("#search-button").click();

    cy.wait("@getArtists");

    cy.get(".artist-song-container").should("have.length", 2);
  });

  it("should have artist img", () => {
    cy.intercept("GET", "https://shazam-core.p.rapidapi.com/v1/artists/*", {
      fixture: "shazamartistresponse.json",
    }).as("getArtists");
    cy.visit("http://localhost:1234");
    cy.get("#search-input").type("abba");
    cy.get("#search-button").click();
    cy.wait("@getArtists");

    cy.get(".artist-song-container:first .image-container img").should(
      "have.attr",
      "src",
      "https://is3-ssl.mzstatic.com/image/thumb/Features115/v4/77/b2/e3/77b2e3f8-3af4-1928-f411-901705218d2d/mza_402627401905230864.png/800x800cc.jpg"
    );

    cy.get(".artist-song-container:last .image-container img").should(
      "have.attr",
      "src",
      "https://openclipart.org/image/800px/7645"
    );
  });

  it("should have artist name", () => {
    cy.intercept("GET", "https://shazam-core.p.rapidapi.com/v1/artists/*", {
      fixture: "shazamartistresponse.json",
    }).as("getArtists");
    cy.visit("http://localhost:1234");
    cy.get("#search-input").type("abba");
    cy.get("#search-button").click();
    cy.wait("@getArtists");

    cy.get(".artist-song-container:first h4").should("have.html", "ABBA");

    cy.get(".artist-song-container:last h4").should(
      "have.html",
      "ABBA World Revival"
    );
  });

  it("should be able to click on .artist-song-container", () => {
    cy.intercept("GET", "https://shazam-core.p.rapidapi.com/v1/artists/*", {
      fixture: "shazamartistresponse.json",
    }).as("getArtists");
    cy.visit("http://localhost:1234");
    cy.get("#search-input").type("abba");
    cy.get("#search-button").click();
    cy.wait("@getArtists");

    cy.get(".artist-song-container:first").click();
    cy.intercept(
      "GET",
      "https://shazam-core.p.rapidapi.com/v1/artists/tracks/*",
      { fixture: "shazamsongresponse.json" }
    ).as("getSongs");
  });
});
