if (window.innerWidth < 992) {
    jQuery( ".checkMenu" ).on( "click", function() {
            if( jQuery("#wrapper").hasClass("menuClose")) {
                jQuery("#wrapper").removeClass("menuClose");
            }
        })
    jQuery( ".close-menu" ).on( "click", function() {
        jQuery("#wrapper").addClass("menuClose");
    })
}

jQuery( document ).ready(function() {
    if (window.innerWidth < 992) {
        jQuery( ".checkMenu" ).on( "click", function() {
                if( jQuery("#wrapper").hasClass("menuClose")) {
                    jQuery("#wrapper").removeClass("menuClose");
                }
            })
        jQuery( ".close-menu" ).on( "click", function() {
            jQuery("#wrapper").addClass("menuClose");
        })
    }
})

jQuery(".search__triger").click(function () {
    jQuery(".search-block").addClass("actived");
}); 
jQuery(".close-icon-search").click(function () {
    jQuery(".search-block").removeClass("actived");
}); 


jQuery(".minicart__close").click(function () {
    jQuery(".cart__dropdown").removeClass("actived");
}); 

jQuery(document).ready(function ($) {
    +function ($) {
        if (jQuery.fn.owlCarousel) {
			var $fullBanner = jQuery('#full-banner');
			$fullBanner.find('ul').owlCarousel({
				autoPlay : 5000,
				stopOnHover : true,
				pagination: true,
				navigation:true,
				navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>','<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
				paginationSpeed : 1000,
				goToFirstSpeed : 2000,
				singleItem : true,
				autoHeight : true
			});



            jQuery(".showcase-carousel ul").owlCarousel({
                autoPlay: false,
                items: 4,
                itemsCustom: [[320, 2], [600, 2], [768, 2], [992, 3], [1200, 4], [1440,4]],
                itemsScaleUp: false,
                itemsTabletSmall: false,
                navigation: true,
                navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                pagination: true,
                singleItem: false,
                responsiveClass:true,
                responsive: {
                    0:{
                      navigation:false, // from this breakpoint 678 to 959
                      pagination:true // only within 678 and next - 959
                    }
                }
            });

            jQuery(".brands-list").owlCarousel({
                autoPlay: false,
                items: 6,
                padding : 23,
                itemsCustom: [[320, 2], [600, 2], [768, 3], [992, 4], [1200, 6]],
                loop:true,
                nav:true,
                responsive: {
                    0:{
                      navigation:false, // from this breakpoint 678 to 959
                      pagination:true // only within 678 and next - 959
                    }
                }
            });

     

            jQuery(".facebook-recomenda_list").owlCarousel({
                autoPlay: true,
                items: 4,
                itemsCustom: [[320, 1], [600, 2], [768, 2], [992, 2], [1200, 3]],
                navigation: true,
                navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                pagination: true,
                responsiveClass:true,
                responsive: {
                    0:{
                      navigation:true, // from this breakpoint 678 to 959
                      pagination:true // only within 678 and next - 959
                    }
                }
            });
            
            jQuery(".banners-carousel ul").owlCarousel({
                autoPlay: true,
                items: 2,
                itemsCustom: [[320, 1], [768, 1], [992, 1], [1200, 2]],
                itemsScaleUp: false,
                itemsTabletSmall: false,
                navigation: true,
                navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                pagination: true,
                singxleItem: false,
                responsiveClass:true,
                responsive: {
                    0:{
                      navigation:false, // from this breakpoint 678 to 959
                      pagination:true // only within 678 and next - 959
                    }
                }
            });

            jQuery(".showcase-videoproduct").slick({            
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite:false,
                    vertical:true,
                    nextArrow: '<i class="fa fa-angle-down" aria-hidden="true"></i>',
                    prevArrow: '<i class="fa fa-angle-up" aria-hidden="true"></i>',
                    responsiveClass:true,
                    responsive: [
                        {
                          breakpoint: 992,
                          settings: {
                            vertical:false,
                            dots:true,
                            arrows:false,
                          }
                    }
                ]
            });
            
            jQuery(".product__related ul").owlCarousel({
                autoPlay: false,
                items: 4,
                itemsCustom: [[320, 2], [768, 2], [992, 3], [1200, 4]],
                itemsScaleUp: false,
                itemsTabletSmall: false,
                navigation: false,
                navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                pagination: true,
                singxleItem: false,
                responsiveClass:true,
                responsive: {
                    0:{
                      navigation:false, // from this breakpoint 678 to 959
                      pagination:true // only within 678 and next - 959
                    }
                }
            });
            

            jQuery(".brands__list ul").owlCarousel({
                autoPlay: false,
                itemsCustom: [[320, 3], [768, 3], [992, 5], [1200, 8]],
                itemsScaleUp: false,
                itemsTabletSmall: false,
                navigation: false,
                navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                pagination: true,
                responsiveClass:true,
                responsive: {
                    0:{
                      navigation:false, // from this breakpoint 678 to 959
                      pagination:true // only within 678 and next - 959
                    }
                }
            });

            jQuery(".banners-extra__list").owlCarousel({
                autoPlay: false,
                items: 4,
                itemsCustom: [[320, 2], [768, 2], [992, 3], [1200, 4]],
                itemsScaleUp: false,
                itemsTabletSmall: false,
                navigation: false,
                navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                pagination: true,
                singxleItem: false,
                responsiveClass:true,
                responsive: {
                    0:{
                      navigation:false, // from this breakpoint 678 to 959
                      pagination:true // only within 678 and next - 959
                    }
                }
            });
            jQuery(".category_list").owlCarousel({
                autoPlay: true,
                items: 12,
                itemsCustom: [[320, 2], [768, 2], [992, 4], [1200, 7]],
                itemsScaleUp: false,
                itemsTabletSmall: false,
                navigation: true,
                navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                pagination: false,
                singxleItem: false,
                responsiveClass:true,
                responsive: {
                    0:{
                      navigation:false, // from this breakpoint 678 to 959
                      pagination:true // only within 678 and next - 959
                    }
                }
            });
            
            jQuery("#product-page .produto-imagem-miniaturas li span").on("click",function(e){
                var fotoClicada = (event.currentTarget.getAttribute("id"));
                var fotoClicadaNew = fotoClicada.replace("L", "H");
                var fotoMostra = jQuery("#foto_p");
                var elementoMostra = jQuery(fotoMostra).find("#" + fotoClicadaNew);
                jQuery("#foto_p span").removeClass("teste");
                jQuery("#foto_p span").addClass("removeFoto");
                elementoMostra.removeClass("removeFoto");
                elementoMostra.addClass("mostraFoto");
            });

            if (window.innerWidth < 992) {
                jQuery(".extra-outros").owlCarousel({
                    autoPlay: true,
                    stagePadding: 50,
                    margin:10,
                    items: 4,
                    itemsCustom: [[320, 1], [600, 1], [768, 3]],
                    navigation: false,
                    navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                    pagination: true,
                    singleItem: true
                });
            }

            if (window.innerWidth < 992) {
                jQuery(".extra-prime").owlCarousel({
                    autoPlay: true,
                    items: 6,
                    itemsCustom: [[320, 2], [600, 2], [768, 3]],
                    navigation: false,
                    navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                    pagination: true,
                    singleItem: false
                });
            }

            jQuery(".info-list").owlCarousel({
                autoPlay: true,
                items: 4,
                itemsCustom: [[320, 1], [600, 1], [768, 1],[992, 1], [1200, 1] ],
                navigation: true,
                navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                pagination: false,
                singleItem: false
            });
            if (window.innerWidth < 992) {
                jQuery(".ruler ul").owlCarousel({
                    autoPlay: true,
                    items: 5,
                    itemsCustom: [[320, 2], [600, 2], [768, 2],[992, 2] ],
                    navigation: true,
                    navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                    pagination: false,
                    singleItem: false
                });
            }

            


            // console.log(jQuery(window).width());
            if(jQuery(window).width() < 1200) {
                jQuery(".vertical-showcases ul").owlCarousel({
                    autoPlay: true,
                    items: 1,
                    itemsCustom: [[320, 1], [768, 1], [992, 1], [1200, 1]],
                    itemsScaleUp: false,
                    itemsTabletSmall: false,
                    navigation: false,
                    navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                    pagination: true,
                    singxleItem: false
                });
            }

        }
    }(jQuery);

    if (screen.width < 767) {
        var i = 1;
        jQuery('.smart_filter .smart-filter-label').each(function (index, el) {
            var self = jQuery(this);
            var name = self.attr('data-filter-label');

            self.bind('click', function (event) {
                self.toggleClass('estado-ativo');
                jQuery('[data-filter-container=' + name + ']').slideToggle('300')
                    .toggleClass('estado-ativo');
            });
        });
    };

    jQuery(".triger_btn-tabs").click(function () {
        var item = jQuery(this).closest('.dispblock');
        var hasOpen = !item.hasClass('drop');
        jQuery('.dispblock').removeClass('drop');
        if(hasOpen) item.addClass("drop");
        else{ item.removeClass("drop") }
    
    });
    if (screen.width > 992) {
    jQuery( ".title-triger" ).on( "click", function() {
        var item = jQuery(this).closest('.filter-block');
        var hasOpen = !item.hasClass('drop');
        jQuery('.filter-block').removeClass('drop');
        if(hasOpen) item.addClass("drop");
        else{ item.removeClass("drop") }
    });
    }
    if (screen.width < 992) {
    jQuery( ".title-triger" ).on( "click", function() {
        var item = jQuery(this).closest('.list-block');
        var hasOpen = !item.hasClass('drop');
        jQuery('.list-block').removeClass('drop');
        if(hasOpen) item.addClass("drop");
        else{ item.removeClass("drop") }
    });
    }

    // jQuery( ".title-triger" ).on( "click", function() {
    //     if(jQuery(".filter-block").hasClass("active__dropdown")) {
    //         jQuery(".filter-block").removeClass("active__dropdown");
    //     } else {
    //         jQuery(".filter-block").addClass("active__dropdown");
    //     }
    // });

    $(".submenu.in").closest(".menu").addClass("in");

    jQuery('#foto_p').attr('data-target', "");

    if($('.smart_filter h3').eq(0).text() == "Categorias") {
        $('.smart_filter h3').eq(0).text($('.breadcrumb .category').text());
    }

    if($('.fotosCompreJunto').length > 0) {

        var aux;

        $.each($('.fotosCompreJunto .produto img'), function() {
            aux = $(this).attr('src');

            aux = aux.replace('/90_', '/180_');

            $(this).attr('src', aux);
        });

    }
    $(function(){
        $('#linksPag a').click(function(){
            //ajax
            setTimeout(function() {
                jQuery('a.FotoLista img').attr('class', "vistadosImg");
                if($('.vistadosImg').length > 0) {
                    var aux;
                    $.each($('.vistadosImg'), function() {
                        aux = $(this).attr('src');
                        aux = aux.replace('/90_', '/');
                        $(this).attr('src', aux);
                    });
                }
                return false;
            },500)
        })
    })
      
        jQuery('a.FotoLista img').attr('class', "vistadosImg");
        if($('.vistadosImg').length > 0) {
            var aux;
            $.each($('.vistadosImg'), function() {
                aux = $(this).attr('src');
                aux = aux.replace('/90_', '/');
                $(this).attr('src', aux);
            });
        }

    if($('#nav_bar .nv-01 > .you-need').length > 0) {

        if($(window).width() < 980) {
            $('#nav_bar .nv-01 > .you-need .you-need__toggle').on('click', function(){
                $('.you-need__list').slideToggle(150);
            });
        }

    }

    var lastScrollTop = 0;
    jQuery(window).scroll(function (event) {
        var st = jQuery(this).scrollTop();

        if (st > 150) {
            jQuery('body').addClass('moving');
            if (st > lastScrollTop) {
                jQuery('body').addClass('moving--down');
            } else {
                jQuery('body').removeClass('moving--down');
            }
            lastScrollTop = st;
        } else {
            jQuery('body').removeClass('moving');
        }
    });

});
+function ($) {
    'use strict';

    var $smartFilterMobile = jQuery('.mobileFilter');
    var $mobileMenu = jQuery('.mobileMenu');
    var $mask = jQuery('#mask');

    jQuery($smartFilterMobile).click(function () {
        jQuery('body').toggleClass('ac_sm_ft');
    });
    jQuery($mobileMenu).click(function () {
        jQuery('body').toggleClass('ac_sm_menu');
    });
    jQuery($mask).click(function () {
        jQuery('body').removeClass('ac_sm_menu ac_sm_ft');
    });
}(jQuery);


jQuery( document ).ready(function() {
    jQuery("body").addClass("active__body");
    jQuery("li[class='']").addClass("bbox");
});

jQuery( document ).ready(function() {
   
    
jQuery("svg.icon_inforuler").click(function () {   
    console.log("passou aqui") 
    var item = jQuery(this).closest('.condicoes-item');
    var hasOpen = !item.hasClass('drop');
    jQuery('.condicoes-item').removeClass('drop');
    if(hasOpen) item.addClass("drop");
    else{ item.removeClass("drop") }

});

jQuery(".closeModalinfo").click(function () {    
    jQuery('.condicoes-item').removeClass('drop');
});



    if (window.innerWidth < 992) {


        jQuery("svg.arrow-down").click(function () {    
            var item = jQuery(this).closest('.dropdown-nv2');
            var hasOpen = !item.hasClass('drop');
            jQuery('.dropdown-nv2').removeClass('drop');
            if(hasOpen) item.addClass("drop");
            else{ item.removeClass("drop") }
        
        });

        jQuery(".title-triger").click(function () {    
            var item = jQuery(this).closest('.filter-block');
            var hasOpen = !item.hasClass('drop');
            jQuery('.filter-block').removeClass('drop');
            if(hasOpen) item.addClass("drop");
            else{ item.removeClass("drop") }
        
        });


        jQuery("svg.search__icon").click(function () {    
            var item = jQuery(this).closest('.dropdown-content');
            var hasOpen = !item.hasClass('drop');
            jQuery('.dropdown-content').removeClass('drop');
            if(hasOpen) item.addClass("drop");
            else{ item.removeClass("drop") }
        
        });

        jQuery(".closeModalinfo").click(function () {    
            jQuery('.dropdown-content').removeClass('drop');
        });
        

    }
    
});


   //Movie
   var movieItem = jQuery('.modal_item-save').html();
   jQuery('.btn-modal-movie').click(function(){
       jQuery('.movie__one .modal-body').html( movieItem );
   });

   jQuery('.modal').click(function(e){
      if( jQuery(e.target).hasClass('modal') ){
         jQuery('.movie__one .modal-body').html('');
         jQuery('#modal-video-produto .modal-body').html('');
      }
   });

   jQuery('.modal .close').click(function(e){
       jQuery('.movie__one .modal-body').html('');
       jQuery('#modal-video-produto .modal-body').html('');
   });
   



   jQuery(function() {
    jQuery('#colorselector').change(function(){
      jQuery('.colors').hide();
      jQuery('#' + jQuery(this).val()).show();
    });
  });

    jQuery('.checkbox').on("change", function () {
        var links = [],
        sum = 0;
    jQuery('.checkbox').each(function () {
        links.push(jQuery(this).attr('data-link')); //get links
        sum += +jQuery(this).attr('data-cart');
    });
    jQuery('.price').html(sum);

    jQuery("a").attr("href", links.join(",")); // change link

});

    jQuery(window).load(function(){
        jQuery('.facebook-recomenda_list_item iframe').attr('class', "facebookIframe");
    })





     jQuery( "div#modal-form-content .botao" ).addClass( "myClass" );
        setTimeout(function() {
            console.log('passou aqui')
        },500)
    jQuery("#btnTeste").on('click', function(){
        jQuery( "div#modal-form-content" ).addClass( "myClass" );
        console.log("foiii")
        return false;
    })
    jQuery("#product-page .produto-imagem-miniaturas li span").on("click",function(e){
        var fotoClicada = (event.currentTarget.getAttribute("id"));
        var fotoClicadaNew = fotoClicada;
        console.log("passou aqui");
        var fotoMostra = jQuery("#foto_p");
        var elementoMostra = jQuery(fotoMostra).find("#" + fotoClicadaNew);
        jQuery("#foto_p span").removeClass("teste");
        jQuery("#foto_p span").addClass("removeFoto");
        elementoMostra.removeClass("removeFoto");
        elementoMostra.addClass("mostraFoto");
    });

    jQuery(window).load(function(){
    if (window.innerWidth < 992) {
        if (jQuery("#carousel").children().length <= 0) {
        } else {
            jQuery('.jcarousel-skin-tango').slick({
                centerMode: true,
                slidesToShow: 1,
                adaptiveHeight: true,
                variableWidth: true,
                dots: true,
                arrows: false,  
            });
        }
    }
        if (jQuery("#carousel").children().length <= 0) {
        } else {
            jQuery("#foto_p").addClass("fotoDisplayNone");
        }
})
    jQuery("#btnTeste").trigger('click');



    jQuery('.inputv2').change(function () {
        var itemNew = jQuery(this).closest('.dropdown');
        var noOpen = !itemNew.hasClass('dropdown');
        if (this.checked) {
                jQuery(this).closest('.dropdown').addClass("drop");
                jQuery(this).siblings('.dropdown-switcher').addClass("active__dropdown");
            }else {
                jQuery('div.dropdown-switcher').removeClass("active__dropdown");
                jQuery(".dropdown").removeClass("drop");

        }
    });
    
    jQuery('.inputv3').change(function () {
        var itemNew = jQuery(this).closest('.dropdown-nv2');
        var noOpen = !itemNew.hasClass('dropdown-nv2');
        if (this.checked) {
                jQuery(this).closest('.dropdown-nv2').addClass("drop");
                jQuery(this).siblings('.dropdown-switcher-3').addClass("active__dropdown");
            }else {
                jQuery('div.dropdown-switcher-3').removeClass("active__dropdown");
                jQuery(".dropdown-nv2").removeClass("drop");

        }
    });
    jQuery(document).ready(function(){
        if (window.innerWidth < 992) {
            jQuery( ".btn-voltarmenu" ).on( "click", function() {
                jQuery('.list-block').removeClass('drop');
                jQuery('input:checkbox').removeAttr('checked', 'checked');
                jQuery(".dropdown-switcher").removeClass("active__dropdown");
            });
        }
    })


    jQuery( ".title-triger" ).on( "click", function() {
        var item = jQuery(this).closest('.list-block');
        var hasOpen = !item.hasClass('drop');
        jQuery('.list-block').removeClass('drop');
        if(hasOpen) item.addClass("drop");
        else{ item.removeClass("drop") }
    });


// Get the video
var video = document.getElementById("myVideo");

// Get the button
var btn = document.getElementById("myBtn");

// Pause and play the video, and change the button text
function myFunction() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    btn.innerHTML = "Play";
  }
}

console.log("passsou aqui agora mesmo")
   // Variaveis
   var content = this.selector;
   var params = {};
   var variants = "";
   var skuVariants = {};
   var skuVariantsData = {};
   var skuVariantKey = "";
   var skuVariantsId = {};
var methods = {
    init: function(){

        methods.requestVariants(params);

        jQuery( document ).ready(function() {
         jQuery('#opcoes0 li').click(function(){
           jQuery('.lista_select').val("");
           jQuery('#opcoes1 li').removeClass('selecionada');
           jQuery('.lista_select').removeClass('indisponivel');
           jQuery('#variacao1').val("");
         });

         jQuery(content+' > #opcoes1 li').click(function(){
           if(jQuery("input#selectedVariant").val() == ""){
             jQuery('.var-unavailable' ).css('display','block');
             jQuery(this).addClass('indisponivel');
           }else{
             jQuery(this).removeClass('indisponivel');
           }
         });
       });

    },
    


    showVariants: function () {
        // bloco para montar as variacoes
        jQuery(content).empty();
        jQuery(content).append("<input type='hidden' name='variacao' id='selectedVariant"+"' value=''>");
        jQuery(content).prepend('<span class="var-unavailable'+' blocoAlerta" style="display:none">Indisponivel</span>');
   
          var iOp = 0;
          for (var key in skuVariants) {
            var variantDiv = jQuery("<div></div>").text(key).attr("class","varTit onVar color-tone-1").attr("id","vars"+iOp);
            var variantInput = jQuery("<input></input>").attr("id","variacao"+iOp).attr("type","hidden");
            var variantUl = jQuery("<ul></ul>").attr("id","opcoes"+iOp).attr("class","lista_radios").css('margin', '5px 0 5px 0');
   
            var variantOp = [];
   
            for (var index in skuVariants[key]){
              if (skuVariants[key].hasOwnProperty(index)) {
                var skuVariant  = skuVariantsData[key][index].toString().split(",");
                var nameVariant = skuVariantsData[key][index][0];
                var image1      = skuVariantsData[key][index][1];
                var image2      = skuVariantsData[key][index][2];
                if (image2) {
                  var variantLi = jQuery("<li></li>").attr("class","color variacao-").css('margin-right', '3px');;
                  var labelVar  = jQuery("<label></label>").attr("class","lista-radios-input");
                  var divImgVar = jQuery("<div></div>")
                  var linkVar   = jQuery("<a></a>").attr("href","javascript:void(0)").attr("alt",nameVariant).click(function() {methods.selectVariation(jQuery(this))});
                  var imgVar    = jQuery("<img>").attr("src",image2).attr("alt",nameVariant).attr("title",nameVariant).attr("full",image1);
   
                  jQuery(variantLi).css('display', 'inline-block');
                  jQuery(linkVar).append(imgVar);
                  jQuery(divImgVar).append(linkVar);
                  jQuery(labelVar).append(divImgVar);
                  jQuery(variantLi).append(labelVar);
                  jQuery(variantUl).append(variantLi);
   
                } else {
                  var variantLi = jQuery("<li></li>").attr("class","").css('margin-right', '3px');
                  var labelVar  = jQuery("<label></label>").attr("class","lista-radios-input");
                  var divLabelVar = jQuery("<div></div>").css('border', '1px solid black').css('padding','8px 10px 10px 10px');
                  var linkVar   = jQuery("<a></a>").attr("href","javascript:void(0)").attr("alt",nameVariant).click(function() {methods.selectVariation(jQuery(this))});
                  var nameVar    = jQuery("<div>"+nameVariant.toUpperCase()+"</div>");
   
                  jQuery(variantLi).css('display', 'inline-block');
                  jQuery(linkVar).append(nameVar);
                  jQuery(divLabelVar).append(linkVar);
                  jQuery(labelVar).append(divLabelVar);
                  jQuery(variantLi).append(labelVar);
                  jQuery(variantUl).append(variantLi);
                }
              }
            }
            jQuery(content).append(variantDiv);
            jQuery(content).append(variantInput);
            jQuery(content).append(variantUl);
            iOp++;
          }
          for (i = 0; i < skuVariants.length; i++) {
            var variantDiv = jQuery("<div></div>").append(skuVariants);
          }
 
      },
   
}
        jQuery.get('/web_api/variants').done(function( response ) {
            variants = response.Variants;
            for (i = 0; i < variants.length; i++) {
                var variant = variants[i].Variant;
                var available = variant.available;
            }
            console.log(JSON.stringify(variant+ "teste"));
            console.log(variant)
            
            if(parseInt(response.paging.total) > parseInt(response.paging.page) * parseInt(response.paging.limit)){
        
            params["product_id"] = product_id;
            params["page"] = parseInt(response.paging.page) + 1;
            methods.requestVariants(params);
          }else{
            methods.showVariants()
          }
        
        }).fail(function( jqXHR, status, errorThrown ){
          var response = $.parseJSON( jqXHR.responseText );
        });



 
        jQuery(document).ready(function() {
            jQuery(".dropdown").on("click", function(e) {
              e.stopPropagation();
              
              var subcategoriaSwitcher = jQuery(this).find(".dropdown-switcher");
              
              var icon = jQuery(this).find(".icon--arrow-bottom");
          
              subcategoriaSwitcher.toggleClass("subcategorias-visiveis");
              
              icon.toggleClass("rotated");
          
              jQuery(".dropdown-switcher").not(subcategoriaSwitcher).removeClass("subcategorias-visiveis");
              jQuery(".icon--arrow-bottom").not(icon).removeClass("rotated");
            });
          
            jQuery(document).on("click", function() {
              jQuery(".dropdown-switcher").removeClass("subcategorias-visiveis");
              jQuery(".icon--arrow-bottom").removeClass("rotated");
            });
          });

          jQuery(document).ready(function() {
            jQuery('.filter__list').hide();
          
            jQuery('.filter__title').click(function() {
              jQuery(this).toggleClass('active').next().slideToggle();
            });
          });

          
        
          jQuery(document).ready(function() {
            setTimeout(function() {
                jQuery('#myModal').modal('show');
            }, 2000); // Atraso de 2 segundos (você pode ajustar o valor conforme necessário)
        });


        var params = {};
        params["attrs"] = "";
        
        jQuery.ajax({
            method: "GET",
            url: "/web_api/variants/",
            data: params
        }).done(function(response) {
            var variants = response.Variants;
        
            var productSizes = {};
        
            for (var i = 0; i < variants.length; i++) {
                var variant = variants[i].Variant;
                var sku = variant.Sku;
        
                var productId = variant.product_id;
        
                if (!productSizes[productId]) {
                    productSizes[productId] = [];
                }
        
                var size = "";
        
                for (var j = 0; j < sku.length; j++) {
                    if (sku[j].type === "Tamanho") {
                        size = sku[j].value;
                        break; 
                    }
                }
        
                if (size && !productSizes[productId].includes(size)) {
                    productSizes[productId].push(size);
                }
            }
        
            for (var productIdToCheck in productSizes) {
                if (productSizes.hasOwnProperty(productIdToCheck)) {
                    var sizesList = productSizes[productIdToCheck];
            
                    if (sizesList.length > 0) {
                        console.log("Tamanhos do Produto " + productIdToCheck + ": " + sizesList.join(", "));
                        var sizesInfo = "";
            
                        // Criar um <span> para cada tamanho
                        for (var i = 0; i < sizesList.length; i++) {
                            sizesInfo += '<span class="variation-sizes_unidade">' + sizesList[i] + '</span>';
                        }
            
                        jQuery('.variation-sizes[data-product-id="' + productIdToCheck + '"]').html(sizesInfo);
                    } else {
                        console.log("Produto " + productIdToCheck + " não possui tamanhos disponíveis.");
                    }
                }
            }
            
        }).fail(function(jqXHR, status, errorThrown) {
            var response = $.parseJSON(jqXHR.responseText);
            console.log(response);
        });


// listar modal
var params = {};
params["attrs"] = "";

jQuery.ajax({
    method: "GET",
    url: "/web_api/variants/",
    data: params
}).done(function(response) {
    var variants = response.Variants;

    var productDimensions = {};

    for (var tamanho in variants[0].sku) {
        if (variants[0].sku.hasOwnProperty(tamanho)) {
            var variant = variants[0].sku[tamanho];

            if (variant.length && variant.width && variant.height) {
                var productId = variant.product_id;

                if (!productDimensions[productId]) {
                    productDimensions[productId] = {
                        length: variant.length,
                        width: variant.width,
                        height: variant.height
                    };
                }
            }
        }
    }

    for (var productIdToCheck in productDimensions) {
        if (productDimensions.hasOwnProperty(productIdToCheck)) {
            var dimensions = productDimensions[productIdToCheck];
            var length = dimensions.length;
            var width = dimensions.width;
            var height = dimensions.height;

            var dimensionsInfo = "Comprimento: " + length + "mm, Largura: " + width + "mm, Altura: " + height + "mm";
            jQuery('.product-dimensions[data-product-id="' + productIdToCheck + '"]').html(dimensionsInfo);
        }
    }
}).fail(function(jqXHR, status, errorThrown) {
    var response = $.parseJSON(jqXHR.responseText);
    console.log(response);
});

document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("openModalBtn");
    const modal = document.getElementById("myModal-medidas");
    const closeModalBtn = document.querySelector(".close");

    openModalBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});
