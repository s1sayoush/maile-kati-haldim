import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useEventStore } from "@/store/useEventStore";

// Fix for Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const EventDetailsStep = () => {
  const { currentEvent, setEventDetails } = useEventStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize map center from store coordinates or default values
  const initialCenter: [number, number] = currentEvent?.details
    ?.coordinates?.[0]
    ? [currentEvent.details.coordinates[0], currentEvent.details.coordinates[1]]
    : [51.505, -0.09];

  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialCenter[0] !== 51.505 ? initialCenter : null
  );

  // Update store with new coordinates
  const updateCoordinates = (lat: number, lon: number) => {
    setEventDetails({
      ...currentEvent?.details,
      coordinates: [lat, lon],
    });
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json`
      );
      const data = await response.json();

      if (data[0]) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        setCenter([latNum, lonNum]);
        setMarkerPosition([latNum, lonNum]);
        updateCoordinates(latNum, lonNum);
        fetchAddress(latNum, lonNum);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();

      let locationName = searchQuery; // Default to search query

      if (data && data.address) {
        const { city, town, village } = data.address;
        locationName = city || town || village || searchQuery;
      }

      setEventDetails({
        ...(currentEvent?.details ?? {}),
        location: locationName,
        coordinates: [lat, lon],
      });
    } catch (error) {
      console.error("Error fetching address:", error);
      setEventDetails({
        ...(currentEvent?.details ?? {}),
        location: searchQuery, // Use search query as fallback
        coordinates: [lat, lon],
      });
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setCenter([lat, lng]);
        updateCoordinates(lat, lng);
        fetchAddress(lat, lng);
      },
    });
    return null;
  };

  const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eventTitle">Event Title</Label>
          <Input
            id="eventTitle"
            value={currentEvent?.details?.eventTitle || ""}
            onChange={(e) =>
              setEventDetails({
                ...currentEvent?.details,
                eventTitle: e.target.value,
              })
            }
            placeholder="Enter event title"
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Location Search</Label>
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="h-11"
          />
          <Button type="submit" disabled={isLoading} className="h-11 px-6">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Search className="h-5 w-5 mr-2" />
            )}
            Search
          </Button>
        </form>
      </div>

      <div className="space-y-2">
        <Label>Select Location</Label>
        <div className="h-[300px] relative rounded-lg overflow-hidden border">
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full"
            style={{ position: "relative", zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler />
            <MapUpdater center={center} />
            {markerPosition && <Marker position={markerPosition} />}
          </MapContainer>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location Name</Label>
        <Input
          id="location"
          value={currentEvent?.details?.location || ""}
          onChange={(e) =>
            setEventDetails({
              ...(currentEvent?.details ?? {}),
              location: e.target.value,
            })
          }
          placeholder="Enter location name"
          className="h-11"
        />
      </div>
    </div>
  );
};

export default EventDetailsStep;
