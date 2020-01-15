$(document).ready(function() {
    $("#wrap")[0] && $(window).on("load", function() {
        window.setTimeout(function() {
            if (window.map && window.naver && window.naver.maps && map instanceof naver.maps.Map) {
                var mapModel = map.getMapModel(),
                    mapView = map.getMapView(),
                    mapHeight = parseInt(mapView.get("mapDiv").style.height, 10) || 400;

                $(window).on("resize", function() {
                    var wrapper = $("#wrap");
                    console.log("dlapw");
                    wrapper.length && map.setSize(new naver.maps.Size(wrapper.width(), mapHeight));
                });
            }
        }, 0);
    });
});
