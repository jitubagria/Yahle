import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn } from 'lucide-react';

interface ImageCropperModalProps {
  image: string;
  onComplete: (croppedImages: { profile_pic: string; thumbl: string; thumbs: string; thumbimage: string }) => void;
  onCancel: () => void;
}

export default function ImageCropperModal({ image, onComplete, onCancel }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImages = async () => {
    if (!croppedAreaPixels) return;

    const img = await createImage(image);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Create different sizes
    const sizes = {
      profile_pic: 400, // main profile picture
      thumbl: 200,      // large thumbnail
      thumbs: 120,      // small thumbnail  
      thumbimage: 64    // tiny thumbnail
    };

    const croppedImages: any = {};

    for (const [key, size] of Object.entries(sizes)) {
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        size,
        size
      );

      croppedImages[key] = canvas.toDataURL('image/jpeg', 0.9);
    }

    onComplete(croppedImages);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="relative h-[400px] bg-muted rounded-md">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
            cropShape="round"
            showGrid={false}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[zoom]}
              onValueChange={(values) => setZoom(values[0])}
              min={1}
              max={3}
              step={0.1}
              className="flex-1"
              data-testid="slider-zoom"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={createCroppedImages} data-testid="button-crop-save">
            Save & Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
}
