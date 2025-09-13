import React, { useEffect, useRef, useState } from "react";
import Video from "twilio-video";
import "./VideoRTC.scss";

const VideoRTC = ({ meetingData, onMeetingEnd }) => {
  const webcamFeedContainerRef = useRef(null);
  const mainFeedRef = useRef(null);
  const transcriptRef = useRef(null);
  const roomRef = useRef(null); // Use a ref to hold the room object
  const [isConnected, setIsConnected] = useState(false); // New state to track connection status

  let localDataTrack;

  // ✅ Initialize the Twilio room
  useEffect(() => {
    const startRoom = async () => {
      // Prevent connection if no meeting data or if we are already connected
      if (!meetingData || isConnected) {
        return;
      }

      const { roomName, token } = meetingData;
     
      try {
        const room = await joinVideoRoom(roomName, token);
        roomRef.current = room; // Store the room object in the ref
        setIsConnected(true); // Update state to show we are connected

        // Handle the local participant first
        handleConnectedParticipant(room.localParticipant, true);
       
        // Then handle all existing remote participants
        room.participants.forEach(participant => {
          handleConnectedParticipant(participant, false);
        });

        room.on("participantConnected", participant => {
          handleConnectedParticipant(participant, false);
        });
        room.on("participantDisconnected", handleDisconnectedParticipant);

        // Handle room disconnection
        room.on("disconnected", () => {
          console.log("Room disconnected");
          if (onMeetingEnd) {
            onMeetingEnd();
          }
          setIsConnected(false); // Reset state on disconnection
        });

        window.addEventListener("beforeunload", () => room.disconnect());

        // 🎤 Start mic capture + transcription
        startLocalRecording();

      } catch (error) {
        console.error("Failed to connect to Twilio room:", error);
        setIsConnected(false);
      }
    };

    startRoom();

    return () => {
      // Cleanup function to disconnect the room when component unmounts
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
        setIsConnected(false);
      }
    };
  }, [meetingData, isConnected]); // Add isConnected to the dependency array

  // ✅ Join room
  const joinVideoRoom = async (roomName, token) => {
    const { LocalDataTrack, createLocalVideoTrack, createLocalAudioTrack } = Video;

    try {
      let localVideoTrack = await createLocalVideoTrack({ facingMode: "user" });
      let localAudioTrack = await createLocalAudioTrack();
      localDataTrack = new LocalDataTrack();
      console.log({ message: "Connection to video", token, roomName });
     
      return await Video.connect(token, {
        name: roomName,
        audio: { noiseSuppression: true, echoCancellation: true },
        tracks: [localVideoTrack, localAudioTrack, localDataTrack],
      });
    } catch (error) {
      console.error("Error joining video room:", error);
      throw error;
    }
  };

  // ✅ Handle new participant
  const handleConnectedParticipant = (participant, isLocal = false) => {
    const container = isLocal ? webcamFeedContainerRef.current : webcamFeedContainerRef.current;
    if (!container) return;

    // Create a div for the participant if it doesn't already exist
    let participantDiv = document.getElementById(participant.identity);
    if (!participantDiv) {
      participantDiv = document.createElement("div");
      participantDiv.className = "participantDiv mt-2";
      participantDiv.id = participant.identity;
      container.appendChild(participantDiv);
    }

    participant.tracks.forEach((trackPublication) =>
      handleTrackPublication(trackPublication, participant, isLocal)
    );

    participant.on("trackPublished", (trackPublication) =>
      handleTrackPublication(trackPublication, participant, isLocal)
    );

    participant.on("trackSubscribed", (track) =>
      handleTrackSubscription(track, participant)
    );
  };

  // ✅ Handle track publication
  const handleTrackPublication = (trackPublication, participant, isLocal) => {
    function displayTrack(track) {
      if (track.kind !== "data") {
        const usernameDiv = document.createElement("div");
        usernameDiv.className = "usernameDiv";
        const truncatedIdentity = truncate(participant.identity, 10);
        usernameDiv.innerText = isLocal ? "You" : `user-${truncatedIdentity}`;

        const participantDiv = document.getElementById(participant.identity);
        if (!participantDiv) return;

        // Clear any old track attachments before adding the new one
        participantDiv.innerHTML = "";
       
        if (isLocal) {
          // Local participant: Attach their video to the small webcam container.
          if (track.kind === "video") {
            participantDiv.append(track.attach());
            participantDiv.appendChild(usernameDiv);
          }
        } else {
          // Remote participant: Attach their video to the main feed and also to the small webcam container.
          const mainFeed = mainFeedRef.current;
          if (mainFeed && track.kind === "video") {
            mainFeed.innerHTML = "";
            mainFeed.append(track.attach());
            mainFeed.appendChild(usernameDiv);
          }
          if (track.kind === "video" || track.kind === "audio") {
            participantDiv.append(track.attach());
            participantDiv.appendChild(usernameDiv.cloneNode(true)); // cloneNode to prevent moving element
          }
        }
      }
    }

    if (trackPublication.track) {
      displayTrack(trackPublication.track);
    }

    trackPublication.on("subscribed", () => {
      displayTrack(trackPublication.track);
    });
  };

  // ✅ Handle data messages (transcripts)
  const handleTrackSubscription = (track, participant) => {
    if (track.kind === "data") {
      track.on("message", (data) => {
        const message = JSON.parse(data);
        showTranscript(message.transcript, participant.identity);
      });
    }
  };

  // ✅ Handle disconnect
  const handleDisconnectedParticipant = (participant) => {
    participant.removeAllListeners();
    const participantDiv = document.getElementById(participant.identity);
    if (participantDiv) participantDiv.remove();
  };

  // ✅ Utility
  const truncate = (str, max) =>
    str.length > max ? `${str.substr(0, max - 1)}…` : str;

  // ✅ Show transcript
  const showTranscript = (transcript, identity) => {
    if (transcript !== "") {
      const divLiveTranscript = transcriptRef.current;
      const pElement = document.createElement("p");
      pElement.className = "transcript-p";
      const username =
        identity === roomRef.current.localParticipant.identity
          ? "[ You ]"
          : `[ user-${truncate(identity, 10)} ]`;
      pElement.innerText = `${username}: ${transcript}`;

      if (divLiveTranscript.children.length < 2) {
        divLiveTranscript.appendChild(pElement);
      } else {
        divLiveTranscript.removeChild(divLiveTranscript.firstElementChild);
        divLiveTranscript.appendChild(pElement);
      }
    }
  };

  // ✅ Local mic capture + send to backend
  const startLocalRecording = () => {
    let mediaRecorder;
    let chunks = [];

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        chunks = [];

        const formData = new FormData();
        formData.append("audio", blob, "audio.webm");
        formData.append("participantId", roomRef.current.localParticipant.identity);

        try {
          const response = await fetch("http://10.30.2.193:8080/uploadAudio", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();

          if (data.transcript) {
            showTranscript(data.transcript, roomRef.current.localParticipant.identity);

            if (localDataTrack) {
              localDataTrack.send(
                JSON.stringify({ transcript: data.transcript })
              );
            }
          }
        } catch (err) {
          console.error("Error uploading audio:", err);
        }
      };

      // stop & restart every 5s
      setInterval(() => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          mediaRecorder.start();
        }
      }, 5000);
    });
  };

  return (
    <div className="video-rtc-container">
      <div className="container-fluid bg-dark main-container">
        <div className="row p-3">
          <div className="col-9" id="active-speaker-container">
            <div ref={mainFeedRef} id="main-feed"></div>
            <div
              ref={transcriptRef}
              id="live-transcript-container"
              className="text-light text-center"
            ></div>
          </div>
          <div
            className="col-3 overflow-scroll"
            ref={webcamFeedContainerRef}
            id="webcam-feed-container"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default VideoRTC;