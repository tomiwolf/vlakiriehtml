jQuery(function ($) { 
    var searching = false;

    function checkSearchRealtime() {
        var timeout;
        var delay = 1000;   // 1 second //Get this value from attributes
        
        $('.csv-search').on('keyup','.search-text', function(e) { 
            var ev = e;
            var t = $(this);

            //Check if realtimesearch is set to yes for this table
            //and do the search then
            var attrs = t.parent().parent().parent().find('.sc_attributes');
            var srt = attrs.find('input[name="search_realtime"]');
            if (srt.length>0) {
                if (srt.val() == 'yes') {
                    if(timeout) {
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(function() {            
                        searchTable(ev, t);
                    }, delay);
                }
            }
        });        
    }

    checkSearchRealtime();
    $('.csv-search').on('click','.search-submit', function(e) {
        searchTable(e, $(this))
    });

    $('.csv-search').on('click','.reset-submit', resetTable);
    
    function resetTable(e) {
        e.preventDefault();
        var h = $(this).data();
        var tablewrapper_obj = $('#wrapper-' + h.htmlid);
        var shortcode_attributes = tablewrapper_obj.find('form.sc_attributes');

        $('body').css('cursor','wait');
        $('.csv-search').css('cursor', 'wait');
        $('.csv-search form').css('cursor', 'wait');
        $('.csv-search input').css('cursor', 'wait');    

        var current_url = my_ajax_object.ajax_url;
        $.ajax({
            url: current_url,
            method: 'POST',         
            dataType: 'json',
            data:{
                action: 'fetchtable',  
                attrs: shortcode_attributes.serialize(),  
                pagination_start: 1, //always start at page 1 when search result is presented
                reset: 1
            }
        })
        .done(function( response ) {   
            $('body').css('cursor','default');
            $('.csv-search').css('cursor', 'default');
            $('.csv-search form').css('cursor', 'default');   
            $('.csv-search input').css('cursor', 'default'); 
            $('.csv-reset').off('click', '.search-submit');        
            $('.csv-reset').off('click', '.reset-submit');   
            $('.csv-search').off('keyup','.search-text');
            $('.csvhtml-pagination').off('click', 'a');
            tablewrapper_obj[0].outerHTML = response.tabledata;

            //Reinitiate for click to work after replacing html-content table/pagination     
            $('.csv-search').on('click','.search-submit', function(e) {
                searchTable(e, $(this))
            });
            $('.csvhtml-pagination').on('click', 'a', reloadTable);
            $('.csv-search').on('click','.reset-submit', resetTable);
            checkSearchRealtime();
        })
        .fail(function(textStatus) {
            $('body').css('cursor','default');
            $('.csv-search').css('cursor', 'default');
            $('.csv-search form').css('cursor', 'default');
            $('.csv-search input').css('cursor', 'default');  
            $('.csv-search').off('click', '.search-submit');  
            $('.csvhtml-pagination').off('click', 'a');      
            $('.csv-search').off('click', '.reset-submit');            
            $('.csv-search').off('keyup','.search-text');  

            $('.csv-search').on('click','.search-submit', function(e) {
                searchTable(e, $(this))
            });
            checkSearchRealtime();                       
            $('.csvhtml-pagination').on('click', 'a', reloadTable);
            $('.csv-search').on('click','.reset-submit', resetTable);
            console.log('failed resetTable');
            console.log(textStatus);
        });
    };

    function searchTable(e, ths) {
        if ( searching == true ) {
            return false;
        }

        searching = true;
        e.preventDefault();      
        var search_text = ths.parent().find('.search-text').val();                   
        var h = ths.data();
        var tablewrapper_obj = $('#wrapper-' + h.htmlid);       
        var shortcode_attributes = tablewrapper_obj.find('form.sc_attributes');

        $('body').css('cursor','wait');
        $('.csv-search').css('cursor', 'wait');
        $('.csv-search form').css('cursor', 'wait');
        $('.csv-search input').css('cursor', 'wait');    

        var current_url = my_ajax_object.ajax_url;
        $.ajax({
            url: current_url,
            method: 'POST',         
            dataType: 'json',
            data:{
                action: 'fetchtable',  
                attrs: shortcode_attributes.serialize(),  
                pagination_start: 1, //always start at page 1 when search result is presented
                search: search_text
            }
        })
        .done(function( response ) {   
            $('body').css('cursor','default');
            $('.csv-search').css('cursor', 'default');
            $('.csv-search form').css('cursor', 'default');   
            $('.csv-search input').css('cursor', 'default');      
            $('.csv-search').off('click', '.search-submit');   
            $('.csvhtml-pagination').off('click', 'a');          
            $('.csv-search').off('click', '.reset-submit');   
            $('.csv-search').off('keyup','.search-text');  
            tablewrapper_obj[0].outerHTML = response.tabledata;
           

            //Reinitiate for click to work after replacing html-content table/pagination     
            $('.csv-search').on('click','.search-submit', function(e) {
                searchTable(e, $(this))
            });
            $('.csvhtml-pagination').on('click', 'a', reloadTable);
            $('.csv-search').on('click','.reset-submit', resetTable);                 
            checkSearchRealtime();
            searching = false;       
        })
        .fail(function(textStatus) {
            ths.disabled = false;
            $('body').css('cursor','default');
            $('.csv-search').css('cursor', 'default');
            $('.csv-search form').css('cursor', 'default');
            $('.csv-search input').css('cursor', 'default');  
            $('.csv-search').off('click', '.search-submit');
            $('.csvhtml-pagination').off('click', 'a');      
            $('.csv-search').off('click', '.reset-submit');     
            $('.csv-search').off('keyup','.search-text');  
            $('.csv-search').on('click','.search-submit', function(e) {
                searchTable(e, $(this))
            });
            $('.csvhtml-pagination').on('click', 'a', reloadTable);
            $('.csv-search').on('click','.reset-submit', resetTable);
            checkSearchRealtime();
            searching = false;            
            console.log('failed searchTable');
            console.log(textStatus);
        });
    };

    
    //Pagination click - reload table based on what row to start on
    //(pagination)
    $('.csvhtml-pagination').on('click', 'a', reloadTable);

    //this is a separate function because a reinitation is need after every click
    //because html is replaced totally from shortcode
    function reloadTable(e) {        
        e.preventDefault();       
        var h = $(this).data();
        var tablewrapper_obj = $('#wrapper-' + h.htmlid);
        var shortcode_attributes = tablewrapper_obj.find('form.sc_attributes');

        $('body').css('cursor','wait');
        $('.csvhtml-pagination').css('cursor', 'wait');
        $('.csvhtml-pagination a').css('cursor', 'wait');

        var current_url = my_ajax_object.ajax_url;
        $.ajax({
            url: current_url,
            method: 'POST',         
            dataType: 'json',
            data:{
                action: 'fetchtable',  
                attrs: shortcode_attributes.serialize(),  
                pagination_start: h.pagination
            }
        })
        .done(function( response ) {   
            $('body').css('cursor','default');     
            $('.csvhtml-pagination').css('cursor', 'default');
            $('.csvhtml-pagination a').css('cursor', 'default');
            $('.csv-search').off('click', '.search-submit');
            $('.csvhtml-pagination').off('click', 'a');     
            $('.csv-search').off('click', '.reset-submit');  
            $('.csv-search').off('keyup','.search-text'); 
                               
            tablewrapper_obj[0].outerHTML = response.tabledata;              
            $('.csvhtml-pagination').on('click', 'a', reloadTable); //Reinitiate for click to work after replacing html-content table/pagination                                                          
            $('.csv-search').on('click','.search-submit', function(e) {
                searchTable(e, $(this))
            });
            $('.csv-search').on('click','.reset-submit', resetTable);
            checkSearchRealtime();     
        })
        .fail(function(textStatus) {
            $('body').css('cursor','default');
            $('.csvhtml-pagination').css('cursor', 'default');
            $('.csvhtml-pagination a').css('cursor', 'default');
            $('.csvhtml-pagination').off('click', 'a');     
            $('.csv-search').off('click', '.search-submit');
            $('.csv-search').off('click', '.reset-submit');
            $('.csv-search').off('keyup','.search-text');  
            $('.csvhtml-pagination').on('click', 'a', reloadTable); //Reinitiate for click to work after replacing html-content table/pagination                                              
            $('.csv-search').on('click','.search-submit', function(e) {
                var t = $(this);
                searchTable(e, t)
            });
            $('.csv-search').on('click','.reset-submit', resetTable);    
            checkSearchRealtime();  
             
            console.log('failed reloadTable');
            console.log(textStatus);
        });
    };
});