  

    function handleMouseDownEvent(evt) {
    
      if(triangulatingDone){
        // Si la triangulación ya se ha realizado al menos una vez se vuelve a empezar.
        clicks = 0;
        polygon = new Polygon();
        closedPolygon      = false;
        triangulatingDone  = false;
      }

      clicks++;
      var mousePos = getMousePos(evt);
      var mousePosition = new Point(mousePos.x, mousePos.y);
      var polygonPainter = null;

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

      CleanContext();
      if(!closedPolygon){
        PaintCircle (context, polygon.getFirstVertex(), radiusStartCircle, false);

        if(!vertexAdded){
          writeMessage("No cruces las aristas, elige otro punto.", 21, 10, 25);
        }
      }

      var trianglesList = null;

      if(closedPolygon){

        trianglesList = polygon.getTriangles();

        for(var i=0; i<trianglesList.length; i++){

          polygonPainter = new PolygonPainter(context, trianglesList[i], closedPolygon);
          polygonPainter.setEdgesColor('red');
          polygonPainter.setEdgesLineWidth(2);
          polygonPainter.paint();
        }

      }

      polygonPainter = new PolygonPainter(context, polygon, closedPolygon);
      polygonPainter.setEdgesLineWidth(2);
      if(closedPolygon){
        polygonPainter.setEdgesLineWidth(3);
      }
      polygonPainter.paint();

      if(closedPolygon){
        triangulatingDone = true;
        writeMessage("Vertices: "   + polygon.getSize()        , 14 ,  10, 440);
        writeMessage("Triangulos: " + trianglesList.length     , 14 , 100, 440);
        writeMessage("Area: "       + polygon.getArea() + " m2", 14 , 210, 440);
        writeMessage("Click para reiniciar"                    , 18 , 620,  25);
      }
    
    }

    function handleMouseMoveEvent(evt){
     
      if(triangulatingDone){
        return;
      }

      if((clicks>0) && (!closedPolygon)){

        mousePos = getMousePos(evt);
      
        CleanContext();
        PaintLine   (context, polygon.getLastVertex(), mousePos);
        PaintCircle (context, polygon.getFirstVertex(), radiusStartCircle);
        var polygonPainter = new PolygonPainter(context, polygon, closedPolygon);
        polygonPainter.setEdgesLineWidth(2);
        polygonPainter.paint();

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
