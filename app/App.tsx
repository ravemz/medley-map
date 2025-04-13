"use client";

import { useState, useEffect } from "react";
import Map from "./Map";
import RoomSelect from "./RoomSelect";
import InfoPanel from "./InfoPanel";
import config from "./config";
import { Room } from "./config.types";
import { set } from "ol/transform";

export default function App({ roomId }: { roomId?: string }) {
  // Find the main entry room to use as default
  const mainEntryRoom = config.map.rooms.find((room) => room.id === "main-entry");
  
  // If roomId is provided, use that room, otherwise default to main entry
  const initialRoom = roomId 
    ? config.map.rooms.find((room) => room.id === roomId) 
    : mainEntryRoom;
    
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(initialRoom);
  const [focusedRoom, setFocusedRoom] = useState<Room | undefined>(initialRoom);

  // Check for admin=true in URL parameters
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    // Check URL parameters for admin=true
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    setIsAdmin(adminParam === 'true');
  }, []);

  const [infoPanelExpanded, setInfoPanelExpanded] = useState(() => {
    return Boolean(
      typeof localStorage !== "undefined" &&
        localStorage.getItem("infoPanelExpanded"),
    );
  });

  const onRoomSelected = (room?: Room) => {
    if (!room) {
      setSelectedRoom(undefined);
      window.history.replaceState(null, "", "/");
    } else {
      history.replaceState(null, "", `/room/${room.id}`);
      setSelectedRoom(room);
    }
  };

  const onRoomSelectedFromMap = (room?: Room) => {
    setFocusedRoom(undefined);
    onRoomSelected(room);
  };

  const onRoomSelectedFromDropdown = (room?: Room) => {
    setFocusedRoom(room);
    onRoomSelected(room);
  };

  const onInfoPanelExpandChange = (expanded: boolean) => {
    setInfoPanelExpanded(expanded);
    typeof localStorage !== "undefined" &&
      localStorage.setItem("infoPanelExpanded", expanded ? "true" : "");
  };

  const onZoomClick = (room: Room) => {
    setFocusedRoom(room);
  };

  const onPan = () => {
    setFocusedRoom(undefined);
  };

  return (
    <main>
      <Map
        className="h-screen w-screen"
        config={config}
        selectedRoom={selectedRoom}
        focusedRoom={focusedRoom}
        onRoomSelected={onRoomSelectedFromMap}
        onPan={onPan}
        isAdmin={isAdmin}
      />
      <RoomSelect config={config} onRoomSelected={onRoomSelectedFromDropdown} />
      <InfoPanel
        room={selectedRoom}
        expanded={infoPanelExpanded}
        focusedRoom={focusedRoom}
        onInfoPanelExpandChange={onInfoPanelExpandChange}
        onZoomClick={onZoomClick}
      />
    </main>
  );
}
