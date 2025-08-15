'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useEditorStore } from '@/store/editor-store';
import { PDFPage, ViewMode, Annotation, TextElement, ImageElement, DrawingElement, FormField } from '@/types';
import { cn, debounce, throttle } from '@/lib/utils/index';
import { 
  ZOOM_PRESETS,
  MIN_ZOOM,
  MAX_ZOOM,
  DEFAULT_ZOOM,
  RULER_HEIGHT,
  GUIDE_COLOR,
  DEFAULT_GRID_SIZE
} from '@/lib/constants/index';
import { motion, AnimatePresence } from 'framer-motion';
import { useResizeDetector } from 'react-resize-detector';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  className?: string;
  onPageClick?: (event: React.MouseEvent, pageId: string) => void;
  onElementSelect?: (elementId: string) => void;
  onElementEdit?: (elementId: string) => void;
  showAnnotations?: boolean;
  showFormFields?: boolean;
  showDrawings?: boolean;
  enableInteraction?: boolean;
  renderMode?: 'canvas' | 'svg';
  quality?: number;
}

interface PageViewport {
  width: number;
  height: number;
  scale: number;
  rotation: number;
}

interface MousePosition {
  x: number;
  y: number;
  pageX: number;
  pageY: number;
  pageId: string | null;
}

interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  pageId: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  className,
  onPageClick,
  onElementSelect,
  onElementEdit,
  showAnnotations = true,
  showFormFields = true,
  showDrawings = true,
  enableInteraction = true,
  renderMode = 'canvas',
  quality = 2,
}) => {
  // Store
  const {
    document,
    currentPageId,
    currentPage,
    zoom,
    viewMode,
    selectedElements,
    currentTool,
    gridEnabled,
    snapToGrid,
    rulersEnabled,
    guidesEnabled,
    guides,
    setZoom,
    navigateToPage,
    selectElement,
    selectMultipleElements,
    clearSelection,
  } = useEditorStore();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rulerHRef = useRef<HTMLCanvasElement>(null);
  const rulerVRef = useRef<HTMLCanvasElement>(null);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageViewports, setPageViewports] = useState<Map<string, PageViewport>>(new Map());
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0,
    pageId: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [activeTextEdit, setActiveTextEdit] = useState<string | null>(null);
  const [textEditValue, setTextEditValue] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId?: string } | null>(null);

  // Resize detector
  const { width: containerWidth, height: containerHeight, ref: resizeRef } = useResizeDetector();

  // Combine refs
  useEffect(() => {
    if (containerRef.current && resizeRef.current) {
      resizeRef.current = containerRef.current;
    }
  }, [resizeRef]);

  // Calculate page dimensions
  const calculatePageDimensions = useCallback((page: PDFPage): PageViewport => {
    const baseWidth = page.width;
    const baseHeight = page.height;
    const rotation = page.rotation || 0;
    
    // Apply rotation
    const isRotated = rotation === 90 || rotation === 270;
    const width = isRotated ? baseHeight : baseWidth;
    const height = isRotated ? baseWidth : baseHeight;
    
    // Apply zoom
    const scaledWidth = width * zoom;
    const scaledHeight = height * zoom;
    
    return {
      width: scaledWidth,
      height: scaledHeight,
      scale: zoom,
      rotation,
    };
  }, [zoom]);

  // Update page viewports when document or zoom changes
  useEffect(() => {
    if (!document) return;
    
    const viewports = new Map<string, PageViewport>();
    document.pages.forEach(page => {
      viewports.set(page.id, calculatePageDimensions(page));
    });
    setPageViewports(viewports);
  }, [document, zoom, calculatePageDimensions]);

  // Handle document load
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }, []);

  // Handle document load error
  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Error loading PDF:', error);
    setError(error.message);
    setIsLoading(false);
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback(
    throttle((event: React.MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Find which page the mouse is over
      let pageId: string | null = null;
      let pageX = 0;
      let pageY = 0;
      
      if (document && viewportRef.current) {
        const scrollTop = viewportRef.current.scrollTop;
        const scrollLeft = viewportRef.current.scrollLeft;
        
        let accumulatedHeight = 0;
        for (const page of document.pages) {
          const viewport = pageViewports.get(page.id);
          if (!viewport) continue;
          
          const pageTop = accumulatedHeight;
          const pageBottom = pageTop + viewport.height;
          const pageLeft = 0;
          const pageRight = viewport.width;
          
          if (
            y + scrollTop >= pageTop &&
            y + scrollTop <= pageBottom &&
            x + scrollLeft >= pageLeft &&
            x + scrollLeft <= pageRight
          ) {
            pageId = page.id;
            pageX = (x + scrollLeft - pageLeft) / zoom;
            pageY = (y + scrollTop - pageTop) / zoom;
            break;
          }
          
          accumulatedHeight += viewport.height + 20; // 20px gap between pages
        }
      }
      
      setMousePosition({ x, y, pageX, pageY, pageId });
      
      // Update rulers
      if (rulersEnabled) {
        updateRulers(x, y);
      }
      
      // Handle selection box
      if (isSelecting && selectionBox) {
        setSelectionBox({
          ...selectionBox,
          endX: x,
          endY: y,
        });
      }
      
      // Handle dragging
      if (isDragging && viewportRef.current) {
        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;
        
        viewportRef.current.scrollLeft = scrollPosition.x - deltaX;
        viewportRef.current.scrollTop = scrollPosition.y - deltaY;
      }
    }, 16),
    [document, pageViewports, zoom, rulersEnabled, isSelecting, selectionBox, isDragging, dragStart, scrollPosition]
  );

  // Handle mouse down
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!enableInteraction) return;
    
    const isMiddleClick = event.button === 1;
    const isRightClick = event.button === 2;
    const isLeftClick = event.button === 0;
    
    if (isMiddleClick || (isLeftClick && event.shiftKey)) {
      // Start panning
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
      if (viewportRef.current) {
        setScrollPosition({
          x: viewportRef.current.scrollLeft,
          y: viewportRef.current.scrollTop,
        });
      }
      event.preventDefault();
    } else if (isLeftClick && currentTool?.category === 'select') {
      // Start selection
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && mousePosition.pageId) {
        setIsSelecting(true);
        setSelectionBox({
          startX: event.clientX - rect.left,
          startY: event.clientY - rect.top,
          endX: event.clientX - rect.left,
          endY: event.clientY - rect.top,
          pageId: mousePosition.pageId,
        });
      }
    } else if (isRightClick) {
      // Show context menu
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        elementId: hoveredElement || undefined,
      });
    }
  }, [enableInteraction, currentTool, mousePosition.pageId, hoveredElement]);

  // Handle mouse up
  const handleMouseUp = useCallback((event: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
    }
    
    if (isSelecting && selectionBox) {
      // Select elements within selection box
      const elementsInBox = findElementsInSelectionBox(selectionBox);
      if (elementsInBox.length > 0) {
        selectMultipleElements(elementsInBox);
      } else {
        clearSelection();
      }
      
      setIsSelecting(false);
      setSelectionBox(null);
    }
  }, [isDragging, isSelecting, selectionBox, selectMultipleElements, clearSelection]);

  // Handle wheel (zoom)
  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        
        const delta = event.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(Math.max(zoom * delta, MIN_ZOOM), MAX_ZOOM);
        
        setZoom(newZoom);
      }
    },
    [zoom, setZoom]
  );

  // Handle key down
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Zoom shortcuts
    if (event.ctrlKey || event.metaKey) {
      if (event.key === '=' || event.key === '+') {
        event.preventDefault();
        setZoom(Math.min(zoom * 1.1, MAX_ZOOM));
      } else if (event.key === '-') {
        event.preventDefault();
        setZoom(Math.max(zoom * 0.9, MIN_ZOOM));
      } else if (event.key === '0') {
        event.preventDefault();
        setZoom(DEFAULT_ZOOM);
      }
    }
    
    // Navigation shortcuts
    if (event.key === 'PageUp') {
      event.preventDefault();
      navigateToPreviousPage();
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      navigateToNextPage();
    }
    
    // Selection shortcuts
    if (event.key === 'Escape') {
      clearSelection();
      setActiveTextEdit(null);
      setContextMenu(null);
    }
    
    // Delete selected elements
    if (event.key === 'Delete' && selectedElements.length > 0) {
      deleteSelectedElements();
    }
  }, [zoom, setZoom, selectedElements, clearSelection]);

  // Update rulers
  const updateRulers = useCallback((mouseX: number, mouseY: number) => {
    if (!rulerHRef.current || !rulerVRef.current) return;
    
    const hCtx = rulerHRef.current.getContext('2d');
    const vCtx = rulerVRef.current.getContext('2d');
    
    if (!hCtx || !vCtx) return;
    
    // Clear rulers
    hCtx.clearRect(0, 0, rulerHRef.current.width, rulerHRef.current.height);
    vCtx.clearRect(0, 0, rulerVRef.current.width, rulerVRef.current.height);
    
    // Draw ruler markings
    hCtx.fillStyle = '#333';
    vCtx.fillStyle = '#333';
    hCtx.font = '10px sans-serif';
    vCtx.font = '10px sans-serif';
    
    // Horizontal ruler
    for (let i = 0; i < rulerHRef.current.width; i += 50) {
      const height = i % 100 === 0 ? 10 : 5;
      hCtx.fillRect(i, RULER_HEIGHT - height, 1, height);
      
      if (i % 100 === 0) {
        hCtx.fillText(String(Math.round(i / zoom)), i + 2, 10);
      }
    }
    
    // Vertical ruler
    for (let i = 0; i < rulerVRef.current.height; i += 50) {
      const width = i % 100 === 0 ? 10 : 5;
      vCtx.fillRect(RULER_HEIGHT - width, i, width, 1);
      
      if (i % 100 === 0) {
        vCtx.save();
        vCtx.translate(10, i + 2);
        vCtx.rotate(-Math.PI / 2);
        vCtx.fillText(String(Math.round(i / zoom)), 0, 0);
        vCtx.restore();
      }
    }
    
    // Draw mouse position indicators
    hCtx.fillStyle = '#007bff';
    vCtx.fillStyle = '#007bff';
    hCtx.fillRect(mouseX - 1, 0, 2, RULER_HEIGHT);
    vCtx.fillRect(0, mouseY - 1, RULER_HEIGHT, 2);
  }, [zoom]);

  // Draw grid
  const drawGrid = useCallback(() => {
    if (!canvasRef.current || !gridEnabled) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 0.5;
    
    const gridSize = DEFAULT_GRID_SIZE * zoom;
    
    // Draw vertical lines
    for (let x = 0; x < canvasRef.current.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasRef.current.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < canvasRef.current.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasRef.current.width, y);
      ctx.stroke();
    }
  }, [gridEnabled, zoom]);

  // Draw guides
  const drawGuides = useCallback(() => {
    if (!overlayRef.current || !guidesEnabled) return;
    
    // Clear existing guide elements
    const existingGuides = overlayRef.current.querySelectorAll('.guide-line');
    existingGuides.forEach(guide => guide.remove());
    
    guides.forEach(guide => {
      const guideLine = document.createElement('div');
      guideLine.className = 'guide-line';
      guideLine.style.position = 'absolute';
      guideLine.style.backgroundColor = guide.color;
      guideLine.style.opacity = '0.5';
      guideLine.style.pointerEvents = 'none';
      
      if (guide.type === 'horizontal') {
        guideLine.style.left = '0';
        guideLine.style.right = '0';
        guideLine.style.top = `${guide.position}px`;
        guideLine.style.height = '1px';
      } else {
        guideLine.style.top = '0';
        guideLine.style.bottom = '0';
        guideLine.style.left = `${guide.position}px`;
        guideLine.style.width = '1px';
      }
      
      overlayRef.current?.appendChild(guideLine);
    });
  }, [guidesEnabled, guides]);

  // Find elements in selection box
  const findElementsInSelectionBox = useCallback((box: SelectionBox): string[] => {
    if (!document) return [];
    
    const elements: string[] = [];
    const page = document.pages.find(p => p.id === box.pageId);
    
    if (!page) return [];
    
    const minX = Math.min(box.startX, box.endX) / zoom;
    const maxX = Math.max(box.startX, box.endX) / zoom;
    const minY = Math.min(box.startY, box.endY) / zoom;
    const maxY = Math.max(box.startY, box.endY) / zoom;
    
    // Check text elements
    page.text.forEach(text => {
      if (
        text.x >= minX &&
        text.x + text.width <= maxX &&
        text.y >= minY &&
        text.y + text.height <= maxY
      ) {
        elements.push(text.id);
      }
    });
    
    // Check image elements
    page.images.forEach(image => {
      if (
        image.x >= minX &&
        image.x + image.width <= maxX &&
        image.y >= minY &&
        image.y + image.height <= maxY
      ) {
        elements.push(image.id);
      }
    });
    
    // Check drawing elements
    page.drawings.forEach(drawing => {
      const bounds = getDrawingBounds(drawing);
      if (
        bounds.minX >= minX &&
        bounds.maxX <= maxX &&
        bounds.minY >= minY &&
        bounds.maxY <= maxY
      ) {
        elements.push(drawing.id);
      }
    });
    
    // Check annotations
    if (showAnnotations) {
      page.annotations.forEach(annotation => {
        if (
          annotation.x >= minX &&
          annotation.x + annotation.width <= maxX &&
          annotation.y >= minY &&
          annotation.y + annotation.height <= maxY
        ) {
          elements.push(annotation.id);
        }
      });
    }
    
    // Check form fields
    if (showFormFields) {
      page.forms.forEach(form => {
        if (
          form.x >= minX &&
          form.x + form.width <= maxX &&
          form.y >= minY &&
          form.y + form.height <= maxY
        ) {
          elements.push(form.id);
        }
      });
    }
    
    return elements;
  }, [document, zoom, showAnnotations, showFormFields]);

  // Get drawing bounds
  const getDrawingBounds = (drawing: DrawingElement) => {
    const points = drawing.points || [];
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    
    return {
      minX: xs.length > 0 ? Math.min(...xs) : 0,
      maxX: xs.length > 0 ? Math.max(...xs) : 0,
      minY: ys.length > 0 ? Math.min(...ys) : 0,
      maxY: ys.length > 0 ? Math.max(...ys) : 0,
    };
  };

  // Navigate to previous page
  const navigateToPreviousPage = useCallback(() => {
    if (!document || currentPage === 0) return;
    
    const prevPage = document.pages[currentPage - 1];
    if (prevPage) {
      navigateToPage(prevPage.id);
    }
  }, [document, currentPage, navigateToPage]);

  // Navigate to next page
  const navigateToNextPage = useCallback(() => {
    if (!document || currentPage >= document.pages.length - 1) return;
    
    const nextPage = document.pages[currentPage + 1];
    if (nextPage) {
      navigateToPage(nextPage.id);
    }
  }, [document, currentPage, navigateToPage]);

  // Delete selected elements
  const deleteSelectedElements = useCallback(() => {
    // Implementation would call store methods to delete elements
    console.log('Delete selected elements:', selectedElements);
  }, [selectedElements]);

  // Handle double click (edit text)
  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    if (!enableInteraction || !mousePosition.pageId) return;
    
    // Find clicked element
    const page = document?.pages.find(p => p.id === mousePosition.pageId);
    if (!page) return;
    
    // Check if clicked on text element
    const clickedText = page.text.find(text => {
      return (
        mousePosition.pageX >= text.x &&
        mousePosition.pageX <= text.x + text.width &&
        mousePosition.pageY >= text.y &&
        mousePosition.pageY <= text.y + text.height
      );
    });
    
    if (clickedText) {
      setActiveTextEdit(clickedText.id);
      setTextEditValue(clickedText.content);
      if (onElementEdit) {
        onElementEdit(clickedText.id);
      }
    }
  }, [enableInteraction, mousePosition, document, onElementEdit]);

  // Render page content
  const renderPageContent = useCallback((page: PDFPage) => {
    const viewport = pageViewports.get(page.id);
    if (!viewport) return null;
    
    return (
      <div
        key={page.id}
        className="relative"
        style={{
          width: viewport.width,
          height: viewport.height,
        }}
      >
        {/* Text elements */}
        {page.text.map(text => (
          <div
            key={text.id}
            className={cn(
              'absolute cursor-text select-none',
              selectedElements.includes(text.id) && 'ring-2 ring-blue-500',
              hoveredElement === text.id && 'ring-1 ring-blue-300'
            )}
            style={{
              left: text.x * zoom,
              top: text.y * zoom,
              width: text.width * zoom,
              height: text.height * zoom,
              fontSize: text.fontSize * zoom,
              fontFamily: text.fontFamily,
              fontWeight: text.fontWeight,
              fontStyle: text.fontStyle,
              color: text.color,
              opacity: text.opacity,
              transform: `rotate(${text.rotation}deg)`,
              zIndex: text.zIndex,
            }}
            onMouseEnter={() => setHoveredElement(text.id)}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={() => selectElement(text.id)}
            onDoubleClick={handleDoubleClick}
          >
            {activeTextEdit === text.id ? (
              <input
                type="text"
                value={textEditValue}
                onChange={(e) => setTextEditValue(e.target.value)}
                onBlur={() => {
                  // Update text content
                  setActiveTextEdit(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setActiveTextEdit(null);
                  } else if (e.key === 'Escape') {
                    setActiveTextEdit(null);
                    setTextEditValue(text.content);
                  }
                }}
                className="w-full h-full bg-transparent outline-none"
                autoFocus
              />
            ) : (
              text.content
            )}
          </div>
        ))}
        
        {/* Image elements */}
        {page.images.map(image => (
          <div
            key={image.id}
            className={cn(
              'absolute cursor-move',
              selectedElements.includes(image.id) && 'ring-2 ring-blue-500',
              hoveredElement === image.id && 'ring-1 ring-blue-300'
            )}
            style={{
              left: image.x * zoom,
              top: image.y * zoom,
              width: image.width * zoom,
              height: image.height * zoom,
              opacity: image.opacity,
              transform: `rotate(${image.rotation}deg) ${image.flipHorizontal ? 'scaleX(-1)' : ''} ${image.flipVertical ? 'scaleY(-1)' : ''}`,
              zIndex: image.zIndex,
            }}
            onMouseEnter={() => setHoveredElement(image.id)}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={() => selectElement(image.id)}
          >
            <img
              src={image.src}
              alt=""
              className="w-full h-full object-contain"
              style={{
                filter: `
                  brightness(${image.filters.brightness}%)
                  contrast(${image.filters.contrast}%)
                  saturate(${image.filters.saturation}%)
                  hue-rotate(${image.filters.hue}deg)
                  blur(${image.filters.blur}px)
                  grayscale(${image.filters.grayscale}%)
                  sepia(${image.filters.sepia}%)
                  invert(${image.filters.invert}%)
                `,
              }}
            />
          </div>
        ))}
        
        {/* Drawing elements */}
        {showDrawings && page.drawings.map(drawing => (
          <svg
            key={drawing.id}
            className={cn(
              'absolute pointer-events-none',
              selectedElements.includes(drawing.id) && 'ring-2 ring-blue-500'
            )}
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              zIndex: drawing.zIndex,
            }}
          >
            {drawing.type === 'pen' || drawing.type === 'pencil' ? (
              <path
                d={`M ${(drawing.points || []).map(p => `${p.x * zoom},${p.y * zoom}`).join(' L ')}`}
                stroke={drawing.strokeColor}
                strokeWidth={drawing.strokeWidth * zoom}
                fill="none"
                opacity={drawing.opacity}
                strokeLinecap={drawing.lineCap}
                strokeLinejoin={drawing.lineJoin}
              />
            ) : drawing.type === 'line' ? (
              <line
                x1={drawing.points[0].x * zoom}
                y1={drawing.points[0].y * zoom}
                x2={drawing.points[1].x * zoom}
                y2={drawing.points[1].y * zoom}
                stroke={drawing.strokeColor}
                strokeWidth={drawing.strokeWidth * zoom}
                opacity={drawing.opacity}
              />
            ) : drawing.type === 'rectangle' ? (
              <rect
                x={Math.min(drawing.points[0].x, drawing.points[1].x) * zoom}
                y={Math.min(drawing.points[0].y, drawing.points[1].y) * zoom}
                width={Math.abs(drawing.points[1].x - drawing.points[0].x) * zoom}
                height={Math.abs(drawing.points[1].y - drawing.points[0].y) * zoom}
                stroke={drawing.strokeColor}
                strokeWidth={drawing.strokeWidth * zoom}
                fill={drawing.fillColor || 'none'}
                opacity={drawing.opacity}
              />
            ) : drawing.type === 'circle' ? (
              <circle
                cx={(drawing.points[0].x + drawing.points[1].x) / 2 * zoom}
                cy={(drawing.points[0].y + drawing.points[1].y) / 2 * zoom}
                r={Math.sqrt(
                  Math.pow(drawing.points[1].x - drawing.points[0].x, 2) +
                  Math.pow(drawing.points[1].y - drawing.points[0].y, 2)
                ) / 2 * zoom}
                stroke={drawing.strokeColor}
                strokeWidth={drawing.strokeWidth * zoom}
                fill={drawing.fillColor || 'none'}
                opacity={drawing.opacity}
              />
            ) : null}
          </svg>
        ))}
        
        {/* Annotations */}
        {showAnnotations && page.annotations.map(annotation => (
          <div
            key={annotation.id}
            className={cn(
              'absolute',
              selectedElements.includes(annotation.id) && 'ring-2 ring-blue-500',
              hoveredElement === annotation.id && 'ring-1 ring-blue-300'
            )}
            style={{
              left: annotation.x * zoom,
              top: annotation.y * zoom,
              width: annotation.width * zoom,
              height: annotation.height * zoom,
              backgroundColor: annotation.type === 'highlight' ? annotation.color : 'transparent',
              borderBottom: annotation.type === 'underline' ? `2px solid ${annotation.color}` : 'none',
              opacity: annotation.opacity,
              zIndex: annotation.zIndex,
            }}
            onMouseEnter={() => setHoveredElement(annotation.id)}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={() => selectElement(annotation.id)}
            title={annotation.content}
          >
            {annotation.type === 'note' && (
              <div className="w-6 h-6 bg-yellow-400 rounded-sm shadow-md flex items-center justify-center">
                <span className="text-xs">📝</span>
              </div>
            )}
          </div>
        ))}
        
        {/* Form fields */}
        {showFormFields && page.forms.map(form => (
          <div
            key={form.id}
            className={cn(
              'absolute border border-gray-300',
              selectedElements.includes(form.id) && 'ring-2 ring-blue-500',
              hoveredElement === form.id && 'ring-1 ring-blue-300'
            )}
            style={{
              left: form.x * zoom,
              top: form.y * zoom,
              width: form.width * zoom,
              height: form.height * zoom,
            }}
            onMouseEnter={() => setHoveredElement(form.id)}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={() => selectElement(form.id)}
          >
            {form.type === 'text' && (
              <input
                type="text"
                className="w-full h-full px-2 bg-white"
                placeholder={form.name}
                defaultValue={form.value || form.defaultValue}
                readOnly={form.readOnly}
                required={form.required}
                maxLength={form.maxLength}
              />
            )}
            {form.type === 'checkbox' && (
              <input
                type="checkbox"
                className="w-full h-full"
                defaultChecked={form.value || form.defaultValue}
                disabled={form.readOnly}
                required={form.required}
              />
            )}
            {form.type === 'radio' && (
              <input
                type="radio"
                name={form.name}
                className="w-full h-full"
                defaultChecked={form.value || form.defaultValue}
                disabled={form.readOnly}
                required={form.required}
              />
            )}
            {form.type === 'dropdown' && (
              <select
                className="w-full h-full px-2 bg-white"
                defaultValue={form.value || form.defaultValue}
                disabled={form.readOnly}
                required={form.required}
              >
                {form.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    );
  }, [
    pageViewports,
    zoom,
    selectedElements,
    hoveredElement,
    activeTextEdit,
    textEditValue,
    showAnnotations,
    showFormFields,
    showDrawings,
    selectElement,
    handleDoubleClick,
  ]);

  // Render view based on mode
  const renderView = useMemo(() => {
    if (!document) return null;
    
    switch (viewMode) {
      case 'single':
        const currentPageData = document.pages.find(p => p.id === currentPageId);
        if (!currentPageData) return null;
        return renderPageContent(currentPageData);
        
      case 'continuous':
        return (
          <div className="space-y-5">
            {document.pages.map(page => (
              <div key={page.id} className="shadow-lg">
                {renderPageContent(page)}
              </div>
            ))}
          </div>
        );
        
      case 'two-page':
        const currentIndex = document.pages.findIndex(p => p.id === currentPageId);
        const leftPage = document.pages[currentIndex];
        const rightPage = document.pages[currentIndex + 1];
        
        return (
          <div className="flex gap-5">
            {leftPage && (
              <div className="shadow-lg">
                {renderPageContent(leftPage)}
              </div>
            )}
            {rightPage && (
              <div className="shadow-lg">
                {renderPageContent(rightPage)}
              </div>
            )}
          </div>
        );
        
      case 'thumbnail':
        return (
          <div className="grid grid-cols-4 gap-4">
            {document.pages.map(page => (
              <div
                key={page.id}
                className={cn(
                  'cursor-pointer border-2 p-2',
                  currentPageId === page.id ? 'border-blue-500' : 'border-gray-300'
                )}
                onClick={() => navigateToPage(page.id)}
              >
                <div className="text-xs text-center mb-1">Page {page.pageNumber}</div>
                <div className="transform scale-[0.2] origin-top-left">
                  {renderPageContent(page)}
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  }, [document, viewMode, currentPageId, renderPageContent, navigateToPage]);

  // Effects
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  useEffect(() => {
    drawGuides();
  }, [drawGuides]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Context menu
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full overflow-hidden bg-gray-100', className)}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      {/* Rulers */}
      {rulersEnabled && (
        <>
          <canvas
            ref={rulerHRef}
            className="absolute top-0 left-0 bg-gray-200 z-20"
            width={containerWidth}
            height={RULER_HEIGHT}
          />
          <canvas
            ref={rulerVRef}
            className="absolute top-0 left-0 bg-gray-200 z-20"
            width={RULER_HEIGHT}
            height={containerHeight}
          />
        </>
      )}
      
      {/* Grid canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        width={containerWidth}
        height={containerHeight}
      />
      
      {/* Viewport */}
      <div
        ref={viewportRef}
        className={cn(
          'absolute overflow-auto',
          rulersEnabled ? 'top-5 left-5' : 'inset-0'
        )}
        style={{
          width: rulersEnabled ? `calc(100% - ${RULER_HEIGHT}px)` : '100%',
          height: rulersEnabled ? `calc(100% - ${RULER_HEIGHT}px)` : '100%',
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        <div className="flex items-center justify-center min-h-full p-10">
          {isLoading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              <p className="mt-2 text-gray-600">Loading PDF...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-600">
              <p className="text-xl mb-2">Error loading PDF</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {!isLoading && !error && document && renderView}
        </div>
      </div>
      
      {/* Overlay for guides and selection */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-10"
      >
        {/* Selection box */}
        {isSelecting && selectionBox && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10"
            style={{
              left: Math.min(selectionBox.startX, selectionBox.endX),
              top: Math.min(selectionBox.startY, selectionBox.endY),
              width: Math.abs(selectionBox.endX - selectionBox.startX),
              height: Math.abs(selectionBox.endY - selectionBox.startY),
            }}
          />
        )}
      </div>
      
      {/* Context menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bg-white rounded-lg shadow-lg py-2 z-50"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <button className="px-4 py-2 hover:bg-gray-100 w-full text-left text-sm">
              Cut
            </button>
            <button className="px-4 py-2 hover:bg-gray-100 w-full text-left text-sm">
              Copy
            </button>
            <button className="px-4 py-2 hover:bg-gray-100 w-full text-left text-sm">
              Paste
            </button>
            <hr className="my-1" />
            <button className="px-4 py-2 hover:bg-gray-100 w-full text-left text-sm">
              Delete
            </button>
            <button className="px-4 py-2 hover:bg-gray-100 w-full text-left text-sm">
              Properties
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-xs px-4 py-1 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <span>Page {currentPage + 1} of {document?.pages.length || 0}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          {mousePosition.pageId && (
            <span>Position: {Math.round(mousePosition.pageX)}, {Math.round(mousePosition.pageY)}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {selectedElements.length > 0 && (
            <span>{selectedElements.length} element(s) selected</span>
          )}
          <span>{viewMode} view</span>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;