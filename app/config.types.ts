export interface Config {
  /**
   * Name of the event. Displayed in titles and about pages.
   */
  eventName: string;

  /**
   * Locale the content is in. Should be a 2-letter ISO 639-1 code.
   */
  locale: string;

  /**
   * Description of the event. Displayed in the about page.
   *
   * Supports markdown.
   *
   * Will be trimmed and dedented before being displayed.
   */
  description: string;

  /**
   * Attributions for any graphics or other resources that need attribution.
   *
   * Supports markdown.
   */
  attributions?: string[];

  /**
   * The colors to use for the theme.
   */
  theme: {
    /**
     * Background of the whole page. Should match the background of the map.
     */
    background: string;

    /**
     * Background of the rooms in the room list when hovered.
     */
    "highlight-background": string;

    /**
     * Border of the search box, and the lines in-between items in the room list.
     */
    border: string;

    /**
     * Text color for the majority of the text.
     */
    "primary-text": string;

    /**
     * Text color for secondary text, such as aliases.
     */
    "secondary-text": string;

    /**
     * Accent color used for links and room borders.
     */
    accent: string;

    /**
     * Highlight color used for search result highlighting.
     */
    highlight: string;

    /**
     * Disabled button color.
     */
    disabled: string;
  };

  /**
   * The map to display.
   */
  map: {
    /**
     * Path of the map image.
     * Should be as high resolution as possible.
     */
    src: string;
    rooms: Room[];
  };
}

export interface Map {}

/**
 * Configuration for road paths and navigation.
 */
export interface RoadConfig {
  /**
   * All paths in the map.
   */
  paths: {
    /**
     * Main paths that run through the community.
     */
    main: MainPath[];
    
    /**
     * Lanes that connect main paths to individual houses.
     */
    lanes: Lane[];
  }
}

/**
 * A main path running through the community.
 */
export interface MainPath {
  /**
   * Unique identifier for the path.
   */
  id: string;
  
  /**
   * Array of waypoints that define the path.
   * Each waypoint is a coordinate pair [x, y].
   */
  waypoints: [number, number][];
}

/**
 * A lane connecting a main path to a house.
 */
export interface Lane {
  /**
   * Unique identifier for the lane.
   */
  id: string;
  
  /**
   * ID of the room/house this lane connects to.
   */
  connectsTo: string;
  
  /**
   * ID of the main path this lane connects from.
   */
  connectsFrom: string;
  
  /**
   * Point on the main path where this lane connects.
   */
  connectionPoint: [number, number];
  
  /**
   * Array of waypoints that define the lane.
   * Each waypoint is a coordinate pair [x, y].
   */
  waypoints: [number, number][];
}

export interface Room {
  /**
   * Unique identififer for the room. Appears in the URL.
   */
  id: string;

  /**
   * Label for the room. Appears in the room list and in the info panel.
   */
  label: string;

  /**
   * Aliases for the room. Appears in the room list and in the info panel.
   *
   * The search box will match these aliases.
   */
  aliases?: string[];

  /**
   * Description of the room. Appears in the info panel.
   *
   * Supports markdown.
   *
   * Will be trimmed and dedented before being displayed.
   */
  description?: string;

  /**
   * Area of the room on the map.
   *
   * The area should be a list of points in the form [x, y].
   *
   * In the image co-oordinates; the origin is the top left corner of the image.
   */
  area: [number, number][];
}
