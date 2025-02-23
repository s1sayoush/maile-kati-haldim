"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useEventStore } from "@/store/useEventStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

const EventDetailsStep = () => {
  const { currentEvent, setEventDetails } = useEventStore();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialCenter: [number, number] =
    currentEvent.details.coordinates?.length === 2
      ? [
          currentEvent.details.coordinates[0],
          currentEvent.details.coordinates[1],
        ]
      : [51.505, -0.09];

  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    currentEvent.details.coordinates?.length === 2
      ? [
          currentEvent.details.coordinates[0],
          currentEvent.details.coordinates[1],
        ]
      : null
  );

  useEffect(() => {
    if (currentEvent.details.coordinates?.length === 2) {
      const [lat, lng] = currentEvent.details.coordinates;
      setCenter([lat, lng]);
      setMarkerPosition([lat, lng]);
    }
  }, [currentEvent.details.coordinates]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        setCenter([latNum, lonNum]);
        setMarkerPosition([latNum, lonNum]);
        updateCoordinates(latNum, lonNum);
        await fetchAddress(latNum, lonNum);
      } else {
        // If no results found, use the search query as location name
        setEventDetails({
          ...currentEvent?.details,
          location: searchQuery,
        });
      }
    } catch (error) {
      console.error("Error searching location:", error);
      // On error, still use the search query as location name
      setEventDetails({
        ...currentEvent?.details,
        location: searchQuery,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCoordinates = (lat: number, lon: number): void => {
    setEventDetails({
      ...currentEvent?.details,
      coordinates: [lat, lon],
    });
  };

  const fetchAddress = async (lat: number, lon: number): Promise<void> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();

      // Default to search query if no location data is found
      let locationName = searchQuery;

      if (data && data.address) {
        const {
          name,
          amenity,
          building,
          road,
          neighbourhood,
          suburb,
          city,
          town,
          village,
        } = data.address;

        // Try to get the most specific location name available
        locationName =
          name ||
          amenity ||
          building ||
          road ||
          neighbourhood ||
          suburb ||
          city ||
          town ||
          village ||
          searchQuery; // Fallback to search query if no other name is found
      }

      setEventDetails({
        ...(currentEvent?.details ?? {}),
        location: locationName,
        coordinates: [lat, lon],
      });
    } catch (error) {
      console.error("Error fetching address:", error);
      // On error, use the search query as the location name
      setEventDetails({
        ...(currentEvent?.details ?? {}),
        location: searchQuery,
        coordinates: [lat, lon],
      });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    setCenter([lat, lng]);
    updateCoordinates(lat, lng);
    fetchAddress(lat, lng);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2 w-full">
          <Label htmlFor="eventTitle" className="text-base font-medium">
            Event Title
          </Label>
          <Input
            id="eventTitle"
            value={currentEvent?.details?.eventTitle || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEventDetails({
                ...currentEvent?.details,
                eventTitle: e.target.value,
              })
            }
            placeholder="Enter event title"
            className="h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full">
          <Label htmlFor="date" className="text-base font-medium">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 px-4 border border-gray-300 rounded-lg flex items-center justify-between w-full focus:ring-2 focus:ring-primary"
              >
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>
                    {currentEvent?.details?.date
                      ? format(currentEvent.details.date, "PPP")
                      : "Pick a date"}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-lg rounded-lg">
              <Calendar
                mode="single"
                selected={
                  currentEvent?.details?.date
                    ? new Date(currentEvent.details.date)
                    : undefined
                }
                onSelect={(date) =>
                  setEventDetails({
                    ...currentEvent?.details,
                    date: date,
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Location Search</Label>
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
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
        <Map
          center={center}
          markerPosition={markerPosition}
          onMapClick={handleMapClick}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location Name</Label>
        <Input
          id="location"
          value={currentEvent?.details?.location || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
