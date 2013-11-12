# skinpreview.js

A jQuery library for rendering Minecraft skins on an HTML5 canvas. 

[View demo](http://hacksore.github.io/skinpreview.js)

 
# Quick reference
Use the `data-player` property to set the skin to be drawn inside of the div.


```html
<div class="skins" data-player="Hacksore"></div>
<div class="skins" data-player="Notch"></div>
```


```javascript
$(".skins").skinPreview();
```