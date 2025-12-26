self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open("focus-pro")
      .then((cache) =>
        cache.addAll([
          "./",
          "./index.html",
          "./style.css",
          "./app.js",
          "./sound.wav",
          "./manifest.json",
        ])
      )
  );
});
