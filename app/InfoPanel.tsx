import { ViewfinderCircleIcon, LinkIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { Room } from "./config.types";
import { useTranslations } from "next-intl";

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
        {/* About link with info icon in bottom right */}
        <div className="absolute bottom-0 right-0 text-right z-20">
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
      {/* About link with info icon in bottom right */}
      <div className="absolute bottom-0 right-0 text-right z-20">
        <div className="m-2 inline-block rounded border border-border bg-background opacity-75 shadow-xl hover:opacity-100">
          <a href="/about" className="inline-block p-2 flex items-center" title="About & Attributions">
            <InformationCircleIcon className="size-5 mr-1" />
            <span>{t("about.title")}</span>
          </a>
        </div>
      </div>
      
      {/* Callout cloud for selected house - only show when coordinates are available, not hidden, and map is not moving */}
      {coordinates && room && !calloutHidden && (
        <div 
          className="absolute z-30 pointer-events-none transition-all duration-300 ease-in-out callout-container"
          style={{
            left: `${coordinates[0]}px`,
            // Adjust the vertical offset based on zoom level - more offset at higher zoom
            top: `${coordinates[1] - (40 / Math.max(0.5, zoomLevel))}px`,
            transform: 'translate(-50%, -100%)',
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
                    onClick={handleZoomClick}
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
            
            {/* Pointer triangle */}
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
              <div className="w-4 h-4 bg-background bg-opacity-95 border-r border-b border-border rotate-45 transform -translate-y-2"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
