'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiImage,
  FiUpload,
  FiDownload,
  FiCrop,
  FiRotateCw,
  FiRotateCcw,
  FiZoomIn,
  FiZoomOut,
  FiMove,
  FiMaximize,
  FiMinimize,
  FiSun,
  FiDroplet,
  FiSliders,
  FiFilter,
  FiRefreshCw,
  FiCopy,
  FiTrash2,
  FiEdit2,
  FiLayers,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUnlock,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiAnchor,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiCornerDownLeft,
  FiCornerDownRight,
  FiSquare,
  FiCircle,
  FiTriangle,
  FiStar,
  FiHeart,
  FiHexagon,
  FiOctagon,
  FiPenTool,
  FiType,
  FiGrid,
  FiCrosshair,
  FiCamera,
  FiAperture,
  FiTarget,
  FiCompass,
  FiScissors,
  FiPaperclip,
  FiLink,
  FiCommand,
  FiCpu,
  FiFeather,
  FiSave,
  FiX,
  FiCheck,
  FiPlus,
  FiMinus,
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiMaximize2,
  FiMinimize2,
  FiSkipBack,
  FiSkipForward,
  FiRewind,
  FiFastForward,
  FiShuffle,
  FiRepeat,
  FiShare2,
  FiSettings,
  FiTool,
  FiZap,
  FiTrendingUp,
  FiActivity,
  FiBarChart,
  FiPieChart,
  FiPercent,
  FiDollarSign,
  FiHash,
  FiAtSign,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiNavigation,
  FiCompass as FiCompass2,
  FiMap,
  FiClock,
  FiCalendar,
  FiSunrise,
  FiSunset,
  FiMoon,
  FiCloud,
  FiCloudRain,
  FiCloudSnow,
  FiWind,
  FiThermometer,
  FiUmbrella,
  FiZapOff,
  FiBattery,
  FiBatteryCharging,
  FiWifi,
  FiWifiOff,
  FiBluetooth,
  FiCast,
  FiRadio,
  FiMic,
  FiMicOff,
  FiVolume,
  FiVolume1,
  FiVolume2,
  FiVolumeX,
  FiPlay,
  FiPause,
  FiPlayCircle,
  FiPauseCircle,
  FiStopCircle,
  FiMusic,
  FiHeadphones,
  FiSpeaker,
  FiVideo,
  FiVideoOff,
  FiFilm,
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiTv,
  FiAirplay,
  FiPrinter,
  FiHardDrive,
  FiServer,
  FiDatabase,
  FiArchive,
  FiFolder,
  FiFile,
  FiFileText,
  FiFilePlus,
  FiFileMinus,
  FiCode,
  FiTerminal,
  FiGitBranch,
  FiGitCommit,
  FiGitMerge,
  FiGitPullRequest,
  FiGithub,
  FiGitlab,
  FiBold,
  FiItalic,
  FiUnderline
} from 'react-icons/fi';
import {
  HiOutlinePhotograph,
  HiOutlineAdjustments,
  HiOutlineColorSwatch,
  HiOutlineSparkles,
  HiOutlinePencilAlt,
  HiOutlineTemplate,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineDuplicate,
  HiOutlineClipboard,
  HiOutlineClipboardCopy,
  HiOutlineClipboardCheck,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineDocumentAdd,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentRemove,
  HiOutlineDocumentDownload,
  HiOutlineDocumentSearch,
  HiOutlineDocumentText,
  HiOutlineDocumentReport,
  HiOutlineFolderAdd,
  HiOutlineFolderRemove,
  HiOutlineFolderOpen,
  HiOutlineFolderDownload,
  HiOutlinePhotograph as HiPhotograph,
  HiOutlineCamera,
  HiOutlineFilm,
  HiOutlineVideoCamera,
  HiOutlineMicrophone,
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineStop,
  HiOutlineFastForward,
  HiOutlineRewind,
  HiOutlineRefresh,
  HiOutlineReply,
  HiOutlineShare,
  HiOutlineDownload,
  HiOutlineUpload,
  HiOutlineCloudDownload,
  HiOutlineCloudUpload,
  HiOutlineCloud,
  HiOutlineDatabase,
  HiOutlineServer,
  HiOutlineDesktopComputer,
  HiOutlineDeviceMobile,
  HiOutlineDeviceTablet,
  HiOutlineChip,
  HiOutlineCube,
  HiOutlineCubeTransparent,
  HiOutlineClipboardCopy as HiCopy,
  HiOutlineClipboard as HiClipboard
} from 'react-icons/hi';
import { RiImageEditLine, RiImageAddLine, RiImageLine, RiImage2Line } from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEditorStore } from '@/store/editor-store';
import { cn } from '@/lib/utils/index';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { HexColorPicker } from 'react-colorful';
import Cropper from 'react-easy-crop';
import type { Point, Area } from 'react-easy-crop';
import { HiOutlineSparkles as HiSparkles, HiOutlineTemplate as HiTemplate } from 'react-icons/hi';

// Types
interface ImageAsset {
  id: string;
  src: string;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  opacity: number;
  filters: ImageFilters;
  effects: ImageEffects;
  cropArea?: Area;
  flipHorizontal: boolean;
  flipVertical: boolean;
  locked: boolean;
  visible: boolean;
  pageIndex: number;
  zIndex: number;
  metadata?: Record<string, any>;
}

interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  grayscale: number;
  sepia: number;
  invert: number;
  sharpen: number;
}

interface ImageEffects {
  shadow: {
    enabled: boolean;
    x: number;
    y: number;
    blur: number;
    color: string;
    opacity: number;
  };
  border: {
    enabled: boolean;
    width: number;
    color: string;
    style: string;
    radius: number;
  };
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
    blendMode: string;
  };
}

interface ImageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  filters: Partial<ImageFilters>;
  effects: Partial<ImageEffects>;
  tags: string[];
}

// Image templates
const imageTemplates: ImageTemplate[] = [
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic vintage photo effect',
    thumbnail: '',
    category: 'Artistic',
    filters: {
      sepia: 0.4,
      contrast: 1.2,
      brightness: 0.9,
      saturation: 0.8
    },
    effects: {
      border: {
        enabled: true,
        width: 10,
        color: '#f4f4f4',
        style: 'solid',
        radius: 0
      }
    },
    tags: ['vintage', 'retro', 'classic']
  },
  {
    id: 'blackwhite',
    name: 'Black & White',
    description: 'Classic monochrome effect',
    thumbnail: '',
    category: 'Classic',
    filters: {
      grayscale: 1,
      contrast: 1.3
    },
    effects: {},
    tags: ['monochrome', 'classic', 'bw']
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast dramatic effect',
    thumbnail: '',
    category: 'Artistic',
    filters: {
      contrast: 1.5,
      brightness: 0.85,
      saturation: 1.2
    },
    effects: {
      shadow: {
        enabled: true,
        x: 5,
        y: 5,
        blur: 15,
        color: '#000000',
        opacity: 0.5
      }
    },
    tags: ['dramatic', 'contrast', 'bold']
  },
  {
    id: 'soft',
    name: 'Soft Focus',
    description: 'Dreamy soft focus effect',
    thumbnail: '',
    category: 'Portrait',
    filters: {
      blur: 0.5,
      brightness: 1.1,
      saturation: 0.9
    },
    effects: {
      overlay: {
        enabled: true,
        color: '#ffffff',
        opacity: 0.1,
        blendMode: 'screen'
      }
    },
    tags: ['soft', 'dreamy', 'portrait']
  },
  {
    id: 'vivid',
    name: 'Vivid Colors',
    description: 'Enhanced vibrant colors',
    thumbnail: '',
    category: 'Enhancement',
    filters: {
      saturation: 1.5,
      contrast: 1.2,
      brightness: 1.05
    },
    effects: {},
    tags: ['vivid', 'colorful', 'vibrant']
  },
  {
    id: 'cold',
    name: 'Cold Tone',
    description: 'Cool blue-tinted effect',
    thumbnail: '',
    category: 'Color',
    filters: {
      hue: -20,
      saturation: 0.9,
      brightness: 1.05
    },
    effects: {
      overlay: {
        enabled: true,
        color: '#0066cc',
        opacity: 0.05,
        blendMode: 'multiply'
      }
    },
    tags: ['cold', 'blue', 'cool']
  },
  {
    id: 'warm',
    name: 'Warm Tone',
    description: 'Warm orange-tinted effect',
    thumbnail: '',
    category: 'Color',
    filters: {
      hue: 10,
      saturation: 1.1,
      brightness: 1.05
    },
    effects: {
      overlay: {
        enabled: true,
        color: '#ff6600',
        opacity: 0.05,
        blendMode: 'multiply'
      }
    },
    tags: ['warm', 'orange', 'cozy']
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    description: 'Classic polaroid photo style',
    thumbnail: '',
    category: 'Retro',
    filters: {
      contrast: 1.1,
      brightness: 1.05,
      saturation: 0.95
    },
    effects: {
      border: {
        enabled: true,
        width: 30,
        color: '#ffffff',
        style: 'solid',
        radius: 5
      },
      shadow: {
        enabled: true,
        x: 3,
        y: 3,
        blur: 10,
        color: '#000000',
        opacity: 0.3
      }
    },
    tags: ['polaroid', 'instant', 'retro']
  }
];

// Filter presets
const filterPresets = {
  brightness: { min: 0, max: 2, step: 0.01, default: 1 },
  contrast: { min: 0, max: 2, step: 0.01, default: 1 },
  saturation: { min: 0, max: 2, step: 0.01, default: 1 },
  hue: { min: -180, max: 180, step: 1, default: 0 },
  blur: { min: 0, max: 10, step: 0.1, default: 0 },
  grayscale: { min: 0, max: 1, step: 0.01, default: 0 },
  sepia: { min: 0, max: 1, step: 0.01, default: 0 },
  invert: { min: 0, max: 1, step: 0.01, default: 0 },
  sharpen: { min: 0, max: 10, step: 0.1, default: 0 }
};

// Main ImageEditor component
export default function ImageEditor() {
  const {
    currentPageIndex,
    pdfDocument,
    selectedTool,
    setSelectedTool,
    addImage,
    updateImage,
    removeImage,
    images
  } = useEditorStore();

  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeTab, setActiveTab] = useState('adjust');
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [draggedImage, setDraggedImage] = useState<ImageAsset | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [imageLibrary, setImageLibrary] = useState<ImageAsset[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const imageAsset: ImageAsset = {
            id: uuidv4(),
            src: event.target?.result as string,
            name: file.name,
            type: file.type,
            size: file.size,
            width: img.width,
            height: img.height,
            position: { x: 100, y: 100 },
            rotation: 0,
            scale: 1,
            opacity: 1,
            filters: {
              brightness: 1,
              contrast: 1,
              saturation: 1,
              hue: 0,
              blur: 0,
              grayscale: 0,
              sepia: 0,
              invert: 0,
              sharpen: 0
            },
            effects: {
              shadow: {
                enabled: false,
                x: 0,
                y: 0,
                blur: 0,
                color: '#000000',
                opacity: 0.5
              },
              border: {
                enabled: false,
                width: 0,
                color: '#000000',
                style: 'solid',
                radius: 0
              },
              overlay: {
                enabled: false,
                color: '#000000',
                opacity: 0,
                blendMode: 'normal'
              }
            },
            flipHorizontal: false,
            flipVertical: false,
            locked: false,
            visible: true,
            pageIndex: currentPageIndex,
            zIndex: images.length
          };

          addImage(imageAsset);
          setSelectedImage(imageAsset);
          toast.success(`Added ${file.name}`);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, [currentPageIndex, images.length, addImage]);

  // Apply filters to image
  const applyFilters = useCallback((image: ImageAsset): string => {
    const filters = image.filters;
    const filterString = `
      brightness(${filters.brightness})
      contrast(${filters.contrast})
      saturate(${filters.saturation})
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale})
      sepia(${filters.sepia})
      invert(${filters.invert})
    `;
    return filterString;
  }, []);

  // Apply effects to image
  const applyEffects = useCallback((image: ImageAsset): React.CSSProperties => {
    const effects: React.CSSProperties = {};
    
    if (image.effects.shadow.enabled) {
      effects.boxShadow = `${image.effects.shadow.x}px ${image.effects.shadow.y}px ${image.effects.shadow.blur}px ${image.effects.shadow.color}${Math.round(image.effects.shadow.opacity * 255).toString(16).padStart(2, '0')}`;
    }
    
    if (image.effects.border.enabled) {
      effects.border = `${image.effects.border.width}px ${image.effects.border.style} ${image.effects.border.color}`;
      effects.borderRadius = `${image.effects.border.radius}px`;
    }
    
    return effects;
  }, []);

  // Update image property
  const updateImageProperty = useCallback((property: string, value: any) => {
    if (!selectedImage) return;
    
    const updates: any = {};
    const keys = property.split('.');
    
    if (keys.length === 1) {
      updates[property] = value;
    } else {
      let current = updates;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...selectedImage[keys[i] as keyof ImageAsset] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    }
    
    const updatedImage = { ...selectedImage, ...updates };
    updateImage(selectedImage.id, updates);
    setSelectedImage(updatedImage);
  }, [selectedImage, updateImage]);

  // Handle crop complete
  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Apply crop
  const applyCrop = useCallback(() => {
    if (!selectedImage || !croppedAreaPixels) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const image = new Image();
    image.onload = () => {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        updateImageProperty('src', url);
        updateImageProperty('width', croppedAreaPixels.width);
        updateImageProperty('height', croppedAreaPixels.height);
        updateImageProperty('cropArea', croppedAreaPixels);
        
        setShowCropDialog(false);
        toast.success('Image cropped');
      });
    };
    image.src = selectedImage.src;
  }, [selectedImage, croppedAreaPixels, updateImageProperty]);

  // Apply template
  const applyTemplate = useCallback((template: ImageTemplate) => {
    if (!selectedImage) return;
    
    const updates: Partial<ImageAsset> = {
      filters: { ...selectedImage.filters, ...template.filters },
      effects: { ...selectedImage.effects, ...template.effects }
    };
    
    updateImage(selectedImage.id, updates);
    setSelectedImage({ ...selectedImage, ...updates });
    toast.success(`Applied ${template.name} template`);
  }, [selectedImage, updateImage]);

  // Reset filters
  const resetFilters = useCallback(() => {
    if (!selectedImage) return;
    
    const defaultFilters: ImageFilters = {
      brightness: 1,
      contrast: 1,
      saturation: 1,
      hue: 0,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
      sharpen: 0
    };
    
    updateImageProperty('filters', defaultFilters);
    toast.success('Filters reset');
  }, [selectedImage, updateImageProperty]);

  // Reset effects
  const resetEffects = useCallback(() => {
    if (!selectedImage) return;
    
    const defaultEffects: ImageEffects = {
      shadow: {
        enabled: false,
        x: 0,
        y: 0,
        blur: 0,
        color: '#000000',
        opacity: 0.5
      },
      border: {
        enabled: false,
        width: 0,
        color: '#000000',
        style: 'solid',
        radius: 0
      },
      overlay: {
        enabled: false,
        color: '#000000',
        opacity: 0,
        blendMode: 'normal'
      }
    };
    
    updateImageProperty('effects', defaultEffects);
    toast.success('Effects reset');
  }, [selectedImage, updateImageProperty]);

  // Duplicate image
  const duplicateImage = useCallback(() => {
    if (!selectedImage) return;
    
    const duplicated: ImageAsset = {
      ...selectedImage,
      id: uuidv4(),
      position: {
        x: selectedImage.position.x + 20,
        y: selectedImage.position.y + 20
      },
      zIndex: images.length
    };
    
    addImage(duplicated);
    setSelectedImage(duplicated);
    toast.success('Image duplicated');
  }, [selectedImage, images.length, addImage]);

  // Delete image
  const deleteImage = useCallback(() => {
    if (!selectedImage) return;
    
    removeImage(selectedImage.id);
    setSelectedImage(null);
    toast.success('Image deleted');
  }, [selectedImage, removeImage]);

  // Export image
  const exportImage = useCallback(() => {
    if (!selectedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = selectedImage.width * selectedImage.scale;
      canvas.height = selectedImage.height * selectedImage.scale;
      
      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((selectedImage.rotation * Math.PI) / 180);
      ctx.scale(
        selectedImage.flipHorizontal ? -1 : 1,
        selectedImage.flipVertical ? -1 : 1
      );
      
      // Apply filters
      ctx.filter = applyFilters(selectedImage);
      ctx.globalAlpha = selectedImage.opacity;
      
      // Draw image
      ctx.drawImage(
        img,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );
      
      ctx.restore();
      
      // Export
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited-${selectedImage.name}`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success('Image exported');
      });
    };
    img.src = selectedImage.src;
  }, [selectedImage, applyFilters]);

  return (
    <div className="flex h-full">
      {/* Left Panel - Image Library & Tools */}
      <div className="w-80 border-r bg-white dark:bg-gray-900 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="adjust">Adjust</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiUpload className="mr-2" />
                    Upload Images
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Recent Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {images
                      .filter(img => img.pageIndex === currentPageIndex)
                      .map((image) => (
                        <Card
                          key={image.id}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            selectedImage?.id === image.id && "ring-2 ring-blue-500"
                          )}
                          onClick={() => setSelectedImage(image)}
                        >
                          <CardContent className="p-2">
                            <img
                              src={image.src}
                              alt={image.name}
                              className="w-full h-24 object-cover rounded"
                              style={{
                                filter: applyFilters(image),
                                opacity: image.opacity,
                                ...applyEffects(image)
                              }}
                            />
                            <p className="text-xs mt-1 truncate">{image.name}</p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Templates</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {imageTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant="outline"
                        size="sm"
                        className="h-auto flex-col p-2"
                        onClick={() => applyTemplate(template)}
                        disabled={!selectedImage}
                      >
                        <span className="text-xs font-medium">{template.name}</span>
                        <span className="text-xs text-gray-500">{template.category}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="adjust" className="flex-1 overflow-hidden">
            {selectedImage ? (
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">X</Label>
                        <Input
                          type="number"
                          value={selectedImage.position.x}
                          onChange={(e) => updateImageProperty('position', {
                            ...selectedImage.position,
                            x: parseInt(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y</Label>
                        <Input
                          type="number"
                          value={selectedImage.position.y}
                          onChange={(e) => updateImageProperty('position', {
                            ...selectedImage.position,
                            y: parseInt(e.target.value)
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Size</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Width</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedImage.width * selectedImage.scale)}
                          onChange={(e) => {
                            const newWidth = parseInt(e.target.value);
                            const scale = newWidth / selectedImage.width;
                            updateImageProperty('scale', scale);
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedImage.height * selectedImage.scale)}
                          onChange={(e) => {
                            const newHeight = parseInt(e.target.value);
                            const scale = newHeight / selectedImage.height;
                            updateImageProperty('scale', scale);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Scale: {(selectedImage.scale * 100).toFixed(0)}%</Label>
                    <Slider
                      value={[selectedImage.scale * 100]}
                      onValueChange={([value]) => updateImageProperty('scale', value / 100)}
                      min={10}
                      max={200}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rotation: {selectedImage.rotation}°</Label>
                    <Slider
                      value={[selectedImage.rotation]}
                      onValueChange={([value]) => updateImageProperty('rotation', value)}
                      min={-180}
                      max={180}
                      step={1}
                    />
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateImageProperty('rotation', selectedImage.rotation - 90)}
                      >
                        <FiRotateCcw />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateImageProperty('rotation', selectedImage.rotation + 90)}
                      >
                        <FiRotateCw />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateImageProperty('rotation', 0)}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Opacity: {(selectedImage.opacity * 100).toFixed(0)}%</Label>
                    <Slider
                      value={[selectedImage.opacity * 100]}
                      onValueChange={([value]) => updateImageProperty('opacity', value / 100)}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Flip</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={selectedImage.flipHorizontal ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateImageProperty('flipHorizontal', !selectedImage.flipHorizontal)}
                      >
                        Horizontal
                      </Button>
                      <Button
                        variant={selectedImage.flipVertical ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateImageProperty('flipVertical', !selectedImage.flipVertical)}
                      >
                        Vertical
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowCropDialog(true)}
                    >
                      <FiCrop className="mr-2" />
                      Crop Image
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={duplicateImage}
                    >
                      <FiCopy className="mr-2" />
                      Duplicate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={deleteImage}
                    >
                      <FiTrash2 className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-sm">Select an image to adjust</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="filters" className="flex-1 overflow-hidden">
            {selectedImage ? (
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {Object.entries(filterPresets).map(([filter, preset]) => (
                    <div key={filter} className="space-y-2">
                      <Label className="capitalize">
                        {filter}: {selectedImage.filters[filter as keyof ImageFilters]}
                      </Label>
                      <Slider
                        value={[selectedImage.filters[filter as keyof ImageFilters]]}
                        onValueChange={([value]) => updateImageProperty(`filters.${filter}`, value)}
                        min={preset.min}
                        max={preset.max}
                        step={preset.step}
                      />
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={resetFilters}
                  >
                    <FiRefreshCw className="mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-sm">Select an image to apply filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="effects" className="flex-1 overflow-hidden">
            {selectedImage ? (
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {/* Shadow Effect */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Shadow</Label>
                      <Switch
                        checked={selectedImage.effects.shadow.enabled}
                        onCheckedChange={(checked) => updateImageProperty('effects.shadow.enabled', checked)}
                      />
                    </div>
                    {selectedImage.effects.shadow.enabled && (
                      <div className="space-y-2 pl-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">X Offset</Label>
                            <Input
                              type="number"
                              value={selectedImage.effects.shadow.x}
                              onChange={(e) => updateImageProperty('effects.shadow.x', parseInt(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Y Offset</Label>
                            <Input
                              type="number"
                              value={selectedImage.effects.shadow.y}
                              onChange={(e) => updateImageProperty('effects.shadow.y', parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Blur</Label>
                          <Slider
                            value={[selectedImage.effects.shadow.blur]}
                            onValueChange={([value]) => updateImageProperty('effects.shadow.blur', value)}
                            min={0}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Color</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start">
                                <div
                                  className="w-4 h-4 rounded mr-2"
                                  style={{ backgroundColor: selectedImage.effects.shadow.color }}
                                />
                                {selectedImage.effects.shadow.color}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-3">
                              <HexColorPicker
                                color={selectedImage.effects.shadow.color}
                                onChange={(color) => updateImageProperty('effects.shadow.color', color)}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label className="text-xs">Opacity</Label>
                          <Slider
                            value={[selectedImage.effects.shadow.opacity * 100]}
                            onValueChange={([value]) => updateImageProperty('effects.shadow.opacity', value / 100)}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Border Effect */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Border</Label>
                      <Switch
                        checked={selectedImage.effects.border.enabled}
                        onCheckedChange={(checked) => updateImageProperty('effects.border.enabled', checked)}
                      />
                    </div>
                    {selectedImage.effects.border.enabled && (
                      <div className="space-y-2 pl-4">
                        <div>
                          <Label className="text-xs">Width</Label>
                          <Slider
                            value={[selectedImage.effects.border.width]}
                            onValueChange={([value]) => updateImageProperty('effects.border.width', value)}
                            min={0}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Color</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start">
                                <div
                                  className="w-4 h-4 rounded mr-2"
                                  style={{ backgroundColor: selectedImage.effects.border.color }}
                                />
                                {selectedImage.effects.border.color}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-3">
                              <HexColorPicker
                                color={selectedImage.effects.border.color}
                                onChange={(color) => updateImageProperty('effects.border.color', color)}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label className="text-xs">Style</Label>
                          <Select
                            value={selectedImage.effects.border.style}
                            onValueChange={(value) => updateImageProperty('effects.border.style', value)}
                          >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                            <option value="double">Double</option>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Radius</Label>
                          <Slider
                            value={[selectedImage.effects.border.radius]}
                            onValueChange={([value]) => updateImageProperty('effects.border.radius', value)}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Overlay Effect */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Overlay</Label>
                      <Switch
                        checked={selectedImage.effects.overlay.enabled}
                        onCheckedChange={(checked) => updateImageProperty('effects.overlay.enabled', checked)}
                      />
                    </div>
                    {selectedImage.effects.overlay.enabled && (
                      <div className="space-y-2 pl-4">
                        <div>
                          <Label className="text-xs">Color</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start">
                                <div
                                  className="w-4 h-4 rounded mr-2"
                                  style={{ backgroundColor: selectedImage.effects.overlay.color }}
                                />
                                {selectedImage.effects.overlay.color}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-3">
                              <HexColorPicker
                                color={selectedImage.effects.overlay.color}
                                onChange={(color) => updateImageProperty('effects.overlay.color', color)}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label className="text-xs">Opacity</Label>
                          <Slider
                            value={[selectedImage.effects.overlay.opacity * 100]}
                            onValueChange={([value]) => updateImageProperty('effects.overlay.opacity', value / 100)}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Blend Mode</Label>
                          <Select
                            value={selectedImage.effects.overlay.blendMode}
                            onValueChange={(value) => updateImageProperty('effects.overlay.blendMode', value)}
                          >
                            <option value="normal">Normal</option>
                            <option value="multiply">Multiply</option>
                            <option value="screen">Screen</option>
                            <option value="overlay">Overlay</option>
                            <option value="darken">Darken</option>
                            <option value="lighten">Lighten</option>
                            <option value="color-dodge">Color Dodge</option>
                            <option value="color-burn">Color Burn</option>
                            <option value="hard-light">Hard Light</option>
                            <option value="soft-light">Soft Light</option>
                            <option value="difference">Difference</option>
                            <option value="exclusion">Exclusion</option>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={resetEffects}
                  >
                    <FiRefreshCw className="mr-2" />
                    Reset Effects
                  </Button>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-sm">Select an image to apply effects</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        <div className="p-4 border-t space-y-2">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={exportImage}
            disabled={!selectedImage}
          >
            <FiDownload className="mr-2" />
            Export Image
          </Button>
        </div>
      </div>

      {/* Right Panel - Image Canvas */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-auto relative">
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                >
                  <FiSliders />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Filters Panel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEffectsPanel(!showEffectsPanel)}
                >
                  <HiSparkles />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Effects Panel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                >
                  <HiTemplate />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Templates</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Image Display Area */}
        <div className="p-8 h-full flex items-center justify-center">
          {images.filter(img => img.pageIndex === currentPageIndex).length > 0 ? (
            <div className="relative">
              {images
                .filter(img => img.pageIndex === currentPageIndex && img.visible)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((image) => (
                  <div
                    key={image.id}
                    className={cn(
                      "absolute cursor-move",
                      selectedImage?.id === image.id && "ring-2 ring-blue-500",
                      image.locked && "cursor-not-allowed"
                    )}
                    style={{
                      left: image.position.x,
                      top: image.position.y,
                      transform: `
                        rotate(${image.rotation}deg)
                        scale(${image.scale})
                        scaleX(${image.flipHorizontal ? -1 : 1})
                        scaleY(${image.flipVertical ? -1 : 1})
                      `,
                      transformOrigin: 'center',
                      zIndex: image.zIndex
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.src}
                      alt={image.name}
                      style={{
                        filter: applyFilters(image),
                        opacity: image.opacity,
                        ...applyEffects(image),
                        pointerEvents: image.locked ? 'none' : 'auto'
                      }}
                    />
                    
                    {/* Resize handles */}
                    {selectedImage?.id === image.id && !image.locked && (
                      <>
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize" />
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-ne-resize" />
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-sw-resize" />
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize" />
                      </>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <FiImage className="mx-auto text-6xl mb-4" />
              <p className="text-lg">No images on this page</p>
              <p className="text-sm mt-2">Upload images to get started</p>
            </div>
          )}
        </div>

        {/* Hidden canvas for export */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Drag to reposition, scroll to zoom
            </DialogDescription>
          </DialogHeader>
          
          {selectedImage && (
            <div className="relative h-full">
              <Cropper
                image={selectedImage.src}
                crop={crop}
                zoom={zoom}
                aspect={undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCropDialog(false)}>
              Cancel
            </Button>
            <Button onClick={applyCrop}>
              Apply Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}