import { PDFDocument, PDFPage, rgb, degrees, StandardFonts, PDFFont, PDFImage } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  PDFDocument as PDFDocType,
  PDFPage as PDFPageType,
  PDFMetadata,
  Annotation,
  FormField,
  TextElement,
  ImageElement,
  DrawingElement,
  Signature,
  Watermark,
  ExportOptions,
  ImportOptions,
  PDFPermissions,
  WatermarkPosition
} from '@/types';
import { generateId, generateTimestamp } from '@/lib/utils';
import { 
  DEFAULT_PAGE_WIDTH, 
  DEFAULT_PAGE_HEIGHT,
  PAPER_SIZES,
  DEFAULT_WATERMARK_OPACITY,
  DEFAULT_WATERMARK_ROTATION
} from '@/lib/constants';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export class PDFManager {
  private document: PDFDocument | null = null;
  private originalDocument: PDFDocument | null = null;
  private pdfJsDocument: any = null;
  private metadata: PDFMetadata | null = null;
  private pages: Map<string, PDFPageType> = new Map();
  private annotations: Map<string, Annotation[]> = new Map();
  private formFields: Map<string, FormField[]> = new Map();
  private textElements: Map<string, TextElement[]> = new Map();
  private imageElements: Map<string, ImageElement[]> = new Map();
  private drawingElements: Map<string, DrawingElement[]> = new Map();
  private signatures: Map<string, Signature[]> = new Map();
  private watermarks: Watermark[] = [];
  private fonts: Map<string, PDFFont> = new Map();
  private images: Map<string, PDFImage> = new Map();
  private isModified = false;
  private documentId: string = '';

  constructor() {
    this.documentId = generateId();
  }

  // Load PDF from file or URL
  async loadPDF(source: File | string | ArrayBuffer): Promise<PDFDocType> {
    try {
      let pdfBytes: ArrayBuffer;
      
      if (source instanceof File) {
        pdfBytes = await source.arrayBuffer();
      } else if (typeof source === 'string') {
        const response = await fetch(source);
        pdfBytes = await response.arrayBuffer();
      } else {
        pdfBytes = source;
      }

      // Load with pdf-lib for editing
      this.document = await PDFDocument.load(pdfBytes);
      this.originalDocument = await PDFDocument.load(pdfBytes);
      
      // Load with pdf.js for rendering
      this.pdfJsDocument = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      
      // Extract metadata
      await this.extractMetadata();
      
      // Process pages
      await this.processPages();
      
      // Load standard fonts
      await this.loadStandardFonts();
      
      return this.getDocumentData();
    } catch (error) {
      console.error('Error loading PDF:', error);
      throw new Error('Failed to load PDF document');
    }
  }

  // Create new PDF document
  async createNewPDF(pageCount = 1): Promise<PDFDocType> {
    try {
      this.document = await PDFDocument.create();
      this.originalDocument = await PDFDocument.create();
      
      // Add initial pages
      for (let i = 0; i < pageCount; i++) {
        const page = this.document.addPage([DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT]);
        const pageId = generateId();
        
        this.pages.set(pageId, {
          id: pageId,
          pageNumber: i + 1,
          width: DEFAULT_PAGE_WIDTH,
          height: DEFAULT_PAGE_HEIGHT,
          rotation: 0,
          scale: 1,
          annotations: [],
          forms: [],
          text: [],
          images: [],
          drawings: [],
          isVisible: true,
          isLocked: false
        });
      }
      
      // Load standard fonts
      await this.loadStandardFonts();
      
      // Initialize metadata
      this.metadata = {
        title: 'Untitled Document',
        author: '',
        subject: '',
        keywords: [],
        creator: 'PDF Editor Pro',
        producer: 'PDF Editor Pro',
        creationDate: new Date(),
        modificationDate: new Date(),
        pageCount: pageCount,
        fileSize: 0,
        encrypted: false,
        permissions: this.getDefaultPermissions()
      };
      
      this.isModified = true;
      
      return this.getDocumentData();
    } catch (error) {
      console.error('Error creating new PDF:', error);
      throw new Error('Failed to create new PDF document');
    }
  }

  // Extract metadata from PDF
  private async extractMetadata(): Promise<void> {
    if (!this.document) return;
    
    const info = this.document.getTitle() || '';
    const author = this.document.getAuthor() || '';
    const subject = this.document.getSubject() || '';
    const keywords = this.document.getKeywords() || '';
    const creator = this.document.getCreator() || '';
    const producer = this.document.getProducer() || '';
    const creationDate = this.document.getCreationDate();
    const modificationDate = this.document.getModificationDate();
    
    this.metadata = {
      title: info,
      author: author,
      subject: subject,
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
      creator: creator,
      producer: producer,
      creationDate: creationDate || new Date(),
      modificationDate: modificationDate || new Date(),
      pageCount: this.document.getPageCount(),
      fileSize: 0, // Will be calculated on save
      encrypted: false,
      permissions: this.getDefaultPermissions()
    };
  }

  // Process all pages
  private async processPages(): Promise<void> {
    if (!this.document) return;
    
    const pageCount = this.document.getPageCount();
    const pages = this.document.getPages();
    
    for (let i = 0; i < pageCount; i++) {
      const page = pages[i];
      const pageId = generateId();
      const { width, height } = page.getSize();
      const rotation = page.getRotation().angle;
      
      const pageData: PDFPageType = {
        id: pageId,
        pageNumber: i + 1,
        width,
        height,
        rotation,
        scale: 1,
        annotations: [],
        forms: [],
        text: [],
        images: [],
        drawings: [],
        isVisible: true,
        isLocked: false
      };
      
      this.pages.set(pageId, pageData);
      
      // Extract text content if needed
      if (this.pdfJsDocument) {
        try {
          const pdfPage = await this.pdfJsDocument.getPage(i + 1);
          const textContent = await pdfPage.getTextContent();
          
          // Process text items
          const textElements: TextElement[] = textContent.items.map((item: any) => ({
            id: generateId(),
            pageId,
            content: item.str,
            x: item.transform[4],
            y: item.transform[5],
            width: item.width,
            height: item.height,
            fontSize: item.transform[0],
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none',
            color: '#000000',
            opacity: 1,
            rotation: 0,
            lineHeight: 1.2,
            letterSpacing: 0,
            textAlign: 'left',
            verticalAlign: 'top',
            isEditable: true,
            isSelectable: true,
            zIndex: 0
          }));
          
          this.textElements.set(pageId, textElements);
        } catch (error) {
          console.error(`Error extracting text from page ${i + 1}:`, error);
        }
      }
    }
  }

  // Load standard fonts
  private async loadStandardFonts(): Promise<void> {
    if (!this.document) return;
    
    const fontNames = [
      StandardFonts.Helvetica,
      StandardFonts.HelveticaBold,
      StandardFonts.HelveticaOblique,
      StandardFonts.TimesRoman,
      StandardFonts.TimesRomanBold,
      StandardFonts.TimesRomanItalic,
      StandardFonts.Courier,
      StandardFonts.CourierBold,
      StandardFonts.CourierOblique
    ];
    
    for (const fontName of fontNames) {
      const font = await this.document.embedFont(fontName);
      this.fonts.set(fontName, font);
    }
  }

  // Get default permissions
  private getDefaultPermissions(): PDFPermissions {
    return {
      printing: true,
      modifying: true,
      copying: true,
      annotating: true,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: true,
      highQualityPrinting: true
    };
  }

  // Get document data
  getDocumentData(): PDFDocType {
    const pageArray = Array.from(this.pages.values());
    
    return {
      id: this.documentId,
      name: this.metadata?.title || 'Untitled',
      pages: pageArray,
      metadata: this.metadata!,
      annotations: this.getAllAnnotations(),
      forms: this.getAllFormFields(),
      signatures: this.getAllSignatures(),
      watermarks: this.watermarks,
      createdAt: this.metadata?.creationDate || new Date(),
      updatedAt: this.metadata?.modificationDate || new Date(),
      isModified: this.isModified,
      originalSize: 0,
      currentSize: 0,
      version: '1.0.0'
    };
  }

  // Add new page
  async addPage(options?: {
    width?: number;
    height?: number;
    position?: number;
    content?: string;
  }): Promise<PDFPageType> {
    if (!this.document) throw new Error('No document loaded');
    
    const width = options?.width || DEFAULT_PAGE_WIDTH;
    const height = options?.height || DEFAULT_PAGE_HEIGHT;
    const position = options?.position;
    
    const page = position !== undefined
      ? this.document.insertPage(position, [width, height])
      : this.document.addPage([width, height]);
    
    const pageId = generateId();
    const pageNumber = position !== undefined ? position + 1 : this.pages.size + 1;
    
    const pageData: PDFPageType = {
      id: pageId,
      pageNumber,
      width,
      height,
      rotation: 0,
      scale: 1,
      annotations: [],
      forms: [],
      text: [],
      images: [],
      drawings: [],
      isVisible: true,
      isLocked: false
    };
    
    // Add content if provided
    if (options?.content) {
      const font = this.fonts.get(StandardFonts.Helvetica);
      if (font) {
        page.drawText(options.content, {
          x: 50,
          y: height - 50,
          size: 12,
          font,
          color: rgb(0, 0, 0)
        });
      }
    }
    
    // Update page numbers for existing pages
    this.updatePageNumbers();
    
    this.pages.set(pageId, pageData);
    this.isModified = true;
    
    return pageData;
  }

  // Delete page
  async deletePage(pageId: string): Promise<void> {
    if (!this.document) throw new Error('No document loaded');
    
    const pageData = this.pages.get(pageId);
    if (!pageData) throw new Error('Page not found');
    
    const pages = this.document.getPages();
    const pageIndex = pageData.pageNumber - 1;
    
    if (pages.length <= 1) {
      throw new Error('Cannot delete the last page');
    }
    
    this.document.removePage(pageIndex);
    this.pages.delete(pageId);
    
    // Clean up associated data
    this.annotations.delete(pageId);
    this.formFields.delete(pageId);
    this.textElements.delete(pageId);
    this.imageElements.delete(pageId);
    this.drawingElements.delete(pageId);
    this.signatures.delete(pageId);
    
    // Update page numbers
    this.updatePageNumbers();
    
    this.isModified = true;
  }

  // Rotate page
  async rotatePage(pageId: string, angle: 90 | 180 | 270): Promise<void> {
    if (!this.document) throw new Error('No document loaded');
    
    const pageData = this.pages.get(pageId);
    if (!pageData) throw new Error('Page not found');
    
    const pages = this.document.getPages();
    const page = pages[pageData.pageNumber - 1];
    
    const currentRotation = page.getRotation().angle;
    const newRotation = (currentRotation + angle) % 360;
    
    page.setRotation(degrees(newRotation));
    pageData.rotation = newRotation;
    
    // Swap width and height if rotating 90 or 270 degrees
    if (angle === 90 || angle === 270) {
      const temp = pageData.width;
      pageData.width = pageData.height;
      pageData.height = temp;
    }
    
    this.isModified = true;
  }

  // Reorder pages
  async reorderPages(newOrder: string[]): Promise<void> {
    if (!this.document) throw new Error('No document loaded');
    
    // Validate new order
    if (newOrder.length !== this.pages.size) {
      throw new Error('Invalid page order');
    }
    
    // Create new document with reordered pages
    const newDoc = await PDFDocument.create();
    const pages = this.document.getPages();
    
    for (const pageId of newOrder) {
      const pageData = this.pages.get(pageId);
      if (!pageData) throw new Error('Invalid page ID in new order');
      
      const [copiedPage] = await newDoc.copyPages(this.document, [pageData.pageNumber - 1]);
      newDoc.addPage(copiedPage);
    }
    
    this.document = newDoc;
    this.updatePageNumbers();
    this.isModified = true;
  }

  // Update page numbers after reordering
  private updatePageNumbers(): void {
    let pageNumber = 1;
    const sortedPages = Array.from(this.pages.values()).sort((a, b) => a.pageNumber - b.pageNumber);
    
    for (const page of sortedPages) {
      page.pageNumber = pageNumber++;
    }
  }

  // Add text to page
  async addText(
    pageId: string,
    text: string,
    options: {
      x: number;
      y: number;
      fontSize?: number;
      fontFamily?: string;
      color?: string;
      rotation?: number;
      opacity?: number;
    }
  ): Promise<TextElement> {
    if (!this.document) throw new Error('No document loaded');
    
    const pageData = this.pages.get(pageId);
    if (!pageData) throw new Error('Page not found');
    
    const pages = this.document.getPages();
    const page = pages[pageData.pageNumber - 1];
    
    // Get or embed font
    let font = this.fonts.get(options.fontFamily || StandardFonts.Helvetica);
    if (!font) {
      font = await this.document.embedFont(StandardFonts.Helvetica);
      this.fonts.set(StandardFonts.Helvetica, font);
    }
    
    // Parse color
    const color = this.parseColor(options.color || '#000000');
    
    // Draw text on page
    page.drawText(text, {
      x: options.x,
      y: pageData.height - options.y, // Convert to PDF coordinate system
      size: options.fontSize || 12,
      font,
      color,
      rotate: degrees(options.rotation || 0),
      opacity: options.opacity || 1
    });
    
    // Create text element
    const textElement: TextElement = {
      id: generateId(),
      pageId,
      content: text,
      x: options.x,
      y: options.y,
      width: font.widthOfTextAtSize(text, options.fontSize || 12),
      height: options.fontSize || 12,
      fontSize: options.fontSize || 12,
      fontFamily: options.fontFamily || 'Helvetica',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: options.color || '#000000',
      opacity: options.opacity || 1,
      rotation: options.rotation || 0,
      lineHeight: 1.2,
      letterSpacing: 0,
      textAlign: 'left',
      verticalAlign: 'top',
      isEditable: true,
      isSelectable: true,
      zIndex: this.getNextZIndex(pageId)
    };
    
    // Store text element
    if (!this.textElements.has(pageId)) {
      this.textElements.set(pageId, []);
    }
    this.textElements.get(pageId)!.push(textElement);
    
    this.isModified = true;
    
    return textElement;
  }

  // Add image to page
  async addImage(
    pageId: string,
    imageData: string | ArrayBuffer | Uint8Array,
    options: {
      x: number;
      y: number;
      width?: number;
      height?: number;
      rotation?: number;
      opacity?: number;
    }
  ): Promise<ImageElement> {
    if (!this.document) throw new Error('No document loaded');
    
    const pageData = this.pages.get(pageId);
    if (!pageData) throw new Error('Page not found');
    
    const pages = this.document.getPages();
    const page = pages[pageData.pageNumber - 1];
    
    // Embed image
    let image: PDFImage;
    if (typeof imageData === 'string') {
      // Assume base64 data URL
      const base64Data = imageData.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      if (imageData.includes('image/png')) {
        image = await this.document.embedPng(imageBytes);
      } else {
        image = await this.document.embedJpg(imageBytes);
      }
    } else {
      // Assume raw bytes
      const bytes = imageData instanceof Uint8Array ? imageData : new Uint8Array(imageData);
      
      // Try PNG first, then JPG
      try {
        image = await this.document.embedPng(bytes);
      } catch {
        image = await this.document.embedJpg(bytes);
      }
    }
    
    const imageId = generateId();
    this.images.set(imageId, image);
    
    // Calculate dimensions
    const width = options.width || image.width;
    const height = options.height || image.height;
    
    // Draw image on page
    page.drawImage(image, {
      x: options.x,
      y: pageData.height - options.y - height, // Convert to PDF coordinate system
      width,
      height,
      rotate: degrees(options.rotation || 0),
      opacity: options.opacity || 1
    });
    
    // Create image element
    const imageElement: ImageElement = {
      id: imageId,
      pageId,
      src: typeof imageData === 'string' ? imageData : '',
      x: options.x,
      y: options.y,
      width,
      height,
      rotation: options.rotation || 0,
      opacity: options.opacity || 1,
      flipHorizontal: false,
      flipVertical: false,
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        invert: 0
      },
      isLocked: false,
      preserveAspectRatio: true,
      zIndex: this.getNextZIndex(pageId)
    };
    
    // Store image element
    if (!this.imageElements.has(pageId)) {
      this.imageElements.set(pageId, []);
    }
    this.imageElements.get(pageId)!.push(imageElement);
    
    this.isModified = true;
    
    return imageElement;
  }

  // Add drawing/shape to page
  async addDrawing(
    pageId: string,
    type: 'rectangle' | 'circle' | 'line',
    options: {
      x: number;
      y: number;
      width?: number;
      height?: number;
      endX?: number;
      endY?: number;
      radius?: number;
      strokeColor?: string;
      fillColor?: string;
      strokeWidth?: number;
      opacity?: number;
    }
  ): Promise<DrawingElement> {
    if (!this.document) throw new Error('No document loaded');
    
    const pageData = this.pages.get(pageId);
    if (!pageData) throw new Error('Page not found');
    
    const pages = this.document.getPages();
    const page = pages[pageData.pageNumber - 1];
    
    const strokeColor = this.parseColor(options.strokeColor || '#000000');
    const fillColor = options.fillColor ? this.parseColor(options.fillColor) : undefined;
    
    // Draw shape based on type
    switch (type) {
      case 'rectangle':
        if (fillColor) {
          page.drawRectangle({
            x: options.x,
            y: pageData.height - options.y - (options.height || 100),
            width: options.width || 100,
            height: options.height || 100,
            color: fillColor,
            opacity: options.opacity || 1
          });
        }
        page.drawRectangle({
          x: options.x,
          y: pageData.height - options.y - (options.height || 100),
          width: options.width || 100,
          height: options.height || 100,
          borderColor: strokeColor,
          borderWidth: options.strokeWidth || 1,
          opacity: options.opacity || 1
        });
        break;
        
      case 'circle':
        const radius = options.radius || 50;
        if (fillColor) {
          page.drawCircle({
            x: options.x + radius,
            y: pageData.height - options.y - radius,
            size: radius,
            color: fillColor,
            opacity: options.opacity || 1
          });
        }
        page.drawCircle({
          x: options.x + radius,
          y: pageData.height - options.y - radius,
          size: radius,
          borderColor: strokeColor,
          borderWidth: options.strokeWidth || 1,
          opacity: options.opacity || 1
        });
        break;
        
      case 'line':
        page.drawLine({
          start: { x: options.x, y: pageData.height - options.y },
          end: { x: options.endX || options.x + 100, y: pageData.height - (options.endY || options.y) },
          color: strokeColor,
          thickness: options.strokeWidth || 1,
          opacity: options.opacity || 1
        });
        break;
    }
    
    // Create drawing element
    const drawingElement: DrawingElement = {
      id: generateId(),
      pageId,
      type: type as any,
      points: [
        { x: options.x, y: options.y },
        { x: options.endX || options.x + (options.width || 100), y: options.endY || options.y + (options.height || 100) }
      ],
      strokeColor: options.strokeColor || '#000000',
      strokeWidth: options.strokeWidth || 1,
      strokeStyle: 'solid',
      fillColor: options.fillColor,
      opacity: options.opacity || 1,
      lineCap: 'round',
      lineJoin: 'round',
      closed: type !== 'line',
      smooth: false,
      isLocked: false,
      zIndex: this.getNextZIndex(pageId)
    };
    
    // Store drawing element
    if (!this.drawingElements.has(pageId)) {
      this.drawingElements.set(pageId, []);
    }
    this.drawingElements.get(pageId)!.push(drawingElement);
    
    this.isModified = true;
    
    return drawingElement;
  }

  // Add annotation
  async addAnnotation(
    pageId: string,
    type: 'highlight' | 'note' | 'underline',
    options: {
      x: number;
      y: number;
      width: number;
      height: number;
      color?: string;
      content?: string;
      author?: string;
    }
  ): Promise<Annotation> {
    const annotation: Annotation = {
      id: generateId(),
      type: type as any,
      pageId,
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      rotation: 0,
      opacity: 0.5,
      color: options.color || '#FFFF00',
      content: options.content,
      author: options.author,
      createdAt: new Date(),
      modifiedAt: new Date(),
      isLocked: false,
      isHidden: false,
      zIndex: this.getNextZIndex(pageId)
    };
    
    if (!this.annotations.has(pageId)) {
      this.annotations.set(pageId, []);
    }
    this.annotations.get(pageId)!.push(annotation);
    
    this.isModified = true;
    
    return annotation;
  }

  // Add form field
  async addFormField(
    pageId: string,
    type: 'text' | 'checkbox' | 'radio' | 'dropdown',
    options: {
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      defaultValue?: any;
      options?: { label: string; value: string }[];
      required?: boolean;
    }
  ): Promise<FormField> {
    if (!this.document) throw new Error('No document loaded');
    
    const pageData = this.pages.get(pageId);
    if (!pageData) throw new Error('Page not found');
    
    const form = this.document.getForm();
    const pages = this.document.getPages();
    const page = pages[pageData.pageNumber - 1];
    
    let field: any;
    
    switch (type) {
      case 'text':
        field = form.createTextField(options.name);
        field.addToPage(page, {
          x: options.x,
          y: pageData.height - options.y - options.height,
          width: options.width,
          height: options.height
        });
        if (options.defaultValue) {
          field.setText(options.defaultValue);
        }
        break;
        
      case 'checkbox':
        field = form.createCheckBox(options.name);
        field.addToPage(page, {
          x: options.x,
          y: pageData.height - options.y - options.height,
          width: options.width,
          height: options.height
        });
        if (options.defaultValue) {
          field.check();
        }
        break;
        
      case 'radio':
        field = form.createRadioGroup(options.name);
        if (options.options) {
          options.options.forEach((opt, index) => {
            field.addOptionToPage(opt.value, page, {
              x: options.x,
              y: pageData.height - options.y - options.height - (index * 25),
              width: options.width,
              height: 20
            });
          });
        }
        break;
        
      case 'dropdown':
        field = form.createDropdown(options.name);
        field.addToPage(page, {
          x: options.x,
          y: pageData.height - options.y - options.height,
          width: options.width,
          height: options.height
        });
        if (options.options) {
          field.setOptions(options.options.map(opt => opt.value));
        }
        if (options.defaultValue) {
          field.select(options.defaultValue);
        }
        break;
    }
    
    const formField: FormField = {
      id: generateId(),
      type: type as any,
      name: options.name,
      pageId,
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      value: null,
      defaultValue: options.defaultValue,
      options: options.options,
      required: options.required || false,
      readOnly: false
    };
    
    if (!this.formFields.has(pageId)) {
      this.formFields.set(pageId, []);
    }
    this.formFields.get(pageId)!.push(formField);
    
    this.isModified = true;
    
    return formField;
  }

  // Add signature
  async addSignature(
    pageId: string,
    signatureData: string,
    options: {
      x: number;
      y: number;
      width: number;
      height: number;
      type?: 'drawn' | 'typed' | 'uploaded';
    }
  ): Promise<Signature> {
    // Add signature image
    await this.addImage(pageId, signatureData, {
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height
    });
    
    const signature: Signature = {
      id: generateId(),
      type: options.type || 'drawn',
      pageId,
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      data: signatureData,
      author: 'User',
      timestamp: new Date(),
      verified: false,
      isLocked: false,
      zIndex: this.getNextZIndex(pageId)
    };
    
    if (!this.signatures.has(pageId)) {
      this.signatures.set(pageId, []);
    }
    this.signatures.get(pageId)!.push(signature);
    
    this.isModified = true;
    
    return signature;
  }

  // Add watermark
  async addWatermark(watermark: Watermark): Promise<void> {
    if (!this.document) throw new Error('No document loaded');
    
    const pages = this.document.getPages();
    const pageIndices = this.getPageIndices(watermark.pages);
    
    for (const index of pageIndices) {
      const page = pages[index];
      if (!page) continue;
      
      const { width, height } = page.getSize();
      const position = this.calculateWatermarkPosition(watermark.position, width, height, watermark);
      
      if (watermark.type === 'text') {
        const font = this.fonts.get(StandardFonts.Helvetica) || await this.document.embedFont(StandardFonts.Helvetica);
        const color = this.parseColor(watermark.color);
        
        page.drawText(watermark.content, {
          x: position.x + watermark.xOffset,
          y: position.y + watermark.yOffset,
          size: watermark.fontSize || 48,
          font,
          color,
          opacity: watermark.opacity,
          rotate: degrees(watermark.rotation)
        });
      } else if (watermark.type === 'image') {
        // Handle image watermark
        const imageId = watermark.content;
        const image = this.images.get(imageId);
        if (image) {
          page.drawImage(image, {
            x: position.x + watermark.xOffset,
            y: position.y + watermark.yOffset,
            width: (watermark.scale || 1) * image.width,
            height: (watermark.scale || 1) * image.height,
            opacity: watermark.opacity,
            rotate: degrees(watermark.rotation)
          });
        }
      }
    }
    
    this.watermarks.push(watermark);
    this.isModified = true;
  }

  // Merge PDFs
  async mergePDF(pdfToMerge: File | ArrayBuffer, position?: number): Promise<void> {
    if (!this.document) throw new Error('No document loaded');
    
    const mergeBytes = pdfToMerge instanceof File 
      ? await pdfToMerge.arrayBuffer()
      : pdfToMerge;
    
    const mergePdf = await PDFDocument.load(mergeBytes);
    const copiedPages = await this.document.copyPages(mergePdf, mergePdf.getPageIndices());
    
    if (position !== undefined) {
      // Insert at specific position
      for (let i = 0; i < copiedPages.length; i++) {
        this.document.insertPage(position + i, copiedPages[i]);
      }
    } else {
      // Append to end
      for (const page of copiedPages) {
        this.document.addPage(page);
      }
    }
    
    // Re-process pages
    await this.processPages();
    this.isModified = true;
  }

  // Split PDF
  async splitPDF(ranges: { start: number; end: number }[]): Promise<PDFDocument[]> {
    if (!this.document) throw new Error('No document loaded');
    
    const splitDocuments: PDFDocument[] = [];
    
    for (const range of ranges) {
      const newDoc = await PDFDocument.create();
      const pageIndices = [];
      
      for (let i = range.start - 1; i < range.end; i++) {
        pageIndices.push(i);
      }
      
      const copiedPages = await newDoc.copyPages(this.document, pageIndices);
      for (const page of copiedPages) {
        newDoc.addPage(page);
      }
      
      splitDocuments.push(newDoc);
    }
    
    return splitDocuments;
  }

  // Extract pages
  async extractPages(pageNumbers: number[]): Promise<PDFDocument> {
    if (!this.document) throw new Error('No document loaded');
    
    const newDoc = await PDFDocument.create();
    const pageIndices = pageNumbers.map(n => n - 1);
    
    const copiedPages = await newDoc.copyPages(this.document, pageIndices);
    for (const page of copiedPages) {
      newDoc.addPage(page);
    }
    
    return newDoc;
  }

  // Save/Export PDF
  async save(options?: ExportOptions): Promise<Uint8Array> {
    if (!this.document) throw new Error('No document loaded');
    
    // Apply export options if provided
    if (options) {
      // Handle page selection
      if (options.pages !== 'all') {
        let pageIndices: number[] = [];
        
        if (options.pages === 'current') {
          pageIndices = [0]; // Default to first page
        } else if (options.pages === 'range' && options.pageRange) {
          for (let i = options.pageRange.start - 1; i < options.pageRange.end; i++) {
            pageIndices.push(i);
          }
        } else if (Array.isArray(options.pages)) {
          pageIndices = options.pages.map(n => n - 1);
        }
        
        if (pageIndices.length > 0) {
          const newDoc = await PDFDocument.create();
          const copiedPages = await newDoc.copyPages(this.document, pageIndices);
          for (const page of copiedPages) {
            newDoc.addPage(page);
          }
          return await newDoc.save();
        }
      }
      
      // Handle other export options
      if (options.flatten) {
        // Flatten form fields and annotations
        const form = this.document.getForm();
        form.flatten();
      }
      
      if (options.password) {
        // Note: pdf-lib doesn't support encryption directly
        // This would require additional libraries
        console.warn('Password protection not yet implemented');
      }
    }
    
    const pdfBytes = await this.document.save();
    this.isModified = false;
    
    return pdfBytes;
  }

  // Export as image
  async exportAsImage(pageNumber: number, format: 'png' | 'jpg' = 'png'): Promise<string> {
    if (!this.pdfJsDocument) throw new Error('No document loaded');
    
    const page = await this.pdfJsDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not create canvas context');
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    return canvas.toDataURL(`image/${format}`);
  }

  // Undo last change
  async undo(): Promise<void> {
    if (!this.originalDocument) throw new Error('No original document');
    
    // Restore from original
    const bytes = await this.originalDocument.save();
    this.document = await PDFDocument.load(bytes);
    this.isModified = false;
  }

  // Helper methods
  private parseColor(hexColor: string): any {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  }

  private getNextZIndex(pageId: string): number {
    let maxZIndex = 0;
    
    const annotations = this.annotations.get(pageId) || [];
    const textElements = this.textElements.get(pageId) || [];
    const imageElements = this.imageElements.get(pageId) || [];
    const drawingElements = this.drawingElements.get(pageId) || [];
    
    [...annotations, ...textElements, ...imageElements, ...drawingElements].forEach(element => {
      if (element.zIndex > maxZIndex) {
        maxZIndex = element.zIndex;
      }
    });
    
    return maxZIndex + 1;
  }

  private getPageIndices(pages: number[] | 'all' | 'odd' | 'even'): number[] {
    if (!this.document) return [];
    
    const pageCount = this.document.getPageCount();
    
    if (pages === 'all') {
      return Array.from({ length: pageCount }, (_, i) => i);
    } else if (pages === 'odd') {
      return Array.from({ length: pageCount }, (_, i) => i).filter(i => i % 2 === 0);
    } else if (pages === 'even') {
      return Array.from({ length: pageCount }, (_, i) => i).filter(i => i % 2 === 1);
    } else {
      return pages.map(p => p - 1);
    }
  }

  private calculateWatermarkPosition(
    position: WatermarkPosition,
    pageWidth: number,
    pageHeight: number,
    watermark: Watermark
  ): { x: number; y: number } {
    const fontSize = watermark.fontSize || 48;
    const textWidth = watermark.content.length * fontSize * 0.5; // Approximate
    const textHeight = fontSize;
    
    switch (position) {
      case 'center':
        return { x: (pageWidth - textWidth) / 2, y: (pageHeight - textHeight) / 2 };
      case 'top-left':
        return { x: 50, y: pageHeight - 50 - textHeight };
      case 'top-center':
        return { x: (pageWidth - textWidth) / 2, y: pageHeight - 50 - textHeight };
      case 'top-right':
        return { x: pageWidth - textWidth - 50, y: pageHeight - 50 - textHeight };
      case 'middle-left':
        return { x: 50, y: (pageHeight - textHeight) / 2 };
      case 'middle-right':
        return { x: pageWidth - textWidth - 50, y: (pageHeight - textHeight) / 2 };
      case 'bottom-left':
        return { x: 50, y: 50 };
      case 'bottom-center':
        return { x: (pageWidth - textWidth) / 2, y: 50 };
      case 'bottom-right':
        return { x: pageWidth - textWidth - 50, y: 50 };
      case 'diagonal':
        return { x: (pageWidth - textWidth) / 2, y: (pageHeight - textHeight) / 2 };
      default:
        return { x: 0, y: 0 };
    }
  }

  // Get all annotations
  private getAllAnnotations(): Annotation[] {
    const allAnnotations: Annotation[] = [];
    this.annotations.forEach(annotations => {
      allAnnotations.push(...annotations);
    });
    return allAnnotations;
  }

  // Get all form fields
  private getAllFormFields(): FormField[] {
    const allFormFields: FormField[] = [];
    this.formFields.forEach(fields => {
      allFormFields.push(...fields);
    });
    return allFormFields;
  }

  // Get all signatures
  private getAllSignatures(): Signature[] {
    const allSignatures: Signature[] = [];
    this.signatures.forEach(sigs => {
      allSignatures.push(...sigs);
    });
    return allSignatures;
  }

  // Clear all modifications
  clearModifications(): void {
    this.annotations.clear();
    this.formFields.clear();
    this.textElements.clear();
    this.imageElements.clear();
    this.drawingElements.clear();
    this.signatures.clear();
    this.watermarks = [];
    this.isModified = false;
  }

  // Get page by ID
  getPage(pageId: string): PDFPageType | undefined {
    return this.pages.get(pageId);
  }

  // Get all pages
  getPages(): PDFPageType[] {
    return Array.from(this.pages.values());
  }

  // Check if document is modified
  getIsModified(): boolean {
    return this.isModified;
  }

  // Set document metadata
  async setMetadata(metadata: Partial<PDFMetadata>): Promise<void> {
    if (!this.document) throw new Error('No document loaded');
    
    if (metadata.title) this.document.setTitle(metadata.title);
    if (metadata.author) this.document.setAuthor(metadata.author);
    if (metadata.subject) this.document.setSubject(metadata.subject);
    if (metadata.keywords) this.document.setKeywords(metadata.keywords.join(', '));
    if (metadata.creator) this.document.setCreator(metadata.creator);
    if (metadata.producer) this.document.setProducer(metadata.producer);
    if (metadata.creationDate) this.document.setCreationDate(metadata.creationDate);
    if (metadata.modificationDate) this.document.setModificationDate(metadata.modificationDate);
    
    this.metadata = { ...this.metadata!, ...metadata };
    this.isModified = true;
  }
}

// Export singleton instance
export const pdfManager = new PDFManager();