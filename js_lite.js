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

function Reflate(id, w, h, msecs, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            Reflate(id[j], w, h, msecs, interruptible, CB)
        return
    }
    if (!$l(id).Deflated) return
    else if ($l(id).DF_Flag) {
        if (!$l(id).DF_Int) return
        else clearInterval($l(id).DF_IID)
    } else $l(id).DF_Count = 0
    var stepw = $l(id).DF_OldW / (msecs / INTERVAL)
    var steph = $l(id).DF_OldH / (msecs / INTERVAL)
    $l(id).DF_Flag = true
    $l(id).Deflated = false
    $l(id).DF_Int = interruptible
    $l(id).DF_IID = setInterval(DoReflate, INTERVAL)

    function DoReflate() {
        if (w) ResizeWidth(id, stepw * $l(id).DF_Count)
        if (h) ResizeHeight(id, steph * $l(id).DF_Count)
        if ($l(id).DF_Count++ >= msecs / INTERVAL) {
            $l(id).DF_Flag = false
            if (w) ResizeWidth(id, $l(id).DF_OldW)
            if (h) ResizeHeight(id, $l(id).DF_OldH)
            clearInterval($l(id).DF_IID)
            if (typeof CB != UNDEF) eval(CB)
        }
    }
}

function DeflateToggle(id, w, h, msecs, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            DeflateToggle(id[j], w, h, msecs, interruptible, CB)
        return
    }
    if ($l(id).Deflated) Reflate(id, w, h, msecs, interruptible, CB)
    else Deflate(id, w, h, msecs, interruptible, CB)
}

function DeflateBetween(id1, id2, w, h, msecs, interruptible, CB) {
    Deflate(id1, w, h, msecs, interruptible, CB)
    Reflate(id2, w, h, msecs, interruptible, CB)
}

function Zoom(id, w, h, fromw, fromh, tow, toh,
    msecs, pad, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            Zoom(id[j], w, h, fromw, fromh, tow, toh,
                msecs, pad, interruptible, CB)
        return
    }
    if (typeof $l(id).ZO_X == UNDEF) {
        $l(id).ZO_X = X(id)
        $l(id).ZO_Y = Y(id)
    }
    if (!$l(id).ZO_Flag) {
        $l(id).ZO_W = Math.max(fromw, tow)
        $l(id).ZO_H = Math.max(fromh, toh)
        $l(id).ZO_Count = 0
    } else {
        if (!$l(id).ZO_Int) return
        else clearInterval($l(id).ZO_IID)
        $l(id).ZO_Count = (msecs / INTERVAL) - $l(id).ZO_Count
    }
    var maxw = Math.max(fromw, tow)
    var maxh = Math.max(fromh, toh)
    var stepw = (tow - fromw) / (msecs / INTERVAL)
    var steph = (toh - fromh) / (msecs / INTERVAL)
    S(id).overflow = HID
    $l(id).ZO_Flag = true
    $l(id).ZO_Int = interruptible
    $l(id).ZO_IID = setInterval(DoZoom, INTERVAL)

    function DoZoom() {
        if (w) $l(id).ZO_W = Math.round(fromw + stepw * $l(id).ZO_Count)
        if (h) $l(id).ZO_H = Math.round(fromh + steph * $l(id).ZO_Count)
        Resize(id, $l(id).ZO_W, $l(id).ZO_H)
        var midx = $l(id).ZO_X + Math.round((maxw - $l(id).ZO_W) / 2)
        var midy = $l(id).ZO_Y + Math.round((maxh - $l(id).ZO_H) / 2)
        if (pad > 0) ZoomPad(Math.max(fromw, tow),
            Math.max(fromh, toh), $l(id).ZO_W, $l(id).ZO_H)
        else if (pad != -1) GoTo(id, midx, midy)
        if ($l(id).DB_Parent)
            GoToEdge($l(id).DB_Parent, $l(id).DB_Where, 50)
        if (++$l(id).ZO_Count >= (msecs / INTERVAL)) {
            var endx = $l(id).ZO_X + Math.round((maxw - tow) / 2)
            var endy = $l(id).ZO_Y + Math.round((maxh - toh) / 2)
            $l(id).ZO_Flag = false
            Resize(id, tow, toh)
            clearInterval($l(id).ZO_IID)
            if (pad > 0) ZoomPad(fromw, fromh, tow, toh)
            else if (pad != -1) GoTo(id, endx, endy)
            if ($l(id).DB_Parent)
                GoToEdge($l(id).DB_Parent, $l(id).DB_Where, 50)
            if (typeof CB != UNDEF) eval(CB)
        }

        function ZoomPad(frw, frh, padw, padh) {
            var left = Math.max(0, frw - Math.round(padw)) / 2
            var right = left
            var top = Math.max(0, frh - Math.round(padh)) / 2
            var bottom = top
            if (left != Math.floor(left)) {
                left = Math.floor(left)
                right = left + 1
            }
            if (top != Math.floor(top)) {
                top = Math.floor(top)
                bottom = top + 1
            }
            S(id).paddingLeft = Px(left)
            S(id).paddingRight = Px(right)
            S(id).paddingTop = Px(top)
            S(id).paddingBottom = Px(bottom)
        }
    }
}

function ZoomDown(id, w, h, msecs, pad, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            ZoomDown(id[j], w, h, msecs, pad, interruptible, CB)
        return
    }
    if ($l(id).ZO_Flag && !$l(id).ZO_Int) return
    else if (!$l(id).ZO_OldW) {
        $l(id).ZO_OldW = W(id)
        $l(id).ZO_OldH = H(id)
        $l(id).ZO_X = X(id)
        $l(id).ZO_Y = Y(id)
    }
    $l(id).Zoomdown = true
    GoTo(id, $l(id).ZO_X, $l(id).ZO_Y)
    Zoom(id, w, h, $l(id).ZO_OldW, $l(id).ZO_OldH, 0, 0,
        msecs, pad, interruptible, CB)
}

function ZoomRestore(id, w, h, msecs, pad, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            ZoomRestore(id[j], w, h, msecs, pad, interruptible, CB)
        return
    }
    if (($l(id).ZO_Flag && !$l(id).ZO_Int) || !$l(id).Zoomdown)
        return
    $l(id).Zoomdown = false
    Zoom(id, w, h, 0, 0, $l(id).ZO_OldW, $l(id).ZO_OldH,
        msecs, pad, interruptible, CB)
}

function ZoomToggle(id, w, h, msecs, pad, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            ZoomToggle(id[j], w, h, msecs, pad, interruptible, CB)
        return
    }
    if ($l(id).ZO_Flag && !$l(id).ZO_Int) return
    if (!$l(id).Zoomdown) ZoomDown(id, w, h, msecs, pad, interruptible, CB)
    else ZoomRestore(id, w, h, msecs, pad, interruptible, CB)
}

function Chain(calls) {
    for (var j = calls.length; j >= 0; --j)
        if (calls[j])
            CHAIN_CALLS.push(calls[j])
    NextInChain()
}

function NextInChain() {
    if (CHAIN_CALLS.length)
        CallBack(CHAIN_CALLS.pop())
}

function CallBack(expr) {
    var insert = expr.lastIndexOf(')')
    var left = expr.substr(0, insert)
    var right = expr.substr(insert)
    var middle = "'NextInChain()'"

    if (expr.substr(insert - 1, 1) != '(')
        middle = ', ' + middle
    eval(left + middle + right)
}

function ChainThis(expr) {
    eval(expr)
    NextInChain()
}

function Repeat(number, calls) {
    var temp = calls
    for (var j = 1; j < number; ++j)
        calls = calls.concat(temp)
    Chain(calls)
}

function While(expr, calls) {
    if (eval(expr)) {
        var temp = ''
        for (var j = 0; j < calls.length; ++j)
            temp += '"' + calls[j].replace(/"/g, '\\\"') + '",'
        temp = temp.substr(0, temp.length - 1)
        calls.push(InsVars("While('#1', Array(#2))", expr, temp))
        Chain(calls)
    }
}

function Pause(wait) {
    setTimeout("NextInChain()", wait)
}

function WaitKey() {
    GetLastKey()
    setTimeout(DoWaitKey, INTERVAL)

    function DoWaitKey() {
        if (KEY_PRESS != '') NextInChain()
        else setTimeout(DoWaitKey, INTERVAL)
    }
}

function Flip(id1, id2, w, h, msecs, pad) {
    if ($l(id1).ZO_Flag || O(id2).ZO_Flag) return
    var swap = "ChainThis('VisibilityToggle(\"#1\")')"
    var fast = "ZoomToggle('#1', #2, #3, 1, #4, 0)"
    var slow = "ZoomToggle('#1', #2, #3, #4, #5, 0)"
    Chain(Array(
        InsVars(slow, id1, w, h, msecs / 2, pad),
        InsVars(fast, id2, w, h, pad),
        InsVars(swap, id2),
        InsVars(slow, id2, w, h, msecs / 2, pad),
        InsVars(swap, id1),
        InsVars(fast, id1, w, h, pad)
    ))
}

function HoverSlide(id, where, offset, showing, msecs) {
    var w = GetWindowWidth() - W(id)
    var h = GetWindowHeight() - H(id)
    var o = offset[0] != '%' ? 0 : offset.substr(1) / 100
    if (where == LT || where == RT) {
        var t = W(id) - showing
        var u = Math.min(t, msecs / INTERVAL)
        var x = where == LT ? -t : w + t
        var y = o ? h * o : offset
        var s = t / u
    } else {
        var t = H(id) - showing
        var u = Math.min(t, msecs / INTERVAL)
        var x = o ? w * o : offset
        var y = where == TP ? -t : h + t
        var s = t / u
    }
    GoTo(id, x, y)
    O(id).HS_X = x
    O(id).HS_Y = y
    O(id).onmouseover = SlideIn
    O(id).onmouseout = SlideOut

    function SlideIn() {
        if (O(id).HS_IID) clearInterval(O(id).HS_IID)
        O(id).HS_IID = setInterval(DoSlideIn, INTERVAL)

        function DoSlideIn() {
            var ox = O(id).HS_X
            var oy = O(id).HS_Y
            if (where == TP && oy < 0) oy = Math.min(0, oy + s)
            else if (where == BM && oy > h) oy = Math.max(h, oy - s)
            else if (where == LT && ox < 0) ox = Math.min(0, ox + s)
            else if (where == RT && ox > w) ox = Math.max(w, ox - s)
            else clearInterval(O(id).HS_IID)
            GoTo(id, ox, oy)
            O(id).HS_X = ox
            O(id).HS_Y = oy
        }
    }

    function SlideOut() {
        if (O(id).HS_IID) clearInterval(O(id).HS_IID)
        O(id).HS_IID = setInterval(DoSlideOut, INTERVAL)

        function DoSlideOut() {
            var ox = O(id).HS_X
            var oy = O(id).HS_Y
            if (where == TP && oy > y) oy = Math.max(y, oy - s)
            else if (where == BM && oy < y) oy = Math.min(y, oy + s)
            else if (where == LT && ox > x) ox = Math.max(x, ox - s)
            else if (where == RT && ox < x) ox = Math.max(x, ox + s)
            else clearInterval(O(id).HS_IID)
            GoTo(id, ox, oy)
            O(id).HS_X = ox
            O(id).HS_Y = oy
        }
    }
}