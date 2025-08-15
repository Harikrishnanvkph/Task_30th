'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiType,
  FiCheckSquare,
  FiCircle,
  FiChevronDown,
  FiCalendar,
  FiUpload,
  FiEdit3,
  FiList,
  FiGrid,
  FiLock,
  FiUnlock,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiTrash2,
  FiMove,
  FiSettings,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiBold,
  FiItalic,
  FiUnderline,
  FiCode,
  FiDatabase,
  FiLink,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiDollarSign,
  FiPercent,
  FiHash,
  FiGlobe,
  FiMapPin,
  FiClock,
  FiStar,
  FiSliders,
  FiToggleLeft,
  FiToggleRight,
  FiImage,
  FiFile,
  FiPaperclip,
  FiZap,
  FiShield,
  FiAlertCircle,
  FiInfo,
  FiHelpCircle,
  FiX,
  FiPlus,
  FiMinus,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiMaximize2,
  FiMinimize2,
  FiRefreshCw,
  FiSave,
  FiDownload,
  FiPrinter,
  FiShare2,
  FiBarChart,
  FiPieChart,
  FiTrendingUp,
  FiActivity,
  FiTarget,
  FiAward,
  FiFlag,
  FiBookmark,
  FiTag,
  FiFilter,
  FiSearch,
  FiZoomIn,
  FiZoomOut,
  FiCommand,
  FiTerminal,
  FiBox,
  FiPackage,
  FiLayers,
  FiLayout,
  FiSidebar,
  FiColumns,
  FiSquare,
  FiTriangle,
  FiOctagon,
  FiHexagon,
  FiStar as FiStarOutline
} from 'react-icons/fi';
import {
  HiOutlineColorSwatch,
  HiOutlineTemplate,
  HiOutlineVariable,
  HiOutlineCalculator,
  HiOutlineQrcode,
  HiOutlineFingerPrint,
  HiOutlineLocationMarker,
  HiOutlineVideoCamera,
  HiOutlineMicrophone,
  HiOutlineCamera,
  HiOutlineDocumentText,
  HiOutlineTable,
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineMap,
  HiOutlineGlobeAlt,
  HiOutlineCurrencyDollar,
  HiOutlineCreditCard as HiCreditCard,
  HiOutlineIdentification,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineClipboardList,
  HiOutlineDocumentReport,
  HiOutlineNewspaper,
  HiOutlinePresentationChartBar,
  HiOutlinePresentationChartLine,
  HiOutlineReceiptTax,
  HiOutlineScale,
  HiOutlineTicket,
  HiOutlineTruck,
  HiOutlineShoppingCart,
  HiOutlineShoppingBag,
  HiOutlineGift,
  HiOutlineHeart,
  HiOutlineLightBulb,
  HiOutlineLightningBolt,
  HiOutlineFire,
  HiOutlineSparkles,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineCloud,
  HiOutlineWifi,
  HiOutlineDeviceMobile,
  HiOutlineDesktopComputer,
  HiOutlineChip,
  HiOutlineDatabase as HiDatabase,
  HiOutlineServer,
  HiOutlineTerminal,
  HiOutlineCode,
  HiOutlinePuzzle,
  HiOutlineCube,
  HiOutlineCollection,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineViewBoards,
  HiOutlineAdjustments,
  HiOutlineCog,
  HiOutlineSupport,
  HiOutlineQuestionMarkCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineBan,
  HiOutlineShieldCheck,
  HiOutlineShieldExclamation,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
  HiOutlineKey,
  HiOutlineEye as HiEye,
  HiOutlineEyeOff as HiEyeOff,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineUserRemove,
  HiOutlineUserCircle,
  HiOutlineAnnotation,
  HiOutlineChat,
  HiOutlineChatAlt,
  HiOutlineChatAlt2,
  HiOutlineMailOpen,
  HiOutlineMail,
  HiOutlineInbox,
  HiOutlineInboxIn,
  HiOutlinePaperAirplane,
  HiOutlinePencil,
  HiOutlinePencilAlt,
  HiOutlineDocumentAdd,
  HiOutlineDocumentRemove,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentDownload,
  HiOutlineDocumentSearch,
  HiOutlineFolder,
  HiOutlineFolderAdd,
  HiOutlineFolderRemove,
  HiOutlineFolderOpen,
  HiOutlineFolderDownload,
  HiOutlinePhotograph,
  HiOutlineFilm,
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
  HiOutlineArchive,
  HiOutlineBackspace,
  HiOutlineTrash,
  HiOutlineDuplicate,
  HiOutlineClipboard,
  HiOutlineClipboardCopy,
  HiOutlineClipboardCheck,
  HiOutlineColorSwatch as HiColorSwatch,
  HiOutlineTemplate as HiTemplate,
  HiOutlineVariable as HiVariable,
  HiOutlineCalculator as HiCalculator,
  HiOutlineQrcode as HiQrcode,
  HiOutlineFingerPrint as HiFingerPrint,
  HiOutlineLocationMarker as HiLocationMarker,
  HiOutlineVideoCamera as HiVideoCamera,
  HiOutlineMicrophone as HiMicrophone,
  HiOutlineCamera as HiCamera,
  HiOutlineDocumentText as HiDocumentText,
  HiOutlineTable as HiTable,
  HiOutlineChartBar as HiChartBar,
  HiOutlineChartPie as HiChartPie,
  HiOutlineMap as HiMap,
  HiOutlineGlobeAlt as HiGlobeAlt,
  HiOutlineCurrencyDollar as HiCurrencyDollar
} from 'react-icons/hi';
import { RiInputMethodLine, RiSurveyLine, RiFileList2Line } from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
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
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Types
interface FormField {
  id: string;
  type: FormFieldType;
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  validation?: FieldValidation;
  styling?: FieldStyling;
  options?: FieldOption[];
  conditionalLogic?: ConditionalLogic;
  metadata?: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  pageIndex: number;
}

type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'url'
  | 'password'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'slider'
  | 'rating'
  | 'file'
  | 'image'
  | 'signature'
  | 'color'
  | 'range'
  | 'hidden'
  | 'button'
  | 'submit'
  | 'reset'
  | 'divider'
  | 'heading'
  | 'paragraph'
  | 'html'
  | 'captcha'
  | 'qrcode'
  | 'barcode'
  | 'matrix'
  | 'likert'
  | 'nps'
  | 'address'
  | 'payment'
  | 'calculation'
  | 'repeater'
  | 'section'
  | 'tabs'
  | 'accordion'
  | 'wizard';

interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customValidator?: string;
  errorMessage?: string;
}

interface FieldStyling {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  width?: string;
  height?: string;
  className?: string;
  customCSS?: string;
}

interface FieldOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

interface ConditionalLogic {
  show?: boolean;
  when?: string;
  operator?: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value?: any;
  action?: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'unrequire';
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  fields: FormField[];
  thumbnail?: string;
  tags?: string[];
  popularity?: number;
}

// Form field components
const fieldComponents: Record<FormFieldType, React.FC<any>> = {
  text: ({ field, value, onChange }: any) => (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      disabled={field.disabled}
      readOnly={field.readonly}
      required={field.required}
      style={field.styling}
    />
  ),
  textarea: ({ field, value, onChange }: any) => (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      disabled={field.disabled}
      readOnly={field.readonly}
      required={field.required}
      rows={field.metadata?.rows || 4}
      style={field.styling}
    />
  ),
  number: ({ field, value, onChange }: any) => (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      disabled={field.disabled}
      readOnly={field.readonly}
      required={field.required}
      min={field.validation?.min}
      max={field.validation?.max}
      step={field.metadata?.step}
      style={field.styling}
    />
  ),
  email: ({ field, value, onChange }: any) => (
    <Input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      disabled={field.disabled}
      readOnly={field.readonly}
      required={field.required}
      style={field.styling}
    />
  ),
  phone: ({ field, value, onChange }: any) => (
    <Input
      type="tel"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      disabled={field.disabled}
      readOnly={field.readonly}
      required={field.required}
      pattern={field.validation?.pattern}
      style={field.styling}
    />
  ),
  url: ({ field, value, onChange }: any) => (
    <Input
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      disabled={field.disabled}
      readOnly={field.readonly}
      required={field.required}
      style={field.styling}
    />
  ),
  password: ({ field, value, onChange }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          disabled={field.disabled}
          readOnly={field.readonly}
          required={field.required}
          style={field.styling}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </Button>
      </div>
    );
  },
  date: ({ field, value, onChange }: any) => (
    <Input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={field.disabled}
      readOnly={field.readonly}
      required={field.required}
      min={field.validation?.min}
      max={field.validation?.max}
      style={field.styling}
    />
  ),
  time: ({ field, value, onChange }: any) => (
    <Input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={field.disabled}
      readOnly={field.readonly}
      required={field.required}
      style={field.styling}
    />
  ),
  datetime: ({ field, value, onChange }: any) => (
    <Input
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={field.disabled}
      readOnly={field.readonly}
      required={field.required}
      min={field.validation?.min}
      max={field.validation?.max}
      style={field.styling}
    />
  ),
  select: ({ field, value, onChange }: any) => (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={field.disabled}
      required={field.required}
    >
      <option value="">Select...</option>
      {field.options?.map((option: FieldOption) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </Select>
  ),
  multiselect: ({ field, value, onChange }: any) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(value || []);
    
    const handleToggle = (optionValue: string) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onChange(newValues);
    };
    
    return (
      <div className="space-y-2">
        {field.options?.map((option: FieldOption) => (
          <label key={option.value} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => handleToggle(option.value)}
              disabled={field.disabled || option.disabled}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    );
  },
  checkbox: ({ field, value, onChange }: any) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={value}
        onCheckedChange={onChange}
        disabled={field.disabled}
        required={field.required}
      />
      <Label>{field.label}</Label>
    </div>
  ),
  radio: ({ field, value, onChange }: any) => (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={field.disabled}
      required={field.required}
    >
      {field.options?.map((option: FieldOption) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={field.disabled || option.disabled}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </RadioGroup>
  ),
  switch: ({ field, value, onChange }: any) => (
    <div className="flex items-center space-x-2">
      <Switch
        checked={value}
        onCheckedChange={onChange}
        disabled={field.disabled}
      />
      <Label>{field.label}</Label>
    </div>
  ),
  slider: ({ field, value, onChange }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{field.validation?.min || 0}</span>
        <span className="font-medium">{value}</span>
        <span>{field.validation?.max || 100}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={field.validation?.min || 0}
        max={field.validation?.max || 100}
        step={field.metadata?.step || 1}
        disabled={field.disabled}
      />
    </div>
  ),
  rating: ({ field, value, onChange }: any) => {
    const maxRating = field.metadata?.maxRating || 5;
    return (
      <div className="flex space-x-1">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            disabled={field.disabled}
            className={cn(
              "text-2xl transition-colors",
              rating <= value ? "text-yellow-400" : "text-gray-300"
            )}
          >
            <FiStar className={rating <= value ? "fill-current" : ""} />
          </button>
        ))}
      </div>
    );
  },
  file: ({ field, value, onChange }: any) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          onChange={(e) => onChange(e.target.files?.[0])}
          disabled={field.disabled}
          required={field.required}
          accept={field.metadata?.accept}
          multiple={field.metadata?.multiple}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={field.disabled}
        >
          <FiUpload className="mr-2" />
          Choose File
        </Button>
        {value && <span className="text-sm text-gray-600">{value.name}</span>}
      </div>
    );
  },
  image: ({ field, value, onChange }: any) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          disabled={field.disabled}
          required={field.required}
          accept="image/*"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={field.disabled}
        >
          <FiImage className="mr-2" />
          Choose Image
        </Button>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs max-h-48 rounded border"
          />
        )}
      </div>
    );
  },
  signature: ({ field, value, onChange }: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    
    const startDrawing = (e: React.MouseEvent) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };
    
    const draw = (e: React.MouseEvent) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    };
    
    const stopDrawing = () => {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        onChange(canvas.toDataURL());
      }
    };
    
    const clearSignature = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange(null);
    };
    
    return (
      <div className="space-y-2">
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          className="border rounded cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSignature}
        >
          Clear
        </Button>
      </div>
    );
  },
  color: ({ field, value, onChange }: any) => {
    const [showPicker, setShowPicker] = useState(false);
    
    return (
      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            disabled={field.disabled}
          >
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: value || '#000000' }}
            />
            {value || 'Choose color'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3">
          <HexColorPicker color={value || '#000000'} onChange={onChange} />
        </PopoverContent>
      </Popover>
    );
  },
  range: ({ field, value, onChange }: any) => {
    const [rangeValue, setRangeValue] = useState(value || [0, 100]);
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{rangeValue[0]}</span>
          <span>to</span>
          <span>{rangeValue[1]}</span>
        </div>
        <Slider
          value={rangeValue}
          onValueChange={(v) => {
            setRangeValue(v);
            onChange(v);
          }}
          min={field.validation?.min || 0}
          max={field.validation?.max || 100}
          step={field.metadata?.step || 1}
          disabled={field.disabled}
        />
      </div>
    );
  },
  hidden: ({ field, value }: any) => (
    <input type="hidden" value={value} name={field.name} />
  ),
  button: ({ field }: any) => (
    <Button
      type={field.metadata?.buttonType || 'button'}
      variant={field.metadata?.variant || 'default'}
      size={field.metadata?.size || 'default'}
      disabled={field.disabled}
      style={field.styling}
    >
      {field.label}
    </Button>
  ),
  submit: ({ field }: any) => (
    <Button
      type="submit"
      variant={field.metadata?.variant || 'primary'}
      size={field.metadata?.size || 'default'}
      disabled={field.disabled}
      style={field.styling}
    >
      {field.label || 'Submit'}
    </Button>
  ),
  reset: ({ field }: any) => (
    <Button
      type="reset"
      variant={field.metadata?.variant || 'outline'}
      size={field.metadata?.size || 'default'}
      disabled={field.disabled}
      style={field.styling}
    >
      {field.label || 'Reset'}
    </Button>
  ),
  divider: ({ field }: any) => (
    <Separator
      orientation={field.metadata?.orientation || 'horizontal'}
      className={field.metadata?.className}
      style={field.styling}
    />
  ),
  heading: ({ field }: any) => {
    const Tag = field.metadata?.level || 'h3';
    return (
      <Tag
        className={cn("font-bold", field.metadata?.className)}
        style={field.styling}
      >
        {field.label}
      </Tag>
    );
  },
  paragraph: ({ field }: any) => (
    <p
      className={field.metadata?.className}
      style={field.styling}
    >
      {field.label}
    </p>
  ),
  html: ({ field }: any) => (
    <div
      dangerouslySetInnerHTML={{ __html: field.metadata?.html || '' }}
      className={field.metadata?.className}
      style={field.styling}
    />
  ),
  captcha: ({ field, onChange }: any) => {
    // Simplified captcha for demonstration
    const [captchaValue, setCaptchaValue] = useState('');
    const captchaCode = field.metadata?.code || 'ABCD';
    
    return (
      <div className="space-y-2">
        <div className="bg-gray-100 p-4 rounded text-center font-mono text-xl">
          {captchaCode}
        </div>
        <Input
          type="text"
          value={captchaValue}
          onChange={(e) => {
            setCaptchaValue(e.target.value);
            onChange(e.target.value === captchaCode);
          }}
          placeholder="Enter the code above"
          required={field.required}
        />
      </div>
    );
  },
  qrcode: ({ field }: any) => {
    // Simplified QR code display
    return (
      <div className="p-4 bg-white rounded border">
        <div className="w-32 h-32 bg-black opacity-10 rounded" />
        <p className="text-sm text-gray-600 mt-2">{field.metadata?.data || 'QR Code'}</p>
      </div>
    );
  },
  barcode: ({ field }: any) => {
    // Simplified barcode display
    return (
      <div className="p-4 bg-white rounded border">
        <div className="w-48 h-16 bg-black opacity-10" />
        <p className="text-sm text-gray-600 mt-2">{field.metadata?.data || 'Barcode'}</p>
      </div>
    );
  },
  matrix: ({ field, value, onChange }: any) => {
    const rows = field.metadata?.rows || [];
    const columns = field.metadata?.columns || [];
    const [matrixValue, setMatrixValue] = useState(value || {});
    
    const handleChange = (row: string, col: string) => {
      const newValue = { ...matrixValue, [`${row}-${col}`]: !matrixValue[`${row}-${col}`] };
      setMatrixValue(newValue);
      onChange(newValue);
    };
    
    return (
      <table className="border-collapse">
        <thead>
          <tr>
            <th></th>
            {columns.map((col: string) => (
              <th key={col} className="p-2 text-sm">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: string) => (
            <tr key={row}>
              <td className="p-2 text-sm font-medium">{row}</td>
              {columns.map((col: string) => (
                <td key={col} className="p-2 text-center">
                  <Checkbox
                    checked={matrixValue[`${row}-${col}`] || false}
                    onCheckedChange={() => handleChange(row, col)}
                    disabled={field.disabled}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
  likert: ({ field, value, onChange }: any) => {
    const scale = field.metadata?.scale || [
      'Strongly Disagree',
      'Disagree',
      'Neutral',
      'Agree',
      'Strongly Agree'
    ];
    
    return (
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={field.disabled}
        required={field.required}
        className="flex space-x-4"
      >
        {scale.map((option: string, index: number) => (
          <label key={index} className="flex flex-col items-center space-y-1">
            <input
              type="radio"
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              disabled={field.disabled}
            />
            <span className="text-xs text-center">{option}</span>
          </label>
        ))}
      </RadioGroup>
    );
  },
  nps: ({ field, value, onChange }: any) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Not at all likely</span>
          <span>Extremely likely</span>
        </div>
        <div className="flex space-x-1">
          {Array.from({ length: 11 }, (_, i) => i).map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              disabled={field.disabled}
              className={cn(
                "flex-1 py-2 text-sm rounded transition-colors",
                value === score
                  ? score <= 6
                    ? "bg-red-500 text-white"
                    : score <= 8
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              {score}
            </button>
          ))}
        </div>
      </div>
    );
  },
  address: ({ field, value, onChange }: any) => {
    const [address, setAddress] = useState(value || {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    });
    
    const handleChange = (key: string, val: string) => {
      const newAddress = { ...address, [key]: val };
      setAddress(newAddress);
      onChange(newAddress);
    };
    
    return (
      <div className="space-y-2">
        <Input
          type="text"
          value={address.street}
          onChange={(e) => handleChange('street', e.target.value)}
          placeholder="Street Address"
          disabled={field.disabled}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="text"
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
            disabled={field.disabled}
          />
          <Input
            type="text"
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="State/Province"
            disabled={field.disabled}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="text"
            value={address.zip}
            onChange={(e) => handleChange('zip', e.target.value)}
            placeholder="ZIP/Postal Code"
            disabled={field.disabled}
          />
          <Input
            type="text"
            value={address.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Country"
            disabled={field.disabled}
          />
        </div>
      </div>
    );
  },
  payment: ({ field, value, onChange }: any) => {
    const [payment, setPayment] = useState(value || {
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    });
    
    const handleChange = (key: string, val: string) => {
      const newPayment = { ...payment, [key]: val };
      setPayment(newPayment);
      onChange(newPayment);
    };
    
    return (
      <div className="space-y-2">
        <Input
          type="text"
          value={payment.cardNumber}
          onChange={(e) => handleChange('cardNumber', e.target.value)}
          placeholder="Card Number"
          disabled={field.disabled}
        />
        <Input
          type="text"
          value={payment.cardName}
          onChange={(e) => handleChange('cardName', e.target.value)}
          placeholder="Name on Card"
          disabled={field.disabled}
        />
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="text"
            value={payment.expiryMonth}
            onChange={(e) => handleChange('expiryMonth', e.target.value)}
            placeholder="MM"
            disabled={field.disabled}
          />
          <Input
            type="text"
            value={payment.expiryYear}
            onChange={(e) => handleChange('expiryYear', e.target.value)}
            placeholder="YY"
            disabled={field.disabled}
          />
          <Input
            type="text"
            value={payment.cvv}
            onChange={(e) => handleChange('cvv', e.target.value)}
            placeholder="CVV"
            disabled={field.disabled}
          />
        </div>
      </div>
    );
  },
  calculation: ({ field }: any) => {
    // Simplified calculation field
    const result = field.metadata?.formula ? eval(field.metadata.formula) : 0;
    
    return (
      <div className="p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">{field.label}</p>
        <p className="text-xl font-bold">{result}</p>
      </div>
    );
  },
  repeater: ({ field, value, onChange }: any) => {
    const [items, setItems] = useState(value || [{}]);
    
    const addItem = () => {
      const newItems = [...items, {}];
      setItems(newItems);
      onChange(newItems);
    };
    
    const removeItem = (index: number) => {
      const newItems = items.filter((_: any, i: number) => i !== index);
      setItems(newItems);
      onChange(newItems);
    };
    
    return (
      <div className="space-y-2">
        {items.map((_: any, index: number) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="flex-1">
              {/* Render repeater fields here */}
              <Input placeholder={`Item ${index + 1}`} />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
            >
              <FiX />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
        >
          <FiPlus className="mr-2" />
          Add Item
        </Button>
      </div>
    );
  },
  section: ({ field, children }: any) => (
    <Card className={field.metadata?.className} style={field.styling}>
      <CardHeader>
        <CardTitle>{field.label}</CardTitle>
        {field.metadata?.description && (
          <CardDescription>{field.metadata.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  ),
  tabs: ({ field, children }: any) => {
    const tabs = field.metadata?.tabs || [];
    
    return (
      <Tabs defaultValue={tabs[0]?.value} className={field.metadata?.className}>
        <TabsList>
          {tabs.map((tab: any) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab: any) => (
          <TabsContent key={tab.value} value={tab.value}>
            {children}
          </TabsContent>
        ))}
      </Tabs>
    );
  },
  accordion: ({ field, children }: any) => {
    const items = field.metadata?.items || [];
    
    return (
      <div className="space-y-2">
        {items.map((item: any, index: number) => (
          <details key={index} className="border rounded p-4">
            <summary className="cursor-pointer font-medium">{item.label}</summary>
            <div className="mt-2">{children}</div>
          </details>
        ))}
      </div>
    );
  },
  wizard: ({ field, children }: any) => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = field.metadata?.steps || [];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          {steps.map((step: any, index: number) => (
            <div
              key={index}
              className={cn(
                "flex items-center",
                index <= currentStep ? "text-blue-600" : "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200"
                )}
              >
                {index + 1}
              </div>
              <span className="ml-2">{step.label}</span>
            </div>
          ))}
        </div>
        <div>{children}</div>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            type="button"
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
};

// Form templates
const formTemplates: FormTemplate[] = [
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'Simple contact form with name, email, and message',
    category: 'Basic',
    icon: <FiMail />,
    fields: [],
    tags: ['contact', 'basic', 'email']
  },
  {
    id: 'registration',
    name: 'Registration Form',
    description: 'User registration with validation',
    category: 'Authentication',
    icon: <HiOutlineUserAdd />,
    fields: [],
    tags: ['registration', 'signup', 'authentication']
  },
  {
    id: 'survey',
    name: 'Customer Survey',
    description: 'Comprehensive customer satisfaction survey',
    category: 'Survey',
    icon: <RiSurveyLine />,
    fields: [],
    tags: ['survey', 'feedback', 'customer']
  },
  {
    id: 'application',
    name: 'Job Application',
    description: 'Complete job application form',
    category: 'HR',
    icon: <HiOutlineBriefcase />,
    fields: [],
    tags: ['job', 'application', 'hr', 'employment']
  },
  {
    id: 'order',
    name: 'Order Form',
    description: 'Product order form with payment',
    category: 'E-commerce',
    icon: <HiOutlineShoppingCart />,
    fields: [],
    tags: ['order', 'ecommerce', 'payment', 'shopping']
  },
  {
    id: 'feedback',
    name: 'Feedback Form',
    description: 'Collect user feedback and ratings',
    category: 'Feedback',
    icon: <HiOutlineAnnotation />,
    fields: [],
    tags: ['feedback', 'rating', 'review']
  },
  {
    id: 'appointment',
    name: 'Appointment Booking',
    description: 'Schedule appointments with date and time selection',
    category: 'Booking',
    icon: <FiCalendar />,
    fields: [],
    tags: ['appointment', 'booking', 'schedule', 'calendar']
  },
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    description: 'Email newsletter subscription form',
    category: 'Marketing',
    icon: <HiOutlineNewspaper />,
    fields: [],
    tags: ['newsletter', 'email', 'marketing', 'subscription']
  },
  {
    id: 'quiz',
    name: 'Quiz Form',
    description: 'Interactive quiz with scoring',
    category: 'Education',
    icon: <HiOutlineAcademicCap />,
    fields: [],
    tags: ['quiz', 'test', 'education', 'assessment']
  },
  {
    id: 'rsvp',
    name: 'Event RSVP',
    description: 'Event registration and RSVP form',
    category: 'Events',
    icon: <HiOutlineTicket />,
    fields: [],
    tags: ['rsvp', 'event', 'registration', 'invitation']
  }
];

// Main FormBuilder component
export default function FormBuilder() {
  const {
    currentPageIndex,
    pdfDocument,
    selectedTool,
    setSelectedTool,
    addFormField,
    updateFormField,
    removeFormField,
    formFields
  } = useEditorStore();

  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showFieldSettings, setShowFieldSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggedFieldType, setDraggedFieldType] = useState<FormFieldType | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('fields');

  // Field types grouped by category
  const fieldCategories = {
    'Basic Input': [
      { type: 'text', label: 'Text Field', icon: <FiType /> },
      { type: 'textarea', label: 'Text Area', icon: <FiAlignLeft /> },
      { type: 'number', label: 'Number', icon: <FiHash /> },
      { type: 'email', label: 'Email', icon: <FiMail /> },
      { type: 'phone', label: 'Phone', icon: <FiPhone /> },
      { type: 'url', label: 'URL', icon: <FiLink /> },
      { type: 'password', label: 'Password', icon: <FiLock /> }
    ],
    'Date & Time': [
      { type: 'date', label: 'Date', icon: <FiCalendar /> },
      { type: 'time', label: 'Time', icon: <FiClock /> },
      { type: 'datetime', label: 'Date & Time', icon: <FiCalendar /> }
    ],
    'Selection': [
      { type: 'select', label: 'Dropdown', icon: <FiChevronDown /> },
      { type: 'multiselect', label: 'Multi-Select', icon: <FiList /> },
      { type: 'checkbox', label: 'Checkbox', icon: <FiCheckSquare /> },
      { type: 'radio', label: 'Radio Button', icon: <FiCircle /> },
      { type: 'switch', label: 'Toggle Switch', icon: <FiToggleLeft /> }
    ],
    'Advanced': [
      { type: 'slider', label: 'Slider', icon: <FiSliders /> },
      { type: 'rating', label: 'Rating', icon: <FiStar /> },
      { type: 'file', label: 'File Upload', icon: <FiUpload /> },
      { type: 'image', label: 'Image Upload', icon: <FiImage /> },
      { type: 'signature', label: 'Signature', icon: <FiEdit3 /> },
      { type: 'color', label: 'Color Picker', icon: <HiColorSwatch /> },
      { type: 'range', label: 'Range Slider', icon: <FiSliders /> }
    ],
    'Special': [
      { type: 'captcha', label: 'CAPTCHA', icon: <FiShield /> },
      { type: 'qrcode', label: 'QR Code', icon: <HiQrcode /> },
      { type: 'barcode', label: 'Barcode', icon: <FiCode /> },
      { type: 'matrix', label: 'Matrix', icon: <FiGrid /> },
      { type: 'likert', label: 'Likert Scale', icon: <FiBarChart /> },
      { type: 'nps', label: 'NPS Score', icon: <FiTrendingUp /> },
      { type: 'address', label: 'Address', icon: <FiMapPin /> },
      { type: 'payment', label: 'Payment', icon: <FiCreditCard /> },
      { type: 'calculation', label: 'Calculation', icon: <HiCalculator /> }
    ],
    'Layout': [
      { type: 'section', label: 'Section', icon: <FiLayout /> },
      { type: 'tabs', label: 'Tabs', icon: <FiColumns /> },
      { type: 'accordion', label: 'Accordion', icon: <FiLayers /> },
      { type: 'wizard', label: 'Wizard', icon: <FiArrowRight /> },
      { type: 'repeater', label: 'Repeater', icon: <FiCopy /> },
      { type: 'divider', label: 'Divider', icon: <FiMinus /> },
      { type: 'heading', label: 'Heading', icon: <FiType /> },
      { type: 'paragraph', label: 'Paragraph', icon: <FiAlignLeft /> },
      { type: 'html', label: 'HTML Block', icon: <FiCode /> }
    ],
    'Actions': [
      { type: 'button', label: 'Button', icon: <FiSquare /> },
      { type: 'submit', label: 'Submit Button', icon: <FiSave /> },
      { type: 'reset', label: 'Reset Button', icon: <FiRefreshCw /> }
    ]
  };

  // Add field to PDF
  const handleAddField = (type: FormFieldType, position?: { x: number; y: number }) => {
    const field: FormField = {
      id: uuidv4(),
      type,
      name: `field_${Date.now()}`,
      label: `New ${type} field`,
      position: position || { x: 100, y: 100 },
      size: { width: 200, height: 40 },
      pageIndex: currentPageIndex,
      styling: {
        fontSize: 14,
        fontFamily: 'Arial',
        color: '#000000',
        backgroundColor: '#FFFFFF',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 4,
        padding: 8
      }
    };

    addFormField(field);
    setSelectedField(field);
    setShowFieldSettings(true);
    toast.success(`Added ${type} field`);
  };

  // Update field properties
  const handleUpdateField = (updates: Partial<FormField>) => {
    if (!selectedField) return;
    
    const updatedField = { ...selectedField, ...updates };
    updateFormField(updatedField.id, updates);
    setSelectedField(updatedField);
  };

  // Delete field
  const handleDeleteField = (fieldId: string) => {
    removeFormField(fieldId);
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
      setShowFieldSettings(false);
    }
    toast.success('Field deleted');
  };

  // Validate field
  const validateField = (field: FormField, value: any): string | null => {
    if (!field.validation) return null;

    if (field.validation.required && !value) {
      return field.validation.errorMessage || `${field.label} is required`;
    }

    if (field.validation.minLength && value.length < field.validation.minLength) {
      return field.validation.errorMessage || `Minimum length is ${field.validation.minLength}`;
    }

    if (field.validation.maxLength && value.length > field.validation.maxLength) {
      return field.validation.errorMessage || `Maximum length is ${field.validation.maxLength}`;
    }

    if (field.validation.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.errorMessage || 'Invalid format';
      }
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: Record<string, string> = {};
    let hasErrors = false;

    formFields.forEach(field => {
      const error = validateField(field, formValues[field.name]);
      if (error) {
        errors[field.name] = error;
        hasErrors = true;
      }
    });

    setValidationErrors(errors);

    if (!hasErrors) {
      console.log('Form submitted:', formValues);
      toast.success('Form submitted successfully!');
    } else {
      toast.error('Please fix the errors before submitting');
    }
  };

  // Apply template
  const applyTemplate = (template: FormTemplate) => {
    template.fields.forEach(field => {
      addFormField(field);
    });
    setShowTemplates(false);
    toast.success(`Applied ${template.name} template`);
  };

  // Export form configuration
  const exportFormConfig = () => {
    const config = {
      fields: formFields,
      values: formValues,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-config.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Form configuration exported');
  };

  // Import form configuration
  const importFormConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        config.fields.forEach((field: FormField) => {
          addFormField(field);
        });
        toast.success('Form configuration imported');
      } catch (error) {
        toast.error('Invalid configuration file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Field Library */}
      <div className="w-80 border-r bg-white dark:bg-gray-900 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {Object.entries(fieldCategories).map(([category, fields]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {fields.map((field) => (
                        <Button
                          key={field.type}
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => handleAddField(field.type as FormFieldType)}
                        >
                          {field.icon}
                          <span className="ml-2 text-xs">{field.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="templates" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {formTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => applyTemplate(template)}
                  >
                    <CardHeader className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {template.icon}
                          <div>
                            <CardTitle className="text-sm">{template.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {template.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="properties" className="flex-1 overflow-hidden">
            {selectedField ? (
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <div>
                    <Label>Field Type</Label>
                    <Badge variant="outline">{selectedField.type}</Badge>
                  </div>

                  <div>
                    <Label>Name</Label>
                    <Input
                      value={selectedField.name}
                      onChange={(e) => handleUpdateField({ name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Label</Label>
                    <Input
                      value={selectedField.label}
                      onChange={(e) => handleUpdateField({ label: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Placeholder</Label>
                    <Input
                      value={selectedField.placeholder || ''}
                      onChange={(e) => handleUpdateField({ placeholder: e.target.value })}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Validation</h4>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.required || false}
                        onCheckedChange={(checked) => handleUpdateField({ required: checked })}
                      />
                      <Label>Required</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.disabled || false}
                        onCheckedChange={(checked) => handleUpdateField({ disabled: checked })}
                      />
                      <Label>Disabled</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.readonly || false}
                        onCheckedChange={(checked) => handleUpdateField({ readonly: checked })}
                      />
                      <Label>Read Only</Label>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Styling</h4>
                    
                    <div>
                      <Label>Font Size</Label>
                      <Input
                        type="number"
                        value={selectedField.styling?.fontSize || 14}
                        onChange={(e) => handleUpdateField({
                          styling: { ...selectedField.styling, fontSize: parseInt(e.target.value) }
                        })}
                      />
                    </div>

                    <div>
                      <Label>Text Color</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <div
                              className="w-4 h-4 rounded mr-2"
                              style={{ backgroundColor: selectedField.styling?.color || '#000000' }}
                            />
                            {selectedField.styling?.color || '#000000'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-3">
                          <HexColorPicker
                            color={selectedField.styling?.color || '#000000'}
                            onChange={(color) => handleUpdateField({
                              styling: { ...selectedField.styling, color }
                            })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Background Color</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <div
                              className="w-4 h-4 rounded mr-2"
                              style={{ backgroundColor: selectedField.styling?.backgroundColor || '#FFFFFF' }}
                            />
                            {selectedField.styling?.backgroundColor || '#FFFFFF'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-3">
                          <HexColorPicker
                            color={selectedField.styling?.backgroundColor || '#FFFFFF'}
                            onChange={(color) => handleUpdateField({
                              styling: { ...selectedField.styling, backgroundColor: color }
                            })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDeleteField(selectedField.id)}
                  >
                    <FiTrash2 className="mr-2" />
                    Delete Field
                  </Button>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-sm">Select a field to edit properties</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        <div className="p-4 border-t space-y-2">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={exportFormConfig}
            >
              <FiDownload className="mr-2" />
              Export
            </Button>
            <label className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                asChild
              >
                <span>
                  <FiUpload className="mr-2" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={importFormConfig}
              />
            </label>
          </div>
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => toast.success('Form saved!')}
          >
            <FiSave className="mr-2" />
            Save Form
          </Button>
        </div>
      </div>

      {/* Right Panel - Form Preview */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-auto">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {formFields
              .filter(field => field.pageIndex === currentPageIndex)
              .map((field) => {
                const FieldComponent = fieldComponents[field.type];
                if (!FieldComponent) return null;

                return (
                  <div
                    key={field.id}
                    className={cn(
                      "relative group",
                      selectedField?.id === field.id && "ring-2 ring-blue-500 rounded"
                    )}
                    onClick={() => setSelectedField(field)}
                  >
                    {field.type !== 'hidden' && (
                      <Label className="mb-2 block">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    )}
                    <FieldComponent
                      field={field}
                      value={formValues[field.name]}
                      onChange={(value: any) => {
                        setFormValues({ ...formValues, [field.name]: value });
                        const error = validateField(field, value);
                        setValidationErrors({
                          ...validationErrors,
                          [field.name]: error || ''
                        });
                      }}
                    />
                    {validationErrors[field.name] && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors[field.name]}
                      </p>
                    )}
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteField(field.id);
                        }}
                      >
                        <FiTrash2 className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                );
              })}

            {formFields.filter(field => field.pageIndex === currentPageIndex).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FiLayout className="mx-auto text-4xl mb-4" />
                <p>No form fields on this page</p>
                <p className="text-sm mt-2">Add fields from the left panel to get started</p>
              </div>
            )}

            {formFields.filter(field => field.pageIndex === currentPageIndex).length > 0 && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="reset" variant="outline">
                  Reset
                </Button>
                <Button type="submit">
                  Submit Form
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}