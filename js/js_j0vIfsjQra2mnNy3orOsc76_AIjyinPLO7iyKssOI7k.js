/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+ function($) {
    'use strict';

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert = function(el) {
        $(el).on('click', dismiss, this.close)
    }

    Alert.VERSION = '3.3.7'

    Alert.TRANSITION_DURATION = 150

    Alert.prototype.close = function(e) {
        var $this = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector === '#' ? [] : selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
            $parent = $this.closest('.alert')
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
            .one('bsTransitionEnd', removeElement)
            .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
            removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.alert')

            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.alert

    $.fn.alert = Plugin
    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function() {
        $.fn.alert = old
        return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);;
/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+
function($) {
    'use strict';

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Collapse.DEFAULTS, options)
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
            '[data-toggle="collapse"][data-target="#' + element.id + '"]')
        this.transitioning = null

        if (this.options.parent) {
            this.$parent = this.getParent()
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger)
        }

        if (this.options.toggle) this.toggle()
    }

    Collapse.VERSION = '3.3.7'

    Collapse.TRANSITION_DURATION = 350

    Collapse.DEFAULTS = {
        toggle: true
    }

    Collapse.prototype.dimension = function() {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function() {
        if (this.transitioning || this.$element.hasClass('in')) return

        var activesData
        var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

        if (actives && actives.length) {
            activesData = actives.data('bs.collapse')
            if (activesData && activesData.transitioning) return
        }

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        if (actives && actives.length) {
            Plugin.call(actives, 'hide')
            activesData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
            .removeClass('collapse')
            .addClass('collapsing')[dimension](0)
            .attr('aria-expanded', true)

        this.$trigger
            .removeClass('collapsed')
            .attr('aria-expanded', true)

        this.transitioning = 1

        var complete = function() {
            this.$element
                .removeClass('collapsing')
                .addClass('collapse in')[dimension]('')
            this.transitioning = 0
            this.$element
                .trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function() {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element[dimension](this.$element[dimension]())[0].offsetHeight

        this.$element
            .addClass('collapsing')
            .removeClass('collapse in')
            .attr('aria-expanded', false)

        this.$trigger
            .addClass('collapsed')
            .attr('aria-expanded', false)

        this.transitioning = 1

        var complete = function() {
            this.transitioning = 0
            this.$element
                .removeClass('collapsing')
                .addClass('collapse')
                .trigger('hidden.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element[dimension](0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    }

    Collapse.prototype.toggle = function() {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

    Collapse.prototype.getParent = function() {
        return $(this.options.parent)
            .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
            .each($.proxy(function(i, element) {
                var $element = $(element)
                this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
            }, this))
            .end()
    }

    Collapse.prototype.addAriaAndCollapsedClass = function($element, $trigger) {
        var isOpen = $element.hasClass('in')

        $element.attr('aria-expanded', isOpen)
        $trigger
            .toggleClass('collapsed', !isOpen)
            .attr('aria-expanded', isOpen)
    }

    function getTargetFromTrigger($trigger) {
        var href
        var target = $trigger.attr('data-target') ||
            (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

        return $(target)
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.collapse

    $.fn.collapse = Plugin
    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function() {
        $.fn.collapse = old
        return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function(e) {
        var $this = $(this)

        if (!$this.attr('data-target')) e.preventDefault()

        var $target = getTargetFromTrigger($this)
        var data = $target.data('bs.collapse')
        var option = data ? 'toggle' : $this.data()

        Plugin.call($target, option)
    })

}(jQuery);;
/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle = '[data-toggle="dropdown"]'
    var Dropdown = function(element) {
        $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.VERSION = '3.3.7'

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }

    function clearMenus(e) {
        if (e && e.which === 3) return
        $(backdrop).remove()
        $(toggle).each(function() {
            var $this = $(this)
            var $parent = getParent($this)
            var relatedTarget = {
                relatedTarget: this
            }

            if (!$parent.hasClass('open')) return

            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this.attr('aria-expanded', 'false')
            $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
        })
    }

    Dropdown.prototype.toggle = function(e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $(document.createElement('div'))
                    .addClass('dropdown-backdrop')
                    .insertAfter($(this))
                    .on('click', clearMenus)
            }

            var relatedTarget = {
                relatedTarget: this
            }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this
                .trigger('focus')
                .attr('aria-expanded', 'true')

            $parent
                .toggleClass('open')
                .trigger($.Event('shown.bs.dropdown', relatedTarget))
        }

        return false
    }

    Dropdown.prototype.keydown = function(e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27) $parent.find(toggle).trigger('focus')
            return $this.trigger('click')
        }

        var desc = ' li:not(.disabled):visible a'
        var $items = $parent.find('.dropdown-menu' + desc)

        if (!$items.length) return

        var index = $items.index(e.target)

        if (e.which == 38 && index > 0) index-- // up
            if (e.which == 40 && index < $items.length - 1) index++ // down
                if (!~index) index = 0

        $items.eq(index).trigger('focus')
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.dropdown')

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.dropdown

    $.fn.dropdown = Plugin
    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function() {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function(e) {
            e.stopPropagation()
        })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
        .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);;
/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function(element, options) {
        this.options = options
        this.$body = $(document.body)
        this.$element = $(element)
        this.$dialog = this.$element.find('.modal-dialog')
        this.$backdrop = null
        this.isShown = null
        this.originalBodyPad = null
        this.scrollbarWidth = 0
        this.ignoreBackdropClick = false

        if (this.options.remote) {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function() {
                    this.$element.trigger('loaded.bs.modal')
                }, this))
        }
    }

    Modal.VERSION = '3.3.7'

    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    }

    Modal.prototype.toggle = function(_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    }

    Modal.prototype.show = function(_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', {
            relatedTarget: _relatedTarget
        })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.checkScrollbar()
        this.setScrollbar()
        this.$body.addClass('modal-open')

        this.escape()
        this.resize()

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.$dialog.on('mousedown.dismiss.bs.modal', function() {
            that.$element.one('mouseup.dismiss.bs.modal', function(e) {
                if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
            })
        })

        this.backdrop(function() {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body) // don't move modals dom position
            }

            that.$element
                .show()
                .scrollTop(0)

            that.adjustDialog()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element.addClass('in')

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', {
                relatedTarget: _relatedTarget
            })

            transition ?
                that.$dialog // wait for modal to slide in
                .one('bsTransitionEnd', function() {
                    that.$element.trigger('focus').trigger(e)
                })
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
    }

    Modal.prototype.hide = function(e) {
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()
        this.resize()

        $(document).off('focusin.bs.modal')

        this.$element
            .removeClass('in')
            .off('click.dismiss.bs.modal')
            .off('mouseup.dismiss.bs.modal')

        this.$dialog.off('mousedown.dismiss.bs.modal')

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
            .one('bsTransitionEnd', $.proxy(this.hideModal, this))
            .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            this.hideModal()
    }

    Modal.prototype.enforceFocus = function() {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function(e) {
                if (document !== e.target &&
                    this.$element[0] !== e.target &&
                    !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    }

    Modal.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function(e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal')
        }
    }

    Modal.prototype.resize = function() {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
            $(window).off('resize.bs.modal')
        }
    }

    Modal.prototype.hideModal = function() {
        var that = this
        this.$element.hide()
        this.backdrop(function() {
            that.$body.removeClass('modal-open')
            that.resetAdjustments()
            that.resetScrollbar()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Modal.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function(callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $(document.createElement('div'))
                .addClass('modal-backdrop ' + animate)
                .appendTo(this.$body)

            this.$element.on('click.dismiss.bs.modal', $.proxy(function(e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false
                    return
                }
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static' ?
                    this.$element[0].focus() :
                    this.hide()
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
                this.$backdrop
                .one('bsTransitionEnd', callback)
                .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            var callbackRemove = function() {
                that.removeBackdrop()
                callback && callback()
            }
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                .one('bsTransitionEnd', callbackRemove)
                .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        } else if (callback) {
            callback()
        }
    }

    // these following methods are used to handle overflowing modals

    Modal.prototype.handleUpdate = function() {
        this.adjustDialog()
    }

    Modal.prototype.adjustDialog = function() {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        })
    }

    Modal.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: '',
            paddingRight: ''
        })
    }

    Modal.prototype.checkScrollbar = function() {
        var fullWindowWidth = window.innerWidth
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect()
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
        this.scrollbarWidth = this.measureScrollbar()
    }

    Modal.prototype.setScrollbar = function() {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
        this.originalBodyPad = document.body.style.paddingRight || ''
        //commenting out this line as we do not want padding right added to the body.
        //if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }

    Modal.prototype.resetScrollbar = function() {
        this.$body.css('padding-right', this.originalBodyPad)
    }

    Modal.prototype.measureScrollbar = function() { // thx walsh
        var scrollDiv = document.createElement('div')
        scrollDiv.className = 'modal-scrollbar-measure'
        this.$body.append(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        this.$body[0].removeChild(scrollDiv)
        return scrollbarWidth
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.modal

    $.fn.modal = Plugin
    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function() {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function(e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({
            remote: !/#/.test(href) && href
        }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        $target.one('show.bs.modal', function(showEvent) {
            if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function() {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        Plugin.call($target, option, this)
    })

}(jQuery);;
/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function(element, options) {
        this.type = null
        this.options = null
        this.enabled = null
        this.timeout = null
        this.hoverState = null
        this.$element = null
        this.inState = null

        this.init('tooltip', element, options)
    }

    Tooltip.VERSION = '3.3.7'

    Tooltip.TRANSITION_DURATION = 150

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }

    Tooltip.prototype.init = function(type, element, options) {
        this.enabled = true
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)
        this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
        this.inState = {
            click: false,
            hover: false,
            focus: false
        }

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
        }

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, {
                trigger: 'manual',
                selector: ''
            })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function() {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function(options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function() {
        var options = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function(key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function(obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
        }

        if (self.tip().hasClass('in') || self.hoverState == 'in') {
            self.hoverState = 'in'
            return
        }

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function() {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.isInStateTrue = function() {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    }

    Tooltip.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
        }

        if (self.isInStateTrue()) return

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function() {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function() {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
            if (e.isDefaultPrevented() || !inDom) return
            var that = this

            var $tip = this.tip()

            var tipId = this.getUID(this.type)

            this.setContent()
            $tip.attr('id', tipId)
            this.$element.attr('aria-describedby', tipId)

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({
                    top: 0,
                    left: 0,
                    display: 'block'
                })
                .addClass(placement)
                .data('bs.' + this.type, this)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
            this.$element.trigger('inserted.bs.' + this.type)

            var pos = this.getPosition()
            var actualWidth = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var orgPlacement = placement
                var viewportDim = this.getPosition(this.$viewport)

                placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
                    placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
                    placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
                    placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
                    placement

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)

            var complete = function() {
                var prevHoverState = that.hoverState
                that.$element.trigger('shown.bs.' + that.type)
                that.hoverState = null

                if (prevHoverState == 'out') that.leave(that)
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete()
        }
    }

    Tooltip.prototype.applyPlacement = function(offset, placement) {
        var $tip = this.tip()
        var width = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top += marginTop
        offset.left += marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function(props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical = /top|bottom/.test(placement)
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    }

    Tooltip.prototype.replaceArrow = function(delta, dimension, isVertical) {
        this.arrow()
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '')
    }

    Tooltip.prototype.setContent = function() {
        var $tip = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function(callback) {
        var that = this
        var $tip = $(this.$tip)
        var e = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
                that.$element
                    .removeAttr('aria-describedby')
                    .trigger('hidden.bs.' + that.type)
            }
            callback && callback()
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && $tip.hasClass('fade') ?
            $tip
            .one('bsTransitionEnd', complete)
            .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete()

        this.hoverState = null

        return this
    }

    Tooltip.prototype.fixTitle = function() {
        var $e = this.$element
        if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function() {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function($element) {
        $element = $element || this.$element

        var el = $element[0]
        var isBody = el.tagName == 'BODY'

        var elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            })
        }
        var isSvg = window.SVGElement && el instanceof window.SVGElement
        // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
        // See https://github.com/twbs/bootstrap/issues/20280
        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : (isSvg ? null : $element.offset())
        var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()
        }
        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    }

    Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? {
                top: pos.top + pos.height,
                left: pos.left + pos.width / 2 - actualWidth / 2
            } :
            placement == 'top' ? {
                top: pos.top - actualHeight,
                left: pos.left + pos.width / 2 - actualWidth / 2
            } :
            placement == 'left' ? {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left - actualWidth
            } :
            /* placement == 'right' */
            {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left + pos.width
            }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function(placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        }
        if (!this.$viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    }

    Tooltip.prototype.getTitle = function() {
        var title
        var $e = this.$element
        var o = this.options

        title = $e.attr('data-original-title') ||
            (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

        return title
    }

    Tooltip.prototype.getUID = function(prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }

    Tooltip.prototype.tip = function() {
        if (!this.$tip) {
            this.$tip = $(this.options.template)
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
            }
        }
        return this.$tip
    }

    Tooltip.prototype.arrow = function() {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }

    Tooltip.prototype.enable = function() {
        this.enabled = true
    }

    Tooltip.prototype.disable = function() {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function(e) {
        var self = this
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type)
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                $(e.currentTarget).data('bs.' + this.type, self)
            }
        }

        if (e) {
            self.inState.click = !self.inState.click
            if (self.isInStateTrue()) self.enter(self)
            else self.leave(self)
        } else {
            self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
        }
    }

    Tooltip.prototype.destroy = function() {
        var that = this
        clearTimeout(this.timeout)
        this.hide(function() {
            that.$element.off('.' + that.type).removeData('bs.' + that.type)
            if (that.$tip) {
                that.$tip.detach()
            }
            that.$tip = null
            that.$arrow = null
            that.$viewport = null
            that.$element = null
        })
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip

    $.fn.tooltip = Plugin
    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function() {
        $.fn.tooltip = old
        return this
    }

}(jQuery);;
/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // SCROLLSPY CLASS DEFINITION
    // ==========================

    function ScrollSpy(element, options) {
        this.$body = $(document.body)
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector = (this.options.target || '') + ' .nav li > a'
        this.offsets = []
        this.targets = []
        this.activeTarget = null
        this.scrollHeight = 0

        this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
        this.refresh()
        this.process()
    }

    ScrollSpy.VERSION = '3.3.7'

    ScrollSpy.DEFAULTS = {
        offset: 10
    }

    ScrollSpy.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }

    ScrollSpy.prototype.refresh = function() {
        var that = this
        var offsetMethod = 'offset'
        var offsetBase = 0

        this.offsets = []
        this.targets = []
        this.scrollHeight = this.getScrollHeight()

        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = 'position'
            offsetBase = this.$scrollElement.scrollTop()
        }

        this.$body
            .find(this.selector)
            .map(function() {
                var $el = $(this)
                var href = $el.data('target') || $el.attr('href')
                var $href = /^#./.test(href) && $(href)

                return ($href &&
                    $href.length &&
                    $href.is(':visible') &&
                    [
                        [$href[offsetMethod]().top + offsetBase, href]
                    ]) || null
            })
            .sort(function(a, b) {
                return a[0] - b[0]
            })
            .each(function() {
                that.offsets.push(this[0])
                that.targets.push(this[1])
            })
    }

    ScrollSpy.prototype.process = function() {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.getScrollHeight()
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
        var offsets = this.offsets
        var targets = this.targets
        var activeTarget = this.activeTarget
        var i

        if (this.scrollHeight != scrollHeight) {
            this.refresh()
        }

        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
        }

        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null
            return this.clear()
        }

        for (i = offsets.length; i--;) {
            activeTarget != targets[i] &&
                scrollTop >= offsets[i] &&
                (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) &&
                this.activate(targets[i])
        }
    }

    ScrollSpy.prototype.activate = function(target) {
        this.activeTarget = target

        this.clear()

        var selector = this.selector +
            '[data-target="' + target + '"],' +
            this.selector + '[href="' + target + '"]'

        var active = $(selector)
            .parents('li')
            .addClass('active')

        if (active.parent('.dropdown-menu').length) {
            active = active
                .closest('li.dropdown')
                .addClass('active')
        }

        active.trigger('activate.bs.scrollspy')
    }

    ScrollSpy.prototype.clear = function() {
        $(this.selector)
            .parentsUntil(this.options.target, '.active')
            .removeClass('active')
    }


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.scrollspy

    $.fn.scrollspy = Plugin
    $.fn.scrollspy.Constructor = ScrollSpy


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function() {
        $.fn.scrollspy = old
        return this
    }


    // SCROLLSPY DATA-API
    // ==================

    $(window).on('load.bs.scrollspy.data-api', function() {
        $('[data-spy="scroll"]').each(function() {
            var $spy = $(this)
            Plugin.call($spy, $spy.data())
        })
    })

}(jQuery);;
/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function(element) {
        // jscs:disable requireDollarBeforejQueryAssignment
        this.element = $(element)
        // jscs:enable requireDollarBeforejQueryAssignment
    }

    Tab.VERSION = '3.3.7'

    Tab.TRANSITION_DURATION = 150

    Tab.prototype.show = function() {
        var $this = this.element
        var $ul = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return

        var $previous = $ul.find('.active:last a')
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        })
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        })

        $previous.trigger(hideEvent)
        $this.trigger(showEvent)

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.closest('li'), $ul)
        this.activate($target, $target.parent(), function() {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            })
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            })
        })
    }

    Tab.prototype.activate = function(element, container, callback) {
        var $active = container.find('> .active')
        var transition = callback &&
            $.support.transition &&
            ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')
                .end()
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', false)

            element
                .addClass('active')
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', true)

            if (transition) {
                element[0].offsetWidth // reflow for transition
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }

            if (element.parent('.dropdown-menu').length) {
                element
                    .closest('li.dropdown')
                    .addClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true)
            }

            callback && callback()
        }

        $active.length && transition ?
            $active
            .one('bsTransitionEnd', next)
            .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next()

        $active.removeClass('in')
    }


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.tab')

            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tab

    $.fn.tab = Plugin
    $.fn.tab.Constructor = Tab


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function() {
        $.fn.tab = old
        return this
    }


    // TAB DATA-API
    // ============

    var clickHandler = function(e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
    }

    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);;
/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+
function($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function() {
            called = true
        })
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }

    $(function() {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function(e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);;
/*!
 * Bootstrap-select v1.12.4 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2017 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(["jquery"], function(a0) {
            return (factory(a0));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require("jquery"));
    } else {
        factory(root["jQuery"]);
    }
}(this, function(jQuery) {

    (function($) {
        'use strict';

        //<editor-fold desc="Shims">
        if (!String.prototype.includes) {
            (function() {
                'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
                var toString = {}.toString;
                var defineProperty = (function() {
                    // IE 8 only supports `Object.defineProperty` on DOM elements
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty;
                    } catch (error) {}
                    return result;
                }());
                var indexOf = ''.indexOf;
                var includes = function(search) {
                    if (this == null) {
                        throw new TypeError();
                    }
                    var string = String(this);
                    if (search && toString.call(search) == '[object RegExp]') {
                        throw new TypeError();
                    }
                    var stringLength = string.length;
                    var searchString = String(search);
                    var searchLength = searchString.length;
                    var position = arguments.length > 1 ? arguments[1] : undefined;
                    // `ToInteger`
                    var pos = position ? Number(position) : 0;
                    if (pos != pos) { // better `isNaN`
                        pos = 0;
                    }
                    var start = Math.min(Math.max(pos, 0), stringLength);
                    // Avoid the `indexOf` call if no match is possible
                    if (searchLength + start > stringLength) {
                        return false;
                    }
                    return indexOf.call(string, searchString, pos) != -1;
                };
                if (defineProperty) {
                    defineProperty(String.prototype, 'includes', {
                        'value': includes,
                        'configurable': true,
                        'writable': true
                    });
                } else {
                    String.prototype.includes = includes;
                }
            }());
        }

        if (!String.prototype.startsWith) {
            (function() {
                'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
                var defineProperty = (function() {
                    // IE 8 only supports `Object.defineProperty` on DOM elements
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty;
                    } catch (error) {}
                    return result;
                }());
                var toString = {}.toString;
                var startsWith = function(search) {
                    if (this == null) {
                        throw new TypeError();
                    }
                    var string = String(this);
                    if (search && toString.call(search) == '[object RegExp]') {
                        throw new TypeError();
                    }
                    var stringLength = string.length;
                    var searchString = String(search);
                    var searchLength = searchString.length;
                    var position = arguments.length > 1 ? arguments[1] : undefined;
                    // `ToInteger`
                    var pos = position ? Number(position) : 0;
                    if (pos != pos) { // better `isNaN`
                        pos = 0;
                    }
                    var start = Math.min(Math.max(pos, 0), stringLength);
                    // Avoid the `indexOf` call if no match is possible
                    if (searchLength + start > stringLength) {
                        return false;
                    }
                    var index = -1;
                    while (++index < searchLength) {
                        if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                            return false;
                        }
                    }
                    return true;
                };
                if (defineProperty) {
                    defineProperty(String.prototype, 'startsWith', {
                        'value': startsWith,
                        'configurable': true,
                        'writable': true
                    });
                } else {
                    String.prototype.startsWith = startsWith;
                }
            }());
        }

        if (!Object.keys) {
            Object.keys = function(
                o, // object
                k, // key
                r // result array
            ) {
                // initialize object and result
                r = [];
                // iterate over object keys
                for (k in o)
                    // fill result array with non-prototypical keys
                    r.hasOwnProperty.call(o, k) && r.push(k);
                // return result
                return r;
            };
        }

        // set data-selected on select element if the value has been programmatically selected
        // prior to initialization of bootstrap-select
        // * consider removing or replacing an alternative method *
        var valHooks = {
            useDefault: false,
            _set: $.valHooks.select.set
        };

        $.valHooks.select.set = function(elem, value) {
            if (value && !valHooks.useDefault) $(elem).data('selected', true);

            return valHooks._set.apply(this, arguments);
        };

        var changed_arguments = null;

        var EventIsSupported = (function() {
            try {
                new Event('change');
                return true;
            } catch (e) {
                return false;
            }
        })();

        $.fn.triggerNative = function(eventName) {
            var el = this[0],
                event;

            if (el.dispatchEvent) { // for modern browsers & IE9+
                if (EventIsSupported) {
                    // For modern browsers
                    event = new Event(eventName, {
                        bubbles: true
                    });
                } else {
                    // For IE since it doesn't support Event constructor
                    event = document.createEvent('Event');
                    event.initEvent(eventName, true, false);
                }

                el.dispatchEvent(event);
            } else if (el.fireEvent) { // for IE8
                event = document.createEventObject();
                event.eventType = eventName;
                el.fireEvent('on' + eventName, event);
            } else {
                // fall back to jQuery.trigger
                this.trigger(eventName);
            }
        };
        //</editor-fold>

        // Case insensitive contains search
        $.expr.pseudos.icontains = function(obj, index, meta) {
            var $obj = $(obj).find('a');
            var haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
            return haystack.includes(meta[3].toUpperCase());
        };

        // Case insensitive begins search
        $.expr.pseudos.ibegins = function(obj, index, meta) {
            var $obj = $(obj).find('a');
            var haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
            return haystack.startsWith(meta[3].toUpperCase());
        };

        // Case and accent insensitive contains search
        $.expr.pseudos.aicontains = function(obj, index, meta) {
            var $obj = $(obj).find('a');
            var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
            return haystack.includes(meta[3].toUpperCase());
        };

        // Case and accent insensitive begins search
        $.expr.pseudos.aibegins = function(obj, index, meta) {
            var $obj = $(obj).find('a');
            var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
            return haystack.startsWith(meta[3].toUpperCase());
        };

        /**
         * Remove all diatrics from the given text.
         * @access private
         * @param {String} text
         * @returns {String}
         */
        function normalizeToBase(text) {
            var rExps = [{
                    re: /[\xC0-\xC6]/g,
                    ch: "A"
                },
                {
                    re: /[\xE0-\xE6]/g,
                    ch: "a"
                },
                {
                    re: /[\xC8-\xCB]/g,
                    ch: "E"
                },
                {
                    re: /[\xE8-\xEB]/g,
                    ch: "e"
                },
                {
                    re: /[\xCC-\xCF]/g,
                    ch: "I"
                },
                {
                    re: /[\xEC-\xEF]/g,
                    ch: "i"
                },
                {
                    re: /[\xD2-\xD6]/g,
                    ch: "O"
                },
                {
                    re: /[\xF2-\xF6]/g,
                    ch: "o"
                },
                {
                    re: /[\xD9-\xDC]/g,
                    ch: "U"
                },
                {
                    re: /[\xF9-\xFC]/g,
                    ch: "u"
                },
                {
                    re: /[\xC7-\xE7]/g,
                    ch: "c"
                },
                {
                    re: /[\xD1]/g,
                    ch: "N"
                },
                {
                    re: /[\xF1]/g,
                    ch: "n"
                }
            ];
            $.each(rExps, function() {
                text = text ? text.replace(this.re, this.ch) : '';
            });
            return text;
        }


        // List of HTML entities for escaping.
        var escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        };

        var unescapeMap = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#x27;': "'",
            '&#x60;': '`'
        };

        // Functions for escaping and unescaping strings to/from HTML interpolation.
        var createEscaper = function(map) {
            var escaper = function(match) {
                return map[match];
            };
            // Regexes for identifying a key that needs to be escaped.
            var source = '(?:' + Object.keys(map).join('|') + ')';
            var testRegexp = RegExp(source);
            var replaceRegexp = RegExp(source, 'g');
            return function(string) {
                string = string == null ? '' : '' + string;
                return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
            };
        };

        var htmlEscape = createEscaper(escapeMap);
        var htmlUnescape = createEscaper(unescapeMap);

        var Selectpicker = function(element, options) {
            // bootstrap-select has been initialized - revert valHooks.select.set back to its original function
            if (!valHooks.useDefault) {
                $.valHooks.select.set = valHooks._set;
                valHooks.useDefault = true;
            }

            this.$element = $(element);
            this.$newElement = null;
            this.$button = null;
            this.$menu = null;
            this.$lis = null;
            this.options = options;

            // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
            // data-attribute)
            if (this.options.title === null) {
                this.options.title = this.$element.attr('title');
            }

            // Format window padding
            var winPad = this.options.windowPadding;
            if (typeof winPad === 'number') {
                this.options.windowPadding = [winPad, winPad, winPad, winPad];
            }

            //Expose public methods
            this.val = Selectpicker.prototype.val;
            this.render = Selectpicker.prototype.render;
            this.refresh = Selectpicker.prototype.refresh;
            this.setStyle = Selectpicker.prototype.setStyle;
            this.selectAll = Selectpicker.prototype.selectAll;
            this.deselectAll = Selectpicker.prototype.deselectAll;
            this.destroy = Selectpicker.prototype.destroy;
            this.remove = Selectpicker.prototype.remove;
            this.show = Selectpicker.prototype.show;
            this.hide = Selectpicker.prototype.hide;

            this.init();
        };

        Selectpicker.VERSION = '1.12.4';

        // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
        Selectpicker.DEFAULTS = {
            noneSelectedText: 'Nothing selected',
            noneResultsText: 'No results matched {0}',
            countSelectedText: function(numSelected, numTotal) {
                return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
            },
            maxOptionsText: function(numAll, numGroup) {
                return [
                    (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
                    (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'
                ];
            },
            selectAllText: 'Select All',
            deselectAllText: 'Deselect All',
            doneButton: false,
            doneButtonText: 'Close',
            multipleSeparator: ', ',
            styleBase: 'btn',
            style: 'btn-default',
            size: 'auto',
            title: null,
            selectedTextFormat: 'values',
            width: false,
            container: false,
            hideDisabled: false,
            showSubtext: false,
            showIcon: true,
            showContent: true,
            dropupAuto: true,
            header: false,
            liveSearch: false,
            liveSearchPlaceholder: null,
            liveSearchNormalize: false,
            liveSearchStyle: 'contains',
            actionsBox: false,
            iconBase: 'glyphicon',
            tickIcon: 'glyphicon-ok',
            showTick: false,
            template: {
                caret: '<span class="caret"></span>'
            },
            maxOptions: false,
            mobile: false,
            selectOnTab: false,
            dropdownAlignRight: false,
            windowPadding: 0
        };

        Selectpicker.prototype = {

            constructor: Selectpicker,

            init: function() {
                var that = this,
                    id = this.$element.attr('id');

                this.$element.addClass('bs-select-hidden');

                // store originalIndex (key) and newIndex (value) in this.liObj for fast accessibility
                // allows us to do this.$lis.eq(that.liObj[index]) instead of this.$lis.filter('[data-original-index="' + index + '"]')
                this.liObj = {};
                this.multiple = this.$element.prop('multiple');
                this.autofocus = this.$element.prop('autofocus');
                this.$newElement = this.createView();
                this.$element
                    .after(this.$newElement)
                    .appendTo(this.$newElement);
                this.$button = this.$newElement.children('button');
                this.$menu = this.$newElement.children('.dropdown-menu');
                this.$menuInner = this.$menu.children('.inner');
                this.$searchbox = this.$menu.find('input');

                this.$element.removeClass('bs-select-hidden');

                if (this.options.dropdownAlignRight === true) this.$menu.addClass('dropdown-menu-right');

                if (typeof id !== 'undefined') {
                    this.$button.attr('data-id', id);
                    $('label[for="' + id + '"]').click(function(e) {
                        e.preventDefault();
                        that.$button.focus();
                    });
                }

                this.checkDisabled();
                this.clickListener();
                if (this.options.liveSearch) this.liveSearchListener();
                this.render();
                this.setStyle();
                this.setWidth();
                if (this.options.container) this.selectPosition();
                this.$menu.data('this', this);
                this.$newElement.data('this', this);
                if (this.options.mobile) this.mobile();

                this.$newElement.on({
                    'hide.bs.dropdown': function(e) {
                        that.$menuInner.attr('aria-expanded', false);
                        that.$element.trigger('hide.bs.select', e);
                    },
                    'hidden.bs.dropdown': function(e) {
                        that.$element.trigger('hidden.bs.select', e);
                    },
                    'show.bs.dropdown': function(e) {
                        that.$menuInner.attr('aria-expanded', true);
                        that.$element.trigger('show.bs.select', e);
                    },
                    'shown.bs.dropdown': function(e) {
                        that.$element.trigger('shown.bs.select', e);
                    }
                });

                if (that.$element[0].hasAttribute('required')) {
                    this.$element.on('invalid', function() {
                        that.$button.addClass('bs-invalid');

                        that.$element.on({
                            'focus.bs.select': function() {
                                that.$button.focus();
                                that.$element.off('focus.bs.select');
                            },
                            'shown.bs.select': function() {
                                that.$element
                                    .val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                                    .off('shown.bs.select');
                            },
                            'rendered.bs.select': function() {
                                // if select is no longer invalid, remove the bs-invalid class
                                if (this.validity.valid) that.$button.removeClass('bs-invalid');
                                that.$element.off('rendered.bs.select');
                            }
                        });

                        that.$button.on('blur.bs.select', function() {
                            that.$element.focus().blur();
                            that.$button.off('blur.bs.select');
                        });
                    });
                }

                setTimeout(function() {
                    that.$element.trigger('loaded.bs.select');
                });
            },

            createDropdown: function() {
                // Options
                // If we are multiple or showTick option is set, then add the show-tick class
                var showTick = (this.multiple || this.options.showTick) ? ' show-tick' : '',
                    inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
                    autofocus = this.autofocus ? ' autofocus' : '';
                // Elements
                var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
                var searchbox = this.options.liveSearch ?
                    '<div class="bs-searchbox">' +
                    '<input type="text" class="form-control" autocomplete="off"' +
                    (null === this.options.liveSearchPlaceholder ? '' : ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"') + ' role="textbox" aria-label="Search">' +
                    '</div>' :
                    '';
                var actionsbox = this.multiple && this.options.actionsBox ?
                    '<div class="bs-actionsbox">' +
                    '<div class="btn-group btn-group-sm btn-block">' +
                    '<button type="button" class="actions-btn bs-select-all btn btn-default">' +
                    this.options.selectAllText +
                    '</button>' +
                    '<button type="button" class="actions-btn bs-deselect-all btn btn-default">' +
                    this.options.deselectAllText +
                    '</button>' +
                    '</div>' +
                    '</div>' :
                    '';
                var donebutton = this.multiple && this.options.doneButton ?
                    '<div class="bs-donebutton">' +
                    '<div class="btn-group btn-block">' +
                    '<button type="button" class="btn btn-sm btn-default">' +
                    this.options.doneButtonText +
                    '</button>' +
                    '</div>' +
                    '</div>' :
                    '';
                var drop =
                    '<div class="btn-group bootstrap-select' + showTick + inputGroup + '">' +
                    '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + autofocus + ' role="button">' +
                    '<span class="filter-option pull-left"></span>&nbsp;' +
                    '<span class="bs-caret">' +
                    this.options.template.caret +
                    '</span>' +
                    '</button>' +
                    '<div class="dropdown-menu open" role="combobox">' +
                    header +
                    searchbox +
                    actionsbox +
                    '<ul class="dropdown-menu inner" role="listbox" aria-expanded="false">' +
                    '</ul>' +
                    donebutton +
                    '</div>' +
                    '</div>';

                return $(drop);
            },

            createView: function() {
                var $drop = this.createDropdown(),
                    li = this.createLi();

                $drop.find('ul')[0].innerHTML = li;
                return $drop;
            },

            reloadLi: function() {
                // rebuild
                var li = this.createLi();
                this.$menuInner[0].innerHTML = li;
            },

            createLi: function() {
                var that = this,
                    _li = [],
                    optID = 0,
                    titleOption = document.createElement('option'),
                    liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure liObj is correct

                // Helper functions
                /**
                 * @param content
                 * @param [index]
                 * @param [classes]
                 * @param [optgroup]
                 * @returns {string}
                 */
                var generateLI = function(content, index, classes, optgroup) {
                    return '<li' +
                        ((typeof classes !== 'undefined' && '' !== classes) ? ' class="' + classes + '"' : '') +
                        ((typeof index !== 'undefined' && null !== index) ? ' data-original-index="' + index + '"' : '') +
                        ((typeof optgroup !== 'undefined' && null !== optgroup) ? 'data-optgroup="' + optgroup + '"' : '') +
                        '>' + content + '</li>';
                };

                /**
                 * @param text
                 * @param [classes]
                 * @param [inline]
                 * @param [tokens]
                 * @returns {string}
                 */
                var generateA = function(text, classes, inline, tokens) {
                    return '<a tabindex="0"' +
                        (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
                        (inline ? ' style="' + inline + '"' : '') +
                        (that.options.liveSearchNormalize ? ' data-normalized-text="' + normalizeToBase(htmlEscape($(text).html())) + '"' : '') +
                        (typeof tokens !== 'undefined' || tokens !== null ? ' data-tokens="' + tokens + '"' : '') +
                        ' role="option">' + text +
                        '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
                        '</a>';
                };

                if (this.options.title && !this.multiple) {
                    // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
                    // since liObj is recalculated on every refresh, liIndex needs to be decreased even if the titleOption is already appended
                    liIndex--;

                    if (!this.$element.find('.bs-title-option').length) {
                        // Use native JS to prepend option (faster)
                        var element = this.$element[0];
                        titleOption.className = 'bs-title-option';
                        titleOption.innerHTML = this.options.title;
                        titleOption.value = '';
                        element.insertBefore(titleOption, element.firstChild);
                        // Check if selected or data-selected attribute is already set on an option. If not, select the titleOption option.
                        // the selected item may have been changed by user or programmatically before the bootstrap select plugin runs,
                        // if so, the select will have the data-selected attribute
                        var $opt = $(element.options[element.selectedIndex]);
                        if ($opt.attr('selected') === undefined && this.$element.data('selected') === undefined) {
                            titleOption.selected = true;
                        }
                    }
                }

                var $selectOptions = this.$element.find('option');

                $selectOptions.each(function(index) {
                    var $this = $(this);

                    liIndex++;

                    if ($this.hasClass('bs-title-option')) return;

                    // Get the class and text for the option
                    var optionClass = this.className || '',
                        inline = htmlEscape(this.style.cssText),
                        text = $this.data('content') ? $this.data('content') : $this.html(),
                        tokens = $this.data('tokens') ? $this.data('tokens') : null,
                        subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.data('subtext') + '</small>' : '',
                        icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
                        $parent = $this.parent(),
                        isOptgroup = $parent[0].tagName === 'OPTGROUP',
                        isOptgroupDisabled = isOptgroup && $parent[0].disabled,
                        isDisabled = this.disabled || isOptgroupDisabled,
                        prevHiddenIndex;

                    if (icon !== '' && isDisabled) {
                        icon = '<span>' + icon + '</span>';
                    }

                    if (that.options.hideDisabled && (isDisabled && !isOptgroup || isOptgroupDisabled)) {
                        // set prevHiddenIndex - the index of the first hidden option in a group of hidden options
                        // used to determine whether or not a divider should be placed after an optgroup if there are
                        // hidden options between the optgroup and the first visible option
                        prevHiddenIndex = $this.data('prevHiddenIndex');
                        $this.next().data('prevHiddenIndex', (prevHiddenIndex !== undefined ? prevHiddenIndex : index));

                        liIndex--;
                        return;
                    }

                    if (!$this.data('content')) {
                        // Prepend any icon and append any subtext to the main text.
                        text = icon + '<span class="text">' + text + subtext + '</span>';
                    }

                    if (isOptgroup && $this.data('divider') !== true) {
                        if (that.options.hideDisabled && isDisabled) {
                            if ($parent.data('allOptionsDisabled') === undefined) {
                                var $options = $parent.children();
                                $parent.data('allOptionsDisabled', $options.filter(':disabled').length === $options.length);
                            }

                            if ($parent.data('allOptionsDisabled')) {
                                liIndex--;
                                return;
                            }
                        }

                        var optGroupClass = ' ' + $parent[0].className || '';

                        if ($this.index() === 0) { // Is it the first option of the optgroup?
                            optID += 1;

                            // Get the opt group label
                            var label = $parent[0].label,
                                labelSubtext = typeof $parent.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $parent.data('subtext') + '</small>' : '',
                                labelIcon = $parent.data('icon') ? '<span class="' + that.options.iconBase + ' ' + $parent.data('icon') + '"></span> ' : '';

                            label = labelIcon + '<span class="text">' + htmlEscape(label) + labelSubtext + '</span>';

                            if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
                                liIndex++;
                                _li.push(generateLI('', null, 'divider', optID + 'div'));
                            }
                            liIndex++;
                            _li.push(generateLI(label, null, 'dropdown-header' + optGroupClass, optID));
                        }

                        if (that.options.hideDisabled && isDisabled) {
                            liIndex--;
                            return;
                        }

                        _li.push(generateLI(generateA(text, 'opt ' + optionClass + optGroupClass, inline, tokens), index, '', optID));
                    } else if ($this.data('divider') === true) {
                        _li.push(generateLI('', index, 'divider'));
                    } else if ($this.data('hidden') === true) {
                        // set prevHiddenIndex - the index of the first hidden option in a group of hidden options
                        // used to determine whether or not a divider should be placed after an optgroup if there are
                        // hidden options between the optgroup and the first visible option
                        prevHiddenIndex = $this.data('prevHiddenIndex');
                        $this.next().data('prevHiddenIndex', (prevHiddenIndex !== undefined ? prevHiddenIndex : index));

                        _li.push(generateLI(generateA(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
                    } else {
                        var showDivider = this.previousElementSibling && this.previousElementSibling.tagName === 'OPTGROUP';

                        // if previous element is not an optgroup and hideDisabled is true
                        if (!showDivider && that.options.hideDisabled) {
                            prevHiddenIndex = $this.data('prevHiddenIndex');

                            if (prevHiddenIndex !== undefined) {
                                // select the element **before** the first hidden element in the group
                                var prevHidden = $selectOptions.eq(prevHiddenIndex)[0].previousElementSibling;

                                if (prevHidden && prevHidden.tagName === 'OPTGROUP' && !prevHidden.disabled) {
                                    showDivider = true;
                                }
                            }
                        }

                        if (showDivider) {
                            liIndex++;
                            _li.push(generateLI('', null, 'divider', optID + 'div'));
                        }
                        _li.push(generateLI(generateA(text, optionClass, inline, tokens), index));
                    }

                    that.liObj[index] = liIndex;
                });

                //If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
                if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
                    this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
                }

                return _li.join('');
            },

            findLis: function() {
                if (this.$lis == null) this.$lis = this.$menu.find('li');
                return this.$lis;
            },

            /**
             * @param [updateLi] defaults to true
             */
            render: function(updateLi) {
                var that = this,
                    notDisabled,
                    $selectOptions = this.$element.find('option');

                //Update the LI to match the SELECT
                if (updateLi !== false) {
                    $selectOptions.each(function(index) {
                        var $lis = that.findLis().eq(that.liObj[index]);

                        that.setDisabled(index, this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled, $lis);
                        that.setSelected(index, this.selected, $lis);
                    });
                }

                this.togglePlaceholder();

                this.tabIndex();

                var selectedItems = $selectOptions.map(function() {
                    if (this.selected) {
                        if (that.options.hideDisabled && (this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled)) return;

                        var $this = $(this),
                            icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '',
                            subtext;

                        if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
                            subtext = ' <small class="text-muted">' + $this.data('subtext') + '</small>';
                        } else {
                            subtext = '';
                        }
                        if (typeof $this.attr('title') !== 'undefined') {
                            return $this.attr('title');
                        } else if ($this.data('content') && that.options.showContent) {
                            return $this.data('content').toString();
                        } else {
                            return icon + $this.html() + subtext;
                        }
                    }
                }).toArray();

                //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
                //Convert all the values into a comma delimited string
                var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

                //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
                if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
                    var max = this.options.selectedTextFormat.split('>');
                    if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
                        notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
                        var totalCount = $selectOptions.not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
                            tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
                        title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
                    }
                }

                if (this.options.title == undefined) {
                    this.options.title = this.$element.attr('title');
                }

                if (this.options.selectedTextFormat == 'static') {
                    title = this.options.title;
                }

                //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
                if (!title) {
                    title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
                }

                //strip all HTML tags and trim the result, then unescape any escaped tags
                this.$button.attr('title', htmlUnescape($.trim(title.replace(/<[^>]*>?/g, ''))));
                this.$button.children('.filter-option').html(title);

                this.$element.trigger('rendered.bs.select');
            },

            /**
             * @param [style]
             * @param [status]
             */
            setStyle: function(style, status) {
                if (this.$element.attr('class')) {
                    this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
                }

                var buttonClass = style ? style : this.options.style;

                if (status == 'add') {
                    this.$button.addClass(buttonClass);
                } else if (status == 'remove') {
                    this.$button.removeClass(buttonClass);
                } else {
                    this.$button.removeClass(this.options.style);
                    this.$button.addClass(buttonClass);
                }
            },

            liHeight: function(refresh) {
                if (!refresh && (this.options.size === false || this.sizeInfo)) return;

                var newElement = document.createElement('div'),
                    menu = document.createElement('div'),
                    menuInner = document.createElement('ul'),
                    divider = document.createElement('li'),
                    li = document.createElement('li'),
                    a = document.createElement('a'),
                    text = document.createElement('span'),
                    header = this.options.header && this.$menu.find('.popover-title').length > 0 ? this.$menu.find('.popover-title')[0].cloneNode(true) : null,
                    search = this.options.liveSearch ? document.createElement('div') : null,
                    actions = this.options.actionsBox && this.multiple && this.$menu.find('.bs-actionsbox').length > 0 ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
                    doneButton = this.options.doneButton && this.multiple && this.$menu.find('.bs-donebutton').length > 0 ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

                text.className = 'text';
                newElement.className = this.$menu[0].parentNode.className + ' open';
                menu.className = 'dropdown-menu open';
                menuInner.className = 'dropdown-menu inner';
                divider.className = 'divider';

                text.appendChild(document.createTextNode('Inner text'));
                a.appendChild(text);
                li.appendChild(a);
                menuInner.appendChild(li);
                menuInner.appendChild(divider);
                if (header) menu.appendChild(header);
                if (search) {
                    var input = document.createElement('input');
                    search.className = 'bs-searchbox';
                    input.className = 'form-control';
                    search.appendChild(input);
                    menu.appendChild(search);
                }
                if (actions) menu.appendChild(actions);
                menu.appendChild(menuInner);
                if (doneButton) menu.appendChild(doneButton);
                newElement.appendChild(menu);

                document.body.appendChild(newElement);

                var liHeight = a.offsetHeight,
                    headerHeight = header ? header.offsetHeight : 0,
                    searchHeight = search ? search.offsetHeight : 0,
                    actionsHeight = actions ? actions.offsetHeight : 0,
                    doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
                    dividerHeight = $(divider).outerHeight(true),
                    // fall back to jQuery if getComputedStyle is not supported
                    menuStyle = typeof getComputedStyle === 'function' ? getComputedStyle(menu) : false,
                    $menu = menuStyle ? null : $(menu),
                    menuPadding = {
                        vert: parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) +
                            parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) +
                            parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) +
                            parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
                        horiz: parseInt(menuStyle ? menuStyle.paddingLeft : $menu.css('paddingLeft')) +
                            parseInt(menuStyle ? menuStyle.paddingRight : $menu.css('paddingRight')) +
                            parseInt(menuStyle ? menuStyle.borderLeftWidth : $menu.css('borderLeftWidth')) +
                            parseInt(menuStyle ? menuStyle.borderRightWidth : $menu.css('borderRightWidth'))
                    },
                    menuExtras = {
                        vert: menuPadding.vert +
                            parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) +
                            parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2,
                        horiz: menuPadding.horiz +
                            parseInt(menuStyle ? menuStyle.marginLeft : $menu.css('marginLeft')) +
                            parseInt(menuStyle ? menuStyle.marginRight : $menu.css('marginRight')) + 2
                    }

                document.body.removeChild(newElement);

                this.sizeInfo = {
                    liHeight: liHeight,
                    headerHeight: headerHeight,
                    searchHeight: searchHeight,
                    actionsHeight: actionsHeight,
                    doneButtonHeight: doneButtonHeight,
                    dividerHeight: dividerHeight,
                    menuPadding: menuPadding,
                    menuExtras: menuExtras
                };
            },

            setSize: function() {
                this.findLis();
                this.liHeight();

                if (this.options.header) this.$menu.css('padding-top', 0);
                if (this.options.size === false) return;

                var that = this,
                    $menu = this.$menu,
                    $menuInner = this.$menuInner,
                    $window = $(window),
                    selectHeight = this.$newElement[0].offsetHeight,
                    selectWidth = this.$newElement[0].offsetWidth,
                    liHeight = this.sizeInfo['liHeight'],
                    headerHeight = this.sizeInfo['headerHeight'],
                    searchHeight = this.sizeInfo['searchHeight'],
                    actionsHeight = this.sizeInfo['actionsHeight'],
                    doneButtonHeight = this.sizeInfo['doneButtonHeight'],
                    divHeight = this.sizeInfo['dividerHeight'],
                    menuPadding = this.sizeInfo['menuPadding'],
                    menuExtras = this.sizeInfo['menuExtras'],
                    notDisabled = this.options.hideDisabled ? '.disabled' : '',
                    menuHeight,
                    menuWidth,
                    getHeight,
                    getWidth,
                    selectOffsetTop,
                    selectOffsetBot,
                    selectOffsetLeft,
                    selectOffsetRight,
                    getPos = function() {
                        var pos = that.$newElement.offset(),
                            $container = $(that.options.container),
                            containerPos;

                        if (that.options.container && !$container.is('body')) {
                            containerPos = $container.offset();
                            containerPos.top += parseInt($container.css('borderTopWidth'));
                            containerPos.left += parseInt($container.css('borderLeftWidth'));
                        } else {
                            containerPos = {
                                top: 0,
                                left: 0
                            };
                        }

                        var winPad = that.options.windowPadding;
                        selectOffsetTop = pos.top - containerPos.top - $window.scrollTop();
                        selectOffsetBot = $window.height() - selectOffsetTop - selectHeight - containerPos.top - winPad[2];
                        selectOffsetLeft = pos.left - containerPos.left - $window.scrollLeft();
                        selectOffsetRight = $window.width() - selectOffsetLeft - selectWidth - containerPos.left - winPad[1];
                        selectOffsetTop -= winPad[0];
                        selectOffsetLeft -= winPad[3];
                    };

                getPos();

                if (this.options.size === 'auto') {
                    var getSize = function() {
                        var minHeight,
                            hasClass = function(className, include) {
                                return function(element) {
                                    if (include) {
                                        return (element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                                    } else {
                                        return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                                    }
                                };
                            },
                            lis = that.$menuInner[0].getElementsByTagName('li'),
                            lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('hidden', false)) : that.$lis.not('.hidden'),
                            optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

                        getPos();
                        menuHeight = selectOffsetBot - menuExtras.vert;
                        menuWidth = selectOffsetRight - menuExtras.horiz;

                        if (that.options.container) {
                            if (!$menu.data('height')) $menu.data('height', $menu.height());
                            getHeight = $menu.data('height');

                            if (!$menu.data('width')) $menu.data('width', $menu.width());
                            getWidth = $menu.data('width');
                        } else {
                            getHeight = $menu.height();
                            getWidth = $menu.width();
                        }

                        if (that.options.dropupAuto) {
                            that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
                        }

                        if (that.$newElement.hasClass('dropup')) {
                            menuHeight = selectOffsetTop - menuExtras.vert;
                        }

                        if (that.options.dropdownAlignRight === 'auto') {
                            $menu.toggleClass('dropdown-menu-right', selectOffsetLeft > selectOffsetRight && (menuWidth - menuExtras.horiz) < (getWidth - selectWidth));
                        }

                        if ((lisVisible.length + optGroup.length) > 3) {
                            minHeight = liHeight * 3 + menuExtras.vert - 2;
                        } else {
                            minHeight = 0;
                        }

                        $menu.css({
                            'max-height': menuHeight + 'px',
                            'overflow': 'hidden',
                            'min-height': minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px'
                        });
                        $menuInner.css({
                            'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding.vert + 'px',
                            'overflow-y': 'auto',
                            'min-height': Math.max(minHeight - menuPadding.vert, 0) + 'px'
                        });
                    };
                    getSize();
                    this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
                    $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
                } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
                    var optIndex = this.$lis.not('.divider').not(notDisabled).children().slice(0, this.options.size).last().parent().index(),
                        divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
                    menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding.vert;

                    if (that.options.container) {
                        if (!$menu.data('height')) $menu.data('height', $menu.height());
                        getHeight = $menu.data('height');
                    } else {
                        getHeight = $menu.height();
                    }

                    if (that.options.dropupAuto) {
                        //noinspection JSUnusedAssignment
                        this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
                    }
                    $menu.css({
                        'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
                        'overflow': 'hidden',
                        'min-height': ''
                    });
                    $menuInner.css({
                        'max-height': menuHeight - menuPadding.vert + 'px',
                        'overflow-y': 'auto',
                        'min-height': ''
                    });
                }
            },

            setWidth: function() {
                if (this.options.width === 'auto') {
                    this.$menu.css('min-width', '0');

                    // Get correct width if element is hidden
                    var $selectClone = this.$menu.parent().clone().appendTo('body'),
                        $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone,
                        ulWidth = $selectClone.children('.dropdown-menu').outerWidth(),
                        btnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

                    $selectClone.remove();
                    $selectClone2.remove();

                    // Set width to whatever's larger, button title or longest option
                    this.$newElement.css('width', Math.max(ulWidth, btnWidth) + 'px');
                } else if (this.options.width === 'fit') {
                    // Remove inline min-width so width can be changed from 'auto'
                    this.$menu.css('min-width', '');
                    this.$newElement.css('width', '').addClass('fit-width');
                } else if (this.options.width) {
                    // Remove inline min-width so width can be changed from 'auto'
                    this.$menu.css('min-width', '');
                    this.$newElement.css('width', this.options.width);
                } else {
                    // Remove inline min-width/width so width can be changed
                    this.$menu.css('min-width', '');
                    this.$newElement.css('width', '');
                }
                // Remove fit-width class if width is changed programmatically
                if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
                    this.$newElement.removeClass('fit-width');
                }
            },

            selectPosition: function() {
                this.$bsContainer = $('<div class="bs-container" />');

                var that = this,
                    $container = $(this.options.container),
                    pos,
                    containerPos,
                    actualHeight,
                    getPlacement = function($element) {
                        that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
                        pos = $element.offset();

                        if (!$container.is('body')) {
                            containerPos = $container.offset();
                            containerPos.top += parseInt($container.css('borderTopWidth')) - $container.scrollTop();
                            containerPos.left += parseInt($container.css('borderLeftWidth')) - $container.scrollLeft();
                        } else {
                            containerPos = {
                                top: 0,
                                left: 0
                            };
                        }

                        actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;

                        that.$bsContainer.css({
                            'top': pos.top - containerPos.top + actualHeight,
                            'left': pos.left - containerPos.left,
                            'width': $element[0].offsetWidth
                        });
                    };

                this.$button.on('click', function() {
                    var $this = $(this);

                    if (that.isDisabled()) {
                        return;
                    }

                    getPlacement(that.$newElement);

                    that.$bsContainer
                        .appendTo(that.options.container)
                        .toggleClass('open', !$this.hasClass('open'))
                        .append(that.$menu);
                });

                $(window).on('resize scroll', function() {
                    getPlacement(that.$newElement);
                });

                this.$element.on('hide.bs.select', function() {
                    that.$menu.data('height', that.$menu.height());
                    that.$bsContainer.detach();
                });
            },

            /**
             * @param {number} index - the index of the option that is being changed
             * @param {boolean} selected - true if the option is being selected, false if being deselected
             * @param {JQuery} $lis - the 'li' element that is being modified
             */
            setSelected: function(index, selected, $lis) {
                if (!$lis) {
                    this.togglePlaceholder(); // check if setSelected is being called by changing the value of the select
                    $lis = this.findLis().eq(this.liObj[index]);
                }

                $lis.toggleClass('selected', selected).find('a').attr('aria-selected', selected);
            },

            /**
             * @param {number} index - the index of the option that is being disabled
             * @param {boolean} disabled - true if the option is being disabled, false if being enabled
             * @param {JQuery} $lis - the 'li' element that is being modified
             */
            setDisabled: function(index, disabled, $lis) {
                if (!$lis) {
                    $lis = this.findLis().eq(this.liObj[index]);
                }

                if (disabled) {
                    $lis.addClass('disabled').children('a').attr('href', '#').attr('tabindex', -1).attr('aria-disabled', true);
                } else {
                    $lis.removeClass('disabled').children('a').removeAttr('href').attr('tabindex', 0).attr('aria-disabled', false);
                }
            },

            isDisabled: function() {
                return this.$element[0].disabled;
            },

            checkDisabled: function() {
                var that = this;

                if (this.isDisabled()) {
                    this.$newElement.addClass('disabled');
                    this.$button.addClass('disabled').attr('tabindex', -1).attr('aria-disabled', true);
                } else {
                    if (this.$button.hasClass('disabled')) {
                        this.$newElement.removeClass('disabled');
                        this.$button.removeClass('disabled').attr('aria-disabled', false);
                    }

                    if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
                        this.$button.removeAttr('tabindex');
                    }
                }

                this.$button.click(function() {
                    return !that.isDisabled();
                });
            },

            togglePlaceholder: function() {
                var value = this.$element.val();
                this.$button.toggleClass('bs-placeholder', value === null || value === '' || (value.constructor === Array && value.length === 0));
            },

            tabIndex: function() {
                if (this.$element.data('tabindex') !== this.$element.attr('tabindex') &&
                    (this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98')) {
                    this.$element.data('tabindex', this.$element.attr('tabindex'));
                    this.$button.attr('tabindex', this.$element.data('tabindex'));
                }

                this.$element.attr('tabindex', -98);
            },

            clickListener: function() {
                var that = this,
                    $document = $(document);

                $document.data('spaceSelect', false);

                this.$button.on('keyup', function(e) {
                    if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
                        e.preventDefault();
                        $document.data('spaceSelect', false);
                    }
                });

                this.$button.on('click', function() {
                    that.setSize();
                });

                this.$element.on('shown.bs.select', function() {
                    if (!that.options.liveSearch && !that.multiple) {
                        that.$menuInner.find('.selected a').focus();
                    } else if (!that.multiple) {
                        var selectedIndex = that.liObj[that.$element[0].selectedIndex];

                        if (typeof selectedIndex !== 'number' || that.options.size === false) return;

                        // scroll to selected option
                        var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
                        offset = offset - that.$menuInner[0].offsetHeight / 2 + that.sizeInfo.liHeight / 2;
                        that.$menuInner[0].scrollTop = offset;
                    }
                });

                this.$menuInner.on('click', 'li a', function(e) {
                    var $this = $(this),
                        clickedIndex = $this.parent().data('originalIndex'),
                        prevValue = that.$element.val(),
                        prevIndex = that.$element.prop('selectedIndex'),
                        triggerChange = true;

                    // Don't close on multi choice menu
                    if (that.multiple && that.options.maxOptions !== 1) {
                        e.stopPropagation();
                    }

                    e.preventDefault();

                    //Don't run if we have been disabled
                    if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
                        var $options = that.$element.find('option'),
                            $option = $options.eq(clickedIndex),
                            state = $option.prop('selected'),
                            $optgroup = $option.parent('optgroup'),
                            maxOptions = that.options.maxOptions,
                            maxOptionsGrp = $optgroup.data('maxOptions') || false;

                        if (!that.multiple) { // Deselect all others if not multi select box
                            $options.prop('selected', false);
                            $option.prop('selected', true);
                            that.$menuInner.find('.selected').removeClass('selected').find('a').attr('aria-selected', false);
                            that.setSelected(clickedIndex, true);
                        } else { // Toggle the one we have chosen if we are multi select.
                            $option.prop('selected', !state);
                            that.setSelected(clickedIndex, !state);
                            $this.blur();

                            if (maxOptions !== false || maxOptionsGrp !== false) {
                                var maxReached = maxOptions < $options.filter(':selected').length,
                                    maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

                                if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                                    if (maxOptions && maxOptions == 1) {
                                        $options.prop('selected', false);
                                        $option.prop('selected', true);
                                        that.$menuInner.find('.selected').removeClass('selected');
                                        that.setSelected(clickedIndex, true);
                                    } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                                        $optgroup.find('option:selected').prop('selected', false);
                                        $option.prop('selected', true);
                                        var optgroupID = $this.parent().data('optgroup');
                                        that.$menuInner.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                                        that.setSelected(clickedIndex, true);
                                    } else {
                                        var maxOptionsText = typeof that.options.maxOptionsText === 'string' ? [that.options.maxOptionsText, that.options.maxOptionsText] : that.options.maxOptionsText,
                                            maxOptionsArr = typeof maxOptionsText === 'function' ? maxOptionsText(maxOptions, maxOptionsGrp) : maxOptionsText,
                                            maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                                            maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                                            $notify = $('<div class="notify"></div>');
                                        // If {var} is set in array, replace it
                                        /** @deprecated */
                                        if (maxOptionsArr[2]) {
                                            maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                                            maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                                        }

                                        $option.prop('selected', false);

                                        that.$menu.append($notify);

                                        if (maxOptions && maxReached) {
                                            $notify.append($('<div>' + maxTxt + '</div>'));
                                            triggerChange = false;
                                            that.$element.trigger('maxReached.bs.select');
                                        }

                                        if (maxOptionsGrp && maxReachedGrp) {
                                            $notify.append($('<div>' + maxTxtGrp + '</div>'));
                                            triggerChange = false;
                                            that.$element.trigger('maxReachedGrp.bs.select');
                                        }

                                        setTimeout(function() {
                                            that.setSelected(clickedIndex, false);
                                        }, 10);

                                        $notify.delay(750).fadeOut(300, function() {
                                            $(this).remove();
                                        });
                                    }
                                }
                            }
                        }

                        if (!that.multiple || (that.multiple && that.options.maxOptions === 1)) {
                            that.$button.focus();
                        } else if (that.options.liveSearch) {
                            that.$searchbox.focus();
                        }

                        // Trigger select 'change'
                        if (triggerChange) {
                            if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
                                // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
                                changed_arguments = [clickedIndex, $option.prop('selected'), state];
                                that.$element
                                    .triggerNative('change');
                            }
                        }
                    }
                });

                this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function(e) {
                    if (e.currentTarget == this) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (that.options.liveSearch && !$(e.target).hasClass('close')) {
                            that.$searchbox.focus();
                        } else {
                            that.$button.focus();
                        }
                    }
                });

                this.$menuInner.on('click', '.divider, .dropdown-header', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (that.options.liveSearch) {
                        that.$searchbox.focus();
                    } else {
                        that.$button.focus();
                    }
                });

                this.$menu.on('click', '.popover-title .close', function() {
                    that.$button.click();
                });

                this.$searchbox.on('click', function(e) {
                    e.stopPropagation();
                });

                this.$menu.on('click', '.actions-btn', function(e) {
                    if (that.options.liveSearch) {
                        that.$searchbox.focus();
                    } else {
                        that.$button.focus();
                    }

                    e.preventDefault();
                    e.stopPropagation();

                    if ($(this).hasClass('bs-select-all')) {
                        that.selectAll();
                    } else {
                        that.deselectAll();
                    }
                });

                this.$element.change(function() {
                    that.render(false);
                    that.$element.trigger('changed.bs.select', changed_arguments);
                    changed_arguments = null;
                });
            },

            liveSearchListener: function() {
                var that = this,
                    $no_results = $('<li class="no-results"></li>');

                this.$button.on('click.dropdown.data-api', function() {
                    that.$menuInner.find('.active').removeClass('active');
                    if (!!that.$searchbox.val()) {
                        that.$searchbox.val('');
                        that.$lis.not('.is-hidden').removeClass('hidden');
                        if (!!$no_results.parent().length) $no_results.remove();
                    }
                    if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
                    setTimeout(function() {
                        that.$searchbox.focus();
                    }, 10);
                });

                this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function(e) {
                    e.stopPropagation();
                });

                this.$searchbox.on('input propertychange', function() {
                    that.$lis.not('.is-hidden').removeClass('hidden');
                    that.$lis.filter('.active').removeClass('active');
                    $no_results.remove();

                    if (that.$searchbox.val()) {
                        var $searchBase = that.$lis.not('.is-hidden, .divider, .dropdown-header'),
                            $hideItems;
                        if (that.options.liveSearchNormalize) {
                            $hideItems = $searchBase.not(':a' + that._searchStyle() + '("' + normalizeToBase(that.$searchbox.val()) + '")');
                        } else {
                            $hideItems = $searchBase.not(':' + that._searchStyle() + '("' + that.$searchbox.val() + '")');
                        }

                        if ($hideItems.length === $searchBase.length) {
                            $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"'));
                            that.$menuInner.append($no_results);
                            that.$lis.addClass('hidden');
                        } else {
                            $hideItems.addClass('hidden');

                            var $lisVisible = that.$lis.not('.hidden'),
                                $foundDiv;

                            // hide divider if first or last visible, or if followed by another divider
                            $lisVisible.each(function(index) {
                                var $this = $(this);

                                if ($this.hasClass('divider')) {
                                    if ($foundDiv === undefined) {
                                        $this.addClass('hidden');
                                    } else {
                                        if ($foundDiv) $foundDiv.addClass('hidden');
                                        $foundDiv = $this;
                                    }
                                } else if ($this.hasClass('dropdown-header') && $lisVisible.eq(index + 1).data('optgroup') !== $this.data('optgroup')) {
                                    $this.addClass('hidden');
                                } else {
                                    $foundDiv = null;
                                }
                            });
                            if ($foundDiv) $foundDiv.addClass('hidden');

                            $searchBase.not('.hidden').first().addClass('active');
                            that.$menuInner.scrollTop(0);
                        }
                    }
                });
            },

            _searchStyle: function() {
                var styles = {
                    begins: 'ibegins',
                    startsWith: 'ibegins'
                };

                return styles[this.options.liveSearchStyle] || 'icontains';
            },

            val: function(value) {
                if (typeof value !== 'undefined') {
                    this.$element.val(value);
                    this.render();

                    return this.$element;
                } else {
                    return this.$element.val();
                }
            },

            changeAll: function(status) {
                if (!this.multiple) return;
                if (typeof status === 'undefined') status = true;

                this.findLis();

                var $options = this.$element.find('option'),
                    $lisVisible = this.$lis.not('.divider, .dropdown-header, .disabled, .hidden'),
                    lisVisLen = $lisVisible.length,
                    selectedOptions = [];

                if (status) {
                    if ($lisVisible.filter('.selected').length === $lisVisible.length) return;
                } else {
                    if ($lisVisible.filter('.selected').length === 0) return;
                }

                $lisVisible.toggleClass('selected', status);

                for (var i = 0; i < lisVisLen; i++) {
                    var origIndex = $lisVisible[i].getAttribute('data-original-index');
                    selectedOptions[selectedOptions.length] = $options.eq(origIndex)[0];
                }

                $(selectedOptions).prop('selected', status);

                this.render(false);

                this.togglePlaceholder();

                this.$element
                    .triggerNative('change');
            },

            selectAll: function() {
                return this.changeAll(true);
            },

            deselectAll: function() {
                return this.changeAll(false);
            },

            toggle: function(e) {
                e = e || window.event;

                if (e) e.stopPropagation();

                this.$button.trigger('click');
            },

            keydown: function(e) {
                var $this = $(this),
                    $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
                    $items,
                    that = $parent.data('this'),
                    index,
                    prevIndex,
                    isActive,
                    selector = ':not(.disabled, .hidden, .dropdown-header, .divider)',
                    keyCodeMap = {
                        32: ' ',
                        48: '0',
                        49: '1',
                        50: '2',
                        51: '3',
                        52: '4',
                        53: '5',
                        54: '6',
                        55: '7',
                        56: '8',
                        57: '9',
                        59: ';',
                        65: 'a',
                        66: 'b',
                        67: 'c',
                        68: 'd',
                        69: 'e',
                        70: 'f',
                        71: 'g',
                        72: 'h',
                        73: 'i',
                        74: 'j',
                        75: 'k',
                        76: 'l',
                        77: 'm',
                        78: 'n',
                        79: 'o',
                        80: 'p',
                        81: 'q',
                        82: 'r',
                        83: 's',
                        84: 't',
                        85: 'u',
                        86: 'v',
                        87: 'w',
                        88: 'x',
                        89: 'y',
                        90: 'z',
                        96: '0',
                        97: '1',
                        98: '2',
                        99: '3',
                        100: '4',
                        101: '5',
                        102: '6',
                        103: '7',
                        104: '8',
                        105: '9'
                    };


                isActive = that.$newElement.hasClass('open');

                if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 65 && e.keyCode <= 90)) {
                    if (!that.options.container) {
                        that.setSize();
                        that.$menu.parent().addClass('open');
                        isActive = true;
                    } else {
                        that.$button.trigger('click');
                    }
                    that.$searchbox.focus();
                    return;
                }

                if (that.options.liveSearch) {
                    if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive) {
                        e.preventDefault();
                        e.stopPropagation();
                        that.$menuInner.click();
                        that.$button.focus();
                    }
                }

                if (/(38|40)/.test(e.keyCode.toString(10))) {
                    $items = that.$lis.filter(selector);
                    if (!$items.length) return;

                    if (!that.options.liveSearch) {
                        index = $items.index($items.find('a').filter(':focus').parent());
                    } else {
                        index = $items.index($items.filter('.active'));
                    }

                    prevIndex = that.$menuInner.data('prevIndex');

                    if (e.keyCode == 38) {
                        if ((that.options.liveSearch || index == prevIndex) && index != -1) index--;
                        if (index < 0) index += $items.length;
                    } else if (e.keyCode == 40) {
                        if (that.options.liveSearch || index == prevIndex) index++;
                        index = index % $items.length;
                    }

                    that.$menuInner.data('prevIndex', index);

                    if (!that.options.liveSearch) {
                        $items.eq(index).children('a').focus();
                    } else {
                        e.preventDefault();
                        if (!$this.hasClass('dropdown-toggle')) {
                            $items.removeClass('active').eq(index).addClass('active').children('a').focus();
                            $this.focus();
                        }
                    }

                } else if (!$this.is('input')) {
                    var keyIndex = [],
                        count,
                        prevKey;

                    $items = that.$lis.filter(selector);
                    $items.each(function(i) {
                        if ($.trim($(this).children('a').text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
                            keyIndex.push(i);
                        }
                    });

                    count = $(document).data('keycount');
                    count++;
                    $(document).data('keycount', count);

                    prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

                    if (prevKey != keyCodeMap[e.keyCode]) {
                        count = 1;
                        $(document).data('keycount', count);
                    } else if (count >= keyIndex.length) {
                        $(document).data('keycount', 0);
                        if (count > keyIndex.length) count = 1;
                    }

                    $items.eq(keyIndex[count - 1]).children('a').focus();
                }

                // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
                if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
                    if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
                    if (!that.options.liveSearch) {
                        var elem = $(':focus');
                        elem.click();
                        // Bring back focus for multiselects
                        elem.focus();
                        // Prevent screen from scrolling if the user hit the spacebar
                        e.preventDefault();
                        // Fixes spacebar selection of dropdown items in FF & IE
                        $(document).data('spaceSelect', true);
                    } else if (!/(32)/.test(e.keyCode.toString(10))) {
                        that.$menuInner.find('.active a').click();
                        $this.focus();
                    }
                    $(document).data('keycount', 0);
                }

                if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
                    that.$menu.parent().removeClass('open');
                    if (that.options.container) that.$newElement.removeClass('open');
                    that.$button.focus();
                }
            },

            mobile: function() {
                this.$element.addClass('mobile-device');
            },

            refresh: function() {
                this.$lis = null;
                this.liObj = {};
                this.reloadLi();
                this.render();
                this.checkDisabled();
                this.liHeight(true);
                this.setStyle();
                this.setWidth();
                if (this.$lis) this.$searchbox.trigger('propertychange');

                this.$element.trigger('refreshed.bs.select');
            },

            hide: function() {
                this.$newElement.hide();
            },

            show: function() {
                this.$newElement.show();
            },

            remove: function() {
                this.$newElement.remove();
                this.$element.remove();
            },

            destroy: function() {
                this.$newElement.before(this.$element).remove();

                if (this.$bsContainer) {
                    this.$bsContainer.remove();
                } else {
                    this.$menu.remove();
                }

                this.$element
                    .off('.bs.select')
                    .removeData('selectpicker')
                    .removeClass('bs-select-hidden selectpicker');
            }
        };

        // SELECTPICKER PLUGIN DEFINITION
        // ==============================
        function Plugin(option) {
            // get the args of the outer function..
            var args = arguments;
            // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
            // to get lost/corrupted in android 2.3 and IE9 #715 #775
            var _option = option;

            [].shift.apply(args);

            var value;
            var chain = this.each(function() {
                var $this = $(this);
                if ($this.is('select')) {
                    var data = $this.data('selectpicker'),
                        options = typeof _option == 'object' && _option;

                    if (!data) {
                        var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
                        config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), $this.data().template, options.template);
                        $this.data('selectpicker', (data = new Selectpicker(this, config)));
                    } else if (options) {
                        for (var i in options) {
                            if (options.hasOwnProperty(i)) {
                                data.options[i] = options[i];
                            }
                        }
                    }

                    if (typeof _option == 'string') {
                        if (data[_option] instanceof Function) {
                            value = data[_option].apply(data, args);
                        } else {
                            value = data.options[_option];
                        }
                    }
                }
            });

            if (typeof value !== 'undefined') {
                //noinspection JSUnusedAssignment
                return value;
            } else {
                return chain;
            }
        }

        var old = $.fn.selectpicker;
        $.fn.selectpicker = Plugin;
        $.fn.selectpicker.Constructor = Selectpicker;

        // SELECTPICKER NO CONFLICT
        // ========================
        $.fn.selectpicker.noConflict = function() {
            $.fn.selectpicker = old;
            return this;
        };

        $(document)
            .data('keycount', 0)
            .on('keydown.bs.select', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', Selectpicker.prototype.keydown)
            .on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', function(e) {
                e.stopPropagation();
            });

        // SELECTPICKER DATA-API
        // =====================
        $(window).on('load.bs.select.data-api', function() {
            $('.selectpicker').each(function() {
                var $selectpicker = $(this);
                Plugin.call($selectpicker, $selectpicker.data());
            })
        });
    })(jQuery);


}));;
/**
 * @file
 * Drupal Bootstrap object.
 */

/**
 * All Drupal Bootstrap JavaScript APIs are contained in this namespace.
 *
 * @namespace
 */
(function(_, $, Drupal, drupalSettings) {
    'use strict';

    var Bootstrap = {
        processedOnce: {},
        settings: drupalSettings.bootstrap || {}
    };

    /**
     * Wraps Drupal.checkPlain() to ensure value passed isn't empty.
     *
     * Encodes special characters in a plain-text string for display as HTML.
     *
     * @param {string} str
     *   The string to be encoded.
     *
     * @return {string}
     *   The encoded string.
     *
     * @ingroup sanitization
     */
    Bootstrap.checkPlain = function(str) {
        return str && Drupal.checkPlain(str) || '';
    };

    /**
     * Creates a jQuery plugin.
     *
     * @param {String} id
     *   A jQuery plugin identifier located in $.fn.
     * @param {Function} plugin
     *   A constructor function used to initialize the for the jQuery plugin.
     * @param {Boolean} [noConflict]
     *   Flag indicating whether or not to create a ".noConflict()" helper method
     *   for the plugin.
     */
    Bootstrap.createPlugin = function(id, plugin, noConflict) {
        // Immediately return if plugin doesn't exist.
        if ($.fn[id] !== void 0) {
            return this.fatal('Specified jQuery plugin identifier already exists: @id. Use Drupal.bootstrap.replacePlugin() instead.', {
                '@id': id
            });
        }

        // Immediately return if plugin isn't a function.
        if (typeof plugin !== 'function') {
            return this.fatal('You must provide a constructor function to create a jQuery plugin "@id": @plugin', {
                '@id': id,
                '@plugin': plugin
            });
        }

        // Add a ".noConflict()" helper method.
        this.pluginNoConflict(id, plugin, noConflict);

        $.fn[id] = plugin;
    };

    /**
     * Diff object properties.
     *
     * @param {...Object} objects
     *   Two or more objects. The first object will be used to return properties
     *   values.
     *
     * @return {Object}
     *   Returns the properties of the first passed object that are not present
     *   in all other passed objects.
     */
    Bootstrap.diffObjects = function(objects) {
        var args = Array.prototype.slice.call(arguments);
        return _.pick(args[0], _.difference.apply(_, _.map(args, function(obj) {
            return Object.keys(obj);
        })));
    };

    /**
     * Map of supported events by regular expression.
     *
     * @type {Object<Event|MouseEvent|KeyboardEvent|TouchEvent,RegExp>}
     */
    Bootstrap.eventMap = {
        Event: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        MouseEvent: /^(?:click|dblclick|mouse(?:down|enter|leave|up|over|move|out))$/,
        KeyboardEvent: /^(?:key(?:down|press|up))$/,
        TouchEvent: /^(?:touch(?:start|end|move|cancel))$/
    };

    /**
     * Extends a jQuery Plugin.
     *
     * @param {String} id
     *   A jQuery plugin identifier located in $.fn.
     * @param {Function} callback
     *   A constructor function used to initialize the for the jQuery plugin.
     *
     * @return {Function|Boolean}
     *   The jQuery plugin constructor or FALSE if the plugin does not exist.
     */
    Bootstrap.extendPlugin = function(id, callback) {
        // Immediately return if plugin doesn't exist.
        if (typeof $.fn[id] !== 'function') {
            return this.fatal('Specified jQuery plugin identifier does not exist: @id', {
                '@id': id
            });
        }

        // Immediately return if callback isn't a function.
        if (typeof callback !== 'function') {
            return this.fatal('You must provide a callback function to extend the jQuery plugin "@id": @callback', {
                '@id': id,
                '@callback': callback
            });
        }

        // Determine existing plugin constructor.
        var constructor = $.fn[id] && $.fn[id].Constructor || $.fn[id];
        var plugin = callback.apply(constructor, [this.settings]);
        if (!$.isPlainObject(plugin)) {
            return this.fatal('Returned value from callback is not a plain object that can be used to extend the jQuery plugin "@id": @obj', {
                '@obj': plugin
            });
        }

        this.wrapPluginConstructor(constructor, plugin, true);

        return $.fn[id];
    };

    Bootstrap.superWrapper = function(parent, fn) {
        return function() {
            var previousSuper = this.super;
            this.super = parent;
            var ret = fn.apply(this, arguments);
            if (previousSuper) {
                this.super = previousSuper;
            } else {
                delete this.super;
            }
            return ret;
        };
    };

    /**
     * Provide a helper method for displaying when something is went wrong.
     *
     * @param {String} message
     *   The message to display.
     * @param {Object} [args]
     *   An arguments to use in message.
     *
     * @return {Boolean}
     *   Always returns FALSE.
     */
    Bootstrap.fatal = function(message, args) {
        if (this.settings.dev && console.warn) {
            for (var name in args) {
                if (args.hasOwnProperty(name) && typeof args[name] === 'object') {
                    args[name] = JSON.stringify(args[name]);
                }
            }
            Drupal.throwError(new Error(Drupal.formatString(message, args)));
        }
        return false;
    };

    /**
     * Intersects object properties.
     *
     * @param {...Object} objects
     *   Two or more objects. The first object will be used to return properties
     *   values.
     *
     * @return {Object}
     *   Returns the properties of first passed object that intersects with all
     *   other passed objects.
     */
    Bootstrap.intersectObjects = function(objects) {
        var args = Array.prototype.slice.call(arguments);
        return _.pick(args[0], _.intersection.apply(_, _.map(args, function(obj) {
            return Object.keys(obj);
        })));
    };

    /**
     * Normalizes an object's values.
     *
     * @param {Object} obj
     *   The object to normalize.
     *
     * @return {Object}
     *   The normalized object.
     */
    Bootstrap.normalizeObject = function(obj) {
        if (!$.isPlainObject(obj)) {
            return obj;
        }

        for (var k in obj) {
            if (typeof obj[k] === 'string') {
                if (obj[k] === 'true') {
                    obj[k] = true;
                } else if (obj[k] === 'false') {
                    obj[k] = false;
                } else if (obj[k].match(/^[\d-.]$/)) {
                    obj[k] = parseFloat(obj[k]);
                }
            } else if ($.isPlainObject(obj[k])) {
                obj[k] = Bootstrap.normalizeObject(obj[k]);
            }
        }

        return obj;
    };

    /**
     * An object based once plugin (similar to jquery.once, but without the DOM).
     *
     * @param {String} id
     *   A unique identifier.
     * @param {Function} callback
     *   The callback to invoke if the identifier has not yet been seen.
     *
     * @return {Bootstrap}
     */
    Bootstrap.once = function(id, callback) {
        // Immediately return if identifier has already been processed.
        if (this.processedOnce[id]) {
            return this;
        }
        callback.call(this, this.settings);
        this.processedOnce[id] = true;
        return this;
    };

    /**
     * Provide jQuery UI like ability to get/set options for Bootstrap plugins.
     *
     * @param {string|object} key
     *   A string value of the option to set, can be dot like to a nested key.
     *   An object of key/value pairs.
     * @param {*} [value]
     *   (optional) A value to set for key.
     *
     * @returns {*}
     *   - Returns nothing if key is an object or both key and value parameters
     *   were provided to set an option.
     *   - Returns the a value for a specific setting if key was provided.
     *   - Returns an object of key/value pairs of all the options if no key or
     *   value parameter was provided.
     *
     * @see https://github.com/jquery/jquery-ui/blob/master/ui/widget.js
     */
    Bootstrap.option = function(key, value) {
        var options = $.isPlainObject(key) ? $.extend({}, key) : {};

        // Get all options (clone so it doesn't reference the internal object).
        if (arguments.length === 0) {
            return $.extend({}, this.options);
        }

        // Get/set single option.
        if (typeof key === "string") {
            // Handle nested keys in dot notation.
            // e.g., "foo.bar" => { foo: { bar: true } }
            var parts = key.split('.');
            key = parts.shift();
            var obj = options;
            if (parts.length) {
                for (var i = 0; i < parts.length - 1; i++) {
                    obj[parts[i]] = obj[parts[i]] || {};
                    obj = obj[parts[i]];
                }
                key = parts.pop();
            }

            // Get.
            if (arguments.length === 1) {
                return obj[key] === void 0 ? null : obj[key];
            }

            // Set.
            obj[key] = value;
        }

        // Set multiple options.
        $.extend(true, this.options, options);
    };

    /**
     * Adds a ".noConflict()" helper method if needed.
     *
     * @param {String} id
     *   A jQuery plugin identifier located in $.fn.
     * @param {Function} plugin
     * @param {Function} plugin
     *   A constructor function used to initialize the for the jQuery plugin.
     * @param {Boolean} [noConflict]
     *   Flag indicating whether or not to create a ".noConflict()" helper method
     *   for the plugin.
     */
    Bootstrap.pluginNoConflict = function(id, plugin, noConflict) {
        if (plugin.noConflict === void 0 && (noConflict === void 0 || noConflict)) {
            var old = $.fn[id];
            plugin.noConflict = function() {
                $.fn[id] = old;
                return this;
            };
        }
    };

    /**
     * Replaces a Bootstrap jQuery plugin definition.
     *
     * @param {String} id
     *   A jQuery plugin identifier located in $.fn.
     * @param {Function} callback
     *   A callback function that is immediately invoked and must return a
     *   function that will be used as the plugin constructor.
     * @param {Boolean} [noConflict]
     *   Flag indicating whether or not to create a ".noConflict()" helper method
     *   for the plugin.
     */
    Bootstrap.replacePlugin = function(id, callback, noConflict) {
        // Immediately return if plugin doesn't exist.
        if (typeof $.fn[id] !== 'function') {
            return this.fatal('Specified jQuery plugin identifier does not exist: @id', {
                '@id': id
            });
        }

        // Immediately return if callback isn't a function.
        if (typeof callback !== 'function') {
            return this.fatal('You must provide a valid callback function to replace a jQuery plugin: @callback', {
                '@callback': callback
            });
        }

        // Determine existing plugin constructor.
        var constructor = $.fn[id] && $.fn[id].Constructor || $.fn[id];
        var plugin = callback.apply(constructor, [this.settings]);

        // Immediately return if plugin isn't a function.
        if (typeof plugin !== 'function') {
            return this.fatal('Returned value from callback is not a usable function to replace a jQuery plugin "@id": @plugin', {
                '@id': id,
                '@plugin': plugin
            });
        }

        this.wrapPluginConstructor(constructor, plugin);

        // Add a ".noConflict()" helper method.
        this.pluginNoConflict(id, plugin, noConflict);

        $.fn[id] = plugin;
    };

    /**
     * Simulates a native event on an element in the browser.
     *
     * Note: This is a fairly complete modern implementation. If things aren't
     * working quite the way you intend (in older browsers), you may wish to use
     * the jQuery.simulate plugin. If it's available, this method will defer to
     * that plugin.
     *
     * @see https://github.com/jquery/jquery-simulate
     *
     * @param {HTMLElement|jQuery} element
     *   A DOM element to dispatch event on. Note: this may be a jQuery object,
     *   however be aware that this will trigger the same event for each element
     *   inside the jQuery collection; use with caution.
     * @param {String|String[]} type
     *   The type(s) of event to simulate.
     * @param {Object} [options]
     *   An object of options to pass to the event constructor. Typically, if
     *   an event is being proxied, you should just pass the original event
     *   object here. This allows, if the browser supports it, to be a truly
     *   simulated event.
     *
     * @return {Boolean}
     *   The return value is false if event is cancelable and at least one of the
     *   event handlers which handled this event called Event.preventDefault().
     *   Otherwise it returns true.
     */
    Bootstrap.simulate = function(element, type, options) {
        // Handle jQuery object wrappers so it triggers on each element.
        var ret = true;
        if (element instanceof $) {
            element.each(function() {
                if (!Bootstrap.simulate(this, type, options)) {
                    ret = false;
                }
            });
            return ret;
        }

        if (!(element instanceof HTMLElement)) {
            this.fatal('Passed element must be an instance of HTMLElement, got "@type" instead.', {
                '@type': typeof element,
            });
        }

        // Defer to the jQuery.simulate plugin, if it's available.
        if (typeof $.simulate === 'function') {
            new $.simulate(element, type, options);
            return true;
        }

        var event;
        var ctor;
        var types = [].concat(type);
        for (var i = 0, l = types.length; i < l; i++) {
            type = types[i];
            for (var name in this.eventMap) {
                if (this.eventMap[name].test(type)) {
                    ctor = name;
                    break;
                }
            }
            if (!ctor) {
                throw new SyntaxError('Only rudimentary HTMLEvents, KeyboardEvents and MouseEvents are supported: ' + type);
            }
            var opts = {
                bubbles: true,
                cancelable: true
            };
            if (ctor === 'KeyboardEvent' || ctor === 'MouseEvent') {
                $.extend(opts, {
                    ctrlKey: !1,
                    altKey: !1,
                    shiftKey: !1,
                    metaKey: !1
                });
            }
            if (ctor === 'MouseEvent') {
                $.extend(opts, {
                    button: 0,
                    pointerX: 0,
                    pointerY: 0,
                    view: window
                });
            }
            if (options) {
                $.extend(opts, options);
            }
            if (typeof window[ctor] === 'function') {
                event = new window[ctor](type, opts);
                if (!element.dispatchEvent(event)) {
                    ret = false;
                }
            } else if (document.createEvent) {
                event = document.createEvent(ctor);
                event.initEvent(type, opts.bubbles, opts.cancelable);
                if (!element.dispatchEvent(event)) {
                    ret = false;
                }
            } else if (typeof element.fireEvent === 'function') {
                event = $.extend(document.createEventObject(), opts);
                if (!element.fireEvent('on' + type, event)) {
                    ret = false;
                }
            } else if (typeof element[type]) {
                element[type]();
            }
        }
        return ret;
    };

    /**
     * Strips HTML and returns just text.
     *
     * @param {String|Element|jQuery} html
     *   A string of HTML content, an Element DOM object or a jQuery object.
     *
     * @return {String}
     *   The text without HTML tags.
     *
     * @todo Replace with http://locutus.io/php/strings/strip_tags/
     */
    Bootstrap.stripHtml = function(html) {
        if (html instanceof $) {
            html = html.html();
        } else if (html instanceof Element) {
            html = html.innerHTML;
        }
        var tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').replace(/^[\s\n\t]*|[\s\n\t]*$/, '');
    };

    /**
     * Provide a helper method for displaying when something is unsupported.
     *
     * @param {String} type
     *   The type of unsupported object, e.g. method or option.
     * @param {String} name
     *   The name of the unsupported object.
     * @param {*} [value]
     *   The value of the unsupported object.
     */
    Bootstrap.unsupported = function(type, name, value) {
        Bootstrap.warn('Unsupported by Drupal Bootstrap: (@type) @name -> @value', {
            '@type': type,
            '@name': name,
            '@value': typeof value === 'object' ? JSON.stringify(value) : value
        });
    };

    /**
     * Provide a helper method to display a warning.
     *
     * @param {String} message
     *   The message to display.
     * @param {Object} [args]
     *   Arguments to use as replacements in Drupal.formatString.
     */
    Bootstrap.warn = function(message, args) {
        if (this.settings.dev && console.warn) {
            console.warn(Drupal.formatString(message, args));
        }
    };

    /**
     * Wraps a plugin with common functionality.
     *
     * @param {Function} constructor
     *   A plugin constructor being wrapped.
     * @param {Object|Function} plugin
     *   The plugin being wrapped.
     * @param {Boolean} [extend = false]
     *   Whether to add super extensibility.
     */
    Bootstrap.wrapPluginConstructor = function(constructor, plugin, extend) {
        var proto = constructor.prototype;

        // Add a jQuery UI like option getter/setter method.
        var option = this.option;
        if (proto.option === void(0)) {
            proto.option = function() {
                return option.apply(this, arguments);
            };
        }

        if (extend) {
            // Handle prototype properties separately.
            if (plugin.prototype !== void 0) {
                for (var key in plugin.prototype) {
                    if (!plugin.prototype.hasOwnProperty(key)) continue;
                    var value = plugin.prototype[key];
                    if (typeof value === 'function') {
                        proto[key] = this.superWrapper(proto[key] || function() {}, value);
                    } else {
                        proto[key] = $.isPlainObject(value) ? $.extend(true, {}, proto[key], value) : value;
                    }
                }
            }
            delete plugin.prototype;

            // Handle static properties.
            for (key in plugin) {
                if (!plugin.hasOwnProperty(key)) continue;
                value = plugin[key];
                if (typeof value === 'function') {
                    constructor[key] = this.superWrapper(constructor[key] || function() {}, value);
                } else {
                    constructor[key] = $.isPlainObject(value) ? $.extend(true, {}, constructor[key], value) : value;
                }
            }
        }
    };

    /**
     * Add Bootstrap to the global Drupal object.
     *
     * @type {Bootstrap}
     */
    Drupal.bootstrap = Drupal.bootstrap || Bootstrap;

})(window._, window.jQuery, window.Drupal, window.drupalSettings);;
(function($, _) {

    /**
     * @class Attributes
     *
     * Modifies attributes.
     *
     * @param {Object|Attributes} attributes
     *   An object to initialize attributes with.
     */
    var Attributes = function(attributes) {
        this.data = {};
        this.data['class'] = [];
        this.merge(attributes);
    };

    /**
     * Renders the attributes object as a string to inject into an HTML element.
     *
     * @return {String}
     *   A rendered string suitable for inclusion in HTML markup.
     */
    Attributes.prototype.toString = function() {
        var output = '';
        var name, value;
        var checkPlain = function(str) {
            return str && str.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') || '';
        };
        var data = this.getData();
        for (name in data) {
            if (!data.hasOwnProperty(name)) continue;
            value = data[name];
            if (_.isFunction(value)) value = value();
            if (_.isObject(value)) value = _.values(value);
            if (_.isArray(value)) value = value.join(' ');
            output += ' ' + checkPlain(name) + '="' + checkPlain(value) + '"';
        }
        return output;
    };

    /**
     * Renders the Attributes object as a plain object.
     *
     * @return {Object}
     *   A plain object suitable for inclusion in DOM elements.
     */
    Attributes.prototype.toPlainObject = function() {
        var object = {};
        var name, value;
        var data = this.getData();
        for (name in data) {
            if (!data.hasOwnProperty(name)) continue;
            value = data[name];
            if (_.isFunction(value)) value = value();
            if (_.isObject(value)) value = _.values(value);
            if (_.isArray(value)) value = value.join(' ');
            object[name] = value;
        }
        return object;
    };

    /**
     * Add class(es) to the array.
     *
     * @param {string|Array} value
     *   An individual class or an array of classes to add.
     *
     * @return {Attributes}
     *
     * @chainable
     */
    Attributes.prototype.addClass = function(value) {
        var args = Array.prototype.slice.call(arguments);
        this.data['class'] = this.sanitizeClasses(this.data['class'].concat(args));
        return this;
    };

    /**
     * Returns whether the requested attribute exists.
     *
     * @param {string} name
     *   An attribute name to check.
     *
     * @return {boolean}
     *   TRUE or FALSE
     */
    Attributes.prototype.exists = function(name) {
        return this.data[name] !== void(0) && this.data[name] !== null;
    };

    /**
     * Retrieve a specific attribute from the array.
     *
     * @param {string} name
     *   The specific attribute to retrieve.
     * @param {*} defaultValue
     *   (optional) The default value to set if the attribute does not exist.
     *
     * @return {*}
     *   A specific attribute value, passed by reference.
     */
    Attributes.prototype.get = function(name, defaultValue) {
        if (!this.exists(name)) this.data[name] = defaultValue;
        return this.data[name];
    };

    /**
     * Retrieves a cloned copy of the internal attributes data object.
     *
     * @return {Object}
     */
    Attributes.prototype.getData = function() {
        return _.extend({}, this.data);
    };

    /**
     * Retrieves classes from the array.
     *
     * @return {Array}
     *   The classes array.
     */
    Attributes.prototype.getClasses = function() {
        return this.get('class', []);
    };

    /**
     * Indicates whether a class is present in the array.
     *
     * @param {string|Array} className
     *   The class(es) to search for.
     *
     * @return {boolean}
     *   TRUE or FALSE
     */
    Attributes.prototype.hasClass = function(className) {
        className = this.sanitizeClasses(Array.prototype.slice.call(arguments));
        var classes = this.getClasses();
        for (var i = 0, l = className.length; i < l; i++) {
            // If one of the classes fails, immediately return false.
            if (_.indexOf(classes, className[i]) === -1) {
                return false;
            }
        }
        return true;
    };

    /**
     * Merges multiple values into the array.
     *
     * @param {Attributes|Node|jQuery|Object} object
     *   An Attributes object with existing data, a Node DOM element, a jQuery
     *   instance or a plain object where the key is the attribute name and the
     *   value is the attribute value.
     * @param {boolean} [recursive]
     *   Flag determining whether or not to recursively merge key/value pairs.
     *
     * @return {Attributes}
     *
     * @chainable
     */
    Attributes.prototype.merge = function(object, recursive) {
        // Immediately return if there is nothing to merge.
        if (!object) {
            return this;
        }

        // Get attributes from a jQuery element.
        if (object instanceof $) {
            object = object[0];
        }

        // Get attributes from a DOM element.
        if (object instanceof Node) {
            object = Array.prototype.slice.call(object.attributes).reduce(function(attributes, attribute) {
                attributes[attribute.name] = attribute.value;
                return attributes;
            }, {});
        }
        // Get attributes from an Attributes instance.
        else if (object instanceof Attributes) {
            object = object.getData();
        }
        // Otherwise, clone the object.
        else {
            object = _.extend({}, object);
        }

        // By this point, there should be a valid plain object.
        if (!$.isPlainObject(object)) {
            setTimeout(function() {
                throw new Error('Passed object is not supported: ' + object);
            });
            return this;
        }

        // Handle classes separately.
        if (object && object['class'] !== void 0) {
            this.addClass(object['class']);
            delete object['class'];
        }

        if (recursive === void 0 || recursive) {
            this.data = $.extend(true, {}, this.data, object);
        } else {
            this.data = $.extend({}, this.data, object);
        }

        return this;
    };

    /**
     * Removes an attribute from the array.
     *
     * @param {string} name
     *   The name of the attribute to remove.
     *
     * @return {Attributes}
     *
     * @chainable
     */
    Attributes.prototype.remove = function(name) {
        if (this.exists(name)) delete this.data[name];
        return this;
    };

    /**
     * Removes a class from the attributes array.
     *
     * @param {...string|Array} className
     *   An individual class or an array of classes to remove.
     *
     * @return {Attributes}
     *
     * @chainable
     */
    Attributes.prototype.removeClass = function(className) {
        var remove = this.sanitizeClasses(Array.prototype.slice.apply(arguments));
        this.data['class'] = _.without(this.getClasses(), remove);
        return this;
    };

    /**
     * Replaces a class in the attributes array.
     *
     * @param {string} oldValue
     *   The old class to remove.
     * @param {string} newValue
     *   The new class. It will not be added if the old class does not exist.
     *
     * @return {Attributes}
     *
     * @chainable
     */
    Attributes.prototype.replaceClass = function(oldValue, newValue) {
        var classes = this.getClasses();
        var i = _.indexOf(this.sanitizeClasses(oldValue), classes);
        if (i >= 0) {
            classes[i] = newValue;
            this.set('class', classes);
        }
        return this;
    };

    /**
     * Ensures classes are flattened into a single is an array and sanitized.
     *
     * @param {...String|Array} classes
     *   The class or classes to sanitize.
     *
     * @return {Array}
     *   A sanitized array of classes.
     */
    Attributes.prototype.sanitizeClasses = function(classes) {
        return _.chain(Array.prototype.slice.call(arguments))
            // Flatten in case there's a mix of strings and arrays.
            .flatten()

            // Split classes that may have been added with a space as a separator.
            .map(function(string) {
                return string.split(' ');
            })

            // Flatten again since it was just split into arrays.
            .flatten()

            // Filter out empty items.
            .filter()

            // Clean the class to ensure it's a valid class name.
            .map(function(value) {
                return Attributes.cleanClass(value);
            })

            // Ensure classes are unique.
            .uniq()

            // Retrieve the final value.
            .value();
    };

    /**
     * Sets an attribute on the array.
     *
     * @param {string} name
     *   The name of the attribute to set.
     * @param {*} value
     *   The value of the attribute to set.
     *
     * @return {Attributes}
     *
     * @chainable
     */
    Attributes.prototype.set = function(name, value) {
        var obj = $.isPlainObject(name) ? name : {};
        if (typeof name === 'string') {
            obj[name] = value;
        }
        return this.merge(obj);
    };

    /**
     * Prepares a string for use as a CSS identifier (element, class, or ID name).
     *
     * Note: this is essentially a direct copy from
     * \Drupal\Component\Utility\Html::cleanCssIdentifier
     *
     * @param {string} identifier
     *   The identifier to clean.
     * @param {Object} [filter]
     *   An object of string replacements to use on the identifier.
     *
     * @return {string}
     *   The cleaned identifier.
     */
    Attributes.cleanClass = function(identifier, filter) {
        filter = filter || {
            ' ': '-',
            '_': '-',
            '/': '-',
            '[': '-',
            ']': ''
        };

        identifier = identifier.toLowerCase();

        if (filter['__'] === void 0) {
            identifier = identifier.replace('__', '#DOUBLE_UNDERSCORE#');
        }

        identifier = identifier.replace(Object.keys(filter), Object.keys(filter).map(function(key) {
            return filter[key];
        }));

        if (filter['__'] === void 0) {
            identifier = identifier.replace('#DOUBLE_UNDERSCORE#', '__');
        }

        identifier = identifier.replace(/[^\u002D\u0030-\u0039\u0041-\u005A\u005F\u0061-\u007A\u00A1-\uFFFF]/g, '');
        identifier = identifier.replace(['/^[0-9]/', '/^(-[0-9])|^(--)/'], ['_', '__']);

        return identifier;
    };

    /**
     * Creates an Attributes instance.
     *
     * @param {object|Attributes} [attributes]
     *   An object to initialize attributes with.
     *
     * @return {Attributes}
     *   An Attributes instance.
     *
     * @constructor
     */
    Attributes.create = function(attributes) {
        return new Attributes(attributes);
    };

    window.Attributes = Attributes;

})(window.jQuery, window._);;
/**
 * @file
 * Theme hooks for the Drupal Bootstrap base theme.
 */
(function($, Drupal, Bootstrap, Attributes) {

    /**
     * Fallback for theming an icon if the Icon API module is not installed.
     */
    if (!Drupal.icon) Drupal.icon = {
        bundles: {}
    };
    if (!Drupal.theme.icon || Drupal.theme.prototype.icon) {
        $.extend(Drupal.theme, /** @lends Drupal.theme */ {
            /**
             * Renders an icon.
             *
             * @param {string} bundle
             *   The bundle which the icon belongs to.
             * @param {string} icon
             *   The name of the icon to render.
             * @param {object|Attributes} [attributes]
             *   An object of attributes to also apply to the icon.
             *
             * @returns {string}
             */
            icon: function(bundle, icon, attributes) {
                if (!Drupal.icon.bundles[bundle]) return '';
                attributes = Attributes.create(attributes).addClass('icon').set('aria-hidden', 'true');
                icon = Drupal.icon.bundles[bundle](icon, attributes);
                return '<span' + attributes + '></span>';
            }
        });
    }

    /**
     * Callback for modifying an icon in the "bootstrap" icon bundle.
     *
     * @param {string} icon
     *   The icon being rendered.
     * @param {Attributes} attributes
     *   Attributes object for the icon.
     */
    Drupal.icon.bundles.bootstrap = function(icon, attributes) {
        attributes.addClass(['glyphicon', 'glyphicon-' + icon]);
    };

    /**
     * Add necessary theming hooks.
     */
    $.extend(Drupal.theme, /** @lends Drupal.theme */ {

        /**
         * Renders a Bootstrap AJAX glyphicon throbber.
         *
         * @returns {string}
         */
        ajaxThrobber: function() {
            return Drupal.theme('bootstrapIcon', 'refresh', {
                'class': ['ajax-throbber', 'glyphicon-spin']
            });
        },

        /**
         * Renders a button element.
         *
         * @param {object|Attributes} attributes
         *   An object of attributes to apply to the button. If it contains one of:
         *   - value: The label of the button.
         *   - context: The context type of Bootstrap button, can be one of:
         *     - default
         *     - primary
         *     - success
         *     - info
         *     - warning
         *     - danger
         *     - link
         *
         * @returns {string}
         */
        button: function(attributes) {
            attributes = Attributes.create(attributes).addClass('btn');
            var context = attributes.get('context', 'default');
            var label = attributes.get('value', '');
            attributes.remove('context').remove('value');
            if (!attributes.hasClass(['btn-default', 'btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger', 'btn-link'])) {
                attributes.addClass('btn-' + Bootstrap.checkPlain(context));
            }

            // Attempt to, intelligently, provide a default button "type".
            if (!attributes.exists('type')) {
                attributes.set('type', attributes.hasClass('form-submit') ? 'submit' : 'button');
            }

            return '<button' + attributes + '>' + label + '</button>';
        },

        /**
         * Alias for "button" theme hook.
         *
         * @param {object|Attributes} attributes
         *   An object of attributes to apply to the button.
         *
         * @see Drupal.theme.button()
         *
         * @returns {string}
         */
        btn: function(attributes) {
            return Drupal.theme('button', attributes);
        },

        /**
         * Renders a button block element.
         *
         * @param {object|Attributes} attributes
         *   An object of attributes to apply to the button.
         *
         * @see Drupal.theme.button()
         *
         * @returns {string}
         */
        'btn-block': function(attributes) {
            return Drupal.theme('button', Attributes.create(attributes).addClass('btn-block'));
        },

        /**
         * Renders a large button element.
         *
         * @param {object|Attributes} attributes
         *   An object of attributes to apply to the button.
         *
         * @see Drupal.theme.button()
         *
         * @returns {string}
         */
        'btn-lg': function(attributes) {
            return Drupal.theme('button', Attributes.create(attributes).addClass('btn-lg'));
        },

        /**
         * Renders a small button element.
         *
         * @param {object|Attributes} attributes
         *   An object of attributes to apply to the button.
         *
         * @see Drupal.theme.button()
         *
         * @returns {string}
         */
        'btn-sm': function(attributes) {
            return Drupal.theme('button', Attributes.create(attributes).addClass('btn-sm'));
        },

        /**
         * Renders an extra small button element.
         *
         * @param {object|Attributes} attributes
         *   An object of attributes to apply to the button.
         *
         * @see Drupal.theme.button()
         *
         * @returns {string}
         */
        'btn-xs': function(attributes) {
            return Drupal.theme('button', Attributes.create(attributes).addClass('btn-xs'));
        },

        /**
         * Renders a glyphicon.
         *
         * @param {string} name
         *   The name of the glyphicon.
         * @param {object|Attributes} [attributes]
         *   An object of attributes to apply to the icon.
         *
         * @returns {string}
         */
        bootstrapIcon: function(name, attributes) {
            return Drupal.theme('icon', 'bootstrap', name, attributes);
        }

    });

})(window.jQuery, window.Drupal, window.Drupal.bootstrap, window.Attributes);;
/**
 * @file
 * Bootstrap Modals.
 */
(function($, Drupal, Bootstrap, Attributes) {
    'use strict';

    /**
     * Document jQuery object.
     *
     * @type {jQuery}
     */
    var $document = $(document);

    /**
     * Finds the first available and visible focusable input element.
     *
     * This is abstracted from the main code below so sub-themes can override
     * this method to return their own element if desired.
     *
     * @param {Modal} modal
     *   The Bootstrap modal instance.
     *
     * @return {jQuery}
     *   A jQuery object containing the element that should be focused. Note: if
     *   this object contains multiple elements, only the first visible one will
     *   be used.
     */
    Bootstrap.modalFindFocusableElement = function(modal) {
        return modal.$dialogBody.find(':input,:button,.btn').not('.visually-hidden,.sr-only');
    };

    $document.on('shown.bs.modal', function(e) {
        var $modal = $(e.target);
        var modal = $modal.data('bs.modal');

        // Focus the first input element found.
        if (modal && modal.options.focusInput) {
            var $focusable = Bootstrap.modalFindFocusableElement(modal);
            if ($focusable && $focusable[0]) {
                var $input = $focusable.filter(':visible:first').focus();

                // Select text if input is text.
                if (modal.options.selectText && $input.is(':text')) {
                    $input[0].setSelectionRange(0, $input[0].value.length)
                }
            } else if (modal.$close.is(':visible')) {
                modal.$close.focus();
            }
        }
    });

    /**
     * Only process this once.
     */
    Bootstrap.once('modal', function(settings) {

        /**
         * Replace the Bootstrap Modal jQuery plugin definition.
         *
         * This adds a little bit of functionality so it works better with Drupal.
         */
        Bootstrap.replacePlugin('modal', function() {
            var BootstrapModal = this;

            // Override the Modal constructor.
            var Modal = function(element, options) {
                this.$body = $(document.body);
                this.$element = $(element);
                this.$dialog = this.$element.find('.modal-dialog');
                this.$header = this.$dialog.find('.modal-header');
                this.$close = this.$header.find('.close');
                this.$footer = this.$dialog.find('.modal-footer');
                this.$content = this.$dialog.find('.modal-content');
                this.$dialogBody = this.$content.find('.modal-body');
                this.$backdrop = null;
                this.isShown = null;
                this.originalBodyPad = null;
                this.scrollbarWidth = 0;
                this.ignoreBackdropClick = false;
                this.options = this.mapDialogOptions(options);
            };

            // Extend defaults to take into account for theme settings.
            Modal.DEFAULTS = $.extend({}, BootstrapModal.DEFAULTS, {
                animation: !!settings.modal_animation,
                backdrop: settings.modal_backdrop === 'static' ? 'static' : !!settings.modal_backdrop,
                focusInput: !!settings.modal_focus_input,
                selectText: !!settings.modal_select_text,
                keyboard: !!settings.modal_keyboard,
                remote: null,
                show: !!settings.modal_show,
                size: settings.modal_size
            });

            // Copy over the original prototype methods.
            Modal.prototype = BootstrapModal.prototype;

            /**
             * Handler for $.fn.modal('destroy').
             */
            Modal.prototype.destroy = function() {
                this.hide();
                Drupal.detachBehaviors(this.$element[0]);
                this.$element.removeData('bs.modal').remove();
            };

            /**
             * Initialize the modal.
             */
            Modal.prototype.init = function() {
                if (this.options.remote) {
                    this.$content.load(this.options.remote, $.proxy(function() {
                        this.$element.trigger('loaded.bs.modal');
                    }, this));
                }
            };

            /**
             * Map dialog options.
             *
             * Note: this is primarily for use in modal.jquery.ui.bridge.js.
             *
             * @param {Object} options
             *   The passed options.
             */
            Modal.prototype.mapDialogOptions = function(options) {
                return options || {};
            }

            // Modal jQuery Plugin Definition.
            var Plugin = function() {
                // Extract the arguments.
                var args = Array.prototype.slice.call(arguments);
                var method = args[0];
                var options = args[1] || {};
                var relatedTarget = args[2] || null;
                // Move arguments down if no method was passed.
                if ($.isPlainObject(method)) {
                    relatedTarget = options || null;
                    options = method;
                    method = null;
                }
                var ret = void 0;
                this.each(function() {
                    var $this = $(this);
                    var data = $this.data('bs.modal');
                    var initialize = false;

                    // Immediately return if there's no instance to invoke a valid method.
                    var showMethods = ['open', 'show', 'toggle'];
                    if (!data && method && showMethods.indexOf(method) === -1) {
                        return;
                    }

                    options = Bootstrap.normalizeObject($.extend({}, Modal.DEFAULTS, data && data.options, $this.data(), options));
                    delete options['bs.modal'];

                    if (!data) {
                        $this.data('bs.modal', (data = new Modal(this, options)));
                        initialize = true;
                    }

                    // Initialize the modal.
                    if (initialize || (!method && !args.length)) {
                        data.init();
                    }

                    // Explicit method passed.
                    if (method) {
                        if (typeof data[method] === 'function') {
                            try {
                                ret = data[method].apply(data, args.slice(1));
                            } catch (e) {
                                Drupal.throwError(e);
                            }
                        } else {
                            Bootstrap.unsupported('method', method);
                        }
                    }
                    // No method, set options and open if necessary.
                    else {
                        data.option(options);
                        if (options.show && !data.isShown) {
                            data.show(relatedTarget);
                        }
                    }
                });

                // If just one element and there was a result returned for the option passed,
                // then return the result. Otherwise, just return the jQuery object.
                return this.length === 1 && ret !== void 0 ? ret : this;
            };

            // Replace the plugin constructor with the new Modal constructor.
            Plugin.Constructor = Modal;

            // Replace the data API so that it calls $.fn.modal rather than Plugin.
            // This allows sub-themes to replace the jQuery Plugin if they like with
            // out having to redo all this boilerplate.
            $document
                .off('click.bs.modal.data-api')
                .on('click.bs.modal.data-api', '[data-toggle="modal"]', function(e) {
                    var $this = $(this);
                    var href = $this.attr('href');
                    var target = $this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
                    var $target = $document.find(target);
                    var options = $target.data('bs.modal') ? 'toggle' : $.extend({
                        remote: !/#/.test(href) && href
                    }, $target.data(), $this.data());

                    if ($this.is('a')) e.preventDefault();

                    $target.one('show.bs.modal', function(showEvent) {
                        // Only register focus restorer if modal will actually get shown.
                        if (showEvent.isDefaultPrevented()) return;
                        $target.one('hidden.bs.modal', function() {
                            $this.is(':visible') && $this.trigger('focus');
                        });
                    });
                    $target.modal(options, this);
                });

            return Plugin;
        });

        /**
         * Extend Drupal theming functions.
         */
        $.extend(Drupal.theme, /** @lend Drupal.theme */ {
            /**
             * Theme function for a Bootstrap Modal.
             *
             * @param {Object} [variables]
             *   An object containing key/value pairs of variables.
             *
             * @return {string}
             *   The HTML for the modal.
             */
            bootstrapModal: function(variables) {
                var output = '';
                var settings = drupalSettings.bootstrap || {};
                var defaults = {
                    attributes: {
                        class: ['modal'],
                        tabindex: -1,
                        role: 'dialog'
                    },
                    body: '',
                    closeButton: true,
                    description: {
                        attributes: {
                            class: ['help-block']
                        },
                        content: null,
                        position: 'before'
                    },
                    footer: '',
                    id: 'drupal-modal',
                    size: settings.modal_size ? settings.modal_size : '',
                    title: {
                        attributes: {
                            class: ['modal-title']
                        },
                        content: Drupal.t('Loading...'),
                        html: false,
                        tag: 'h4'
                    }
                };
                variables = $.extend(true, {}, defaults, variables);

                var attributes = Attributes.create(defaults.attributes).merge(variables.attributes);
                attributes.set('id', attributes.get('id', variables.id));

                if (settings.modal_animation) {
                    attributes.addClass('fade');
                }

                // Build the modal wrapper.
                output += '<div' + attributes + '>';

                // Build the modal-dialog wrapper.
                output += Drupal.theme('bootstrapModalDialog', _.omit(variables, 'attributes'));

                // Close the modal wrapper.
                output += '</div>';

                // Return the constructed modal.
                return output;
            },

            /**
             * Theme function for a Bootstrap Modal dialog markup.
             *
             * @param {Object} [variables]
             *   An object containing key/value pairs of variables.
             *
             * @return {string}
             *   The HTML for the modal close button.
             */
            bootstrapModalDialog: function(variables) {
                var output = '';

                var defaults = {
                    attributes: {
                        class: ['modal-dialog'],
                        role: 'document'
                    },
                    id: 'drupal-modal'
                };
                variables = $.extend(true, {}, defaults, variables);

                var attributes = Attributes.create(defaults.attributes).merge(variables.attributes);
                attributes.set('id', attributes.get('id', variables.id + '--dialog'));

                if (variables.size) {
                    attributes.addClass(variables.size);
                }
                output += '<div' + attributes + '>';

                // Build the modal-content wrapper.
                output += Drupal.theme('bootstrapModalContent', _.omit(variables, 'attributes'));

                // Close the modal-dialog wrapper.
                output += '</div>';
                return output;
            },

            /**
             * Theme function for a Bootstrap Modal content markup.
             *
             * @param {Object} [variables]
             *   An object containing key/value pairs of variables.
             *
             * @return {string}
             *   The HTML for the modal close button.
             */
            bootstrapModalContent: function(variables) {
                var output = '';

                var defaults = {
                    attributes: {
                        class: ['modal-content']
                    },
                    id: 'drupal-modal'
                };
                variables = $.extend(true, {}, defaults, variables);

                var attributes = Attributes.create(defaults.attributes).merge(variables.attributes);
                attributes.set('id', attributes.get('id', variables.id + '--content'));

                // Build the modal-content wrapper.
                output += '<div' + attributes + '>';
                variables = _.omit(variables, 'attributes');

                // Build the header wrapper and title.
                output += Drupal.theme('bootstrapModalHeader', variables);

                // Build the body.
                output += Drupal.theme('bootstrapModalBody', variables);

                // Build the footer.
                output += Drupal.theme('bootstrapModalFooter', variables);

                // Close the modal-content wrapper.
                output += '</div>';

                return output;
            },

            /**
             * Theme function for a Bootstrap Modal body markup.
             *
             * @param {Object} [variables]
             *   An object containing key/value pairs of variables.
             *
             * @return {string}
             *   The HTML for the modal close button.
             */
            bootstrapModalBody: function(variables) {
                var output = '';

                var defaults = {
                    attributes: {
                        class: ['modal-body']
                    },
                    body: '',
                    description: {
                        attributes: {
                            class: ['help-block']
                        },
                        content: null,
                        position: 'before'
                    },
                    id: 'drupal-modal'
                };
                variables = $.extend(true, {}, defaults, variables);

                var attributes = Attributes.create(defaults.attributes).merge(variables.attributes);
                attributes.set('id', attributes.get('id', variables.id + '--body'));

                output += '<div' + attributes + '>';

                if (typeof variables.description === 'string') {
                    variables.description = $.extend({}, defaults.description, {
                        content: variables.description
                    });
                }

                var description = variables.description;
                description.attributes = Attributes.create(defaults.description.attributes).merge(description.attributes);

                if (description.content && description.position === 'invisible') {
                    description.attributes.addClass('sr-only');
                }

                if (description.content && description.position === 'before') {
                    output += '<p' + description.attributes + '>' + description.content + '</p>';
                }

                output += variables.body;

                if (description.content && (description.position === 'after' || description.position === 'invisible')) {
                    output += '<p' + description.attributes + '>' + description.content + '</p>';
                }

                output += '</div>';

                return output;
            },

            /**
             * Theme function for a Bootstrap Modal close button.
             *
             * @param {Object} [variables]
             *   An object containing key/value pairs of variables.
             *
             * @return {string}
             *   The HTML for the modal close button.
             */
            bootstrapModalClose: function(variables) {
                var defaults = {
                    attributes: {
                        'aria-label': Drupal.t('Close'),
                        class: ['close'],
                        'data-dismiss': 'modal',
                        type: 'button'
                    }
                };
                variables = $.extend(true, {}, defaults, variables);
                var attributes = Attributes.create(defaults.attributes).merge(variables.attributes);
                return '<button' + attributes + '><span aria-hidden="true">&times;</span></button>';
            },

            /**
             * Theme function for a Bootstrap Modal footer.
             *
             * @param {Object} [variables]
             *   An object containing key/value pairs of variables.
             * @param {boolean} [force]
             *   Flag to force rendering the footer, regardless if there's content.
             *
             * @return {string}
             *   The HTML for the modal footer.
             */
            bootstrapModalFooter: function(variables, force) {
                var output = '';
                var defaults = {
                    attributes: {
                        class: ['modal-footer']
                    },
                    footer: '',
                    id: 'drupal-modal'
                };

                variables = $.extend(true, {}, defaults, variables);

                if (force || variables.footer) {
                    var attributes = Attributes.create(defaults.attributes).merge(variables.attributes);
                    attributes.set('id', attributes.get('id', variables.id + '--footer'));
                    output += '<div' + attributes + '>';
                    output += variables.footer;
                    output += '</div>';
                }

                return output;
            },

            /**
             * Theme function for a Bootstrap Modal header.
             *
             * @param {Object} [variables]
             *   An object containing key/value pairs of variables.
             *
             * @return {string}
             *   The HTML for the modal header.
             */
            bootstrapModalHeader: function(variables) {
                var output = '';

                var defaults = {
                    attributes: {
                        class: ['modal-header']
                    },
                    closeButton: true,
                    id: 'drupal-modal',
                    title: {
                        attributes: {
                            class: ['modal-title']
                        },
                        content: Drupal.t('Loading...'),
                        html: false,
                        tag: 'h4'
                    }
                };
                variables = $.extend(true, {}, defaults, variables);

                var title = variables.title;
                if (title) {
                    var attributes = Attributes.create(defaults.attributes).merge(variables.attributes);
                    attributes.set('id', attributes.get('id', variables.id + '--header'));

                    if (typeof title === 'string') {
                        title = $.extend({}, defaults.title, {
                            content: title
                        });
                    }

                    output += '<div' + attributes + '>';

                    if (variables.closeButton) {
                        output += Drupal.theme('bootstrapModalClose', _.omit(variables, 'attributes'));
                    }

                    output += '<' + Drupal.checkPlain(title.tag) + Attributes.create(defaults.title.attributes).merge(title.attributes) + '>' + (title.html ? title.content : Drupal.checkPlain(title.content)) + '</' + Drupal.checkPlain(title.tag) + '>';

                    output += '</div>';
                }

                return output;
            }
        })

    });

})(window.jQuery, window.Drupal, window.Drupal.bootstrap, window.Attributes);;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "../ie", "../version", "../widget"], a) : a(jQuery)
}(function(a) {
    var b = !1;
    return a(document).on("mouseup", function() {
        b = !1
    }), a.widget("ui.mouse", {
        version: "1.12.1",
        options: {
            cancel: "input, textarea, button, select, option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var b = this;
            this.element.on("mousedown." + this.widgetName, function(a) {
                return b._mouseDown(a)
            }).on("click." + this.widgetName, function(c) {
                if (!0 === a.data(c.target, b.widgetName + ".preventClickEvent")) return a.removeData(c.target, b.widgetName + ".preventClickEvent"), c.stopImmediatePropagation(), !1
            }), this.started = !1
        },
        _mouseDestroy: function() {
            this.element.off("." + this.widgetName), this._mouseMoveDelegate && this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function(c) {
            if (!b) {
                this._mouseMoved = !1, this._mouseStarted && this._mouseUp(c), this._mouseDownEvent = c;
                var d = this,
                    e = 1 === c.which,
                    f = !("string" != typeof this.options.cancel || !c.target.nodeName) && a(c.target).closest(this.options.cancel).length;
                return !(e && !f && this._mouseCapture(c)) || (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    d.mouseDelayMet = !0
                }, this.options.delay)), this._mouseDistanceMet(c) && this._mouseDelayMet(c) && (this._mouseStarted = this._mouseStart(c) !== !1, !this._mouseStarted) ? (c.preventDefault(), !0) : (!0 === a.data(c.target, this.widgetName + ".preventClickEvent") && a.removeData(c.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(a) {
                    return d._mouseMove(a)
                }, this._mouseUpDelegate = function(a) {
                    return d._mouseUp(a)
                }, this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate), c.preventDefault(), b = !0, !0))
            }
        },
        _mouseMove: function(b) {
            if (this._mouseMoved) {
                if (a.ui.ie && (!document.documentMode || document.documentMode < 9) && !b.button) return this._mouseUp(b);
                if (!b.which)
                    if (b.originalEvent.altKey || b.originalEvent.ctrlKey || b.originalEvent.metaKey || b.originalEvent.shiftKey) this.ignoreMissingWhich = !0;
                    else if (!this.ignoreMissingWhich) return this._mouseUp(b)
            }
            return (b.which || b.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(b), b.preventDefault()) : (this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1, this._mouseStarted ? this._mouseDrag(b) : this._mouseUp(b)), !this._mouseStarted)
        },
        _mouseUp: function(c) {
            this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, c.target === this._mouseDownEvent.target && a.data(c.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(c)), this._mouseDelayTimer && (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer), this.ignoreMissingWhich = !1, b = !1, c.preventDefault()
        },
        _mouseDistanceMet: function(a) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0
        }
    })
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "./mouse", "../data", "../plugin", "../safe-active-element", "../safe-blur", "../scroll-parent", "../version", "../widget"], a) : a(jQuery)
}(function(a) {
    return a.widget("ui.draggable", a.ui.mouse, {
        version: "1.12.1",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {
            "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this._addClass("ui-draggable"), this._setHandleClassName(), this._mouseInit()
        },
        _setOption: function(a, b) {
            this._super(a, b), "handle" === a && (this._removeHandleClassName(), this._setHandleClassName())
        },
        _destroy: function() {
            return (this.helper || this.element).is(".ui-draggable-dragging") ? void(this.destroyOnClear = !0) : (this._removeHandleClassName(), void this._mouseDestroy())
        },
        _mouseCapture: function(b) {
            var c = this.options;
            return !(this.helper || c.disabled || a(b.target).closest(".ui-resizable-handle").length > 0) && (this.handle = this._getHandle(b), !!this.handle && (this._blurActiveElement(b), this._blockFrames(c.iframeFix === !0 ? "iframe" : c.iframeFix), !0))
        },
        _blockFrames: function(b) {
            this.iframeBlocks = this.document.find(b).map(function() {
                var b = a(this);
                return a("<div>").css("position", "absolute").appendTo(b.parent()).outerWidth(b.outerWidth()).outerHeight(b.outerHeight()).offset(b.offset())[0]
            })
        },
        _unblockFrames: function() {
            this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
        },
        _blurActiveElement: function(b) {
            var c = a.ui.safeActiveElement(this.document[0]),
                d = a(b.target);
            d.closest(c).length || a.ui.safeBlur(c)
        },
        _mouseStart: function(b) {
            var c = this.options;
            return this.helper = this._createHelper(b), this._addClass(this.helper, "ui-draggable-dragging"), this._cacheHelperProportions(), a.ui.ddmanager && (a.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter(function() {
                return "fixed" === a(this).css("position")
            }).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(b), this.originalPosition = this.position = this._generatePosition(b, !1), this.originalPageX = b.pageX, this.originalPageY = b.pageY, c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt), this._setContainment(), this._trigger("start", b) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b), this._mouseDrag(b, !0), a.ui.ddmanager && a.ui.ddmanager.dragStart(this, b), !0)
        },
        _refreshOffsets: function(a) {
            this.offset = {
                top: this.positionAbs.top - this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: !1,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }, this.offset.click = {
                left: a.pageX - this.offset.left,
                top: a.pageY - this.offset.top
            }
        },
        _mouseDrag: function(b, c) {
            if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(b, !0), this.positionAbs = this._convertPositionTo("absolute"), !c) {
                var d = this._uiHash();
                if (this._trigger("drag", b, d) === !1) return this._mouseUp(new a.Event("mouseup", b)), !1;
                this.position = d.position
            }
            return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", a.ui.ddmanager && a.ui.ddmanager.drag(this, b), !1
        },
        _mouseStop: function(b) {
            var c = this,
                d = !1;
            return a.ui.ddmanager && !this.options.dropBehaviour && (d = a.ui.ddmanager.drop(this, b)), this.dropped && (d = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !d || "valid" === this.options.revert && d || this.options.revert === !0 || a.isFunction(this.options.revert) && this.options.revert.call(this.element, d) ? a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                c._trigger("stop", b) !== !1 && c._clear()
            }) : this._trigger("stop", b) !== !1 && this._clear(), !1
        },
        _mouseUp: function(b) {
            return this._unblockFrames(), a.ui.ddmanager && a.ui.ddmanager.dragStop(this, b), this.handleElement.is(b.target) && this.element.trigger("focus"), a.ui.mouse.prototype._mouseUp.call(this, b)
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp(new a.Event("mouseup", {
                target: this.element[0]
            })) : this._clear(), this
        },
        _getHandle: function(b) {
            return !this.options.handle || !!a(b.target).closest(this.element.find(this.options.handle)).length
        },
        _setHandleClassName: function() {
            this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, this._addClass(this.handleElement, "ui-draggable-handle")
        },
        _removeHandleClassName: function() {
            this._removeClass(this.handleElement, "ui-draggable-handle")
        },
        _createHelper: function(b) {
            var c = this.options,
                d = a.isFunction(c.helper),
                e = d ? a(c.helper.apply(this.element[0], [b])) : "clone" === c.helper ? this.element.clone().removeAttr("id") : this.element;
            return e.parents("body").length || e.appendTo("parent" === c.appendTo ? this.element[0].parentNode : c.appendTo), d && e[0] === this.element[0] && this._setPositionRelative(), e[0] === this.element[0] || /(fixed|absolute)/.test(e.css("position")) || e.css("position", "absolute"), e
        },
        _setPositionRelative: function() {
            /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
        },
        _adjustOffsetFromHelper: function(b) {
            "string" == typeof b && (b = b.split(" ")), a.isArray(b) && (b = {
                left: +b[0],
                top: +b[1] || 0
            }), "left" in b && (this.offset.click.left = b.left + this.margins.left), "right" in b && (this.offset.click.left = this.helperProportions.width - b.right + this.margins.left), "top" in b && (this.offset.click.top = b.top + this.margins.top), "bottom" in b && (this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top)
        },
        _isRootNode: function(a) {
            return /(html|body)/i.test(a.tagName) || a === this.document[0]
        },
        _getParentOffset: function() {
            var b = this.offsetParent.offset(),
                c = this.document[0];
            return "absolute" === this.cssPosition && this.scrollParent[0] !== c && a.contains(this.scrollParent[0], this.offsetParent[0]) && (b.left += this.scrollParent.scrollLeft(), b.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (b = {
                top: 0,
                left: 0
            }), {
                top: b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if ("relative" !== this.cssPosition) return {
                top: 0,
                left: 0
            };
            var a = this.element.position(),
                b = this._isRootNode(this.scrollParent[0]);
            return {
                top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + (b ? 0 : this.scrollParent.scrollTop()),
                left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + (b ? 0 : this.scrollParent.scrollLeft())
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var b, c, d, e = this.options,
                f = this.document[0];
            return this.relativeContainer = null, e.containment ? "window" === e.containment ? void(this.containment = [a(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, a(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, a(window).scrollLeft() + a(window).width() - this.helperProportions.width - this.margins.left, a(window).scrollTop() + (a(window).height() || f.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : "document" === e.containment ? void(this.containment = [0, 0, a(f).width() - this.helperProportions.width - this.margins.left, (a(f).height() || f.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : e.containment.constructor === Array ? void(this.containment = e.containment) : ("parent" === e.containment && (e.containment = this.helper[0].parentNode), c = a(e.containment), d = c[0], void(d && (b = /(scroll|auto)/.test(c.css("overflow")), this.containment = [(parseInt(c.css("borderLeftWidth"), 10) || 0) + (parseInt(c.css("paddingLeft"), 10) || 0), (parseInt(c.css("borderTopWidth"), 10) || 0) + (parseInt(c.css("paddingTop"), 10) || 0), (b ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(c.css("borderRightWidth"), 10) || 0) - (parseInt(c.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (b ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - (parseInt(c.css("borderBottomWidth"), 10) || 0) - (parseInt(c.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = c))) : void(this.containment = null)
        },
        _convertPositionTo: function(a, b) {
            b || (b = this.position);
            var c = "absolute" === a ? 1 : -1,
                d = this._isRootNode(this.scrollParent[0]);
            return {
                top: b.top + this.offset.relative.top * c + this.offset.parent.top * c - ("fixed" === this.cssPosition ? -this.offset.scroll.top : d ? 0 : this.offset.scroll.top) * c,
                left: b.left + this.offset.relative.left * c + this.offset.parent.left * c - ("fixed" === this.cssPosition ? -this.offset.scroll.left : d ? 0 : this.offset.scroll.left) * c
            }
        },
        _generatePosition: function(a, b) {
            var c, d, e, f, g = this.options,
                h = this._isRootNode(this.scrollParent[0]),
                i = a.pageX,
                j = a.pageY;
            return h && this.offset.scroll || (this.offset.scroll = {
                top: this.scrollParent.scrollTop(),
                left: this.scrollParent.scrollLeft()
            }), b && (this.containment && (this.relativeContainer ? (d = this.relativeContainer.offset(), c = [this.containment[0] + d.left, this.containment[1] + d.top, this.containment[2] + d.left, this.containment[3] + d.top]) : c = this.containment, a.pageX - this.offset.click.left < c[0] && (i = c[0] + this.offset.click.left), a.pageY - this.offset.click.top < c[1] && (j = c[1] + this.offset.click.top), a.pageX - this.offset.click.left > c[2] && (i = c[2] + this.offset.click.left), a.pageY - this.offset.click.top > c[3] && (j = c[3] + this.offset.click.top)), g.grid && (e = g.grid[1] ? this.originalPageY + Math.round((j - this.originalPageY) / g.grid[1]) * g.grid[1] : this.originalPageY, j = c ? e - this.offset.click.top >= c[1] || e - this.offset.click.top > c[3] ? e : e - this.offset.click.top >= c[1] ? e - g.grid[1] : e + g.grid[1] : e, f = g.grid[0] ? this.originalPageX + Math.round((i - this.originalPageX) / g.grid[0]) * g.grid[0] : this.originalPageX, i = c ? f - this.offset.click.left >= c[0] || f - this.offset.click.left > c[2] ? f : f - this.offset.click.left >= c[0] ? f - g.grid[0] : f + g.grid[0] : f), "y" === g.axis && (i = this.originalPageX), "x" === g.axis && (j = this.originalPageY)), {
                top: j - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : h ? 0 : this.offset.scroll.top),
                left: i - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : h ? 0 : this.offset.scroll.left)
            }
        },
        _clear: function() {
            this._removeClass(this.helper, "ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy()
        },
        _trigger: function(b, c, d) {
            return d = d || this._uiHash(), a.ui.plugin.call(this, b, [c, d, this], !0), /^(drag|start|stop)/.test(b) && (this.positionAbs = this._convertPositionTo("absolute"), d.offset = this.positionAbs), a.Widget.prototype._trigger.call(this, b, c, d)
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    }), a.ui.plugin.add("draggable", "connectToSortable", {
        start: function(b, c, d) {
            var e = a.extend({}, c, {
                item: d.element
            });
            d.sortables = [], a(d.options.connectToSortable).each(function() {
                var c = a(this).sortable("instance");
                c && !c.options.disabled && (d.sortables.push(c), c.refreshPositions(), c._trigger("activate", b, e))
            })
        },
        stop: function(b, c, d) {
            var e = a.extend({}, c, {
                item: d.element
            });
            d.cancelHelperRemoval = !1, a.each(d.sortables, function() {
                var a = this;
                a.isOver ? (a.isOver = 0, d.cancelHelperRemoval = !0, a.cancelHelperRemoval = !1, a._storedCSS = {
                    position: a.placeholder.css("position"),
                    top: a.placeholder.css("top"),
                    left: a.placeholder.css("left")
                }, a._mouseStop(b), a.options.helper = a.options._helper) : (a.cancelHelperRemoval = !0, a._trigger("deactivate", b, e))
            })
        },
        drag: function(b, c, d) {
            a.each(d.sortables, function() {
                var e = !1,
                    f = this;
                f.positionAbs = d.positionAbs, f.helperProportions = d.helperProportions, f.offset.click = d.offset.click, f._intersectsWith(f.containerCache) && (e = !0, a.each(d.sortables, function() {
                    return this.positionAbs = d.positionAbs, this.helperProportions = d.helperProportions, this.offset.click = d.offset.click, this !== f && this._intersectsWith(this.containerCache) && a.contains(f.element[0], this.element[0]) && (e = !1), e
                })), e ? (f.isOver || (f.isOver = 1, d._parent = c.helper.parent(), f.currentItem = c.helper.appendTo(f.element).data("ui-sortable-item", !0), f.options._helper = f.options.helper, f.options.helper = function() {
                    return c.helper[0]
                }, b.target = f.currentItem[0], f._mouseCapture(b, !0), f._mouseStart(b, !0, !0), f.offset.click.top = d.offset.click.top, f.offset.click.left = d.offset.click.left, f.offset.parent.left -= d.offset.parent.left - f.offset.parent.left, f.offset.parent.top -= d.offset.parent.top - f.offset.parent.top, d._trigger("toSortable", b), d.dropped = f.element, a.each(d.sortables, function() {
                    this.refreshPositions()
                }), d.currentItem = d.element, f.fromOutside = d), f.currentItem && (f._mouseDrag(b), c.position = f.position)) : f.isOver && (f.isOver = 0, f.cancelHelperRemoval = !0, f.options._revert = f.options.revert, f.options.revert = !1, f._trigger("out", b, f._uiHash(f)), f._mouseStop(b, !0), f.options.revert = f.options._revert, f.options.helper = f.options._helper, f.placeholder && f.placeholder.remove(), c.helper.appendTo(d._parent), d._refreshOffsets(b), c.position = d._generatePosition(b, !0), d._trigger("fromSortable", b), d.dropped = !1, a.each(d.sortables, function() {
                    this.refreshPositions()
                }))
            })
        }
    }), a.ui.plugin.add("draggable", "cursor", {
        start: function(b, c, d) {
            var e = a("body"),
                f = d.options;
            e.css("cursor") && (f._cursor = e.css("cursor")), e.css("cursor", f.cursor)
        },
        stop: function(b, c, d) {
            var e = d.options;
            e._cursor && a("body").css("cursor", e._cursor)
        }
    }), a.ui.plugin.add("draggable", "opacity", {
        start: function(b, c, d) {
            var e = a(c.helper),
                f = d.options;
            e.css("opacity") && (f._opacity = e.css("opacity")), e.css("opacity", f.opacity)
        },
        stop: function(b, c, d) {
            var e = d.options;
            e._opacity && a(c.helper).css("opacity", e._opacity)
        }
    }), a.ui.plugin.add("draggable", "scroll", {
        start: function(a, b, c) {
            c.scrollParentNotHidden || (c.scrollParentNotHidden = c.helper.scrollParent(!1)), c.scrollParentNotHidden[0] !== c.document[0] && "HTML" !== c.scrollParentNotHidden[0].tagName && (c.overflowOffset = c.scrollParentNotHidden.offset())
        },
        drag: function(b, c, d) {
            var e = d.options,
                f = !1,
                g = d.scrollParentNotHidden[0],
                h = d.document[0];
            g !== h && "HTML" !== g.tagName ? (e.axis && "x" === e.axis || (d.overflowOffset.top + g.offsetHeight - b.pageY < e.scrollSensitivity ? g.scrollTop = f = g.scrollTop + e.scrollSpeed : b.pageY - d.overflowOffset.top < e.scrollSensitivity && (g.scrollTop = f = g.scrollTop - e.scrollSpeed)), e.axis && "y" === e.axis || (d.overflowOffset.left + g.offsetWidth - b.pageX < e.scrollSensitivity ? g.scrollLeft = f = g.scrollLeft + e.scrollSpeed : b.pageX - d.overflowOffset.left < e.scrollSensitivity && (g.scrollLeft = f = g.scrollLeft - e.scrollSpeed))) : (e.axis && "x" === e.axis || (b.pageY - a(h).scrollTop() < e.scrollSensitivity ? f = a(h).scrollTop(a(h).scrollTop() - e.scrollSpeed) : a(window).height() - (b.pageY - a(h).scrollTop()) < e.scrollSensitivity && (f = a(h).scrollTop(a(h).scrollTop() + e.scrollSpeed))), e.axis && "y" === e.axis || (b.pageX - a(h).scrollLeft() < e.scrollSensitivity ? f = a(h).scrollLeft(a(h).scrollLeft() - e.scrollSpeed) : a(window).width() - (b.pageX - a(h).scrollLeft()) < e.scrollSensitivity && (f = a(h).scrollLeft(a(h).scrollLeft() + e.scrollSpeed)))), f !== !1 && a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(d, b)
        }
    }), a.ui.plugin.add("draggable", "snap", {
        start: function(b, c, d) {
            var e = d.options;
            d.snapElements = [], a(e.snap.constructor !== String ? e.snap.items || ":data(ui-draggable)" : e.snap).each(function() {
                var b = a(this),
                    c = b.offset();
                this !== d.element[0] && d.snapElements.push({
                    item: this,
                    width: b.outerWidth(),
                    height: b.outerHeight(),
                    top: c.top,
                    left: c.left
                })
            })
        },
        drag: function(b, c, d) {
            var e, f, g, h, i, j, k, l, m, n, o = d.options,
                p = o.snapTolerance,
                q = c.offset.left,
                r = q + d.helperProportions.width,
                s = c.offset.top,
                t = s + d.helperProportions.height;
            for (m = d.snapElements.length - 1; m >= 0; m--) i = d.snapElements[m].left - d.margins.left, j = i + d.snapElements[m].width, k = d.snapElements[m].top - d.margins.top, l = k + d.snapElements[m].height, r < i - p || q > j + p || t < k - p || s > l + p || !a.contains(d.snapElements[m].item.ownerDocument, d.snapElements[m].item) ? (d.snapElements[m].snapping && d.options.snap.release && d.options.snap.release.call(d.element, b, a.extend(d._uiHash(), {
                snapItem: d.snapElements[m].item
            })), d.snapElements[m].snapping = !1) : ("inner" !== o.snapMode && (e = Math.abs(k - t) <= p, f = Math.abs(l - s) <= p, g = Math.abs(i - r) <= p, h = Math.abs(j - q) <= p, e && (c.position.top = d._convertPositionTo("relative", {
                top: k - d.helperProportions.height,
                left: 0
            }).top), f && (c.position.top = d._convertPositionTo("relative", {
                top: l,
                left: 0
            }).top), g && (c.position.left = d._convertPositionTo("relative", {
                top: 0,
                left: i - d.helperProportions.width
            }).left), h && (c.position.left = d._convertPositionTo("relative", {
                top: 0,
                left: j
            }).left)), n = e || f || g || h, "outer" !== o.snapMode && (e = Math.abs(k - s) <= p, f = Math.abs(l - t) <= p, g = Math.abs(i - q) <= p, h = Math.abs(j - r) <= p, e && (c.position.top = d._convertPositionTo("relative", {
                top: k,
                left: 0
            }).top), f && (c.position.top = d._convertPositionTo("relative", {
                top: l - d.helperProportions.height,
                left: 0
            }).top), g && (c.position.left = d._convertPositionTo("relative", {
                top: 0,
                left: i
            }).left), h && (c.position.left = d._convertPositionTo("relative", {
                top: 0,
                left: j - d.helperProportions.width
            }).left)), !d.snapElements[m].snapping && (e || f || g || h || n) && d.options.snap.snap && d.options.snap.snap.call(d.element, b, a.extend(d._uiHash(), {
                snapItem: d.snapElements[m].item
            })), d.snapElements[m].snapping = e || f || g || h || n)
        }
    }), a.ui.plugin.add("draggable", "stack", {
        start: function(b, c, d) {
            var e, f = d.options,
                g = a.makeArray(a(f.stack)).sort(function(b, c) {
                    return (parseInt(a(b).css("zIndex"), 10) || 0) - (parseInt(a(c).css("zIndex"), 10) || 0)
                });
            g.length && (e = parseInt(a(g[0]).css("zIndex"), 10) || 0, a(g).each(function(b) {
                a(this).css("zIndex", e + b)
            }), this.css("zIndex", e + g.length))
        }
    }), a.ui.plugin.add("draggable", "zIndex", {
        start: function(b, c, d) {
            var e = a(c.helper),
                f = d.options;
            e.css("zIndex") && (f._zIndex = e.css("zIndex")), e.css("zIndex", f.zIndex)
        },
        stop: function(b, c, d) {
            var e = d.options;
            e._zIndex && a(c.helper).css("zIndex", e._zIndex)
        }
    }), a.ui.draggable
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "./version"], a) : a(jQuery)
}(function(a) {
    return function() {
        function b(a, b, c) {
            return [parseFloat(a[0]) * (l.test(a[0]) ? b / 100 : 1), parseFloat(a[1]) * (l.test(a[1]) ? c / 100 : 1)]
        }

        function c(b, c) {
            return parseInt(a.css(b, c), 10) || 0
        }

        function d(b) {
            var c = b[0];
            return 9 === c.nodeType ? {
                width: b.width(),
                height: b.height(),
                offset: {
                    top: 0,
                    left: 0
                }
            } : a.isWindow(c) ? {
                width: b.width(),
                height: b.height(),
                offset: {
                    top: b.scrollTop(),
                    left: b.scrollLeft()
                }
            } : c.preventDefault ? {
                width: 0,
                height: 0,
                offset: {
                    top: c.pageY,
                    left: c.pageX
                }
            } : {
                width: b.outerWidth(),
                height: b.outerHeight(),
                offset: b.offset()
            }
        }
        var e, f = Math.max,
            g = Math.abs,
            h = /left|center|right/,
            i = /top|center|bottom/,
            j = /[\+\-]\d+(\.[\d]+)?%?/,
            k = /^\w+/,
            l = /%$/,
            m = a.fn.position;
        a.position = {
            scrollbarWidth: function() {
                if (void 0 !== e) return e;
                var b, c, d = a("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                    f = d.children()[0];
                return a("body").append(d), b = f.offsetWidth, d.css("overflow", "scroll"), c = f.offsetWidth, b === c && (c = d[0].clientWidth), d.remove(), e = b - c
            },
            getScrollInfo: function(b) {
                var c = b.isWindow || b.isDocument ? "" : b.element.css("overflow-x"),
                    d = b.isWindow || b.isDocument ? "" : b.element.css("overflow-y"),
                    e = "scroll" === c || "auto" === c && b.width < b.element[0].scrollWidth,
                    f = "scroll" === d || "auto" === d && b.height < b.element[0].scrollHeight;
                return {
                    width: f ? a.position.scrollbarWidth() : 0,
                    height: e ? a.position.scrollbarWidth() : 0
                }
            },
            getWithinInfo: function(b) {
                var c = a(b || window),
                    d = a.isWindow(c[0]),
                    e = !!c[0] && 9 === c[0].nodeType,
                    f = !d && !e;
                return {
                    element: c,
                    isWindow: d,
                    isDocument: e,
                    offset: f ? a(b).offset() : {
                        left: 0,
                        top: 0
                    },
                    scrollLeft: c.scrollLeft(),
                    scrollTop: c.scrollTop(),
                    width: c.outerWidth(),
                    height: c.outerHeight()
                }
            }
        }, a.fn.position = function(e) {
            if (!e || !e.of) return m.apply(this, arguments);
            e = a.extend({}, e);
            var l, n, o, p, q, r, s = a(e.of),
                t = a.position.getWithinInfo(e.within),
                u = a.position.getScrollInfo(t),
                v = (e.collision || "flip").split(" "),
                w = {};
            return r = d(s), s[0].preventDefault && (e.at = "left top"), n = r.width, o = r.height, p = r.offset, q = a.extend({}, p), a.each(["my", "at"], function() {
                var a, b, c = (e[this] || "").split(" ");
                1 === c.length && (c = h.test(c[0]) ? c.concat(["center"]) : i.test(c[0]) ? ["center"].concat(c) : ["center", "center"]), c[0] = h.test(c[0]) ? c[0] : "center", c[1] = i.test(c[1]) ? c[1] : "center", a = j.exec(c[0]), b = j.exec(c[1]), w[this] = [a ? a[0] : 0, b ? b[0] : 0], e[this] = [k.exec(c[0])[0], k.exec(c[1])[0]]
            }), 1 === v.length && (v[1] = v[0]), "right" === e.at[0] ? q.left += n : "center" === e.at[0] && (q.left += n / 2), "bottom" === e.at[1] ? q.top += o : "center" === e.at[1] && (q.top += o / 2), l = b(w.at, n, o), q.left += l[0], q.top += l[1], this.each(function() {
                var d, h, i = a(this),
                    j = i.outerWidth(),
                    k = i.outerHeight(),
                    m = c(this, "marginLeft"),
                    r = c(this, "marginTop"),
                    x = j + m + c(this, "marginRight") + u.width,
                    y = k + r + c(this, "marginBottom") + u.height,
                    z = a.extend({}, q),
                    A = b(w.my, i.outerWidth(), i.outerHeight());
                "right" === e.my[0] ? z.left -= j : "center" === e.my[0] && (z.left -= j / 2), "bottom" === e.my[1] ? z.top -= k : "center" === e.my[1] && (z.top -= k / 2), z.left += A[0], z.top += A[1], d = {
                    marginLeft: m,
                    marginTop: r
                }, a.each(["left", "top"], function(b, c) {
                    a.ui.position[v[b]] && a.ui.position[v[b]][c](z, {
                        targetWidth: n,
                        targetHeight: o,
                        elemWidth: j,
                        elemHeight: k,
                        collisionPosition: d,
                        collisionWidth: x,
                        collisionHeight: y,
                        offset: [l[0] + A[0], l[1] + A[1]],
                        my: e.my,
                        at: e.at,
                        within: t,
                        elem: i
                    })
                }), e.using && (h = function(a) {
                    var b = p.left - z.left,
                        c = b + n - j,
                        d = p.top - z.top,
                        h = d + o - k,
                        l = {
                            target: {
                                element: s,
                                left: p.left,
                                top: p.top,
                                width: n,
                                height: o
                            },
                            element: {
                                element: i,
                                left: z.left,
                                top: z.top,
                                width: j,
                                height: k
                            },
                            horizontal: c < 0 ? "left" : b > 0 ? "right" : "center",
                            vertical: h < 0 ? "top" : d > 0 ? "bottom" : "middle"
                        };
                    n < j && g(b + c) < n && (l.horizontal = "center"), o < k && g(d + h) < o && (l.vertical = "middle"), f(g(b), g(c)) > f(g(d), g(h)) ? l.important = "horizontal" : l.important = "vertical", e.using.call(this, a, l)
                }), i.offset(a.extend(z, {
                    using: h
                }))
            })
        }, a.ui.position = {
            fit: {
                left: function(a, b) {
                    var c, d = b.within,
                        e = d.isWindow ? d.scrollLeft : d.offset.left,
                        g = d.width,
                        h = a.left - b.collisionPosition.marginLeft,
                        i = e - h,
                        j = h + b.collisionWidth - g - e;
                    b.collisionWidth > g ? i > 0 && j <= 0 ? (c = a.left + i + b.collisionWidth - g - e, a.left += i - c) : j > 0 && i <= 0 ? a.left = e : i > j ? a.left = e + g - b.collisionWidth : a.left = e : i > 0 ? a.left += i : j > 0 ? a.left -= j : a.left = f(a.left - h, a.left)
                },
                top: function(a, b) {
                    var c, d = b.within,
                        e = d.isWindow ? d.scrollTop : d.offset.top,
                        g = b.within.height,
                        h = a.top - b.collisionPosition.marginTop,
                        i = e - h,
                        j = h + b.collisionHeight - g - e;
                    b.collisionHeight > g ? i > 0 && j <= 0 ? (c = a.top + i + b.collisionHeight - g - e, a.top += i - c) : j > 0 && i <= 0 ? a.top = e : i > j ? a.top = e + g - b.collisionHeight : a.top = e : i > 0 ? a.top += i : j > 0 ? a.top -= j : a.top = f(a.top - h, a.top)
                }
            },
            flip: {
                left: function(a, b) {
                    var c, d, e = b.within,
                        f = e.offset.left + e.scrollLeft,
                        h = e.width,
                        i = e.isWindow ? e.scrollLeft : e.offset.left,
                        j = a.left - b.collisionPosition.marginLeft,
                        k = j - i,
                        l = j + b.collisionWidth - h - i,
                        m = "left" === b.my[0] ? -b.elemWidth : "right" === b.my[0] ? b.elemWidth : 0,
                        n = "left" === b.at[0] ? b.targetWidth : "right" === b.at[0] ? -b.targetWidth : 0,
                        o = -2 * b.offset[0];
                    k < 0 ? (c = a.left + m + n + o + b.collisionWidth - h - f, (c < 0 || c < g(k)) && (a.left += m + n + o)) : l > 0 && (d = a.left - b.collisionPosition.marginLeft + m + n + o - i, (d > 0 || g(d) < l) && (a.left += m + n + o))
                },
                top: function(a, b) {
                    var c, d, e = b.within,
                        f = e.offset.top + e.scrollTop,
                        h = e.height,
                        i = e.isWindow ? e.scrollTop : e.offset.top,
                        j = a.top - b.collisionPosition.marginTop,
                        k = j - i,
                        l = j + b.collisionHeight - h - i,
                        m = "top" === b.my[1],
                        n = m ? -b.elemHeight : "bottom" === b.my[1] ? b.elemHeight : 0,
                        o = "top" === b.at[1] ? b.targetHeight : "bottom" === b.at[1] ? -b.targetHeight : 0,
                        p = -2 * b.offset[1];
                    k < 0 ? (d = a.top + n + o + p + b.collisionHeight - h - f, (d < 0 || d < g(k)) && (a.top += n + o + p)) : l > 0 && (c = a.top - b.collisionPosition.marginTop + n + o + p - i, (c > 0 || g(c) < l) && (a.top += n + o + p))
                }
            },
            flipfit: {
                left: function() {
                    a.ui.position.flip.left.apply(this, arguments), a.ui.position.fit.left.apply(this, arguments)
                },
                top: function() {
                    a.ui.position.flip.top.apply(this, arguments), a.ui.position.fit.top.apply(this, arguments)
                }
            }
        }
    }(), a.ui.position
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery", "./mouse", "../disable-selection", "../plugin", "../version", "../widget"], a) : a(jQuery)
}(function(a) {
    return a.widget("ui.resizable", a.ui.mouse, {
        version: "1.12.1",
        widgetEventPrefix: "resize",
        options: {
            alsoResize: !1,
            animate: !1,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: !1,
            autoHide: !1,
            classes: {
                "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
            },
            containment: !1,
            ghost: !1,
            grid: !1,
            handles: "e,s,se",
            helper: !1,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 90,
            resize: null,
            start: null,
            stop: null
        },
        _num: function(a) {
            return parseFloat(a) || 0
        },
        _isNumber: function(a) {
            return !isNaN(parseFloat(a))
        },
        _hasScroll: function(b, c) {
            if ("hidden" === a(b).css("overflow")) return !1;
            var d = c && "left" === c ? "scrollLeft" : "scrollTop",
                e = !1;
            return b[d] > 0 || (b[d] = 1, e = b[d] > 0, b[d] = 0, e)
        },
        _create: function() {
            var b, c = this.options,
                d = this;
            this._addClass("ui-resizable"), a.extend(this, {
                _aspectRatio: !!c.aspectRatio,
                aspectRatio: c.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: c.helper || c.ghost || c.animate ? c.helper || "ui-resizable-helper" : null
            }), this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i) && (this.element.wrap(a("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
                position: this.element.css("position"),
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                top: this.element.css("top"),
                left: this.element.css("left")
            })), this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance")), this.elementIsWrapper = !0, b = {
                marginTop: this.originalElement.css("marginTop"),
                marginRight: this.originalElement.css("marginRight"),
                marginBottom: this.originalElement.css("marginBottom"),
                marginLeft: this.originalElement.css("marginLeft")
            }, this.element.css(b), this.originalElement.css("margin", 0), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({
                position: "static",
                zoom: 1,
                display: "block"
            })), this.originalElement.css(b), this._proportionallyResize()), this._setupHandles(), c.autoHide && a(this.element).on("mouseenter", function() {
                c.disabled || (d._removeClass("ui-resizable-autohide"), d._handles.show())
            }).on("mouseleave", function() {
                c.disabled || d.resizing || (d._addClass("ui-resizable-autohide"), d._handles.hide())
            }), this._mouseInit()
        },
        _destroy: function() {
            this._mouseDestroy();
            var b, c = function(b) {
                a(b).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()
            };
            return this.elementIsWrapper && (c(this.element), b = this.element, this.originalElement.css({
                position: b.css("position"),
                width: b.outerWidth(),
                height: b.outerHeight(),
                top: b.css("top"),
                left: b.css("left")
            }).insertAfter(b), b.remove()), this.originalElement.css("resize", this.originalResizeStyle), c(this.originalElement), this
        },
        _setOption: function(a, b) {
            switch (this._super(a, b), a) {
                case "handles":
                    this._removeHandles(), this._setupHandles()
            }
        },
        _setupHandles: function() {
            var b, c, d, e, f, g = this.options,
                h = this;
            if (this.handles = g.handles || (a(".ui-resizable-handle", this.element).length ? {
                    n: ".ui-resizable-n",
                    e: ".ui-resizable-e",
                    s: ".ui-resizable-s",
                    w: ".ui-resizable-w",
                    se: ".ui-resizable-se",
                    sw: ".ui-resizable-sw",
                    ne: ".ui-resizable-ne",
                    nw: ".ui-resizable-nw"
                } : "e,s,se"), this._handles = a(), this.handles.constructor === String)
                for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"), d = this.handles.split(","), this.handles = {}, c = 0; c < d.length; c++) b = a.trim(d[c]), e = "ui-resizable-" + b, f = a("<div>"), this._addClass(f, "ui-resizable-handle " + e), f.css({
                    zIndex: g.zIndex
                }), this.handles[b] = ".ui-resizable-" + b, this.element.append(f);
            this._renderAxis = function(b) {
                var c, d, e, f;
                b = b || this.element;
                for (c in this.handles) this.handles[c].constructor === String ? this.handles[c] = this.element.children(this.handles[c]).first().show() : (this.handles[c].jquery || this.handles[c].nodeType) && (this.handles[c] = a(this.handles[c]), this._on(this.handles[c], {
                    mousedown: h._mouseDown
                })), this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i) && (d = a(this.handles[c], this.element), f = /sw|ne|nw|se|n|s/.test(c) ? d.outerHeight() : d.outerWidth(), e = ["padding", /ne|nw|n/.test(c) ? "Top" : /se|sw|s/.test(c) ? "Bottom" : /^e$/.test(c) ? "Right" : "Left"].join(""), b.css(e, f), this._proportionallyResize()), this._handles = this._handles.add(this.handles[c])
            }, this._renderAxis(this.element), this._handles = this._handles.add(this.element.find(".ui-resizable-handle")), this._handles.disableSelection(), this._handles.on("mouseover", function() {
                h.resizing || (this.className && (f = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)), h.axis = f && f[1] ? f[1] : "se")
            }), g.autoHide && (this._handles.hide(), this._addClass("ui-resizable-autohide"))
        },
        _removeHandles: function() {
            this._handles.remove()
        },
        _mouseCapture: function(b) {
            var c, d, e = !1;
            for (c in this.handles) d = a(this.handles[c])[0], (d === b.target || a.contains(d, b.target)) && (e = !0);
            return !this.options.disabled && e
        },
        _mouseStart: function(b) {
            var c, d, e, f = this.options,
                g = this.element;
            return this.resizing = !0, this._renderProxy(), c = this._num(this.helper.css("left")), d = this._num(this.helper.css("top")), f.containment && (c += a(f.containment).scrollLeft() || 0, d += a(f.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = {
                left: c,
                top: d
            }, this.size = this._helper ? {
                width: this.helper.width(),
                height: this.helper.height()
            } : {
                width: g.width(),
                height: g.height()
            }, this.originalSize = this._helper ? {
                width: g.outerWidth(),
                height: g.outerHeight()
            } : {
                width: g.width(),
                height: g.height()
            }, this.sizeDiff = {
                width: g.outerWidth() - g.width(),
                height: g.outerHeight() - g.height()
            }, this.originalPosition = {
                left: c,
                top: d
            }, this.originalMousePosition = {
                left: b.pageX,
                top: b.pageY
            }, this.aspectRatio = "number" == typeof f.aspectRatio ? f.aspectRatio : this.originalSize.width / this.originalSize.height || 1, e = a(".ui-resizable-" + this.axis).css("cursor"), a("body").css("cursor", "auto" === e ? this.axis + "-resize" : e), this._addClass("ui-resizable-resizing"), this._propagate("start", b), !0
        },
        _mouseDrag: function(b) {
            var c, d, e = this.originalMousePosition,
                f = this.axis,
                g = b.pageX - e.left || 0,
                h = b.pageY - e.top || 0,
                i = this._change[f];
            return this._updatePrevProperties(), !!i && (c = i.apply(this, [b, g, h]), this._updateVirtualBoundaries(b.shiftKey), (this._aspectRatio || b.shiftKey) && (c = this._updateRatio(c, b)), c = this._respectSize(c, b), this._updateCache(c), this._propagate("resize", b), d = this._applyChanges(), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), a.isEmptyObject(d) || (this._updatePrevProperties(), this._trigger("resize", b, this.ui()), this._applyChanges()), !1)
        },
        _mouseStop: function(b) {
            this.resizing = !1;
            var c, d, e, f, g, h, i, j = this.options,
                k = this;
            return this._helper && (c = this._proportionallyResizeElements, d = c.length && /textarea/i.test(c[0].nodeName), e = d && this._hasScroll(c[0], "left") ? 0 : k.sizeDiff.height, f = d ? 0 : k.sizeDiff.width, g = {
                width: k.helper.width() - f,
                height: k.helper.height() - e
            }, h = parseFloat(k.element.css("left")) + (k.position.left - k.originalPosition.left) || null, i = parseFloat(k.element.css("top")) + (k.position.top - k.originalPosition.top) || null, j.animate || this.element.css(a.extend(g, {
                top: i,
                left: h
            })), k.helper.height(k.size.height), k.helper.width(k.size.width), this._helper && !j.animate && this._proportionallyResize()), a("body").css("cursor", "auto"), this._removeClass("ui-resizable-resizing"), this._propagate("stop", b), this._helper && this.helper.remove(), !1
        },
        _updatePrevProperties: function() {
            this.prevPosition = {
                top: this.position.top,
                left: this.position.left
            }, this.prevSize = {
                width: this.size.width,
                height: this.size.height
            }
        },
        _applyChanges: function() {
            var a = {};
            return this.position.top !== this.prevPosition.top && (a.top = this.position.top + "px"), this.position.left !== this.prevPosition.left && (a.left = this.position.left + "px"), this.size.width !== this.prevSize.width && (a.width = this.size.width + "px"), this.size.height !== this.prevSize.height && (a.height = this.size.height + "px"), this.helper.css(a), a
        },
        _updateVirtualBoundaries: function(a) {
            var b, c, d, e, f, g = this.options;
            f = {
                minWidth: this._isNumber(g.minWidth) ? g.minWidth : 0,
                maxWidth: this._isNumber(g.maxWidth) ? g.maxWidth : 1 / 0,
                minHeight: this._isNumber(g.minHeight) ? g.minHeight : 0,
                maxHeight: this._isNumber(g.maxHeight) ? g.maxHeight : 1 / 0
            }, (this._aspectRatio || a) && (b = f.minHeight * this.aspectRatio, d = f.minWidth / this.aspectRatio, c = f.maxHeight * this.aspectRatio, e = f.maxWidth / this.aspectRatio, b > f.minWidth && (f.minWidth = b), d > f.minHeight && (f.minHeight = d), c < f.maxWidth && (f.maxWidth = c), e < f.maxHeight && (f.maxHeight = e)), this._vBoundaries = f
        },
        _updateCache: function(a) {
            this.offset = this.helper.offset(), this._isNumber(a.left) && (this.position.left = a.left), this._isNumber(a.top) && (this.position.top = a.top), this._isNumber(a.height) && (this.size.height = a.height), this._isNumber(a.width) && (this.size.width = a.width)
        },
        _updateRatio: function(a) {
            var b = this.position,
                c = this.size,
                d = this.axis;
            return this._isNumber(a.height) ? a.width = a.height * this.aspectRatio : this._isNumber(a.width) && (a.height = a.width / this.aspectRatio), "sw" === d && (a.left = b.left + (c.width - a.width), a.top = null), "nw" === d && (a.top = b.top + (c.height - a.height), a.left = b.left + (c.width - a.width)), a
        },
        _respectSize: function(a) {
            var b = this._vBoundaries,
                c = this.axis,
                d = this._isNumber(a.width) && b.maxWidth && b.maxWidth < a.width,
                e = this._isNumber(a.height) && b.maxHeight && b.maxHeight < a.height,
                f = this._isNumber(a.width) && b.minWidth && b.minWidth > a.width,
                g = this._isNumber(a.height) && b.minHeight && b.minHeight > a.height,
                h = this.originalPosition.left + this.originalSize.width,
                i = this.originalPosition.top + this.originalSize.height,
                j = /sw|nw|w/.test(c),
                k = /nw|ne|n/.test(c);
            return f && (a.width = b.minWidth), g && (a.height = b.minHeight), d && (a.width = b.maxWidth), e && (a.height = b.maxHeight), f && j && (a.left = h - b.minWidth), d && j && (a.left = h - b.maxWidth), g && k && (a.top = i - b.minHeight), e && k && (a.top = i - b.maxHeight), a.width || a.height || a.left || !a.top ? a.width || a.height || a.top || !a.left || (a.left = null) : a.top = null, a
        },
        _getPaddingPlusBorderDimensions: function(a) {
            for (var b = 0, c = [], d = [a.css("borderTopWidth"), a.css("borderRightWidth"), a.css("borderBottomWidth"), a.css("borderLeftWidth")], e = [a.css("paddingTop"), a.css("paddingRight"), a.css("paddingBottom"), a.css("paddingLeft")]; b < 4; b++) c[b] = parseFloat(d[b]) || 0, c[b] += parseFloat(e[b]) || 0;
            return {
                height: c[0] + c[2],
                width: c[1] + c[3]
            }
        },
        _proportionallyResize: function() {
            if (this._proportionallyResizeElements.length)
                for (var a, b = 0, c = this.helper || this.element; b < this._proportionallyResizeElements.length; b++) a = this._proportionallyResizeElements[b], this.outerDimensions || (this.outerDimensions = this._getPaddingPlusBorderDimensions(a)), a.css({
                    height: c.height() - this.outerDimensions.height || 0,
                    width: c.width() - this.outerDimensions.width || 0
                })
        },
        _renderProxy: function() {
            var b = this.element,
                c = this.options;
            this.elementOffset = b.offset(), this._helper ? (this.helper = this.helper || a("<div style='overflow:hidden;'></div>"), this._addClass(this.helper, this._helper), this.helper.css({
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: this.elementOffset.top + "px",
                zIndex: ++c.zIndex
            }), this.helper.appendTo("body").disableSelection()) : this.helper = this.element
        },
        _change: {
            e: function(a, b) {
                return {
                    width: this.originalSize.width + b
                }
            },
            w: function(a, b) {
                var c = this.originalSize,
                    d = this.originalPosition;
                return {
                    left: d.left + b,
                    width: c.width - b
                }
            },
            n: function(a, b, c) {
                var d = this.originalSize,
                    e = this.originalPosition;
                return {
                    top: e.top + c,
                    height: d.height - c
                }
            },
            s: function(a, b, c) {
                return {
                    height: this.originalSize.height + c
                }
            },
            se: function(b, c, d) {
                return a.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [b, c, d]))
            },
            sw: function(b, c, d) {
                return a.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [b, c, d]))
            },
            ne: function(b, c, d) {
                return a.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [b, c, d]))
            },
            nw: function(b, c, d) {
                return a.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [b, c, d]))
            }
        },
        _propagate: function(b, c) {
            a.ui.plugin.call(this, b, [c, this.ui()]), "resize" !== b && this._trigger(b, c, this.ui())
        },
        plugins: {},
        ui: function() {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            }
        }
    }), a.ui.plugin.add("resizable", "animate", {
        stop: function(b) {
            var c = a(this).resizable("instance"),
                d = c.options,
                e = c._proportionallyResizeElements,
                f = e.length && /textarea/i.test(e[0].nodeName),
                g = f && c._hasScroll(e[0], "left") ? 0 : c.sizeDiff.height,
                h = f ? 0 : c.sizeDiff.width,
                i = {
                    width: c.size.width - h,
                    height: c.size.height - g
                },
                j = parseFloat(c.element.css("left")) + (c.position.left - c.originalPosition.left) || null,
                k = parseFloat(c.element.css("top")) + (c.position.top - c.originalPosition.top) || null;
            c.element.animate(a.extend(i, k && j ? {
                top: k,
                left: j
            } : {}), {
                duration: d.animateDuration,
                easing: d.animateEasing,
                step: function() {
                    var d = {
                        width: parseFloat(c.element.css("width")),
                        height: parseFloat(c.element.css("height")),
                        top: parseFloat(c.element.css("top")),
                        left: parseFloat(c.element.css("left"))
                    };
                    e && e.length && a(e[0]).css({
                        width: d.width,
                        height: d.height
                    }), c._updateCache(d), c._propagate("resize", b)
                }
            })
        }
    }), a.ui.plugin.add("resizable", "containment", {
        start: function() {
            var b, c, d, e, f, g, h, i = a(this).resizable("instance"),
                j = i.options,
                k = i.element,
                l = j.containment,
                m = l instanceof a ? l.get(0) : /parent/.test(l) ? k.parent().get(0) : l;
            m && (i.containerElement = a(m), /document/.test(l) || l === document ? (i.containerOffset = {
                left: 0,
                top: 0
            }, i.containerPosition = {
                left: 0,
                top: 0
            }, i.parentData = {
                element: a(document),
                left: 0,
                top: 0,
                width: a(document).width(),
                height: a(document).height() || document.body.parentNode.scrollHeight
            }) : (b = a(m), c = [], a(["Top", "Right", "Left", "Bottom"]).each(function(a, d) {
                c[a] = i._num(b.css("padding" + d))
            }), i.containerOffset = b.offset(), i.containerPosition = b.position(), i.containerSize = {
                height: b.innerHeight() - c[3],
                width: b.innerWidth() - c[1]
            }, d = i.containerOffset, e = i.containerSize.height, f = i.containerSize.width, g = i._hasScroll(m, "left") ? m.scrollWidth : f, h = i._hasScroll(m) ? m.scrollHeight : e, i.parentData = {
                element: m,
                left: d.left,
                top: d.top,
                width: g,
                height: h
            }))
        },
        resize: function(b) {
            var c, d, e, f, g = a(this).resizable("instance"),
                h = g.options,
                i = g.containerOffset,
                j = g.position,
                k = g._aspectRatio || b.shiftKey,
                l = {
                    top: 0,
                    left: 0
                },
                m = g.containerElement,
                n = !0;
            m[0] !== document && /static/.test(m.css("position")) && (l = i), j.left < (g._helper ? i.left : 0) && (g.size.width = g.size.width + (g._helper ? g.position.left - i.left : g.position.left - l.left), k && (g.size.height = g.size.width / g.aspectRatio, n = !1), g.position.left = h.helper ? i.left : 0), j.top < (g._helper ? i.top : 0) && (g.size.height = g.size.height + (g._helper ? g.position.top - i.top : g.position.top), k && (g.size.width = g.size.height * g.aspectRatio, n = !1), g.position.top = g._helper ? i.top : 0), e = g.containerElement.get(0) === g.element.parent().get(0), f = /relative|absolute/.test(g.containerElement.css("position")), e && f ? (g.offset.left = g.parentData.left + g.position.left, g.offset.top = g.parentData.top + g.position.top) : (g.offset.left = g.element.offset().left, g.offset.top = g.element.offset().top), c = Math.abs(g.sizeDiff.width + (g._helper ? g.offset.left - l.left : g.offset.left - i.left)), d = Math.abs(g.sizeDiff.height + (g._helper ? g.offset.top - l.top : g.offset.top - i.top)), c + g.size.width >= g.parentData.width && (g.size.width = g.parentData.width - c, k && (g.size.height = g.size.width / g.aspectRatio, n = !1)), d + g.size.height >= g.parentData.height && (g.size.height = g.parentData.height - d, k && (g.size.width = g.size.height * g.aspectRatio, n = !1)), n || (g.position.left = g.prevPosition.left, g.position.top = g.prevPosition.top, g.size.width = g.prevSize.width, g.size.height = g.prevSize.height)
        },
        stop: function() {
            var b = a(this).resizable("instance"),
                c = b.options,
                d = b.containerOffset,
                e = b.containerPosition,
                f = b.containerElement,
                g = a(b.helper),
                h = g.offset(),
                i = g.outerWidth() - b.sizeDiff.width,
                j = g.outerHeight() - b.sizeDiff.height;
            b._helper && !c.animate && /relative/.test(f.css("position")) && a(this).css({
                left: h.left - e.left - d.left,
                width: i,
                height: j
            }), b._helper && !c.animate && /static/.test(f.css("position")) && a(this).css({
                left: h.left - e.left - d.left,
                width: i,
                height: j
            })
        }
    }), a.ui.plugin.add("resizable", "alsoResize", {
        start: function() {
            var b = a(this).resizable("instance"),
                c = b.options;
            a(c.alsoResize).each(function() {
                var b = a(this);
                b.data("ui-resizable-alsoresize", {
                    width: parseFloat(b.width()),
                    height: parseFloat(b.height()),
                    left: parseFloat(b.css("left")),
                    top: parseFloat(b.css("top"))
                })
            })
        },
        resize: function(b, c) {
            var d = a(this).resizable("instance"),
                e = d.options,
                f = d.originalSize,
                g = d.originalPosition,
                h = {
                    height: d.size.height - f.height || 0,
                    width: d.size.width - f.width || 0,
                    top: d.position.top - g.top || 0,
                    left: d.position.left - g.left || 0
                };
            a(e.alsoResize).each(function() {
                var b = a(this),
                    d = a(this).data("ui-resizable-alsoresize"),
                    e = {},
                    f = b.parents(c.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                a.each(f, function(a, b) {
                    var c = (d[b] || 0) + (h[b] || 0);
                    c && c >= 0 && (e[b] = c || null)
                }), b.css(e)
            })
        },
        stop: function() {
            a(this).removeData("ui-resizable-alsoresize")
        }
    }), a.ui.plugin.add("resizable", "ghost", {
        start: function() {
            var b = a(this).resizable("instance"),
                c = b.size;
            b.ghost = b.originalElement.clone(), b.ghost.css({
                opacity: .25,
                display: "block",
                position: "relative",
                height: c.height,
                width: c.width,
                margin: 0,
                left: 0,
                top: 0
            }), b._addClass(b.ghost, "ui-resizable-ghost"), a.uiBackCompat !== !1 && "string" == typeof b.options.ghost && b.ghost.addClass(this.options.ghost), b.ghost.appendTo(b.helper)
        },
        resize: function() {
            var b = a(this).resizable("instance");
            b.ghost && b.ghost.css({
                position: "relative",
                height: b.size.height,
                width: b.size.width
            })
        },
        stop: function() {
            var b = a(this).resizable("instance");
            b.ghost && b.helper && b.helper.get(0).removeChild(b.ghost.get(0))
        }
    }), a.ui.plugin.add("resizable", "grid", {
        resize: function() {
            var b, c = a(this).resizable("instance"),
                d = c.options,
                e = c.size,
                f = c.originalSize,
                g = c.originalPosition,
                h = c.axis,
                i = "number" == typeof d.grid ? [d.grid, d.grid] : d.grid,
                j = i[0] || 1,
                k = i[1] || 1,
                l = Math.round((e.width - f.width) / j) * j,
                m = Math.round((e.height - f.height) / k) * k,
                n = f.width + l,
                o = f.height + m,
                p = d.maxWidth && d.maxWidth < n,
                q = d.maxHeight && d.maxHeight < o,
                r = d.minWidth && d.minWidth > n,
                s = d.minHeight && d.minHeight > o;
            d.grid = i, r && (n += j), s && (o += k), p && (n -= j), q && (o -= k), /^(se|s|e)$/.test(h) ? (c.size.width = n, c.size.height = o) : /^(ne)$/.test(h) ? (c.size.width = n, c.size.height = o, c.position.top = g.top - m) : /^(sw)$/.test(h) ? (c.size.width = n, c.size.height = o, c.position.left = g.left - l) : ((o - k <= 0 || n - j <= 0) && (b = c._getPaddingPlusBorderDimensions(this)), o - k > 0 ? (c.size.height = o, c.position.top = g.top - m) : (o = k - b.height, c.size.height = o, c.position.top = g.top + f.height - o), n - j > 0 ? (c.size.width = n, c.position.left = g.left - l) : (n = j - b.width, c.size.width = n, c.position.left = g.left + f.width - n))
        }
    }), a.ui.resizable
});;
/**
 * @file
 * Bootstrap Modals.
 */
(function($, Drupal, Bootstrap, Attributes, drupalSettings) {
    'use strict';

    /**
     * Only process this once.
     */
    Bootstrap.once('modal.jquery.ui.bridge', function(settings) {
        // RTL support.
        var rtl = document.documentElement.getAttribute('dir').toLowerCase() === 'rtl';

        // Override drupal.dialog button classes. This must be done on DOM ready
        // since core/drupal.dialog technically depends on this file and has not
        // yet set their default settings.
        $(function() {
            drupalSettings.dialog.buttonClass = 'btn';
            drupalSettings.dialog.buttonPrimaryClass = 'btn-primary';
        });

        var relayEvent = function($element, name, stopPropagation) {
            return function(e) {
                if (stopPropagation === void 0 || stopPropagation) {
                    e.stopPropagation();
                }
                var parts = name.split('.').filter(Boolean);
                var type = parts.shift();
                e.target = $element[0];
                e.currentTarget = $element[0];
                e.namespace = parts.join('.');
                e.type = type;
                $element.trigger(e);
            };
        };

        /**
         * Proxy $.fn.dialog to $.fn.modal.
         */
        var Dialog = function(options) {
            // When only options are passed, jQuery UI dialog treats this like a
            // initialization method. Destroy any existing Bootstrap modal and
            // recreate it using the contents of the dialog HTML.
            if (arguments.length === 1 && typeof options === 'object') {
                this.each($.fn.dialog.ensureModalStructure);

                // Proxy to the Bootstrap Modal plugin, indicating that this is a
                // jQuery UI dialog bridge.
                return $.fn.modal.apply(this, [{
                    dialogOptions: options,
                    jQueryUiBridge: true
                }]);
            }

            // Otherwise, proxy all arguments to the Bootstrap Modal plugin.
            return $.fn.modal.apply(this, arguments);
        };

        /**
         * Ensures a DOM element has the appropriate structure for a modal.
         *
         * Note: this can get a little tricky. Core potentially already
         * semi-processes a "dialog" if was created using an Ajax command
         * (i.e. prepareDialogButtons in drupal.ajax.js). Because of this, the
         * contents (HTML) of the existing element cannot simply be dumped into a
         * newly created modal. This would destroy any existing event bindings.
         * Instead, the contents must be "moved" (appended) to the new modal and
         * then "moved" again back to the to the existing container as needed.
         */
        Dialog.ensureModalStructure = function() {
            var $element = $(this);

            // Immediately return if the modal was already converted into a proper modal.
            if ($element.is('[data-drupal-theme="bootstrapModal"]')) {
                return;
            }

            // Create a new modal.
            var $modal = $(Drupal.theme('bootstrapModal', {
                attributes: Attributes.create(this).remove('style').set('data-drupal-theme', 'bootstrapModal'),
            }));

            // Store a reference to the content inside the existing element container.
            // This references the actual DOM node elements which will allow
            // jQuery to "move" then when appending below. Using $.fn.children()
            // does not return any text nodes present and $.fn.html() only returns
            // a string representation of the content, which effectively destroys
            // any prior event bindings or processing.
            var $body = $element.find('.modal-body');
            var $existing = $body[0] ? $body.contents() : $element.contents();

            // Set the attributes of the dialog to that of the newly created modal.
            $element.attr(Attributes.create($modal).toPlainObject());

            // Append the newly created modal markup.
            $element.append($modal.html());

            // Move the existing HTML into the modal markup that was just appended.
            $element.find('.modal-body').append($existing);
        };

        Bootstrap.createPlugin('dialog', Dialog);

        /**
         * Extend the Bootstrap Modal plugin constructor class.
         */
        Bootstrap.extendPlugin('modal', function() {
            var Modal = this;

            return {
                DEFAULTS: {
                    // By default, this option is disabled. It's only flagged when a modal
                    // was created using $.fn.dialog above.
                    jQueryUiBridge: false
                },
                prototype: {

                    /**
                     * Handler for $.fn.dialog('close').
                     */
                    close: function() {
                        var _this = this;

                        this.hide.apply(this, arguments);

                        // For some reason (likely due to the transition event not being
                        // registered properly), the backdrop doesn't always get removed
                        // after the above "hide" method is invoked . Instead, ensure the
                        // backdrop is removed after the transition duration by manually
                        // invoking the internal "hideModal" method shortly thereafter.
                        setTimeout(function() {
                            if (!_this.isShown && _this.$backdrop) {
                                _this.hideModal();
                            }
                        }, (Modal.TRANSITION_DURATION !== void 0 ? Modal.TRANSITION_DURATION : 300) + 10);
                    },

                    /**
                     * Creates any necessary buttons from dialog options.
                     */
                    createButtons: function() {
                        this.$footer.find('.modal-buttons').remove();

                        // jQuery UI supports both objects and arrays. Unfortunately
                        // developers have misunderstood and abused this by simply placing
                        // the objects that should be in an array inside an object with
                        // arbitrary keys (likely to target specific buttons as a hack).
                        var buttons = this.options.dialogOptions && this.options.dialogOptions.buttons || [];
                        if (!Array.isArray(buttons)) {
                            var array = [];
                            for (var k in buttons) {
                                // Support the proper object values: label => click callback.
                                if (typeof buttons[k] === 'function') {
                                    array.push({
                                        label: k,
                                        click: buttons[k],
                                    });
                                }
                                // Support nested objects, but log a warning.
                                else if (buttons[k].text || buttons[k].label) {
                                    Bootstrap.warn('Malformed jQuery UI dialog button: @key. The button object should be inside an array.', {
                                        '@key': k
                                    });
                                    array.push(buttons[k]);
                                } else {
                                    Bootstrap.unsupported('button', k, buttons[k]);
                                }
                            }
                            buttons = array;
                        }

                        if (buttons.length) {
                            var $buttons = $('<div class="modal-buttons"/>').appendTo(this.$footer);
                            for (var i = 0, l = buttons.length; i < l; i++) {
                                var button = buttons[i];
                                var $button = $(Drupal.theme('bootstrapModalDialogButton', button));

                                // Invoke the "create" method for jQuery UI buttons.
                                if (typeof button.create === 'function') {
                                    button.create.call($button[0]);
                                }

                                // Bind the "click" method for jQuery UI buttons to the modal.
                                if (typeof button.click === 'function') {
                                    $button.on('click', button.click.bind(this.$element));
                                }

                                $buttons.append($button);
                            }
                        }

                        // Toggle footer visibility based on whether it has child elements.
                        this.$footer[this.$footer.children()[0] ? 'show' : 'hide']();
                    },

                    /**
                     * Initializes the Bootstrap Modal.
                     */
                    init: function() {
                        // Relay necessary events.
                        if (this.options.jQueryUiBridge) {
                            this.$element.on('hide.bs.modal', relayEvent(this.$element, 'dialogbeforeclose', false));
                            this.$element.on('hidden.bs.modal', relayEvent(this.$element, 'dialogclose', false));
                            this.$element.on('show.bs.modal', relayEvent(this.$element, 'dialogcreate', false));
                            this.$element.on('shown.bs.modal', relayEvent(this.$element, 'dialogopen', false));
                        }

                        // Create a footer if one doesn't exist.
                        // This is necessary in case dialog.ajax.js decides to add buttons.
                        if (!this.$footer[0]) {
                            this.$footer = $(Drupal.theme('bootstrapModalFooter', {}, true)).insertAfter(this.$dialogBody);
                        }

                        // Now call the parent init method.
                        this.super();

                        // Handle autoResize option (this is a drupal.dialog option).
                        if (this.options.dialogOptions && this.options.dialogOptions.autoResize && this.options.dialogOptions.position) {
                            this.position(this.options.dialogOptions.position);
                        }

                        // If show is enabled and currently not shown, show it.
                        if (this.options.jQueryUiBridge && this.options.show && !this.isShown) {
                            this.show();
                        }
                    },

                    /**
                     * Handler for $.fn.dialog('instance').
                     */
                    instance: function() {
                        Bootstrap.unsupported('method', 'instance', arguments);
                    },

                    /**
                     * Handler for $.fn.dialog('isOpen').
                     */
                    isOpen: function() {
                        return !!this.isShown;
                    },

                    /**
                     * Maps dialog options to the modal.
                     *
                     * @param {Object} options
                     *   The options to map.
                     */
                    mapDialogOptions: function(options) {
                        var mappedOptions = {};
                        var dialogOptions = options.dialogOptions || {};

                        // Remove any existing dialog options.
                        delete options.dialogOptions;

                        // Separate Bootstrap modal options from jQuery UI dialog options.
                        for (var k in options) {
                            if (Modal.DEFAULTS.hasOwnProperty(k)) {
                                mappedOptions[k] = options[k];
                            } else {
                                dialogOptions[k] = options[k];
                            }
                        }


                        // Handle CSS properties.
                        var cssUnitRegExp = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)?$/;
                        var parseCssUnit = function(value, defaultUnit) {
                            var parts = ('' + value).match(cssUnitRegExp);
                            return parts && parts[1] !== void 0 ? parts[1] + (parts[2] || defaultUnit || 'px') : null;
                        };
                        var styles = {};
                        var cssProperties = ['height', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'width'];
                        for (var i = 0, l = cssProperties.length; i < l; i++) {
                            var prop = cssProperties[i];
                            if (dialogOptions[prop] !== void 0) {
                                var value = parseCssUnit(dialogOptions[prop]);
                                if (value) {
                                    styles[prop] = value;

                                    // If there's a defined height of some kind, enforce the modal
                                    // to use flex (on modern browsers). This will ensure that
                                    // the core autoResize calculations don't cause the content
                                    // to overflow.
                                    if (dialogOptions.autoResize && (prop === 'height' || prop === 'maxHeight')) {
                                        styles.display = 'flex';
                                        styles.flexDirection = 'column';
                                        this.$dialogBody.css('overflow', 'scroll');
                                    }
                                }
                            }
                        }

                        // Apply mapped CSS styles to the modal-content container.
                        this.$content.css(styles);

                        // Handle deprecated "dialogClass" option by merging it with "classes".
                        var classesMap = {
                            'ui-dialog': 'modal-content',
                            'ui-dialog-titlebar': 'modal-header',
                            'ui-dialog-title': 'modal-title',
                            'ui-dialog-titlebar-close': 'close',
                            'ui-dialog-content': 'modal-body',
                            'ui-dialog-buttonpane': 'modal-footer'
                        };
                        if (dialogOptions.dialogClass) {
                            if (dialogOptions.classes === void 0) {
                                dialogOptions.classes = {};
                            }
                            if (dialogOptions.classes['ui-dialog'] === void 0) {
                                dialogOptions.classes['ui-dialog'] = '';
                            }
                            var dialogClass = dialogOptions.classes['ui-dialog'].split(' ');
                            dialogClass.push(dialogOptions.dialogClass);
                            dialogOptions.classes['ui-dialog'] = dialogClass.join(' ');
                            delete dialogOptions.dialogClass;
                        }

                        // Add jQuery UI classes to elements in case developers target them
                        // in callbacks.
                        for (k in classesMap) {
                            this.$element.find('.' + classesMap[k]).addClass(k);
                        }

                        // Bind events.
                        var events = [
                            'beforeClose', 'close',
                            'create',
                            'drag', 'dragStart', 'dragStop',
                            'focus',
                            'open',
                            'resize', 'resizeStart', 'resizeStop'
                        ];
                        for (i = 0, l = events.length; i < l; i++) {
                            var event = events[i].toLowerCase();
                            if (dialogOptions[event] === void 0 || typeof dialogOptions[event] !== 'function') continue;
                            this.$element.on('dialog' + event, dialogOptions[event]);
                        }

                        // Support title attribute on the modal.
                        var title;
                        if ((dialogOptions.title === null || dialogOptions.title === void 0) && (title = this.$element.attr('title'))) {
                            dialogOptions.title = title;
                        }

                        // Handle the reset of the options.
                        for (var name in dialogOptions) {
                            if (!dialogOptions.hasOwnProperty(name) || dialogOptions[name] === void 0) continue;

                            switch (name) {
                                case 'appendTo':
                                    Bootstrap.unsupported('option', name, dialogOptions.appendTo);
                                    break;

                                case 'autoOpen':
                                    mappedOptions.show = dialogOptions.show = !!dialogOptions.autoOpen;
                                    break;

                                case 'classes':
                                    if (dialogOptions.classes) {
                                        for (var key in dialogOptions.classes) {
                                            if (dialogOptions.classes.hasOwnProperty(key) && classesMap[key] !== void 0) {
                                                // Run through Attributes to sanitize classes.
                                                var attributes = Attributes.create().addClass(dialogOptions.classes[key]).toPlainObject();
                                                var selector = '.' + classesMap[key];
                                                this.$element.find(selector).addClass(attributes['class']);
                                            }
                                        }
                                    }
                                    break;

                                case 'closeOnEscape':
                                    mappedOptions.keyboard = !!dialogOptions.closeOnEscape;
                                    if (!dialogOptions.closeOnEscape && dialogOptions.modal) {
                                        mappedOptions.backdrop = 'static';
                                    }
                                    break;

                                case 'closeText':
                                    Bootstrap.unsupported('option', name, dialogOptions.closeText);
                                    break;

                                case 'draggable':
                                    this.$content
                                        .draggable({
                                            handle: '.modal-header',
                                            drag: relayEvent(this.$element, 'dialogdrag'),
                                            start: relayEvent(this.$element, 'dialogdragstart'),
                                            end: relayEvent(this.$element, 'dialogdragend')
                                        })
                                        .draggable(dialogOptions.draggable ? 'enable' : 'disable');
                                    break;

                                case 'hide':
                                    if (dialogOptions.hide === false || dialogOptions.hide === true) {
                                        this.$element[dialogOptions.hide ? 'addClass' : 'removeClass']('fade');
                                        mappedOptions.animation = dialogOptions.hide;
                                    } else {
                                        Bootstrap.unsupported('option', name + ' (complex animation)', dialogOptions.hide);
                                    }
                                    break;

                                case 'modal':
                                    if (!dialogOptions.closeOnEscape && dialogOptions.modal) {
                                        mappedOptions.backdrop = 'static';
                                    } else {
                                        mappedOptions.backdrop = dialogOptions.modal;
                                    }

                                    // If not a modal and no initial position, center it.
                                    if (!dialogOptions.modal && !dialogOptions.position) {
                                        this.position({
                                            my: 'center',
                                            of: window
                                        });
                                    }
                                    break;

                                case 'position':
                                    this.position(dialogOptions.position);
                                    break;

                                    // Resizable support (must initialize first).
                                case 'resizable':
                                    this.$content
                                        .resizable({
                                            resize: relayEvent(this.$element, 'dialogresize'),
                                            start: relayEvent(this.$element, 'dialogresizestart'),
                                            end: relayEvent(this.$element, 'dialogresizeend')
                                        })
                                        .resizable(dialogOptions.resizable ? 'enable' : 'disable');
                                    break;

                                case 'show':
                                    if (dialogOptions.show === false || dialogOptions.show === true) {
                                        this.$element[dialogOptions.show ? 'addClass' : 'removeClass']('fade');
                                        mappedOptions.animation = dialogOptions.show;
                                    } else {
                                        Bootstrap.unsupported('option', name + ' (complex animation)', dialogOptions.show);
                                    }
                                    break;

                                case 'title':
                                    this.$dialog.find('.modal-title').text(dialogOptions.title);
                                    break;

                            }
                        }

                        // Add the supported dialog options to the mapped options.
                        mappedOptions.dialogOptions = dialogOptions;

                        return mappedOptions;
                    },

                    /**
                     * Handler for $.fn.dialog('moveToTop').
                     */
                    moveToTop: function() {
                        Bootstrap.unsupported('method', 'moveToTop', arguments);
                    },

                    /**
                     * Handler for $.fn.dialog('option').
                     */
                    option: function() {
                        var clone = {
                            options: {}
                        };

                        // Apply the parent option method to the clone of current options.
                        this.super.apply(clone, arguments);

                        // Merge in the cloned mapped options.
                        $.extend(true, this.options, this.mapDialogOptions(clone.options));

                        // Update buttons.
                        this.createButtons();
                    },

                    position: function(position) {
                        // Reset modal styling.
                        this.$element.css({
                            bottom: 'initial',
                            overflow: 'visible',
                            right: 'initial'
                        });

                        // Position the modal.
                        this.$element.position(position);
                    },

                    /**
                     * Handler for $.fn.dialog('open').
                     */
                    open: function() {
                        this.show.apply(this, arguments);
                    },

                    /**
                     * Handler for $.fn.dialog('widget').
                     */
                    widget: function() {
                        return this.$element;
                    }
                }
            };
        });

        /**
         * Extend Drupal theming functions.
         */
        $.extend(Drupal.theme, /** @lend Drupal.theme */ {

            /**
             * Renders a jQuery UI Dialog compatible button element.
             *
             * @param {Object} button
             *   The button object passed in the dialog options.
             *
             * @return {String}
             *   The modal dialog button markup.
             *
             * @see http://api.jqueryui.com/dialog/#option-buttons
             * @see http://api.jqueryui.com/button/
             */
            bootstrapModalDialogButton: function(button) {
                var attributes = Attributes.create();

                var icon = '';
                var iconPosition = button.iconPosition || 'beginning';
                iconPosition = (iconPosition === 'end' && !rtl) || (iconPosition === 'beginning' && rtl) ? 'after' : 'before';

                // Handle Bootstrap icons differently.
                if (button.bootstrapIcon) {
                    icon = Drupal.theme('icon', 'bootstrap', button.icon);
                }
                // Otherwise, assume it's a jQuery UI icon.
                // @todo Map jQuery UI icons to Bootstrap icons?
                else if (button.icon) {
                    var iconAttributes = Attributes.create()
                        .addClass(['ui-icon', button.icon])
                        .set('aria-hidden', 'true');
                    icon = '<span' + iconAttributes + '></span>';
                }

                // Label. Note: jQuery UI dialog has an inconsistency where it uses
                // "text" instead of "label", so both need to be supported.
                var value = button.label || button.text;

                // Show/hide label.
                if (icon && ((button.showLabel !== void 0 && !button.showLabel) || (button.text !== void 0 && !button.text))) {
                    value = '<span' + Attributes.create().addClass('sr-only') + '>' + value + '</span>';
                }
                attributes.set('value', iconPosition === 'before' ? icon + value : value + icon);

                // Handle disabled.
                attributes[button.disabled ? 'set' : 'remove']('disabled', 'disabled');

                if (button.classes) {
                    attributes.addClass(Object.keys(button.classes).map(function(key) {
                        return button.classes[key];
                    }));
                }
                if (button['class']) {
                    attributes.addClass(button['class']);
                }
                if (button.primary) {
                    attributes.addClass('btn-primary');
                }

                return Drupal.theme('button', attributes);
            }

        });

    });


})(window.jQuery, window.Drupal, window.Drupal.bootstrap, window.Attributes, window.drupalSettings);;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function($, Drupal, drupalSettings) {
    drupalSettings.dialog = {
        autoOpen: true,
        dialogClass: '',

        buttonClass: 'button',
        buttonPrimaryClass: 'button--primary',
        close: function close(event) {
            Drupal.dialog(event.target).close();
            Drupal.detachBehaviors(event.target, null, 'unload');
        }
    };

    Drupal.dialog = function(element, options) {
        var undef = void 0;
        var $element = $(element);
        var dialog = {
            open: false,
            returnValue: undef
        };

        function openDialog(settings) {
            settings = $.extend({}, drupalSettings.dialog, options, settings);

            $(window).trigger('dialog:beforecreate', [dialog, $element, settings]);
            $element.dialog(settings);
            dialog.open = true;
            $(window).trigger('dialog:aftercreate', [dialog, $element, settings]);
        }

        function closeDialog(value) {
            $(window).trigger('dialog:beforeclose', [dialog, $element]);
            $element.dialog('close');
            dialog.returnValue = value;
            dialog.open = false;
            $(window).trigger('dialog:afterclose', [dialog, $element]);
        }

        dialog.show = function() {
            openDialog({
                modal: false
            });
        };
        dialog.showModal = function() {
            openDialog({
                modal: true
            });
        };
        dialog.close = closeDialog;

        return dialog;
    };
})(jQuery, Drupal, drupalSettings);;