const webcamFeedContainer = document.getElementById('webcam-feed-container');
const mainFeedElement = document.getElementById('main-feed');
const divLiveTranscript = document.getElementById('live-transcript-container');

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

let accessToken;
let room;
let localDataTrack;

async function startRoom() {
  const roomName = 'room003'; // you can change this per user/session
  const response = await fetch('/join-room', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomName }),
  });

  // backend now decides: either fetch existing room or create new one
  const { token } = await response.json();
  accessToken = token;

  room = await joinVideoRoom(roomName, token);

  handleConnectedParticipant(room.localParticipant);
  room.participants.forEach(handleConnectedParticipant);
  room.on('participantConnected', handleConnectedParticipant);
  room.on('participantDisconnected', handleDisconnectedParticipant);

  window.addEventListener('pagehide', () => room.disconnect());
  window.addEventListener('beforeunload', () => room.disconnect());

  // 🎤 Start local mic recording + transcription
  startLocalRecording();
}

async function joinVideoRoom(roomName, token) {
  const { LocalDataTrack, createLocalVideoTrack, createLocalAudioTrack } = Twilio.Video;

  let localVideoTrack = await createLocalVideoTrack({ facingMode: 'user' });
  let localAudioTrack = await createLocalAudioTrack();
  localDataTrack = new LocalDataTrack();

  try {
    return await Twilio.Video.connect(token, {
      name: roomName,
      audio: { noiseSuppression: true, echoCancellation: true },
      tracks: [localVideoTrack, localAudioTrack, localDataTrack],
    });
  } catch (error) {
    console.error('❌ Failed to connect to room:', error);
  }
}

async function handleConnectedParticipant(participant) {
  const participantDiv = document.createElement('div');
  participantDiv.setAttribute('class', 'participantDiv mt-2');
  participantDiv.setAttribute('id', participant.identity);
  webcamFeedContainer.appendChild(participantDiv);

  participant.tracks.forEach((trackPublication) => {
    handleTrackPublication(trackPublication, participant);
  });

  participant.on('trackPublished', (trackPublication) => {
    handleTrackPublication(trackPublication, participant);
  });

  participant.on('trackSubscribed', (track) => {
    handleTrackSubscription(track, participant);
  });
}

function handleTrackPublication(trackPublication, participant) {
  function switchMainFeed(track, usernameDiv) {
    mainFeedElement.innerHTML = '';
    mainFeedElement.append(track.attach());
    mainFeedElement.appendChild(usernameDiv);
  }

  function displayTrack(track) {
    if (track.kind !== 'data') {
      const participantDiv = document.getElementById(participant.identity);
      participantDiv.append(track.attach());

      const usernameDiv = document.createElement('div');
      usernameDiv.setAttribute('class', 'usernameDiv');
      const truncatedIdentity = truncate(participant.identity, 10);
      usernameDiv.innerText =
        participant.identity === room.localParticipant.identity ? 'You' : `user-${truncatedIdentity}`;
      participantDiv.appendChild(usernameDiv);

      if (track.kind === 'video') {
        switchMainFeed(track, usernameDiv);
        participantDiv.addEventListener('click', () => {
          switchMainFeed(track, usernameDiv);
        });
      }
    }
  }

  if (trackPublication.track) {
    displayTrack(trackPublication.track);
  }

  trackPublication.on('subscribed', () => {
    displayTrack(trackPublication.track);
  });
}

function handleTrackSubscription(track, participant) {
  if (track.kind === 'data') {
    track.on('message', (data) => {
      const message = JSON.parse(data);
      showTranscript(message.transcript, participant.identity);
    });
  }
}

function handleDisconnectedParticipant(participant) {
  participant.removeAllListeners();
  const participantDiv = document.getElementById(participant.identity);
  participantDiv.remove();
}

function truncate(str, max) {
  return str.length > max ? `${str.substr(0, max - 1)}…` : str;
}

startRoom();

function showTranscript(transcript, identity) {
  if (transcript !== '') {
    const pElement = document.createElement('p');
    pElement.setAttribute('class', 'transcript-p');
    const username =
      identity === room.localParticipant.identity ? '[ You ]' : `[ user-${truncate(identity, 10)} ]`;
    pElement.innerText = `${username}: ${transcript}`;

    if (divLiveTranscript.children.length < 2) {
      divLiveTranscript.appendChild(pElement);
    } else {
      divLiveTranscript.removeChild(divLiveTranscript.firstElementChild);
      divLiveTranscript.appendChild(pElement);
    }
  }
}

// 🎤 Local mic capture + send to backend for OpenAI transcript
let mediaRecorder;
let chunks = [];

function startLocalRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      chunks = [];

      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');

      try {
        const response = await fetch('https://57643cfd0548.ngrok-free.app/uploadAudio', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.transcript) {
          // Show transcript locally
          showTranscript(data.transcript, room.localParticipant.identity);

          // Broadcast transcript to other participants
          if (localDataTrack) {
            localDataTrack.send(JSON.stringify({ transcript: data.transcript }));
          }
        }
      } catch (err) {
        console.error('Error uploading audio:', err);
      }
    };

    // Stop & restart every 5 seconds
    setInterval(() => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.start();
      }
    }, 5000);
  });
}
