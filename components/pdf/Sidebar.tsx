'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { PDFPage, TextElement, ImageElement, DrawingElement, Annotation, FormField } from '@/types';
import { cn, formatFileSize, generateId } from '@/lib/utils/index';
import { Button } from '@/components/ui/button';
import {
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiCopy,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUnlock,
  FiLayers,
  FiFile,
  FiFileText,
  FiImage,
  FiEdit3,
  FiSquare,
  FiCircle,
  FiType,
  FiMessageSquare,
  FiCheckSquare,
  FiDroplet,
  FiMove,
  FiRotateCw,
  FiRotateCcw,
  FiFlipHorizontal,
  FiFlipVertical,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiMaximize,
  FiMinimize,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiShare2,
  FiPrinter,
  FiScissors,
  FiPaperclip,
  FiBookmark,
  FiTag,
  FiFolder,
  FiFolderPlus,
  FiX,
  FiCheck,
  FiChevronsUp,
  FiChevronsDown,
  FiMenu,
  FiMoreVertical,
  FiMoreHorizontal,
  FiSidebar,
  FiColumns,
  FiLayout,
  FiCrop,
  FiZap,
  FiSun,
  FiMoon,
  FiCloud,
  FiCloudOff,
  FiWifi,
  FiWifiOff,
  FiBell,
  FiBellOff,
  FiUser,
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiKey,
  FiHash,
  FiDollarSign,
  FiPercent,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart,
  FiPieChart,
  FiCpu,
  FiHardDrive,
  FiServer,
  FiDatabase,
  FiGitBranch,
  FiGitCommit,
  FiGitMerge,
  FiGitPullRequest
} from 'react-icons/fi';
import {
  RiPagesLine,
  RiPageSeparator,
  RiDragMove2Line,
  RiStackLine,
  RiLayout2Line,
  RiLayout3Line,
  RiLayout4Line,
  RiLayout5Line,
  RiLayout6Line,
  RiLayoutGridLine,
  RiLayoutMasonryLine,
  RiLayoutRowLine,
  RiLayoutColumnLine,
  RiLayoutTopLine,
  RiLayoutBottomLine,
  RiLayoutLeftLine,
  RiLayoutRightLine,
  RiArtboard2Line,
  RiPaletteLine,
  RiContrastLine,
  RiContrastDropLine,
  RiBlurOffLine,
  RiShape2Line,
  RiShapeLine,
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
  RiBringForward,
  RiBringToFront,
  RiSendBackward,
  RiSendToBack,
  RiStackOverflowLine,
  RiNodeTree,
  RiOrganizationChart,
  RiMindMap,
  RiFlowChart,
  RiListOrdered,
  RiListUnordered,
  RiListCheck,
  RiListCheck2,
  RiIndentDecrease,
  RiIndentIncrease,
  RiSortAsc,
  RiSortDesc,
  RiFilter2Line,
  RiFilter3Line,
  RiFilterLine,
  RiFilterOffLine,
  RiEqualizer2Line,
  RiEqualizer3Line,
  RiEqualizerLine,
  RiSettings2Line,
  RiSettings3Line,
  RiSettings4Line,
  RiSettings5Line,
  RiSettings6Line,
  RiToolsLine,
  RiRulerLine,
  RiRuler2Line,
  RiPencilRulerLine,
  RiPencilRuler2Line,
  RiCompassLine,
  RiCompass2Line,
  RiCompass3Line,
  RiCompass4Line,
  RiCompassDiscoverLine,
  RiAnchorLine,
  RiMapPinLine,
  RiMapPin2Line,
  RiMapPin3Line,
  RiMapPin4Line,
  RiMapPin5Line,
  RiPushpinLine,
  RiPushpin2Line,
  RiNavigationLine,
  RiGuideLine,
  RiDashboardLine,
  RiDashboard2Line,
  RiDashboard3Line
} from 'react-icons/ri';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Slider from '@radix-ui/react-slider';
import * as Switch from '@radix-ui/react-switch';
import * as Select from '@radix-ui/react-select';
import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Separator from '@radix-ui/react-separator';
import * as Collapsible from '@radix-ui/react-collapsible';
import { HexColorPicker } from 'react-colorful';
import toast from 'react-hot-toast';

interface SidebarProps {
  className?: string;
  defaultTab?: 'pages' | 'layers' | 'properties' | 'history';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  position?: 'left' | 'right';
}

interface LayerItem {
  id: string;
  type: 'text' | 'image' | 'drawing' | 'annotation' | 'form' | 'signature' | 'watermark';
  name: string;
  visible: boolean;
  locked: boolean;
  selected: boolean;
  children?: LayerItem[];
  element?: any;
  pageId: string;
  zIndex: number;
}

interface HistoryItem {
  id: string;
  action: string;
  timestamp: Date;
  description: string;
  canUndo: boolean;
  canRedo: boolean;
  data?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  defaultTab = 'pages',
  collapsible = true,
  defaultCollapsed = false,
  position = 'left'
}) => {
  const {
    document,
    currentPageId,
    currentPage,
    selectedElements,
    history,
    historyIndex,
    navigateToPage,
    addPage,
    deletePage,
    duplicatePage,
    reorderPages,
    rotatePage,
    selectElement,
    selectMultipleElements,
    clearSelection,
    deleteElements,
    duplicateElements,
    updateElement,
    changeElementOrder,
    toggleElementVisibility,
    toggleElementLock,
    groupElements,
    ungroupElements,
    undo,
    redo,
    canUndo,
    canRedo
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'date' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showPageThumbnails, setShowPageThumbnails] = useState(true);
  const [thumbnailSize, setThumbnailSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showLayerIcons, setShowLayerIcons] = useState(true);
  const [autoSelectNewLayers, setAutoSelectNewLayers] = useState(true);
  const [showHiddenLayers, setShowHiddenLayers] = useState(false);
  const [showLockedLayers, setShowLockedLayers] = useState(true);
  const [groupByType, setGroupByType] = useState(false);
  const [historyLimit, setHistoryLimit] = useState(50);
  const [showHistoryDetails, setShowHistoryDetails] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingPage, setIsDraggingPage] = useState(false);
  const [isDraggingLayer, setIsDraggingLayer] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  // Get layers from current page
  const layers = useMemo(() => {
    if (!document || !currentPageId) return [];
    
    const page = document.pages.find(p => p.id === currentPageId);
    if (!page) return [];
    
    const allLayers: LayerItem[] = [];
    
    // Add text elements
    page.text.forEach(text => {
      allLayers.push({
        id: text.id,
        type: 'text',
        name: text.content.substring(0, 20) || 'Text Layer',
        visible: text.visible !== false,
        locked: text.locked || false,
        selected: selectedElements.includes(text.id),
        element: text,
        pageId: currentPageId,
        zIndex: text.zIndex || 0
      });
    });
    
    // Add image elements
    page.images.forEach(image => {
      allLayers.push({
        id: image.id,
        type: 'image',
        name: image.name || 'Image Layer',
        visible: image.visible !== false,
        locked: image.locked || false,
        selected: selectedElements.includes(image.id),
        element: image,
        pageId: currentPageId,
        zIndex: image.zIndex || 0
      });
    });
    
    // Add drawing elements
    page.drawings.forEach(drawing => {
      allLayers.push({
        id: drawing.id,
        type: 'drawing',
        name: `${drawing.type} Drawing`,
        visible: drawing.visible !== false,
        locked: drawing.locked || false,
        selected: selectedElements.includes(drawing.id),
        element: drawing,
        pageId: currentPageId,
        zIndex: drawing.zIndex || 0
      });
    });
    
    // Add annotations
    page.annotations.forEach(annotation => {
      allLayers.push({
        id: annotation.id,
        type: 'annotation',
        name: `${annotation.type} Annotation`,
        visible: annotation.visible !== false,
        locked: annotation.locked || false,
        selected: selectedElements.includes(annotation.id),
        element: annotation,
        pageId: currentPageId,
        zIndex: annotation.zIndex || 0
      });
    });
    
    // Add form fields
    page.forms.forEach(form => {
      allLayers.push({
        id: form.id,
        type: 'form',
        name: form.name || `${form.type} Field`,
        visible: form.visible !== false,
        locked: form.locked || false,
        selected: selectedElements.includes(form.id),
        element: form,
        pageId: currentPageId,
        zIndex: form.zIndex || 0
      });
    });
    
    // Sort by z-index (highest first)
    allLayers.sort((a, b) => b.zIndex - a.zIndex);
    
    // Group by type if enabled
    if (groupByType) {
      const grouped: Record<string, LayerItem[]> = {};
      allLayers.forEach(layer => {
        if (!grouped[layer.type]) {
          grouped[layer.type] = [];
        }
        grouped[layer.type].push(layer);
      });
      
      return Object.entries(grouped).map(([type, layers]) => ({
        id: `group-${type}`,
        type: type as any,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layers`,
        visible: true,
        locked: false,
        selected: false,
        children: layers,
        pageId: currentPageId,
        zIndex: 0
      }));
    }
    
    return allLayers;
  }, [document, currentPageId, selectedElements, groupByType]);

  // Filter and sort layers
  const filteredLayers = useMemo(() => {
    let filtered = [...layers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(layer => 
        layer.name.toLowerCase().includes(query) ||
        layer.type.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(layer => layer.type === filterType);
    }
    
    // Filter hidden layers
    if (!showHiddenLayers) {
      filtered = filtered.filter(layer => layer.visible);
    }
    
    // Filter locked layers
    if (!showLockedLayers) {
      filtered = filtered.filter(layer => !layer.locked);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = b.zIndex - a.zIndex;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [layers, searchQuery, filterType, showHiddenLayers, showLockedLayers, sortBy, sortOrder]);

  // Get history items
  const historyItems = useMemo(() => {
    const historyArray = history?.past || [];
    return historyArray.slice(0, historyLimit).map((item, index) => ({
      id: `history-${index}`,
      action: item.type || 'Unknown Action',
      timestamp: item.timestamp || new Date(),
      description: item.description || '',
      canUndo: index < historyIndex,
      canRedo: index >= historyIndex,
      data: item.data
    }));
  }, [history, historyIndex, historyLimit]);

  // Handle page selection
  const handlePageSelect = useCallback((pageId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedPageIds(prev => 
        prev.includes(pageId) 
          ? prev.filter(id => id !== pageId)
          : [...prev, pageId]
      );
    } else {
      setSelectedPageIds([pageId]);
      navigateToPage(pageId);
    }
  }, [navigateToPage]);

  // Handle layer selection
  const handleLayerSelect = useCallback((layerId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedLayerIds(prev => 
        prev.includes(layerId)
          ? prev.filter(id => id !== layerId)
          : [...prev, layerId]
      );
      selectMultipleElements(selectedLayerIds.includes(layerId) 
        ? selectedLayerIds.filter(id => id !== layerId)
        : [...selectedLayerIds, layerId]
      );
    } else {
      setSelectedLayerIds([layerId]);
      selectElement(layerId);
    }
  }, [selectedLayerIds, selectElement, selectMultipleElements]);

  // Handle page operations
  const handleAddPage = useCallback(() => {
    const newPage = addPage();
    if (newPage && autoSelectNewLayers) {
      handlePageSelect(newPage.id);
    }
    toast.success('New page added');
  }, [addPage, autoSelectNewLayers, handlePageSelect]);

  const handleDeletePage = useCallback((pageId: string) => {
    if (document && document.pages.length > 1) {
      deletePage(pageId);
      toast.success('Page deleted');
    } else {
      toast.error('Cannot delete the last page');
    }
  }, [document, deletePage]);

  const handleDuplicatePage = useCallback((pageId: string) => {
    const newPage = duplicatePage(pageId);
    if (newPage) {
      toast.success('Page duplicated');
    }
  }, [duplicatePage]);

  const handleRotatePage = useCallback((pageId: string, direction: 'cw' | 'ccw') => {
    const angle = direction === 'cw' ? 90 : -90;
    rotatePage(pageId, angle);
    toast.success(`Page rotated ${direction === 'cw' ? 'clockwise' : 'counter-clockwise'}`);
  }, [rotatePage]);

  // Handle layer operations
  const handleToggleLayerVisibility = useCallback((layerId: string) => {
    toggleElementVisibility(layerId);
  }, [toggleElementVisibility]);

  const handleToggleLayerLock = useCallback((layerId: string) => {
    toggleElementLock(layerId);
  }, [toggleElementLock]);

  const handleDeleteLayers = useCallback(() => {
    if (selectedLayerIds.length > 0) {
      deleteElements(selectedLayerIds);
      setSelectedLayerIds([]);
      toast.success(`${selectedLayerIds.length} layer(s) deleted`);
    }
  }, [selectedLayerIds, deleteElements]);

  const handleDuplicateLayers = useCallback(() => {
    if (selectedLayerIds.length > 0) {
      duplicateElements(selectedLayerIds);
      toast.success(`${selectedLayerIds.length} layer(s) duplicated`);
    }
  }, [selectedLayerIds, duplicateElements]);

  const handleGroupLayers = useCallback(() => {
    if (selectedLayerIds.length > 1) {
      groupElements(selectedLayerIds);
      toast.success('Layers grouped');
    }
  }, [selectedLayerIds, groupElements]);

  const handleUngroupLayers = useCallback(() => {
    if (selectedLayerIds.length > 0) {
      ungroupElements(selectedLayerIds);
      toast.success('Layers ungrouped');
    }
  }, [selectedLayerIds, ungroupElements]);

  // Handle layer ordering
  const handleBringToFront = useCallback(() => {
    if (selectedLayerIds.length > 0) {
      changeElementOrder(selectedLayerIds[0], 'front');
    }
  }, [selectedLayerIds, changeElementOrder]);

  const handleSendToBack = useCallback(() => {
    if (selectedLayerIds.length > 0) {
      changeElementOrder(selectedLayerIds[0], 'back');
    }
  }, [selectedLayerIds, changeElementOrder]);

  const handleBringForward = useCallback(() => {
    if (selectedLayerIds.length > 0) {
      changeElementOrder(selectedLayerIds[0], 'forward');
    }
  }, [selectedLayerIds, changeElementOrder]);

  const handleSendBackward = useCallback(() => {
    if (selectedLayerIds.length > 0) {
      changeElementOrder(selectedLayerIds[0], 'backward');
    }
  }, [selectedLayerIds, changeElementOrder]);

  // Handle drag and drop for pages
  const handlePageDragStart = useCallback((pageId: string) => {
    setIsDraggingPage(true);
    setDraggedItemId(pageId);
  }, []);

  const handlePageDragEnd = useCallback(() => {
    setIsDraggingPage(false);
    setDraggedItemId(null);
    setDropTargetId(null);
  }, []);

  const handlePageDragOver = useCallback((pageId: string) => {
    if (isDraggingPage && draggedItemId && draggedItemId !== pageId) {
      setDropTargetId(pageId);
    }
  }, [isDraggingPage, draggedItemId]);

  const handlePageDrop = useCallback((targetPageId: string) => {
    if (draggedItemId && draggedItemId !== targetPageId) {
      // Reorder pages
      if (document) {
        const draggedIndex = document.pages.findIndex(p => p.id === draggedItemId);
        const targetIndex = document.pages.findIndex(p => p.id === targetPageId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const newPages = [...document.pages];
          const [draggedPage] = newPages.splice(draggedIndex, 1);
          newPages.splice(targetIndex, 0, draggedPage);
          
          // Update page numbers
          newPages.forEach((page, index) => {
            page.pageNumber = index + 1;
          });
          
          reorderPages(newPages.map(p => p.id));
          toast.success('Pages reordered');
        }
      }
    }
    
    handlePageDragEnd();
  }, [document, draggedItemId, reorderPages, handlePageDragEnd]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if sidebar is focused
      if (!sidebarRef.current?.contains(document.activeElement)) return;
      
      // Delete selected items
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayerIds.length > 0) {
          e.preventDefault();
          handleDeleteLayers();
        } else if (selectedPageIds.length > 0 && selectedPageIds[0] !== currentPageId) {
          e.preventDefault();
          handleDeletePage(selectedPageIds[0]);
        }
      }
      
      // Duplicate selected items
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedLayerIds.length > 0) {
          handleDuplicateLayers();
        } else if (selectedPageIds.length > 0) {
          handleDuplicatePage(selectedPageIds[0]);
        }
      }
      
      // Group/Ungroup
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          handleUngroupLayers();
        } else {
          handleGroupLayers();
        }
      }
      
      // Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        if (activeTab === 'layers') {
          setSelectedLayerIds(filteredLayers.map(l => l.id));
          selectMultipleElements(filteredLayers.map(l => l.id));
        } else if (activeTab === 'pages' && document) {
          setSelectedPageIds(document.pages.map(p => p.id));
        }
      }
      
      // Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeTab,
    selectedLayerIds,
    selectedPageIds,
    currentPageId,
    document,
    filteredLayers,
    handleDeleteLayers,
    handleDeletePage,
    handleDuplicateLayers,
    handleDuplicatePage,
    handleGroupLayers,
    handleUngroupLayers,
    selectMultipleElements
  ]);

  // Render page item
  const renderPageItem = (page: PDFPage) => {
    const isSelected = selectedPageIds.includes(page.id);
    const isCurrent = page.id === currentPageId;
    const isDropTarget = dropTargetId === page.id;
    
    return (
      <motion.div
        key={page.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative group cursor-pointer rounded-lg border-2 transition-all duration-200',
          isCurrent && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
          isSelected && !isCurrent && 'border-blue-300 bg-blue-50/50 dark:bg-blue-900/10',
          !isSelected && !isCurrent && 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
          isDropTarget && 'border-green-500 bg-green-50 dark:bg-green-900/20'
        )}
        onClick={(e) => handlePageSelect(page.id, e.ctrlKey || e.metaKey)}
        onDoubleClick={() => navigateToPage(page.id)}
        draggable
        onDragStart={() => handlePageDragStart(page.id)}
        onDragEnd={handlePageDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          handlePageDragOver(page.id);
        }}
        onDrop={(e) => {
          e.preventDefault();
          handlePageDrop(page.id);
        }}
      >
        {/* Page thumbnail */}
        {showPageThumbnails && (
          <div className={cn(
            'bg-white dark:bg-gray-800 rounded-t-lg overflow-hidden',
            thumbnailSize === 'small' && 'h-24',
            thumbnailSize === 'medium' && 'h-32',
            thumbnailSize === 'large' && 'h-48'
          )}>
            {/* Placeholder for actual page thumbnail */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiFileText className="w-8 h-8" />
            </div>
          </div>
        )}
        
        {/* Page info */}
        <div className="p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">
              Page {page.pageNumber}
            </span>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiMoreVertical className="w-3 h-3" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 min-w-[150px]"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                    onClick={() => handleDuplicatePage(page.id)}
                  >
                    <FiCopy className="w-3 h-3" />
                    Duplicate
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                    onClick={() => handleRotatePage(page.id, 'cw')}
                  >
                    <FiRotateCw className="w-3 h-3" />
                    Rotate Right
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                    onClick={() => handleRotatePage(page.id, 'ccw')}
                  >
                    <FiRotateCcw className="w-3 h-3" />
                    Rotate Left
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded cursor-pointer flex items-center gap-2"
                    onClick={() => handleDeletePage(page.id)}
                    disabled={document?.pages.length === 1}
                  >
                    <FiTrash2 className="w-3 h-3" />
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          
          {/* Page details */}
          <div className="mt-1 text-xs text-gray-500">
            {page.width} × {page.height}
            {page.rotation && page.rotation !== 0 && (
              <span className="ml-1">• {page.rotation}°</span>
            )}
          </div>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <FiCheck className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </motion.div>
    );
  };

  // Render layer item
  const renderLayerItem = (layer: LayerItem, depth = 0) => {
    const isSelected = selectedLayerIds.includes(layer.id);
    const hasChildren = layer.children && layer.children.length > 0;
    const isExpanded = expandedGroups.includes(layer.id);
    
    return (
      <div key={layer.id}>
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
            isSelected && 'bg-blue-100 dark:bg-blue-900/30',
            !isSelected && 'hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={(e) => handleLayerSelect(layer.id, e.ctrlKey || e.metaKey)}
        >
          {/* Expand/Collapse button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedGroups(prev =>
                  prev.includes(layer.id)
                    ? prev.filter(id => id !== layer.id)
                    : [...prev, layer.id]
                );
              }}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <FiChevronDown className="w-3 h-3" />
              ) : (
                <FiChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          
          {/* Layer icon */}
          {showLayerIcons && (
            <div className="flex-shrink-0">
              {layer.type === 'text' && <FiType className="w-3 h-3" />}
              {layer.type === 'image' && <FiImage className="w-3 h-3" />}
              {layer.type === 'drawing' && <FiEdit3 className="w-3 h-3" />}
              {layer.type === 'annotation' && <FiMessageSquare className="w-3 h-3" />}
              {layer.type === 'form' && <FiCheckSquare className="w-3 h-3" />}
              {layer.type === 'signature' && <FiEdit3 className="w-3 h-3" />}
              {layer.type === 'watermark' && <FiDroplet className="w-3 h-3" />}
            </div>
          )}
          
          {/* Layer name */}
          <span className="flex-1 text-xs truncate">{layer.name}</span>
          
          {/* Visibility toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleLayerVisibility(layer.id);
            }}
            className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {layer.visible ? (
              <FiEye className="w-3 h-3" />
            ) : (
              <FiEyeOff className="w-3 h-3 text-gray-400" />
            )}
          </button>
          
          {/* Lock toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleLayerLock(layer.id);
            }}
            className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {layer.locked ? (
              <FiLock className="w-3 h-3 text-orange-500" />
            ) : (
              <FiUnlock className="w-3 h-3 text-gray-400" />
            )}
          </button>
        </div>
        
        {/* Render children */}
        {hasChildren && isExpanded && (
          <div>
            {layer.children!.map(child => renderLayerItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render history item
  const renderHistoryItem = (item: HistoryItem) => {
    return (
      <div
        key={item.id}
        className={cn(
          'px-3 py-2 border-l-2 cursor-pointer transition-colors',
          item.canUndo && 'border-gray-300 dark:border-gray-600',
          item.canRedo && 'border-gray-200 dark:border-gray-700 opacity-50',
          'hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
        onClick={() => {
          if (item.canRedo) {
            redo();
          } else if (item.canUndo) {
            undo();
          }
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">{item.action}</span>
          <span className="text-xs text-gray-500">
            {new Date(item.timestamp).toLocaleTimeString()}
          </span>
        </div>
        {showHistoryDetails && item.description && (
          <p className="mt-1 text-xs text-gray-500">{item.description}</p>
        )}
      </div>
    );
  };

  return (
    <div
      ref={sidebarRef}
      className={cn(
        'bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700',
        'shadow-sm flex flex-col',
        isCollapsed ? 'w-12' : 'w-80',
        'transition-all duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h3 className="font-semibold text-sm">Panel</h3>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            {isCollapsed ? (
              position === 'left' ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />
            ) : (
              position === 'left' ? <FiChevronLeft className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <>
          {/* Tabs */}
          <Tabs.Root value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700">
              <Tabs.Trigger
                value="pages"
                className={cn(
                  'flex-1 px-3 py-2 text-xs font-medium transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  activeTab === 'pages' && 'border-b-2 border-blue-500 text-blue-600'
                )}
              >
                Pages
              </Tabs.Trigger>
              <Tabs.Trigger
                value="layers"
                className={cn(
                  'flex-1 px-3 py-2 text-xs font-medium transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  activeTab === 'layers' && 'border-b-2 border-blue-500 text-blue-600'
                )}
              >
                Layers
              </Tabs.Trigger>
              <Tabs.Trigger
                value="properties"
                className={cn(
                  'flex-1 px-3 py-2 text-xs font-medium transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  activeTab === 'properties' && 'border-b-2 border-blue-500 text-blue-600'
                )}
              >
                Properties
              </Tabs.Trigger>
              <Tabs.Trigger
                value="history"
                className={cn(
                  'flex-1 px-3 py-2 text-xs font-medium transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  activeTab === 'history' && 'border-b-2 border-blue-500 text-blue-600'
                )}
              >
                History
              </Tabs.Trigger>
            </Tabs.List>
            
            {/* Pages Tab */}
            <Tabs.Content value="pages" className="flex-1 flex flex-col overflow-hidden">
              {/* Pages toolbar */}
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddPage}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    title="Add Page"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                  
                  <Separator.Root className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                  
                  {/* View mode toggle */}
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-1.5 rounded',
                      viewMode === 'grid' 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                    title="Grid View"
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-1.5 rounded',
                      viewMode === 'list'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                    title="List View"
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                  
                  <Separator.Root className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                  
                  {/* Thumbnail size */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        title="Thumbnail Size"
                      >
                        <RiLayout2Line className="w-4 h-4" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1"
                        sideOffset={5}
                      >
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => setThumbnailSize('small')}
                        >
                          Small
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => setThumbnailSize('medium')}
                        >
                          Medium
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => setThumbnailSize('large')}
                        >
                          Large
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>
              
              {/* Pages list */}
              <ScrollArea.Root className="flex-1">
                <ScrollArea.Viewport className="w-full h-full p-2">
                  <div className={cn(
                    viewMode === 'grid' && 'grid grid-cols-2 gap-2',
                    viewMode === 'list' && 'space-y-2'
                  )}>
                    {document?.pages.map(page => renderPageItem(page))}
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                  className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-800 transition-colors duration-150 ease-out hover:bg-gray-200 dark:hover:bg-gray-700 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="flex-1 bg-gray-400 dark:bg-gray-600 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </Tabs.Content>
            
            {/* Layers Tab */}
            <Tabs.Content value="layers" className="flex-1 flex flex-col overflow-hidden">
              {/* Layers toolbar */}
              <div className="p-2 border-b border-gray-200 dark:border-gray-700 space-y-2">
                {/* Search */}
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search layers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-8 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                    >
                      <FiX className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleBringToFront}
                    disabled={selectedLayerIds.length === 0}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                    title="Bring to Front"
                  >
                    <RiBringToFront className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleBringForward}
                    disabled={selectedLayerIds.length === 0}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                    title="Bring Forward"
                  >
                    <RiBringForward className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleSendBackward}
                    disabled={selectedLayerIds.length === 0}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                    title="Send Backward"
                  >
                    <RiSendBackward className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleSendToBack}
                    disabled={selectedLayerIds.length === 0}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                    title="Send to Back"
                  >
                    <RiSendToBack className="w-3 h-3" />
                  </button>
                  
                  <Separator.Root className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                  
                  <button
                    onClick={handleGroupLayers}
                    disabled={selectedLayerIds.length < 2}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                    title="Group"
                  >
                    <RiFolderLine className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleUngroupLayers}
                    disabled={selectedLayerIds.length === 0}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                    title="Ungroup"
                  >
                    <RiFolderOpenLine className="w-3 h-3" />
                  </button>
                  
                  <Separator.Root className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                  
                  <button
                    onClick={handleDuplicateLayers}
                    disabled={selectedLayerIds.length === 0}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                    title="Duplicate"
                  >
                    <FiCopy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleDeleteLayers}
                    disabled={selectedLayerIds.length === 0}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                    title="Delete"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                  
                  {/* Filter menu */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded ml-auto"
                        title="Filter"
                      >
                        <FiFilter className="w-3 h-3" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 min-w-[150px]"
                        sideOffset={5}
                      >
                        <DropdownMenu.Label className="px-2 py-1 text-xs font-medium text-gray-500">
                          Filter by Type
                        </DropdownMenu.Label>
                        <DropdownMenu.Item
                          className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => setFilterType(null)}
                        >
                          All
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => setFilterType('text')}
                        >
                          Text
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => setFilterType('image')}
                        >
                          Images
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => setFilterType('drawing')}
                        >
                          Drawings
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => setFilterType('annotation')}
                        >
                          Annotations
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          onClick={() => setFilterType('form')}
                        >
                          Forms
                        </DropdownMenu.Item>
                        
                        <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                        
                        <DropdownMenu.Label className="px-2 py-1 text-xs font-medium text-gray-500">
                          Options
                        </DropdownMenu.Label>
                        <DropdownMenu.CheckboxItem
                          className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                          checked={showHiddenLayers}
                          onCheckedChange={setShowHiddenLayers}
                        >
                          Show Hidden
                        </DropdownMenu.CheckboxItem>
                        <DropdownMenu.CheckboxItem
                          className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                          checked={showLockedLayers}
                          onCheckedChange={setShowLockedLayers}
                        >
                          Show Locked
                        </DropdownMenu.CheckboxItem>
                        <DropdownMenu.CheckboxItem
                          className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                          checked={groupByType}
                          onCheckedChange={setGroupByType}
                        >
                          Group by Type
                        </DropdownMenu.CheckboxItem>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>
              
              {/* Layers list */}
              <ScrollArea.Root className="flex-1">
                <ScrollArea.Viewport className="w-full h-full">
                  <div className="py-1">
                    {filteredLayers.map(layer => renderLayerItem(layer))}
                    {filteredLayers.length === 0 && (
                      <div className="px-3 py-8 text-center text-xs text-gray-500">
                        No layers found
                      </div>
                    )}
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                  className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-800 transition-colors duration-150 ease-out hover:bg-gray-200 dark:hover:bg-gray-700 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="flex-1 bg-gray-400 dark:bg-gray-600 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </Tabs.Content>
            
            {/* Properties Tab */}
            <Tabs.Content value="properties" className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea.Root className="flex-1">
                <ScrollArea.Viewport className="w-full h-full p-3">
                  {selectedLayerIds.length > 0 ? (
                    <div className="space-y-4">
                      {/* Properties content will be added here */}
                      <div className="text-xs text-gray-500">
                        Properties for {selectedLayerIds.length} selected item(s)
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-gray-500 py-8">
                      Select an element to view properties
                    </div>
                  )}
                </ScrollArea.Viewport>
              </ScrollArea.Root>
            </Tabs.Content>
            
            {/* History Tab */}
            <Tabs.Content value="history" className="flex-1 flex flex-col overflow-hidden">
              {/* History toolbar */}
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={undo}
                      disabled={!canUndo()}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                      title="Undo"
                    >
                      <FiCornerUpLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={redo}
                      disabled={!canRedo()}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
                      title="Redo"
                    >
                      <FiCornerUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowHistoryDetails(!showHistoryDetails)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    title="Toggle Details"
                  >
                    <FiMoreVertical className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* History list */}
              <ScrollArea.Root className="flex-1">
                <ScrollArea.Viewport className="w-full h-full">
                  <div className="py-1">
                    {historyItems.map(item => renderHistoryItem(item))}
                    {historyItems.length === 0 && (
                      <div className="px-3 py-8 text-center text-xs text-gray-500">
                        No history yet
                      </div>
                    )}
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                  className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-800 transition-colors duration-150 ease-out hover:bg-gray-200 dark:hover:bg-gray-700 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="flex-1 bg-gray-400 dark:bg-gray-600 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </Tabs.Content>
          </Tabs.Root>
        </>
      )}
    </div>
  );
};

export default Sidebar;