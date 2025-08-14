'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { Tool, ToolCategory } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
  FONT_FAMILIES,
  PRESET_COLORS,
  HIGHLIGHT_COLORS,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  MIN_STROKE_WIDTH,
  MAX_STROKE_WIDTH,
  ZOOM_PRESETS,
  ANNOTATION_TYPES,
  FORM_FIELD_TYPES,
  SIGNATURE_TYPES,
  WATERMARK_POSITIONS
} from '@/lib/constants';
import {
  FiMousePointer,
  FiType,
  FiEdit3,
  FiSquare,
  FiCircle,
  FiMove,
  FiImage,
  FiPaperclip,
  FiCheckSquare,
  FiList,
  FiCalendar,
  FiMail,
  FiPhone,
  FiLink,
  FiDroplet,
  FiLayers,
  FiCopy,
  FiTrash2,
  FiRotateCw,
  FiRotateCcw,
  FiZoomIn,
  FiZoomOut,
  FiMaximize,
  FiGrid,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUnlock,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiBold,
  FiItalic,
  FiUnderline,
  FiSave,
  FiDownload,
  FiUpload,
  FiPrinter,
  FiShare2,
  FiSettings,
  FiHelpCircle,
  FiChevronDown,
  FiPlus,
  FiMinus,
  FiX,
  FiCheck,
  FiRefreshCw,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiScissors,
  FiCrop,
  FiSliders,
  FiPenTool,
  FiHighlighter,
  FiMessageSquare,
  FiBookmark,
  FiTag,
  FiStar,
  FiHeart,
  FiFlag,
  FiMapPin,
  FiNavigation,
  FiCompass,
  FiAnchor,
  FiTarget,
  FiCrosshair,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpLeft,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiArrowDownRight,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiBarChart,
  FiBarChart2,
  FiPieChart,
  FiPercent,
  FiDollarSign,
  FiHash,
  FiAtSign,
  FiCode,
  FiTerminal,
  FiGitBranch,
  FiGitCommit,
  FiGitMerge,
  FiGitPullRequest,
  FiCommand,
  FiCloud,
  FiDatabase,
  FiHardDrive,
  FiServer,
  FiWifi,
  FiCast,
  FiBluetooth,
  FiCpu,
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiWatch,
  FiCamera,
  FiMic,
  FiVideo,
  FiRadio,
  FiMusic,
  FiHeadphones,
  FiVolume,
  FiVolume1,
  FiVolume2,
  FiVolumeX,
  FiBell,
  FiBellOff,
  FiMessageCircle,
  FiSend,
  FiInbox,
  FiArchive,
  FiShield,
  FiKey,
  FiTool,
  FiPackage,
  FiShoppingCart,
  FiGift,
  FiAward,
  FiTrophy,
  FiMedal,
  FiZap,
  FiSun,
  FiMoon,
  FiCloudRain,
  FiCloudSnow,
  FiWind,
  FiThermometer,
  FiUmbrella,
  FiCoffee,
  FiFeather,
  FiPenTool as FiPen,
  FiEdit2
} from 'react-icons/fi';
import {
  HiOutlineDocumentText,
  HiOutlineDocumentAdd,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentRemove,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineTemplate,
  HiOutlineColorSwatch,
  HiOutlineSparkles,
  HiOutlineLightBulb,
  HiOutlinePuzzle,
  HiOutlineQrcode,
  HiOutlineFingerPrint,
  HiOutlineIdentification,
  HiOutlineClipboardList,
  HiOutlineClipboardCheck,
  HiOutlineClipboardCopy,
  HiOutlinePencilAlt,
  HiOutlineAnnotation,
  HiOutlineChatAlt2,
  HiOutlineSpeakerphone,
  HiOutlineVolumeUp,
  HiOutlinePhotograph,
  HiOutlineFilm,
  HiOutlineMusicNote,
  HiOutlineBookOpen,
  HiOutlineNewspaper,
  HiOutlineTicket,
  HiOutlineReceiptTax,
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineCalculator,
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlinePresentationChartBar,
  HiOutlinePresentationChartLine,
  HiOutlineScale,
  HiOutlineGlobeAlt,
  HiOutlineMap,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlineHome,
  HiOutlineLibrary,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineBeaker,
  HiOutlineLightningBolt,
  HiOutlineFire,
  HiOutlineSparkles as HiSparkles
} from 'react-icons/hi';
import {
  RiPencilLine,
  RiEraserLine,
  RiBrushLine,
  RiPaintBrushLine,
  RiPaletteLine,
  RiContrastDropLine,
  RiBlurOffLine,
  RiShape2Line,
  RiRectangleLine,
  RiCircleLine,
  RiTriangleLine,
  RiHexagonLine,
  RiPentagonLine,
  RiOctagonLine,
  RiStarLine,
  RiHeartLine,
  RiChat3Line,
  RiQuestionLine,
  RiInformationLine,
  RiErrorWarningLine,
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiAddCircleLine,
  RiIndeterminateCircleLine,
  RiCheckboxLine,
  RiCheckboxBlankLine,
  RiRadioButtonLine,
  RiToggleLine,
  RiInputMethodLine,
  RiInputCursorMove,
  RiFontSize,
  RiFontSize2,
  RiTextWrap,
  RiTextSpacing,
  RiLineHeight,
  RiAlignTop,
  RiAlignVertically,
  RiAlignBottom,
  RiSubscript,
  RiSuperscript,
  RiStrikethrough,
  RiCodeSSlashLine,
  RiDoubleQuotesL,
  RiSingleQuotesL,
  RiEmphasis,
  RiEnglishInput,
  RiTranslate,
  RiABLine,
  RiSortAsc,
  RiSortDesc,
  RiListOrdered,
  RiListUnordered,
  RiListCheck,
  RiListCheck2,
  RiIndentDecrease,
  RiIndentIncrease,
  RiPageSeparator,
  RiSeparator,
  RiSpaceLine,
  RiLineChartLine,
  RiBarChartLine,
  RiPieChartLine,
  RiDonutChartLine,
  RiBubbleChartLine,
  RiScatterChartLine,
  RiRadarChartLine,
  RiStackLine,
  RiFlowChart,
  RiMindMap,
  RiOrganizationChart,
  RiNodeTree,
  RiGitBranchLine,
  RiGitMergeLine,
  RiGitCommitLine,
  RiGitPullRequestLine,
  RiGitRepositoryLine,
  RiGitRepositoryCommitsLine,
  RiGitRepositoryPrivateLine,
  RiTimeLine,
  RiCalendarLine,
  RiCalendarEventLine,
  RiCalendarTodoLine,
  RiCalendarCheckLine,
  RiTodoLine,
  RiBookmarkLine,
  RiBookmark2Line,
  RiBookmark3Line,
  RiStickyNoteLine,
  RiStickyNote2Line,
  RiFileTextLine,
  RiFilePdfLine,
  RiFileWordLine,
  RiFileExcelLine,
  RiFilePpt2Line,
  RiFileImageLine,
  RiFileVideoLine,
  RiFileMusicLine,
  RiFileZipLine,
  RiFileCodeLine,
  RiFileCloudLine,
  RiFileDownloadLine,
  RiFileUploadLine,
  RiFileTransferLine,
  RiFileShredLine,
  RiFileLockLine,
  RiFileShieldLine,
  RiFileUserLine,
  RiFileSearchLine,
  RiFileSettingsLine,
  RiFileInfoLine,
  RiFileWarningLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiFolderAddLine,
  RiFolderReduceLine,
  RiFolderTransferLine,
  RiFolderLockLine,
  RiFolderShieldLine,
  RiFolderUserLine,
  RiFolderSettingsLine,
  RiFolderInfoLine,
  RiFolderWarningLine,
  RiAttachmentLine,
  RiLinkLine,
  RiLinkUnlinkLine,
  RiShareLine,
  RiShareBoxLine,
  RiShareForwardLine,
  RiSendPlaneLine,
  RiSendPlane2Line
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import * as Popover from '@radix-ui/react-popover';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Slider from '@radix-ui/react-slider';
import * as Switch from '@radix-ui/react-switch';
import * as Tabs from '@radix-ui/react-tabs';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Select from '@radix-ui/react-select';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Separator from '@radix-ui/react-separator';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import toast from 'react-hot-toast';

// Tool definitions
const TOOLS: Record<string, Tool> = {
  // Selection tools
  select: {
    id: 'select',
    name: 'Select',
    icon: 'FiMousePointer',
    category: 'select',
    shortcut: 'V',
    isActive: false,
    isEnabled: true,
    settings: {}
  },
  hand: {
    id: 'hand',
    name: 'Hand',
    icon: 'FiMove',
    category: 'navigation',
    shortcut: 'H',
    isActive: false,
    isEnabled: true,
    settings: {}
  },
  
  // Text tools
  text: {
    id: 'text',
    name: 'Add Text',
    icon: 'FiType',
    category: 'text',
    shortcut: 'T',
    isActive: false,
    isEnabled: true,
    settings: {
      fontSize: DEFAULT_FONT_SIZE,
      fontFamily: DEFAULT_FONT_FAMILY,
      color: DEFAULT_COLOR,
      bold: false,
      italic: false,
      underline: false,
      align: 'left'
    }
  },
  
  // Drawing tools
  pen: {
    id: 'pen',
    name: 'Pen',
    icon: 'RiPencilLine',
    category: 'draw',
    shortcut: 'P',
    isActive: false,
    isEnabled: true,
    settings: {
      color: DEFAULT_COLOR,
      strokeWidth: DEFAULT_STROKE_WIDTH,
      opacity: 1
    }
  },
  pencil: {
    id: 'pencil',
    name: 'Pencil',
    icon: 'FiEdit3',
    category: 'draw',
    shortcut: 'N',
    isActive: false,
    isEnabled: true,
    settings: {
      color: DEFAULT_COLOR,
      strokeWidth: 2,
      opacity: 0.8
    }
  },
  brush: {
    id: 'brush',
    name: 'Brush',
    icon: 'RiBrushLine',
    category: 'draw',
    shortcut: 'B',
    isActive: false,
    isEnabled: true,
    settings: {
      color: DEFAULT_COLOR,
      strokeWidth: 5,
      opacity: 0.6,
      smoothing: true
    }
  },
  eraser: {
    id: 'eraser',
    name: 'Eraser',
    icon: 'RiEraserLine',
    category: 'draw',
    shortcut: 'E',
    isActive: false,
    isEnabled: true,
    settings: {
      size: 10
    }
  },
  
  // Shape tools
  line: {
    id: 'line',
    name: 'Line',
    icon: 'RiSeparator',
    category: 'shape',
    shortcut: 'L',
    isActive: false,
    isEnabled: true,
    settings: {
      color: DEFAULT_COLOR,
      strokeWidth: DEFAULT_STROKE_WIDTH,
      strokeStyle: 'solid',
      arrowStart: false,
      arrowEnd: false
    }
  },
  arrow: {
    id: 'arrow',
    name: 'Arrow',
    icon: 'FiArrowUpRight',
    category: 'shape',
    shortcut: 'A',
    isActive: false,
    isEnabled: true,
    settings: {
      color: DEFAULT_COLOR,
      strokeWidth: DEFAULT_STROKE_WIDTH,
      arrowStyle: 'standard'
    }
  },
  rectangle: {
    id: 'rectangle',
    name: 'Rectangle',
    icon: 'FiSquare',
    category: 'shape',
    shortcut: 'R',
    isActive: false,
    isEnabled: true,
    settings: {
      strokeColor: DEFAULT_COLOR,
      fillColor: 'transparent',
      strokeWidth: DEFAULT_STROKE_WIDTH,
      cornerRadius: 0
    }
  },
  circle: {
    id: 'circle',
    name: 'Circle',
    icon: 'FiCircle',
    category: 'shape',
    shortcut: 'C',
    isActive: false,
    isEnabled: true,
    settings: {
      strokeColor: DEFAULT_COLOR,
      fillColor: 'transparent',
      strokeWidth: DEFAULT_STROKE_WIDTH
    }
  },
  triangle: {
    id: 'triangle',
    name: 'Triangle',
    icon: 'RiTriangleLine',
    category: 'shape',
    isActive: false,
    isEnabled: true,
    settings: {
      strokeColor: DEFAULT_COLOR,
      fillColor: 'transparent',
      strokeWidth: DEFAULT_STROKE_WIDTH
    }
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    icon: 'RiHexagonLine',
    category: 'shape',
    isActive: false,
    isEnabled: true,
    settings: {
      strokeColor: DEFAULT_COLOR,
      fillColor: 'transparent',
      strokeWidth: DEFAULT_STROKE_WIDTH,
      sides: 6
    }
  },
  star: {
    id: 'star',
    name: 'Star',
    icon: 'RiStarLine',
    category: 'shape',
    isActive: false,
    isEnabled: true,
    settings: {
      strokeColor: DEFAULT_COLOR,
      fillColor: 'transparent',
      strokeWidth: DEFAULT_STROKE_WIDTH,
      points: 5
    }
  },
  
  // Annotation tools
  highlight: {
    id: 'highlight',
    name: 'Highlight',
    icon: 'FiHighlighter',
    category: 'annotation',
    shortcut: 'H',
    isActive: false,
    isEnabled: true,
    settings: {
      color: '#FFFF00',
      opacity: 0.5
    }
  },
  underline: {
    id: 'underline',
    name: 'Underline',
    icon: 'FiUnderline',
    category: 'annotation',
    isActive: false,
    isEnabled: true,
    settings: {
      color: DEFAULT_COLOR,
      thickness: 2
    }
  },
  strikethrough: {
    id: 'strikethrough',
    name: 'Strikethrough',
    icon: 'RiStrikethrough',
    category: 'annotation',
    isActive: false,
    isEnabled: true,
    settings: {
      color: DEFAULT_COLOR,
      thickness: 2
    }
  },
  note: {
    id: 'note',
    name: 'Sticky Note',
    icon: 'RiStickyNoteLine',
    category: 'annotation',
    shortcut: 'N',
    isActive: false,
    isEnabled: true,
    settings: {
      color: '#FFFF00',
      author: '',
      icon: 'note'
    }
  },
  comment: {
    id: 'comment',
    name: 'Comment',
    icon: 'FiMessageSquare',
    category: 'annotation',
    isActive: false,
    isEnabled: true,
    settings: {
      author: '',
      color: '#FFA500'
    }
  },
  
  // Form tools
  textField: {
    id: 'textField',
    name: 'Text Field',
    icon: 'RiInputMethodLine',
    category: 'form',
    isActive: false,
    isEnabled: true,
    settings: {
      name: '',
      placeholder: '',
      required: false,
      multiline: false,
      maxLength: null
    }
  },
  checkbox: {
    id: 'checkbox',
    name: 'Checkbox',
    icon: 'FiCheckSquare',
    category: 'form',
    isActive: false,
    isEnabled: true,
    settings: {
      name: '',
      label: '',
      required: false,
      defaultChecked: false
    }
  },
  radio: {
    id: 'radio',
    name: 'Radio Button',
    icon: 'RiRadioButtonLine',
    category: 'form',
    isActive: false,
    isEnabled: true,
    settings: {
      name: '',
      groupName: '',
      label: '',
      required: false
    }
  },
  dropdown: {
    id: 'dropdown',
    name: 'Dropdown',
    icon: 'FiList',
    category: 'form',
    isActive: false,
    isEnabled: true,
    settings: {
      name: '',
      options: [],
      required: false,
      defaultValue: ''
    }
  },
  datePicker: {
    id: 'datePicker',
    name: 'Date Picker',
    icon: 'FiCalendar',
    category: 'form',
    isActive: false,
    isEnabled: true,
    settings: {
      name: '',
      format: 'MM/DD/YYYY',
      required: false
    }
  },
  signature: {
    id: 'signature',
    name: 'Signature Field',
    icon: 'RiPenNibLine',
    category: 'form',
    isActive: false,
    isEnabled: true,
    settings: {
      name: '',
      required: false
    }
  },
  
  // Image tools
  image: {
    id: 'image',
    name: 'Insert Image',
    icon: 'FiImage',
    category: 'image',
    isActive: false,
    isEnabled: true,
    settings: {}
  },
  
  // Signature tools
  drawSignature: {
    id: 'drawSignature',
    name: 'Draw Signature',
    icon: 'RiPencilLine',
    category: 'signature',
    isActive: false,
    isEnabled: true,
    settings: {
      color: DEFAULT_COLOR,
      strokeWidth: 2
    }
  },
  typeSignature: {
    id: 'typeSignature',
    name: 'Type Signature',
    icon: 'FiType',
    category: 'signature',
    isActive: false,
    isEnabled: true,
    settings: {
      fontFamily: 'Dancing Script',
      fontSize: 24,
      color: DEFAULT_COLOR
    }
  },
  uploadSignature: {
    id: 'uploadSignature',
    name: 'Upload Signature',
    icon: 'FiUpload',
    category: 'signature',
    isActive: false,
    isEnabled: true,
    settings: {}
  },
  
  // Watermark tools
  watermark: {
    id: 'watermark',
    name: 'Watermark',
    icon: 'FiDroplet',
    category: 'annotation',
    isActive: false,
    isEnabled: true,
    settings: {
      text: '',
      position: 'center',
      rotation: 45,
      opacity: 0.3,
      color: '#000000',
      fontSize: 48
    }
  },
  
  // Stamp tools
  stamp: {
    id: 'stamp',
    name: 'Stamp',
    icon: 'RiStampLine',
    category: 'annotation',
    isActive: false,
    isEnabled: true,
    settings: {
      type: 'approved',
      color: '#00AA00',
      text: 'APPROVED'
    }
  },
  
  // Measurement tools
  ruler: {
    id: 'ruler',
    name: 'Ruler',
    icon: 'RiRulerLine',
    category: 'measure',
    isActive: false,
    isEnabled: true,
    settings: {
      unit: 'px',
      showLabel: true
    }
  },
  area: {
    id: 'area',
    name: 'Area',
    icon: 'RiShape2Line',
    category: 'measure',
    isActive: false,
    isEnabled: true,
    settings: {
      unit: 'px²',
      showLabel: true
    }
  },
  perimeter: {
    id: 'perimeter',
    name: 'Perimeter',
    icon: 'RiRectangleLine',
    category: 'measure',
    isActive: false,
    isEnabled: true,
    settings: {
      unit: 'px',
      showLabel: true
    }
  }
};

// Tool groups for organization
const TOOL_GROUPS = [
  {
    id: 'selection',
    name: 'Selection',
    tools: ['select', 'hand']
  },
  {
    id: 'text',
    name: 'Text',
    tools: ['text']
  },
  {
    id: 'drawing',
    name: 'Drawing',
    tools: ['pen', 'pencil', 'brush', 'eraser']
  },
  {
    id: 'shapes',
    name: 'Shapes',
    tools: ['line', 'arrow', 'rectangle', 'circle', 'triangle', 'polygon', 'star']
  },
  {
    id: 'annotations',
    name: 'Annotations',
    tools: ['highlight', 'underline', 'strikethrough', 'note', 'comment', 'stamp', 'watermark']
  },
  {
    id: 'forms',
    name: 'Form Fields',
    tools: ['textField', 'checkbox', 'radio', 'dropdown', 'datePicker', 'signature']
  },
  {
    id: 'images',
    name: 'Images',
    tools: ['image']
  },
  {
    id: 'signatures',
    name: 'Signatures',
    tools: ['drawSignature', 'typeSignature', 'uploadSignature']
  },
  {
    id: 'measurement',
    name: 'Measurement',
    tools: ['ruler', 'area', 'perimeter']
  }
];

interface ToolbarProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  className,
  orientation = 'horizontal',
  showLabels = false,
  collapsible = false,
  defaultCollapsed = false
}) => {
  const {
    currentTool,
    setCurrentTool,
    updateToolSettings,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    zoomToWidth,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDocument,
    exportDocument,
    toggleGrid,
    toggleSnapToGrid,
    toggleRulers,
    toggleGuides,
    gridEnabled,
    snapToGrid,
    rulersEnabled,
    guidesEnabled,
    isDirty,
    isSaving
  } = useEditorStore();
  
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeSettings, setShowStrokeSettings] = useState(false);
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [showViewOptions, setShowViewOptions] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
  const [selectedFontSize, setSelectedFontSize] = useState(DEFAULT_FONT_SIZE);
  const [selectedFontFamily, setSelectedFontFamily] = useState(DEFAULT_FONT_FAMILY);
  const [searchQuery, setSearchQuery] = useState('');
  
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const strokeSettingsRef = useRef<HTMLDivElement>(null);
  const fontSettingsRef = useRef<HTMLDivElement>(null);
  
  // Filter tools based on search
  const filteredTools = useMemo(() => {
    if (!searchQuery) return TOOL_GROUPS;
    
    const query = searchQuery.toLowerCase();
    return TOOL_GROUPS.map(group => ({
      ...group,
      tools: group.tools.filter(toolId => {
        const tool = TOOLS[toolId];
        return tool.name.toLowerCase().includes(query) ||
               tool.category.toLowerCase().includes(query);
      })
    })).filter(group => group.tools.length > 0);
  }, [searchQuery]);
  
  // Handle tool selection
  const handleToolSelect = useCallback((toolId: string) => {
    const tool = TOOLS[toolId];
    if (!tool || !tool.isEnabled) return;
    
    setCurrentTool(tool);
    
    // Update default settings based on tool
    if (tool.settings?.color) {
      setSelectedColor(tool.settings.color);
    }
    if (tool.settings?.strokeWidth) {
      setSelectedStrokeWidth(tool.settings.strokeWidth);
    }
    if (tool.settings?.fontSize) {
      setSelectedFontSize(tool.settings.fontSize);
    }
    if (tool.settings?.fontFamily) {
      setSelectedFontFamily(tool.settings.fontFamily);
    }
    
    // Show relevant settings panel
    if (tool.category === 'text') {
      setShowFontSettings(true);
      setShowStrokeSettings(false);
    } else if (tool.category === 'draw' || tool.category === 'shape') {
      setShowStrokeSettings(true);
      setShowFontSettings(false);
    }
    
    toast.success(`Selected ${tool.name} tool`);
  }, [setCurrentTool]);
  
  // Handle color change
  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
    if (currentTool) {
      updateToolSettings({ color });
    }
  }, [currentTool, updateToolSettings]);
  
  // Handle stroke width change
  const handleStrokeWidthChange = useCallback((width: number) => {
    setSelectedStrokeWidth(width);
    if (currentTool) {
      updateToolSettings({ strokeWidth: width });
    }
  }, [currentTool, updateToolSettings]);
  
  // Handle font size change
  const handleFontSizeChange = useCallback((size: number) => {
    setSelectedFontSize(size);
    if (currentTool) {
      updateToolSettings({ fontSize: size });
    }
  }, [currentTool, updateToolSettings]);
  
  // Handle font family change
  const handleFontFamilyChange = useCallback((family: string) => {
    setSelectedFontFamily(family);
    if (currentTool) {
      updateToolSettings({ fontFamily: family });
    }
  }, [currentTool, updateToolSettings]);
  
  // Handle save
  const handleSave = useCallback(async () => {
    try {
      await saveDocument();
      toast.success('Document saved successfully');
    } catch (error) {
      toast.error('Failed to save document');
      console.error('Save error:', error);
    }
  }, [saveDocument]);
  
  // Handle export
  const handleExport = useCallback(async (format: string) => {
    try {
      await exportDocument(format);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export document');
      console.error('Export error:', error);
    }
  }, [exportDocument]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if input is focused
      if (document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      // Tool shortcuts
      Object.values(TOOLS).forEach(tool => {
        if (tool.shortcut && e.key.toUpperCase() === tool.shortcut) {
          e.preventDefault();
          handleToolSelect(tool.id);
        }
      });
      
      // Save shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // Undo/Redo shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo()) redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToolSelect, handleSave, undo, redo, canUndo, canRedo]);
  
  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
      if (strokeSettingsRef.current && !strokeSettingsRef.current.contains(e.target as Node)) {
        setShowStrokeSettings(false);
      }
      if (fontSettingsRef.current && !fontSettingsRef.current.contains(e.target as Node)) {
        setShowFontSettings(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Get icon component
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      FiMousePointer,
      FiType,
      FiEdit3,
      FiSquare,
      FiCircle,
      FiMove,
      FiImage,
      FiCheckSquare,
      FiList,
      FiCalendar,
      FiDroplet,
      FiHighlighter,
      FiMessageSquare,
      FiUnderline,
      FiUpload,
      RiPencilLine,
      RiEraserLine,
      RiBrushLine,
      RiSeparator,
      RiTriangleLine,
      RiHexagonLine,
      RiStarLine,
      RiStickyNoteLine,
      RiStrikethrough,
      RiInputMethodLine,
      RiRadioButtonLine,
      RiPenNibLine,
      RiStampLine,
      RiRulerLine,
      RiShape2Line,
      RiRectangleLine
    };
    
    const Icon = icons[iconName] || FiCircle;
    return <Icon className="w-4 h-4" />;
  };
  
  // Render tool button
  const renderToolButton = (toolId: string) => {
    const tool = TOOLS[toolId];
    if (!tool) return null;
    
    const isActive = currentTool?.id === tool.id;
    
    return (
      <Tooltip.Provider key={tool.id}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                isActive && 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
                !tool.isEnabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => handleToolSelect(tool.id)}
              disabled={!tool.isEnabled}
            >
              {getIconComponent(tool.icon)}
              {showLabels && (
                <span className="ml-2 text-xs">{tool.name}</span>
              )}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-gray-900 text-white px-2 py-1 rounded text-xs"
              sideOffset={5}
            >
              {tool.name}
              {tool.shortcut && (
                <span className="ml-2 opacity-75">({tool.shortcut})</span>
              )}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  };
  
  // Render tool group
  const renderToolGroup = (group: typeof TOOL_GROUPS[0]) => {
    const hasTools = group.tools.length > 0;
    if (!hasTools) return null;
    
    return (
      <div key={group.id} className="space-y-1">
        <button
          className={cn(
            'w-full text-left px-3 py-1 text-xs font-medium text-gray-500',
            'hover:text-gray-700 dark:hover:text-gray-300',
            'transition-colors duration-200'
          )}
          onClick={() => setActiveGroup(activeGroup === group.id ? null : group.id)}
        >
          <div className="flex items-center justify-between">
            <span>{group.name}</span>
            <FiChevronDown
              className={cn(
                'w-3 h-3 transition-transform duration-200',
                activeGroup === group.id && 'transform rotate-180'
              )}
            />
          </div>
        </button>
        
        <AnimatePresence>
          {(activeGroup === group.id || !collapsible) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'grid gap-1',
                orientation === 'horizontal' ? 'grid-flow-col' : 'grid-cols-2'
              )}
            >
              {group.tools.map(toolId => renderToolButton(toolId))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
        'shadow-sm',
        orientation === 'horizontal' ? 'h-auto' : 'w-64',
        isCollapsed && orientation === 'vertical' && 'w-16',
        className
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            'font-semibold text-sm',
            isCollapsed && 'hidden'
          )}>
            Tools
          </h3>
          
          <div className="flex items-center gap-2">
            {/* Search */}
            {!isCollapsed && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <FiX className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
            )}
            
            {/* Collapse toggle */}
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <FiChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform',
                    isCollapsed && orientation === 'vertical' && '-rotate-90'
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={!canUndo()}
            className={cn(
              'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="Undo (Ctrl+Z)"
          >
            <FiCornerUpLeft className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className={cn(
              'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="Redo (Ctrl+Y)"
          >
            <FiCornerUpRight className="w-4 h-4" />
          </button>
          
          <Separator.Root className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className={cn(
              'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isDirty && 'text-orange-500'
            )}
            title="Save (Ctrl+S)"
          >
            {isSaving ? (
              <FiRefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FiSave className="w-4 h-4" />
            )}
          </button>
          
          {/* Export menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Export"
              >
                <FiDownload className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 min-w-[150px]"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleExport('pdf')}
                >
                  Export as PDF
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleExport('png')}
                >
                  Export as PNG
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleExport('jpg')}
                >
                  Export as JPG
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                <DropdownMenu.Item
                  className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleExport('docx')}
                >
                  Export as Word
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          
          <Separator.Root className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Zoom Out"
          >
            <FiZoomOut className="w-4 h-4" />
          </button>
          
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="px-2 py-1 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded min-w-[60px]"
                title="Zoom Level"
              >
                {Math.round(zoom * 100)}%
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2"
                sideOffset={5}
              >
                {ZOOM_PRESETS.map(preset => (
                  <DropdownMenu.Item
                    key={preset}
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => setZoom(preset)}
                  >
                    {Math.round(preset * 100)}%
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                <DropdownMenu.Item
                  className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={zoomToFit}
                >
                  Fit to Page
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={zoomToWidth}
                >
                  Fit to Width
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          
          <button
            onClick={zoomIn}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Zoom In"
          >
            <FiZoomIn className="w-4 h-4" />
          </button>
          
          <Separator.Root className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* View options */}
          <button
            onClick={toggleGrid}
            className={cn(
              'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
              gridEnabled && 'bg-blue-100 dark:bg-blue-900 text-blue-600'
            )}
            title="Toggle Grid"
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            onClick={toggleRulers}
            className={cn(
              'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
              rulersEnabled && 'bg-blue-100 dark:bg-blue-900 text-blue-600'
            )}
            title="Toggle Rulers"
          >
            <RiRulerLine className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Color and stroke settings */}
      {(currentTool?.category === 'draw' || 
        currentTool?.category === 'shape' || 
        currentTool?.category === 'text' ||
        currentTool?.category === 'annotation') && !isCollapsed && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            {/* Color picker */}
            <div className="relative" ref={colorPickerRef}>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Color
              </label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="flex gap-1">
                  {PRESET_COLORS.slice(0, 8).map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3">
                  <HexColorPicker
                    color={selectedColor}
                    onChange={handleColorChange}
                  />
                  <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-8 gap-1">
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    {currentTool?.category === 'annotation' && (
                      <div className="grid grid-cols-8 gap-1">
                        {HIGHLIGHT_COLORS.map(color => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Stroke width */}
            {(currentTool?.category === 'draw' || currentTool?.category === 'shape') && (
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Stroke Width
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-32 h-5"
                    value={[selectedStrokeWidth]}
                    onValueChange={([value]) => handleStrokeWidthChange(value)}
                    min={MIN_STROKE_WIDTH}
                    max={MAX_STROKE_WIDTH}
                    step={0.5}
                  >
                    <Slider.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-1">
                      <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-500 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </Slider.Root>
                  <span className="text-xs font-medium w-8">
                    {selectedStrokeWidth}
                  </span>
                </div>
              </div>
            )}
            
            {/* Font settings */}
            {currentTool?.category === 'text' && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Font Family
                  </label>
                  <Select.Root
                    value={selectedFontFamily}
                    onValueChange={handleFontFamilyChange}
                  >
                    <Select.Trigger className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-between">
                      <Select.Value />
                      <Select.Icon>
                        <FiChevronDown className="w-3 h-3" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 max-h-60 overflow-auto">
                        <Select.Viewport>
                          {FONT_FAMILIES.map(font => (
                            <Select.Item
                              key={font}
                              value={font}
                              className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                            >
                              <Select.ItemText style={{ fontFamily: font }}>
                                {font}
                              </Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Font Size
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleFontSizeChange(Math.max(MIN_FONT_SIZE, selectedFontSize - 1))}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      <FiMinus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={selectedFontSize}
                      onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                      className="w-12 px-1 py-0.5 text-xs text-center border border-gray-300 dark:border-gray-600 rounded"
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                    />
                    <button
                      onClick={() => handleFontSizeChange(Math.min(MAX_FONT_SIZE, selectedFontSize + 1))}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      <FiPlus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateToolSettings({ bold: !currentTool?.settings?.bold })}
                    className={cn(
                      'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                      currentTool?.settings?.bold && 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                    )}
                  >
                    <FiBold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateToolSettings({ italic: !currentTool?.settings?.italic })}
                    className={cn(
                      'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                      currentTool?.settings?.italic && 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                    )}
                  >
                    <FiItalic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateToolSettings({ underline: !currentTool?.settings?.underline })}
                    className={cn(
                      'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                      currentTool?.settings?.underline && 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                    )}
                  >
                    <FiUnderline className="w-4 h-4" />
                  </button>
                  <Separator.Root className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                  <button
                    onClick={() => updateToolSettings({ align: 'left' })}
                    className={cn(
                      'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                      currentTool?.settings?.align === 'left' && 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                    )}
                  >
                    <FiAlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateToolSettings({ align: 'center' })}
                    className={cn(
                      'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                      currentTool?.settings?.align === 'center' && 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                    )}
                  >
                    <FiAlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateToolSettings({ align: 'right' })}
                    className={cn(
                      'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                      currentTool?.settings?.align === 'right' && 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                    )}
                  >
                    <FiAlignRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateToolSettings({ align: 'justify' })}
                    className={cn(
                      'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                      currentTool?.settings?.align === 'justify' && 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                    )}
                  >
                    <FiAlignJustify className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Tools */}
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full p-3">
          <div className="space-y-4">
            {filteredTools.map(group => renderToolGroup(group))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-800 transition-colors duration-150 ease-out hover:bg-gray-200 dark:hover:bg-gray-700 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-400 dark:bg-gray-600 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      
      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {currentTool ? `Active: ${currentTool.name}` : 'Select a tool'}
            </span>
            <button
              onClick={() => toast.info('Keyboard shortcuts:\nV - Select\nT - Text\nP - Pen\nR - Rectangle\nC - Circle')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <FiHelpCircle className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;