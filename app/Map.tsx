import { Feature, MapBrowserEvent, Map as olMap, View } from "ol";
import { Polygon } from "ol/geom";
import { defaults } from "ol/interaction";
import Translate from "ol/interaction/Translate";
import ImageLayer from "ol/layer/Image.js";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import Projection from "ol/proj/Projection.js";
import Static from "ol/source/ImageStatic.js";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Room, Config } from "./config.types";

interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
  config: Config;
  selectedRoom?: Room;
  focusedRoom?: Room;
  onRoomSelected?: (room?: Room) => void;
  onInfoSelected?: () => void;
  onPan?: () => void;
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
  ...divProps
}: MapProps) {
  const [mapDiv, setMapDiv] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<olMap | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [translateInteraction, setTranslateInteraction] = useState<Translate | null>(null);
  
  // Create a stable callback for the map div ref
  const setMapDivRef = useCallback((node: HTMLDivElement | null) => {
    setMapDiv(node);
  }, []);

  const selectedStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: config.theme.accent,
          width: 4,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 0, 0)",
        }),
      }),
    [config.theme.accent],
  );

  const unselectedStyle = useMemo(
    () =>
      new Style({
        stroke: new Stroke({
          color: config.theme.accent,
          width: 2,
          lineDash: [0.1, 5],
        }),
        fill: new Fill({
          color: "rgba(0, 0, 0, 0)",
        }),
      }),
    [config.theme.accent],
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
        return new Feature({
          geometry: new Polygon([
            room.area.map((coords) => [coords[0], height - coords[1]]),
          ]),
          room,
        });
      });
      const markerSource = new VectorSource({
        features: markers,
        wrapX: false,
      });
      const markersLayer = new VectorLayer({
        source: markerSource,
        style: unselectedStyle,
      });

      const map = new olMap({
        target: mapDiv,
        interactions: defaults({
          altShiftDragRotate: false,
          pinchRotate: false,
        }),
        layers: [imageLayer, markersLayer],
        view: new View({
          projection: projection,
        }),
      });

      if (
        typeof localStorage !== "undefined" &&
        localStorage.getItem("map-extent")
      ) {
        map.getView().fit(JSON.parse(localStorage.getItem("map-extent")!));
      } else {
        map.getView().fit(extent);
      }

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
    if (focused != null) {
      map.getView().fit(focused.getGeometry().getExtent(), {
        duration: 100,
        maxZoom: 3,
      });
    }
  }, [map, selectedRoom, focusedRoom]);

  useEffect(() => {
    selectedFeature?.setStyle(selectedStyle);

    const lastSelected = selectedFeature;
    return function cleanup() {
      lastSelected?.setStyle(unselectedStyle);
    };
  }, [selectedFeature, selectedStyle, unselectedStyle]);

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
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
      const originalCoords = coordinates.map(coord => [coord[0], height - coord[1]]);
      
      return {
        ...room,
        area: originalCoords
      };
    });
    
    // Output the updated coordinates to console
    // In a real application, you would save these to a database or file
    console.log(JSON.stringify(updatedRooms, null, 2));
    alert("Coordinates saved to console. Check the browser console.");
  };

  // Add translate interaction when edit mode is enabled
  useEffect(() => {
    if (!map) return;
    
    // Clean up any existing translate interaction
    if (translateInteraction) {
      map.removeInteraction(translateInteraction);
      setTranslateInteraction(null);
    }
    
    // Only add the interaction if in edit mode
    if (editMode) {
      const vectorLayer = map.getLayers().getArray()[1] as VectorLayer;
      const translate = new Translate({
        layers: [vectorLayer]
      });
      
      // Set up event listeners for the translate interaction
      const handleTranslateStart = (event: any) => {
        // Optional: You could add visual feedback when translation starts
        console.log('Translation started');
      };
      
      const handleTranslateEnd = (event: any) => {
        // Optional: You could add visual feedback when translation ends
        console.log('Translation ended');
      };
      
      // Add event listeners
      translate.on('translatestart', handleTranslateStart);
      translate.on('translateend', handleTranslateEnd);
      
      // Add the interaction to the map
      map.addInteraction(translate);
      
      // Store the interaction in state
      setTranslateInteraction(translate);
      
      // Clean up function
      return () => {
        // Remove event listeners
        translate.un('translatestart', handleTranslateStart);
        translate.un('translateend', handleTranslateEnd);
        
        // Remove the interaction from the map
        map.removeInteraction(translate);
      };
    }
    
    // No cleanup needed if we didn't add an interaction
    return undefined;
  }, [map, editMode]); // Don't include translateInteraction in dependencies

  return (
    <>
      <div ref={setMapDivRef} {...divProps} />
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={toggleEditMode}
          className="bg-white px-4 py-2 rounded shadow-md hover:bg-gray-100 transition-colors"
          style={{ 
            backgroundColor: editMode ? config.theme.accent : 'white',
            color: editMode ? 'white' : config.theme["primary-text"]
          }}
        >
          {editMode ? "Exit Edit Mode" : "Edit Mode"}
        </button>
        {editMode && (
          <button 
            onClick={saveCoordinates}
            className="bg-white px-4 py-2 rounded shadow-md hover:bg-gray-100 transition-colors"
          >
            Save Coordinates
          </button>
        )}
      </div>
    </>
  );
}
