////////////////////////////////////////////////////////////////////////////////
// Title animation.
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
// Pdraw
// redraw the screen.
function Pdraw()
{
   var canvas,
       context,
       frame,
       pos,
       p,
       percent,
       index;
   
   if (!JscreenIsCreated()) return;
   
   frame   = JscreenGetFrame() / 2;
   canvas  = JscreenGetCanvas();
   context = JscreenGetContext();
   
   JscreenIncrementFrame();
   
   JscreenDrawSprite(stitle);

   pos = new Jpoint();
   if (season == summer)
   {
      for (index = 0; index < 20; index++)
      {
         // reseed
         if (frame - sseason[index].frameStart > 1032.0)
         {
            sseason[index].posX       = Math.random() * 1032 - 32;
            sseason[index].frameStart = frame + Math.random() * 1032;
         }
         
         if (frame < sseason[index].frameStart) continue;
         
         percent = (((frame - sseason[index].frameStart) % 1032) / 1032.0) / 2.0;
      
         p = Jpoint.GetClockVectorPercent(percent);
         p.Scale(128);
         
         // move the sun from left to right.
         pos.SetXY(
            //(((frame / 2) % 1032 - 32) + (sseason[index].posX)) % 1032 - 32, 
            sseason[index].posX,
            128 - p.GetX());

         sseason[index].SetPoint(pos);
         JscreenDrawSpriteTile(sseason[index], 0, season);
      }
   }
   else if (season == fall)
   {
      for (index = 0; index < 20; index++)
      {
         if (frame - sseason[index].frameStart > 192)
         {
            sseason[index].posX       = Math.random() * 1032 - 32;
            sseason[index].frameStart = frame + Math.random() * 192;
            pos.SetXY(sseason[index].posX, -32);
            sseason[index].SetPoint(pos);
            //alert("pause");
         }
         
         if (frame < sseason[index].frameStart) continue;
         
         pos.SetXY(
            sseason[index].GetPoint().GetX() - 0.5,
            sseason[index].GetPoint().GetY() + 1);
         
         sseason[index].SetPoint(pos);
         JscreenDrawSpriteTile(sseason[index], 0, season);
      }
   }
   else if (season == winter)
   {
      for (index = 0; index < 20; index++)
      {
         if (frame - sseason[index].frameStart > 192)
         {
            sseason[index].posX       = Math.random() * 1032 - 32;
            sseason[index].frameStart = frame + Math.random() * 192;
            pos.SetXY(sseason[index].posX, -32);
            sseason[index].SetPoint(pos);
            //alert("pause");
         }
         
         if (frame < sseason[index].frameStart) continue;
         
         pos.SetXY(
            sseason[index].GetPoint().GetX() + 0.5,
            sseason[index].GetPoint().GetY() + 1);
         
         sseason[index].SetPoint(pos);
         JscreenDrawSpriteTile(sseason[index], 0, season);
      }
   }
   else if (season == spring)
   {
      for (index = 0; index < 20; index++)
      {
         if (frame - sseason[index].frameStart > 128)
         {
            sseason[index].posX       = Math.random() * 1032 - 32;
            sseason[index].frameStart = frame + Math.random() * 128;
         }
         
         if (frame < sseason[index].frameStart) continue;
         
         percent = (((frame - sseason[index].frameStart) % 128) / 128.0) / 2.0;
      
         p = Jpoint.GetClockVectorPercent(percent);
         p.Scale(32);
         
         // move the sun from left to right.
         pos.SetXY(
            //(((frame / 2) % 1032 - 32) + (sseason[index].posX)) % 1032 - 32, 
            sseason[index].posX,
            128 - p.GetX());

         sseason[index].SetPoint(pos);
         JscreenDrawSpriteTile(sseason[index], 0, season);
      }
   }
}

////////////////////////////////////////////////////////////////////////////////
// Main program.
////////////////////////////////////////////////////////////////////////////////
var stitle,
    sseason,
    season,
    summer = 0,
    fall   = 1,
    winter = 2,
    spring = 3,
    index;

function StartTitle()
{
   var date;
   
   date = new Date();
   
   // Set the season
   if      (date.getMonth() == 11 || date.getMonth() <= 1) season = winter;
   else if (date.getMonth() <= 4)                          season = spring;
   else if (date.getMonth() <= 7)                          season = summer;
   else if (date.getMonth() <= 9)                          season = fall;
       
   // Load the title image.
   stitle = new Jsprite();
   stitle.SetImageSource("http://zekaric.com/wp/wp-content/uploads/2013/01/wpTitle.gif");

   // Prep the sprit array.
   sseason = new Array(50);

   for (index = 0; index < 50; index++)
   {
      sseason[index] = new Jsprite();
      sseason[index].SetTileSize(32, 32);
      sseason[index].SetImageSource("season.png");
      
      sseason[index].frameStart = -1000000;
      sseason[index].posX       = Math.random() * 1032 - 32;
   }

   // init the screen.
   JscreenStart(1000, 128);
       
   // vport wasn't created properly.  Program can't run.
   if (!JscreenIsCreated())
   {
      document.write("<br />ERROR: No canvas.");
   }
   // Initialize the program.
   else
   {
      // Set the redraw interval.
      window.setInterval(function() { Pdraw(); }, jfps60);
   }
}
