import React, { useEffect, useRef, useState } from "react";
import { Room, RoomEvent } from "livekit-client";

interface RoomInterfaceProps {
  roomData: {
    room: string;
    token: string;
    wss: string;
    sessionId: string;
  };
  onClose: () => void;
}

export const RoomInterface: React.FC<RoomInterfaceProps> = ({
  roomData,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const roomRef = useRef<Room | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        console.log("Connecting to room:", roomData.room);

        const room = new Room();
        roomRef.current = room;

        // Set up event listeners
        room.on(RoomEvent.Connected, () => {
          console.log("✅ Connected to room:", roomData.room);
          setConnectionStatus("Connected");
        });

        room.on(RoomEvent.Disconnected, () => {
          console.log("❌ Disconnected from room");
          setConnectionStatus("Disconnected");
        });

        room.on(
          RoomEvent.TrackSubscribed,
          (track, publication, participant) => {
            console.log(
              "🎯 Track subscribed:",
              track.kind,
              "from",
              participant.identity
            );
            if (track.kind === "video" && videoRef.current) {
              track.attach(videoRef.current);
              setHasVideo(true);
              console.log("📹 Video track attached to video element");
            } else if (track.kind === "audio") {
              if (audioRef.current) {
                track.attach(audioRef.current);
                setHasAudio(true);
                console.log("🎤 Audio track attached to audio element");
                console.log(
                  "🎤 Audio element ready state:",
                  audioRef.current.readyState
                );
                console.log(
                  "🎤 Audio element volume:",
                  audioRef.current.volume
                );
                console.log("🎤 Audio element muted:", audioRef.current.muted);
              } else {
                console.log("❌ Audio element not ready for track attachment");
              }
            }
          }
        );

        room.on(RoomEvent.TrackUnsubscribed, (track) => {
          console.log("📹 Track unsubscribed:", track.kind);
          track.detach();
          if (track.kind === "video") {
            setHasVideo(false);
          } else if (track.kind === "audio") {
            setHasAudio(false);
          }
        });

        // Connect to the room
        await room.connect(roomData.wss, roomData.token);
        console.log("🔗 Room connection successful");

        // Try to enable camera and microphone
        try {
          await room.localParticipant.enableCameraAndMicrophone();
          console.log("📷 Camera and microphone enabled");
        } catch (mediaError) {
          console.error("❌ Failed to enable camera/microphone:", mediaError);
          setConnectionStatus("Media access denied - check permissions");
        }
      } catch (error) {
        console.error("❌ Failed to connect to room:", error);
        setConnectionStatus("Connection failed");
      }
    };

    connectToRoom();

    return () => {
      if (roomRef.current) {
        console.log("🔌 Disconnecting from room");
        roomRef.current.disconnect();
      }
    };
  }, [roomData]);

  // Ensure audio element is properly configured
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.muted = false;
      console.log("🎵 Audio element configured: volume=1.0, muted=false");
    }
  }, []);

  const toggleVideo = async () => {
    if (roomRef.current) {
      try {
        const videoPublications =
          roomRef.current.localParticipant.getTrackPublications();
        const videoTrack = videoPublications.find(
          (pub) => pub.source === "camera"
        );

        if (videoTrack) {
          if (videoTrack.isMuted) {
            await videoTrack.unmute();
            setVideoEnabled(true);
            console.log("📹 Video enabled");
          } else {
            await videoTrack.mute();
            setVideoEnabled(false);
            console.log("📹 Video disabled");
          }
        } else {
          console.log("📹 No video track found");
        }
      } catch (error) {
        console.error("❌ Error toggling video:", error);
      }
    }
  };

  const toggleAudio = async () => {
    if (roomRef.current) {
      try {
        const audioPublications =
          roomRef.current.localParticipant.getTrackPublications();
        const audioTrack = audioPublications.find(
          (pub) => pub.source === "microphone"
        );

        if (audioTrack) {
          if (audioTrack.isMuted) {
            await roomRef.current.localParticipant.unmute(audioTrack.trackSid);
            setAudioEnabled(true);
            console.log("🎤 Audio enabled");
          } else {
            await roomRef.current.localParticipant.mute(audioTrack.trackSid);
            setAudioEnabled(false);
            console.log("🎤 Audio disabled");
          }
        } else {
          console.log("🎤 No audio track found");
        }
      } catch (error) {
        console.error("❌ Error toggling audio:", error);
      }
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            📞 Call Room
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Room: {roomData.room}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === "Connected"
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          ></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {connectionStatus}
          </span>
        </div>
      </div>

      {/* Video Display - Main Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 relative mb-4">
          <video
            ref={videoRef}
            className="w-full h-full bg-gray-900 rounded-lg object-cover"
            autoPlay
            playsInline
            style={{ minHeight: "300px" }}
          />

          {/* Hidden audio element for AI voice playback */}
          <audio
            ref={audioRef}
            autoPlay
            playsInline
            controls={false}
            style={{ display: "none" }}
            onLoadedData={() => console.log("🎵 Audio element loaded data")}
            onCanPlay={() => console.log("🎵 Audio element can play")}
            onPlay={() => console.log("🎵 Audio element started playing")}
            onError={(e) => console.error("❌ Audio element error:", e)}
            onVolumeChange={() => console.log("🎵 Audio volume changed")}
          />
          {!hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-center text-white">
                <div className="text-4xl mb-3">🎥</div>
                <p className="text-sm font-medium">
                  Waiting for video stream...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Make sure camera permissions are granted
                </p>
              </div>
            </div>
          )}
          {hasVideo && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
              🔴 LIVE
            </div>
          )}
        </div>

        {/* Audio Visualization */}
        <div className="mb-4">
          <div className="text-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              🎵 Audio Status
            </span>
          </div>
          <div className="flex justify-center items-center gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  hasAudio && connectionStatus === "Connected"
                    ? "h-6 bg-gradient-to-t from-green-500 to-blue-500 animate-pulse"
                    : connectionStatus === "Connected"
                    ? "h-3 bg-gradient-to-t from-yellow-500 to-orange-500"
                    : "h-1 bg-gray-400"
                }`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            {hasAudio && connectionStatus === "Connected"
              ? "🎤 AI voice active - You should hear audio!"
              : connectionStatus === "Connected"
              ? "🎤 Connected - Waiting for AI audio..."
              : "Waiting for connection..."}
          </p>
        </div>

        {/* Enhanced Controls */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={toggleVideo}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all transform hover:scale-105 ${
              hasVideo
                ? "bg-blue-500 hover:bg-blue-600 shadow-lg ring-2 ring-blue-300"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
            title={hasVideo ? "Video Active" : "Waiting for Video"}
          >
            📹
          </button>
          <button
            onClick={toggleAudio}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all transform hover:scale-105 ${
              connectionStatus === "Connected"
                ? "bg-green-500 hover:bg-green-600 shadow-lg ring-2 ring-green-300"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
            title={
              connectionStatus === "Connected"
                ? "Audio Active"
                : "Waiting for Audio"
            }
          >
            🎤
          </button>
          <button
            onClick={onClose}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all transform hover:scale-105 shadow-lg ring-2 ring-red-300"
            title="End Call"
          >
            📞
          </button>
        </div>

        {/* Status Messages */}
        <div className="text-center space-y-1">
          {hasVideo && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              ✅ Video stream active - High quality
            </p>
          )}
          {hasAudio && connectionStatus === "Connected" && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              🔊 AI audio received - You should hear the assistant's voice!
            </p>
          )}
          {connectionStatus === "Connected" && !hasAudio && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              🎵 Connected - Waiting for AI audio stream...
            </p>
          )}
          {connectionStatus === "Media access denied - check permissions" && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              ⚠️ Please allow camera/microphone access in browser
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
