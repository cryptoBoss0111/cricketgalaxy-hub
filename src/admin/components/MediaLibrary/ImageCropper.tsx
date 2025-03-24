
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RefreshCw } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

// Helper function to create a cropped image
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;
  
  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas dimensions to the cropped size
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      
      // Draw the cropped image onto the canvas
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      
      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.95 // Quality
      );
    };
    
    image.onerror = () => {
      reject(new Error('Error loading image for cropping'));
    };
  });
};

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropShape, setCropShape] = useState<'rect' | 'round'>('rect');
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);
  
  const onZoomChange = useCallback((value: number[]) => {
    setZoom(value[0]);
  }, []);
  
  const onRotationChange = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);
  
  const onCropAreaChange = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  const handleComplete = useCallback(async () => {
    try {
      setIsProcessing(true);
      if (!croppedAreaPixels) {
        throw new Error('No crop area selected');
      }
      
      const croppedBlob = await createCroppedImage(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (error) {
      console.error('Error creating cropped image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete]);
  
  const handleShapeChange = (value: string) => {
    if (value === 'circle') {
      setCropShape('round');
      setAspectRatio(1);
    } else if (value === 'square') {
      setCropShape('rect');
      setAspectRatio(1);
    } else if (value === 'rectangle') {
      setCropShape('rect');
      setAspectRatio(16 / 9);
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        <p className="text-sm font-medium mb-2">Select crop shape:</p>
        <RadioGroup
          defaultValue="square"
          className="flex gap-4"
          onValueChange={handleShapeChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="square" id="square" />
            <Label htmlFor="square">Square</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rectangle" id="rectangle" />
            <Label htmlFor="rectangle">Rectangle (16:9)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="circle" id="circle" />
            <Label htmlFor="circle">Circle</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="relative h-[300px] bg-gray-100 mb-4 rounded-lg overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onCropComplete={onCropAreaChange}
          cropShape={cropShape}
          showGrid={true}
          classes={{
            containerClassName: 'cropper-container',
            cropAreaClassName: cropShape === 'round' ? 'rounded-full' : '',
          }}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="zoom" className="text-sm">Zoom: {zoom.toFixed(1)}x</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onRotationChange}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Rotate
          </Button>
        </div>
        <Slider
          id="zoom"
          value={[zoom]}
          min={1}
          max={3}
          step={0.1}
          onValueChange={onZoomChange}
        />
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button onClick={handleComplete} disabled={isProcessing} className="min-w-[80px]">
          {isProcessing ? 'Processing...' : 'Crop & Upload'}
        </Button>
      </div>
    </div>
  );
};

export default ImageCropper;
