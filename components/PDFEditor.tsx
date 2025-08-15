'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { PDFManager } from '@/lib/pdf/pdf-manager';
import PDFViewer from '@/components/pdf/PDFViewer';
import Toolbar from '@/components/pdf/Toolbar';
import Sidebar from '@/components/pdf/Sidebar';
import { cn } from '@/lib/utils/index';
import { 
  APP_NAME,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  KEYBOARD_SHORTCUTS,
  FEATURE_FLAGS
} from '@/lib/constants/index';
import {
  FiMenu,
  FiX,
  FiMaximize,
  FiMinimize,
  FiSettings,
  FiHelpCircle,
  FiSearch,
  FiDownload,
  FiUpload,
  FiSave,
  FiPrinter,
  FiShare2,
  FiCopy,
  FiClipboard,
  FiRefreshCw,
  FiZoomIn,
  FiZoomOut,
  FiGrid,
  FiLayers,
  FiSidebar,
  FiLayout,
  FiCommand,
  FiCloud,
  FiCloudOff,
  FiWifi,
  FiWifiOff,
  FiBell,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiHome,
  FiFileText,
  FiFilePlus,
  FiFolder,
  FiFolderPlus,
  FiEdit,
  FiEdit2,
  FiEdit3,
  FiTrash,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiEye,
  FiEyeOff,
  FiSun,
  FiMoon,
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
  FiXCircle,
  FiClock,
  FiCalendar,
  FiBookmark,
  FiTag,
  FiHash,
  FiAtSign,
  FiDollarSign,
  FiPercent,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart,
  FiPieChart,
  FiCpu,
  FiDatabase,
  FiServer,
  FiGitBranch,
  FiGitCommit,
  FiGitMerge,
  FiGitPullRequest,
  FiGithub,
  FiGitlab,
  FiPackage,
  FiCode,
  FiTerminal,
  FiZap,
  FiShield,
  FiKey,
  FiMail,
  FiMessageCircle,
  FiMessageSquare,
  FiPhone,
  FiVideo,
  FiMic,
  FiHeadphones,
  FiVolume,
  FiVolume1,
  FiVolume2,
  FiVolumeX,
  FiPlay,
  FiPause,
  FiSkipForward,
  FiSkipBack,
  FiFastForward,
  FiRewind,
  FiCast,
  FiAirplay,
  FiBluetooth,
  FiWifiOff as FiWifiDisabled,
  FiCompass,
  FiMap,
  FiMapPin,
  FiNavigation,
  FiCrosshair,
  FiTarget,
  FiFlag,
  FiAnchor,
  FiSend,
  FiInbox,
  FiArchive,
  FiPaperclip,
  FiLink,
  FiLink2,
  FiExternalLink,
  FiImage,
  FiCamera,
  FiFilm,
  FiMusic,
  FiRadio,
  FiDisc,
  FiHardDrive,
  FiCreditCard,
  FiShoppingCart,
  FiShoppingBag,
  FiGift,
  FiAward,
  FiStar,
  FiHeart,
  FiThumbsUp,
  FiThumbsDown,
  FiUserPlus,
  FiUserMinus,
  FiUserCheck,
  FiUserX,
  FiUsers,
  FiBriefcase,
  FiCloudRain,
  FiCloudSnow,
  FiWind,
  FiDroplet,
  FiThermometer,
  FiUmbrella,
  FiCoffee,
  FiFeather,
  FiBattery,
  FiBatteryCharging,
  FiPower,
  FiToggleLeft,
  FiToggleRight,
  FiSliders,
  FiTool,
  FiPenTool,
  FiScissors,
  FiCrop,
  FiFilter,
  FiLoader,
  FiMoreHorizontal,
  FiMoreVertical,
  FiPlusCircle,
  FiMinusCircle,
  FiCheckSquare,
  FiSquare,
  FiCircle,
  FiTriangle,
  FiHexagon,
  FiOctagon,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpLeft,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiArrowDownRight,
  FiChevronsUp,
  FiChevronsDown,
  FiChevronsLeft,
  FiChevronsRight,
  FiNavigation2,
  FiMove,
  FiRotateCw,
  FiRotateCcw,
  FiRepeat,
  FiShuffle,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiColumns,
  FiType,
  FiBold,
  FiItalic,
  FiUnderline
} from 'react-icons/fi';
import {
  RiMenuLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiNotification3Line,
  RiSearchLine,
  RiSearchEyeLine,
  RiFindReplaceLine,
  RiZoomInLine,
  RiZoomOutLine,
  RiFocusLine,
  RiFocusMode,
  RiPictureInPictureLine,
  RiPictureInPictureExitLine,
  RiSplitCellsHorizontal,
  RiSplitCellsVertical,
  RiLayoutLine,
  RiLayoutGridLine,
  RiLayoutMasonryLine,
  RiLayoutColumnLine,
  RiLayoutRowLine,
  RiDashboardLine,
  RiAppsLine,
  RiApps2Line,
  RiStackLine,
  RiSideBarLine,
  RiSideBarFill,
  RiPageSeparator,
  RiPagesLine,
  RiFileCopyLine,
  RiFileAddLine,
  RiFileReduceLine,
  RiFileShredLine,
  RiFileDownloadLine,
  RiFileUploadLine,
  RiFileTransferLine,
  RiFilePdfLine,
  RiFileWordLine,
  RiFileExcelLine,
  RiFilePpt2Line,
  RiFileImageLine,
  RiFileVideoLine,
  RiFileMusicLine,
  RiFileZipLine,
  RiFileCodeLine,
  RiFileTextLine,
  RiFileListLine,
  RiFileHistoryLine,
  RiFileSearchLine,
  RiFileSettingsLine,
  RiFileLockLine,
  RiFileShieldLine,
  RiFileWarningLine,
  RiFileInfoLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiFolderAddLine,
  RiFolderReduceLine,
  RiFolderTransferLine,
  RiFolderLockLine,
  RiFolderShieldLine,
  RiFolderWarningLine,
  RiFolderInfoLine,
  RiBookmarkLine,
  RiBookmark2Line,
  RiBookmark3Line,
  RiPriceTag3Line,
  RiHashtag,
  RiAtLine,
  RiPercentLine,
  RiMoneyDollarCircleLine,
  RiStockLine,
  RiLineChartLine,
  RiBarChartLine,
  RiPieChartLine,
  RiBubbleChartLine,
  RiDonutChartLine,
  RiDatabaseLine,
  RiServerLine,
  RiCloudLine,
  RiCloudOffLine,
  RiHardDriveLine,
  RiCpuLine,
  RiComputerLine,
  RiSmartphoneLine,
  RiTabletLine,
  RiDeviceLine,
  RiQrCodeLine,
  RiBarcodeLine,
  RiScanLine,
  RiFingerprintLine,
  RiShieldLine,
  RiShieldCheckLine,
  RiShieldKeyholeLine,
  RiLockLine,
  RiLockUnlockLine,
  RiKeyLine,
  RiKey2Line,
  RiSafeLine,
  RiAlarmWarningLine,
  RiErrorWarningLine,
  RiSpamLine,
  RiBugLine,
  RiVirusLine,
  RiShieldCrossLine,
  RiShieldFlashLine,
  RiShieldStarLine,
  RiShieldUserLine,
  RiUserLine,
  RiUserAddLine,
  RiUserUnfollowLine,
  RiUserFollowLine,
  RiUserSharedLine,
  RiUserReceivedLine,
  RiUserSearchLine,
  RiUserSettingsLine,
  RiUserSmileLine,
  RiUserHeartLine,
  RiUserStarLine,
  RiUserVoiceLine,
  RiGroupLine,
  RiTeamLine,
  RiContactsLine,
  RiProfileLine,
  RiAccountCircleLine,
  RiAdminLine,
  RiParentLine,
  RiCommunityLine,
  RiGovernmentLine,
  RiHomeLine,
  RiHome2Line,
  RiHome3Line,
  RiHome4Line,
  RiHome5Line,
  RiHome6Line,
  RiHome7Line,
  RiHome8Line,
  RiHomeGearLine,
  RiHomeHeartLine,
  RiHomeSmileLine,
  RiHomeWifiLine,
  RiBuildingLine,
  RiBuilding2Line,
  RiBuilding3Line,
  RiBuilding4Line,
  RiAncientGateLine,
  RiAncientPavilionLine,
  RiBankLine,
  RiGovernmentFill,
  RiHospitalLine,
  RiHotelLine,
  RiStoreLine,
  RiStore2Line,
  RiStore3Line,
  RiSchoolLine,
  RiCommunityFill
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as Menubar from '@radix-ui/react-menubar';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Popover from '@radix-ui/react-popover';
import * as Progress from '@radix-ui/react-progress';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Separator from '@radix-ui/react-separator';
import * as Tabs from '@radix-ui/react-tabs';
import * as Toggle from '@radix-ui/react-toggle';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Avatar from '@radix-ui/react-avatar';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface PDFEditorProps {
  className?: string;
  initialFile?: File | string;
  onSave?: (data: Blob) => void;
  onExport?: (data: Blob, format: string) => void;
  readOnly?: boolean;
  showToolbar?: boolean;
  showSidebar?: boolean;
  showStatusBar?: boolean;
  showMenuBar?: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}

interface EditorLayout {
  sidebarLeft: boolean;
  sidebarRight: boolean;
  sidebarLeftWidth: number;
  sidebarRightWidth: number;
  toolbarPosition: 'top' | 'bottom' | 'left' | 'right';
  statusBarVisible: boolean;
  menuBarVisible: boolean;
  fullscreen: boolean;
  zenMode: boolean;
}

interface EditorPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoSave: boolean;
  autoSaveInterval: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  showGuides: boolean;
  highlightActiveLayer: boolean;
  smoothScrolling: boolean;
  hardwareAcceleration: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  cursorStyle: 'default' | 'crosshair' | 'pointer';
  wheelZoom: boolean;
  touchGestures: boolean;
  keyboardShortcuts: boolean;
  soundEffects: boolean;
  notifications: boolean;
  analytics: boolean;
  crashReports: boolean;
}

interface RecentFile {
  id: string;
  name: string;
  path: string;
  size: number;
  lastModified: Date;
  thumbnail?: string;
}

export const PDFEditor: React.FC<PDFEditorProps> = ({
  className,
  initialFile,
  onSave,
  onExport,
  readOnly = false,
  showToolbar = true,
  showSidebar = true,
  showStatusBar = true,
  showMenuBar = true,
  theme = 'system',
  language = 'en',
  user
}) => {
  // Store
  const {
    document,
    isLoading,
    error,
    isDirty,
    isSaving,
    currentTool,
    zoom,
    viewMode,
    selectedElements,
    clipboard,
    canUndo,
    canRedo,
    loadDocument,
    createDocument,
    saveDocument,
    exportDocument,
    undo,
    redo,
    copy,
    paste,
    cut,
    selectAll,
    deselectAll,
    deleteSelection,
    setZoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    zoomToWidth,
    toggleFullscreen,
    resetView
  } = useEditorStore();

  // Local state
  const [layout, setLayout] = useState<EditorLayout>({
    sidebarLeft: true,
    sidebarRight: true,
    sidebarLeftWidth: 64,
    sidebarRightWidth: 320,
    toolbarPosition: 'top',
    statusBarVisible: showStatusBar,
    menuBarVisible: showMenuBar,
    fullscreen: false,
    zenMode: false
  });

  const [preferences, setPreferences] = useState<EditorPreferences>({
    theme: theme,
    language: language,
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    showGrid: false,
    snapToGrid: false,
    gridSize: 10,
    showRulers: false,
    showGuides: false,
    highlightActiveLayer: true,
    smoothScrolling: true,
    hardwareAcceleration: true,
    reducedMotion: false,
    fontSize: 'medium',
    fontFamily: 'Inter',
    cursorStyle: 'default',
    wheelZoom: true,
    touchGestures: true,
    keyboardShortcuts: true,
    soundEffects: false,
    notifications: true,
    analytics: false,
    crashReports: false
  });

  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [showWelcome, setShowWelcome] = useState(!initialFile);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPlugins, setShowPlugins] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial file
  useEffect(() => {
    if (initialFile) {
      if (typeof initialFile === 'string') {
        // Load from URL
        loadDocument(initialFile);
      } else {
        // Load from File object
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          loadDocument(arrayBuffer);
        };
        reader.readAsArrayBuffer(initialFile);
      }
      setShowWelcome(false);
    }
  }, [initialFile, loadDocument]);

  // Auto-save
  useEffect(() => {
    if (preferences.autoSave && isDirty && !readOnly) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, preferences.autoSaveInterval);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, preferences.autoSave, preferences.autoSaveInterval, readOnly]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connection lost. Working offline.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!preferences.keyboardShortcuts) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      // File operations
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNew();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleOpen();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSaveAs();
        } else {
          handleSave();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setShowExportDialog(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowPrintDialog(true);
      }
      
      // Edit operations
      else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        cut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        copy();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        paste();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        selectAll();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElements.length > 0) {
          e.preventDefault();
          deleteSelection();
        }
      }
      
      // View operations
      else if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        resetView();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        setZoom(1);
      } else if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        zoomToFit();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '3') {
        e.preventDefault();
        zoomToWidth();
      }
      
      // UI operations
      else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      } else if (e.key === 'F1') {
        e.preventDefault();
        setShowHelp(true);
      } else if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreenMode();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        toggleSidebar('left');
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '\\') {
        e.preventDefault();
        toggleSidebar('right');
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      
      // Zen mode
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        toggleZenMode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [preferences.keyboardShortcuts, selectedElements]);

  // Handle new document
  const handleNew = useCallback(() => {
    if (isDirty) {
      // Show confirmation dialog
      setActiveDialog('unsaved-changes');
    } else {
      createDocument();
      setShowWelcome(false);
    }
  }, [isDirty, createDocument]);

  // Handle open document
  const handleOpen = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        loadDocument(arrayBuffer);
        setShowWelcome(false);
        
        // Add to recent files
        const recentFile: RecentFile = {
          id: generateId(),
          name: file.name,
          path: file.name,
          size: file.size,
          lastModified: new Date(file.lastModified)
        };
        setRecentFiles(prev => [recentFile, ...prev.slice(0, 9)]);
      };
      reader.readAsArrayBuffer(file);
    }
    
    // Reset input
    e.target.value = '';
  }, [loadDocument]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (readOnly) return;
    
    try {
      const pdfBytes = await saveDocument();
      if (!pdfBytes) {
        throw new Error('Failed to save document');
      }
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      if (onSave) {
        onSave(blob);
      } else {
        // Download file
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${document?.name || 'document'}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
      
      toast.success('Document saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save document');
    }
  }, [readOnly, document, saveDocument, onSave]);

  // Handle save as
  const handleSaveAs = useCallback(() => {
    // Show save as dialog
    setActiveDialog('save-as');
  }, []);

  // Handle export
  const handleExport = useCallback(async (format: string) => {
    try {
      const blob = await exportDocument(format);
      if (!blob) {
        throw new Error('Failed to export document');
      }
      if (onExport) {
        onExport(blob, format);
      } else {
        // Download file
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${document?.name || 'document'}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
      
      toast.success(`Exported as ${format.toUpperCase()}`);
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export document');
    }
  }, [document, exportDocument, onExport]);

  // Handle print
  const handlePrint = useCallback(() => {
    window.print();
    setShowPrintDialog(false);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback((side: 'left' | 'right') => {
    setLayout(prev => ({
      ...prev,
      [`sidebar${side.charAt(0).toUpperCase() + side.slice(1)}`]: !prev[`sidebar${side.charAt(0).toUpperCase() + side.slice(1)}`]
    }));
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreenMode = useCallback(() => {
    if (!window.document.fullscreenElement) {
      editorRef.current?.requestFullscreen();
      setLayout(prev => ({ ...prev, fullscreen: true }));
    } else {
      window.document.exitFullscreen();
      setLayout(prev => ({ ...prev, fullscreen: false }));
    }
  }, []);

  // Toggle zen mode
  const toggleZenMode = useCallback(() => {
    setLayout(prev => ({
      ...prev,
      zenMode: !prev.zenMode,
      sidebarLeft: prev.zenMode ? true : false,
      sidebarRight: prev.zenMode ? true : false,
      menuBarVisible: prev.zenMode ? showMenuBar : false,
      statusBarVisible: prev.zenMode ? showStatusBar : false
    }));
  }, [showMenuBar, showStatusBar]);

  // Generate ID
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Render menu bar
  const renderMenuBar = () => {
    if (!layout.menuBarVisible) return null;
    
    return (
      <Menubar.Root className="flex h-8 items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2">
        {/* File menu */}
        <Menubar.Menu>
          <Menubar.Trigger className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
            File
          </Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 min-w-[200px]" sideOffset={5}>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={handleNew}
              >
                <span className="flex items-center gap-2">
                  <FiFilePlus className="w-4 h-4" />
                  New
                </span>
                <span className="text-xs text-gray-500">Ctrl+N</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={handleOpen}
              >
                <span className="flex items-center gap-2">
                  <FiFolderPlus className="w-4 h-4" />
                  Open
                </span>
                <span className="text-xs text-gray-500">Ctrl+O</span>
              </Menubar.Item>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={handleSave}
                disabled={readOnly}
              >
                <span className="flex items-center gap-2">
                  <FiSave className="w-4 h-4" />
                  Save
                </span>
                <span className="text-xs text-gray-500">Ctrl+S</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={handleSaveAs}
                disabled={readOnly}
              >
                <span className="flex items-center gap-2">
                  <FiSave className="w-4 h-4" />
                  Save As...
                </span>
                <span className="text-xs text-gray-500">Ctrl+Shift+S</span>
              </Menubar.Item>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={() => setShowExportDialog(true)}
              >
                <span className="flex items-center gap-2">
                  <FiDownload className="w-4 h-4" />
                  Export...
                </span>
                <span className="text-xs text-gray-500">Ctrl+E</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={() => setShowPrintDialog(true)}
              >
                <span className="flex items-center gap-2">
                  <FiPrinter className="w-4 h-4" />
                  Print...
                </span>
                <span className="text-xs text-gray-500">Ctrl+P</span>
              </Menubar.Item>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Sub>
                <Menubar.SubTrigger className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    Recent Files
                  </span>
                  <FiChevronRight className="w-3 h-3" />
                </Menubar.SubTrigger>
                <Menubar.Portal>
                  <Menubar.SubContent className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 min-w-[200px]" sideOffset={2} alignOffset={-5}>
                    {recentFiles.length > 0 ? (
                      recentFiles.map(file => (
                        <Menubar.Item
                          key={file.id}
                          className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => {/* Load recent file */}}
                        >
                          <div className="flex items-center gap-2">
                            <FiFileText className="w-4 h-4" />
                            <div className="flex-1 truncate">
                              <div className="font-medium truncate">{file.name}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(file.lastModified).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </Menubar.Item>
                      ))
                    ) : (
                      <Menubar.Item className="px-3 py-2 text-sm text-gray-500" disabled>
                        No recent files
                      </Menubar.Item>
                    )}
                  </Menubar.SubContent>
                </Menubar.Portal>
              </Menubar.Sub>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                onClick={() => window.close()}
              >
                <FiX className="w-4 h-4" />
                Exit
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
        
        {/* Edit menu */}
        <Menubar.Menu>
          <Menubar.Trigger className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
            Edit
          </Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 min-w-[200px]" sideOffset={5}>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={undo}
                disabled={!canUndo()}
              >
                <span className="flex items-center gap-2">
                  <FiCornerUpLeft className="w-4 h-4" />
                  Undo
                </span>
                <span className="text-xs text-gray-500">Ctrl+Z</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={redo}
                disabled={!canRedo()}
              >
                <span className="flex items-center gap-2">
                  <FiCornerUpRight className="w-4 h-4" />
                  Redo
                </span>
                <span className="text-xs text-gray-500">Ctrl+Y</span>
              </Menubar.Item>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={cut}
                disabled={selectedElements.length === 0}
              >
                <span className="flex items-center gap-2">
                  <FiScissors className="w-4 h-4" />
                  Cut
                </span>
                <span className="text-xs text-gray-500">Ctrl+X</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={copy}
                disabled={selectedElements.length === 0}
              >
                <span className="flex items-center gap-2">
                  <FiCopy className="w-4 h-4" />
                  Copy
                </span>
                <span className="text-xs text-gray-500">Ctrl+C</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={paste}
                disabled={!clipboard}
              >
                <span className="flex items-center gap-2">
                  <FiClipboard className="w-4 h-4" />
                  Paste
                </span>
                <span className="text-xs text-gray-500">Ctrl+V</span>
              </Menubar.Item>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={selectAll}
              >
                <span className="flex items-center gap-2">
                  <FiCheckSquare className="w-4 h-4" />
                  Select All
                </span>
                <span className="text-xs text-gray-500">Ctrl+A</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={deselectAll}
                disabled={selectedElements.length === 0}
              >
                <span className="flex items-center gap-2">
                  <FiSquare className="w-4 h-4" />
                  Deselect All
                </span>
                <span className="text-xs text-gray-500">Esc</span>
              </Menubar.Item>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={() => setShowSearch(true)}
              >
                <span className="flex items-center gap-2">
                  <FiSearch className="w-4 h-4" />
                  Find & Replace...
                </span>
                <span className="text-xs text-gray-500">Ctrl+F</span>
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
        
        {/* View menu */}
        <Menubar.Menu>
          <Menubar.Trigger className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
            View
          </Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 min-w-[200px]" sideOffset={5}>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={zoomIn}
              >
                <span className="flex items-center gap-2">
                  <FiZoomIn className="w-4 h-4" />
                  Zoom In
                </span>
                <span className="text-xs text-gray-500">Ctrl++</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={zoomOut}
              >
                <span className="flex items-center gap-2">
                  <FiZoomOut className="w-4 h-4" />
                  Zoom Out
                </span>
                <span className="text-xs text-gray-500">Ctrl+-</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={resetView}
              >
                <span className="flex items-center gap-2">
                  <FiRefreshCw className="w-4 h-4" />
                  Reset Zoom
                </span>
                <span className="text-xs text-gray-500">Ctrl+0</span>
              </Menubar.Item>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={zoomToFit}
              >
                <span className="flex items-center gap-2">
                  <FiMaximize className="w-4 h-4" />
                  Fit to Page
                </span>
                <span className="text-xs text-gray-500">Ctrl+2</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={zoomToWidth}
              >
                <span className="flex items-center gap-2">
                  <FiColumns className="w-4 h-4" />
                  Fit to Width
                </span>
                <span className="text-xs text-gray-500">Ctrl+3</span>
              </Menubar.Item>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.CheckboxItem
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                checked={layout.sidebarLeft}
                onCheckedChange={() => toggleSidebar('left')}
              >
                <FiSidebar className="w-4 h-4" />
                Left Sidebar
              </Menubar.CheckboxItem>
              <Menubar.CheckboxItem
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                checked={layout.sidebarRight}
                onCheckedChange={() => toggleSidebar('right')}
              >
                <FiSidebar className="w-4 h-4 rotate-180" />
                Right Sidebar
              </Menubar.CheckboxItem>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={toggleFullscreenMode}
              >
                <span className="flex items-center gap-2">
                  {layout.fullscreen ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
                  Fullscreen
                </span>
                <span className="text-xs text-gray-500">F11</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={toggleZenMode}
              >
                <span className="flex items-center gap-2">
                  <FiEye className="w-4 h-4" />
                  Zen Mode
                </span>
                <span className="text-xs text-gray-500">Ctrl+Shift+Z</span>
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
        
        {/* Help menu */}
        <Menubar.Menu>
          <Menubar.Trigger className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
            Help
          </Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 min-w-[200px]" sideOffset={5}>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                onClick={() => setShowHelp(true)}
              >
                <span className="flex items-center gap-2">
                  <FiHelpCircle className="w-4 h-4" />
                  Documentation
                </span>
                <span className="text-xs text-gray-500">F1</span>
              </Menubar.Item>
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <FiGithub className="w-4 h-4" />
                GitHub
              </Menubar.Item>
              
              <Menubar.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              
              <Menubar.Item
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
              >
                <FiInfo className="w-4 h-4" />
                About {APP_NAME}
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
        
        {/* Right side items */}
        <div className="ml-auto flex items-center gap-2">
          {/* Sync status */}
          {isOnline ? (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="flex items-center gap-1 px-2 py-1 text-xs text-green-600">
                    {isSyncing ? (
                      <FiRefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <FiCloud className="w-3 h-3" />
                    )}
                    <span>Synced</span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-2 py-1 rounded text-xs"
                    sideOffset={5}
                  >
                    All changes saved to cloud
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600">
              <FiCloudOff className="w-3 h-3" />
              <span>Offline</span>
            </div>
          )}
          
          {/* User menu */}
          {user && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <Avatar.Root className="w-6 h-6">
                    <Avatar.Image
                      className="w-full h-full rounded-full"
                      src={user.avatar}
                      alt={user.name}
                    />
                    <Avatar.Fallback className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <span className="text-sm font-medium">{user.name}</span>
                  <FiChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 min-w-[200px]"
                  sideOffset={5}
                >
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2 mt-1"
                  >
                    <FiUser className="w-4 h-4" />
                    Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                    onClick={() => setShowSettings(true)}
                  >
                    <FiSettings className="w-4 h-4" />
                    Settings
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                  
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>
      </Menubar.Root>
    );
  };

  // Render status bar
  const renderStatusBar = () => {
    if (!layout.statusBarVisible) return null;
    
    return (
      <div className="h-6 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          {/* Document info */}
          {document && (
            <>
              <span>{document.pages.length} page(s)</span>
              <span>•</span>
              <span>{selectedElements.length} selected</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Current tool */}
          {currentTool && (
            <span>Tool: {currentTool.name}</span>
          )}
          
          {/* Zoom level */}
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          
          {/* View mode */}
          <span>{viewMode} view</span>
          
          {/* Save status */}
          {isDirty && (
            <span className="text-orange-500">• Unsaved changes</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={editorRef}
      className={cn(
        'flex flex-col h-screen bg-gray-50 dark:bg-gray-900',
        layout.fullscreen && 'fixed inset-0 z-50',
        className
      )}
    >
      {/* Menu bar */}
      {renderMenuBar()}
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar (Toolbar) */}
        {layout.sidebarLeft && showToolbar && (
          <Toolbar
            orientation="vertical"
            collapsible
            className="border-r border-gray-200 dark:border-gray-700"
          />
        )}
        
        {/* Center area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* PDF Viewer */}
          <PDFViewer
            className="flex-1"
            enableInteraction={!readOnly}
          />
        </div>
        
        {/* Right sidebar */}
        {layout.sidebarRight && showSidebar && (
          <Sidebar
            position="right"
            collapsible
            className="border-l border-gray-200 dark:border-gray-700"
          />
        )}
      </div>
      
      {/* Status bar */}
      {renderStatusBar()}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: preferences.theme === 'dark' ? '#1f2937' : '#fff',
            color: preferences.theme === 'dark' ? '#f3f4f6' : '#111827',
          },
        }}
      />
      
      {/* Dialogs */}
      {/* Export dialog, Print dialog, Settings dialog, etc. would go here */}
    </div>
  );
};

export default PDFEditor;