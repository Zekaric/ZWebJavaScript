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

//------------------------------------------------------------------------------
// PdrawTick
// Draw a tick on the screen.
function PdrawTick(angle, delta, distance1, distance2, color, thickness)
{
   var a = new Jpoint(),
       b;
       
   b = Jpoint.GetClockVectorPercent(angle);
   
   a.Set(b);  
   a.Scale(delta * distance1); a.Add(JscreenGetCenter());
   b.Scale(delta * distance2); b.Add(JscreenGetCenter());
   
   JscreenDrawLine(a, b, color, thickness);
}

//------------------------------------------------------------------------------
// Pdraw
// redraw the screen.
function Pdraw()
{
   var canvas,
       context,
       hour,
       min,
       sec,
       msec,
       splitH,
       splitM,
       splitS,
       splitm,
       hTick,
       mTick,
       hIndex,
       mIndex,
       date,
       a,
       b,
       am,
       bm,
       value,
       color,
       splitTime;
   
   if (!JscreenIsCreated()) return;

   canvas  = JscreenGetCanvas();
   context = JscreenGetContext();

   // Clear the screen.
   context.fillRect(0, 0, JscreenGetW(), JscreenGetH());

   // Get the current time.
   date = new Date();
   hour = date.getHours();
   min  = date.getMinutes();
   sec  = date.getSeconds();
   msec = date.getMilliseconds();

   if (isRunning)
   {
      splitTime = new Date(date.getTime() - startTime.getTime());
   }
   else 
   {
      splitTime = new Date(stopTime.getTime() - startTime.getTime());
   }
   splitH    = splitTime.getHours();
   splitM    = splitTime.getMinutes();
   splitS    = splitTime.getSeconds();
   splitm    = splitTime.getMilliseconds();
   
   // Draw the clock
  
   a  = new Jpoint();
   am = new Jpoint();
   bm = new Jpoint();
   
   yTick = Math.min(JscreenGetH(), JscreenGetW()) / 20;
   for (hIndex = 0; hIndex < 48; hIndex++)
   {      
      value = hIndex / 48.0 + .5;
      if (value > 1.0)
      {
         value -= 1.0;
      }
      
      if      (hIndex == 0)
      {
         PdrawTick(value, yTick, 8, 9, "#0000aa", 10);
      }
      else if (hIndex == 24)
      {
         PdrawTick(value, yTick, 8, 9, "#ffff00", 10);
      }
      else if (hIndex < 12 || hIndex > 36)
      {
         if      (hIndex % 2 == 1)
         {
            PdrawTick(value, yTick, 8.25, 8.75, "#0000aa", 2);
         }
         else if (hIndex % 6 == 0)
         {
            PdrawTick(value, yTick, 8, 9, "#0000aa", 5);
         }
         else
         {
            PdrawTick(value, yTick, 8, 9, "#0000aa", 2);
         }
      }
      else
      {
         if      (hIndex % 2 == 1)
         {
            PdrawTick(value, yTick, 8.25, 8.75, "#ffff00", 2);
         }
         else if (hIndex % 6 == 0)
         {
            PdrawTick(value, yTick, 8, 9, "#ffff00", 5);
         }
         else
         {
            PdrawTick(value, yTick, 8, 9, "#ffff00", 2);
         }
      }
   }

   value = hour / 24.0 + min / 60.0 / 24.0 + sec / 60.0 / 60.0 / 24.0 + .5;
   if (value > 1.0)
   {
      value -= 1.0;
   }
   
   PdrawTick(value, yTick, 7, 8, "#ffffff", 10);
   
   //if (isStopWatchOn)
   //{
   //   PdrawTick(splitH / 24.0, yTick, 7, 8, "#ff0000", 2);
   //}

   for (mIndex = 0; mIndex < 60; mIndex++)
   {
      if (!mIndex)
      {
         value = 255;
      }
      else
      {
         value = Math.floor((mIndex + 15) / 75.0 * 255.0);
      }
      color = "rgb(" + value + "," + value + "," + value + ")";
      
      if      (mIndex % 15 == 0)
      {
         PdrawTick(mIndex / 60.0, yTick, 5, 6, color, 10);
      }
      else if (mIndex % 5 == 0)
      {
         PdrawTick(mIndex / 60.0, yTick, 5, 6, color, 5);
      }
      else
      {
         PdrawTick(mIndex / 60.0, yTick, 5.25, 5.75, color, 2);
      }
   }

   PdrawTick(
      min / 60.0 + sec / 60.0 / 60.0 + msec / 1000.0 / 60.0 / 60.0,
      yTick,
      6, 
      7,
      "#ffffff",
      5);

   PdrawTick(
      sec / 60.0 + msec / 1000.0 / 60.0,
      yTick,
      4,
      5,
      "#ffffff",
      2);

   if (isStopWatchOn)
   {
      PdrawTick(splitM / 60.0, yTick, 6, 7, "#ff0000", 2);

      PdrawTick(splitS / 60.0, yTick, 4, 5, "#ff0000", 2);
   }

   for (mIndex = 0; mIndex < 1000; mIndex += 10)
   {
      if (!mIndex)
      {
         value = 255;
      }
      else
      {
         value = Math.floor((mIndex + 300) / 1300.0 * 255.0);
      }
      color = "rgb(" + value + "," + value + "," + value + ")";
      
      PdrawTick(mIndex / 1000.0, yTick, 2.25, 2.75, color, 2);
   }

   PdrawTick(msec / 1000.0, yTick, 3.25, 3.75, "#ffffff", 2);
   
   if (isStopWatchOn)
   {
      PdrawTick(splitm / 1000.0, yTick, 3.25, 3.75, "#ff0000", 2);
   }   
   
   context.stroke();
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

////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////
var keyPressed,
    startTime,
    stopTime,
    isRunning,
    isStopWatchOn;

// init
isStopWatchOn  = false;
isRunning      = false;
startTime      = new Date();
stopTime       = startTime;
    
function StartTime()
{    
   // vport wasn't created properly.  Program can't run.
   JscreenStart(window.innerWidth, window.innerHeight);
   if (!JscreenIsCreated())
   {
      document.write("<br />ERROR: No canvas.");
   }
   // Initialize the program.
   else
   {
      document.onkeydown = PkeyNotify;

      // Set the redraw interval.
      window.setInterval(function() { Pdraw(); }, jfps60);
   }
}
