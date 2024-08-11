  

    function handleDoubleClickEvent(evt){

      clicks = 0;
      polygon = new Polygon();
      closedPolygon = false;
      isTargeting = false;

      CleanContext();

    }
  
    function handleMouseDownEvent(evt) {

      clicks++;
      var mousePos = getMousePos(evt);

      var mousePosition = new Point(mousePos.x, mousePos.y);

      if( (!closedPolygon) &&  (clicks>2) ) {

        var firstVertex = polygon.getFirstVertex();

        if (firstVertex.getDistance(mousePosition) < radiusStartCircle){ 
          if(polygon.canClose()) {
            
            closedPolygon = true;
          }
        }
      }

      var vertexAdded = false;
      if (!closedPolygon) {
         vertexAdded = polygon.addVertex( mousePosition);
      }

      var message = 'Mouse position: ' + mousePosition.x + ',' + mousePosition.y;
      console.log(message);
      //writeMessage(canvas, message);

      CleanContext();
      if(!closedPolygon){
        PaintCircle (context, polygon.getFirstVertex(), radiusStartCircle, false, 'red');

        if(!vertexAdded){
          writeMessage("No cruces las aristas, elige otro punto.", 10, 25);
        }
      }

      if(isTargeting)
      {
          PaintCircle (context, mousePosition        , radiusTargetCircle, true, 'red');
          PaintCircle (context, polygon.getMidpoint(), radiusTargetCircle, true, 'blue');
          PaintCircle (context, polygon.getMidpoint(), polygon.getEquivalentCircleByArea(), false, 'blue');
          PaintCircle (context, polygon.getMidpoint(), polygon.getEquivalentCircleByPerimeter(), false, 'black');

          var isInside = polygon.isInside(mousePosition);

          if(isInside){
            writeMessage("Posicion: DENTRO", 10, 25, 'red'); 
          }else{
            writeMessage("Posicion: FUERA" , 10, 25, 'red');             
          }

          writeMessage("Doble click para reiniciar", 580, 25, 'red');
          writeMessage("Area: " + polygon.getArea2(), 10, 415, 'red');
          writeMessage("En azul se representa el círculo equivalente en área y el punto medio", 10, 430, 'blue');
          writeMessage("En negro se representa el círculo equivalente en perímetro"      , 10, 445, 'black');

          if(polygon.isAreaMaximized()){
            writeMessage("Has conseguido realizar un polígono con un área óptima en relación al perimetro", 10, 40, 'red');
          }else{
            writeMessage("No has conseguido realizar un polígono con un área óptima en relación al perimetro", 10, 40, 'red');
          }


      }

      var polygonPainter = new PolygonPainter(context, polygon, closedPolygon);
      polygonPainter.setEdgesLineWidth(2);
      polygonPainter.paint();

      //PaintGrid(context, canvas.width, canvas.height);

      if(closedPolygon){
        isTargeting = true;
      }

    }

    function handleMouseMoveEvent(evt){
      
      var vertex = null;

      if((clicks>0) && (!closedPolygon)){

        mousePos = getMousePos(evt);
      
        CleanContext();
        PaintLine   (context, polygon.getLastVertex(), mousePos);
        PaintCircle (context, polygon.getFirstVertex(), radiusStartCircle, false, 'red');
        var polygonPainter = new PolygonPainter(context, polygon, closedPolygon);
        polygonPainter.setEdgesLineWidth(2);
        polygonPainter.paint();
      }

    }

    function CleanContext(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function writeMessage(message, i, j, color) {
       
       context.fillStyle = color;
       context.font = '14px Arial';
       context.fillText(message, i, j);
    }

    function getMousePos(evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
       };
    }
