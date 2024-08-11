

/*
Esta función dibuja un polígono en un contexto.
*/
function PolygonPainter(context, polygon, closed){

	var polygon    = polygon;
	var context    = context;
	var closed     = closed;
	var edgesColor = 'blue';
	var edgesLineWidth = 1;
	var vertexColor = 'black';

	this.setEdgesLineWidth = function(width){
		edgesLineWidth = width;
	}

	this.setVertexColor = function(color){
		vertexColor = color;
	}

	this.setEdgesColor = function(color){
		edgesColor = color
	}

	this.paint = function(){
		paintEdges();
		paintVertex();
	}

	// Se dibujan las aristas.
	paintEdges();

	/*
	Esta función pinta una arista en el contexto que se le ha pasado a la clase.
	*/
	function paintEdges(){

		context.strokeStyle = edgesColor;
		context.lineWidth = edgesLineWidth;
		context.beginPath();

		// Se pintan las aristas desde el primer vértice hasta el último.
		context.moveTo(polygon.getFirstVertex().x, polygon.getFirstVertex().y);
		for(var i=1; i<polygon.getSize(); i++){
			context.lineTo(polygon.getVertex(i).x, polygon.getVertex(i).y);
		}

		// Si hay que cerrarlo se pintan la arista desde el último vértice hasta el primero.
		if(closed){
			context.lineTo(polygon.getFirstVertex().x, polygon.getFirstVertex().y);
		}

		context.stroke();		
	}

	function paintVertex(){

		for (var i=0; i<polygon.getSize(); i++){
			// Se pintan los vértices del polígono.
			paintOneVertex(polygon.getVertex(i));
		}
	}

	/*
	Esta función pinta un vértice en el contexto que se le ha pasado a la clase.
	*/
	function paintOneVertex(vertex){

	  var radius           = 4;
      var startAngle       = 0   * Math.PI / 180;
      var endAngle         = 360 * Math.PI / 180;
      var counterClockwise = false;

      // line color
      context.strokeStyle = vertexColor;
      context.fillStyle   = vertexColor;

      context.beginPath();
      context.arc(vertex.x, vertex.y, radius, startAngle, endAngle, counterClockwise);
      context.lineWidth = 1;

      context.stroke();
      context.fill();
	}

}

/*
Esta función dibuja un círculo en un contexto.
*/
function PaintCircle(context, point, radius, fill, color){

	  var startAngle       = 0   * Math.PI / 180;
      var endAngle         = 360 * Math.PI / 180;
      var counterClockwise = false;

      // line color
      context.strokeStyle = color;

      context.beginPath();
      context.arc(point.x, point.y, radius, startAngle, endAngle, counterClockwise);
      context.lineWidth = 1;

      context.stroke();
      if(fill){
      	context.fillStyle = color;
      	context.fill();
      }
}

function PaintLine(context, pointA, pointB){

	context.strokeStyle = 'black';
	context.lineWidth   = 1;
	context.beginPath();
	context.moveTo(pointA.x, pointA.y);
	context.lineTo(pointB.x, pointB.y);
	context.stroke();

}

function PaintGrid(context, width, height){

	var gridDensity = 15;

	var M = width/gridDensity;
	context.strokeStyle = 'black';
	context.lineWidth = 0.5;

	for(var i = 0; i< M; i=i+gridDensity){
		context.beginPath();
		context.moveTo(i,0    );
		context.lineTo(i,height);	
		context.stroke();
	}


}



