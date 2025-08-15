import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  PDFDocument,
  PDFPage,
  Tool,
  EditorState,
  ViewMode,
  ClipboardData,
  EditorAction,
  Guide,
  Annotation,
  FormField,
  TextElement,
  ImageElement,
  DrawingElement,
  Signature,
  Watermark,
  User,
  UserPreferences,
  HistoryState,
  ActionType
} from '@/types';
import { pdfManager } from '@/lib/pdf/pdf-manager';
import { generateId } from '@/lib/utils/index';
import {
  DEFAULT_ZOOM,
  MAX_HISTORY_SIZE,
  DEFAULT_TOOL,
  DEFAULT_GRID_SIZE,
  DEFAULT_SNAP_DISTANCE
} from '@/lib/constants/index';

interface EditorStore extends EditorState {
  // Document
  document: PDFDocument | null;
  currentPageId: string | null;
  
  // User
  user: User | null;
  preferences: UserPreferences | null;
  
  // State
  error: string | null;
  
  // Actions - Document
  loadDocument: (source: File | string | ArrayBuffer) => Promise<void>;
  createNewDocument: (pageCount?: number) => Promise<void>;
  createDocument: (pageCount?: number) => Promise<void>; // Alias for createNewDocument
  saveDocument: () => Promise<Uint8Array | null>;
  exportDocument: (format: string, options?: any) => Promise<Blob | null>;
  closeDocument: () => void;
  
  // Actions - Pages
  addPage: (options?: any) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  duplicatePage: (pageId: string) => Promise<void>;
  rotatePage: (pageId: string, angle: 90 | 180 | 270) => Promise<void>;
  reorderPages: (newOrder: string[]) => Promise<void>;
  navigateToPage: (pageId: string) => void;
  nextPage: () => void;
  previousPage: () => void;
  
  // Actions - Tools
  setCurrentTool: (tool: Tool) => void;
  updateToolSettings: (settings: any) => void;
  
  // Actions - Selection
  selectElement: (elementId: string) => void;
  selectMultipleElements: (elementIds: string[]) => void;
  clearSelection: () => void;
  deselectAll: () => void; // Alias for clearSelection
  selectAll: () => void;
  deleteSelected: () => void;
  deleteSelection: () => void; // Alias for deleteSelected
  
  // Actions - Clipboard
  copy: () => void;
  cut: () => void;
  paste: () => void;
  
  // Actions - History
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  addToHistory: (action: EditorAction) => void;
  
  // Actions - View
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  zoomToWidth: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  toggleRulers: () => void;
  toggleGuides: () => void;
  toggleFullscreen: () => void;
  resetView: () => void;
  addGuide: (guide: Guide) => void;
  removeGuide: (guideId: string) => void;
  updateGuide: (guideId: string, updates: Partial<Guide>) => void;
  
  // Actions - Elements
  addText: (pageId: string, text: string, options: any) => Promise<void>;
  updateText: (elementId: string, updates: Partial<TextElement>) => void;
  deleteText: (elementId: string) => void;
  
  addImage: (pageId: string, imageData: any, options: any) => Promise<void>;
  updateImage: (elementId: string, updates: Partial<ImageElement>) => void;
  deleteImage: (elementId: string) => void;
  
  addDrawing: (pageId: string, type: string, options: any) => Promise<void>;
  updateDrawing: (elementId: string, updates: Partial<DrawingElement>) => void;
  deleteDrawing: (elementId: string) => void;
  
  addAnnotation: (pageId: string, type: string, options: any) => Promise<void>;
  updateAnnotation: (annotationId: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (annotationId: string) => void;
  
  addFormField: (pageId: string, type: string, options: any) => Promise<void>;
  updateFormField: (fieldId: string, updates: Partial<FormField>) => void;
  deleteFormField: (fieldId: string) => void;
  
  addSignature: (pageId: string, signatureData: string, options: any) => Promise<void>;
  updateSignature: (signatureId: string, updates: Partial<Signature>) => void;
  deleteSignature: (signatureId: string) => void;
  
  addWatermark: (watermark: Watermark) => Promise<void>;
  updateWatermark: (watermarkId: string, updates: Partial<Watermark>) => void;
  deleteWatermark: (watermarkId: string) => void;
  
  // Actions - User
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Actions - UI State
  setIsSaving: (isSaving: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsDirty: (isDirty: boolean) => void;
  
  // Utility functions
  getCurrentPage: () => PDFPage | null;
  getElementById: (elementId: string) => any;
  getSelectedElements: () => any[];
  canUndo: () => boolean;
  canRedo: () => boolean;
  canPaste: () => boolean;
}

const initialState: EditorState = {
  currentTool: null,
  selectedElements: [],
  clipboard: null,
  history: {
    past: [],
    present: null,
    future: [],
    maxSize: MAX_HISTORY_SIZE
  },
  zoom: DEFAULT_ZOOM,
  currentPage: 0,
  viewMode: 'single',
  gridEnabled: false,
  snapToGrid: false,
  rulersEnabled: true,
  guidesEnabled: true,
  guides: [],
  isDirty: false,
  isSaving: false,
  isLoading: false
};

export const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        document: null,
        currentPageId: null,
        user: null,
        preferences: null,
        error: null,

        // Document actions
        loadDocument: async (source) => {
          set((state) => {
            state.isLoading = true;
          });
          
          try {
            const doc = await pdfManager.loadPDF(source);
            const firstPageId = doc.pages[0]?.id;
            
            set((state) => {
              state.document = doc;
              state.currentPageId = firstPageId;
              state.currentPage = 0;
              state.isLoading = false;
              state.isDirty = false;
            });
          } catch (error) {
            console.error('Failed to load document:', error);
            set((state) => {
              state.isLoading = false;
            });
            throw error;
          }
        },

        createNewDocument: async (pageCount = 1) => {
          set((state) => {
            state.isLoading = true;
          });
          
          try {
            const doc = await pdfManager.createNewPDF(pageCount);
            const firstPageId = doc.pages[0]?.id;
            
            set((state) => {
              state.document = doc;
              state.currentPageId = firstPageId;
              state.currentPage = 0;
              state.isLoading = false;
              state.isDirty = false;
            });
          } catch (error) {
            console.error('Failed to create document:', error);
            set((state) => {
              state.isLoading = false;
            });
            throw error;
          }
        },

        // Alias for createNewDocument
        createDocument: async (pageCount?: number) => {
          return get().createNewDocument(pageCount);
        },

        saveDocument: async () => {
          const { document } = get();
          if (!document) return null;
          
          set((state) => {
            state.isSaving = true;
          });
          
          try {
            const pdfBytes = await pdfManager.save();
            
            set((state) => {
              state.isSaving = false;
              state.isDirty = false;
            });
            
            return pdfBytes;
          } catch (error) {
            console.error('Failed to save document:', error);
            set((state) => {
              state.isSaving = false;
            });
            throw error;
          }
        },

        exportDocument: async (format, options) => {
          const { document } = get();
          if (!document) return null;
          
          set((state) => {
            state.isSaving = true;
          });
          
          try {
            let blob: Blob;
            
            if (format === 'pdf') {
              const pdfBytes = await pdfManager.save(options);
              blob = new Blob([pdfBytes], { type: 'application/pdf' });
            } else if (format === 'png' || format === 'jpg') {
              const { currentPage } = get();
              const imageData = await pdfManager.exportAsImage(currentPage + 1, format);
              // Convert data URL to blob
              const response = await fetch(imageData);
              blob = await response.blob();
            } else {
              throw new Error(`Unsupported format: ${format}`);
            }
            
            set((state) => {
              state.isSaving = false;
            });
            
            return blob;
          } catch (error) {
            console.error('Failed to export document:', error);
            set((state) => {
              state.isSaving = false;
            });
            throw error;
          }
        },

        closeDocument: () => {
          set((state) => {
            state.document = null;
            state.currentPageId = null;
            state.currentPage = 0;
            state.selectedElements = [];
            state.clipboard = null;
            state.history = initialState.history;
            state.isDirty = false;
          });
        },

        // Page actions
        addPage: async (options) => {
          try {
            const newPage = await pdfManager.addPage(options);
            
            set((state) => {
              if (state.document) {
                state.document.pages.push(newPage);
                state.currentPageId = newPage.id;
                state.currentPage = newPage.pageNumber - 1;
                state.isDirty = true;
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'add',
              timestamp: new Date(),
              data: { page: newPage },
              description: 'Add page'
            });
          } catch (error) {
            console.error('Failed to add page:', error);
            throw error;
          }
        },

        deletePage: async (pageId) => {
          try {
            await pdfManager.deletePage(pageId);
            
            set((state) => {
              if (state.document) {
                const pageIndex = state.document.pages.findIndex(p => p.id === pageId);
                if (pageIndex !== -1) {
                  state.document.pages.splice(pageIndex, 1);
                  
                  // Update current page if needed
                  if (state.currentPageId === pageId) {
                    const newPage = state.document.pages[Math.min(pageIndex, state.document.pages.length - 1)];
                    state.currentPageId = newPage?.id || null;
                    state.currentPage = Math.min(pageIndex, state.document.pages.length - 1);
                  }
                  
                  state.isDirty = true;
                }
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'delete',
              timestamp: new Date(),
              data: { pageId },
              description: 'Delete page'
            });
          } catch (error) {
            console.error('Failed to delete page:', error);
            throw error;
          }
        },

        duplicatePage: async (pageId) => {
          try {
            const page = pdfManager.getPage(pageId);
            if (!page) throw new Error('Page not found');
            
            const newPage = await pdfManager.addPage({
              width: page.width,
              height: page.height,
              position: page.pageNumber
            });
            
            // Copy content from original page
            // This would need to be implemented in PDFManager
            
            set((state) => {
              if (state.document) {
                state.document.pages.splice(page.pageNumber, 0, newPage);
                state.currentPageId = newPage.id;
                state.currentPage = newPage.pageNumber - 1;
                state.isDirty = true;
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'add',
              timestamp: new Date(),
              data: { page: newPage },
              description: 'Duplicate page'
            });
          } catch (error) {
            console.error('Failed to duplicate page:', error);
            throw error;
          }
        },

        rotatePage: async (pageId, angle) => {
          try {
            await pdfManager.rotatePage(pageId, angle);
            
            set((state) => {
              if (state.document) {
                const page = state.document.pages.find(p => p.id === pageId);
                if (page) {
                  page.rotation = (page.rotation + angle) % 360;
                  
                  // Swap width and height if rotating 90 or 270 degrees
                  if (angle === 90 || angle === 270) {
                    const temp = page.width;
                    page.width = page.height;
                    page.height = temp;
                  }
                  
                  state.isDirty = true;
                }
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'rotate',
              timestamp: new Date(),
              data: { pageId, angle },
              description: `Rotate page ${angle}°`
            });
          } catch (error) {
            console.error('Failed to rotate page:', error);
            throw error;
          }
        },

        reorderPages: async (newOrder) => {
          try {
            await pdfManager.reorderPages(newOrder);
            
            set((state) => {
              if (state.document) {
                const reorderedPages = newOrder.map(id => 
                  state.document!.pages.find(p => p.id === id)!
                );
                state.document.pages = reorderedPages;
                
                // Update page numbers
                reorderedPages.forEach((page, index) => {
                  page.pageNumber = index + 1;
                });
                
                state.isDirty = true;
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'reorder',
              timestamp: new Date(),
              data: { newOrder },
              description: 'Reorder pages'
            });
          } catch (error) {
            console.error('Failed to reorder pages:', error);
            throw error;
          }
        },

        navigateToPage: (pageId) => {
          set((state) => {
            if (state.document) {
              const pageIndex = state.document.pages.findIndex(p => p.id === pageId);
              if (pageIndex !== -1) {
                state.currentPageId = pageId;
                state.currentPage = pageIndex;
              }
            }
          });
        },

        nextPage: () => {
          set((state) => {
            if (state.document && state.currentPage < state.document.pages.length - 1) {
              state.currentPage++;
              state.currentPageId = state.document.pages[state.currentPage].id;
            }
          });
        },

        previousPage: () => {
          set((state) => {
            if (state.document && state.currentPage > 0) {
              state.currentPage--;
              state.currentPageId = state.document.pages[state.currentPage].id;
            }
          });
        },

        // Tool actions
        setCurrentTool: (tool) => {
          set((state) => {
            state.currentTool = tool;
          });
        },

        updateToolSettings: (settings) => {
          set((state) => {
            if (state.currentTool) {
              state.currentTool.settings = { ...state.currentTool.settings, ...settings };
            }
          });
        },

        // Selection actions
        selectElement: (elementId) => {
          set((state) => {
            state.selectedElements = [elementId];
          });
        },

        selectMultipleElements: (elementIds) => {
          set((state) => {
            state.selectedElements = elementIds;
          });
        },

        clearSelection: () => {
          set((state) => {
            state.selectedElements = [];
          });
        },

        // Alias for clearSelection
        deselectAll: () => {
          get().clearSelection();
        },

        selectAll: () => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const allElements = [
                  ...page.annotations.map(a => a.id),
                  ...page.text.map(t => t.id),
                  ...page.images.map(i => i.id),
                  ...page.drawings.map(d => d.id)
                ];
                state.selectedElements = allElements;
              }
            }
          });
        },

        deleteSelected: () => {
          const { selectedElements } = get();
          
          selectedElements.forEach(elementId => {
            // Find and delete element
            // This would need to be implemented for each element type
          });
          
          set((state) => {
            state.selectedElements = [];
            state.isDirty = true;
          });
          
          get().addToHistory({
            id: generateId(),
            type: 'delete',
            timestamp: new Date(),
            data: { elementIds: selectedElements },
            description: 'Delete selected elements'
          });
        },

        // Alias for deleteSelected
        deleteSelection: () => {
          get().deleteSelected();
        },

        // Clipboard actions
        copy: () => {
          const { selectedElements } = get();
          if (selectedElements.length === 0) return;
          
          const elements = get().getSelectedElements();
          
          set((state) => {
            state.clipboard = {
              type: 'elements',
              data: elements,
              timestamp: new Date()
            };
          });
        },

        cut: () => {
          get().copy();
          get().deleteSelected();
        },

        paste: () => {
          const { clipboard, currentPageId } = get();
          if (!clipboard || !currentPageId) return;
          
          // Paste elements to current page
          // This would need to be implemented
          
          set((state) => {
            state.isDirty = true;
          });
          
          get().addToHistory({
            id: generateId(),
            type: 'add',
            timestamp: new Date(),
            data: { clipboard },
            description: 'Paste elements'
          });
        },

        // History actions
        undo: () => {
          set((state) => {
            if (state.history.past.length === 0) return;
            
            const action = state.history.past[state.history.past.length - 1];
            state.history.past.pop();
            
            if (state.history.present) {
              state.history.future.unshift(state.history.present);
            }
            
            state.history.present = action;
            
            // Apply undo logic based on action type
            // This would need to be implemented
          });
        },

        redo: () => {
          set((state) => {
            if (state.history.future.length === 0) return;
            
            const action = state.history.future[0];
            state.history.future.shift();
            
            if (state.history.present) {
              state.history.past.push(state.history.present);
            }
            
            state.history.present = action;
            
            // Apply redo logic based on action type
            // This would need to be implemented
          });
        },

        clearHistory: () => {
          set((state) => {
            state.history = initialState.history;
          });
        },

        addToHistory: (action) => {
          set((state) => {
            if (state.history.present) {
              state.history.past.push(state.history.present);
            }
            
            state.history.present = action;
            state.history.future = [];
            
            // Limit history size
            if (state.history.past.length > state.history.maxSize) {
              state.history.past.shift();
            }
          });
        },

        // View actions
        setZoom: (zoom) => {
          set((state) => {
            state.zoom = zoom;
          });
        },

        zoomIn: () => {
          set((state) => {
            state.zoom = Math.min(state.zoom * 1.25, 5);
          });
        },

        zoomOut: () => {
          set((state) => {
            state.zoom = Math.max(state.zoom * 0.8, 0.1);
          });
        },

        zoomToFit: () => {
          // Calculate zoom to fit page in viewport
          // This would need viewport dimensions
          set((state) => {
            state.zoom = 1;
          });
        },

        zoomToWidth: () => {
          // Calculate zoom to fit page width in viewport
          // This would need viewport dimensions
          set((state) => {
            state.zoom = 1;
          });
        },

        setViewMode: (mode) => {
          set((state) => {
            state.viewMode = mode;
          });
        },

        toggleGrid: () => {
          set((state) => {
            state.gridEnabled = !state.gridEnabled;
          });
        },

        toggleSnapToGrid: () => {
          set((state) => {
            state.snapToGrid = !state.snapToGrid;
          });
        },

        toggleRulers: () => {
          set((state) => {
            state.rulersEnabled = !state.rulersEnabled;
          });
        },

        toggleGuides: () => {
          set((state) => {
            state.guidesEnabled = !state.guidesEnabled;
          });
        },

        toggleFullscreen: () => {
          // Toggle fullscreen mode
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        },

        resetView: () => {
          set((state) => {
            state.zoom = DEFAULT_ZOOM;
            state.viewMode = 'single';
            state.currentPage = 0;
            if (state.document && state.document.pages.length > 0) {
              state.currentPageId = state.document.pages[0].id;
            }
          });
        },

        addGuide: (guide) => {
          set((state) => {
            state.guides.push(guide);
          });
        },

        removeGuide: (guideId) => {
          set((state) => {
            const index = state.guides.findIndex(g => g.id === guideId);
            if (index !== -1) {
              state.guides.splice(index, 1);
            }
          });
        },

        updateGuide: (guideId, updates) => {
          set((state) => {
            const guide = state.guides.find(g => g.id === guideId);
            if (guide) {
              Object.assign(guide, updates);
            }
          });
        },

        // Element actions
        addText: async (pageId, text, options) => {
          try {
            const textElement = await pdfManager.addText(pageId, text, options);
            
            set((state) => {
              if (state.document) {
                const page = state.document.pages.find(p => p.id === pageId);
                if (page) {
                  page.text.push(textElement);
                  state.isDirty = true;
                }
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'add',
              timestamp: new Date(),
              data: { element: textElement },
              description: 'Add text'
            });
          } catch (error) {
            console.error('Failed to add text:', error);
            throw error;
          }
        },

        updateText: (elementId, updates) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const text = page.text.find(t => t.id === elementId);
                if (text) {
                  Object.assign(text, updates);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        deleteText: (elementId) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const index = page.text.findIndex(t => t.id === elementId);
                if (index !== -1) {
                  page.text.splice(index, 1);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        addImage: async (pageId, imageData, options) => {
          try {
            const imageElement = await pdfManager.addImage(pageId, imageData, options);
            
            set((state) => {
              if (state.document) {
                const page = state.document.pages.find(p => p.id === pageId);
                if (page) {
                  page.images.push(imageElement);
                  state.isDirty = true;
                }
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'add',
              timestamp: new Date(),
              data: { element: imageElement },
              description: 'Add image'
            });
          } catch (error) {
            console.error('Failed to add image:', error);
            throw error;
          }
        },

        updateImage: (elementId, updates) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const image = page.images.find(i => i.id === elementId);
                if (image) {
                  Object.assign(image, updates);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        deleteImage: (elementId) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const index = page.images.findIndex(i => i.id === elementId);
                if (index !== -1) {
                  page.images.splice(index, 1);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        addDrawing: async (pageId, type, options) => {
          try {
            const drawingElement = await pdfManager.addDrawing(pageId, type as any, options);
            
            set((state) => {
              if (state.document) {
                const page = state.document.pages.find(p => p.id === pageId);
                if (page) {
                  page.drawings.push(drawingElement);
                  state.isDirty = true;
                }
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'add',
              timestamp: new Date(),
              data: { element: drawingElement },
              description: 'Add drawing'
            });
          } catch (error) {
            console.error('Failed to add drawing:', error);
            throw error;
          }
        },

        updateDrawing: (elementId, updates) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const drawing = page.drawings.find(d => d.id === elementId);
                if (drawing) {
                  Object.assign(drawing, updates);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        deleteDrawing: (elementId) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const index = page.drawings.findIndex(d => d.id === elementId);
                if (index !== -1) {
                  page.drawings.splice(index, 1);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        addAnnotation: async (pageId, type, options) => {
          try {
            const annotation = await pdfManager.addAnnotation(pageId, type as any, options);
            
            set((state) => {
              if (state.document) {
                const page = state.document.pages.find(p => p.id === pageId);
                if (page) {
                  page.annotations.push(annotation);
                  state.isDirty = true;
                }
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'add',
              timestamp: new Date(),
              data: { element: annotation },
              description: 'Add annotation'
            });
          } catch (error) {
            console.error('Failed to add annotation:', error);
            throw error;
          }
        },

        updateAnnotation: (annotationId, updates) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const annotation = page.annotations.find(a => a.id === annotationId);
                if (annotation) {
                  Object.assign(annotation, updates);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        deleteAnnotation: (annotationId) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const index = page.annotations.findIndex(a => a.id === annotationId);
                if (index !== -1) {
                  page.annotations.splice(index, 1);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        addFormField: async (pageId, type, options) => {
          try {
            const formField = await pdfManager.addFormField(pageId, type as any, options);
            
            set((state) => {
              if (state.document) {
                const page = state.document.pages.find(p => p.id === pageId);
                if (page) {
                  page.forms.push(formField);
                  state.isDirty = true;
                }
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'add',
              timestamp: new Date(),
              data: { element: formField },
              description: 'Add form field'
            });
          } catch (error) {
            console.error('Failed to add form field:', error);
            throw error;
          }
        },

        updateFormField: (fieldId, updates) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const field = page.forms.find(f => f.id === fieldId);
                if (field) {
                  Object.assign(field, updates);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        deleteFormField: (fieldId) => {
          set((state) => {
            if (state.document && state.currentPageId) {
              const page = state.document.pages.find(p => p.id === state.currentPageId);
              if (page) {
                const index = page.forms.findIndex(f => f.id === fieldId);
                if (index !== -1) {
                  page.forms.splice(index, 1);
                  state.isDirty = true;
                }
              }
            }
          });
        },

        addSignature: async (pageId, signatureData, options) => {
          try {
            const signature = await pdfManager.addSignature(pageId, signatureData, options);
            
            set((state) => {
              if (state.document) {
                state.document.signatures.push(signature);
                state.isDirty = true;
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'add',
              timestamp: new Date(),
              data: { element: signature },
              description: 'Add signature'
            });
          } catch (error) {
            console.error('Failed to add signature:', error);
            throw error;
          }
        },

        updateSignature: (signatureId, updates) => {
          set((state) => {
            if (state.document) {
              const signature = state.document.signatures.find(s => s.id === signatureId);
              if (signature) {
                Object.assign(signature, updates);
                state.isDirty = true;
              }
            }
          });
        },

        deleteSignature: (signatureId) => {
          set((state) => {
            if (state.document) {
              const index = state.document.signatures.findIndex(s => s.id === signatureId);
              if (index !== -1) {
                state.document.signatures.splice(index, 1);
                state.isDirty = true;
              }
            }
          });
        },

        addWatermark: async (watermark) => {
          try {
            await pdfManager.addWatermark(watermark);
            
            set((state) => {
              if (state.document) {
                state.document.watermarks.push(watermark);
                state.isDirty = true;
              }
            });
            
            get().addToHistory({
              id: generateId(),
              type: 'add',
              timestamp: new Date(),
              data: { element: watermark },
              description: 'Add watermark'
            });
          } catch (error) {
            console.error('Failed to add watermark:', error);
            throw error;
          }
        },

        updateWatermark: (watermarkId, updates) => {
          set((state) => {
            if (state.document) {
              const watermark = state.document.watermarks.find(w => w.id === watermarkId);
              if (watermark) {
                Object.assign(watermark, updates);
                state.isDirty = true;
              }
            }
          });
        },

        deleteWatermark: (watermarkId) => {
          set((state) => {
            if (state.document) {
              const index = state.document.watermarks.findIndex(w => w.id === watermarkId);
              if (index !== -1) {
                state.document.watermarks.splice(index, 1);
                state.isDirty = true;
              }
            }
          });
        },

        // User actions
        setUser: (user) => {
          set((state) => {
            state.user = user;
            if (user) {
              state.preferences = user.preferences;
            }
          });
        },

        updatePreferences: (preferences) => {
          set((state) => {
            if (state.preferences) {
              Object.assign(state.preferences, preferences);
            } else {
              state.preferences = preferences as UserPreferences;
            }
            
            if (state.user) {
              state.user.preferences = state.preferences;
            }
          });
        },

        // UI State actions
        setIsSaving: (isSaving) => {
          set((state) => {
            state.isSaving = isSaving;
          });
        },

        setIsLoading: (isLoading) => {
          set((state) => {
            state.isLoading = isLoading;
          });
        },

        setIsDirty: (isDirty) => {
          set((state) => {
            state.isDirty = isDirty;
          });
        },

        // Utility functions
        getCurrentPage: () => {
          const { document, currentPageId } = get();
          if (!document || !currentPageId) return null;
          
          return document.pages.find(p => p.id === currentPageId) || null;
        },

        getElementById: (elementId) => {
          const { document } = get();
          if (!document) return null;
          
          // Search through all pages and element types
          for (const page of document.pages) {
            // Check annotations
            const annotation = page.annotations.find(a => a.id === elementId);
            if (annotation) return annotation;
            
            // Check text
            const text = page.text.find(t => t.id === elementId);
            if (text) return text;
            
            // Check images
            const image = page.images.find(i => i.id === elementId);
            if (image) return image;
            
            // Check drawings
            const drawing = page.drawings.find(d => d.id === elementId);
            if (drawing) return drawing;
            
            // Check forms
            const form = page.forms.find(f => f.id === elementId);
            if (form) return form;
          }
          
          // Check signatures
          const signature = document.signatures.find(s => s.id === elementId);
          if (signature) return signature;
          
          // Check watermarks
          const watermark = document.watermarks.find(w => w.id === elementId);
          if (watermark) return watermark;
          
          return null;
        },

        getSelectedElements: () => {
          const { selectedElements } = get();
          return selectedElements.map(id => get().getElementById(id)).filter(Boolean);
        },

        canUndo: () => {
          const { history } = get();
          return history.past.length > 0;
        },

        canRedo: () => {
          const { history } = get();
          return history.future.length > 0;
        },

        canPaste: () => {
          const { clipboard } = get();
          return clipboard !== null;
        }
      })),
      {
        name: 'pdf-editor-store',
        partialize: (state) => ({
          preferences: state.preferences,
          user: state.user
        })
      }
    )
  )
);