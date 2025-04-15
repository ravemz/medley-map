import { Feature, MapBrowserEvent, Map as olMap, View } from "ol";
import { Polygon, Point, LineString, Geometry } from "ol/geom";
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
import { Room, Config, MainPath } from "./config.types";
import roadConfig from "./config_road";

// Define the available edit modes
type EditMode = "view" | "move" | "draw" | "resize" | "drawMainPath";

// Define the path types
type PathType = "main";

interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
  config: Config;
  selectedRoom?: Room;
  focusedRoom?: Room;
  onRoomSelected?: (room?: Room, coordinates?: [number, number], zoom?: number, mapInstance?: any) => void;
  onInfoSelected?: () => void;
  onPan?: () => void;
  onZoomChange?: (zoom: number) => void; // New prop to notify about zoom changes
  onMapInitialized?: () => void; // New prop to notify when the map is initialized
  setIsMapMoving?: (isMoving: boolean) => void; // New prop to notify when the map is moving
  setCalloutHidden?: (hidden: boolean) => void; // New prop to notify when the callout should be hidden
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
  onZoomChange,
  onMapInitialized,
  setIsMapMoving,
  setCalloutHidden,
  isAdmin,
  ...divProps
}: MapProps) {
  const [mapDiv, setMapDiv] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<olMap | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  const [mode, setMode] = useState<EditMode>("view");
  const [translateInteraction, setTranslateInteraction] = useState<Translate | null>(null);
  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
  const [modifyInteraction, setModifyInteraction] = useState<Modify | null>(null);
  const [newRoomName, setNewRoomName] = useState<string>("");
  const [nextRoomId, setNextRoomId] = useState<number>(30); // Start from M-30
  const vectorSourceRef = useRef<VectorSource | null>(null);
  
  // Path-related state
  const [pathType, setPathType] = useState<PathType>("main");
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [selectedPath, setSelectedPath] = useState<Feature | null>(null);
  const [mainPaths, setMainPaths] = useState<MainPath[]>(roadConfig.paths.main);
  const [nextPathId, setNextPathId] = useState<number>(1);
  const [pathsLayer, setPathsLayer] = useState<VectorLayer<VectorSource<Feature<Geometry>>> | null>(null);
  
  // Create a stable callback for the map div ref
  const setMapDivRef = useCallback((node: HTMLDivElement | null) => {
    setMapDiv(node);
  }, []);

  // Define a bright orange color for better contrast and colorblind-friendliness
  const ORANGE_COLOR = "#FF6600";
  // Define a bright red color for the main entry
  const RED_COLOR = "#FF0000";
  // Define a blue color for navigation paths (Google Maps style)
  const NAVIGATION_BLUE = "#4285F4";

  const selectedStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: ORANGE_COLOR,
          width: 4,
        }),
        fill: new Fill({
          color: "rgba(255, 102, 0, 0.1)", // Very light orange fill
        }),
      }),
    [],
  );
  
  // Style for main paths
  const mainPathStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: NAVIGATION_BLUE,
          width: 3,
        }),
      }),
    [],
  );
  
  // Style for navigation path - with rounded caps and joins for smoother appearance
  const navigationPathStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: NAVIGATION_BLUE,
          width: 4,
          lineCap: 'round',
          lineJoin: 'round',
        }),
      }),
    [],
  );
  
  // Style for waypoints - keeping the definition but we won't use it for rendering
  const waypointStyle = useMemo(
    () =>
      new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: NAVIGATION_BLUE,
          }),
          stroke: new Stroke({
            color: 'white',
            width: 1,
          }),
        }),
      }),
    [],
  );

  const unselectedStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: ORANGE_COLOR,
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

      // Create a vector source and layer for paths
      const pathsSource = new VectorSource<Feature<Geometry>>({
        features: [],
        wrapX: false,
      });
      
      const pathsVectorLayer = new VectorLayer<VectorSource<Feature<Geometry>>>({
        source: pathsSource,
        style: function(feature) {
          const type = feature.get('pathType');
          if (type === 'main') {
            return mainPathStyle;
          } else if (type === 'navigation') {
            return navigationPathStyle;
          } else if (type === 'waypoint') {
            return waypointStyle;
          }
          return mainPathStyle;
        }
      });
      
      setPathsLayer(pathsVectorLayer);
      
      // Load existing paths from roadConfig
      loadExistingPaths(pathsSource);

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
        layers: [imageLayer, markersLayer, pathsVectorLayer],
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

      // Handle map movement start
      map.on("movestart", () => {
        // Notify parent component that map is moving
        setIsMapMoving && setIsMapMoving(true);
      });
      
      map.on("moveend", (e) => {
        typeof localStorage !== "undefined" &&
          localStorage.setItem(
            "map-extent",
            JSON.stringify(map.getView().calculateExtent()),
          );
        onPan && onPan();
        
        // Update zoom level
        const newZoom = map.getView().getZoom() || 1;
        setCurrentZoom(newZoom);
        
        // Notify parent component about zoom changes
        onZoomChange && onZoomChange(newZoom);
        
        // Update callout position when map is panned
        if (selectedRoom && selectedFeature) {
          // Use the updateCalloutPosition function to ensure reliable positioning
          updateCalloutPosition(selectedFeature, selectedRoom);
          
          // Wait a short moment to ensure the map has settled, then notify that movement has stopped
          setTimeout(() => {
            setIsMapMoving && setIsMapMoving(false);
            
            // Phase 2: Show the callout after animation completes
            // Check if this was a search-triggered movement (focusedRoom exists and matches selectedRoom)
            if (focusedRoom && selectedRoom && focusedRoom.id === selectedRoom.id) {
              // Wait a bit longer to ensure everything is settled
              setTimeout(() => {
                // Show the callout
                setCalloutHidden && setCalloutHidden(false);
                
                // Update the callout position one more time to ensure accuracy
                updateCalloutPosition(selectedFeature, selectedRoom);
              }, 200);
            }
          }, 100);
        } else {
          // If no room is selected, just notify that movement has stopped
          setIsMapMoving && setIsMapMoving(false);
        }
      });
      
      // Listen for zoom changes and map movements
      map.getView().on('change:resolution', () => {
        // Notify parent component that map is moving
        setIsMapMoving && setIsMapMoving(true);
        
        const newZoom = map.getView().getZoom() || 1;
        setCurrentZoom(newZoom);
        
        // Notify parent component about zoom changes
        onZoomChange && onZoomChange(newZoom);
      });

      setMap(map);
      
      // Notify parent component that the map is initialized
      onMapInitialized && onMapInitialized();
    });
  }, [config.map, mapDiv, unselectedStyle]);

  // Load existing paths from roadConfig
  const loadExistingPaths = (pathsSource: VectorSource<Feature<Geometry>>) => {
    // Load main paths
    roadConfig.paths.main.forEach(mainPath => {
      if (mainPath.waypoints.length > 1) {
        const lineFeature = new Feature({
          geometry: new LineString(mainPath.waypoints),
          pathType: 'main',
          pathId: mainPath.id
        });
        pathsSource.addFeature(lineFeature);
      }
    });
  };

  const onMapClick = useCallback(
    (e: MapBrowserEvent<any>) => {
      if (map == null) {
        return;
      }
      
      // Check if the click is on the callout
      // We need to check if the click target is part of the callout
      const target = e.originalEvent.target as HTMLElement;
      const isCalloutClick = target.closest('.callout-container') !== null;
      
      // If the click is not on the callout, hide it
      if (!isCalloutClick) {
        setCalloutHidden && setCalloutHidden(true);
      }
      
      // Handle path drawing modes
      if (mode === "drawMainPath") {
        // Get the click coordinates
        const clickCoord = map.getCoordinateFromPixel(e.pixel);
        
        // Add the coordinate to the current path
        setCurrentPath(prev => [...prev, clickCoord as [number, number]]);
        
        // If we have at least two points, draw a line between them
        if (pathsLayer && currentPath.length > 0) {
          // Create a line from the previous point to the new point
          const lineCoords = [currentPath[currentPath.length - 1], clickCoord as [number, number]];
          const lineFeature = new Feature({
            geometry: new LineString(lineCoords),
            pathType: 'main',
            isTemporary: true
          });
          
          pathsLayer.getSource()!.addFeature(lineFeature);
        }
        
        return;
      }

      const feature: Feature = map.forEachFeatureAtPixel(
        e.pixel,
        (f) => f,
      ) as Feature;
      
      if (feature) {
        // Check if this is a path feature
        const pathType = feature.get('pathType');
        if (pathType) {
          // Handle path selection
          setSelectedPath(feature);
          return;
        }
        
        // Handle room selection
        const room = feature.get("room");
        
        // Calculate the center of the room polygon for the callout
        updateSelectedRoomCoordinates(feature, room);
        setSelectedFeature(feature);
        
        // Show the callout for the selected room
        setCalloutHidden && setCalloutHidden(false);
      } else {
        onRoomSelected && onRoomSelected(undefined);
        setSelectedFeature(null);
        setSelectedPath(null);
      }
    },
    [map, onRoomSelected, mode, currentPath, pathsLayer, setCalloutHidden],
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

  // This effect handles both map clicks and dropdown selections
  useEffect(() => {
    if (map == null) {
      return;
    }

    const vectorLayer = map.getLayers().getArray()[1] as VectorLayer<VectorSource>;
    
    // Clear previous selection
    if (selectedFeature && selectedFeature.get("room")?.id !== "main-entry") {
      selectedFeature.setStyle(unselectedStyle);
    }
    
    // Find the feature for the selected room
    const selected = vectorLayer
      .getSource()!
      .getFeatures()
      .find(
        (f: { get: (arg0: string) => Room }) => f.get("room") === selectedRoom,
      );
      
    if (selected != null) {
      // Set the selected feature
      setSelectedFeature(selected);
      
      // Apply selected style (except for main-entry)
      if (selected.get("room")?.id !== "main-entry") {
        selected.setStyle(selectedStyle);
      }
      
      // If this is a search/dropdown selection (focusedRoom is set), zoom to the room
      if (selectedRoom && focusedRoom && selectedRoom.id === focusedRoom.id) {
        const geometry = selected.getGeometry();
        if (geometry) {
          // Use even padding
          const padding = [50, 50, 50, 50]; // [top, right, bottom, left]
          
          // Always reset calloutHidden to false for search selections
          setCalloutHidden && setCalloutHidden(false);
          
          map.getView().fit(geometry.getExtent(), {
            padding: padding,
            duration: 300,
            maxZoom: 3,
          });
          
          // Wait for the zoom animation to complete before calculating coordinates
          setTimeout(() => {
            // Make sure callout is not hidden
            setCalloutHidden && setCalloutHidden(false);
            // Update coordinates
            updateCalloutPosition(selected, selectedRoom);
          }, 350); // Slightly longer than the animation duration
        }
      } else {
        // For direct map clicks, update coordinates immediately
        updateCalloutPosition(selected, selectedRoom);
      }
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
        const geometry = focused.getGeometry();
        if (geometry) {
          // Use even padding since we no longer have a bottom InfoPanel
          const padding = [50, 50, 50, 50]; // [top, right, bottom, left]
          
          map.getView().fit(geometry.getExtent(), {
            padding: padding,
            duration: 300,
            maxZoom: 3,
          });
        }
      } else {
        // Calculate a combined extent that includes both the focused room and main entry
        const focusedGeometry = focused.getGeometry();
        const mainEntryGeometry = mainEntry.getGeometry();
        
        if (focusedGeometry && mainEntryGeometry) {
          const focusedExtent = focusedGeometry.getExtent();
          const mainEntryExtent = mainEntryGeometry.getExtent();
          
          // Create a combined extent
          const combinedExtent = [
            Math.min(focusedExtent[0], mainEntryExtent[0]),
            Math.min(focusedExtent[1], mainEntryExtent[1]),
            Math.max(focusedExtent[2], mainEntryExtent[2]),
            Math.max(focusedExtent[3], mainEntryExtent[3]),
          ];
        
          // Use even padding since we no longer have a bottom InfoPanel
          const padding = [50, 50, 50, 50]; // [top, right, bottom, left]
          
          // Fit the view to the combined extent with padding
          map.getView().fit(combinedExtent, {
            padding: padding,
            duration: 500,
            maxZoom: 2,
          });
        }
      }
      
      // Clear any existing navigation paths
      clearNavigationPath();
    }
  }, [map, selectedRoom, focusedRoom]);
  
  // Clear the current navigation path
  const clearNavigationPath = () => {
    if (pathsLayer && pathsLayer.getSource()) {
      // Remove any existing navigation path features
      const features = pathsLayer.getSource()!.getFeatures();
      const navigationFeatures = features.filter(f => f.get('pathType') === 'navigation');
      navigationFeatures.forEach(f => pathsLayer.getSource()!.removeFeature(f));
    }
  };
  
  // Calculate the center of a polygon
  const calculatePolygonCenter = (points: [number, number][]): [number, number] => {
    if (points.length === 0) return [0, 0];
    
    let sumX = 0;
    let sumY = 0;
    
    points.forEach(point => {
      sumX += point[0];
      sumY += point[1];
    });
    
    return [sumX / points.length, sumY / points.length];
  };
  
  // Calculate distance between two points
  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Find the index of the closest point in an array to a target point
  const findClosestPointIndex = (points: [number, number][], target: [number, number]): number => {
    let closestIndex = 0;
    let closestDistance = calculateDistance(points[0], target);
    
    for (let i = 1; i < points.length; i++) {
      const distance = calculateDistance(points[i], target);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  };
  
  // Update the coordinates for the selected room
  const updateSelectedRoomCoordinates = (feature: Feature, room?: Room) => {
    if (!map || !room || !feature || !onRoomSelected) return;
    
    const geometry = feature.getGeometry() as Polygon;
    if (!geometry) return;
    
    const extent = geometry.getExtent();
    // Get center of the extent in map coordinates
    const centerMapCoords: [number, number] = [
      (extent[0] + extent[2]) / 2, 
      (extent[1] + extent[3]) / 2
    ];
    
    // Convert map coordinates to pixel coordinates
    const pixelCoords = map.getPixelFromCoordinate(centerMapCoords);
    
    if (pixelCoords) {
      // Use pixel coordinates for positioning the callout
      // Pass the current zoom level and map instance to adjust the callout position
      onRoomSelected(room, [pixelCoords[0], pixelCoords[1]], currentZoom, map);
    }
  };
  
  // Update callout position with a delay to ensure it's positioned correctly after zoom/pan
  const updateCalloutPosition = (feature: Feature, room?: Room) => {
    if (!map || !room || !feature || !onRoomSelected) return;
    
    // Update immediately first
    updateSelectedRoomCoordinates(feature, room);
    
    // Then update again after a short delay to ensure correct positioning
    setTimeout(() => {
      updateSelectedRoomCoordinates(feature, room);
    }, 50);
  };

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
    // Reset path drawing state when changing modes
    if (newMode !== "drawMainPath") {
      setCurrentPath([]);
    }
    
    setMode(newMode);
  };
  
  // Save the current path
  const savePath = () => {
    if (!map || !pathsLayer || currentPath.length < 2) return;
    
    if (mode === "drawMainPath") {
      // Create a new main path
      const newMainPath: MainPath = {
        id: `main-${nextPathId}`,
        waypoints: currentPath
      };
      
      // Add the main path to the state
      setMainPaths(prev => [...prev, newMainPath]);
      
      // Create a feature for the complete path
      const pathFeature = new Feature({
        geometry: new LineString(currentPath),
        pathType: 'main',
        pathId: newMainPath.id
      });
      
      // Remove temporary features
      if (pathsLayer.getSource()) {
        const tempFeatures = pathsLayer.getSource()!.getFeatures().filter(f => f.get('isTemporary'));
        tempFeatures.forEach(f => pathsLayer.getSource()!.removeFeature(f));
        
        // Add the new feature
        pathsLayer.getSource()!.addFeature(pathFeature);
      }
      
      // Increment the path ID
      setNextPathId(prev => prev + 1);
      
      // Reset the current path
      setCurrentPath([]);
      
      // Save to roadConfig
      roadConfig.paths.main.push(newMainPath);
      console.log('Updated roadConfig:', roadConfig);
      
      // Alert the user
      alert(`Main path ${newMainPath.id} saved with ${newMainPath.waypoints.length} waypoints.`);
    }
  };
  
  // Delete the last waypoint in the current path
  const deleteLastWaypoint = () => {
    if (currentPath.length === 0) return;
    
    // Remove the last waypoint from the current path
    setCurrentPath(prev => prev.slice(0, -1));
    
    if (pathsLayer && pathsLayer.getSource()) {
      // Remove the last waypoint feature
      const features = pathsLayer.getSource()!.getFeatures();
      const waypointFeatures = features.filter(f => 
        f.get('pathType') === 'waypoint' && 
        f.get('waypointIndex') === currentPath.length - 1
      );
      
      waypointFeatures.forEach(f => pathsLayer.getSource()!.removeFeature(f));
      
      // Remove the last line segment if there is one
      if (currentPath.length > 0) {
        const lineFeatures = features.filter(f => 
          f.get('isTemporary') && 
          f.get('pathType') === 'main'
        );
        
        if (lineFeatures.length > 0) {
          pathsLayer.getSource()!.removeFeature(lineFeatures[lineFeatures.length - 1]);
        }
      }
    }
  };
  
  // Delete the selected path
  const deletePath = () => {
    if (!selectedPath || !pathsLayer || !pathsLayer.getSource()) return;
    
    const pathId = selectedPath.get('pathId');
    const pathType = selectedPath.get('pathType');
    
    if (pathId && pathType) {
      // Remove the path from the layer
      pathsLayer.getSource()!.removeFeature(selectedPath);
      
      // Remove all waypoints associated with this path
      const features = pathsLayer.getSource()!.getFeatures();
      const waypointFeatures = features.filter(f => 
        f.get('pathType') === 'waypoint' && 
        f.get('pathId') === pathId
      );
      
      waypointFeatures.forEach(f => pathsLayer.getSource()!.removeFeature(f));
      
      // Remove the path from the state and roadConfig
      if (pathType === 'main') {
        setMainPaths(prev => prev.filter(p => p.id !== pathId));
        roadConfig.paths.main = roadConfig.paths.main.filter(p => p.id !== pathId);
      }
      
      // Reset the selected path
      setSelectedPath(null);
      
      // Alert the user
      alert(`Main path ${pathId} deleted.`);
    }
  };
  
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

  // Save the updated coordinates
  const saveCoordinates = () => {
    if (!map) return;
    
    const vectorLayer = map.getLayers().getArray()[1] as VectorLayer<VectorSource>;
    const features = vectorLayer
      .getSource()!
      .getFeatures();
    
    const updatedRooms = features.map((feature) => {
      const room = feature.get("room") as Room;
      if (!room) return null;
      
      const geometry = feature.getGeometry() as Polygon;
      if (!geometry) return null;
      
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
    }).filter(Boolean);
    
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

  return (
    <>
      <div ref={setMapDivRef} {...divProps} />
      {/* Only show edit controls when isAdmin is true */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Edit Mode</h3>
          
          {/* Room editing controls */}
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
          
          <div className="flex flex-row gap-2 mb-2">
            <button 
              onClick={() => setEditMode("draw")}
              className="flex-1 px-4 py-2 rounded shadow-md hover:bg-gray-100 transition-colors"
              style={{ 
                backgroundColor: mode === "draw" ? config.theme.accent : 'white',
                color: mode === "draw" ? 'white' : config.theme["primary-text"]
              }}
            >
              Draw Room
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
          
          {/* Path drawing controls */}
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold mb-2">Path Drawing</h4>
            <div className="flex flex-row gap-2 mb-2">
              <button 
                onClick={() => setEditMode("drawMainPath")}
                className="flex-1 px-4 py-2 rounded shadow-md hover:bg-gray-100 transition-colors"
                style={{ 
                  backgroundColor: mode === "drawMainPath" ? config.theme.accent : 'white',
                  color: mode === "drawMainPath" ? 'white' : config.theme["primary-text"]
                }}
              >
                Draw Main Path
              </button>
            </div>
          </div>
          
          {/* Path drawing instructions */}
          {mode === "drawMainPath" && (
            <div className="bg-gray-100 p-3 rounded mb-2 text-sm">
              <p className="mb-1"><strong>Instructions:</strong></p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Click on the map to add waypoints</li>
                <li>Click &quot;Save Path&quot; when done</li>
              </ol>
              
              {currentPath.length > 0 && (
                <div className="mt-2">
                  <p><strong>Waypoints:</strong> {currentPath.length}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Path actions */}
          {mode === "drawMainPath" && (
            <div className="flex flex-row gap-2">
              <button 
                onClick={savePath}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition-colors"
                disabled={currentPath.length < 2}
              >
                Save Path
              </button>
              <button 
                onClick={deleteLastWaypoint}
                className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 transition-colors"
                disabled={currentPath.length === 0}
              >
                Undo Point
              </button>
            </div>
          )}
          
          {/* Path selection */}
          {selectedPath && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
              <p><strong>Selected Path:</strong> {selectedPath.get('pathId')}</p>
              <p><strong>Type:</strong> {selectedPath.get('pathType')}</p>
              <button 
                onClick={deletePath}
                className="mt-2 w-full bg-red-600 text-white px-4 py-1 rounded shadow-md hover:bg-red-700 transition-colors text-sm"
              >
                Delete Path
              </button>
            </div>
          )}
          
          {/* Room drawing controls */}
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
          
          {/* Move mode instructions */}
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
          
          {/* Save coordinates button */}
          {mode !== "view" && (
            <button 
              onClick={saveCoordinates}
              className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition-colors font-semibold"
            >
              Save Coordinates
            </button>
          )}
          
          {/* Selected feature info */}
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
