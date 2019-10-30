$(document).ready(function () {
    $('.form__submit').on('click', function (e) {
        e.preventDefault();
        ajax_form(e,"POST","/wp-content/themes/heliview/includes/application.php");
    });

    scrollInit();
    scroll();
    $('.js-header__menu').on('click',function () {
        menu.open();
    });
    $('.map').on('mouseover',function () {
        console.log('1');
        $('body').mCustomScrollbar("disable");
    });
    $('.map').on('mouseout',function () {
        $('body').mCustomScrollbar("update");
    });

    // new WOW().init();

});

function initMap() {
    var uluru = {lat: 50.439034, lng: 30.519491};
    var map = new google.maps.Map(document.getElementById('contact__map'), {
        zoom: 17,
        center: uluru,
        disableDefaultUI: true,
    });
    var styleMap = [
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {"color": "#e9e9e9"},
                { "lightness": 17}
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {"color": "#e4e4e4"},
                {"lightness": 20}
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.stroke",
            "stylers": [
                {"color": "#b9b9b9"},
                {"lightness": 20}
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                { "color": "#ffffff"},
                { "lightness": 17}
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {"color": "#ffffff"},
                {"lightness": 29},
                {"weight": 0.2}
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {"color": "#ffffff"},
                {"lightness": 18}
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {"color": "#ffffff"},
                {"lightness": 16}
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {"color": "#f5f5f5"},
                {"lightness": 21}
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {"color": "#dedede"},
                {"lightness": 21}
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {"visibility": "on"},
                {"color": "#ffffff"},
                {"lightness": 16}
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {"saturation": 36},
                {"color": "#333333"},
                {"lightness": 40}
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {"visibility": "off"}
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {"color": "#f2f2f2"},
                {"lightness": 19}
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {"color": "#fefefe"},
                {"lightness": 20}
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {"color": "#fefefe"},
                {"lightness": 17},
                {"weight": 1.2}
            ]
        }
    ];
    map.setOptions({styles: styleMap});

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(uluru.lat, uluru.lng),
        map: map,
        icon: new google.maps.MarkerImage('./app/img/Marker.png',
            new google.maps.Size(53, 71),
            new google.maps.Point(0, 0))
    });

    var newlong = marker.getPosition().lng() + (-0.00283 * Math.pow(2, (17 - map.getZoom())));
    var newLat = marker.getPosition().lat() + (0.00013 * Math.pow(2, (17 - map.getZoom())));
    google.maps.event.addListener(map, "zoom_changed", function() {
        newlong = marker.getPosition().lng() + (-0.00283 * Math.pow(2, (17 - map.getZoom())));
        newLat = marker.getPosition().lat() + (0.00013 * Math.pow(2, (17 - map.getZoom())));
    });
}

function ajax_form(e,methods,url) {
    event.preventDefault();
    var form = $(e.target).closest("form");
    var str = form.serialize();

    var errors = false; // по умолчанию ошибок в форме нет

    $(form).find('.js__form__input ').each(function() {
        errors = validateForm(this);
    });
    $(".js__form__input").on("mouseup",delMessageErrorForm);

    if ( !errors) {
        $.ajax({
            method: methods,
            url: url,
            data: str,
            beforeSend: function() {
                $(form).find('button > span').text('Отправка...') // замена текста в кнопке при отправке
            },
            error: function(){
                $(form).find('button > span').text('Ошибка отправки!');// замена текста в кнопке при отправке в случае
            }
        })
            .done(function (msg) {
                console.log(msg);
                // success();
                successSendMesage();

                $("[data-input-clear]").val('');
                // ga('send', {
                //   hitType: 'event',
                //   eventCategory: 'sendForm',
                //   eventAction: 'send',
                //   eventLabel: 'newRequest'
                // });
            });
    }
}

function validateForm(self) {
    console.log('validateForm',self);
    var regular = new RegExp('^[a-zA-Zа-яА-Я\'][a-zA-Zа-яА-Я-\' ]+[a-zA-Zа-яА-Я\']?$');
    if (( $(self).attr('type') === 'tel' && $(self).val().length !== 19) ||
        ( $(self).attr('type') !== 'tel' && $.trim ( $(self).val() ).length < 2) ||
        ( $(self).attr('type') !== 'tel' && !regular.test($(self).val()) )  ){
        var errorMessage = $(self).next().data("errormessage"); // добавляем в input сообщение об ошибке из dataAttr и class
        $(self).next().text(errorMessage);
        $(self).addClass('js-no-valid');
        return true
    }
    return false
}
function delMessageErrorForm() {
    var defaultMessage = $(this).next().data("defaultmessage"); // при клике на input убираем сообщение и class
    $(this).next().text('');
    $(this).removeClass('js-no-valid');
}
function successSendMesage(){
    $('.send__success').addClass('.active');
    setTimeout(function () {
        $('.popup').removeClass('popupActive');
        $('.send__success').removeClass('.active');
    },2000);
}

function replaceText(block){
    var text = $(block).html();
    $(block).html('');
    text.split('').forEach(function (letter,i) {
        var span = document.createElement('span');
        if(i===0){
            span.className = 'title__animate text-stroke';
        } else {
            span.className = 'title__animate';
        }

        span.innerHTML = letter;
        $(block).append(span);
    });
}

var arr = [];
var arrParallax = [];
function scroll() {
    if(arr.length > 0){
        var height =  $(document).height();
        arr = arr.filter(function (el) {
            if($(el.element).offset().top - height <= Number(el.offset)) {
                $(el.element).css({
                    // 'visibility': 'visible',
                    'animation-name': el.animate,
                    'animation-duration': el.duration,
                    'animation-delay': el.delay,
                    'animation-fill-mode': 'forwards'
                });
                return false
            } else {return el}
        })
    }

}
function parallax() {
    var height =  $(document).height();
    console.log('dd');
}
function scrollInit() {
    var list = document.querySelectorAll('.my-wow');
    var height = $(window).height();
    list.forEach(function (el) {
        arrParallax.push(el);
       var t = {};
       var duration = $(el).data('duration');
       var offset = $(el).data('offset');
       var delay = $(el).data('delay');
       var animate =  $(el).data('animate');
        t.duration = duration ? duration : '0s';
        t.offset = (offset && height > 768) ? offset*-1 : '100';
        t.delay = delay ? delay : '0s';
        t.animate = animate ? animate : 'fadeIn';
       t.element = el;
       arr.push(t);
    });
    $('body').mCustomScrollbar({
        theme: "dark",
        scrollInertia: 2000,
        mouseWheel:{
            // deltaFactor: 20,
            deltaFactor: 0,
            normalizeDelta: false,
            scrollAmount: 220
        },
        scrollbarPosition: "inside",
//      scrollbarPosition: "outside",
        documentTouchScroll: true,
        contentTouchScroll: 25,
        callbacks:{
            whileScrolling:function(){
                scroll();
                parallax();
            },
        }
    });
}


