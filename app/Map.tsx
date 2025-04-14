import { Feature, MapBrowserEvent, Map as olMap, View } from "ol";
import { Polygon, Point } from "ol/geom";
import { defaults as defaultInteractions } from "ol/interaction";
import { defaults as defaultControls } from "ol/control";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Translate from "ol/interaction/Translate";
import ImageLayer from "ol/layer/Image.js";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import Projection from "ol/proj/Projection.js";
import Static from "ol/source/ImageStatic.js";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Room, Config } from "./config.types";

// Define the available edit modes
type EditMode = "view" | "move" | "draw" | "resize";

interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
  config: Config;
  selectedRoom?: Room;
  focusedRoom?: Room;
  onRoomSelected?: (room?: Room) => void;
  onInfoSelected?: () => void;
  onPan?: () => void;
  isAdmin?: boolean; // New prop to control edit mode visibility
}

async function decodeAllImages(src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  return img;
}

export default function Map({
  config,
  selectedRoom,
  focusedRoom,
  onRoomSelected,
  onInfoSelected,
  onPan,
  isAdmin,
  ...divProps
}: MapProps) {
  const [mapDiv, setMapDiv] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<olMap | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [mode, setMode] = useState<EditMode>("view");
  const [translateInteraction, setTranslateInteraction] = useState<Translate | null>(null);
  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
  const [modifyInteraction, setModifyInteraction] = useState<Modify | null>(null);
  const [newRoomName, setNewRoomName] = useState<string>("");
  const [nextRoomId, setNextRoomId] = useState<number>(30); // Start from M-30
  const vectorSourceRef = useRef<VectorSource | null>(null);
  
  // Create a stable callback for the map div ref
  const setMapDivRef = useCallback((node: HTMLDivElement | null) => {
    setMapDiv(node);
  }, []);

  // Define a bright green color for better contrast on green/brown background
  const YELLOW_COLOR = "#FFFF00";
  // Define a bright red color for the main entry
  const RED_COLOR = "#FF0000";

  const selectedStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: YELLOW_COLOR,
          width: 4,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 0, 0)",
        }),
      }),
    [],
  );

  const unselectedStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: YELLOW_COLOR,
          width: 2,
          lineDash: [0.1, 5],
        }),
        fill: new Fill({
          color: "rgba(0, 0, 0, 0)",
        }),
      }),
    [],
  );

  // Special style for the main entry - always highlighted in red
  const mainEntryStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: RED_COLOR,
          width: 3,
        }),
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.1)",
        }),
      }),
    [],
  );

  useEffect(() => {
    if (mapDiv == null) {
      return;
    }

    decodeAllImages(config.map.src).then((img) => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const extent = [0, 0, width, height];
      const projection = new Projection({
        code: "image",
        units: "pixels",
        extent: extent,
      });

      const imageLayer = new ImageLayer({
        source: new Static({
          url: config.map.src,
          projection: projection,
          imageExtent: extent,
        }),
      });

      const markers = config.map.rooms.map((room) => {
        const feature = new Feature({
          geometry: new Polygon([
            room.area.map((coords) => [coords[0], height - coords[1]]),
          ]),
          room,
        });
        
        // Apply special style to main-entry
        if (room.id === "main-entry") {
          feature.setStyle(mainEntryStyle);
        }
        
        return feature;
      });
      const markerSource = new VectorSource({
        features: markers,
        wrapX: false,
      });
      const markersLayer = new VectorLayer({
        source: markerSource,
        style: function(feature) {
          // For main-entry, always use the mainEntryStyle
          if (feature.get("room")?.id === "main-entry") {
            return mainEntryStyle;
          }
          // For other features, use the default unselectedStyle
          return unselectedStyle;
        }
      });

      const map = new olMap({
        target: mapDiv,
        // Disable zoom controls (+/- buttons)
        controls: defaultControls({
          zoom: false
        }),
        interactions: defaultInteractions({
          altShiftDragRotate: false,
          pinchRotate: false,
          // Enable mouseWheelZoom to allow zooming in and out
          mouseWheelZoom: true,
          // Keep basic interactions like dragging
          dragPan: true,
        }),
        layers: [imageLayer, markersLayer],
        view: new View({
          projection: projection,
          // Set a very low minZoom to allow seeing the entire map at once
          minZoom: 0.2,
          // Remove extent constraint to allow panning outside the image
        }),
      });

      // Fit to the extent with padding to ensure the entire map is visible
      map.getView().fit(extent, {
        padding: [20, 20, 20, 20]
      });

      map.on("pointermove", (e) => {
        const selectable = map.forEachFeatureAtPixel(e.pixel, (f) => f);
        if (selectable) {
          mapDiv.style.cursor = "pointer";
        } else {
          mapDiv.style.cursor = "";
        }
      });

      map.on("moveend", (e) => {
        typeof localStorage !== "undefined" &&
          localStorage.setItem(
            "map-extent",
            JSON.stringify(map.getView().calculateExtent()),
          );
        onPan && onPan();
      });

      setMap(map);
    });
  }, [config.map, mapDiv, unselectedStyle]);

  const onMapClick = useCallback(
    (e: MapBrowserEvent<any>) => {
      if (map == null) {
        return;
      }

      const feature: Feature = map.forEachFeatureAtPixel(
        e.pixel,
        (f) => f,
      ) as Feature;
      
      if (feature) {
        onRoomSelected && onRoomSelected(feature.get("room"));
        setSelectedFeature(feature);
      } else {
        onRoomSelected && onRoomSelected(undefined);
        setSelectedFeature(null);
      }
    },
    [map, onRoomSelected],
  );

  useEffect(() => {
    if (map == null) {
      return;
    }

    map.on("click", onMapClick);

    return function cleanup() {
      map.un("click", onMapClick);
    };
  }, [map, onMapClick]);

  useEffect(() => {
    if (map == null) {
      return;
    }

    const vectorLayer = map.getLayers().getArray()[1] as VectorLayer;
    const selected = vectorLayer
      .getSource()!
      .getFeatures()
      .find(
        (f: { get: (arg0: string) => Room }) => f.get("room") === selectedRoom,
      );
    if (selected != null) {
      setSelectedFeature(selected);
    }

    const focused = vectorLayer
      .getSource()!
      .getFeatures()
      .find(
        (f: { get: (arg0: string) => Room }) => f.get("room") === focusedRoom,
      );
      
    // Find the main entry feature
    const mainEntry = vectorLayer
      .getSource()!
      .getFeatures()
      .find(
        (f: { get: (arg0: string) => Room }) => f.get("room")?.id === "main-entry",
      );
      
    if (focused != null) {
      if (focused.get("room")?.id === "main-entry" || !mainEntry) {
        // If the focused room is already the main entry or main entry doesn't exist,
        // just zoom to the focused room
        map.getView().fit(focused.getGeometry().getExtent(), {
          duration: 300,
          maxZoom: 3,
        });
      } else {
        // Calculate a combined extent that includes both the focused room and main entry
        const focusedExtent = focused.getGeometry().getExtent();
        const mainEntryExtent = mainEntry.getGeometry().getExtent();
        
        // Create a combined extent
        const combinedExtent = [
          Math.min(focusedExtent[0], mainEntryExtent[0]),
          Math.min(focusedExtent[1], mainEntryExtent[1]),
          Math.max(focusedExtent[2], mainEntryExtent[2]),
          Math.max(focusedExtent[3], mainEntryExtent[3]),
        ];
        
        // Add some padding
        const padding = 50;
        const paddedExtent = [
          combinedExtent[0] - padding,
          combinedExtent[1] - padding,
          combinedExtent[2] + padding,
          combinedExtent[3] + padding,
        ];
        
        // Fit the view to the combined extent
        map.getView().fit(paddedExtent, {
          duration: 500,
          maxZoom: 2,
        });
      }
    }
  }, [map, selectedRoom, focusedRoom]);

  useEffect(() => {
    // Don't change the style of main-entry when selected
    if (selectedFeature && selectedFeature.get("room")?.id !== "main-entry") {
      selectedFeature.setStyle(selectedStyle);
    }

    const lastSelected = selectedFeature;
    return function cleanup() {
      // Don't change the style of main-entry when deselected
      if (lastSelected && lastSelected.get("room")?.id !== "main-entry") {
        lastSelected.setStyle(unselectedStyle);
      }
    };
  }, [selectedFeature, selectedStyle, unselectedStyle, mainEntryStyle]);

  // Set the current edit mode
  const setEditMode = (newMode: EditMode) => {
    setMode(newMode);
  };

  // Save the updated coordinates
  const saveCoordinates = () => {
    if (!map) return;
    
    const vectorLayer = map.getLayers().getArray()[1] as VectorLayer;
    const features = vectorLayer.getSource()!.getFeatures();
    
    const updatedRooms = features.map((feature) => {
      const room = feature.get("room") as Room;
      const geometry = feature.getGeometry() as Polygon;
      const coordinates = geometry.getCoordinates()[0];
      
      // Convert back to the original coordinate system (y is flipped in OpenLayers)
      const height = map.getView().getProjection().getExtent()[3];
      // Remove the last point if it's the same as the first (OpenLayers adds this to close the polygon)
      const filteredCoords = coordinates.length > 1 && 
        coordinates[0][0] === coordinates[coordinates.length-1][0] && 
        coordinates[0][1] === coordinates[coordinates.length-1][1] 
          ? coordinates.slice(0, -1) 
          : coordinates;
      
      const originalCoords = filteredCoords.map(coord => [Math.round(coord[0]), Math.round(height - coord[1])]);
      
      return {
        ...room,
        area: originalCoords as [number, number][] // Preserve all points in the polygon
      };
    });
    
    // Format the updated rooms for display
    const formattedRooms = JSON.stringify(updatedRooms, null, 2);
    
    // Create a downloadable JSON file with the updated coordinates
    const blob = new Blob([formattedRooms], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_rooms.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Also output to console for debugging
    console.log(formattedRooms);
    alert("Coordinates saved! A JSON file with the updated coordinates has been downloaded.");
  };

  // Create a new room from a drawn feature
  const createRoomFromFeature = (feature: Feature) => {
    if (!map) return;
    
    const geometry = feature.getGeometry() as Polygon;
    let coordinates = geometry.getCoordinates()[0];
    
    // Remove the last point if it's the same as the first (OpenLayers adds this to close the polygon)
    const filteredCoords = coordinates.length > 1 && 
      coordinates[0][0] === coordinates[coordinates.length-1][0] && 
      coordinates[0][1] === coordinates[coordinates.length-1][1] 
        ? coordinates.slice(0, -1) 
        : coordinates;
    
    // Convert to the original coordinate system (y is flipped in OpenLayers)
    const height = map.getView().getProjection().getExtent()[3];
    const originalCoords = filteredCoords.map(coord => [coord[0], height - coord[1]]);
    
    // Create a new room
    const newRoom: Room = {
      id: `m${nextRoomId}`,
      label: newRoomName || `M-${nextRoomId}`,
      aliases: [newRoomName || `M-${nextRoomId}`, `M${nextRoomId}`],
      description: `\n          ${newRoomName || `M-${nextRoomId}`}\n        `,
      area: originalCoords as [number, number][],
    };
    
    // Increment the next room ID
    setNextRoomId(nextRoomId + 1);
    
    // Add the room to the feature
    feature.set('room', newRoom);
    
    // Reset the new room name
    setNewRoomName("");
    
    return newRoom;
  };


  // Handle interactions based on the current mode
  useEffect(() => {
    if (!map) return;
    
    // Clean up any existing interactions
    if (translateInteraction) {
      map.removeInteraction(translateInteraction);
      setTranslateInteraction(null);
    }
    
    if (drawInteraction) {
      map.removeInteraction(drawInteraction);
      setDrawInteraction(null);
    }
    
    if (modifyInteraction) {
      map.removeInteraction(modifyInteraction);
      setModifyInteraction(null);
    }
    
    const vectorLayer = map.getLayers().getArray()[1] as VectorLayer;
    const vectorSource = vectorLayer.getSource() as VectorSource;
    vectorSourceRef.current = vectorSource;
    
    // Add the appropriate interaction based on the current mode
    switch (mode) {
      case "move":
        // Add translate interaction
        const translate = new Translate({
          layers: [vectorLayer]
        });
        
        // Set up event listeners for the translate interaction
        const handleTranslateStart = (event: any) => {
          console.log('Translation started');
        };
        
        const handleTranslateEnd = (event: any) => {
          console.log('Translation ended');
        };
        
        // Add event listeners
        translate.on('translatestart', handleTranslateStart);
        translate.on('translateend', handleTranslateEnd);
        
        // Add the interaction to the map
        map.addInteraction(translate);
        
        // Store the interaction in state
        setTranslateInteraction(translate);
        break;
        
      case "draw":
        // Add draw interaction for polygons with multiple points
        const draw = new Draw({
          source: vectorSource,
          type: 'Polygon',
          // No maxPoints constraint to allow any number of points
          style: new Style({
            stroke: new Stroke({
              color: config.theme.accent,
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(255, 100, 100, 0.2)',
            }),
            // Add point style to show vertices while drawing
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: config.theme.accent,
              }),
            }),
          }),
        });
        
        // Handle the drawend event
        draw.on('drawend', (event) => {
          const feature = event.feature;
          const newRoom = createRoomFromFeature(feature);
          console.log('New room created:', newRoom);
        });
        
        // Add the interaction to the map
        map.addInteraction(draw);
        
        // Store the interaction in state
        setDrawInteraction(draw);
        break;
        
      case "resize":
        // Add modify interaction for resizing
        const modify = new Modify({
          source: vectorSource,
        });
        
        // Add the interaction to the map
        map.addInteraction(modify);
        
        // Store the interaction in state
        setModifyInteraction(modify);
        break;
        
      default:
        // No interaction for view mode
        break;
    }
    
    // Clean up function
    return () => {
      if (translateInteraction) {
        // Just remove the interaction, no need to manually remove event listeners
        map.removeInteraction(translateInteraction);
      }
      
      if (drawInteraction) {
        map.removeInteraction(drawInteraction);
      }
      
      if (modifyInteraction) {
        map.removeInteraction(modifyInteraction);
      }
    };
  }, [map, mode, selectedFeature, nextRoomId, newRoomName]);

  // Get the number of points in a feature's geometry
  const getPointCount = (feature: Feature | null): number => {
    if (!feature) return 0;
    
    const geometry = feature.getGeometry() as Polygon;
    if (!geometry) return 0;
    
    const coordinates = geometry.getCoordinates()[0];
    // Subtract 1 if the last point is the same as the first (closing point)
    return coordinates.length > 1 && 
      coordinates[0][0] === coordinates[coordinates.length-1][0] && 
      coordinates[0][1] === coordinates[coordinates.length-1][1] 
        ? coordinates.length - 1 
        : coordinates.length;
  };

  return (
    <>
      <div ref={setMapDivRef} {...divProps} />
      {/* Only show edit controls when isAdmin is true */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Edit Mode</h3>
          <div className="flex flex-row gap-2 mb-2">
            <button 
              onClick={() => setEditMode("view")}
              className="flex-1 px-4 py-2 rounded shadow-md hover:bg-gray-100 transition-colors"
              style={{ 
                backgroundColor: mode === "view" ? config.theme.accent : 'white',
                color: mode === "view" ? 'white' : config.theme["primary-text"]
              }}
            >
              View
            </button>
            <button 
              onClick={() => setEditMode("move")}
              className="flex-1 px-4 py-2 rounded shadow-md hover:bg-gray-100 transition-colors"
              style={{ 
                backgroundColor: mode === "move" ? config.theme.accent : 'white',
                color: mode === "move" ? 'white' : config.theme["primary-text"]
              }}
            >
              Move
            </button>
          </div>
          
          {mode === "move" && (
            <div className="bg-gray-100 p-3 rounded mb-2 text-sm">
              <p className="mb-1"><strong>Instructions:</strong></p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Click on a polygon to select it</li>
                <li>Drag the polygon to move it</li>
                <li>Click &quot;Save Coordinates&quot; when done</li>
              </ol>
            </div>
          )}
          
          <div className="flex flex-row gap-2 mb-2">
            <button 
              onClick={() => setEditMode("draw")}
              className="flex-1 px-4 py-2 rounded shadow-md hover:bg-gray-100 transition-colors"
              style={{ 
                backgroundColor: mode === "draw" ? config.theme.accent : 'white',
                color: mode === "draw" ? 'white' : config.theme["primary-text"]
              }}
            >
              Draw
            </button>
            <button 
              onClick={() => setEditMode("resize")}
              className="flex-1 px-4 py-2 rounded shadow-md hover:bg-gray-100 transition-colors"
              style={{ 
                backgroundColor: mode === "resize" ? config.theme.accent : 'white',
                color: mode === "resize" ? 'white' : config.theme["primary-text"]
              }}
            >
              Resize
            </button>
          </div>
          
          {mode === "draw" && (
            <div className="mb-2 space-y-2">
              <input
                type="text"
                placeholder="New Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-4 py-2 rounded shadow-md border border-gray-200"
              />
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p><strong>Draw Mode:</strong> Click to add points. Double-click to finish.</p>
                <p>You can create polygons with any number of points.</p>
              </div>
            </div>
          )}
          
          {mode !== "view" && (
            <button 
              onClick={saveCoordinates}
              className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition-colors font-semibold"
            >
              Save Coordinates
            </button>
          )}
          
          {selectedFeature && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
              <p><strong>Selected:</strong> {(selectedFeature.get("room") as Room)?.label}</p>
              <p><strong>Points:</strong> {getPointCount(selectedFeature)}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
