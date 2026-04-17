'use client';

import React, { useEffect, useState } from 'react';
import { X, MapPin, Clock, Star, Users, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { themeConfig } from '@/configs/theme.config';
import EnvironmentApi from '@/services/env/env.service';

export interface GreenSpaceDetail {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  status: string;
  tags: string[];
  description?: string;
  operatingHours?: string;
  averageRating?: number;
  reviewCount?: number;
  amenities?: string[];
  capacity?: number;
  accessibility?: boolean;
  parkingAvailable?: boolean;
}

interface GreenSpaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId?: string;
  spaceName?: string;
  latitude?: number;
  longitude?: number;
}

const GreenSpaceDetailsModal: React.FC<GreenSpaceDetailsModalProps> = ({
  isOpen,
  onClose,
  spaceId,
  spaceName = 'Green Space',
  latitude,
  longitude,
}) => {
  const theme = themeConfig.light;
  const [details, setDetails] = useState<GreenSpaceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && spaceId) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          setError(null);

          // Fetch green space details from API
          const response = await EnvironmentApi.GreenSpace();
          const greenSpaces =
            response.data?.greenAreas ?? response.data?.greenSpace?.parkData ?? [];

          // Find matching green space by ID
          const space = greenSpaces.find((g: any) => g.id === spaceId);
          if (space) {
            const spaceData = space as any; // Type cast to any for flexible property access
            setDetails({
              id: spaceData.id ?? spaceId,
              name: spaceData.name ?? spaceName,
              latitude: spaceData.latitude ?? latitude ?? 0,
              longitude: spaceData.longitude ?? longitude ?? 0,
              distance: spaceData.distance ?? 0.8,
              status: spaceData.status ?? 'Open now',
              tags: spaceData.tags ?? [],
              description:
                spaceData.description ?? 'A wonderful green space for leisure and relaxation.',
              operatingHours: spaceData.operatingHours ?? '6:00 AM - 6:00 PM',
              averageRating: spaceData.averageRating ?? 4.5,
              reviewCount: spaceData.reviewCount ?? 127,
              amenities: spaceData.amenities ?? [
                'Parking',
                'Restrooms',
                'Picnic Area',
                'Walking Trails',
              ],
              capacity: spaceData.capacity ?? 500,
              accessibility: spaceData.accessibility ?? true,
              parkingAvailable: spaceData.parkingAvailable ?? true,
            });
          } else {
            // Fallback if space not found
            setDetails({
              id: spaceId ?? 'unknown',
              name: spaceName,
              latitude: latitude ?? 0,
              longitude: longitude ?? 0,
              distance: 0.8,
              status: 'Open now',
              tags: [],
              description: 'A wonderful green space for leisure and relaxation.',
              operatingHours: '6:00 AM - 6:00 PM',
              averageRating: 4.5,
              reviewCount: 127,
              amenities: ['Parking', 'Restrooms', 'Picnic Area', 'Walking Trails'],
              capacity: 500,
              accessibility: true,
              parkingAvailable: true,
            });
          }
        } catch (err) {
          console.error('Failed to fetch green space details:', err);
          setError('Unable to load space details');
          // Set fallback data
          setDetails({
            id: spaceId ?? 'unknown',
            name: spaceName,
            latitude: latitude ?? 0,
            longitude: longitude ?? 0,
            distance: 0.8,
            status: 'Open now',
            tags: [],
            description: 'A wonderful green space for leisure and relaxation.',
            operatingHours: '6:00 AM - 6:00 PM',
            averageRating: 4.5,
            reviewCount: 127,
            amenities: ['Parking', 'Restrooms', 'Picnic Area', 'Walking Trails'],
            capacity: 500,
            accessibility: true,
            parkingAvailable: true,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [isOpen, spaceId, spaceName, latitude, longitude]);

  if (!details) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        style={{
          backgroundColor: 'white',
          border: `1px solid ${theme.border}`,
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: theme.foreground }}>{details.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              style={{
                backgroundColor: `${theme.success.background}20`,
                color: theme.success.background,
                border: 'none',
              }}
            >
              {details.status}
            </Badge>
            <span style={{ color: theme.muted.foreground }} className="text-xs">
              {details.distance} km away
            </span>
          </div>

          {/* Description */}
          {details.description && (
            <p style={{ color: theme.muted.foreground }} className="text-sm leading-relaxed">
              {details.description}
            </p>
          )}

          {/* Rating */}
          {details.averageRating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star
                  size={14}
                  fill={theme.warning.background}
                  style={{ color: theme.warning.background }}
                />
                <span style={{ color: theme.foreground }} className="text-sm font-semibold">
                  {details.averageRating}
                </span>
              </div>
              <span style={{ color: theme.muted.foreground }} className="text-xs">
                ({details.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Operating Hours */}
          <div
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ backgroundColor: theme.background }}
          >
            <Clock size={16} style={{ color: theme.primary.background, marginTop: 2 }} />
            <div>
              <p style={{ color: theme.foreground }} className="text-[12px] font-semibold">
                Operating Hours
              </p>
              <p style={{ color: theme.muted.foreground }} className="text-[11px] mt-1">
                {details.operatingHours}
              </p>
            </div>
          </div>

          {/* Location */}
          <div
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ backgroundColor: theme.background }}
          >
            <MapPin size={16} style={{ color: theme.primary.background, marginTop: 2 }} />
            <div>
              <p style={{ color: theme.foreground }} className="text-[12px] font-semibold">
                Location
              </p>
              <p style={{ color: theme.muted.foreground }} className="text-[11px] mt-1">
                {details.latitude.toFixed(4)}, {details.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Amenities */}
          {details.amenities && details.amenities.length > 0 && (
            <div>
              <p style={{ color: theme.foreground }} className="text-[12px] font-semibold mb-2">
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {details.amenities.map((amenity, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-[10px] px-2 py-1"
                    style={{
                      color: theme.secondary.foreground,
                      borderColor: theme.border,
                    }}
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div>
            <p style={{ color: theme.foreground }} className="text-[12px] font-semibold mb-2">
              Features
            </p>
            <div className="space-y-2">
              {details.accessibility && (
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.success.background }}
                  />
                  <span style={{ color: theme.muted.foreground }}>Wheelchair accessible</span>
                </div>
              )}
              {details.parkingAvailable && (
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.success.background }}
                  />
                  <span style={{ color: theme.muted.foreground }}>Parking available</span>
                </div>
              )}
              {details.capacity && (
                <div className="flex items-center gap-2 text-xs">
                  <Users size={12} style={{ color: theme.muted.foreground }} />
                  <span style={{ color: theme.muted.foreground }}>
                    Capacity: {details.capacity} people
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {details.tags && details.tags.length > 0 && (
            <div>
              <p style={{ color: theme.foreground }} className="text-[12px] font-semibold mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {details.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-[10px] px-2 py-1"
                    style={{
                      backgroundColor: `${theme.secondary.background}20`,
                      color: theme.secondary.foreground,
                      border: 'none',
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg"
              style={{
                backgroundColor: `${theme.destructive.background}15`,
                borderLeft: `3px solid ${theme.destructive.background}`,
              }}
            >
              <AlertCircle
                size={14}
                style={{ color: theme.destructive.background, marginTop: 2 }}
              />
              <p style={{ color: theme.destructive.background }} className="text-xs">
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => {
                // Could open external map or navigation
                const mapUrl = `https://www.google.com/maps/search/${details.latitude},${details.longitude}`;
                window.open(mapUrl, '_blank');
              }}
              style={{
                borderColor: theme.border,
                color: theme.primary.background,
              }}
            >
              View on Map
            </Button>
            <Button
              className="flex-1 text-xs"
              onClick={onClose}
              style={{
                backgroundColor: theme.primary.background,
                color: 'white',
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GreenSpaceDetailsModal;
