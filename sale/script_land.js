function getUrlQueryString(){
    var query = window.location.search;

    if( query ){
        var index_str = query.indexOf('?');

        if( index_str == -1 ){
            return false;
        }else{
            return window.location.search.slice(index_str + 1);
        }
    }else{
        return false;
    }
}

function getAlUserData(name) {
    try {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    } catch(e) {
        return undefined;
    }
}

function setAlUserData(name, value, options) {
    try {
        options = options || {};

        var expires = options.expires;

        var d = new Date();

        if (typeof expires == "number" && expires) {
            d.setTime(d.getTime() + expires*1000);
            expires = options.expires = d;
        }else{
            d.setTime(d.getTime() + 2592000*1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for(var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        updatedCookie += "; path=/";

        document.cookie = updatedCookie;
    } catch(e) {
        //
    }
}

function getSystemParams(){
    function getApp() {
        try {
            return navigator.appCodeName;
        } catch (err) {
            return null;
        }
    }

    function getAppName() {
        try {
            return navigator.appName;
        } catch (err) {
            return null;
        }
    }

    function getAppVersion() {
        try {
            return navigator.appVersion;
        } catch (err) {
            return null;
        }
    }

    function getAppPlatform() {
        try {
            return navigator.platform;
        } catch (err) {
            return null;
        }
    }

    function getJavaEnabled(){
        try {
            return navigator.javaEnabled();
        } catch (err) {
            return null;
        }
    }

    function getCookieEnabled(){
        try {
            return navigator.cookieEnabled;
        } catch (err) {
            return null;
        }
    }

    function getLanguage() {
        try {
            return (navigator.language || navigator.systemLanguage || navigator.userLanguage || "en").substr(0,2).toLowerCase();
        } catch (err) {
            return null;
        }
    }

    function versionMinor() {
        try {
            var appVersion = navigator.appVersion;

            var pos, versionMinor = 0;

            if ((pos = appVersion.indexOf ("MSIE")) > -1) {
                versionMinor = parseFloat(appVersion.substr (pos+5));
            } else {
                versionMinor = parseFloat(appVersion);
            }

            return (versionMinor);
        } catch (err) {
            return null;
        }
    }

    function versionMajor() {
        try {
            return parseInt(navigator.appVersion,10)
        } catch (err) {
            return null;
        }
    }

    function screenWidth() {
        try {
            if (window.screen) {
                return(screen.width);
            } else {
                return(0);
            }
        } catch (err) {
            return null;
        }
    }

    function screenHeight() {
        try {
            if (window.screen) {
                return(screen.height);
            } else {
                return(0);
            }
        } catch (err) {
            return null;
        }
    }

    function getTzOffset(){
        try {
            var offset = new Date().getTimezoneOffset();
            return (-1)*(offset*60);
        } catch (err) {
            return null;
        }
    }

    return {
        'app': getApp(),
        'app_name': getAppName(),
        'app_version': getAppVersion(),
        'language': getLanguage(),
        'platform': getAppPlatform(),
        'java_enabled': getJavaEnabled(),
        'cookie_enabled': getCookieEnabled(),
        'browser_ver_minor': versionMajor(),
        'browser_ver_major': versionMinor(),
        's_width': screenWidth(),
        's_height': screenHeight(),
        'tz_offset': getTzOffset()
    }
}

function alInitUserData(){
    var qs = getUrlQueryString();

    if( qs ){
        var hashes = qs.split('&');

        if( hashes.length > 0 ){
            for(var i = 0; i < hashes.length; i++){
                var hash = hashes[i].split('=');
                setAlUserData(hash[0], hash[1]);
            }
        }
    }

    setAlUserData('_allocation', window.location.href);

    setAlUserData('_alreferer', document.referrer);

    var _alquery = getAlUserData('_alquery');

    if( typeof _alquery == "undefined" && qs ){
        setAlUserData('_alquery', qs);
    }

    var _alstart = getAlUserData('_alstart');

    if( typeof _alstart == "undefined" ){
        setAlUserData('_alstart', parseInt(Date.now()/1000));
    }

    setAlUserData('_alsystems', JSON.stringify(getSystemParams()));
}

function encodeQueryData(data) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
}

function alStatPixel() {
    //stat pixel
    var pixel_data = getSystemParams();

    var _allocation = getAlUserData('_allocation');
    if( typeof _allocation != "undefined" ){
        pixel_data['_allocation'] = _allocation;
    }

    var alstream = getAlUserData('alstream');
    if( typeof alstream != "undefined" ){
        pixel_data['alstream'] = alstream;
    }

    var _u_alid = getAlUserData('_alid');
    if( _u_alid ){
        pixel_data['_alid'] = _u_alid;
    }else{
        if( typeof _alid != "undefined" ){
            setAlUserData('_alid', _alid);
            pixel_data['_alid'] = _alid;
        }
    }

    var alunique = getAlUserData('alunique');
    if( typeof alunique == "undefined" ){
        setAlUserData('alunique', 1, {'expires' : 86400});
        pixel_data['alunique'] = 1;
    }else{
        pixel_data['alunique'] = 0;
    }

    var _alstart = getAlUserData('_alstart');
    if( typeof _alstart != "undefined" ){
        pixel_data['_alstart'] = _alstart;
    }

    var alclick = getAlUserData('alclick');
    if( typeof alclick != "undefined" ){
        pixel_data['alclick'] = alclick;
    }

    var _alreferer = getAlUserData('_alreferer');
    if( typeof _alreferer != "undefined" ){
        pixel_data['_alreferer'] = _alreferer;
    }

    var sub_id = getAlUserData('sub_id');
    if( typeof sub_id != "undefined" ){
        pixel_data['sub_id'] = sub_id;
    }

    var sub_id_1 = getAlUserData('sub_id_1');
    if( typeof sub_id_1 != "undefined" ){
        pixel_data['sub_id_1'] = sub_id_1;
    }

    var sub_id_2 = getAlUserData('sub_id_2');
    if( typeof sub_id_2 != "undefined" ){
        pixel_data['sub_id_2'] = sub_id_2;
    }

    var sub_id_3 = getAlUserData('sub_id_3');
    if( typeof sub_id_3 != "undefined" ){
        pixel_data['sub_id_3'] = sub_id_3;
    }

    var sub_id_4 = getAlUserData('sub_id_4');
    if( typeof sub_id_4 != "undefined" ){
        pixel_data['sub_id_4'] = sub_id_4;
    }

    var utm_source = getAlUserData('utm_source');
    if( typeof utm_source != "undefined" ){
        pixel_data['utm_source'] = utm_source;
    }

    var utm_medium = getAlUserData('utm_medium');
    if( typeof utm_medium != "undefined" ){
        pixel_data['utm_medium'] = utm_medium;
    }

    var utm_campaign = getAlUserData('utm_campaign');
    if( typeof utm_campaign != "undefined" ){
        pixel_data['utm_campaign'] = utm_campaign;
    }

    var utm_term = getAlUserData('utm_term');
    if( typeof utm_term != "undefined" ){
        pixel_data['utm_term'] = utm_term;
    }

    var utm_content = getAlUserData('utm_content');
    if( typeof utm_content != "undefined" ){
        pixel_data['utm_content'] = utm_content;
    }

    pixel_data['rand'] = parseInt(Math.random() * 100000);

    //(window.Image ? (new Image()) : document.createElement('img')).src = 'http://terra-stat.com/land/collect/?'+encodeQueryData(pixel_data);
    (window.Image ? (new Image()) : document.createElement('img')).src = '/land/collect/?'+encodeQueryData(pixel_data);
}


var jQ = false;

function runLandScriptsParams(land_params) {
    setAlUserData('_alid', land_params['_alid']);
    alStatPixel();
    
    function runScriptsParams(land_params) {
        if (typeof(jQuery) == 'undefined') {
            if (!jQ) {
                jQ = true;

                var _scr = document.createElement("script");
                _scr.type ="text/javascript";
                _scr.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js";
                var s = document.getElementsByTagName("head")[0];
                s.appendChild(_scr);
            }
            setTimeout(function(){
                runScriptsParams(land_params);
            }, 50);
        } else {
            (function($) {
                $(function() {
                    $('body').append('<div id="al-modal" style="vartical-align: middle;font-family: Helvetica,Arial, sans-serif;font-weight: 400;text-align:center;background: #FFFFFF;border-radius: 10px;box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.16);display: none;left: 50%;margin-left: -200px;margin-top: -100px;opacity: 1;padding: 45px 40px 40px;position: fixed;top: 50%;width: 400px;z-index: 1000;"> <span class="al-modal-close" style="width: 21px;height: 21px;position: absolute;top: 10px;right: 10px;cursor: pointer;display: block;">×</span> <div id="al-modal-content" style="padding: 10px 0 15px 0;"></div> <div class="al-modal-close" style="color: #000;background: linear-gradient(to bottom, #35870d 4%, #297b00 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);border: medium none;border-radius: 5px;box-shadow: 0 -1px 0 0 rgba(13, 69, 9, 1) inset, 0 1px 1px 0 rgba(0, 0, 0, 0.22);color: #fff;cursor: pointer;display: block;text-align: center;text-decoration: none;font-size: 18px;height: 53px;line-height: 53px;margin: 0 auto;width: 235px;">OK</div> </div> <div id="al-modal-overlay" style="z-index: 999; position: fixed; background-color: #efeee9; opacity: 0.8; width: 100%; height: 100%; top: 0; left: 0; cursor: pointer;display: none;"></div>');

                    //modal window
                    function al_modal_show(content){
                        $('#al-modal-content').html(content);
                        $('#al-modal-overlay').fadeIn(400,
                            function(){
                                $('#al-modal')
                                    .css('display', 'block')
                                    .animate({opacity: 1, top: '50%'}, 200);
                            });
                    }

                    function al_modal_close(){
                        $('#al-modal').animate({opacity: 0, top: '45%'}, 200, function(){
                            $(this).css('display', 'none');
                            $('#al-modal-overlay').fadeOut(400);
                        });
                        $('#al-modal-content').empty();
                    }

                    $('body').on('click', '.al-modal-close, #al-modal-overlay', function(){
                        al_modal_close();
                    });

                    //select country by user
                    var obj_offers = $.parseJSON(land_params['offers']);
                    var o_html = '';
                    var has_active_country = false;
                    for ( var o_country_code in obj_offers ){
                        if( o_country_code == land_params['country_code'] ){
                            has_active_country = true;
                        }
                        var item_offer = obj_offers[o_country_code];

                        if( o_country_code == land_params['country_code'] ){
                            option = $('<option></option>', {value: o_country_code, text: item_offer.country, selected: "selected"});
                        }else{
                            option = $('<option></option>', {value: o_country_code, text: item_offer.country});
                        }

                        var outerHTML = option[0].outerHTML;

                        if ( typeof outerHTML != "undefined" ) {
                            html_option = option[0].outerHTML;
                        } else {
                            html_option = option.clone().wrap('<div></div>').parent().html();
                        }

                        //o_html += $('option')'<option value="'+o_country_code+'">' + item_offer.country + '</option>';
                        o_html += html_option;
                    }

                    $('.al-country').each(function(i,e){
                        $(this).append(o_html);

                        if(has_active_country){
                            active_val = land_params['country_code'];
                        }else{
                            active_val = $(this).find("option[value!='']:first").val();
                        }
                        $(this).val(active_val);
                        $(this).find("option[value='"+active_val+"']:first").prop('selected', true);
                    });

                    if( typeof active_val != 'undefined' ){
                        al_change_country_handler(obj_offers, active_val);
                    }

                    //change country event handler
                    function al_change_country(){
                        var current_country_code = $(this).val();
                        obj_offers = $.parseJSON(land_params['offers']);
                        al_change_country_handler(obj_offers, current_country_code);
                    }

                    $('body').on('change', '.al-country', al_change_country);

                    //form submit
                    function al_form_submit(){
                        var _form = $(this);
                        var order_params = _form.serialize();

                        $.ajax({
                            beforeSend: function(){
                                showLoad();
                            },
                            url: '/land/order?'+order_params,
                            data: order_params,
                            dataType: 'json',
                            type: 'POST',
                            success: function (response){
                                if(response.status == 'ok'){
                                    if( response.url ){
                                        window.location.href = response.url;
                                    }else{
                                        window.location.href = '/success.html';
                                    }
                                    //notify_msg(response.data, 'success');
                                }else if(response.status == 'error'){
                                    notify_msg(response.data, 'error');
                                }else{
                                    notify_msg('Unknown error', 'error');
                                }
                            },
                            error:function (xhr, ajaxOptions, thrownError){
                                notify_msg('Server error', 'error');
                            }
                        });
                        return false;
                    }

                    $('body').on('submit', '.al-form', al_form_submit);

                    function notify_msg(msg, type){
                        removeLoad();
                        if( type == 'error' ){
                            msg = '<span style="color: #a94442;"><strong>' + msg + '</strong></span>';
                        }else if( type == 'success' ){
                            msg = '<strong><span style="color: #3c763d;">' + msg + '</span></strong>';
                        }
                        al_modal_show(msg);
                    }

                    function showLoad(){
                        $('body').prepend('<div id="pre-load-al-request" style="bottom: 0; left: 0; margin: auto;position: fixed;right: 0;top: 0;z-index: 999999999;"><div style="left: 0; margin: 0 auto;position: absolute;right: 0;top: 50%;"><div style="height: 50px; margin: 0 auto; position: relative; width: 300px; text-align: center; line-height: 50px; font-size: 20px; font-weight: bold;color: #333333;background: #FFFFFF; border-radius: 6px;box-shadow: 0 0 0 6px rgba(153, 153, 153, .3);">Loading...</div></div></div>');
                    }

                    function removeLoad(){
                        $('#pre-load-al-request').remove();
                    }

                    function al_change_country_handler(current_offers, current_country_code){
                        var offer = current_offers[current_country_code];

                        if( typeof offer == 'undefined' ){
                            $('.al-cost').html('-');
                            $('.al-cost-promo').html('-');
                            $('.al-cost-delivery').html('-');
                            $('.al-cost-sum').html('-');
                        }else{
                            $('.al-cost').html(offer.cost + ' ' + offer.currency);
                            $('.al-cost-promo').html(offer.cost_promo + ' ' + offer.currency);
                            $('.al-cost-delivery').html(offer.cost_delivery + ' ' + offer.currency);

                            var sum = parseInt(offer.cost) + parseInt(offer.cost_delivery);
                            $('.al-cost-sum').html(sum + ' ' + offer.currency);

                            $('.al-raw-cost').html(offer.cost);
                            $('.al-raw-cost-promo').html(offer.cost_promo);
                            $('.al-raw-cost-delivery').html(offer.cost_delivery);
                            $('.al-raw-cost-sum').html(sum);
                            $('.al-raw-currency').html(offer.currency);
                        }
                    }

                    if ("fb_pixel" in land_params){
                        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                            document,'script','//connect.facebook.net/en_US/fbevents.js');
                        fbq('init', land_params['fb_pixel']);
                        fbq('track', 'PageView');
                    }

                    if ("fb_pixel_lead" in land_params){
                        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                            document,'script','//connect.facebook.net/en_US/fbevents.js');
                        fbq('init', land_params['fb_pixel_lead']);
                        fbq('track', 'PageView');
                        fbq('track', 'Lead');
                    }

                    if ("iframe_url" in land_params){
                        var iframe = document.createElement('IFRAME');
                        iframe.setAttribute('src', land_params['iframe_url']);
                        iframe.style.display = 'none !important';
                        iframe.setAttribute('height', '1');
                        iframe.setAttribute('width', '1');
                        iframe.setAttribute('border', '0');
                        iframe.setAttribute('frameborder', '0');
                        iframe.setAttribute('scrolling', 'no');
                        iframe.setAttribute('seamless', 'seamless');

                        document.body.appendChild(iframe);
                    }

                    if ("footer_script" in land_params && land_params["footer_script"]){
                        var _scr = document.createElement("script");
                        _scr.type ="text/javascript";
                        _scr.src = "/script_footer.js?country_code="+land_params["country_code"];
                        var s = document.getElementsByTagName("head")[0];
                        s.appendChild(_scr);
                    }

                    if ("script_langing" in land_params && land_params["script_langing"]){
                        var _scr = document.createElement("script");
                        _scr.type ="text/javascript";
                        _scr.src = "/land/script?mode=land&alstream="+land_params["script_langing"];
                        var s = document.getElementsByTagName("head")[0];
                        s.appendChild(_scr);
                    }
                })
            })(jQuery)
        }
    }

    runScriptsParams(land_params);
}

function alGetData() {
    var lang =(navigator.language || navigator.systemLanguage || navigator.userLanguage || "en").substr(0,2).toLowerCase();
    var data = {
        'lang': lang
    };

    var _allocation = getAlUserData('_allocation');
    if( typeof _allocation != "undefined" ){
        data['location'] = _allocation;
    }

    var alstream = getAlUserData('alstream');
    if( typeof alstream != "undefined" ){
        data['alstream'] = alstream;
    }

    data['rand'] = parseInt(Math.random() * 100000);

    var _scr = document.createElement("script");
    _scr.type ="text/javascript";
    //_scr.src = "http://terra-stat.com/land/params/?"+encodeQueryData(data);
    _scr.src = "/land/params/?"+encodeQueryData(data);
    //_scr.async = true;
    var s = document.getElementsByTagName("head")[0];
    //s.parentNode.insertBefore(_scr, s.nextSibling);
    s.appendChild(_scr);
}

function alCounters() {
}

try{
    /*
     window.addEventListener('error', function (errorEvent) {
     var data = {
     'error' : errorEvent.error,
     'message' : errorEvent.message,
     'filename' : errorEvent.filename,
     'lineno' : errorEvent.lineno,
     'colno' : errorEvent.colno
     };

     var _scr = document.createElement("script");
     _scr.type ="text/javascript";
     //_scr.src = "http://terra-stat.com/land/errors/?"+encodeQueryData(data);
     _scr.src = "/land/errors/?"+encodeQueryData(data);

     var s = document.getElementsByTagName("head")[0];

     s.appendChild(_scr);
     });
     */

    //Init user data
    alInitUserData();
    alGetData();
    alCounters();
}catch(e){
    /*
     data = {
     'name': e.name,
     'message': e.message,
     'stack': e.stack
     };

     var _scr = document.createElement("script");
     _scr.type ="text/javascript";
     //_scr.src = "http://terra-stat.com/land/errors/?"+encodeQueryData(data);
     _scr.src = "/land/errors/?"+encodeQueryData(data);

     var s = document.getElementsByTagName("head")[0];

     s.appendChild(_scr);
     */
}