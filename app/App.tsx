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
  const [selectedRoomCoords, setSelectedRoomCoords] = useState<[number, number] | undefined>(undefined);
  const [focusedRoom, setFocusedRoom] = useState<Room | undefined>(initialRoom);
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);
  const [mapRef, setMapRef] = useState<any>(null);
  const [isMapMoving, setIsMapMoving] = useState<boolean>(false);
  const [calloutHidden, setCalloutHidden] = useState<boolean>(false);

  // Check for admin=true in URL parameters
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    // Check URL parameters for admin=true
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    setIsAdmin(adminParam === 'true');
  }, []);

  // InfoPanel no longer needs expanded state

  const onRoomSelected = (room?: Room, coordinates?: [number, number]) => {
    if (!room) {
      setSelectedRoom(undefined);
      setSelectedRoomCoords(undefined);
      window.history.replaceState(null, "", "/");
    } else {
      // Change URL scheme from /room to /house
      history.replaceState(null, "", `/house/${room.id}`);
      setSelectedRoom(room);
      if (coordinates) {
        setSelectedRoomCoords(coordinates);
      }
      // When a room is explicitly selected, reset the calloutHidden state
      setCalloutHidden(false);
    }
  };

  const onRoomSelectedFromMap = (room?: Room, coordinates?: [number, number], zoom?: number, mapInstance?: any) => {
    setFocusedRoom(undefined);
    onRoomSelected(room, coordinates);
    if (zoom) {
      setCurrentZoom(zoom);
    }
    if (mapInstance && !mapRef) {
      setMapRef(mapInstance);
    }
    // For manual map selections, the callout visibility is handled in Map.tsx
  };
  
  // No need for special handling of Main Entry anymore

  const onRoomSelectedFromDropdown = (room?: Room) => {
    // Set the focused room and selected room
    setFocusedRoom(room);
    
    // Hide the callout for search selections and keep it hidden
    setCalloutHidden(true);
    
    onRoomSelected(room);
  };

  // onInfoPanelExpandChange removed as it's no longer needed

  const onZoomClick = (room: Room) => {
    setFocusedRoom(room);
  };

  const onPan = () => {
    setFocusedRoom(undefined);
  };

  return (
    <main className="flex flex-col h-screen">
      <div className="z-10">
        <RoomSelect config={config} onRoomSelected={onRoomSelectedFromDropdown} />
      </div>
      <div className="flex-grow relative min-h-[70vh]">
        <Map
          className="h-full w-full"
          config={config}
          selectedRoom={selectedRoom}
          focusedRoom={focusedRoom}
          onRoomSelected={onRoomSelectedFromMap}
          onPan={onPan}
          onZoomChange={setCurrentZoom}
          onMapInitialized={() => setMapInitialized(true)}
          setIsMapMoving={setIsMapMoving}
          setCalloutHidden={setCalloutHidden}
          isAdmin={isAdmin}
        />
        <InfoPanel
          room={selectedRoom}
          focusedRoom={focusedRoom}
          coordinates={selectedRoomCoords}
          zoomLevel={currentZoom}
          onZoomClick={onZoomClick}
          isMapMoving={isMapMoving}
          calloutHidden={calloutHidden}
        />
      </div>
    </main>
  );
}
