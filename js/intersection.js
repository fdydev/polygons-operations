  

    function handleDoubleClickEvent(evt){

      clicks = 0;
      polygon1 = new Polygon();
      polygon2 = new Polygon();

      closedPolygon1 = false;
      closedPolygon2 = false;

      isTargeting = false;

      CleanContext();

    }

    function handleMouseDownEvent(evt) {

      if(intersectionDone){
        // Se vuelve a empezar.
        clicks  = 0;
        clicks2 = 0;

        polygon1 = new Polygon();
        polygon2 = new Polygon();

        closedPolygon1 = false;
        closedPolygon2 = false;

        intersectionDone = false;
      }      
    
      clicks++;
      var mousePos = getMousePos(evt);

      var mousePosition = new Point(mousePos.x, mousePos.y);

      if( (!closedPolygon1) &&  (clicks>2) ) {

        var firstVertex = polygon1.getFirstVertex();

        if (firstVertex.getDistance(mousePosition) < radiusStartCircle){ 
          if(polygon1.canClose()) {
            
            closedPolygon1 = true;
            clicks2 = clicks;
          }
        }
      }

      if( (closedPolygon1) &&  (!closedPolygon2) && (clicks > (clicks2 + 2) ) ) {

        firstVertex = polygon2.getFirstVertex();

        if (firstVertex.getDistance(mousePosition) < radiusStartCircle){ 
          if(polygon2.canClose()) {
            
            closedPolygon2 = true;
          }
        }
      }


      var vertexAdded = false;
      if (!closedPolygon1) {
         vertexAdded = polygon1.addVertex( mousePosition);
      }

      if (closedPolygon1 &&  !closedPolygon2 && clicks>clicks2) {
         vertexAdded = polygon2.addVertex( mousePosition);
      }

      var message = 'Mouse position: ' + mousePosition.x + ',' + mousePosition.y;
      console.log(message);
      //writeMessage(canvas, message);

      CleanContext();
      if(!closedPolygon1){
        PaintCircle (context, polygon1.getFirstVertex(), radiusStartCircle, false);

        if(!vertexAdded){
          writeMessage("No cruces las aristas, elige otro punto.", 21, 10, 25);
        }
      }

      if(closedPolygon1 && !closedPolygon2 && clicks>clicks2 ){
        PaintCircle (context, polygon2.getFirstVertex(), radiusStartCircle, false);

        if(!vertexAdded){
          writeMessage("No cruces las aristas, elige otro punto.", 21, 10, 25);
        }
      }      

      var polygonPainter1 = new PolygonPainter(context, polygon1, closedPolygon1);
      polygonPainter1.setEdgesLineWidth(2);
      polygonPainter1.paint();

      if(closedPolygon1 && clicks>clicks2){
        var polygonPainter2 = new PolygonPainter(context, polygon2, closedPolygon2);
        polygonPainter2.setEdgesColor('ForestGreen');
        polygonPainter2.setEdgesLineWidth(2);
        polygonPainter2.paint();
      }

      if(closedPolygon1 && closedPolygon2){

        var listPolygons = polygon1.getIntersectionPolygons(polygon2);
        var totalArea    = 0;

        var polygonPainter = null;
        for(var i=0; i<listPolygons.length; i++){

          totalArea = totalArea +listPolygons[i].getArea();

          polygonPainter = new PolygonPainter(context, listPolygons[i], true);
          polygonPainter.setEdgesColor ('red');
          polygonPainter.setEdgesLineWidth(3);
          polygonPainter.paint();

        }

        intersectionDone = true;
        writeMessage("Poligonos de interseccion: " + listPolygons.length, 14 ,  10, 440);
        writeMessage("Area interseccion: "         + totalArea.toFixed(2) + " m2"  , 14 , 210, 440);
        writeMessage("Click para reiniciar"                             , 18 , 620,  25);        

      }

    }

    function handleMouseMoveEvent(evt){
     

      var vertex = null;

      if((clicks>0) && (!closedPolygon1)){

        mousePos = getMousePos(evt);
      
        CleanContext();
        PaintLine   (context, polygon1.getLastVertex(), mousePos);
        PaintCircle (context, polygon1.getFirstVertex(), radiusStartCircle);
        var polygon1Painter = new PolygonPainter(context, polygon1, closedPolygon1);
        polygon1Painter.setEdgesLineWidth(2);
        polygon1Painter.paint();
      }

      if((clicks>clicks2) && (closedPolygon1) && (!closedPolygon2) ){

        mousePos = getMousePos(evt);
        CleanContext();

        var polygon1Painter = new PolygonPainter(context, polygon1, closedPolygon1);
        polygon1Painter.setEdgesLineWidth(2);
        polygon1Painter.paint();

        PaintLine   (context, polygon2.getLastVertex(), mousePos);
        PaintCircle (context, polygon2.getFirstVertex(), radiusStartCircle);
        var polygon2Painter = new PolygonPainter(context, polygon2, closedPolygon2);
        polygon2Painter.setEdgesColor('ForestGreen');
        polygon2Painter.setEdgesLineWidth(2);
        polygon2Painter.paint();
      }

    }

    function CleanContext(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function writeMessage(message, fontSize, i, j) {
       
       context.fillStyle = 'red';
       context.font = fontSize + 'px Arial';
       context.fillText(message, i, j);
    }

    function getMousePos(evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
       };
    }
