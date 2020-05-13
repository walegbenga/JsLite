function $l(id, property, value) {
    if (id instanceof Array) {
        var tmp = []
        for (var j = 0; j < id.length; ++j)
            tmp.push($l(id[j], property, value))
        return tmp
    }
    if (typeof property != UNDEF && typeof value != UNDEF) {
        if (typeof value == 'string') value = "'" + value + "'"
        return eval("$l('" + id + "')." + property + " = " + value)
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
        try { return $l(id).style[property] = value } catch (e) { alert('PJ - Unknown ID: ' + id) }
    } else if (typeof id == 'object') return id.style
    else {
        try { return $l(id).style } catch (e) { alert('PJ - Unknown ID: ' + id) }
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
            if (typeof $l(id).ondragstart != UNDEF)
                $l(id).ondragstart = function() { return false }
            else $l(id).onmousedown = function() { return false }
        } else {
            if (typeof $l(id).ondragstart != UNDEF)
                $l(id).ondragstart = ''
            else $l(id).onmousedown = ''
        }
    }
    if (type == 'select' || type == 'both') {
        if (onoff == true) {
            if (typeof $l(id).onselectstart != UNDEF)
                $l(id).onselectstart = function() { return false }
            else if (typeof S(id).MozUserSelect != UNDEF)
                S(id).MozUserSelect = 'none'
            else $l(id).onmousedown = function() { return false }
        } else {
            if (typeof $l(id).onselectstart != UNDEF)
                $l(id).onselectstart = ''
            else if (typeof S(id).MozUserSelect != UNDEF)
                S(id).MozUserSelect = 'text'
            else $l(id).onmousedown = ''
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
    var obj = $l(id)
    var offset = obj.offsetLeft
    if (obj.offsetParent)
        while (obj = obj.offsetParent)
            offset += obj.offsetLeft
    return offset
}

function Y(id) {
    var obj = $l(id)
    var offset = obj.offsetTop
    if (obj.offsetParent)
        while (obj = obj.offsetParent)
            offset += obj.offsetTop
    return offset
}

function W(id) {
    var width = $l(id).offsetWidth +
        NoPx(S(id).marginLeft) +
        NoPx(S(id).marginRight)
    var bord = NoPx(S(id).borderLeftWidth) +
        NoPx(S(id).borderRightWidth)
    if (bord > 0) width -= bord
    else if ($l(id).border) width -= $l(id).border * 2
    return width
}

function H(id) {
    var height = $l(id).offsetHeight +
        NoPx(S(id).marginTop) +
        NoPx(S(id).marginBottom)
    var bord = NoPx(S(id).borderTopWidth) +
        NoPx(S(id).borderBottomWidth)
    if (bord > 0) height -= bord
    else if ($l(id).border) height -= $l(id).border * 2
    return height
}

function Html(id, value) {
    if (typeof value != UNDEF)
        $l(id).innerHTML = value
    return $l(id).innerHTML
}

function SaveState(id) {
    $l(id).Save_left = S(id).left
    $l(id).Save_top = S(id).top
    $l(id).Save_visibility = S(id).visibility
    $l(id).Save_color = S(id).color
    $l(id).Save_backgroundColor = S(id).backgroundColor
    $l(id).Save_display = S(id).display
    $l(id).Save_opacity = S(id).opacity
    $l(id).Save_MozOpacity = S(id).MozOpacity
    $l(id).Save_KhtmlOpacity = S(id).KhtmlOpacity
    $l(id).Save_filter = S(id).filter
    $l(id).Save_zIndex = S(id).zIndex
}

function RestoreState(id) {
    S(id).left = $l(id).Save_left
    S(id).top = $l(id).Save_top
    S(id).visibility = $l(id).Save_visibility
    S(id).color = $l(id).Save_color
    S(id).backgroundColor = $l(id).Save_backgroundColor
    S(id).display = $l(id).Save_display
    S(id).opacity = $l(id).Save_opacity
    S(id).MozOpacity = $l(id).Save_MozOpacity
    S(id).KhtmlOpacity = $l(id).Save_KhtmlOpacity
    S(id).filter = $l(id).Save_filter
    S(id).zIndex = $l(id).Save_zIndex
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

function Invisible(id) {
    S(id, 'visibility', HID)
}

function Visible(id) {
    S(id, 'visibility', VIS)
}

function VisibilityToggle(id) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            VisibilityToggle(id[j])
        return
    }
    S(id).visibility = S(id).visibility == HID ? VIS : HID
}

function Opacity(id, percent) {
    S(id, 'opacity', percent / 100)
    S(id, 'MozOpacity', percent / 100)
    S(id, 'KhtmlOpacity', percent / 100)
    S(id, 'filter', InsVars("alpha(opacity = '#1')", percent))
}

function Fade(id, start, end, msecs, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            Fade(id[j], start, end, msecs, interruptible, CB)
        return
    }
    var stepval = Math.abs(start - end) / (msecs / INTERVAL)
    if ($l(id).FA_Flag) {
        if (!$l(id).FA_Int) return
        clearInterval($l(id).FA_IID)
        $l(id).FA_Start = $l(id).FA_Level
    } else {
        $l(id).FA_Start = start
        $l(id).FA_Level = start
    }
    $l(id).FA_Flag = true
    $l(id).FA_End = end
    $l(id).FA_Int = interruptible
    $l(id).FA_Step = end > $l(id).FA_Start ? stepval : -stepval
    $l(id).Fadeout = end < $l(id).FA_Start ? true : false
    $l(id).FA_IID = setInterval(DoFade, INTERVAL)

    function DoFade() {
        $l(id).FA_Level += $l(id).FA_Step
        if ($l(id).FA_Level >= Math.max($l(id).FA_Start, $l(id).FA_End) ||
            $l(id).FA_Level <= Math.min($l(id).FA_Start, $l(id).FA_End)) {
            $l(id).FA_Level = $l(id).FA_End
            $l(id).FA_Flag = false
            clearInterval($l(id).FA_IID)
            if (typeof CB != UNDEF) eval(CB)
        }
        Opacity(id, $l(id).FA_Level)
    }
}

function FadeIn(id, msecs, interruptible, CB) {
    Fade(id, 0, 100, msecs, interruptible, CB)
}

function FadeToggle(id, msecs, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            FadeToggle(id[j], msecs, interruptible, CB)
        return
    }
    if ($l(id).Fadeout) FadeIn(id, msecs, interruptible, CB)
    else FadeOut(id, msecs, interruptible, CB)
}

function FadeBetween(id1, id2, msecs, interruptible, CB) {
    FadeOut(id1, msecs, interruptible, CB)
    FadeIn(id2, msecs, interruptible, CB)
}

function Hide(id, CB) {
    S(id, 'display', 'none')
    $l(id, 'HI_Flag', true)
    if (typeof CB != UNDEF) eval(CB)
}

function Show(id, CB) {
    S(id, 'display', 'block')
    $l(id, 'HI_Flag', false)
    if (typeof CB != UNDEF) eval(CB)
}

function HideToggle(id, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            HideToggle(id[j], CB)
        return
    }
    if (S(id).display != 'none') Hide(id, CB)
    else Show(id, CB)
}

function Slide(id, frx, fry, tox, toy, msecs, interruptible, CB) {
    if ($l(id).SL_Flag) {
        if (!$l(id).SL_Int) return
        else clearInterval($l(id).SL_IID)
        var len1 = Distance(tox - frx, toy - fry)
        frx = X(id)
        fry = Y(id)
        var len2 = Distance(tox - frx, toy - fry)
        msecs *= len2 / len1
    }
    var stepx = (tox - frx) / (msecs / INTERVAL)
    var stepy = (toy - fry) / (msecs / INTERVAL)
    var count = 0
    $l(id).SL_Int = interruptible
    $l(id).SL_Flag = true
    $l(id).SL_IID = setInterval(DoSlide, INTERVAL)

    function Distance(x, y) {
        x = Math.max(1, x)
        y = Math.max(1, y)
        return Math.round(Math.sqrt(Math.abs(x * x) + Math.abs(y * y)))
    }

    function DoSlide() {
        GoTo(id, frx + stepx * count, fry + stepy * count)
        if (count++ >= (msecs / INTERVAL)) {
            $l(id).SL_Flag = false
            GoTo(id, tox, toy)
            clearInterval($l(id).SL_IID)
            if (typeof CB != UNDEF) eval(CB)
        }
    }
}

function SlideBetween(id1, id2, msecs, interruptible, CB) {
    if ($l(id1).SL_Flag || $l(id2).SL_Flag) {
        if (!$l(id1).SL_Int || !$l(id2).SL_Int)
            return
        var t1 = $l(id1).SB_X
        var t2 = $l(id1).SB_Y
        $l(id1).SB_X = $l(id2).SB_X
        $l(id1).SB_Y = $l(id2).SB_Y
        $l(id2).SB_X = t1
        $l(id2).SB_Y = t2
    } else {
        $l(id1).SB_X = X(id1)
        $l(id1).SB_Y = Y(id1)
        $l(id2).SB_X = X(id2)
        $l(id2).SB_Y = Y(id2)
    }
    var x1 = $l(id1).SB_X
    var y1 = $l(id1).SB_Y
    var x2 = $l(id2).SB_X
    var y2 = $l(id2).SB_Y
    Slide(id1, x1, y1, x2, y2, msecs, interruptible, CB)
    Slide(id2, x2, y2, x1, y1, msecs, interruptible, CB)
}

function Deflate(id, w, h, msecs, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            Deflate(id[j], w, h, msecs, interruptible, CB)
        return
    }
    if (!w) ResizeWidth(id, W(id))
    if (!h) ResizeHeight(id, H(id))
    if ($l(id).DF_Flag) {
        if (!$l(id).DF_Int) return
        else clearInterval($l(id).DF_IID)
    } else {
        if (w) $l(id).DF_OldW = W(id)
        if (h) $l(id).DF_OldH = H(id)
        $l(id).DF_Count = msecs / INTERVAL
    }
    var stepw = $l(id).DF_OldW / (msecs / INTERVAL)
    var steph = $l(id).DF_OldH / (msecs / INTERVAL)
    S(id).overflow = HID
    $l(id).Deflated = true
    $l(id).DF_Flag = true
    $l(id).DF_Int = interruptible
    $l(id).DF_IID = setInterval(DoDeflate, INTERVAL)

    function DoDeflate() {
        if (w) ResizeWidth(id, stepw * $l(id).DF_Count)
        if (h) ResizeHeight(id, steph * $l(id).DF_Count)
        if ($l(id).DF_Count-- < 1) {
            $l(id).DF_Flag = false
            if (w) ResizeWidth(id, 0)
            if (h) ResizeHeight(id, 0)
            clearInterval($l(id).DF_IID)
            if (typeof CB != UNDEF) eval(CB)
        }
    }
}