import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Undo, Redo } from "lucide-react";
import { Tool, DrawingSettings } from "@/pages/Index";
import { toast } from "sonner";
import HelpBox from "./HelpBox";
import getStroke from 'perfect-freehand';

interface CanvasProps {
  activeTool: Tool;
  drawingSettings: DrawingSettings;
  darkMode: boolean;
  onOpenHelp: () => void;
}

interface CanvasElement {
  id: string;
  type: "path" | "text";
  data: any;
  x: number;
  y: number;
  width?: number;
  height?: number;
  selected?: boolean;
  editing?: boolean;
}

// interface TextElement extends CanvasElement {
//   type: "text";
//   data: {
//     text: string;
//     color: string;
//     size: number;
//   };
//   editing?: boolean;
// }

function getSvgPathFromStroke(points: number[][], closed = true) {
  if (points.length < 4) return "";

  const average = (a: number, b: number) => (a + b) / 2;
  let a = points[0], b = points[1], c = points[2];
  let result = `M${a[0]},${a[1]} Q${b[0]},${b[1]} ${average(b[0], c[0])},${average(b[1], c[1])} T`;

  for (let i = 2; i < points.length - 1; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0])},${average(a[1], b[1])} `;
  }

  return closed ? result + "Z" : result;
}

//get canvas coords
const getCanvasMouseCoords = (
  e: MouseEvent | React.MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  panOffset: { x: number; y: number },
  zoom: number
) => {
  const canvas = canvasRef.current;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();

  //get mouse position relative the canvas
  //subtract panoffset to correct for the pan
  //1. translate screen to canvas-local space 2. subtract panning 3. divie by scaling to convert pixels into canvas-space undoing the zoom
  const x = (e.clientX - rect.left - panOffset.x) / zoom;
  const y = (e.clientY - rect.top - panOffset.y) / zoom;
  return { x, y };
};




const Canvas = ({ activeTool, drawingSettings, darkMode, onOpenHelp }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  

  const [textInputState, setTextInputState] = useState<{
    id: string;
    x: number;
    y: number;
    value: string;
  } | null>(null);

  


  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [eraserPosition, setEraserPosition] = useState({ x: 0, y: 0, visible: false });
  const [hoverHandle, setHoverHandle] = useState<string | null>(null);

 useEffect(() => {
    if (textInputState && textareaRef.current) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [textInputState]);


const commitText = () => {
  if (!textInputState) return;

  const value = textInputState.value.trim();
  if (value === "") {
    setTextInputState(null);
    return;
  }

  const updatedElements = [...elements];
  const existingIndex = updatedElements.findIndex(
    (el) => el.id === textInputState.id
  );

  const newElement: CanvasElement = {
    id: textInputState.id,
    type: "text",
    x: textInputState.x,
    y: textInputState.y,
    data: {
      text: value,
      color: drawingSettings.color,
      size: drawingSettings.size,
    },
    selected: false,
    editing: false, //false when saving
  };

  if (existingIndex >= 0) {
    updatedElements[existingIndex] = newElement;
  } else {
    updatedElements.push(newElement);
  }

  setElements(updatedElements);
  addToHistory(updatedElements);
  setTextInputState(null);
};



  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 120;

    const canvasStyle = darkMode ? '210 10% 12%' : '0 0% 100%';
    ctx.fillStyle = `hsl(${canvasStyle})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    redrawCanvas(ctx);
  }, [elements, zoom, panOffset, darkMode, selectedElement]);

  //use mouse wheel for zoom in and out
  useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault(); // prevent normal scroll
      handleZoom(-e.deltaY * 0.001, { x: e.clientX, y: e.clientY }); // smooth zoom
    }
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  return () => window.removeEventListener("wheel", handleWheel);
}, [zoom, panOffset]);


  const addToHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
      setSelectedElement(null);
      toast.success("Undone!");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
      setSelectedElement(null);
      toast.success("Redone!");
    }
  };

  const redrawCanvas = (ctx: CanvasRenderingContext2D) => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.save(); 
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const canvasStyle = darkMode ? '210 10% 12%' : '0 0% 100%';
    ctx.fillStyle = `hsl(${canvasStyle})`;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.restore();

    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Draw all elements
    elements.forEach((element) => {
    if (element.type === "path" && element.data.points) {
        const stroke = getStroke(
            element.data.points.map((p: any) => [p.x, p.y]),
            { size: element.data.size || 4 }
        );
        const pathData = getSvgPathFromStroke(stroke, false);
        const path = new Path2D(pathData);

        ctx.fillStyle = element.data.color || "#000000";
        ctx.fill(path);
    } else if (element.type === "text" && !element.editing) {
      ctx.fillStyle = element.data.color || "#000000";
      ctx.font = `${element.data.size * 8}px Inter, sans-serif`;
      ctx.textBaseline = "top";

      const lines = element.data.text.split('\n');
      lines.forEach((line: string, index: number) => {
        ctx.fillText(line, element.x, element.y + (index * element.data.size * 10));
      });
    }


      // Draw selection box and handles
      if (element.selected && element.id === selectedElement) {
        const bounds = getElementBounds(element);
        
        // Selection border
        ctx.strokeStyle = "#007acc";
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([]);
        ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10);
        
        // Resize handles
        const handleSize = 8 / zoom;
        ctx.fillStyle = "#007acc";
        
        // Corner handles
        const handles = [
          { x: bounds.x - 5, y: bounds.y - 5, cursor: 'nw-resize', id: 'nw' },
          { x: bounds.x + bounds.width + 5, y: bounds.y - 5, cursor: 'ne-resize', id: 'ne' },
          { x: bounds.x - 5, y: bounds.y + bounds.height + 5, cursor: 'sw-resize', id: 'sw' },
          { x: bounds.x + bounds.width + 5, y: bounds.y + bounds.height + 5, cursor: 'se-resize', id: 'se' },
          // Edge handles
          { x: bounds.x + bounds.width / 2, y: bounds.y - 5, cursor: 'n-resize', id: 'n' },
          { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height + 5, cursor: 's-resize', id: 's' },
          { x: bounds.x - 5, y: bounds.y + bounds.height / 2, cursor: 'w-resize', id: 'w' },
          { x: bounds.x + bounds.width + 5, y: bounds.y + bounds.height / 2, cursor: 'e-resize', id: 'e' }
        ];
        
        handles.forEach(handle => {
          ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
        });
      }
    });

    ctx.restore();
  };

  const getElementBounds = (element: CanvasElement) => {
    if (element.type === "text") {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = `${element.data.size * 8}px Inter, sans-serif`;
        const lines = element.data.text.split('\n');
        const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
        const height = lines.length * element.data.size * 10;
        return {
          x: element.x,
          y: element.y,
          width: maxWidth,
          height: height
        };
      }
      // Fallback
      const lines = element.data.text.split('\n');
      const maxLineLength = Math.max(...lines.map(line => line.length));
      return {
        x: element.x,
        y: element.y,
        width: maxLineLength * element.data.size * 6,
        height: lines.length * element.data.size * 10
      };
    } else if (element.type === "path" && element.data.points) {
      const xs = element.data.points.map((p: {x: number, y: number}) => p.x);
      const ys = element.data.points.map((p: {x: number, y: number}) => p.y);
      return {
        x: Math.min(...xs),
        y: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys)
      };
    }
    return { x: element.x, y: element.y, width: 100, height: 100 };
  };

  const getElementAtPosition = (pos: { x: number; y: number }) => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      const bounds = getElementBounds(element);
      
      if (pos.x >= bounds.x && pos.x <= bounds.x + bounds.width &&
          pos.y >= bounds.y && pos.y <= bounds.y + bounds.height) {
        return element;
      }
    }
    return null;
  };

  const getResizeHandle = (pos: { x: number; y: number }, element: CanvasElement) => {
    const bounds = getElementBounds(element);
    const handleSize = 8 / zoom;
    const tolerance = handleSize;

    const handles = [
      { x: bounds.x - 5, y: bounds.y - 5, id: 'nw' },
      { x: bounds.x + bounds.width + 5, y: bounds.y - 5, id: 'ne' },
      { x: bounds.x - 5, y: bounds.y + bounds.height + 5, id: 'sw' },
      { x: bounds.x + bounds.width + 5, y: bounds.y + bounds.height + 5, id: 'se' },
      { x: bounds.x + bounds.width / 2, y: bounds.y - 5, id: 'n' },
      { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height + 5, id: 's' },
      { x: bounds.x - 5, y: bounds.y + bounds.height / 2, id: 'w' },
      { x: bounds.x + bounds.width + 5, y: bounds.y + bounds.height / 2, id: 'e' }
    ];

    for (const handle of handles) {
      if (Math.abs(pos.x - handle.x) < tolerance && Math.abs(pos.y - handle.y) < tolerance) {
        return handle.id;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    commitText();
    //need to account for pan or zoom offsets
    const pos = getCanvasMouseCoords(e, canvasRef, panOffset, zoom); //this ensures positions are intepreted as canvas page, not screen page

    
    if (e.button === 1 || e.ctrlKey || activeTool === "pan") {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (activeTool === "select") {
      const element = getElementAtPosition(pos);
      if (element && selectedElement === element.id) {
        // Check for resize handle
        const handle = getResizeHandle(pos, element);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          setDragStart(pos);
          return;
        }
        
        // Double-click to edit text or start dragging
        if (element.type === "text") {
          setTextInputState({
          id: element.id,
          x: element.x,
          y: element.y,
          value: element.data.text,
      });

        //mark only this element editing flag = true
        setElements((prev) => //only the one being edited is hidden
          prev.map((el) =>
            el.id === element.id
              ? { ...el, editing: true }
              : { ...el, editing: false }
          )
        );
        } else {
          setIsDragging(true);
          setDragStart(pos);
        }
      } else if (element) {
        setSelectedElement(element.id);
        setElements(prev => prev.map(el => ({ ...el, selected: el.id === element.id })));
        setIsDragging(true);
        setDragStart(pos);
      } else {
        setSelectedElement(null);
        setElements(prev => prev.map(el => ({ ...el, selected: false })));
      }
    } else if (activeTool === "pencil") {
      setIsDrawing(true);
      setCurrentPath([pos]);
    } else if (activeTool === "eraser") {
      const element = getElementAtPosition(pos);
      if (element) {
        const newElements = elements.filter(el => el.id !== element.id);
        setElements(newElements);
        addToHistory(newElements);
        toast.success("Element erased!");
      }
    } else if (activeTool === "text") {
      const existing = getElementAtPosition(pos);
      if (existing?.type === "text") {
        setTextInputState({
          id: existing.id,
          x: existing.x,
          y: existing.y,
          value: existing.data.text,
        });
        return;
      }

      const newId = `text-${Date.now()}`;
      setTextInputState({
        id: newId,
        x: pos.x,
        y: pos.y,
        value: "",
      });
    }


  };


  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    //need to account for zoom or pan offests
    const pos = getCanvasMouseCoords(e, canvasRef, panOffset, zoom); //ensures intepretating canvas page not screen page


    //Update eraser position for visual feedback
    if (activeTool === "eraser") {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        setEraserPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          visible: true
        });
      }
    } else {
      setEraserPosition(prev => ({ ...prev, visible: false }));
    }

    //Handle hover for resize handles
    if (activeTool === "select" && selectedElement && !isDragging && !isResizing) {
      const element = elements.find(el => el.id === selectedElement);
      if (element) {
        const handle = getResizeHandle(pos, element);
        setHoverHandle(handle);
      }
    }

    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (isDrawing && activeTool === "pencil") {
        const newPath = [...currentPath, pos];
        setCurrentPath(newPath);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        //Redraw everything
        redrawCanvas(ctx);

        //Draw the current stroke in-progress
        const stroke = getStroke(
            newPath.map((p) => [p.x, p.y]),
            { size: drawingSettings.size || 4 }
        );
        const pathData = getSvgPathFromStroke(stroke, false);
        const path = new Path2D(pathData);

        //apply zoom and pan transform so the live stroke matches final rendering
        ctx.save(); //before translating, take a snapshot. Pushes the current drawing onto stack. Used for undo/redo
        //panoffset track how far user has dragged the view
        //translate function: everything appears to move
        ctx.translate(panOffset.x, panOffset.y); //move canvas' original position to a new position defined by panOffset
        ctx.scale(zoom, zoom); //scales to zoom level
        //render elements
        ctx.fillStyle = drawingSettings.color;
        ctx.fill(path);
        ctx.restore(); //after translating, save. Pops the most recent saved state off the stack and restores it.
    }

    if (isDragging && selectedElement && activeTool === "select") {
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;
      
      setElements(prev => prev.map(el => {
        if (el.id === selectedElement) {
          if (el.type === "path" && el.data.points) {
            return {
              ...el,
              data: {
                ...el.data,
                points: el.data.points.map((point: {x: number, y: number}) => ({
                  x: point.x + deltaX,
                  y: point.y + deltaY
                }))
              }
            };
          } else {
            return { ...el, x: el.x + deltaX, y: el.y + deltaY };
          }
        }
        return el;
      }));
      
      setDragStart(pos);
    }

    if (isResizing && selectedElement && resizeHandle) {
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;
      
      setElements(prev => prev.map(el => {
        if (el.id === selectedElement) {
          const bounds = getElementBounds(el);
          let newBounds = { ...bounds };
          
          //Handle different resize directions
          switch (resizeHandle) {
            case 'se':
              newBounds.width = Math.max(20, bounds.width + deltaX);
              newBounds.height = Math.max(20, bounds.height + deltaY);
              break;
            case 'sw':
              newBounds.x = bounds.x + deltaX;
              newBounds.width = Math.max(20, bounds.width - deltaX);
              newBounds.height = Math.max(20, bounds.height + deltaY);
              break;
            case 'ne':
              newBounds.width = Math.max(20, bounds.width + deltaX);
              newBounds.y = bounds.y + deltaY;
              newBounds.height = Math.max(20, bounds.height - deltaY);
              break;
            case 'nw':
              newBounds.x = bounds.x + deltaX;
              newBounds.y = bounds.y + deltaY;
              newBounds.width = Math.max(20, bounds.width - deltaX);
              newBounds.height = Math.max(20, bounds.height - deltaY);
              break;
          }
          
          //For text elements, adjust font size based on height
          if (el.type === "text") {
            const newSize = Math.max(1, (newBounds.height / (el.data.text.split('\n').length * 10)));
            return {
              ...el,
              x: newBounds.x,
              y: newBounds.y,
              data: {
                ...el.data,
                size: newSize
              }
            };
          }
          
          return { ...el, x: newBounds.x, y: newBounds.y };
        }
        return el;
      }));
      
      setDragStart(pos);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDragging || isResizing) {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
      addToHistory(elements);
    }

    if (isDrawing && activeTool === "pencil" && currentPath.length > 0) {
      const newElement: CanvasElement = {
        id: `path-${Date.now()}`,
        type: "path",
        data: {
          points: currentPath,
          color: drawingSettings.color,
          size: drawingSettings.size,
          pressure: drawingSettings.pressure,
        },
        x: 0,
        y: 0,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      setCurrentPath([]);
      setIsDrawing(false);
    }
  };

  //bug fixed, handle zoom in/out with offset + panning
  //June 15th, 2025
  const handleZoom = (delta: number, zoomCenter?: { x: number, y: number }) => {
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
    const canvas = canvasRef.current;
    if (!canvas || !zoomCenter) {
      setZoom(newZoom);
      return;
    }

    //get position  on scren before zoom: converting mouse position from screen coords to canvas coords
    const rect = canvas.getBoundingClientRect();
    const mouseX = (zoomCenter.x - rect.left - panOffset.x) / zoom;
    const mouseY = (zoomCenter.y - rect.top - panOffset.y) / zoom;

    //adjust panoffset after zoom. Reposition the canvas so that zoom is centered around the visual spot
    const newPanX = zoomCenter.x - rect.left - mouseX * newZoom;
    const newPanY = zoomCenter.y - rect.top - mouseY * newZoom;

    setZoom(newZoom);
    setPanOffset({ x: newPanX, y: newPanY });
  };

  const clearCanvas = () => {
    const newElements: CanvasElement[] = [];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(null);
    toast.success("Canvas cleared!");
  };

  useEffect(() => {
    (window as any).clearCanvas = clearCanvas;
    return () => {
      delete (window as any).clearCanvas;
    };
  }, [elements]);

  const getCursorStyle = () => {
    if (hoverHandle) {
      switch (hoverHandle) {
        case 'nw':
        case 'se': return 'nwse-resize';
        case 'ne':
        case 'sw': return 'nesw-resize';
        case 'n':
        case 's': return 'ns-resize';
        case 'e':
        case 'w': return 'ew-resize';
        default: return 'default';
      }
    }
    
    switch (activeTool) {
     case "pencil": return "url('cursors/crosshair-plus-dot (2).svg') 9 7, crosshair"; //custom crosshair access in public, x  y, fallback to default 
      case "eraser": return "url('cursors/dot-24 (1).svg') 0 0, crosshair";  
      case "text": return "text";
      case "pan": return "url('cursors/grab.svg') 0 0, grab"; 
      case "select": return isDragging ? "move" : "default";
      default: return "default";
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-120px)] overflow-hidden">
      {/* Empty State */}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center text-muted-foreground">
            <h3 className="text-2xl font-semibold mb-2">Start creating something awesome!</h3>
            <p className="text-lg">Select a tool and let your creativity flow</p>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="border-0 block"
        style={{ 
          backgroundColor: darkMode ? 'hsl(210 10% 12%)' : 'hsl(0 0% 100%)',
          cursor: getCursorStyle()
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Eraser Visual Indicator */}
      {eraserPosition.visible && activeTool === "eraser" && (
        <div
          className="fixed pointer-events-none z-20 border-2 border-red-500 rounded-full bg-red-500/20"
          style={{
            left: eraserPosition.x - 15,
            top: eraserPosition.y - 15,
            width: 30,
            height: 30,
          }}
        />
      )}

      {/* Text Input */}
      {textInputState && (
        <textarea
          ref={textareaRef}
          value={textInputState.value}
          onChange={(e) =>
            setTextInputState((prev) =>
              prev ? { ...prev, value: e.target.value } : null
            )
          }
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          onBlur={commitText}
          className="absolute z-50 resize-none bg-transparent border-none outline-none text-black dark:text-white"
          style={{
            left: textInputState.x * zoom + panOffset.x,
            top: textInputState.y * zoom + panOffset.y,
            font: `${drawingSettings.size * 8 * zoom}px sans-serif`,
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "both", // freely resize text area
            overflow: "hidden",
            whiteSpace: "pre-wrap", //long sentence wrap as paragraphs
            wordWrap: "break-word", //prevent single long line from overflowing
            background: "transparent",
            color: drawingSettings.color,
            zIndex: 2,
          }}

          onKeyDown={(e) => { //escape also commit text if user typed
            if (e.key === "Escape" && !e.shiftKey) {
              e.preventDefault();
              commitText();
            } 
          }}

        />

      )}



      {/* Canvas Controls - Bottom */}
      <div className="absolute bottom-4 left-4 flex items-end gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-border rounded-lg p-1 shadow-lg">
          <Button //zoom in and out button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            //zoom out by reducing by 0.1
            //divide by 2 both width and height to zoom towards center of page instead of (0,0)
            onClick={(e) => handleZoom(-0.1, { x: window.innerWidth / 2, y: window.innerHeight / 2 })}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            //same functionality 
            onClick={(e) => handleZoom(0.1, { x: window.innerWidth / 2, y: window.innerHeight / 2 })}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
          
          <div className="px-2 text-xs text-muted-foreground min-w-[35px] text-center">
            {Math.round(zoom * 100)}% 
          </div>
        </div>
        
        {/* Undo/Redo Controls */}
        <div className="flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-border rounded-lg p-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <Undo className="w-3 h-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Help Box - Bottom Right */}
      <HelpBox onOpenHelp={onOpenHelp} />
    </div>
  );
};

export default Canvas;
