const songs = [
    {
        title: "Dreams",
        artist: "Lost Frequencies",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://placehold.co/300x300/573044/ffffff?text=Dreams"
    },
    {
        title: "Midnight",
        artist: "The Weeknd",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://placehold.co/300x300/302033/ffffff?text=Midnight"
    },
    {
        title: "Memories",
        artist: "Music Collection",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://placehold.co/300x300/663344/ffffff?text=Memories"
    }
];

const audio = new Audio();

let songIndex = 0;

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const title = document.getElementById("song-title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");

const songList = document.getElementById("song-list");

// Load song
function loadSong(index) {
    const song = songs[index];

    title.textContent = song.title;
    artist.textContent = song.artist;
    cover.src = song.cover;

    audio.src = song.src;
    progress.value = 0;

    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    displayPlaylist();
}

// Play song
function playSong() {
    audio.play()
        .then(() => {
            playBtn.textContent = "⏸";
        })
        .catch(error => {
            console.log("Playback error:", error);
            playBtn.textContent = "▶";
        });
}

// Pause song
function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
}

// Play/Pause button
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Next song
function nextSong() {
    songIndex++;

    if (songIndex >= songs.length) {
        songIndex = 0;
    }

    loadSong(songIndex);
    playSong();
}

// Previous song
function prevSong() {
    songIndex--;

    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }

    loadSong(songIndex);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Format time
function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Update duration
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

// Update progress
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.value =
            (audio.currentTime / audio.duration) * 100;

        currentTime.textContent = formatTime(audio.currentTime);
    }
});

// Seek song
progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime =
            (progress.value / 100) * audio.duration;
    }
});

// Volume control
volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

audio.volume = volume.value;

// Autoplay next song
audio.addEventListener("ended", () => {
    nextSong();
});

// Display playlist
function displayPlaylist() {
    songList.innerHTML = "";

    songs.forEach((song, index) => {
        const item = document.createElement("div");

        item.classList.add("song-item");

        if (index === songIndex) {
            item.classList.add("active");
        }

        item.innerHTML = `
            <span>${song.title}<br>
            <small>${song.artist}</small></span>
            <span>▶</span>
        `;

        item.addEventListener("click", () => {
            songIndex = index;
            loadSong(songIndex);
            playSong();
        });

        songList.appendChild(item);
    });
}

// Initial song
loadSong(songIndex);