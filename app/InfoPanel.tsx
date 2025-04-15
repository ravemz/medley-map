import { ViewfinderCircleIcon, LinkIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { Room } from "./config.types";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";

interface InfoPanelProps {
  room?: Room;
  focusedRoom?: Room;
  coordinates?: [number, number];
  zoomLevel?: number;
  onZoomClick?: (room: Room) => void;
  isMapMoving?: boolean;
  calloutHidden?: boolean;
}

export default function InfoPanel({
  room,
  focusedRoom,
  coordinates,
  zoomLevel = 1, // Default zoom level if not provided
  onZoomClick,
  isMapMoving = false,
  calloutHidden = false,
}: InfoPanelProps) {
  const t = useTranslations();
  
  if (!room) {
    return (
      <>
        {/* About link with info icon in bottom right (moved up for mobile visibility) */}
        <div className="absolute bottom-[100px] right-0 text-right z-20">
          <div className="m-2 inline-block rounded border border-border bg-background opacity-75 shadow-xl hover:opacity-100">
            <a href="/about" className="inline-block p-2 flex items-center" title="About & Attributions">
              <InformationCircleIcon className="size-5 mr-1" />
              <span>{t("about.title")}</span>
            </a>
          </div>
        </div>
      </>
    );
  }
  
  const handleZoomClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onZoomClick) return;
    e.stopPropagation();
    onZoomClick(room);
  };

  return (
    <>
      {/* About link with info icon in bottom right (moved up for mobile visibility) */}
      <div className="absolute bottom-[100px] right-0 text-right z-20">
        <div className="m-2 inline-block rounded border border-border bg-background opacity-75 shadow-xl hover:opacity-100">
          <a href="/about" className="inline-block p-2 flex items-center" title="About & Attributions">
            <InformationCircleIcon className="size-5 mr-1" />
            <span>{t("about.title")}</span>
          </a>
        </div>
      </div>
      
      {/* Callout cloud for selected house - only show when coordinates are available, not hidden, and map is not moving */}
      {coordinates && room && !calloutHidden && (
        <CalloutWithBoundaryDetection 
          coordinates={coordinates}
          zoomLevel={zoomLevel}
          isMapMoving={isMapMoving}
          room={room}
          onZoomClick={handleZoomClick}
        />
      )}
    </>
  );
}

// Component to handle callout positioning with boundary detection
interface CalloutWithBoundaryDetectionProps {
  coordinates: [number, number];
  zoomLevel: number;
  isMapMoving: boolean;
  room: Room;
  onZoomClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function CalloutWithBoundaryDetection({
  coordinates,
  zoomLevel,
  isMapMoving,
  room,
  onZoomClick
}: CalloutWithBoundaryDetectionProps) {
  const calloutRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    left: coordinates[0],
    top: coordinates[1] - (40 / Math.max(0.5, zoomLevel)),
    transform: 'translate(-50%, -100%)',
    pointerLeft: '50%',
    pointerTransform: '-translate-x-1/2',
    pointerPosition: 'bottom' as 'bottom' | 'top' | 'left' | 'right'
  });

  // Effect to handle boundary detection and position adjustment
  useEffect(() => {
    if (!calloutRef.current) return;

    // Get callout dimensions
    const callout = calloutRef.current;
    const calloutRect = callout.getBoundingClientRect();
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate base position (before any adjustments)
    let left = coordinates[0];
    let top = coordinates[1] - (40 / Math.max(0.5, zoomLevel));
    let transform = 'translate(-50%, -100%)';
    let pointerLeft = '50%';
    let pointerTransform = '-translate-x-1/2';
    let pointerPosition: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
    
    // Check horizontal boundaries
    const calloutWidth = calloutRect.width;
    const halfCalloutWidth = calloutWidth / 2;
    
    // Left boundary check
    if (left - halfCalloutWidth < 20) {
      // Adjust to keep within left boundary with padding
      const adjustment = (20 + halfCalloutWidth) - left;
      left += adjustment;
      
      // Adjust pointer position to maintain visual connection to the point
      const pointerLeftPercentage = 50 - (adjustment / calloutWidth * 100);
      pointerLeft = `${Math.max(10, pointerLeftPercentage)}%`;
    }
    
    // Right boundary check
    if (left + halfCalloutWidth > viewportWidth - 20) {
      // Adjust to keep within right boundary with padding
      const adjustment = (left + halfCalloutWidth) - (viewportWidth - 20);
      left -= adjustment;
      
      // Adjust pointer position to maintain visual connection to the point
      const pointerLeftPercentage = 50 + (adjustment / calloutWidth * 100);
      pointerLeft = `${Math.min(90, pointerLeftPercentage)}%`;
    }
    
    // Top boundary check
    const calloutHeight = calloutRect.height;
    if (top - calloutHeight < 20) {
      // If too close to top, position below the point instead of above
      top = coordinates[1] + (20 / Math.max(0.5, zoomLevel));
      transform = 'translate(-50%, 0)';
      pointerPosition = 'top';
    }
    
    // Calculate the exact position where the pointer should point to
    // This is the original coordinates of the room/house
    const targetX = coordinates[0];
    const targetY = coordinates[1];
    
    // Calculate the center of the callout after adjustments
    const calloutCenterX = left;
    const calloutCenterY = pointerPosition === 'bottom' ? 
      top - calloutHeight / 2 : 
      top + calloutHeight / 2;
    
    // Determine the best position for the pointer based on the relative position
    // of the callout to the target point
    const xDiff = targetX - calloutCenterX;
    const yDiff = targetY - calloutCenterY;
    
    // Determine if we should use a side pointer instead of top/bottom
    const absXDiff = Math.abs(xDiff);
    const absYDiff = Math.abs(yDiff);
    
    // If horizontal distance is significantly greater than vertical distance
    // and the callout is not too close to the edges, use side pointers
    if (absXDiff > absYDiff * 1.5 && 
        left > calloutWidth * 0.3 && 
        left < viewportWidth - calloutWidth * 0.3) {
      
      if (xDiff > 0) {
        // Target is to the right of the callout
        pointerPosition = 'right';
        pointerLeft = '100%';
        pointerTransform = 'translateY(-50%) rotate(-45deg)';
      } else {
        // Target is to the left of the callout
        pointerPosition = 'left';
        pointerLeft = '0%';
        pointerTransform = 'translateY(-50%) rotate(135deg)';
      }
    } else {
      // Use top or bottom pointer based on earlier calculation
      if (pointerPosition === 'top') {
        pointerTransform = '-translate-x-1/2 -translate-y-full rotate-180';
      } else {
        pointerTransform = '-translate-x-1/2';
      }
    }
    
    // Update position state
    setPosition({
      left,
      top,
      transform,
      pointerLeft,
      pointerTransform,
      pointerPosition
    });
  }, [coordinates, zoomLevel, calloutRef]);

  const [calloutState, setCalloutState] = useState({
    width: 0,
    height: 0
  });

  // Effect to measure callout dimensions after initial render
  useEffect(() => {
    if (!calloutRef.current) return;
    
    // Get callout dimensions
    const callout = calloutRef.current;
    const calloutRect = callout.getBoundingClientRect();
    
    setCalloutState({
      width: calloutRect.width,
      height: calloutRect.height
    });
  }, [calloutRef.current]);

  return (
    <div 
      ref={calloutRef}
      className="absolute z-30 pointer-events-none transition-all duration-300 ease-in-out callout-container"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        transform: position.transform,
        opacity: isMapMoving ? 0 : 1,
        visibility: isMapMoving ? 'hidden' : 'visible'
      }}
    >
      <div className="relative">
        {/* Callout cloud */}
        <div className="bg-background bg-opacity-95 p-3 rounded-lg shadow-lg border border-border max-w-xs pointer-events-auto">
          <div>
            <div className="flex items-center">
              <button
                className="mr-2"
                onClick={onZoomClick}
                aria-label="Zoom to house"
              >
                <ViewfinderCircleIcon className="size-5" />
              </button>
              <h1 className="text-lg font-medium flex-grow">{room.label}</h1>
              <button
                className="ml-2 p-1 hover:bg-gray-100 rounded-full pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Copy the URL to clipboard
                  const url = `${window.location.origin}/house/${room.id}`;
                  
                  // Use a more reliable method for copying to clipboard
                  const textarea = document.createElement('textarea');
                  textarea.value = url;
                  textarea.style.position = 'fixed'; // Prevent scrolling to bottom
                  document.body.appendChild(textarea);
                  textarea.focus();
                  textarea.select();
                  
                  try {
                    document.execCommand('copy');
                    // Show feedback
                    const button = e.currentTarget;
                    button.innerText = 'Copied!';
                    setTimeout(() => {
                      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z" clip-rule="evenodd" /></svg>';
                    }, 2000);
                  } catch (err) {
                    console.error('Failed to copy: ', err);
                  }
                  
                  document.body.removeChild(textarea);
                }}
                aria-label="Copy link to house"
                title="Copy link"
              >
                <LinkIcon className="size-5" />
              </button>
            </div>
            {room.aliases && room.aliases.length > 0 && (
              <h2 className="text-secondary-text text-sm mt-1">{room.aliases.join(", ")}</h2>
            )}
          </div>
        </div>
        
        {/* Pointer triangle - with dynamic positioning based on callout position */}
        {position.pointerPosition === 'bottom' && (
          <div 
            className="absolute bottom-0 transform translate-y-full"
            style={{
              left: position.pointerLeft,
              transform: position.pointerTransform
            }}
          >
            <div className="w-4 h-4 bg-background bg-opacity-95 border-r border-b border-border rotate-45 transform -translate-y-2"></div>
          </div>
        )}
        
        {position.pointerPosition === 'top' && (
          <div 
            className="absolute top-0 transform -translate-y-full"
            style={{
              left: position.pointerLeft,
              transform: position.pointerTransform
            }}
          >
            <div className="w-4 h-4 bg-background bg-opacity-95 border-l border-t border-border rotate-45 transform translate-y-2"></div>
          </div>
        )}
        
        {position.pointerPosition === 'left' && (
          <div 
            className="absolute left-0 top-1/2 transform -translate-x-full"
            style={{
              transform: position.pointerTransform
            }}
          >
            <div className="w-4 h-4 bg-background bg-opacity-95 border-l border-t border-border rotate-45 transform translate-x-2"></div>
          </div>
        )}
        
        {position.pointerPosition === 'right' && (
          <div 
            className="absolute right-0 top-1/2 transform translate-x-full"
            style={{
              transform: position.pointerTransform
            }}
          >
            <div className="w-4 h-4 bg-background bg-opacity-95 border-r border-b border-border rotate-45 transform -translate-x-2"></div>
          </div>
        )}
      </div>
    </div>
  );
}
