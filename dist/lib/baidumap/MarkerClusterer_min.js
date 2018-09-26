var BMapLib=window.BMapLib=BMapLib||{};!function(){var getExtendedBounds=function(map,bounds,gridSize){bounds=cutBoundsInRange(bounds);var pixelNE=map.pointToPixel(bounds.getNorthEast()),pixelSW=map.pointToPixel(bounds.getSouthWest());pixelNE.x+=gridSize,pixelNE.y-=gridSize,pixelSW.x-=gridSize,pixelSW.y+=gridSize;var newNE=map.pixelToPoint(pixelNE),newSW=map.pixelToPoint(pixelSW);return new BMap.Bounds(newSW,newNE)},cutBoundsInRange=function(bounds){var maxX=getRange(bounds.getNorthEast().lng,-180,180),minX=getRange(bounds.getSouthWest().lng,-180,180),maxY=getRange(bounds.getNorthEast().lat,-74,74),minY=getRange(bounds.getSouthWest().lat,-74,74);return new BMap.Bounds(new BMap.Point(minX,minY),new BMap.Point(maxX,maxY))},getRange=function(i,mix,max){return mix&&(i=Math.max(i,mix)),max&&(i=Math.min(i,max)),i},isArray=function(source){return"[object Array]"===Object.prototype.toString.call(source)},indexOf=function(item,source){var index=-1;if(isArray(source))if(source.indexOf)index=source.indexOf(item);else for(var m,i=0;m=source[i];i++)if(m===item){index=i;break}return index},MarkerClusterer=BMapLib.MarkerClusterer=function(map,options){if(map){this._map=map,this._markers=[],this._clusters=[];var opts=options||{};this._gridSize=opts.gridSize||60,this._maxZoom=opts.maxZoom||18,this._minClusterSize=opts.minClusterSize||2,this._isAverageCenter=!1,null!=opts.isAverageCenter&&(this._isAverageCenter=opts.isAverageCenter),this._styles=opts.styles||[];var that=this;this._map.addEventListener("zoomend",function(){that._redraw()}),this._map.addEventListener("moveend",function(){that._redraw()});var mkrs=opts.markers;isArray(mkrs)&&this.addMarkers(mkrs)}};function Cluster(markerClusterer){this._markerClusterer=markerClusterer,this._map=markerClusterer.getMap(),this._minClusterSize=markerClusterer.getMinClusterSize(),this._isAverageCenter=markerClusterer.isAverageCenter(),this._center=null,this._markers=[],this._gridBounds=null,this._isReal=!1,this._clusterMarker=new BMapLib.TextIconOverlay(this._center,this._markers.length,{styles:this._markerClusterer.getStyles()})}MarkerClusterer.prototype.addMarkers=function(markers){for(var i=0,len=markers.length;i<len;i++)this._pushMarkerTo(markers[i]);this._createClusters()},MarkerClusterer.prototype._pushMarkerTo=function(marker){-1===indexOf(marker,this._markers)&&(marker.isInCluster=!1,this._markers.push(marker))},MarkerClusterer.prototype.addMarker=function(marker){this._pushMarkerTo(marker),this._createClusters()},MarkerClusterer.prototype._createClusters=function(){for(var marker,mapBounds=this._map.getBounds(),extendedBounds=getExtendedBounds(this._map,mapBounds,this._gridSize),i=0;marker=this._markers[i];i++)!marker.isInCluster&&extendedBounds.containsPoint(marker.getPosition())&&this._addToClosestCluster(marker);var len=this._markers.length;for(i=0;i<len;i++)this._clusters[i]&&this._clusters[i].render()},MarkerClusterer.prototype._addToClosestCluster=function(marker){for(var cluster,distance=4e6,clusterToAddTo=null,i=(marker.getPosition(),0);cluster=this._clusters[i];i++){var center=cluster.getCenter();if(center){var d=this._map.getDistance(center,marker.getPosition());d<distance&&(distance=d,clusterToAddTo=cluster)}}clusterToAddTo&&clusterToAddTo.isMarkerInClusterBounds(marker)?clusterToAddTo.addMarker(marker):((cluster=new Cluster(this)).addMarker(marker),this._clusters.push(cluster))},MarkerClusterer.prototype._clearLastClusters=function(){for(var cluster,i=0;cluster=this._clusters[i];i++)cluster.remove();this._clusters=[],this._removeMarkersFromCluster()},MarkerClusterer.prototype._removeMarkersFromCluster=function(){for(var marker,i=0;marker=this._markers[i];i++)marker.isInCluster=!1},MarkerClusterer.prototype._removeMarkersFromMap=function(){for(var marker,i=0;marker=this._markers[i];i++)marker.isInCluster=!1,tmplabel=marker.getLabel(),this._map.removeOverlay(marker),marker.setLabel(tmplabel)},MarkerClusterer.prototype._removeMarker=function(marker){var index=indexOf(marker,this._markers);return-1!==index&&(tmplabel=marker.getLabel(),this._map.removeOverlay(marker),marker.setLabel(tmplabel),this._markers.splice(index,1),!0)},MarkerClusterer.prototype.removeMarker=function(marker){var success=this._removeMarker(marker);return success&&(this._clearLastClusters(),this._createClusters()),success},MarkerClusterer.prototype.removeMarkers=function(markers){for(var success=!1,i=0;i<markers.length;i++){var r=this._removeMarker(markers[i]);success=success||r}return success&&(this._clearLastClusters(),this._createClusters()),success},MarkerClusterer.prototype.clearMarkers=function(){this._clearLastClusters(),this._removeMarkersFromMap(),this._markers=[]},MarkerClusterer.prototype._redraw=function(){this._clearLastClusters(),this._createClusters()},MarkerClusterer.prototype.getGridSize=function(){return this._gridSize},MarkerClusterer.prototype.setGridSize=function(size){this._gridSize=size,this._redraw()},MarkerClusterer.prototype.getMaxZoom=function(){return this._maxZoom},MarkerClusterer.prototype.setMaxZoom=function(maxZoom){this._maxZoom=maxZoom,this._redraw()},MarkerClusterer.prototype.getStyles=function(){return this._styles},MarkerClusterer.prototype.setStyles=function(styles){this._styles=styles,this._redraw()},MarkerClusterer.prototype.getMinClusterSize=function(){return this._minClusterSize},MarkerClusterer.prototype.setMinClusterSize=function(size){this._minClusterSize=size,this._redraw()},MarkerClusterer.prototype.isAverageCenter=function(){return this._isAverageCenter},MarkerClusterer.prototype.getMap=function(){return this._map},MarkerClusterer.prototype.getMarkers=function(){return this._markers},MarkerClusterer.prototype.getClustersCount=function(){for(var cluster,count=0,i=0;cluster=this._clusters[i];i++)cluster.isReal()&&count++;return count},Cluster.prototype.addMarker=function(marker){if(this.isMarkerInCluster(marker))return!1;if(this._center){if(this._isAverageCenter){var l=this._markers.length+1,lat=(this._center.lat*(l-1)+marker.getPosition().lat)/l,lng=(this._center.lng*(l-1)+marker.getPosition().lng)/l;this._center=new BMap.Point(lng,lat),this.updateGridBounds()}}else this._center=marker.getPosition(),this.updateGridBounds();marker.isInCluster=!0,this._markers.push(marker)},Cluster.prototype.render=function(){var len=this._markers.length;if(len<this._minClusterSize)for(var i=0;i<len;i++)this._map.addOverlay(this._markers[i]);else this._map.addOverlay(this._clusterMarker),this._isReal=!0,this.updateClusterMarker()},Cluster.prototype.isMarkerInCluster=function(marker){if(this._markers.indexOf)return-1!=this._markers.indexOf(marker);for(var m,i=0;m=this._markers[i];i++)if(m===marker)return!0;return!1},Cluster.prototype.isMarkerInClusterBounds=function(marker){return this._gridBounds.containsPoint(marker.getPosition())},Cluster.prototype.isReal=function(marker){return this._isReal},Cluster.prototype.updateGridBounds=function(){var bounds=new BMap.Bounds(this._center,this._center);this._gridBounds=getExtendedBounds(this._map,bounds,this._markerClusterer.getGridSize())},Cluster.prototype.updateClusterMarker=function(){if(this._map.getZoom()>this._markerClusterer.getMaxZoom()){this._clusterMarker&&this._map.removeOverlay(this._clusterMarker);for(var marker,i=0;marker=this._markers[i];i++)this._map.addOverlay(marker)}else if(this._markers.length<this._minClusterSize)this._clusterMarker.hide();else{this._clusterMarker.setPosition(this._center),this._clusterMarker.setText(this._markers.length);var thatMap=this._map,thatBounds=this.getBounds();this._clusterMarker.addEventListener("click",function(event){Public.toast("ddd"),thatMap.setViewport(thatBounds)})}},Cluster.prototype.remove=function(){for(var i=0;this._markers[i];i++)tmplabel=this._markers[i].getLabel(),this._markers[i].getMap()&&this._map.removeOverlay(this._markers[i]),this._markers[i].setLabel(tmplabel);this._map.removeOverlay(this._clusterMarker),this._markers.length=0,delete this._markers},Cluster.prototype.getBounds=function(){for(var marker,bounds=new BMap.Bounds(this._center,this._center),i=0;marker=this._markers[i];i++)bounds.extend(marker.getPosition());return bounds},Cluster.prototype.getCenter=function(){return this._center}}();