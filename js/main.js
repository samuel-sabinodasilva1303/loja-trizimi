(($) => {
    $.fn.changeElementType = function (newType) {
        var attrs = {};

        $.each(this[0].attributes, function (idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function () {
            return $('<' + newType + '/>', attrs).append($(this).contents());
        });
    };

    window.theme = {
        ...window.theme,

        settings: {
            lastScrollPosition: 0,
            storeId: 0,
            productThumbs: null,
            productGallery: null,
        },

        /* Beginning General Functions */
        minicart: function () {
            if ($('.minicart').length > 0) {
                const cart = {
                    icons: {
                        remove: '<svg xmlns=http://www.w3.org/2000/svg fill=none width=14 height=16 viewBox="0 0 14 16"><path d="M11.19 15.73H2.35a1.42 1.42 0 01-1.38-1.45V4.73h.96v9.55a.45.45 0 00.42.49h8.84a.45.45 0 00.41-.49V4.73h.97v9.55a1.42 1.42 0 01-1.38 1.45zM12.95 3.65H.48a.48.48 0 010-.97h12.47a.48.48 0 010 .97z"/><path d="M8.22 5.58h.96v7.25h-.96V5.58zM4.35 5.58h.97v7.25h-.97V5.58zM9.18 2.13h-.91v-.9h-3v.9h-.92v-.9a.97.97 0 01.92-.96h3a.97.97 0 01.91.96v.9z"/></svg>',
                    },
                    storeID: $('html').data('store'),
                    hash: null,
                    Products: null,
                    info: {},
                    currencyFormat: function (value) {
                        return new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(value);
                    },
                    session: function () {
                        return $('html').data('session');
                    },

                    minicartHide: function () {
                        $('.minicart').attr('aria-hidden', true);
                    },

                    minicartShow: function () {
                        $('.minicart').attr('aria-hidden', false);
                    },

                    showAmount: function () {
                        const { amount } = this.info;
                        $('[data-cart="amount"]').text(amount);
                    },

                    mountCart: function () {
                        $('.minicart__main').html('');

                        let template;

                        if (this.Products) {
                            template = '<ul class="minicart__list">';

                            this.Products.forEach(
                                ({
                                    product_id,
                                    bought_together_id,
                                    variant_id,
                                    product_name,
                                    product_image,
                                    product_url,
                                    quantity,
                                    price,
                                }) => {
                                    let ids = JSON.stringify({
                                        product_id,
                                        ...(variant_id > 0 && { variant_id }),
                                        ...(bought_together_id > 0 && { bought_together_id }),
                                    }).replaceAll('"', "'");
                                    template += '<li class="minicart__item">';
                                    template += '<a class="minicart__link" href="' + product_url.https + '">';
                                    template +=
                                        '<figure class="minicart__frame"><img src="' +
                                        product_image.https +
                                        '" alt="' +
                                        product_name +
                                        '" height="100" width="100" loading="lazy"/></figure>';
                                    template +=
                                        '<h3 class="minicart__info"><strong class="minicart__name">' +
                                        product_name +
                                        '</strong>';
                                    template +=
                                        '<span class="minicart__qty">Quantidade: ' +
                                        quantity +
                                        '</span><span class="minicart__price">' +
                                        this.currencyFormat(price) +
                                        '</span></h3>';
                                    template += '</a>';
                                    template +=
                                        '<button class="minicart__remove" data-remove-ids="' +
                                        ids +
                                        '" aria-label="Remover produto do minicart" type="button">' +
                                        this.icons.remove +
                                        '</button>';
                                    template += '</li>';
                                }
                            );

                            template += '</ul>';
                        } else {
                            template = '<span class="minicart__empty" >Carrinho Vazio!</span>';
                        }

                        $('.minicart__main').append(template);
                        $('.minicart_subprice .subprice').html('R$ ' + this.info.price);
                    },

                    updateCart: function () {
                        $.get('/nocache/app.php?loja=' + this.storeID)
                            .then((res) => JSON.parse(res))
                            .done(({ hash }) => {
                                cart.hash = hash;
                                $.get('/mvc/store/cart/count?loja=' + this.storeID + '&hash=' + hash).done(
                                    ({ cart: { price, amount } }) => {
                                        this.info = { price, amount };
                                        this.getCart();
                                        this.showAmount();
                                    }
                                );
                            });
                    },
                    addProduct: function (product_id, quantity = 1, variant_id = 0) {
                        $.ajax({
                            method: 'POST',
                            url: '/web_api/cart/',
                            contentType: 'application/json; charset=utf-8',
                            data:
                                '{"Cart":{"session_id":"' +
                                this.session() +
                                '","product_id":"' +
                                product_id +
                                '","quantity":"' +
                                quantity +
                                '","variant_id":"' +
                                variant_id +
                                '"}}',
                        })
                            .done(() => {
                                this.updateCart();
                                this.minicartShow();
                            })
                            .fail(function ({ status, statusText }) {
                                console.error('[AddProduct]', status, '[Message]', statusText);
                            });
                    },

                    addCart: function () {
                        $(document).ajaxComplete((event, xhr, settings) => {
                            settings.type === 'POST' &&
                                settings.url.indexOf('cart_preview') !== -1 &&
                                this.updateCart();
                        });
                    },

                    getCart: function () {
                        $.get('/web_api/cart/' + this.hash)
                            .done((res) => {
                                this.Products = res.map(({ Cart }) => Cart);
                            })
                            .then(() => this.mountCart())
                            .fail(({ status, statusText }) => {
                                this.Products = null;
                                status === 404 && this.mountCart();
                                status !== 404 && console.error('[Code]', status, '[Message]', statusText);
                            });
                    },

                    deleteItem: function (product_id, variant_id, bought_together_id) {
                        let query = variant_id > 0 ? `/${product_id}/${variant_id}` : `/${product_id}`;

                        $.ajax('/web_api/carts/' + this.hash + (bought_together_id > 0 ? '' : query), {
                            type: 'DELETE',
                        })
                            .done(() => this.updateCart())
                            .fail(function ({ status, statusText }) {
                                console.error('[Delete]', status, '[Message]', statusText);
                            });
                    },
                    init: function () {
                        this.updateCart();
                        this.addCart();
                    },
                };

                // cart.init();
                cart.mountCart();

                $('#cart').on('click', function (e) {
                    e.preventDefault();
                    cart.minicartShow();
                });

                $(document).on('click', '.minicart__close.minicart__close--header', function (e) {
                    e.preventDefault();
                    cart.minicartHide();
                });
                $(document).on('click', '.minicart__close.minicart__close--footer', function (e) {
                    e.preventDefault();
                    cart.minicartHide();
                });

                $(document).on('click', '.minicart[aria-hidden="false"]', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    const { target, currentTarget } = e;

                    target === currentTarget && cart.minicartHide();
                });

                $(document).on('click', '.minicart__remove', function (e) {
                    e.preventDefault();
                    const { product_id, variant_id, bought_together_id } = JSON.parse(
                        $(this).data('remove-ids').replaceAll("'", '"')
                    );
                    cart.deleteItem(product_id, variant_id, bought_together_id);
                    $(this).closest('li').slideToggle();
                });

                $('.product__button').on('click', function () {
                    const productId = $(this).data('id');
                    const productQuant = $(this).parent().find('.buy-button__qty--value').val();
                    const productVar = $(this).attr('data-variant');
                    const msgError = $(this).closest('.product-price').find('.error-variants');
                    if (productVar === '') {
                        msgError.html(
                            '<span id="span_erro_carrinho" class="blocoAlerta"> Selecione uma op&#231;&#227;o para varia&#231;&#227;o do produto </span>'
                        );
                        return setTimeout(() => {
                            msgError.empty();
                        }, 2000);
                    }

                    return cart.addProduct(productId, productQuant, productVar);
                });

                return {
                    cart,
                };
            }
            $('.swiper-button-disabled').remove();
        },
        backToTop: function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 600) {
                    $('#_backToTop').attr('data-show', 'true');
                } else {
                    $('#_backToTop').attr('data-show', 'false');
                }
            });

            $('#_backToTop').on('click', function () {
                $('html, body').animate({ scrollTop: 0 }, 800);
                return false;
            });
        },
        mainMenuMobile: function () {
            $('[data-toggle="account"]').on('click', function (event) {
                let item = $(this).parent();

                item.toggleClass('u-show');
                event.preventDefault();
            });

            $('.menuMobile .menu-button').on('click', function () {
                $(this).toggleClass('open');
                $(this).next().slideToggle();
            });
        },

        libMaskInit: function () {
            let phoneMaskBehavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            };

            let phoneMaskOptions = {
                onKeyPress: function (val, e, field, options) {
                    field.mask(phoneMaskBehavior.apply({}, arguments), options);
                },
            };

            $('.mask-phone').mask(phoneMaskBehavior, phoneMaskOptions);
            $('.mask-cep').mask('00000-000');
        },

        productSlides: function () {
            const targetElement = '[data-slides="product"]';

            $(targetElement).each(function () {
                var $section = $(this);
                var $showcase = $(this).find('.swiper').get(0);
                var perViews = $(this).data('col');
                var banner = $(this).data('banner');

                if (banner) {
                    new Swiper($showcase, {
                        loop: false,
                        lazy: {
                            loadPrevNext: true,
                        },
                        slidesPerView: 1.4,
                        spaceBetween: 10,
                        navigation: {
                            prevEl: $(this).find('.swiper_showcase-btn--prev').get(0),
                            nextEl: $(this).find('.swiper_showcase-btn--next').get(0),
                        },
                        breakpoints: {
                            542: {
                                slidesPerView: 2,
                            },
                            735: {
                                slidesPerView: 3,
                            },
                            786: {
                                slidesPerView: 1,
                            },
                            992: {
                                slidesPerView: 2,
                            },
                            1220: {
                                slidesPerView: 3,
                            },
                        },
                        on: {
                            init: function (swiper) {
                                const currentSlidesPerView =
                                    swiper.currentBreakpoint === 'max'
                                        ? swiper.passedParams.slidesPerView
                                        : swiper.passedParams.breakpoints[swiper.currentBreakpoint].slidesPerView,
                                    totalSlides = swiper.slides.length;

                                totalSlides > currentSlidesPerView
                                    ? swiper.$wrapperEl.hasClass('jcc') && swiper.$wrapperEl.removeClass('jcc')
                                    : !swiper.$wrapperEl.hasClass('jcc') && swiper.$wrapperEl.addClass('jcc');

                                $section.addClass('show');
                            },
                            beforeResize: function (swiper) {
                                const currentSlidesPerView =
                                    swiper.currentBreakpoint === 'max'
                                        ? swiper.passedParams.slidesPerView
                                        : swiper.passedParams.breakpoints[swiper.currentBreakpoint].slidesPerView,
                                    totalSlides = swiper.slides.length;

                                totalSlides > currentSlidesPerView
                                    ? swiper.$wrapperEl.hasClass('jcc') && swiper.$wrapperEl.removeClass('jcc')
                                    : !swiper.$wrapperEl.hasClass('jcc') && swiper.$wrapperEl.addClass('jcc');
                            },
                        },
                    });
                } else {
                    new Swiper($showcase, {
                        loop: false,
                        slidesPerView: 1.4,
                        spaceBetween: 10,
                        lazy: {
                            loadPrevNext: true,
                        },
                        navigation: {
                            prevEl: $(this).find('.swiper_showcase-btn--prev').get(0),
                            nextEl: $(this).find('.swiper_showcase-btn--next').get(0),
                        },
                        breakpoints: {
                            540: {
                                slidesPerView: 2,
                            },
                            735: {
                                slidesPerView: 3,
                            },
                            992: {
                                slidesPerView: perViews > 4 ? perViews - 1 : 4,
                            },
                            1235: {
                                slidesPerView: perViews,
                            },
                        },

                        on: {
                            init: function (swiper) {
                                const currentSlidesPerView =
                                    swiper.currentBreakpoint === 'max'
                                        ? swiper.passedParams.slidesPerView
                                        : swiper.passedParams.breakpoints[swiper.currentBreakpoint].slidesPerView,
                                    totalSlides = swiper.slides.length;

                                totalSlides > currentSlidesPerView
                                    ? swiper.$wrapperEl.hasClass('jcc') && swiper.$wrapperEl.removeClass('jcc')
                                    : !swiper.$wrapperEl.hasClass('jcc') && swiper.$wrapperEl.addClass('jcc');

                                $section.addClass('show');
                            },

                            beforeResize: function (swiper) {
                                const currentSlidesPerView =
                                    swiper.currentBreakpoint === 'max'
                                        ? swiper.passedParams.slidesPerView
                                        : swiper.passedParams.breakpoints[swiper.currentBreakpoint].slidesPerView,
                                    totalSlides = swiper.slides.length;

                                totalSlides > currentSlidesPerView
                                    ? swiper.$wrapperEl.hasClass('jcc') && swiper.$wrapperEl.removeClass('jcc')
                                    : !swiper.$wrapperEl.hasClass('jcc') && swiper.$wrapperEl.addClass('jcc');
                            },
                        },
                    });
                }
            });
        },

        productPromoSlides: function () {
            const targetElement = '[data-slides="productPromo"]';
            new Swiper(`${targetElement} .swiper`, {
                watchSlidesProgress: true,
                loop: false,
                allowTouchMove: true,
                lazy: {
                    loadPrevNext: true,
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    374: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    620: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    820: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                    },
                    1020: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    1220: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                },
                navigation: {
                    prevEl: '.slides-buttonPrev--product.allProducts ',
                    nextEl: '.slides-buttonNext--product.allProducts',
                },
                on: {
                    init: function () {
                        $(targetElement).addClass('show');
                    },
                },
            });
        },

        productMenuImage: function () {
            var productMenuImagem = "[data-slides='product-menu'].swiper";
            var widthScreen = parseInt(window.innerWidth);
            var productMenuImagem = document.querySelector(productMenuImagem);
            if (!!productMenuImagem && widthScreen < 5000) {
                new Swiper(productMenuImagem, {
                    watchSlidesProgress: true,
                    direction: 'horizontal',
                    effect: 'slide',
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    freeMode: false,
                    loop: true,
                    rewind: true,
                    lazy: true,
                    allowTouchMove: true,

                    on: {
                        init: function () {
                            productMenuImagem.classList.add('show');
                        },
                    },
                });
            }
        },
        getQuantityChangeOnProductPage: function () {
            const buttonQtd = $('[data-quantity]');

            //the quantity button will only be displayed if the single-click selling option is disabled and the product has no variations
            if (
                !$('[data-has-variations]')[0] ||
                ($('[data-buy-product="box"] div#quantidade label')[0] && !$('[data-has-variations]')[0])
            ) {
                $('[data-quantity]').addClass('u-show');
            }

            $(document).on('click', 'input[data-quantity]', function (event) {
                event.preventDefault();

                let inputQtd = $('[data-buy-product="box"] #quantidade input#quant');

                let valueQtd = parseInt(inputQtd.val());
                const operator = $(event.target).val();
                const number = parseInt(`${operator}1`);
                valueQtd += number;

                if (valueQtd < 1 || Number.isNaN(valueQtd)) {
                    inputQtd.val(1);
                } else {
                    inputQtd.val(valueQtd);
                }
            });
        },

        productReview: function () {
            /**Div produtos visitados */
            setTimeout(function () {
                $('.visitados_produtos div ul li').each(function () {
                    $(this).children('h3, span').wrapAll("<div class='product-visitade-main'></div>");
                });
            }, 1000);
        },
        generateShippingToProduct: function () {
            const shippingForm = $('[data-shipping="form"]');
            const resultBox = $('[data-shipping="result"]');
            console.log(shippingForm, 'primeiro')
            console.log(resultBox, 'segundo')

            shippingForm.on('submit', function (event) {
                event.preventDefault();
                let variant = $('#form_comprar').find('input[type="hidden"][name="variacao"]');
                let url = $('#shippingSimulatorButton').data('url');
                let inputQtd = $('#quant:visible');
                let cep = $('input', this).val().split('-');

                if (inputQtd.is(':visible')) {
                    inputQtd = inputQtd.val();
                }

                if (variant.length && variant.val() === '') {
                    resultBox
                        .addClass('loaded')
                        .html(
                            `<p class="error-block">Selecione um tamanho/cor para calcular o frete</p>`
                        );
                    return;
                }

                variant = variant.val() || 0;

                url = url
                    .replace('cep1=%s', `cep1=${cep[0]}`)
                    .replace('cep2=%s', `cep2=${cep[1]}`)
                    .replace('acao=%s', `acao=${variant}`)
                    .replace('dade=%s', `dade=${inputQtd}`);

                resultBox.removeClass('loaded').addClass('loading');

                function insertShippingInTable(shippingResult) {
                    shippingResult.find('table:first-child, p, table tr td:first-child').remove();
                    shippingResult
                        .find('table, table th, table td')
                        .removeAttr('align class width border cellpadding cellspacing height colspan');

                    shippingResult.find('table').addClass('shipping-table');

                    var frete = shippingResult.find('table th:first-child').text();
                    if (frete == 'Forma de Envio:') {
                        shippingResult.find('table th:first-child').html('Frete');
                    }

                    var valor = shippingResult.find('table th:nth-child(2)').text();
                    if (valor == 'Valor:') {
                        shippingResult.find('table th:nth-child(2)').html('Valor');
                    }

                    var prazo = shippingResult.find('table th:last-child').text();
                    if (prazo == 'Prazo de Entrega e Observa&ccedil;&otilde;es:') {
                        shippingResult.find('table th:last-child').html('Prazo');
                    }
                    shippingResult = shippingResult.children();
                }

                const errorMessage =
                    'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarte.';

                /* Validate zip code first using viacep web service */
                $.ajax({
                    url: `https://viacep.com.br/ws/${cep[0] + cep[1]}/json/`,
                    method: 'get',
                    dataType: 'json',
                    success: function (viacepResponse) {
                        if (viacepResponse.erro) {
                            const message = 'CEP inv&aacute;lido. Verifique e tente novamente.';
                            resultBox
                                .removeClass('loading')
                                .addClass('loaded')
                                .html(`<p class="error-block">${message}</p>`);

                            return;
                        }

                        $.ajax({
                            url: url,
                            method: 'get',
                            success: function (response) {
                                if (response.includes('N&atilde;o foi poss&iacute;vel estimar o valor do frete')) {
                                    resultBox
                                        .removeClass('loading')
                                        .addClass('loaded')
                                        .html(`<p class="error-block">${errorMessage}</p>`);

                                    return;
                                }

                                let shippingRates = $(response.replace(/Prazo de entrega: /gi, ''));
                                insertShippingInTable(shippingRates);

                                resultBox.removeClass('loading').addClass('loaded').html('').append(shippingRates);
                            },
                            error: function (request, status, error) {
                                console.error(`[Theme] Could not recover shipping rates. Error: ${error}`);

                                if (request.responseText !== '') {
                                    console.error(`[Theme] Error Details: ${request.responseText}`);
                                }

                                resultBox
                                    .removeClass('loading')
                                    .addClass('loaded')
                                    .html(`<p class="error-block">${errorMessage}</p>`);
                            },
                        });
                    },
                    error: function (request, status, error) {
                        console.error(`[Theme] Could not validate cep. Error: ${error}`);
                        console.error(`[Theme] Error Details: ${request.responseJSON}`);

                        resultBox
                            .removeClass('loading')
                            .addClass('loaded')
                            .html(`<p class="error-block">${errorMessage}</p>`);
                    },
                });

                return false;
            });
        },
        organizeProductPage: function () {
            /**Border info product */
            if ($('#produto_preco .color').length > 0) {
                $('.pageProduct-outOfStock .produto-preco #preco').css({
                    border: ' 1px solid var(--c_general_main)',
                    'background-color': 'var(--c_product_progressive_bg)',
                });
            }

            const additionalFieldSelector = $('.varCont .dd .ddTitle');
            $(document).on('click', '.varCont .dd', function () {
                $(this).toggleClass('active');
            });

            additionalFieldSelector.attr('tabindex', 0);
        },

        closeSelectorBoxProductPage: function () {
            var closeSelectorBox = jQuery('.varCont .dd .ddChild');

            if (closeSelectorBox && closeSelectorBox[0]) {
                closeSelectorBox[0].style.display = 'none';
            }
        },

        adjustOpenTabs: function (content, linksDesk, linksMobile) {
            jQuery('.pageProduct-measures').hide();

            jQuery('.nav-link.measures').on('click', function () {
                if (jQuery(this).hasClass('active')) {
                    jQuery('.pageProduct-measures').toggle();
                } else {
                    jQuery('.pageProduct-measures').hide();
                }
            });

            const openContent = $('.tabs .tabs-content.active');

            if ($(window).width() < 768 && openContent.length > 0) {
                openContent.hide().removeClass('active');
                linksDesk.removeClass('active');
                linksMobile.removeClass('active');
                content.slideUp().removeClass('active');
            } else if ($(window).width() >= 768) {
                const firstLink = linksDesk.first();
                const target = firstLink.attr('href').split('#')[1];

                openContent.hide().removeClass('active');
                firstLink.addClass('active');
                linksMobile.removeClass('active');
                $(`#${target}`).show().addClass('active');
            }
        },

        goToProductReviews: function () {
            var avaliacaoProduto = document.querySelector('#form-comments');
            var adjust = 0;

            if ($(window).width() < 768) {
                adjust = 60;
            } else {
                adjust = 120;
            }

            $('.rating-message').on('click', function () {
                avaliacaoProduto.scrollIntoView({ behavior: 'smooth' }) + adjust;
            });
        },

        chooseProductReview: function () {
            $('#form-comments .rateBlock .starn').on('click', function () {
                const message = $(this).data('message');
                const rating = $(this).data('id');

                $(this).parent().find('#rate').html(message);
                $(this).closest('form').find('#nota_comentario').val(rating);

                $(this).parent().find('.starn').removeClass('icon-star');

                $(this).prevAll().addClass('icon-star');

                $(this).addClass('icon-star');
            });
        },

        sendProductReview: function () {
            $('#form-comments').on('submit', function (event) {
                const form = $(this);

                $.ajax({
                    url: form.attr('action'),
                    method: 'post',
                    dataType: 'json',
                    data: form.serialize(),
                    success: function (response) {
                        form.closest('.tabs-content.comments').find('.blocoAlerta').hide();
                        form.closest('.tabs-content.comments').find('.blocoSucesso').show();

                        setTimeout(function () {
                            form.closest('.tabs-content.comments').find('.blocoSucesso').hide();
                            $('#form-comments #mensagem_coment').val('');

                            form.find('#nota_comentario').val('');
                            form.find('#rate').html('');

                            form.find('.starn').removeClass('icon-star');
                        }, 8000);
                    },
                    error: function (response) {
                        const error = JSON.stringify(response);

                        form.closest('.tabs-content.comments').find('.blocoSucesso').hide();
                        form.closest('.tabs-content.comments').find('.blocoAlerta').html(error).show();
                    },
                });

                event.preventDefault();
            });
        },

        reviewsOnProductPage: function () {
            let commentsBlock = $(`<div class="tabs-reviews">${window.commentsBlock}</div>`);
            const buttonReview =
                '<button type="submit" class="submit-review button2">Enviar Avalia&ccedil;&atilde;o</button>';
            const star = '<span class="icon-star" aria-hidden="true"></span>';
            const starEmpty = '<span class="icon-star-empty" aria-hidden="true"></span>';

            commentsBlock.find('.hreview-comentarios + .tray-hide').remove();

            $.ajax({
                url: '/mvc/store/greeting',
                method: 'get',
                dataType: 'json',
                success: function (response) {
                    if (!Array.isArray(response.data)) {
                        commentsBlock.find('#comentario_cliente form.tray-hide').removeClass('tray-hide');

                        commentsBlock.find('#form-comments #nome_coment').val(response.data.name);
                        commentsBlock.find('#form-comments #email_coment').val(response.data.email);

                        commentsBlock.find('#form-comments [name="ProductComment[customer_id]"]').val(response.data.id);
                    } else {
                        commentsBlock.find('#comentario_cliente a.tray-hide').removeClass('tray-hide');
                    }

                    $('#tray-comment-block').before(commentsBlock);

                    $('#form-comments #bt-submit-comments').before(buttonReview).remove();

                    $('.ranking .rating').each(function () {
                        let review = Number(
                            $(this)
                                .attr('class')
                                .replace(/[^0-9]/g, '')
                        );

                        for (let i = 1; i <= 5; i++) {
                            if (i <= review) {
                                $(this).append(star);
                            } else {
                                $(this).append(starEmpty);
                            }
                        }
                    });

                    $('#tray-comment-block').remove();

                    theme.chooseProductReview();
                    theme.sendProductReview();
                },
            });
        },

        buyTogetherOnProductPage: function () {
            const boxImages = $('.compreJunto form .fotosCompreJunto');
            const image = $('.compreJunto .produto img');
            const qtd = $('.compreJunto .precoCompreJunto .unidades_preco .unidades_valor');
            const spansLinksRemove = $(
                '.compreJunto .precoCompreJunto div:first-child> span, .compreJunto .precoCompreJunto div:first-child> a, .compreJunto .precoCompreJunto div:first-child > br'
            );
            let listQtd = [];

            boxImages.append('<div class="plus color to">=</div>');

            qtd.each(function () {
                const value = $(this).text();
                listQtd.push(value);
            });


            image.each(function (index) {
                const link = $(this).parent().attr('href') || '';
                const name = $(this).attr('alt');

                $(this).addClass('buyTogether-img lazyload');

                if (link !== '') {
                    $(this).unwrap();
                    $(this).parents('span').after(`<a class="buyTogether-nameProduct" href="${link}">${name}</a>`);
                } else {
                    $(this).parents('span').after(`<p class="buyTogether-nameProduct">${name}</p>`);
                }

                if (listQtd[index] == 1) {
                    $(this).after(`<p class="buyTogether-text">${listQtd[index]} unidade</p>`);
                } else {
                    $(this).after(`<p class="buyTogether-text">${listQtd[index]} unidades</p>`);
                }
            });

            boxImages.each(function () {
                if (window.innerWidth > 768) {
                    const observer = new ResizeObserver((entries) => {
                        const { contentRect } = entries[0];
                        $(this).parent().find('.wrapper-plus').css({ height: contentRect.height });
                    });

                    observer.observe(jQuery(this).get(0));
                }
            });

            $('.pageProduct-buyTogether').removeClass('tray-hide');
        },

        tabNavigationOnProductPage: function () {
            'use strict';

            const tabsContent = document.querySelectorAll('.product-tabs__content[data-action-url]'),
                tabsCustom = document.querySelectorAll('#hidden_tab > [id]');

            tabsContent.forEach(async (content) => {
                const url = content.dataset.actionUrl,
                    html = await renderHTMLByContentUrl(url);

                content.innerHTML = html;

                if (url.indexOf('/payment_options') !== -1) paymentsMethodsRestructuring();
            });

            tabsCustom.forEach((custom) => {
                const targetId = custom.id.replace('AbaPersonalizadaConteudo', 'AbaPersonalizadaLink');
                custom.removeAttribute('class');
                custom.removeAttribute('style');
                document
                    .getElementById(targetId)
                    .insertAdjacentElement('afterbegin', custom.querySelector(':scope > div'));
            });

            async function renderHTMLByContentUrl(url) {
                let html = null;
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'X-Requested-With': 'XMLHttpRequest' },
                    });

                    if (!response.ok) {
                        throw response;
                        return null;
                    }
                    const data = await response.arrayBuffer();

                    const decoder = new TextDecoder('iso-8859-1');

                    html = decoder.decode(data);
                } catch ({ status, statusText }) {
                    console.error('[Error]:', status, ' - ', statusText);
                    html = 'Error';
                }
                return html;
            }

            function paymentsMethodsRestructuring() {
                const elem = document.querySelector('.product-tabs__content #atualizaFormas'),
                    parentElem = elem.closest('.product-tabs__content');
                if (!elem) return null;
                elem.querySelectorAll('table').forEach((table) => {
                    const imgEl = table.querySelector('img'),
                        parentTd = imgEl.parentElement,
                        parentTable = table.parentElement,
                        wrapperEl = document.createElement('DIV');

                    parentTable.querySelector(':scope > a[id]').insertAdjacentElement('afterbegin', imgEl);
                    table.querySelectorAll('[width]').forEach((td) => td.removeAttribute('width'));
                    wrapperEl.insertAdjacentElement('afterbegin', table);
                    parentTable.insertAdjacentElement('beforeend', wrapperEl);
                    parentTd.remove();
                    parentElem.innerHTML = '';
                    parentElem.insertAdjacentElement('afterbegin', elem);
                });
            }

            async function changePaymentMethods() {
                const variantId = +document.getElementById('selectedVariant').value,
                    elem = document.querySelector('[data-action-url*="payment_options"]');

                if (!elem || !variantId) return null;
                const indexVarId = elem.dataset.actionUrl.indexOf('IdVariacao=') + 'IdVariacao='.length,
                    currentId = +elem.dataset.actionUrl.slice(indexVarId),
                    url = elem.dataset.actionUrl.slice(0, indexVarId);

                if (currentId === variantId) return null;

                const newUrl = url + variantId,
                    newHtml = await renderHTMLByContentUrl(newUrl);

                elem.innerHTML = newHtml;

                paymentsMethodsRestructuring();
            }

            document.getElementById('hidden_tab').remove();

            jQuery('.product-tabs__link').on('click', function (e) {
                e.preventDefault();
                jQuery(this).toggleClass('hide');
                jQuery(this).parent().next().slideToggle();
            });

            jQuery(document).on('click', '#atualizaFormas a[id]', function () {
                jQuery(this).toggleClass('open');
                jQuery(this).next().slideToggle();
            });

            listenerAjaxRequest('/variant_price/', changePaymentMethods);

            return null;
            const ul = $('#caracteristicas ul');
            $('#caracteristicas > li').each(function () {
                ul.append($(this));
            });

            const internal = this;
            const customTab = $('tabs-navMobile[href*="AbaPersonalizada"]');
            const urlTabs = $('.pageProduct .tabs .tabs-content[data-url]');
            const linkNavTabs = $('.pageProduct .tabs-nav .nav-link');
            const linkNavMobileTabs = $('.pageProduct .tabs .tabs-navMobile');
            const content = $('.pageProduct .tabs .tabs-content');
            const itemNavDesktopTabs = $('.pageProduct-tabs .tabs-nav.u-desktop');

            itemNavDesktopTabs.find('.nav-list').append('<li class="nav-corridor"><span></span></li>');

            customTab.each(function () {
                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                $(target).detach().insertAfter(this);
            });

            urlTabs.each(function () {
                let tab = $(this);
                let url = tab.data('url');

                $.ajax({
                    url: url,
                    method: 'get',
                    success: function (response) {
                        tab.html(response);
                        $('#atualizaFormas li table').css('display', 'none');
                        openPaymentMethod();
                    },
                });
            });

            const openPaymentMethod = () => {
                $('#formasPagto #linkPagParcelado').remove();

                return $('#atualizaFormas li a').on('click', function () {
                    $(this).toggleClass('u-visible');
                });
            };

            linkNavTabs.on('click', function (event) {
                const tabs = $(this).closest('.pageProduct-tabs');

                if (!$(this).hasClass('active')) {
                    let target = $(this).attr('href').split('#')[1];
                    target = $(`#${target}`);

                    $(linkNavTabs, tabs).removeClass('active');
                    $(this).addClass('active');
                    $(content, tabs).fadeOut();

                    setTimeout(function () {
                        target.fadeIn();
                    }, 300);
                }

                event.preventDefault();
                event.stopPropagation();
                return false;
            });

            linkNavMobileTabs.on('click', function (event) {
                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    target.removeClass('active').slideUp();
                } else {
                    linkNavMobileTabs.removeClass('active');
                    content.removeClass('active').slideUp();

                    $(this).addClass('active');
                    target.addClass('active').slideDown();
                }

                event.preventDefault();
                event.stopPropagation();
                return false;
            });

            internal.adjustOpenTabs(content, linkNavTabs, linkNavMobileTabs);

            $(window).on('resize', function () {
                internal.adjustOpenTabs(content, linkNavTabs, linkNavMobileTabs);
            });

            function corridorAnimation(target) {
                const a = $(target).offset();
                const b = $(target).innerWidth();
                const c = b / 2 + a.left;
                const d = $(target).closest('.u-desktop').width();
                const f = $('body').width();
                const g = Math.abs((d - f) / 2);
                const h = $(target).innerWidth() * 0.75;
                const i = Math.abs(g - c);
                const j = i - h / 2;
                itemNavDesktopTabs.find('.nav-list > .nav-corridor > span').css({ width: h + 'px', left: j + 'px' });
            }

            itemNavDesktopTabs.find('.nav-list > .nav-item').on('mouseenter mouseout', function (e) {
                e.type === 'mouseenter' && corridorAnimation($(this));
                e.type === 'mouseout' &&
                    $(this).find('.active').length < 1 &&
                    corridorAnimation($(this).parent().find('.active').closest('.nav-item'));
            });

            window.innerWidth > 768 &&
                corridorAnimation(itemNavDesktopTabs.find('.nav-list .active').closest('.nav-item'));
        },

        variantImagesUpdate: function () {
            return null;

            async function promiseProductVariantImage(id) {
                let urlImageAux = '';
                let url = `/web_api/variants/${id}`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Erro na requisição');
                    }

                    const data = await response.json();
                    const urls = data.Variant.VariantImage;
                    urlImageAux = urls;

                    return urlImageAux;
                } catch (error) {
                    console.error('Erro:', error);
                    throw error;
                }
            }
            async function updateProductVariantImage(dataId) {
                const newImageUrls = await promiseProductVariantImage(dataId);

                LoadImages(newImageUrls);
            }

            function LoadImages(urls) {
                const thumbSwiper = theme.settings.productThumbs;
                const galerySwiper = theme.settings.productGallery;

                const productContainer = $('.product-container');

                productContainer.empty();

                const wrapperGalerry = galerySwiper.wrapperEl;
                const zoom = wrapperGalerry.getAttribute('data-zoom');

                while (thumbSwiper.slides.length > 0 || galerySwiper.slides.length > 0) {
                    thumbSwiper.removeSlide(0);
                    galerySwiper.removeSlide(0);
                }

                urls.forEach(function (url) {
                    if (zoom === 'onZoom') {
                        var gallerySlide = `<div class="swiper-slide gallery-image" data-gallery="image" >
                                                <figure class="goOnZoom " id="goOnZoom" onmousemove="zoom(event)" >
                                                    <img id="imageZoom" class="gallery-img" src="${url.https}" alt="Imagem da Varia&#x00E7;&#x00E3;o"/>
                                                </figure>
                                            </div>`;
                    } else {
                        var gallerySlide = `<div class="swiper-slide gallery-image" data-gallery="image">
                                                <img class="gallery-img" src="${url.https}" alt="Imagem da Varia&#x00E7;&#x00E3;o"/>
                                            </div>`;
                    }
                    galerySwiper.appendSlide(gallerySlide);

                    var thumbSlide = `<div class="swiper-slide gallery-thumb" data-gallery="image">
                                            <img class="gallery-img" src="${url.https}" alt="Imagem da Variação" width="83px" height="83px" />
                                        </div>`;
                    thumbSwiper.appendSlide(thumbSlide);
                });

                galerySwiper.update();
                thumbSwiper.update();
            }

            // Chamar as functions
            const productVariationBox = $('.pageProduct-variants');
            productVariationBox.on('click', '.lista_cor_variacao li[data-id]', function () {
                let dataId = $(this).data('id');
                if (dataId) {
                    var urls = updateProductVariantImage(dataId);
                }
            });

            productVariationBox.on('click', '.lista-radios-input', function () {
                let dataId = $(this).find('input').val();
                if (dataId) {
                    var urls = updateProductVariantImage(dataId);
                }
            });

            productVariationBox.on('change', 'select', function () {
                let dataId = $(this).val();
                if (dataId) {
                    var urls = updateProductVariantImage(dataId);
                }
            });

            setTimeout(() => {
                $('.varCont .dd .ddChild .enabled').on('click', function () {
                    let selected = jQuery('.varCont .dd .ddChild .enabled.selected img');
                    let newImageUrls = [{ https: selected[0].src }];
                    LoadImages(newImageUrls);
                });
            }, 200);
        },

        variantSpot: function () {
            $('.product-variations-colors-content li').on('click', function () {
                let newImageSpot = $('.img-variants-id').attr('src');
                let imgPrincipal = $('.product-image > a > img');

                imgPrincipal.append('src', newImageSpot);
            });
        },

        variantsSwipper: function () {
            const targetElement = '[data-slides="variants-home"]';

            new Swiper(`${targetElement} .swiper`, {
                watchSlidesProgress: true,
                loop: false,
                slidesPerView: 2,
                spaceBetween: 10,
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    420: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    620: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    820: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    1020: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                    },
                    1220: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                    },
                },
                navigation: {
                    prevEl: '.segmentation-arrows.slides-buttonPrev--variants',
                    nextEl: '.segmentation-arrows.slides-buttonNext--variants',
                },
                on: {
                    init: function () {
                        $(targetElement).addClass('show');
                    },
                },
            });
        },

        variationOpenScope: function () {
            $(document).ready(function () {
                var valorCor = $('#vars0').text().trim();
                $('#opcoes0 .labelMultiVariacao').each(function () {
                    if ($(this).find('input[type="checkbox"]').length === 0) {
                        $(this).text(valorCor + ' ' + $(this).text().trim());
                    }
                });
            });
        },

        variationOpenScopeMulti: function () {
            if ($('div#quantidade label').length == 0) {
                $('#quantidade').css('display', 'none');
            }
        },

        variationOpenScopeKit: function () {
            $(document).ready(function () {
                $('.varTit').each(function () {
                    var valorCor = $(this).text().trim();

                    var varCont = $(this).siblings('.varCont');

                    varCont.find('ul li label span').each(function () {
                        if ($(this).closest('li').hasClass('color')) {
                            $(this).prepend(valorCor + ' ');
                        }
                    });
                });
            });
        },

        arrowsHide: function () {
            $('.lista_cor_variacao li').on('click', function () {
                var aLength = $('.pageProduct-gallery .gallery-thumbs .swiper-wrapper').length;
                if (aLength < 6) {
                    $('.pageProduct-gallery .slides-buttonNext--gallery').remove();
                    $('.pageProduct-gallery .slides-buttonPrev--gallery').remove();
                    $('.pageProduct-gallery .gallery-thumbs').addClass('noArrows');
                }
            });
        },

        processRteVideoAndTable: function () {
            $(`.col-panel .tablePage,
                .page-extra .page-content table,
                .page-extras .page-content table,
                .board_htm table,
                .rte table,
                .page-noticia table
            `).wrap('<div class="table-overflow"></div>');

            $(`.page-noticia iframe[src*="youtube.com/embed"],
                .page-noticia iframe[src*="player.vimeo"],
                .board_htm iframe[src*="youtube.com/embed"],
                .board_htm iframe[src*="player.vimeo"],
                .rte iframe[src*="youtube.com/embed"],
                .rte iframe[src*="player.vimeo"]
            `).wrap('<div class="rte-video-wrapper"></div>');
        },

        insertBreadcrumbNavigationInPage: function (local = '', customName = false) {
            let items;
            let breadcrumb = '';
            let pageName = document.title.split(' - ')[0].split(' | ')[0];

            if (local === 'listNews') {
                if (!window.location.href.includes('busca_noticias')) {
                    items = [
                        { text: 'Home', link: '/' },
                        { text: 'Not&iacute;cias', link: '/noticias' },
                    ];
                } else {
                    items = [
                        { text: 'Home', link: '/' },
                        { text: 'Not&iacute;cias', link: '/noticias' },
                        { text: 'Todas as Not&iacute;cias', link: '/busca_noticias' },
                    ];
                }
            } else if (local === 'news') {
                items = [
                    { text: 'Home', link: '/' },
                    { text: 'Not&iacute;cias', link: '/noticias' },
                    { text: pageName },
                ];
            } else if (local === 'wishlist') {
                items = [
                    { text: 'Home', link: '/' },
                    { text: 'Lista de Desejos', link: '/listas' },
                ];
            } else if (local != '' && customName === true) {
                items = [{ text: 'Home', link: '/' }, { text: local }];
            } else {
                items = [{ text: 'Home', link: '/' }, { text: pageName }];
            }

            $.each(items, function (index, item) {
                if (this.link) {
                    breadcrumb += `
                        <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <a itemprop="item" class="breadcrumb-link" href="${item.link}">
                                <span itemprop="name">${item.text}</span>
                            </a>
                            <meta itemprop="position" content="${index + 1}" />
                        </li>
                        `;
                } else {
                    breadcrumb += `
                        <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <span itemprop="name">${item.text}</span>
                            <meta itemprop="position" content="${index + 1}" />
                        </li>
                    `;
                }
            });

            $('.default-content > .container').prepend(`
                <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumb}
                </ol>
            `);
        },

        toggleShowReviewsForm: function () {
            let item = $('[data-toggle="reviews"]').parent();
            item.toggleClass('u-show');
        },

        validateFormFieldsToSendCustomerReview: function () {
            const formToSendReview = $('.page-depoimentos .container3 #depoimento');
            const buttonToSendReview = $('.page-depoimentos .container3 #depoimento .btn_submit');

            formToSendReview.validate({
                rules: {
                    nome_depoimento: {
                        required: true,
                    },
                    email_depoimento: {
                        required: true,
                        email: true,
                    },
                    msg_depoimento: {
                        required: true,
                    },
                    input_captcha: {
                        required: true,
                    },
                },
                messages: {
                    nome_depoimento: {
                        required: 'Por favor, informe seu nome completo',
                    },
                    email_depoimento: {
                        required: 'Por favor, informe seu e-mail',
                        email: 'Por favor, preencha com um e-mail v&aacute;lido',
                    },
                    msg_depoimento: {
                        required: 'Por favor, escreva uma mensagem no seu depoimento',
                    },
                    input_captcha: {
                        required: 'Por favor, preencha com o c&oacute;digo da imagem de verifica&ccedil;&atilde;o',
                    },
                },
                errorElement: 'span',
                errorClass: 'error-block',
            });

            buttonToSendReview.on('click', function () {
                const button = $(this);

                if (formToSendReview.valid()) {
                    button.html('Enviando...').attr('disabled', true);
                }
            });


            let target = $('#aviso_depoimento').get(0);
            let config = { attributes: true };

            let observerReviewMessage = new MutationObserver(function () {
                buttonToSendReview.html('Enviar Depoimento').removeAttr('disabled');
            });

            observerReviewMessage.observe(target, config);
        },

        organizeContactUsPage: function () {
            const textPageContact = $('.page-contact .default-content > .container');
            const buttonPageContact = $('.page-contact #btn_submit img.image');
            const inputTelPageContact = $('.page-contact #telefone_contato');
            const textEmailPageContact = $('.page-contact .email-texto');
            const tel01PageContact = $('.page-contact .contato-telefones .block:nth-child(1)');
            const tel02PageContact = $('.page-contact .contato-telefones .block:nth-child(2)');

            textPageContact.prepend(`
                <h1>Fale conosco</h1>
                <p class="contactUs-description">Precisa falar com a gente? Utilize uma das op&ccedil;&otilde;es abaixo para entrar em contato conosco.</p>
            `);
            buttonPageContact.parent().text('Enviar Mensagem').addClass('button2').children().remove();
            inputTelPageContact.removeAttr('onkeypress maxlength').addClass('mask-phone');
            textEmailPageContact.parent().wrap('<div class="contactUs-email"></div>');

            if (tel01PageContact.length) {
                let phoneNumberFormatted = tel01PageContact.text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                tel01PageContact.unwrap().parent().addClass('contactUs-phone')
                    .html(`<h3>Central de Atendimento ao Cliente</h3>
                    <a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberFormatted}</a>`);
            }

            if (tel02PageContact.length) {
                let phoneNumberFormatted = tel02PageContact.text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                tel02PageContact
                    .wrap('<div class="contactUs-whats"></div>')
                    .parent()
                    .insertAfter('.page-contact .contactUs-phone').html(`<h3>WhatsApp</h3>
                        <a target="_blank" tray-wp rel="noopener noreferrer" href="https://api.whatsapp.com/send?l=pt&phone=55" title="Fale conosco no WhatsApp"></a>`);
            }
        },

        validateFormFieldsToSendContactEmail: function () {
            const formToSendContact = $('.page-contact .container2 .formulario-contato');
            const buttonToSendContact = $('.page-contact .container2 .formulario-contato .btn_submit');

            formToSendContact.validate({
                rules: {
                    nome_contato: {
                        required: true,
                    },
                    email_contato: {
                        required: true,
                        email: true,
                    },
                    mensagem_contato: {
                        required: true,
                    },
                },
                messages: {
                    nome_contato: {
                        required: 'Por favor, informe seu nome completo',
                    },
                    email_contato: {
                        required: 'Por favor, informe seu e-mail',
                        email: 'Por favor, preencha com um e-mail v&aacute;lido',
                    },
                    mensagem_contato: {
                        required: 'Por favor, escreva uma mensagem para entrar em contato',
                    },
                },
                errorElement: 'span',
                errorClass: 'error-block',
            });
            buttonToSendContact.on('click', function () {
                const button = $(this);

                if (formToSendContact.valid()) {
                    button.html('Enviando...').attr('disabled', true);
                }
            });
        },

        organizeNewsletterRegistrationPage: function () {
            if ($('.page-newsletter .formulario-newsletter').length) {
                $(
                    '.page-newsletter .formulario-newsletter .box-captcha input, .page-newsletter .formulario-newsletter .box-captcha-newsletter input'
                )
                    .attr('placeholder', 'Digite o c&oacute;digo ao lado')
                    .trigger('focus');
                $('.formulario-newsletter .newsletterBTimg').html('Enviar').removeClass().addClass('button2');
            } else {
                $('.page-newsletter .default-content').addClass('success-message-newsletter');
                $('.page-newsletter .default-content.success-message-newsletter .board p:first-child a')
                    .addClass('button2')
                    .html('Voltar para p&aacute;gina inicial');
            }

            setTimeout(function () {
                $('.page-newsletter .default-content').addClass('u-show');
            }, 200);
        },

        organizeNewsPage: function () {
            const titleButtonPage = $('.page-busca_noticias #listagemCategorias b');
            if (!window.location.href.includes('busca_noticias')) {
                titleButtonPage.replaceWith('<h1>Not&iacute;cias</h1>');
            }
        },

        organizePagesTray: function () {
            const login = $('.caixa-cadastro #email_cadastro');
            const buttonReviewPage = $('.page-depoimentos .container .btn_submit');
            const titleReviewPage = $('.page-depoimentos .container #comentario_cliente');
            const buttonAdvancedSearch = $('.page-search #Vitrine input[type="image"]');

            login.attr('placeholder', 'Digite seu e-mail*');
            buttonReviewPage.html('Enviar Depoimento').addClass('button2 review-button');
            titleReviewPage.prepend(
                '<button class="review-form" data-toggle="reviews">Deixe seu depoimento sobre n&#x00F3;s <span class="icon-arrow-simple" aria-hidden="true"></span></button>'
            );
            buttonAdvancedSearch.after('<button type="submit" class="button2">BUSCAR</button>');
            buttonAdvancedSearch.remove();
        },

        navMenu: function () {
            return null;
            const headerHeight = document.querySelector('header').offsetHeight;

            document.querySelector('main.default-main').style.setProperty('--pt', `${headerHeight}px`);

            if (window.innerWidth > 768) {
                const dropdown = $('.header-account .loggedout');
                const ww = window.innerWidth;
                const dl = dropdown.offset().left;
                const dw = dropdown.outerWidth();
                const dif = dl + dw >= ww ? Math.abs(dl + dw - ww + 18).toFixed(2) : false;
                dif && dropdown.css({ '--dif': dif + 'px' });
            }
        },
        reguaSlide: function () {
            var swiper = new Swiper('.swiper-container.regua', {
                slidesPerView: 1,
                spaceBetween: 10,
                breakpoints: {
                    640: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 20
                    }
                },
                loop: false,
            });
        },
        customizationProductPage: function () {
            $('.product-variations').each(function () {
                if ($(this).find('ul').length == 0) {
                    $(this).remove();
                    $('.related-item > .product').css({ 'min-height': '550px', 'max-height': '550px' });
                    $('.pageProduct-related .related-item .product-info span .product__buttons').css({ top: '26em' });
                    $('.product-button').remove();
                }
            });
            setTimeout(function () {
                $('.pageProduct-lastSeen .lastSeen-list #produtos li .product-visitade-main .ValoresLista').css(
                    'display',
                    'block'
                );
                $('.pageProduct-lastSeen .lastSeen-list #produtos li').css('display', 'flex');
            }, 2000);
            $('.product-visitade-main .ValoresLista .precode').remove();
            setTimeout(function () {
                $('#produtos ul').each(function () {
                    $(this)
                        .find('.txt-corparcelas, .preco-de, .txt-cadaparcelas, .operadora, .txt-forma-pagamento')
                        .slice(5)
                        .remove();
                });
            }, 1000);

            const more = $('.pageProduct-buy').find('.more').clone(true, true);
            const less = $('.pageProduct-buy').find('.less').clone(true, true);

            function appendMoreAndLess() {
                if ($.contains($('#quantidade').get(0), $('#more').get(0))) {
                    return false;
                }

                $('.pageProduct-buy').find('#less,#more').remove();

                $('#quantidade').append(more, less);
            }

            $(document).ajaxComplete(function (event, request, settings) {
                settings.url.indexOf('/variant_form') !== -1 && appendMoreAndLess();
            });

            $('#quantidade').append($('.pageProduct-buy').find('.less,.more'));

            $('input#email_avise').attr('placeholder', 'Seu e-mail');

            var qtdValidate = $('#quantidade');
            if (qtdValidate.length == 0) {
                $('.buy-quantityTop').remove();
                $('.buy-quantityDown').remove();
            }
        },

        imgNewsDefault: function () {
            $('#noticia_imagem > a > img').each(function () {
                var noImage = String($(this).attr('src'));
                var linkImage = $('body').attr('data-imgOffNews');
                if (noImage.includes('imgoff')) {
                    $(this).attr('src', linkImage);
                }
            });
        },

        process: function () {
            if ($('.buy-button').length > 0) {
                window.process = function (quant) {
                    var value = parseInt(document.getElementById('quant').value);
                    value += quant;
                    if (value < 1) {
                        document.getElementById('quant').value = '01';
                    } else {
                        document.getElementById('quant').value = String(value).padStart(2, '0');
                    }
                };
            }
        },

        productSpotQuickBuy: function () {
            'use strict';

            const hasQuickBuy = document.querySelector('.product-actions--quick-buy');

            if (!hasQuickBuy) return null;

            console.info('%c[Quick Buy Activated]', 'color: #e8de35; font-weight: bold; background: #1d1d1d;');

            const buyButtons = document.querySelectorAll('button.product-actions__btn--buy:not([onclick])'), // product kit that has the attribute onclik
                selectcsVariations = document.querySelectorAll('select.product-variations__select'),
                colorsVariations = document.querySelectorAll('span.product-variations__color-item:not(.no-stock)'),
                colorsSwiper = document.querySelectorAll('.product-variations__color[data-swiper="true"]');

            window.handleQuantity = (elem, value) => {
                const parent = elem.parentElement,
                    input = parent.querySelector('input[type="number"]'),
                    maxValue = +input.getAttribute('max'),
                    currentValue = +input.value,
                    sum = currentValue + +value,
                    newValue = !maxValue ? sum : sum <= 0 ? 1 : sum > maxValue ? maxValue : sum;

                sum > maxValue && popupMessage(parent, 'Limite m\u00e1ximo atingido!');

                input.value = newValue;
            };

            colorsVariations.forEach((item) => item.addEventListener('click', handleEvent, false));

            selectcsVariations.forEach((select) => select.addEventListener('change', handleEvent, false));

            buyButtons.forEach((button) => button.addEventListener('click', handleBuy, false));

            colorsSwiper.forEach((swiper) => initColorSlider(swiper));

            function handleEvent(e) {
                const { currentTarget: target } = e;
                const tag = target.tagName;
                const data = JSON.parse(
                    target.closest('.product-variations').querySelector('script[data-options]').textContent
                );

                const varName = tag === 'SELECT' ? target.value : tag === 'SPAN' ? target.dataset.value : null;

                actionVariations({ name: varName, tag, target, data });
            }

            function actionVariations(options = {}) {
                const { name, tag, target, data } = options;

                const filter = dataFilter(data, name);

                const nextElem = target.nextElementSibling ?? false;

                const nextTag = nextElem && nextElem.tagName;

                tag === 'SPAN' && variationColors(target);

                filter.constructor.name === 'Object' && variationSetup(filter, target);

                nextElem && filter.constructor.name === 'Array' && renderSecondaryVariation(nextElem, nextTag, filter);
            }

            function variationSetup(options, target) {
                const parent = target.closest('.product');

                const {
                    id,
                    stock,
                    prices: { old, current, payments },
                } = options;
                const inputQty = parent.querySelector('.product-actions__qty--input');

                const templatePrice = `${old ? '<s>de: ' + old + '<s/>' : ''
                    }<span class="product-price__current">Por: <em>${current}</em></span>`;

                inputQty.getAttribute('max') && +inputQty.value > stock && (inputQty.value = stock);

                inputQty.getAttribute('max') && inputQty.setAttribute('max', stock);

                parent.querySelector('.product-price').innerHTML = templatePrice;
                parent.querySelector('.product-price__installments').innerHTML = payments;
                parent.querySelector('.product-actions__btn--buy').dataset.varId = id;
            }

            function dataFilter(data, name) {
                const names = name.split(',');

                return data.reduce((acc, obj) => {
                    if (obj.name.every((item) => names.includes(item))) {
                        acc = { id: obj.id, prices: obj.prices, stock: obj.stock };
                    } else if (obj.name.includes(name)) {
                        acc.push({ ...obj });
                    }

                    return acc;
                }, []);
            }

            function variationColors(elem) {
                elem.closest('div.product-variations__color')
                    .querySelectorAll('.selected')
                    .forEach((selected) => selected.classList.remove('selected'));
                elem.classList.add('selected');
            }

            function renderSecondaryVariation(target, type, data) {
                const size = +data.length;

                type === 'SELECT' && clearOptionsNotFirst(target.querySelectorAll('option'));

                type === 'DIV' && clearSpanElements(target, size);

                data.forEach(({ name, url, stock, sell_without_stock }) => {
                    type === 'SELECT' && renderOptions(target, name, stock, !sell_without_stock);

                    type === 'DIV' && renderSpans(target, name, stock, url, size, !sell_without_stock);
                });

                type === 'DIV' &&
                    target
                        .querySelectorAll('span:not(.no-stock)')
                        .forEach((item) => item.addEventListener('click', handleEvent, false));

                type === 'DIV' && size > 4 && initColorSlider(target);

                type === 'DIV' && target.classList.remove('disabled');

                type === 'SELECT' && target.removeAttribute('disabled');

                target.removeAttribute('title');
            }

            function renderOptions(parent, name, stock, check) {
                const templateOption = `<option ${check && +stock <= 0 ? 'disabled' : ''} value="${name.toString()}">${name[1]
                    }</option>`;

                parent.insertAdjacentHTML('beforeend', templateOption);
            }

            function renderSpans(parent, name, stock, url, size, check) {
                const isSlider = size > 4;

                const templateSpan = `${isSlider ? '<div class="swiper-slide">' : ''
                    }<span data-value="${name.toString()}" class="product-variations__color-item${check && +stock <= 0 ? ' no-stock' : ''
                    }"><img src="${url}" alt="Cor ${name[1]}" height="30" width="30" /></span>${isSlider ? '</div>' : ''}`;

                isSlider
                    ? parent.querySelector('.swiper-wrapper').insertAdjacentHTML('beforeend', templateSpan)
                    : parent.insertAdjacentHTML('beforeend', templateSpan);
            }

            function clearOptionsNotFirst(elements) {
                elements.forEach((elem, i) => i !== 0 && elem.remove());
            }

            function clearSpanElements(parent, size) {
                const swiperTemplate = `<div class=swiper_color-prev><svg fill=none height=12 viewBox="0 0 12 12"width=12 xmlns=http://www.w3.org/2000/svg><path d="M6.2.2c.14.14.22.32.22.53 0 .21-.06.39-.2.53L2.55 4.93h8.38c.21 0 .4.07.54.22.14.14.21.32.21.53a.73.73 0 0 1-.75.75H2.55l3.67 3.68c.14.13.2.3.2.52 0 .21-.08.39-.21.53a.71.71 0 0 1-.53.2.71.71 0 0 1-.52-.2L.2 6.2a.51.51 0 0 1-.16-.24.92.92 0 0 1 0-.57.66.66 0 0 1 .16-.24L5.16.2c.13-.14.3-.2.52-.2.21 0 .39.06.53.2Z"fill=#1d1d1d /></svg></div>
                <div class="swiper"><div class="swiper-wrapper"></div></div>
                <div class=swiper_color-next><svg fill=none height=12 viewBox="0 0 12 12"width=12 xmlns=http://www.w3.org/2000/svg><path d="M5.47 11.16a.75.75 0 0 1-.21-.53c0-.21.06-.39.2-.52l3.67-3.68H.75a.73.73 0 0 1-.53-.21.73.73 0 0 1-.22-.54c0-.21.07-.39.22-.53a.73.73 0 0 1 .53-.22h8.38L5.46 1.26a.68.68 0 0 1-.2-.53A.71.71 0 0 1 6 0c.21 0 .39.07.53.2l4.94 4.96c.08.06.13.14.16.23a.92.92 0 0 1 0 .57.66.66 0 0 1-.16.25l-4.95 4.95a.71.71 0 0 1-.52.2.71.71 0 0 1-.53-.2Z"fill=#1d1d1d /></svg></div>`;

                size > 4 ? (parent.innerHTML = swiperTemplate) : (parent.innerHTML = '');
            }

            function handleBuy(e) {
                e.preventDefault();
                const { currentTarget: btn } = e,
                    variantId = btn.dataset.varId ?? false,
                    parent = btn.closest('.product-actions'),
                    productId = btn.dataset.id ?? false,
                    quantity = +parent.querySelector('input[type="number"]').value;

                if (!variantId) {
                    popupMessage(parent, 'Selecione uma varia\u00e7\u00e3o!');
                    return null;
                }

                quickBuyAddToCart(productId, quantity, variantId, parent);
            }

            function popupMessage(target, message, time = 2000) {
                const alreadyElem = target.querySelector('.product-actions__message') ?? false;

                if (alreadyElem) return null;

                const nodeEl = document.createElement('P');

                nodeEl.classList.add('product-actions__message');

                nodeEl.innerHTML = message.toString();

                target.appendChild(nodeEl);

                setTimeout(() => {
                    target.removeChild(nodeEl);
                }, time);
            }

            async function quickBuyAddToCart(product_id, quant = 1, variant_id = 0, target) {
                const session_id = document.querySelector('html').dataset.session,
                    quantity = quant.toString(),
                    payload = { Cart: { session_id, product_id, quantity, variant_id } };

                try {
                    const response = await fetch('/web_api/cart/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: JSON.stringify(payload),
                    });

                    const data = await response.json();

                    if (!response.ok) throw data;

                    theme.minicart().cart.updateCart();
                    theme.minicart().cart.minicartShow();
                } catch ({ code, causes }) {
                    code === 400 && popupMessage(target, causes[0]);
                    code >= 500 && popupMessage(target, 'Error no Servidor');
                    console.error('[code]', code, '[causes]', causes ? causes[0] : causes);
                }
            }

            function initColorSlider(target) {
                new Swiper(target.querySelector('.swiper'), {
                    slidesPerView: 4,
                    navigation: {
                        prevEl: target.querySelector('.swiper_color-prev'),
                        nextEl: target.querySelector('.swiper_color-next'),
                    },
                });
            }
        },

        testeFu: function () {
            $(".header-cart.cart").on("click", function () {
                theme.minicart().cart.updateCart();
                theme.minicart().cart.minicartShow();
            })
        },

        variationShowcase: function () {
            $('.product-variations-fake-title').on('click', function (event) {
                $(this).siblings('ul').toggleClass('show');
                event.stopPropagation();
            });

            $(document).on('click', '.product-variations-fake-option', function () {
                const variantName = $(this).data('value').toString();

                $(this).parent().toggleClass('show');
                $(this).parent().siblings('span').find('span').text(variantName);
            });

            function setVariation(target, id) {
                target
                    .closest('.containerVariants')
                    .siblings('.product__buttons')
                    .find("button[type='submit']")
                    .attr('data-variant', id);
            }

            $(document).on('click', '.product-variations [data-value]', function () {
                const variantId = $(this).data('id'); 
                const value = $(this).data('value'); 
                const target = $(this);

                target.parent().find('.selected').toggleClass('selected');
                target.toggleClass('selected');
                if (!variantId) {
                    const json = JSON.parse(target.closest('.containerVariants').siblings('script').html());
                    const secondaryVar = target.closest('.product-variations').find('.secondary');
                    const variationsFound = findVariation(value, json);

                    const imgObject = {
                        element: secondaryVar.find('img').length !== 0 ? secondaryVar : secondaryVar.find('> ul'),
                        hasImage: secondaryVar.find('img').length !== 0 ? true : false,
                    };
                    const primary = target.closest(".secondary").length == 0
                    if (primary) {
                        imgObject.element.empty();
                    }

                    renderVariation(variationsFound, imgObject, primary);

                }

                variantId && setVariation(target, variantId);
            });

            function renderVariation(variations, target, ref) {

                if (ref) {
                    target.element.empty()
                    const selectTarget = target.element.siblings(".product-variations-fake-title")
                    if (selectTarget) {
                        selectTarget.find(".product-variations-fake-change").text(`Selecione`)
                    }
                }

                variations.map(({ name, id, stock, url }) => {
                    var renderVariation = renderByVariationType(
                        unescape(name).split(' + ')[1],
                        id,
                        url,
                        target.hasImage
                    );
                    +stock > 0 && target.element.append(renderVariation);
                });
            }

            function renderByVariationType(name, id, url = '', type) {
                if (!type) {
                    return `<li class="product-variations-fake-option" data-value="${unescape(
                        name
                    )}" data-id="${id}">${unescape(name)}</li>`;
                }

                return `<li class="product-variations-colors-picture" data-value="${unescape(
                    name
                )}" data-id="${id}"><img class="product-variations-colors-img" src="${url}"></li>`;
            }

            function findVariation(val, json) {
                return json.filter(
                    (e) => unescape(e.name).indexOf('+') !== -1 && unescape(e.name).split(' + ')[0] === val.toString()
                );
            }
        },

        closedPopupRetencao: function () {

            $('.closed-icon svg').mouseenter(function () {
                $('.cupom-code').css('color', 'red');
            });

            $('.closed-icon svg').mouseleave(function () {
                $('.cupom-code').css('color', 'var(--c_retencao_text)');
            });
        },

        popupsBySession: function () {
            'use strict';

            const lightboxPopup = document.querySelector('.popup-up-main'),
                retentionPopup = document.querySelector('.content-popup-retencao');

            if (!lightboxPopup && !retentionPopup) return null;

            if (
                Boolean(
                    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent ||
                        typeof window.orientation !== 'undefined' ||
                        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
                    )
                ) ||
                window.innerWidth < 992
            ) {
                lightboxPopup && lightboxPopup.remove();
                retentionPopup && retentionPopup.remove();
                return null;
            }

            retentionPopup && document.addEventListener('mouseleave', showPopupRetention);

            function showPopupRetention() {
                if (Boolean(window.sessionStorage.getItem('_popupRetention'))) {
                    retentionPopup.remove();
                    document.removeEventListener('mouseleave', showPopupRetention);
                    return null;
                }

                if (document.querySelector('.popup-up-main')) return null;

                document.querySelector('html').classList.add('_popup-ret');

                retentionPopup.querySelector('[data-popup-close]').addEventListener('click', () => {
                    window.sessionStorage.setItem('_popupRetention', 1);
                    retentionPopup.remove();
                    document.removeEventListener('mouseleave', showPopupRetention);
                    document.querySelector('html').classList.remove('_popup-ret');
                    return null;
                });
            }

            function lightboxInit() {
                if (Boolean(window.sessionStorage.getItem('_popupLightbox'))) {
                    lightboxPopup.remove();
                    return null;
                }

                document.querySelector('html').classList.add('_popup-lig');

                lightboxPopup.querySelector('[data-popup-close]').addEventListener('click', () => {
                    window.sessionStorage.setItem('_popupLightbox', 1);
                    lightboxPopup.remove();
                    document.querySelector('html').classList.remove('_popup-lig');
                    return null;
                });

                lightboxPopup.querySelector('form').addEventListener('submit', (e) => {
                    window.sessionStorage.setItem('_popupLightbox', 1);
                    lightboxPopup.remove();
                    document.querySelector('html').classList.remove('_popup-lig');
                    return null;
                });
            }

            lightboxPopup && lightboxInit();

        },
        productRelatedCarousel: function () {

            $('.section-product-related .product').on('mouseenter', function () {
                $('.showcase').addClass('z-index');
            });

            $('.section-product-related product').on('mouseleave', function () {
                $('.showcase').removeClass('z-index');
            });

            new Swiper('.section-product-related .swiper-container', {
                slidesPerView: 4,
                preloadImages: false,
                loop: false,
                lazy: {
                    loadPrevNext: true,
                },
                navigation: {
                    nextEl: '.section-product-related .next',
                    prevEl: '.section-product-related .prev',
                },
                pagination: {
                    el: '.section-product-related .dots',
                    bulletClass: 'dot',
                    bulletActiveClass: 'dot-active',
                    clickable: true
                },
                breakpoints: {
                    0: {
                        slidesPerView: 2
                    },
                    620: {
                        slidesPerView: 3
                    },
                    1200: {
                        slidesPerView: 4
                    },
                }
            });

        },
        overlay: function () {

            $('[data-toggle="overlay-shadow"]').on('click', function () {

                let target = $($(this).data('target'));
                target.addClass('show').attr('data-overlay-shadow-target', '');

                $('.overlay-shadow').addClass('show');
                $('body').addClass('overflowed');

            });

            $('.overlay-shadow').on('click', function () {
                $('[data-overlay-shadow-target]').removeClass('show').removeAttr('data-overlay-shadow-target');
                $('.overlay-shadow').removeClass('show');
                $('body').removeClass('overflowed');
            });

            $('.close-overlay').on('click', function () {
                $('.overlay-shadow').trigger('click');
            });

        },

    };

    $(() => {
        const lazyLoadImages = new LazyLoad({
            elements_selector: '.lazyload',
        });
        theme.overlay();
        theme.organizePagesTray();
        theme.testeFu();
        theme.minicart();
        theme.variationShowcase();
        theme.variantsSwipper();
        theme.variationOpenScope();
        theme.variationOpenScopeKit();
        theme.variationOpenScopeMulti();
        theme.backToTop();
        theme.productSpotQuickBuy();

        setTimeout(() => {
            theme.processRteVideoAndTable();
            theme.libMaskInit();
            theme.navMenu();
        }, 20);

        if ($('html').hasClass('ls-theme-blue')) {
            setTimeout(function () {
                theme.configScroll();
            }, 40);
        }
        if ($('html').hasClass('page-home')) {
            theme.popupsBySession();
            theme.reguaSlide();

            setTimeout(function () {
                theme.closedPopupRetencao();
                theme.productSlides();
                theme.productPromoSlides();
            }, 40);
        } else if ($('html').hasClass('page-product')) {
            theme.productRelatedCarousel();
            theme.getQuantityChangeOnProductPage();
            theme.variantImagesUpdate();
            theme.arrowsHide();
            theme.generateShippingToProduct();
            theme.goToProductReviews();
            theme.reviewsOnProductPage();
            theme.tabNavigationOnProductPage();
            theme.buyTogetherOnProductPage();
            theme.customizationProductPage();
            theme.organizeProductPage();
            theme.productReview();
            theme.slideRelated();

            setTimeout(() => {
                lazyLoadImages;
            }, 20);
            setTimeout(() => {
                theme.closeSelectorBoxProductPage();
            }, 2000);
        } else if ($('html').hasClass('page-catalog')) {
            theme.bannerSlides();
            // theme.smartFilterLimit();
        } else if ($('html').hasClass('page-search')) {
        } else if ($('html').hasClass('page-contact')) {
            theme.organizeContactUsPage();
            theme.validateFormFieldsToSendContactEmail();
        } else if ($('html').hasClass('page-newsletter')) {
            theme.organizeNewsletterRegistrationPage();
        } else if ($('html').hasClass('page-depoimentos')) {
            theme.toggleShowReviewsForm();
            theme.validateFormFieldsToSendCustomerReview();
        } else if ($('html').hasClass('page-busca_noticias')) {
            theme.imgNewsDefault();
            theme.organizeNewsPage();
            theme.insertBreadcrumbNavigationInPage('listNews');
        } else if ($('html').hasClass('page-noticia')) {
            theme.insertBreadcrumbNavigationInPage('news');
        } else if ($('html').hasClass('page-company')) {
            theme.insertBreadcrumbNavigationInPage('Sobre n&#243;s', true);
        } else if (
            $('html').hasClass('page-listas_index') ||
            $('html').hasClass('page-listas_evento') ||
            $('html').hasClass('page-listas_criar')
        ) {
            theme.insertBreadcrumbNavigationInPage('wishlist');
        } else if ($('html').hasClass('page-extra')) {
            theme.insertBreadcrumbNavigationInPage('Sistema de Afiliados', true);
        } else if ($('html').hasClass('page-comparador')) {
            theme.organizeComparePage();
        }
    });

    (function () {
        const isMobile = Boolean(
            /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent ||
                typeof window.orientation !== 'undefined' ||
                (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
            )
        );

        isMobile
            ? document.querySelectorAll('._desktop').forEach((item) => item.remove())
            : document.querySelectorAll('._mobile').forEach((item) => item.remove());
    })();

    $('.product').each(function () {
        let quantityAll = $(this).find('.product-info .product-price .product__buttons .buttons__quantity');
        let inputQuantity = quantityAll.find('#quant');
        let plus = quantityAll.find('.buttons__amount #plus');
        let minus = quantityAll.find('.buttons__amount #minus');

        plus.on('click', function () {
            let currentQuantity = parseInt(inputQuantity.val());
            let newQuantity = currentQuantity + 1;
            inputQuantity.val(newQuantity);
        });

        minus.on('click', function () {
            let currentQuantity = parseInt(inputQuantity.val());
            let newQuantity = Math.max(currentQuantity - 1, 0);
            inputQuantity.val(newQuantity);
        });
    });
    if ($('.pop-up-img').length > 0) {
        setTimeout(function () {
            if (!sessionStorage.getItem('showpopup')) {
                $('body').addClass('overlay');
                $('.pop-up-img').css('display', 'flex');
                $('.popup-up-main').css('display', 'flex');

                $('form.text__form').on('submit', function () {
                    sessionStorage.setItem('showpopup', 'true');
                });

                $('.pop-up__close, #overlay').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $('.pop-up-img').remove();
                    $('.popup-up-main').remove();

                    $('body').removeClass('overlay');

                    sessionStorage.setItem('showpopup', 'true');
                });
            } else {
                $('.pop-up-img').remove();
                $('.popup-up-main').remove();
            }
        }, 5000);
    } else if ($('.pop-up').length > 0) {
        setTimeout(function () {
            if (!sessionStorage.getItem('showpopup')) {
                $('body').addClass('overlay');
                $('.pop-up').css('display', 'flex');

                $('form.text__form').on('submit', function () {
                    sessionStorage.setItem('showpopup', 'true');
                });

                $('.pop-up__close, #overlay').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('.pop-up').remove();

                    $('body').removeClass('overlay');

                    sessionStorage.setItem('showpopup', 'true');
                });
            } else {
                $('.pop-up').remove();
            }
        }, 5000);
    }


    jQuery(document).ready(function () {
        jQuery('._lazy').removeClass();
    });

    function listenerAjaxRequest(path, cb) {
        jQuery(document).on('ajaxComplete', function (event, req, settings) {
            if (settings.url.indexOf(path.toString()) != -1) {
                return cb();
            }
        });
    }
    document.addEventListener("DOMContentLoaded", function () {
        const modal = document.querySelector('.pop-up-img');
        const closeButton = document.querySelector('.pop-up__close');

        const modalShown = localStorage.getItem('modalShown');

        if (!modalShown) {
            setTimeout(() => {
                modal.classList.add('pop-up-open');
            }, 5000);
        }

        closeButton.addEventListener('click', () => {
            modal.classList.remove('pop-up-open');
            localStorage.setItem('modalShown', 'true');
        });
    });

    $(".product").each(function () {
        var countProductMessages = $(this).find(".product-message");
        countProductMessages.css('color', '#c6c6c6');

        setInterval(function () {
            countProductMessages.each(function () {
                var currentColor = $(this).css('color');

                if (currentColor === 'rgb(198, 198, 198)') {
                    $(this).css('color', '#000');
                } else {
                    $(this).css('color', '#c6c6c6');
                }
            });
        }, 1000);
    });
    jQuery(document).ready(function () {
        if (window.innerWidth < 992) {
            $('.product__variations').on('click', '.lista_cor_variacao li', function () {
                setTimeout(function () {

                    jQuery(".jcarousel-skin-tango").owlCarousel({
                        autoPlay: true,
                        items: 4,
                        itemsCustom: [[320, 1], [600, 1], [768, 1]],
                        navigation: false,
                        navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                        pagination: true,
                        singleItem: false
                    });

                }, 500);
            });
        }

        if (window.innerWidth < 992) {
            jQuery(".product-img").owlCarousel({
                autoPlay: true,
                items: 4,
                itemsCustom: [[320, 1], [600, 1], [768, 1]],
                navigation: false,
                navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                pagination: true,
                singleItem: false
            });
        }
        if (window.innerWidth < 992) {
            function initializeCarousel() {
                jQuery(".jcarousel-skin-tango").owlCarousel({
                    autoPlay: true,
                    items: 4,
                    itemsCustom: [[320, 1], [600, 1], [768, 1]],
                    navigation: false,
                    navigationText: ['<svg class="icon-arrow icon-arrow_prev"><use xlink:href="#icon-prev"></use></svg>', '<svg class="icon-arrow icon-arrow_next"><use xlink:href="#icon-next"></use></svg>'],
                    pagination: true,
                    singleItem: false
                });
            }
        }


    });


    $('.color_variant').removeAttr('src');
    $('.imagens_variantes img').each(function (index) {
        var imgSrc = $(this).attr('src');

        $('.color_variant').eq(index).attr('src', imgSrc);
    });
    setTimeout(function () {
        const imageNumbersToKeep = [1, 4, 7, 10];

        $('.product').each(function() { 
            var firstVariants = $(this).find('.product-variations-colors-content.primary').length
            var secondVariants = $(this).find('.product-variations-fake-content.secondary').length

            if(firstVariants <= 0 || secondVariants > 0 ){
                $(this).find('.product-variations').css("background", "")
            }
            $(this).find('.product-variations-colors-picture').each(function(index) {
                const imageNumberToKeep = imageNumbersToKeep[index];
    
                if (imageNumberToKeep !== undefined) {
                    $(this).find('img').each(function() {
                        const imageNumber = $(this).data('image-number');
                        if (imageNumber !== imageNumberToKeep) {
                            $(this).remove();
                        }
                    });
                }
            });
        });
    }, 1000)
    setTimeout(function(){
        const swiper = new Swiper('.swiper-container.carrossel', {
            slidesPerView: 4,
            spaceBetween: 10,
            loop: true, 
            navigation: {
            nextEl: '.swiper-button-next', 
            prevEl: '.swiper-button-prev', 
            },
            pagination: {
            el: '.swiper-pagination',
            clickable: true,
            },
            breakpoints: {
            640: {
                slidesPerView: 4, 
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 4, 
                spaceBetween: 10,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 10,
            },
            },
        });
  
    }, 1500)
    $('.product').each(function() { 
        var hasSecondaryVariants = $(this).find('.product-variations-fake-content.secondary').length > 0;
    
        if (!hasSecondaryVariants) {
            $(this).find('.product-variations').css({"height": "45px", "padding": "0"});
            $(this).find('.containerVariants').css("top", "-1em")
            $(this).find('.product-variations-fake-select').css("margin-top","-11px")
    
        }
    });
    const productElement = document.querySelector('[data-pages="product"]');
    
    if (productElement) {
        if (window.innerWidth <= 768) {
            const listaCorVariacao = document.querySelector('.lista_cor_variacao');
            
            if (listaCorVariacao) {
                // Adiciona a classe Swiper
                listaCorVariacao.classList.add('swiper-wrapper');

                // Armazena os itens da lista em um array
                const items = Array.from(listaCorVariacao.children);
                listaCorVariacao.innerHTML = ''; // Limpa a lista original

                items.forEach(item => {
                    // Envolve cada item em uma div swiper-slide
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('swiper-slide');
                    wrapper.appendChild(item.cloneNode(true)); // Clona o item para não removê-lo
                    listaCorVariacao.appendChild(wrapper);
                });

                // Inicializa o Swiper
                const swiper = new Swiper('.lista_cor_variacao', {
                    slidesPerView: 'auto',
                    spaceBetween: 10,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            }
        }
    }
})(jQuery);
