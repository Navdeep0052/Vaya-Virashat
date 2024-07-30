import React, { useEffect, useRef } from 'react';
import { useSocket } from './SocketContext';

const VideoCallComponent = ({ peerConnection, remoteStream, endCall }) => {
  const { socket } = useSocket();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const localStreamRef = useRef(null); // Store local stream

  useEffect(() => {
    if (peerConnection && remoteStream) {
      peerConnection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      socket.on('offer', async ({ offer, senderId }) => {
        if (!peerConnection) return;
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
        socket.emit('answer', { answer, receiverId: senderId });
      });

      socket.on('answer', async ({ answer }) => {
        if (!peerConnection) return;
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('candidate', async ({ candidate }) => {
        if (!peerConnection) return;
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', { candidate: event.candidate, receiverId });
        }
      };
    }
  }, [peerConnection, remoteStream, socket]);

  useEffect(() => {
    if (localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream; // Store the stream in ref
          localVideoRef.current.srcObject = stream;
          stream.getTracks().forEach((track) => {
            if (peerConnection) {
              peerConnection.addTrack(track, stream);
            }
          });
        })
        .catch((error) => {
          console.error('Error accessing media devices.', error);
        });
    }
  }, [peerConnection]);

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop()); 
    }
    endCall(); 
    window.location.reload();
  };

  return (
    <div className="video-call-container">
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
      <button onClick={handleEndCall}>End Call</button> 
    </div>
  );
};

export default VideoCallComponent;
