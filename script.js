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
        {src: 'music/Inamorata.mp3', title: 'Inamorata', autor: 'Mareux', cover: 'music-ft/inamorata.png'},
        {src: 'music/did-i-tell.mp3', title: 'did i tell u that i miss u', autor: 'adore', cover: 'music-ft/did-i-tell.png'},
        {src: 'music/Jealous.mp3', title: 'Jealous', autor: 'Eyedress', cover: 'music-ft/jealous.png'},
        {src: 'music/the-lost.mp3', title: 'The Lost Soul Down', autor: 'NBSPLV', cover: 'music-ft/the-lost.png'},
        {src: 'music/Buttercup.mp3', title: 'Buttercup', autor: 'Jack Stauber', cover: 'music-ft/buttercup.png'},
        {src: 'music/abandoned.mp3', title: 'Abandoned (Slowed)', autor: 'ANGUISH, LMG y ily', cover: 'music-ft/abandoned.png'},
	{src: 'music/Sapphire.mp3', title: 'Sapphire', autor: 'Perpetualll', cover: 'music-ft/sapphire.png'}
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

    // Manejo del slider con eventos pointer para buscar en el audio
    progressBar.addEventListener('pointerdown', () => {
        isSeeking = true;
        console.log("Inicio de interacción con el slider (pointerdown).");
    });

    progressBar.addEventListener('pointerup', () => {
        isSeeking = false;
        console.log("Fin de interacción con el slider (pointerup). Valor final:", progressBar.value);
        audio.currentTime = Number(progressBar.value);
    });

    // Se elimina el listener 'change' para evitar llamadas redundantes que pudieran provocar el reinicio

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

    progressBar.addEventListener('input', () => {
        isSeeking = true;
        console.log("Buscando en el audio. Valor actual:", progressBar.value);
    });
    
        // Control de volumen
    volumeBar.addEventListener('input', () => {
        const volume = Number(volumeBar.value);
        audio.volume = volume;
        console.log("Volumen ajustado a:", volume);
    });


    progressBar.addEventListener('change', () => {
        isSeeking = false;
        console.log("Interacción terminada. Actualizando tiempo a:", progressBar.value);
        audio.currentTime = Number(progressBar.value);
    });

    // Inicialización
    loadSong(currentSongIndex);
});
