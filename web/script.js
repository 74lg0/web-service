document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM completamente cargado. Iniciando reproductor...");
    
    // Elementos DOM
    const audio = document.getElementById('myAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const muteBtn = document.getElementById('muteBtn');
    const volumeBar = document.getElementById('volumeBar');
    const songTitle = document.getElementById('songTitle');
    const songAutor = document.getElementById('songAutor');
    const coverImage = document.getElementById('coverImage');

    // Lista de canciones y estado
    const songs = [
        {src: 'Inamorata.mp3', title: 'Inamorata', autor: 'Mareux', cover: 'inamorata.png'},
        {src: 'did-i-tell.mp3', title: 'did i tell u that i miss u', autor: 'adore', cover: 'did-i-tell.png'},
        {src: 'Jealous.mp3', title: 'Jealous', autor: 'Eyedress', cover: 'jealous.png'},
        {src: 'the-lost.mp3', title: 'The Lost Soul Down', autor: 'NBSPLV', cover: 'the-lost.png'},
        {src: 'Buttercup.mp3', title: 'Buttercup', autor: 'Jack Stauber', cover: 'buttercup.png'}
    ];

    let currentSongIndex = 0;
    let isSeeking = false; // Bandera para detectar interacción con el slider

    // Función de formato de tiempo
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // Cargar canción
    function loadSong(index) {
        console.log(`Cargando canción: ${songs[index].title}`);
        audio.src = songs[index].src;
        songTitle.textContent = songs[index].title;
        songAutor.textContent = songs[index].autor;
        coverImage.src = songs[index].cover;
        audio.load();
        
        // Resetear barra y tiempos
        progressBar.value = 0;
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = '0:00';
    }

    // Eventos de audio
    audio.addEventListener('loadedmetadata', () => {
        progressBar.max = audio.duration;
        durationSpan.textContent = formatTime(audio.duration);
        console.log(`Metadatos cargados. Duración: ${audio.duration} segundos.`);
    });

    audio.addEventListener('timeupdate', () => {
        if (!isSeeking) {  // Solo actualiza el slider si el usuario no está interactuando
            progressBar.value = audio.currentTime;
            currentTimeSpan.textContent = formatTime(audio.currentTime);
        }
    });

    // Eventos para manejar la interacción con el slider usando pointer events
    progressBar.addEventListener('pointerdown', () => {
        isSeeking = true;
        console.log("Inicio de interacción con el slider (pointerdown).");
    });

    progressBar.addEventListener('pointerup', () => {
        isSeeking = false;
        console.log("Fin de interacción con el slider (pointerup). Valor final:", progressBar.value);
        audio.currentTime = Number(progressBar.value);
    });

    // Fallback para el evento change (útil en dispositivos táctiles)
    progressBar.addEventListener('change', () => {
        console.log("Cambio en slider (change). Valor:", progressBar.value);
        audio.currentTime = Number(progressBar.value);
    });

    // Botón de play/pause
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                playPauseBtn.textContent = '❚❚';
                console.log("Reproduciendo audio.");
            }).catch(err => {
                console.error("Error al reproducir audio:", err);
            });
        } else {
            audio.pause();
            playPauseBtn.textContent = '►';
            console.log("Audio pausado.");
        }
    });

    // Botones de canción anterior y siguiente
    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        console.log("Canción anterior. Índice:", currentSongIndex);
        loadSong(currentSongIndex);
        audio.play().then(() => {
            playPauseBtn.textContent = '❚❚';
        });
    });

    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        console.log("Canción siguiente. Índice:", currentSongIndex);
        loadSong(currentSongIndex);
        audio.play().then(() => {
            playPauseBtn.textContent = '❚❚';
        });
    });

    // Botón de mute
    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.textContent = audio.muted ? '🔊 Unmute' : '🔇 Mute';
        console.log("Audio muted:", audio.muted);
    });

    // Barra de volumen
    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value;
        console.log("Volumen:", volumeBar.value);
    });

    // Inicialización
    loadSong(currentSongIndex);
});
