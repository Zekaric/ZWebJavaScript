////////////////////////////////////////////////////////////////////////////////
// Time
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
// function
////////////////////////////////////////////////////////////////////////////////

function PdrawCursorSelect(r, frame)
{
   var index,
       tria,
       trib,
       tric,
       w,
       offset,
       angle,
       rate;
       
   rate = 240.;
   
   w = r.GetSizeW() * 0.35;
   
   offset = new Jpoint();
   offset.SetXY(
      r.GetPointX() + r.GetSizeW() / 2,
      r.GetPointY() + r.GetSizeW() / 2);
   
   tria = new Jpoint();
   trib = new Jpoint();
   tric = new Jpoint();
   
   for (index = 0; index < 8; index++)
   {
      angle = index / 8.0 + frame / rate;
      tria = Jpoint.GetClockVectorPercent(angle + 0.99);
      trib = Jpoint.GetClockVectorPercent(angle + 0.000);
      tric = Jpoint.GetClockVectorPercent(angle + 0.01);
      
      tria.Scale(w);
      trib.Scale(w * 0.9);
      tric.Scale(w);
      
      tria.Add(offset);
      trib.Add(offset);
      tric.Add(offset);
      
      JscreenDrawTriangleFill(tria, trib, tric, "#ffffff");

      angle = index / 8.0 - frame / rate;
      tria = Jpoint.GetClockVectorPercent(angle + 0.99);
      trib = Jpoint.GetClockVectorPercent(angle + 0.000);
      tric = Jpoint.GetClockVectorPercent(angle + 0.01);
      
      tria.Scale(w);
      trib.Scale(w * 0.9);
      tric.Scale(w);
      
      tria.Add(offset);
      trib.Add(offset);
      tric.Add(offset);
      
      JscreenDrawTriangleFill(tria, trib, tric, "#ffffff");
   }
}

function PdrawCursorSelected(r, frame)
{
   var index,
       p,
       w,
       offset,
       angle,
       rate,
       rect;
       
   rate = 240.;
   
   w = r.GetSizeW() * 0.4;
   
   offset = new Jpoint();
   offset.SetXY(
      r.GetPointX() + r.GetSizeW() / 2,
      r.GetPointY() + r.GetSizeW() / 2);
   
   p    = new Jpoint();
   rect = new Jrect();
   
   for (index = 0; index < 8; index++)
   {
      angle = index / 8.0 + frame / rate;
      p     = Jpoint.GetClockVectorPercent(angle);
      
      p.Scale(w);
      p.Add(offset);
      
      rect.SetPointXY(p.GetX() - w * 0.1, p.GetY() - w * 0.1);
      rect.SetSizeWH(w * 0.2, w * 0.2);
      
      JscreenDrawEllipseFill(rect, "#ffffff");

      angle = index / 8.0 - frame / rate;
      p     = Jpoint.GetClockVectorPercent(angle);
      
      p.Scale(w);
      p.Add(offset);
      
      rect.SetPointXY(p.GetX() - w * 0.1, p.GetY() - w * 0.1);
      rect.SetSizeWH(w * 0.2, w * 0.2);
      
      JscreenDrawEllipseFill(rect, "#ffffff");
   }
}

function PdrawCursorMove1(r, frame)
{
}

function PdrawCursorMove2(r, frame)
{
}

function PdrawCursorMoveX(r, frame)
{
}

//------------------------------------------------------------------------------
function PdrawTile(r, isOdd)
{
   var color,
       fill,
       inset;
   
   
   color = JcolorCreateLinearGradient3(
      r.GetPointX(),
      r.GetPointY(),
      r.GetSizeW(),
      r.GetSizeH(), 
      JcolorCreate(255, 255, 255),
      JcolorCreate(128, 128, 128),
      JcolorCreate(0, 0, 0));
   if (isOdd)
   {
      fill = JcolorCreateLinearGradient2(
         r.GetPointX(),
         r.GetPointY(),
         0,
         r.GetSizeH(), 
         JcolorCreateLighten(255, 255, 255, 0),
         JcolorCreateLighten(128, 128, 128, 0));
   }
   else
   {
      fill = JcolorCreateLinearGradient2(
         r.GetPointX(),
         r.GetPointY(),
         0,
         r.GetSizeH(), 
         JcolorCreateLighten(255, 255, 255, -.25),
         JcolorCreateLighten(128, 128, 128, -.25));
   }

   JscreenDrawRectFill(r, color);
   
   inset = new Jrect();
   inset.Set(r);
   inset.Inflate(-r.GetSizeW() * 0.05, -r.GetSizeH() * 0.05);
   JscreenDrawRectFill(inset, fill);
}

//------------------------------------------------------------------------------
function PdrawPiece(r, player)
{
   var color,
       lgrad,
       rgrad,
       rSpot;
   
   if      (player == 1)
   {
      rgrad = JcolorCreateRadialGradient2(
         r.GetPointX() + r.GetSizeW() / 2 - r.GetSizeW() / 4,
         r.GetPointY() + r.GetSizeH() / 2 - r.GetSizeH() / 4,
         r.GetSizeW() / 4.,
         r.GetPointX() + r.GetSizeW() / 2 - r.GetSizeW() / 4,
         r.GetPointY() + r.GetSizeH() / 2 - r.GetSizeH() / 4,
         r.GetSizeW() / 1.,
         "#ff0000",
         "#000000");
      lgrad = JcolorCreateLinearGradientGlass(r.GetPointX(), r.GetPointY(), 0, r.GetSizeH(), 255, 0, 0);
   }
   else if (player == 2)
   {
      rgrad = JcolorCreateRadialGradient2(
         r.GetPointX() + r.GetSizeW() / 2 - r.GetSizeW() / 4,
         r.GetPointY() + r.GetSizeH() / 2 - r.GetSizeH() / 4,
         r.GetSizeW() / 4.,
         r.GetPointX() + r.GetSizeW() / 2 - r.GetSizeW() / 4,
         r.GetPointY() + r.GetSizeH() / 2 - r.GetSizeH() / 4,
         r.GetSizeW() / 1.,
         "#0000ff",
         "#000000");
      lgrad = JcolorCreateLinearGradientGlass(r.GetPointX(), r.GetPointY(), 0, r.GetSizeH(), 0, 0, 255);
   }
   else
   {
      return;
   }
   
   rspot = new Jrect();
   rspot.SetSizeWH(r.GetSizeW() / 20.,                 r.GetSizeH() / 20.);
   rspot.SetPointXY(r.GetPointX() + r.GetSizeW() / 3., r.GetPointY() + r.GetSizeH() / 3.);

   
   JscreenDrawEllipseFill(r, rgrad);
   
   JscreenDrawSetAlpha(0.5);
   JscreenDrawEllipseFill(r, lgrad);

   JscreenDrawSetAlpha(1.0);
   JscreenDrawEllipseFill(rspot, "#ffffff");

   JscreenDrawEllipse(r, "#000000", 1);
}

//------------------------------------------------------------------------------
// Pdraw
// redraw the screen.
function Pdraw()
{
   var canvas,
       context,
       row,
       col,
       value,
       color,
       rect,
       piece,
       w,
       x,
       xoff,
       y,
       yoff,
       grad,
       frame;
   
   if (!JscreenIsCreated()) return;

   // Update the frame.
   frame = JscreenGetFrame();
   JscreenIncrementFrame();

   // Get the mouse
   mouseX = JscreenGetMousePosX();
   mouseY = JscreenGetMousePosY();
   
   // Clear the screen.
   grad = JcolorCreateLinearGradient3(
      0,
      0,
      JscreenGetW(),
      0,
      JcolorCreate(255, 0,   0),
      JcolorCreate(0,   0,   0),
      JcolorCreate(0,   0, 255));
   JscreenDrawRectFill(JscreenGetRect(), grad);
   
   w = Math.floor(Math.min(JscreenGetW(), JscreenGetH()) / 8.);
   xoff = w * 7. / 2.;
   yoff = xoff;
   
   xoff = Math.floor(JscreenGetW() / 2.  - xoff);
   yoff = Math.floor(JscreenGetH() / 2. - yoff);

   rect  = new Jrect();
   piece = new Jrect();

   rect.SetSizeWH(w, w);
   
   // Draw the board
   for (row = 0; row < 7; row++)
   {
      x = row * w + xoff;
      for (col = 0; col < 7; col++)
      {
         y = col * w + yoff;
         if (PboardTileGet(0, col, row) == 0)
         {
            rect.SetPointXY(x, y);
            PdrawTile(rect, (row & 1) ^ (col & 1));
         }
         
         piece.Set(rect);
         piece.Inflate(-w * 0.2, -w * 0.2);
         PdrawPiece(piece, PboardGet(col, row));

         // Process the mouse button
         if (mouseUp.isActive &&
             x < mouseUp.x && mouseUp.x < x + w &&
             y < mouseUp.y && mouseUp.y < y + w)
         {
            mouseUp.isActive         = false;
            pieceSelected.isSelected = true;
            pieceSelected.col        = col;
            pieceSelected.row        = row;
         }
         
         // Mouse current location.
         if (x < mouseX && mouseX < x + w &&
             y < mouseY && mouseY < y + w &&
             PboardGet(col, row) != 0)
         {
            PdrawCursorSelect(rect, frame);
         }
         
         // Draw the selected piece.
         if (pieceSelected.isSelected &&
             pieceSelected.col == col &&
             pieceSelected.row == row)
         {
            PdrawCursorSelected(rect, frame);
         }
      }
   }
}

//------------------------------------------------------------------------------
// Keyboad handler.
function PkeyNotify(event)
{
   if (event &&
       event.type == "keydown")
   {
      if (event.keyCode)
      {
         keyPressed = event.keyCode;
         // space
         if (keyPressed == 32)
         {
            if (isRunning)
            {
               stopTime  = new Date();
               isRunning = false;
            }
            else
            {
               isRunning = true;
               startTime = new Date();
            }
         }
         // back space
         else if (keyPressed == 8)
         {
            isRunning = false;
            startTime = new Date();
            stopTime  = startTime;
         }
         else if (keyPressed == 13)
         {
            isStopWatchOn = !isStopWatchOn;
         }
         else
         {
            //alert(event.keyCode);
         }
      }
   }
}

//------------------------------------------------------------------------------
// Mouse up handler.
function PmouseNotify(event)
{
   mouseUp.isActive = true;
   mouseUp.x        = JscreenGetMousePosX();
   mouseUp.y        = JscreenGetMousePosY();
}

//------------------------------------------------------------------------------
// PboardGet
// Get the board values.
function PboardGet(x, y)
{
   return board[x * 7 + y];
}

//------------------------------------------------------------------------------
// PboardSet
// Set the board values.
function PboardSet(x, y, value)
{
   board[x * 7 + y] = value;
   return true;
}

function PboardTileGet(set, x, y)
{
   if (x > 3) x = 6 - x;
   if (y > 3) y = 6 - y;
   return boardConfig[set] & (1 << (x + y * 4));
}

////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////
var keyPressed,
    board,
    boardConfig,
    mouseX,
    mouseY,
    mouseUp,
    pieceSelected;

// init
function StartAttax()
{
   var row, 
       col;

   // vport wasn't created properly.  Program can't run.
   JscreenStart(window.innerWidth, window.innerHeight);
   if (!JscreenIsCreated())
   {
      document.write("<br />ERROR: No canvas.");
      return false;
   }

   pieceSelected            = new Object();
   pieceSelected.isSelected = false;
   pieceSelected.col        = 0;
   pieceSelected.row        = 0;
   
   mouseUp          = new Object();
   mouseUp.isActive = false;
   mouseUp.x        = 0;
   mouseUp.y        = 0;
   
   // Initialize the program.
   document.onkeydown = PkeyNotify;
   document.onmouseup = PmouseNotify;
   
   board = new Array(7 * 7);
   for (row = 0; row < 7; row++)
   {
      for (col = 0; col < 7; col++)
      { 
         PboardSet(row, col, 0);
      }
   }
   PboardSet(0, 0, 1);
   PboardSet(6, 0, 2);
   PboardSet(0, 6, 2);
   PboardSet(6, 6, 1);
   
   boardConfig = new Array();
   boardConfig[0] = 0;
   boardConfig[1] = 
      (1 << 15);
   boardConfig[2] = 
      (1 << 15) |
      (1 << 14) |
      (1 << 11);
   boardConfig[3] = 
      (1 << 15) |
      (1 << 14) |
      (1 << 13) |
      (1 << 11) |
      (1 <<  7);
   boardConfig[4] = 
      (1 << 15) |
      (1 << 14) |
      (1 << 13) |
      (1 << 11) |
      (1 << 10) |
      (1 <<  7);
   boardConfig[5] = 
      (1 <<  1) |
      (1 <<  3) |
      (1 <<  4) |
      (1 <<  6) |
      (1 <<  9) |
      (1 << 11) |
      (1 << 12) |
      (1 << 14);
    

   // Set the redraw interval.
   window.setInterval(function() { Pdraw(); }, jfps60);
   
   return true;
}
