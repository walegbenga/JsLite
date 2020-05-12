function O(id, property, value) {
    if (id instanceof Array) {
        var tmp = []
        for (var j = 0; j < id.length; ++j)
            tmp.push(O(id[j], property, value))
        return tmp
    }
    if (typeof property != UNDEF && typeof value != UNDEF) {
        if (typeof value == 'string') value = "'" + value + "'"
        return eval("O('" + id + "')." + property + " = " + value)
    }
    if (typeof id == 'object') return id
    else {
        try { return document.getElementById(id) } catch (e) { alert('PJ - Unknown ID: ' + id) }
    }
}

function S(id, property, value) {
    if (id instanceof Array) {
        var tmp = []
        for (var j = 0; j < id.length; ++j)
            tmp.push(S(id[j], property, value))
        return tmp
    }
    if (typeof property != UNDEF && typeof value != UNDEF) {
        try { return O(id).style[property] = value } catch (e) { alert('PJ - Unknown ID: ' + id) }
    } else if (typeof id == 'object') return id.style
    else {
        try { return O(id).style } catch (e) { alert('PJ - Unknown ID: ' + id) }
    }
}

function Initialize() {
    MOUSE_DOWN = false
    MOUSE_IN = true
    MOUSE_X = 0
    MOUSE_Y = 0
    SCROLL_X = 0
    SCROLL_Y = 0
    KEY_PRESS = ''
    ZINDEX = 1000
    CHAIN_CALLS = []
    INTERVAL = 30
    UNDEF = 'undefined'
    HID = 'hidden'
    VIS = 'visible'
    ABS = 'absolute'
    FIX = 'fixed'
    REL = 'relative'
    STA = 'static'
    INH = 'inherit'
    TP = 'top'
    BM = 'bottom'
    LT = 'left'
    RT = 'right'
    if (document.all) BROWSER = 'IE'
    else if (window.opera) BROWSER = 'Opera'
    else if (NavCheck('Chrome')) BROWSER = 'Chrome'
    else if (NavCheck('iPod')) BROWSER = 'iPod'
    else if (NavCheck('iPhone')) BROWSER = 'iPhone'
    else if (NavCheck('iPad')) BROWSER = 'iPad'
    else if (NavCheck('Android')) BROWSER = 'Android'
    else if (NavCheck('Safari')) BROWSER = 'Safari'
    else if (NavCheck('Gecko')) BROWSER = 'Firefox'
    else BROWSER = 'UNKNOWN'
    document.onmousemove = CaptureMouse
    document.onkeydown = CaptureKeyboard
    document.onkeypress = CaptureKeyboard
    document.onmouseout = function() { MOUSE_IN = false }
    document.onmouseover = function() { MOUSE_IN = true }
    document.onmouseup = function() { MOUSE_DOWN = false }
    document.onmousedown = function() { MOUSE_DOWN = true }

    function NavCheck(check) {
        return navigator.userAgent.indexOf(check) != -1
    }
}

function CaptureMouse(e) {
    if (BROWSER == 'IE') {
        SCROLL_X =
            document.
        documentElement.scrollLeft
        SCROLL_Y = document.documentElement.scrollTop
        MOUSE_X = window.event.clientX + SCROLL_X
        MOUSE_Y = window.event.clientY + SCROLL_Y
    } else {
        SCROLL_X = window.pageXOffset
        SCROLL_Y = window.pageYOffset
        MOUSE_X = e.pageX
        MOUSE_Y = e.pageY
    }
    return true
}

function CaptureKeyboard(e) {
    if (BROWSER == 'IE') {
        KEY_PRESS = FromKeyCode(window.event.keyCode)
        if (KEY_PRESS > 0)
            KEY_PRESS = String.fromCharCode(KEY_PRESS)
    } else {
        if (e.charCode) KEY_PRESS = String.fromCharCode(e.charCode)
        else if (e.keyCode) KEY_PRESS = FromKeyCode(e.keyCode)
    }
    return true
}

function FromKeyCode(c) {
    switch (c) {
        case 8:
            return 'Backspace'
        case 9:
            return 'Tab'
        case 12:
            return 'Center'
        case 13:
            return 'Enter'
        case 16:
            return 'Shift'
        case 17:
            return 'Control'
        case 18:
            return 'Alt'
        case 19:
            return 'Pause'
        case 20:
            return 'Capslock'
        case 27:
            return 'Esc'
        case 33:
            return 'PgUp'
        case 34:
            return 'PgDn'
        case 35:
            return 'End'
        case 36:
            return 'Home'
        case 37:
            return 'left'
        case 38:
            return 'Up'
        case 39:
            return 'Right'
        case 40:
            return 'Down'
        case 45:
            return 'Ins'
        case 46:
            return 'Del'
        case 91:
            return 'Windows'
        case 93:
            return 'Menu'
        case 144:
            return 'Numlock'
    }
    return c
}

function GetLastKey() {
    var k = KEY_PRESS
    KEY_PRESS = ''
    return k
}

function PreventAction(id, type, onoff) {
    if (type == 'drag' || type == 'both') {
        if (onoff == true) {
            if (typeof O(id).ondragstart != UNDEF)
                O(id).ondragstart = function() { return false }
            else O(id).onmousedown = function() { return false }
        } else {
            if (typeof O(id).ondragstart != UNDEF)
                O(id).ondragstart = ''
            else O(id).onmousedown = ''
        }
    }
    if (type == 'select' || type == 'both') {
        if (onoff == true) {
            if (typeof O(id).onselectstart != UNDEF)
                O(id).onselectstart = function() { return false }
            else if (typeof S(id).MozUserSelect != UNDEF)
                S(id).MozUserSelect = 'none'
            else O(id).onmousedown = function() { return false }
        } else {
            if (typeof O(id).onselectstart != UNDEF)
                O(id).onselectstart = ''
            else if (typeof S(id).MozUserSelect != UNDEF)
                S(id).MozUserSelect = 'text'
            else O(id).onmousedown = ''
        }
    }
}

function NoPx(value) {
    return value.replace(/px/, '') * 1
}

function Px(value) {
    return value + 'px'
}

function X(id) {
    var obj = O(id)
    var offset = obj.offsetLeft
    if (obj.offsetParent)
        while (obj = obj.offsetParent)
            offset += obj.offsetLeft
    return offset
}

function Y(id) {
    var obj = O(id)
    var offset = obj.offsetTop
    if (obj.offsetParent)
        while (obj = obj.offsetParent)
            offset += obj.offsetTop
    return offset
}

function W(id) {
    var width = O(id).offsetWidth +
        NoPx(S(id).marginLeft) +
        NoPx(S(id).marginRight)
    var bord = NoPx(S(id).borderLeftWidth) +
        NoPx(S(id).borderRightWidth)
    if (bord > 0) width -= bord
    else if (O(id).border) width -= O(id).border * 2
    return width
}

function H(id) {
    var height = O(id).offsetHeight +
        NoPx(S(id).marginTop) +
        NoPx(S(id).marginBottom)
    var bord = NoPx(S(id).borderTopWidth) +
        NoPx(S(id).borderBottomWidth)
    if (bord > 0) height -= bord
    else if (O(id).border) height -= O(id).border * 2
    return height
}

function Html(id, value) {
    if (typeof value != UNDEF)
        O(id).innerHTML = value
    return O(id).innerHTML
}

function SaveState(id) {
    O(id).Save_left = S(id).left
    O(id).Save_top = S(id).top
    O(id).Save_visibility = S(id).visibility
    O(id).Save_color = S(id).color
    O(id).Save_backgroundColor = S(id).backgroundColor
    O(id).Save_display = S(id).display
    O(id).Save_opacity = S(id).opacity
    O(id).Save_MozOpacity = S(id).MozOpacity
    O(id).Save_KhtmlOpacity = S(id).KhtmlOpacity
    O(id).Save_filter = S(id).filter
    O(id).Save_zIndex = S(id).zIndex
}

function RestoreState(id) {
    S(id).left = O(id).Save_left
    S(id).top = O(id).Save_top
    S(id).visibility = O(id).Save_visibility
    S(id).color = O(id).Save_color
    S(id).backgroundColor = O(id).Save_backgroundColor
    S(id).display = O(id).Save_display
    S(id).opacity = O(id).Save_opacity
    S(id).MozOpacity = O(id).Save_MozOpacity
    S(id).KhtmlOpacity = O(id).Save_KhtmlOpacity
    S(id).filter = O(id).Save_filter
    S(id).zIndex = O(id).Save_zIndex
}

function InsVars() {
    var tmp = arguments[0]
    for (var j = 1; j < arguments.length; ++j)
        tmp = tmp.replace(new RegExp('#' + j, 'g'), arguments[j])
    return tmp
}

function StrRepeat(str, num) {
    var tmp = ''
    for (var j = 0; j < num; ++j)
        tmp += str
    return tmp
}

function HexDec(n) {
    return (parseInt(n, 16))
}

function DecHex(n) {
    return (n < 16 ? '0' : '') + n.toString(16)
}

function ResizeWidth(id, width) {
    S(id, 'overflow', HID)
    S(id, 'width', Px(width))
}

function ResizeHeight(id, height) {
    S(id, 'overflow', HID)
    S(id, 'height', Px(height))
}

function Resize(id, width, height) {
    ResizeWidth(id, width)
    ResizeHeight(id, height)
}

function Position(id, type) {
    S(id, 'position', type)
}

function GoTo(id, x, y) {
    S(id, 'left', Px(x))
    S(id, 'top', Px(y))
}

function Locate(id, type, x, y) {
    Position(id, type)
    GoTo(id, x, y)
}

function GetWindowWidth() {
    var de = document.documentElement
    if (BROWSER != 'IE') {
        var barwidth = de.scrollHeight > de.clientHeight ? 17 : 0
        return window.innerWidth - barwidth
    }
    return de.clientWidth || document.body.clientWidth
}

function GetWindowHeight() {
    var de = document.documentElement
    if (BROWSER != 'IE') {
        var barwidth = de.scrollWidth > de.clientWidth ? 17 : 0
        return window.innerHeight - barwidth
    }
    return de.clientHeight || document.body.clientHeight
}

function GoToEdge(id, where, percent) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            GoToEdge(id[j], where, percent)
        return
    }
    var width = GetWindowWidth() - W(id)
    var height = GetWindowHeight() - H(id)
    var amount = percent / 100
    switch (where) {
        case TP:
            var x = width * amount
            var y = 0
            break
        case BM:
            var x = width * amount
            var y = height
            break
        case LT:
            var x = 0
            var y = height * amount
            break
        case RT:
            var x = width
            var y = height * amount
    }
    GoTo(id, x, y)
}

function CenterX(id) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            CenterX(id[j])
        return
    }
    S(id).left = Px(Math.round((GetWindowWidth() - W(id))) / 2 + SCROLL_X)
}

function CenterY(id) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            CenterY(id[j])
        return
    }
    S(id).top = Px(Math.round((GetWindowHeight() - H(id))) / 2 + SCROLL_Y)
}

function Center(id) {
    CenterX(id)
    CenterY(id)
}