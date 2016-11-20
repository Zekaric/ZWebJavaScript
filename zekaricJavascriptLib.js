////////////////////////////////////////////////////////////////////////////////
// Javascript Lib Screen
////////////////////////////////////////////////////////////////////////////////
// License
//
// The MIT License (MIT)
// 
// Copyright (c) 2013 Robbert de Groot
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the  "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// variable
////////////////////////////////////////////////////////////////////////////////

// The canvas to draw on.
var jprivate_screen = null;

// Frames per second.
var jfps15 = 1000 / 15;
var jfps24 = 1000 / 24;
var jfps30 = 1000 / 30;
var jfps60 = 1000 / 60;

////////////////////////////////////////////////////////////////////////////////
// Class: Jpoint
////////////////////////////////////////////////////////////////////////////////
function Jpoint()
{
   this.x = 0;
   this.y = 0;
}

//------------------------------------------------------------------------------
// Add
Jpoint.prototype.Add   = function(v)
{
   this.x += v.GetX();
   this.y += v.GetY();
}

//------------------------------------------------------------------------------
// GetX, GetY
Jpoint.prototype.GetX  = function() { return this.x; }
Jpoint.prototype.GetY  = function() { return this.y; }

//------------------------------------------------------------------------------
// Scale
Jpoint.prototype.Scale = function(v)
{
   this.x *= v;
   this.y *= v;
   return true;
}

//------------------------------------------------------------------------------
// Set, SetXY
// Copies the point
Jpoint.prototype.Set   = function(v)
{
   this.x = v.GetX();
   this.y = v.GetY();
   return true;
}
Jpoint.prototype.SetXY = function(x, y)
{
   this.x = x;
   this.y = y;
   return true;
}

//------------------------------------------------------------------------------
// Jpoint.GetClockVectorPercent
// Simple function to get the 2D direction vector based off a clock or cardinal
// vectors.
// 0.00 = 12 o'clock, North
// 0.25 =  3 o'clock, East
// 0.50 =  6 o'clock, South
// 0.75 =  9 o'clock, West
Jpoint.GetClockVectorPercent = function(zeroToOne_360)
{
   var radian,
       p;
   
   radian = Math.PI / 2.0 - zeroToOne_360 * (Math.PI * 2.0);
   
   p = new Jpoint();
   p.SetXY(Math.cos(radian), -Math.sin(radian));
   
   return p;
}

////////////////////////////////////////////////////////////////////////////////
// Class: Jsize
////////////////////////////////////////////////////////////////////////////////
function Jsize()
{
   this.w = 0;
   this.h = 0;
}

//------------------------------------------------------------------------------
// GetH, GetW
Jsize.prototype.GetH = function() { return this.h; }
Jsize.prototype.GetW = function() { return this.w; }

//------------------------------------------------------------------------------
// Set, SetWH
Jsize.prototype.Set   = function(v)
{
   this.w = v.GetW();
   this.h = v.GetH();
}
Jsize.prototype.SetWH = function(w, h)
{
   this.w = w;
   this.h = h;
   return true;
}

////////////////////////////////////////////////////////////////////////////////
// Class: Jrectangle.
////////////////////////////////////////////////////////////////////////////////
function Jrect()
{
   this.point = new Jpoint();
   this.size  = new Jsize();
}

Jrect.prototype.GetPoint  = function()
{
   var p;
   p = new Jpoint();
   p.Set(this.point);
   return p;
}
Jrect.prototype.GetPointX = function() { return this.point.GetX(); }
Jrect.prototype.GetPointY = function() { return this.point.GetY(); }

Jrect.prototype.GetSize = function()
{
   var s;
   s = new Jsize();
   s.Set(this.size);
   return s;
}
Jrect.prototype.GetSizeH = function() { return this.size.GetH(); }
Jrect.prototype.GetSizeW = function() { return this.size.GetW(); }

Jrect.prototype.Inflate = function(w, h)
{
   this.point.SetXY(
      this.point.GetX() - w / 2,
      this.point.GetY() - h / 2);
   this.size.SetWH(
      this.size.GetW() + w,
      this.size.GetH() + h);
   return true;
}

Jrect.prototype.Set = function(v)
{
   this.point.SetXY(v.GetPointX(), v.GetPointY());
   this.size.SetWH(v.GetSizeW(), v.GetSizeH());
   return true;
}

Jrect.prototype.SetPoint = function(v)
{
   return this.point.Set(v);
}

Jrect.prototype.SetPointXY = function(x, y)
{
   return this.point.SetXY(x, y);
}

Jrect.prototype.SetSize = function(v)
{
   return this.size.Set(v);
}

Jrect.prototype.SetSizeWH = function(w, h)
{
   return this.size.SetWH(w, h);
}

////////////////////////////////////////////////////////////////////////////////
// Class: Jsprite
////////////////////////////////////////////////////////////////////////////////
function Jsprite()
{
   this.point     = new Jpoint();
   this.fileImage = "";
   this.image     = null;
   this.isLoaded  = false;
   this.tileSize  = new Jsize();
   this.tileCount = new Jsize();
}

//------------------------------------------------------------------------------
// GetImage
Jsprite.prototype.GetImage = function()
{
   if (!this.isLoaded) return null;

   return this.image;
}

//------------------------------------------------------------------------------
// GetImageSize, GetImageSizeH, GetImageSizeW
Jsprite.prototype.GetImageSize = function()
{
   var size;
   
   size = new Jsize();
   size.SetWH(this.image.width, this.image.height);
   
   return size;
}
Jsprite.prototype.GetImageSizeH = function()
{
   if (!this.isLoaded) return 0;
   
   return this.image.height;
}
Jsprite.prototype.GetImageSizeW = function()
{
   if (!this.isLoaded) return 0;
   
   return this.image.width;
}

//------------------------------------------------------------------------------
// GetPoint
// The location of the sprite on the canvas.
Jsprite.prototype.GetPoint = function()
{
   var v;
   v = new Jpoint();
   v.Set(this.point);
   return v;
}

//------------------------------------------------------------------------------
// GetTilePoint
// A sprite can be made up of multiple uniformly sized images or animation 
// frames.  This will get the location of a tile in a sprite.
Jsprite.prototype.GetTilePoint = function(indexX, indexY)
{
   var v;
   v = new Jpoint();
   
   if (!this.isLoaded                  ||
       !this.isTileSizeSet             ||
       indexX < 0                      ||
       indexY < 0                      ||
       this.tileCount.GetW() <= indexX ||
       this.tileCount.GetH() <= indexY) return v;

   v.SetXY(
      this.tileSize.GetW() * indexX,
      this.tileSize.GetH() * indexY);
      
   return v;
}

//------------------------------------------------------------------------------
// GetTileSize, GetTileSizeH, GetTileSizeW
Jsprite.prototype.GetTileSize = function()
{
   var size;
   
   if (!this.isTileSizeSet) return this.GetImageSize();
   
   size = new Jsize();
   size.Set(this.tileSize);
   
   return size;
}
Jsprite.prototype.GetTileH = function()
{
   if (!this.isTileSizeSet) return this.GetImageSizeH();
   
   return this.tileSize.GetH();
}
Jsprite.prototype.GetTileW = function()
{
   if (!this.isTileSizeSet) return this.GetImageSizeW();
   
   return this.tileSize.GetW();
}

//------------------------------------------------------------------------------
// IsLoaded
Jsprite.prototype.IsLoaded = function() { return this.isLoaded; }

//------------------------------------------------------------------------------
// SetImageSource
// Once set the image will begin downloading from this source.  IsLoaded will
// indicate when it is done.
Jsprite.prototype.SetImageSource = function(imageURL)
{
   this.image     = null;
   this.isLoaded  = false;
   
   this.fileImage = imageURL;
   
   // Start loading the image.
   this.image         = new Image();
   this.image.jsprite = this;
   this.image.onload  = function()
   {
      this.jsprite.isLoaded = true;

      if (this.jsprite.isTileSizeSet)
      {
         this.jsprite.SetTileSize(
            this.jsprite.tileSize.GetW(),
            this.jsprite.tileSize.GetH());
      }
   }
   this.image.src = this.fileImage;
}

//------------------------------------------------------------------------------
// SetPoint
// Set the sprite's canvas location.
Jsprite.prototype.SetPoint = function(v) { return this.point.Set(v); }

//------------------------------------------------------------------------------
// SetTileSize
// Set the size of the tiles found in the image.
Jsprite.prototype.SetTileSize = function(w, h)
{
   this.isTileSizeSet = true;
   this.tileSize.SetWH(w, h);
   if (this.isLoaded)
   {
      this.tileCount.SetWH(
         this.image.width  / w,
         this.image.height / h);
   }
   return true;
}

////////////////////////////////////////////////////////////////////////////////
// Function
////////////////////////////////////////////////////////////////////////////////

//------------------------------------------------------------------------------
// JcolorCreateLinearGradient2
function JcolorCreateLinearGradient2(x, y, w, h, step1Color, step2Color)
{
   var grad;
   
   grad = jprivate_screen.context.createLinearGradient(x, y, x + w, y + h);
   
   grad.addColorStop(0.0, step1Color);
   grad.addColorStop(1.0, step2Color);
   
   return grad;
}

//------------------------------------------------------------------------------
// JcolorCreateLinearGradient3
function JcolorCreateLinearGradient3(x, y, w, h, step1Color, step2Color, step3Color)
{
   var grad;
   
   grad = jprivate_screen.context.createLinearGradient(x, y, x + w, y + h);
   
   grad.addColorStop(0.0, step1Color);
   grad.addColorStop(0.5, step2Color);
   grad.addColorStop(1.0, step3Color);
   
   return grad;
}

//------------------------------------------------------------------------------
// JcolorCreateLinearGradientGlass
// Like an XP button
function JcolorCreateLinearGradientGlass(x, y, w, h, r, g, b)
{
   var grad;
   
   grad = jprivate_screen.context.createLinearGradient(x, y, x + w, y + h);
   
   grad.addColorStop(0.000, "#ffffff");
   grad.addColorStop(0.499, JcolorCreateLighten(r, g, b, 0.5));
   grad.addColorStop(0.501, JcolorCreate(r, g, b));
   grad.addColorStop(1.000, JcolorCreateLighten(r, g, b, -0.5));
   
   return grad;
}

//------------------------------------------------------------------------------
// JcolorCreateRadialGradient
function JcolorCreateRadialGradient2(xstart, ystart, rstart, xend, yend, rend, c1, c2)
{
   var grad
   
   grad = jprivate_screen.context.createRadialGradient(
      xstart, ystart, rstart,
      xend,   yend,   rend);
      
   grad.addColorStop(0.0, c1);
   grad.addColorStop(1.0, c2);
   
   return grad;
}

//------------------------------------------------------------------------------
// JcolorCreate
function JcolorCreate(r, g, b)
{
   return "rgb(" + r + "," + g + "," + b + ")";
}

function JcolorCreateLighten(r, g, b, value)
{
   if (value > 0.0)
   {
      return "rgb(" + 
         Math.floor(255 * value + r * (1. - value)) + "," +
         Math.floor(255 * value + g * (1. - value)) + "," + 
         Math.floor(255 * value + b * (1. - value)) + ")";
   }
   
   return "rgb(" + 
      Math.floor(r * (1. + value)) + "," +
      Math.floor(g * (1. + value)) + "," + 
      Math.floor(b * (1. + value)) + ")";
}

//------------------------------------------------------------------------------
// JscreenStart 
// Start up code.  Must be called before any other javascript library function.
//
// w and h are the width and height of the canvas element.  A canvas element is
// inserted at the location of this call.
function JscreenStart(w, h)
{
   jprivate_screen = new Object();
   
   jprivate_screen.isCreated = false;
   jprivate_screen.mousePos  = new Jpoint();
   jprivate_screen.size      = new Jsize();
   jprivate_screen.size.SetWH(w, h);
   jprivate_screen.frame     = 0;

   document.write("<center><canvas id=screen height=" + h + " width=" + w +" tabindex=1 /></center>");
   jprivate_screen.canvas = document.getElementById("screen");
   if (jprivate_screen.canvas == null) return false;

   jprivate_screen.context = jprivate_screen.canvas.getContext('2d');
   if (jprivate_screen.context == null) return false;

   jprivate_screen.context.strokeStyle = '#ffffff';
   jprivate_screen.context.lineWidth   = 1;
   jprivate_screen.context.fillStyle   = '#000000';
   jprivate_screen.context.fillRect(0,0,w,h);
   
   jprivate_screen.canvas.onmousemove = function(event)
   {
      var loc;
      
      loc = JscreenComputeMousePos(event);
      JscreenSetMousePos(loc);
   }
   
   jprivate_screen.isCreated = true;
   
   return true;
}

//------------------------------------------------------------------------------
// JscreenComputeMousePos
// Calculate the mouse position on the canvas.4
function JscreenComputeMousePos(event)
{
  var canvas,
      rect,
      p;
  
  canvas = event.currentTarget;
  rect   = canvas.getBoundingClientRect();
  
  p = new Jpoint();
  p.SetXY(event.clientX - rect.left, event.clientY - rect.top);
  
  return p;
}

//------------------------------------------------------------------------------
// JscreenDrawSprite
// Draw a sprite to the screen.  This will draw the whole image at the location
// stored in the sprite.
function JscreenDrawSprite(sprite)
{
   if (!sprite.IsLoaded()) return false;

   var loc;
   loc = sprite.GetPoint();
   jprivate_screen.context.drawImage(sprite.GetImage(), loc.GetX(), loc.GetY());
   return true;
}

//------------------------------------------------------------------------------
// JscreenDrawSpriteTile
// Draws a sprite tile to the screen.  The position is stored in the sprite.
function JscreenDrawSpriteTile(sprite, indexX, indexY)
{
   if (!sprite.IsLoaded()) return false;
   
   var loc,
       tileLoc;
   
   loc     = sprite.GetPoint();
   tileLoc = sprite.GetTilePoint(indexX, indexY);
   
   jprivate_screen.context.drawImage(
      sprite.GetImage(),
      tileLoc.GetX(), tileLoc.GetY(), sprite.GetTileW(), sprite.GetTileH(),
      loc.GetX(),     loc.GetY(),     sprite.GetTileW(), sprite.GetTileH());      
}

//------------------------------------------------------------------------------
// JscreenDrawLine
// Draw a 2 point line to the screen at a given color and width.
function JscreenDrawLine(p1, p2, color, width)
{
   // set up the properties of the line.
   jprivate_screen.context.strokeStyle = color;
   jprivate_screen.context.lineWidth   = width;
   
   // draw the line.
   jprivate_screen.context.beginPath();
   
   jprivate_screen.context.moveTo(p1.GetX(), p1.GetY());
   jprivate_screen.context.lineTo(p2.GetX(), p2.GetY());
   
   jprivate_screen.context.stroke();
   
   return true;
}

//------------------------------------------------------------------------------
// JscreenDrawRect
// Draw a box
function JscreenDrawRect(r, color, width)
{
   jprivate_screen.context.strokeStyle = color;
   jprivate_screen.context.lineWidth   = width;
   
   jprivate_screen.context.strokeRect(r.GetPointX(), r.GetPointY(), r.GetSizeW(), r.GetSizeH());

   return true;
}

//------------------------------------------------------------------------------
// JscreenDrawRectFill
// Draw a box
function JscreenDrawRectFill(r, color)
{
   jprivate_screen.context.fillStyle = color;
   
   jprivate_screen.context.fillRect(r.GetPointX(), r.GetPointY(), r.GetSizeW(), r.GetSizeH());

   return true;
}

//------------------------------------------------------------------------------
// JscreenDrawEllipse
// Draw an ellipse
function JscreenDrawEllipse(r, color, width)
{
   var radian,
       step,
       p,
       off;
       
   jprivate_screen.context.strokeStyle = color;
   jprivate_screen.context.lineWidth   = width;
   
   jprivate_screen.context.beginPath();

   p   = new Jpoint();
   off = new Jpoint();
   off.SetXY(r.GetPointX() + r.GetSizeW() / 2, r.GetPointY() + r.GetSizeH() / 2);
   for (step = 0; step < 41; step++)
   {
      radian = Math.PI / 2.0 - (step / 40.) * (Math.PI * 2.0);
   
      p.SetXY(Math.cos(radian) * r.GetSizeW() / 2, -Math.sin(radian) * r.GetSizeH() / 2);
      p.Add(off);
      
      if (step == 0)
      {
         jprivate_screen.context.moveTo(p.GetX(), p.GetY());
      }
      else
      {      
         jprivate_screen.context.lineTo(p.GetX(), p.GetY());
      }
   }   
                                           
   jprivate_screen.context.stroke();

   return true;
}

//------------------------------------------------------------------------------
// JscreenDrawEllipseFill
// Draw a box
function JscreenDrawEllipseFill(r, color)
{
   var radian,
       step,
       p,
       off;
       
   jprivate_screen.context.fillStyle = color;
   
   jprivate_screen.context.beginPath();

   p   = new Jpoint();
   off = new Jpoint();
   off.SetXY(r.GetPointX() + r.GetSizeW() / 2, r.GetPointY() + r.GetSizeH() / 2);
   for (step = 0; step < 40; step++)
   {
      radian = Math.PI / 2.0 - (step / 40.) * (Math.PI * 2.0);
   
      p.SetXY(Math.cos(radian) * r.GetSizeW() / 2, -Math.sin(radian) * r.GetSizeH() / 2);
      p.Add(off);
      
      if (step == 0)
      {
         jprivate_screen.context.moveTo(p.GetX(), p.GetY());
      }
      else
      {      
         jprivate_screen.context.lineTo(p.GetX(), p.GetY());
      }
   }
                                           
   jprivate_screen.context.fill();

   return true;
}

//------------------------------------------------------------------------------
// JscreenDrawSetAlpha
function JscreenDrawSetAlpha(percent)
{
   jprivate_screen.context.globalAlpha = percent;
}

//------------------------------------------------------------------------------
// JscreenDrawTriangleFill
// Draw a box
function JscreenDrawTriangleFill(p1, p2, p3, color)
{
   jprivate_screen.context.fillStyle = color;
   
   jprivate_screen.context.beginPath();

   jprivate_screen.context.moveTo(p1.GetX(), p1.GetY());
   jprivate_screen.context.lineTo(p2.GetX(), p2.GetY());   
   jprivate_screen.context.lineTo(p3.GetX(), p3.GetY());   
   
   jprivate_screen.context.fill();

   return true;
}

//------------------------------------------------------------------------------
// JscreenGetCanvas
// Get the canvas element.
function JscreenGetCanvas()
{
   if (!jprivate_screen.isCreated) return null;

   return this.canvas;
}

//------------------------------------------------------------------------------
// JscreenGetContext
// Get the canvas' context.  2D in this case.
function JscreenGetContext()
{
   if (!jprivate_screen.isCreated) return null;

   return jprivate_screen.context;
}

//------------------------------------------------------------------------------
// JscreenGetCenter
// Convenience function for getting the center point of the canvas.
function JscreenGetCenter() 
{
   var p;
   
   p = new Jpoint();
   
   p.SetXY(jprivate_screen.size.GetW() / 2, jprivate_screen.size.GetH() / 2);
   
   return p;
}

//------------------------------------------------------------------------------
// JscreenGetFrame
// Get the current frame number of the screen.
function JscreenGetFrame()
{
   return jprivate_screen.frame;
}

//------------------------------------------------------------------------------
// JscreenGetH
// Get the height of the screen.
function JscreenGetH()
{
   return jprivate_screen.size.GetH();
}

//------------------------------------------------------------------------------
// JscreenGetMousePos
// Get the mouse position.  This will be the pixel location on the canvas
// element.
function JscreenGetMousePos()
{
   var p;
   
   p = new Jpoint();
   p.Set(jprivate_screen.mousePos);
   
   return p;
}

//------------------------------------------------------------------------------
// JscreenGetMousePosX
// Get the mouse position's x value.
function JscreenGetMousePosX()
{
   return jprivate_screen.mousePos.GetX();
}

//------------------------------------------------------------------------------
// JscreenGetMousePosY
// Get the mosue position's y value.
function JscreenGetMousePosY()
{
   return jprivate_screen.mousePos.GetY();
}

//------------------------------------------------------------------------------
// JscreenGetRect
function JscreenGetRect()
{
   var rect;
   
   rect = new Jrect();
   
   rect.SetSize(jprivate_screen.size);

   return rect;
}

//------------------------------------------------------------------------------
// JscreenGetW
// Get the screen width.
function JscreenGetW() 
{
   return jprivate_screen.size.GetW();
}

//------------------------------------------------------------------------------
// JscreenIncrementFrame
// Bump to the next frame.
function JscreenIncrementFrame()
{
   jprivate_screen.frame++;
   return true;
}

//------------------------------------------------------------------------------
// JscreenIsCreated
// flag to determine if the screen was initialized properly
function JscreenIsCreated()
{
   return jprivate_screen.isCreated;
}

//------------------------------------------------------------------------------
// JscreenSetMousePos
// Set the mouse position.
function JscreenSetMousePos(v)
{
   return jprivate_screen.mousePos.Set(v);
}
