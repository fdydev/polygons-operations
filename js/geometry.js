 
 function Sign (number){

 	return  number>0 ? 1:(number<0 ? -1:0);
 }

/*
	Esta función crea un objeto punto con dos coordenadas: x e y.
*/
function Point (x, y){

	this.x = x;
	this.y = y;

	var epsilon = 0.000001;

	this.isAlmostEquals = function(point){

		 return (this.getDistance(point)<=epsilon)? true:false;
	}

	this.equals = function (point){

		return ((this.x==point.x)&&(this.y==point.y))?true:false;
	}

	this.getDistance = function(point){
		return Math.sqrt(
							(this.x-point.x)*(this.x-point.x) + 
							(this.y-point.y)*(this.y-point.y)
						);
	}

}

function Segment(point1, point2){

	this.point1 = point1;
	this.point2 = point2;

	function isValueInInterval(a, b, value){

		if       ( (a<=value) && (value<=b) ){
			return true;
		}else if ( (b<=value) && (value<=a) ){
			return true;
		}

		return false;
	}

	this.isInProjectionX = function(point){

		return isValueInInterval(this.point1.x, this.point2.x, point.x);
	}

	this.isInProjectionY = function(point){

		return isValueInInterval(this.point1.y, this.point2.y, point.y);
	}

	this.getLineSlope = function(){

		var slope = (this.point2.y - this.point1.y)/(this.point2.x - this.point1.x);
		return slope;
	}

	this.getLineConstant = function(){

		var	constant = this.point2.y - this.getLineSlope()*this.point2.x;		
		return constant;
	}

	this.getIntersection = function(segment){

		var intersectionPoints = null;
		var relativePosition = this.getRelativePosition(segment);
	
		if ( (relativePosition[0]> 0) || (relativePosition[1]> 0) ){
			// No se cruzan.
			intersectionPoints = null;

		}else{

			var v1 = new Vector(   this.point1,    this.point2);
			var v2 = new Vector(segment.point1, segment.point2);

			var productVectorial = v1.getProductVectorial(v2);

			if(productVectorial == 0){
				// Segmentos paralelos.
				intersectionPoints = this.getCrossPointsParallelSegment(segment);

			}else{
				// Segmentos no paralelos.
				intersectionPoints = [this.getCrossPointNotParalledSegment(segment), null];
			}
		}

		return intersectionPoints;
	}

	this.getCrossPointsParallelSegment = function(segment){

		var crossPoints = null;
		var mA =    this.getLineSlope();
		var mB = segment.getLineSlope();

		var crossPoint1 = null;
		var crossPoint2 = null;

		var infinitySlopeA = (mA==Number.POSITIVE_INFINITY || mA==Number.NEGATIVE_INFINITY);
		var infinitySlopeB = (mB==Number.POSITIVE_INFINITY || mB==Number.NEGATIVE_INFINITY);

		if( infinitySlopeA && infinitySlopeB){
			// Ambas rectas tienen pendiente infinita.
			if(this.point1.x != segment.point1.x){
				// Son rectas no coincidentes.
				crossPoints = null;
			}else{
				crossPoints = new Array();

				if       (this.isInProjectionY(segment.point1)){
					crossPoints.push(segment.point1);

				}else if (this.isInProjectionY(segment.point2)){
					crossPoints.push(segment.point2);
					
				}else if (segment.isInProjectionY(this.point1)){
					crossPoints.push(this.point1);

				}else if (segment.isInProjectionY(this.point2)){
					crossPoints.push(this.point2);
				}
			}

		}else if(mA==mB){
			// Ambas rectas tienen la misma pendiente.
			nA =    this.getLineConstant();			
			nB = segment.getLineConstant();

			if(nA!=nB){
				// Son rectas no coincidentes.
				crossPoints = null;
			}else{

				crossPoints = new Array();

				if       (this.isInProjectionX(segment.point1)){
					crossPoints.push(segment.point1);

				}else if (this.isInProjectionX(segment.point2)){
					crossPoints.push(segment.point2);
					
				}else if (segment.isInProjectionX(this.point1)){
					crossPoints.push(this.point1);

				}else if (segment.isInProjectionX(this.point2)){
					crossPoints.push(this.point2);
				}
			}	

			
		}

		return crossPoints;

	}

	this.getCrossPointNotParalledSegment = function(segment){

		var crossPoint = null;

		var mA =    this.getLineSlope();
		var mB = segment.getLineSlope();

		var nA = null;
		var nB = null;

		var xi = null;
		var yi = null;

		var infinitySlopeA = (mA==Number.POSITIVE_INFINITY || mA==Number.NEGATIVE_INFINITY);
		var infinitySlopeB = (mB==Number.POSITIVE_INFINITY || mB==Number.NEGATIVE_INFINITY);

		if       ( (!infinitySlopeA) && (infinitySlopeB) ){
			// Sólo la recta B tiene pendiente infinita. Se cruzan.
			xi = segment.point1.x;
			nA = this.getLineConstant();
			yi = mA*xi + nA;

		}else if ( (infinitySlopeA) && (!infinitySlopeB) ){
			// Sólo la recta A tiene pendiente infinita. Se cruzan.
			xi = this.point1.x;
			nB = segment.getLineConstant();
			yi = mB*xi + nB;

		}else if (  mA!=mB ){
			// Las dos rectas tienen distinta pendiente. Se cruzan.
			nA =    this.getLineConstant();			
			nB = segment.getLineConstant();

			xi = (nA-nB)/(mB-mA);
			yi = mB*xi + nB;
		}

		if ( (xi!=null) && (yi!=null) ){
			crossPoint = new Point(xi, yi);
		}	

		return crossPoint;
	}


	this.isAlignedWith = function(segment){

		var relativePosition = this.getRelativePosition(segment);

		return ( (relativePosition[0]==0) && (relativePosition[1]==0) )? true:false;	
	}

	this.equals = function(segment){

		var isEqual12 = (
							this.point1.equals(segment.point1) && 
				  			this.point2.equals(segment.point2)
				  		)? true:false;

		var isEqual21 = (
							this.point2.equals(segment.point1) && 
				  			this.point1.equals(segment.point2)
				  		)? true:false;

		return (isEqual12 || isEqual21);
	}

	this.shareEndPoints = function(segment){

		var sharePoint11 = false;
		var sharePoint12 = false;
		var sharePoint21 = false;
		var sharePoint22 = false;

		sharePoint11 = this.point1.equals(segment.point1)?true:false;
		sharePoint12 = this.point1.equals(segment.point2)?true:false;
		sharePoint21 = this.point2.equals(segment.point1)?true:false;
		sharePoint22 = this.point2.equals(segment.point2)?true:false;

		return (sharePoint11 || sharePoint12 || sharePoint21 || sharePoint22);
	}

	this.getRelativePosition = function(segment){
		
		var vectorA1A2 = new Vector(this.point1, this.point2); 
		var vectorA1B1 = new Vector(this.point1, segment.point1);
		var vectorA1B2 = new Vector(this.point1, segment.point2);

		// El segmento B tiene los extremos en los semiplanos definidos por A.
		var relativePositionBToA = 
							Sign(vectorA1A2.getProductVectorial(vectorA1B1)) * 
						   	Sign(vectorA1A2.getProductVectorial(vectorA1B2));

		var vectorB1B2 = new Vector(segment.point1, segment.point2); 
		var vectorB1A1 = new Vector(segment.point1, this.point1);
		var vectorB1A2 = new Vector(segment.point1, this.point2);

		// El segmento A tiene los extremos en los semiplanos definidos por B.
		var relativePositionAToB = 
							Sign(vectorB1B2.getProductVectorial(vectorB1A1)) * 
						   	Sign(vectorB1B2.getProductVectorial(vectorB1A2));

		return	[relativePositionBToA, relativePositionAToB];				   

	}

	this.isCrossedOrTouchedBy = function(segment){

		var relativePosition = this.getRelativePosition(segment);

		// Si los segmentos comparten uno de los puntos no se considera cruce.
		return ( (relativePosition[0]>0) || (relativePosition[1]>0) )? false:true;				   
	}

	this.getMeanPoint = function(){

		var meanPoint = new Point(
									((this.point1.x + this.point2.x)/2), 
									((this.point1.y + this.point2.y)/2)
								);
		return meanPoint;
	}
}

/*
	Esta clase crea un vector a partir de dos puntos y permiter realizar 
	las operaciones comunes con vectores.
*/
function Vector(pointA, pointB){

	this.x = pointB.x - pointA.x;
	this.y = pointB.y - pointA.y;

	this.getModule = function(){

		return Math.sqrt(this.x*this.x + this.y*this.y);
	} 

	this.getProductScalar = function(vector){

		return (this.x*vector.x + this.y*vector.y);
	}

	this.getProductVectorialModule = function(vector){

		return Math.abs( this.getProductVectorial(vector) );
	}

	this.getAngle = function(vector){

		return Math.acos(
						   this.getProductScalar(vector)/(this.getModule()*vector.getModule()) 
			             );
	}

	this.getSignAngle = function(vector){
		return Sign(this.getProductVectorial(vector))*this.getAngle(vector);
	}

	// El producto vectorial da como resultado otro vector perpendicular
	// a los vectores multiplicados.
	// En este caso sólo nos interesa el valor de la tercera coordenada.
	this.getProductVectorial = function(vector){

		return (this.x*vector.y - this.y*vector.x);		
	}

}


/*
	Esta función crea un objeto triángulo a partir de tres puntos.
*/
 function Triangle (pointA, pointB, pointC){

 	this.pA = pointA;
 	this.pB = pointB;
 	this.pC = pointC;

 	this.getArea = function(){

 		var vectorAB = new Vector(this.pA, this.pB);
 		var vectorAC = new Vector(this.pA, this.pC);

 		return 0.5*vectorAB.getProductVectorialModule(vectorAC);
 	};
 }

/*
	Esta clase sirve para crear polígonos y dispone de los métodos 
	más comunes para trabajar con estos objetos.
*/
function Polygon(){

	
	var vertexList = new Array();

	// Obtener el valor del perímetro del polígono.
	this.getPerimeter = function(){

		var perimeter = 0;

		for(var i=0; i< vertexList.length-1; i++){

			perimeter = perimeter + 
						this.getVertex(i).getDistance(this.getVertex(i+1));

		}

		perimeter = perimeter + 
		 			this.getLastVertex().getDistance(this.getFirstVertex());

		return perimeter;

	}

	// Obtener el punto medio del polígono.
	this.getMidpoint = function(){

		var midpointX = 0;
		var midpointY = 0;

		for(var i=0; i<vertexList.length; i++){

			midpointX = midpointX + vertexList[i].x;
			midpointY = midpointY + vertexList[i].y;
		}

		midpointX = midpointX / vertexList.length;
		midpointY = midpointY / vertexList.length;

		return ( new Point(midpointX, midpointY) );
	}

	// Obtener el área del polígono usando el producto en cruz.
	// No es necesario triangular por lo tanto es muy sencillo y rápido.
	this.getArea2 = function(){
		var area = 0;

		if(vertexList.length >= 3){

			// Producto en cruz desde el primero hasta el último.
      		for(var i=0;i<vertexList.length-1;i++) {
        		area = area + vertexList[i].x * vertexList[i+1].y 
        		            - vertexList[i].y * vertexList[i+1].x;
			}
		}

		//Ahora el último con el primero.
      	var i = vertexList.length-1;
      	area = area + vertexList[i].x * vertexList[0].y 
      	            - vertexList[i].y * vertexList[0].x;	

      	area =  Math.abs(area)/2;

      	return area;           

	}

	// Se obtiene el radio del círculo cuya área es igual a la área del polígono.
	this.getEquivalentCircleByArea = function(){

		return Math.sqrt(this.getArea2()/Math.PI);
	}

	// Se obtiene el radio del círculo cuyo perímetro es igual al perímetro del polígono.
	this.getEquivalentCircleByPerimeter = function(){

		return ( this.getPerimeter()/(2*Math.PI) );
	}

	this.isAreaMaximized = function(){

		var areaMaximized = false;
		var ratioEquivalentCircles = 0.95;
		if ( (this.getEquivalentCircleByArea()/this.getEquivalentCircleByPerimeter()) > ratioEquivalentCircles){

			areaMaximized = true;
		}

		return areaMaximized;
	}

	// Obtener el área del polígono como resultado de la suma de las
	// áreas de los triángulos que lo componen.
	// Es necesario triangular el polígono.
	this.getArea = function(){

		var area = 0;

		if(this.getSize()==3){

	 		var vectorAB = new Vector(vertexList[0], vertexList[1]);
 			var vectorAC = new Vector(vertexList[0], vertexList[2]);

 			area = 0.5*vectorAB.getProductVectorialModule(vectorAC);

		}else{

			var triangles = this.getTriangles();

			for(var i=0; i<triangles.length; i++){
				area = area + triangles[i].getArea();
			}
		}

		return area;
	}

	this.getVertexList = function(){
		return	vertexList;
	}

	this.setVertexList = function(vList){
		vertexList = vList;
	}

	this.deleteVertex = function(i){
		if(i<vertexList.length){
			vertexList.splice(i, 1);
		}
	}

	this.addVertex = function(point){

		var vertexAdded = false;
		var segment = null;

		if  ( !this.existsVertex(point) ){ 

			vertexAdded = true;

			for(var idEdge=0; idEdge<this.getSize()-2; idEdge++){

				segment = new Segment(this.getLastVertex(), point);

				if(this.isEdgeCrossedOrTouchedBy(idEdge, segment)){
					vertexAdded = false;
					break;
				}
			}
		}
			
		if(vertexAdded){
			vertexList.push(point);
		}

		return vertexAdded;	
	}

	this.canClose = function(){

		var close = false;

		if( this.getSize()>2 ){

			close = true;
			var segment = new Segment(this.getLastVertex(), this.getFirstVertex());

			for(var idEdge=1; idEdge<this.getSize()-2; idEdge++){				

				if(this.isEdgeCrossedOrTouchedBy(idEdge, segment)){
					close =  false;
					break;
				}
			}

		}

		return close;
	}

	this.getSize = function(){
		return vertexList.length;
	}

	this.getVertex = function (i){
		return vertexList[i];
	}

	this.getFirstVertex = function(){
		return vertexList[0];
	}

	this.getLastVertex = function(){
		return vertexList[vertexList.length-1];
	}

	this.existsVertex = function(point){

		for(var i=0; i<this.getSize(); i++){

			if(this.getVertex(i).equals(point)){
				return true;
			}
		}
		return false;
	}

	this.isEdgeCrossedOrTouchedBy = function(idEdge, segment){

		var edge = null;

		if( (idEdge>=0) && (idEdge<this.getSize()-1) ){
			edge = new Segment(this.getVertex(idEdge), this.getVertex(idEdge+1));
		}

		if (idEdge==(this.getSize()-1) ){
			edge = new Segment(this.getLastVertex(), this.getFirstVertex());
		}

		if ( (edge != null) && (edge.isCrossedOrTouchedBy(segment)) ){
				return true;
		}

		return false;
	}

	this.isInside = function(point){

		var sumAngles = 0;
		var vector1   = null;
		var vector2   = null;

		var angleError = 4; // Se establece un margen de error pocos grados.

		// Se calcula la suma de todos los ángulos que forman los vectores que
		// tienen como origen el punto en cuestión y como destino los vértices 
		// del polígono.
		for(var i=0; i<this.getSize()-1; i++){

			vector1 = new Vector(point, this.getVertex(i  ));
			vector2 = new Vector(point, this.getVertex(i+1));

			sumAngles = sumAngles + vector1.getSignAngle(vector2);
		}

		vector1 = new Vector(point, this.getLastVertex());
		vector2 = new Vector(point, this.getFirstVertex());

		sumAngles = sumAngles + vector1.getSignAngle(vector2);

		sumAngles = sumAngles*180/Math.PI;

		if( ( -angleError < sumAngles ) && ( sumAngles < angleError )) {

			// Si la suma de todos los ángules es aproximadamente 0 grados
			// entonces el punto está fuera del políngo.
			return false; 

		}else{

			// Si el punto está dentro del polígono la suma de todos los 
			// ángulos será aproximadamente 360 grados.
			return true;
		};
	}

	this.getTriangles = function(){

		var trianglesList = new Array();

		// Se hace una copia del polígono original.
		var polygonAux = new Polygon();
		polygonAux.setVertexList(vertexList.slice(0,vertexList.length));

		console.log("Vertices originales: "+this.getSize());
		console.log("Vertices copiados: "  +polygonAux.getSize());

		var triangulationFinished = false;
		var triangle = null;

		var i = 0;
		var j = 1;
		var k = 2;
		var counters = null;

		while(!triangulationFinished){

			var pointA = new Point(polygonAux.getVertex(i).x, polygonAux.getVertex(i).y);	
			var pointB = new Point(polygonAux.getVertex(j).x, polygonAux.getVertex(j).y);
			var pointC = new Point(polygonAux.getVertex(k).x, polygonAux.getVertex(k).y);

			if(polygonAux.getSize()==3){	

				triangle = new Polygon();
				triangle.addVertex(pointA);
				triangle.addVertex(pointB);
				triangle.addVertex(pointC);

				trianglesList.push(triangle);
				triangulationFinished = true;

			}else{

				var segmentAC   = new Segment(pointA, pointC);
				var meanPointAC = segmentAC.getMeanPoint();

				if(polygonAux.isInside(meanPointAC)){

					var crossedEdges = false;
					var segmentEdge = null;
					for(var n=0; n<polygonAux.getSize()-1; n++){

						segmentEdge = new Segment(polygonAux.getVertex(n),polygonAux.getVertex(n+1));

						if(  segmentAC.isCrossedOrTouchedBy(segmentEdge) && 
							!segmentAC.shareEndPoints(segmentEdge)
						  ){
							crossedEdges = true;
							break;
						}
					}

					segmentEdge = new Segment(polygonAux.getLastVertex(),polygonAux.getFirstVertex());

					if(	
						 segmentAC.isCrossedOrTouchedBy(segmentEdge) &&
						!segmentAC.shareEndPoints(segmentEdge)
					  ){
						crossedEdges = true;
					}

					if(!crossedEdges)
					{
						triangle = new Polygon();
						triangle.addVertex(pointA);
						triangle.addVertex(pointB);
						triangle.addVertex(pointC);

						trianglesList.push(triangle);
						polygonAux.deleteVertex(j);
					}
				}

				counters = incrementVertexCounters(i, j, k, polygonAux.getSize());
				i = counters[0];
				j = counters[1];
				k = counters[2];
			}
		}

		return trianglesList;		
	}

	function incrementVertexCounters(i, j, k, size){

		if(i>=(size-1)){
			i = 0;
			j = 1;
			k = 2;
		}else{
			i++;
			if(j>=(size-1)){
				j = 0;
				k = 1;
			}else{
				j++;
				if(k>=(size-1)){
					k = 0;
				}else{
					k++;
				}	
			}
		}

		return [i, j, k];
	}


	this.getIntersectionSegment = function(segment){

		var intersectionSement = null;
		var pointsList   = new PointsList();
		var edgePolygonA = null;

		for(var i=0; i<this.getSize()-1; i++){

			edgePolygonA = new Segment(this.getVertex(i), this.getVertex(i+1));

			intersection = segment.getIntersection(edgePolygonA);

			if(intersection != null){
				if(intersection[0] != null){
					pointsList.push(intersection[0]);
				}
				if(intersection[1] != null){
					pointsList.push(intersection[1]);
				}
			}

		}

		edgePolygonA = new Segment(this.getLastVertex(), this.getFirstVertex());
		intersection = segment.getIntersection(edgePolygonA);

		if(intersection != null){
			if(intersection[0] != null){
				pointsList.push(intersection[0]);
			}
			if(intersection[1] != null){
				pointsList.push(intersection[1]);
			}
		}		

		if(this.isInside(segment.point1)){
			pointsList.push(segment.point1);
		}

		if(this.isInside(segment.point2)){
			pointsList.push(segment.point2);
		}

		var segmentSlope = segment.getLineSlope();
		
		if( (segmentSlope!=Number.POSITIVE_INFINITY) && (segmentSlope!=Number.NEGATIVE_INFINITY) ){
			pointsList.sortByX();
		}else{
			pointsList.sortByY();
		}

		return pointsList.getSegments();
	}


	this.getIntersectionPolygons = function(polygon){

		var edge = null;
		var segmentsListAux = null;
		var segmentsList = new Array();

		// Intersecciones de las aristas del polígono 1 con el polígono 2.
		for(var i=0; i<this.getSize()-1; i++){

			edge = new Segment(this.getVertex(i), this.getVertex(i+1));
			segmentsListAux = polygon.getIntersectionSegment(edge);
			segmentsList    = segmentsList.concat(segmentsListAux);
		}

		edge = new Segment(this.getFirstVertex(), this.getLastVertex());
		segmentsListAux = polygon.getIntersectionSegment(edge);
		segmentsList    = segmentsList.concat(segmentsListAux);

		// Intersecciones de las aristas del polígono 2 con el polígono 1.
		for(var i=0; i<polygon.getSize()-1; i++){

			edge = new Segment(polygon.getVertex(i), polygon.getVertex(i+1));
			segmentsListAux = this.getIntersectionSegment(edge);
			segmentsList    = segmentsList.concat(segmentsListAux);
		}

		edge = new Segment(polygon.getFirstVertex(), polygon.getLastVertex());
		segmentsListAux = this.getIntersectionSegment(edge);
		segmentsList    = segmentsList.concat(segmentsListAux);

		console.log("Numero de segmentos intersection: "+ segmentsList.length);

		var polygonsList = this.convertSegmentsToPolygons(segmentsList);

		console.log("Numero de poligonos intersection: "+ polygonsList.length);

		return polygonsList;
	}

	this.convertSegmentsToPolygons = function(segmentsList){

		var polygonsList = new Array();
		var polygon = null;

		for(var i=0; i<segmentsList.length; i++){
			polygon = new Polygon();
			polygon.addVertex(segmentsList[i].point1);
			polygon.addVertex(segmentsList[i].point2);
			polygonsList.push(polygon);
		}

		console.log("Se han creado poligonos originales: " + polygonsList.length);

		var anyChange = true;

		var p1Last  = null;
		var p2First = null;
		var p2Last  = null;

		while(anyChange){
			anyChange = false;
			for (var i=0; i<polygonsList.length; i++){
				for(var j=0; j<polygonsList.length; j++){

					if( (i!=j) && (polygonsList[i]!=null) && (polygonsList[j]!=null) ){

						p1Last  = polygonsList[i].getLastVertex();
						p2First = polygonsList[j].getFirstVertex();
						p2Last  = polygonsList[j].getLastVertex();

						if      (p1Last.isAlmostEquals(p2First)){
							anyChange = true;

							for(var k=1; k<polygonsList[j].getSize()-1; k++){
								polygonsList[i].addVertex(polygonsList[j].getVertex(k));
							}

							if(!polygonsList[i].getFirstVertex().isAlmostEquals(polygonsList[j].getLastVertex())){
								polygonsList[i].addVertex(polygonsList[j].getLastVertex());
							}

							polygonsList[j] = null;

						}else if (p1Last.isAlmostEquals(p2Last)){
							anyChange = true;

							for(var k=polygonsList[j].getSize()-2; k>0; k--){
								polygonsList[i].addVertex(polygonsList[j].getVertex(k));
							}

							if(!polygonsList[i].getFirstVertex().isAlmostEquals(polygonsList[j].getFirstVertex())){
								polygonsList[i].addVertex(polygonsList[j].getFirstVertex());
							}

							polygonsList[j] = null;
						}
					}
				}
			}
		}

		// Se eliminan los nulos.
		var result = new Array();
		for (var i=0; i<polygonsList.length; i++){
			if(polygonsList[i]!=null){
				result.push(polygonsList[i]);
			}
		}

		return result;
	}

}

function PointsList(){

	var list = new Array();

	this.getSegments = function(){

		var segments = new Array();

		for (var i=0; i<list.length-1; i=i+2){
			segments.push(new Segment(list[i], list[i+1]));
		}

		return segments;
	}	

	this.getSize = function(){
		return list.length;
	}

	this.getList = function(){
		return list;
	}

	this.push = function(point){
		list.push(point);
	}

	this.sortByX = function(){

		var aux = null;

		if (list.length>1){

			for (var i=0; i<list.length-1; i++){

				for(var j=i+1; j<list.length; j++){

					if(list[j].x <= list[i].x){
						aux     = list[i];
						list[i] = list[j];
						list[j] = aux;
					}
				}
			}
		}		

		return list;
	}

	this.sortByY = function(){
		var aux = null;

		if (list.length>1){

			for (var i=0; i<list.length-1; i++){

				for(var j=i+1; j<list.length; j++){

					if(list[j].y <= list[i].y){
						aux     = list[i];
						list[i] = list[j];
						list[j] = aux;
					}
				}
			}
		}		

		return list;		
	}
}
