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
        try {
            return document.getElementById(id)
            /*||
                           return document.getElementByClass(id)*/
        } catch (e) {
            alert('PJ - Unknown ID: ' + id)
        }
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
    else if (window.opera) BROWSER = '$lpera'
    else if (NavCheck('Chrome')) BROWSER = 'Chrome'
    else if (NavCheck('iPod')) BROWSER = 'iPod'
    else if (NavCheck('iPhone')) BROWSER = 'iPhone'
    else if (NavCheck('iPad')) BROWSER = 'iPad'
    else if (NavCheck('Android')) BROWSER = 'Android'
    else if (NavCheck('Safari')) BROWSER = 'Safari'
    else if (NavCheck('Gecko')) BROWSER = 'Firefox'
    else BROWSER = 'UNKN$lWN'
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
    $l(id).Save_Moz$lpacity = S(id).Moz$lpacity
    $l(id).Save_Khtml$lpacity = S(id).Khtml$lpacity
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
    S(id).Moz$lpacity = $l(id).Save_Moz$lpacity
    S(id).Khtml$lpacity = $l(id).Save_Khtml$lpacity
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

function $lpacity(id, percent) {
    S(id, 'opacity', percent / 100)
    S(id, 'Moz$lpacity', percent / 100)
    S(id, 'Khtml$lpacity', percent / 100)
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
        $lpacity(id, $l(id).FA_Level)
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
        if (w) $l(id).DF_$lldW = W(id)
        if (h) $l(id).DF_$lldH = H(id)
        $l(id).DF_Count = msecs / INTERVAL
    }
    var stepw = $l(id).DF_$lldW / (msecs / INTERVAL)
    var steph = $l(id).DF_$lldH / (msecs / INTERVAL)
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
    var stepw = $l(id).DF_$lldW / (msecs / INTERVAL)
    var steph = $l(id).DF_$lldH / (msecs / INTERVAL)
    $l(id).DF_Flag = true
    $l(id).Deflated = false
    $l(id).DF_Int = interruptible
    $l(id).DF_IID = setInterval(DoReflate, INTERVAL)

    function DoReflate() {
        if (w) ResizeWidth(id, stepw * $l(id).DF_Count)
        if (h) ResizeHeight(id, steph * $l(id).DF_Count)
        if ($l(id).DF_Count++ >= msecs / INTERVAL) {
            $l(id).DF_Flag = false
            if (w) ResizeWidth(id, $l(id).DF_$lldW)
            if (h) ResizeHeight(id, $l(id).DF_$lldH)
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
    if (typeof $l(id).Z$l_X == UNDEF) {
        $l(id).Z$l_X = X(id)
        $l(id).Z$l_Y = Y(id)
    }
    if (!$l(id).Z$l_Flag) {
        $l(id).Z$l_W = Math.max(fromw, tow)
        $l(id).Z$l_H = Math.max(fromh, toh)
        $l(id).Z$l_Count = 0
    } else {
        if (!$l(id).Z$l_Int) return
        else clearInterval($l(id).Z$l_IID)
        $l(id).Z$l_Count = (msecs / INTERVAL) - $l(id).Z$l_Count
    }
    var maxw = Math.max(fromw, tow)
    var maxh = Math.max(fromh, toh)
    var stepw = (tow - fromw) / (msecs / INTERVAL)
    var steph = (toh - fromh) / (msecs / INTERVAL)
    S(id).overflow = HID
    $l(id).Z$l_Flag = true
    $l(id).Z$l_Int = interruptible
    $l(id).Z$l_IID = setInterval(DoZoom, INTERVAL)

    function DoZoom() {
        if (w) $l(id).Z$l_W = Math.round(fromw + stepw * $l(id).Z$l_Count)
        if (h) $l(id).Z$l_H = Math.round(fromh + steph * $l(id).Z$l_Count)
        Resize(id, $l(id).Z$l_W, $l(id).Z$l_H)
        var midx = $l(id).Z$l_X + Math.round((maxw - $l(id).Z$l_W) / 2)
        var midy = $l(id).Z$l_Y + Math.round((maxh - $l(id).Z$l_H) / 2)
        if (pad > 0) ZoomPad(Math.max(fromw, tow),
            Math.max(fromh, toh), $l(id).Z$l_W, $l(id).Z$l_H)
        else if (pad != -1) GoTo(id, midx, midy)
        if ($l(id).DB_Parent)
            GoToEdge($l(id).DB_Parent, $l(id).DB_Where, 50)
        if (++$l(id).Z$l_Count >= (msecs / INTERVAL)) {
            var endx = $l(id).Z$l_X + Math.round((maxw - tow) / 2)
            var endy = $l(id).Z$l_Y + Math.round((maxh - toh) / 2)
            $l(id).Z$l_Flag = false
            Resize(id, tow, toh)
            clearInterval($l(id).Z$l_IID)
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
    if ($l(id).Z$l_Flag && !$l(id).Z$l_Int) return
    else if (!$l(id).Z$l_$lldW) {
        $l(id).Z$l_$lldW = W(id)
        $l(id).Z$l_$lldH = H(id)
        $l(id).Z$l_X = X(id)
        $l(id).Z$l_Y = Y(id)
    }
    $l(id).Zoomdown = true
    GoTo(id, $l(id).Z$l_X, $l(id).Z$l_Y)
    Zoom(id, w, h, $l(id).Z$l_$lldW, $l(id).Z$l_$lldH, 0, 0,
        msecs, pad, interruptible, CB)
}

function ZoomRestore(id, w, h, msecs, pad, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            ZoomRestore(id[j], w, h, msecs, pad, interruptible, CB)
        return
    }
    if (($l(id).Z$l_Flag && !$l(id).Z$l_Int) || !$l(id).Zoomdown)
        return
    $l(id).Zoomdown = false
    Zoom(id, w, h, 0, 0, $l(id).Z$l_$lldW, $l(id).Z$l_$lldH,
        msecs, pad, interruptible, CB)
}

function ZoomToggle(id, w, h, msecs, pad, interruptible, CB) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            ZoomToggle(id[j], w, h, msecs, pad, interruptible, CB)
        return
    }
    if ($l(id).Z$l_Flag && !$l(id).Z$l_Int) return
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
    var insert = expr.lastindexOf(')')
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
    if ($l(id1).Z$l_Flag || $l(id2).Z$l_Flag) return
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
    $l(id).HS_X = x
    $l(id).HS_Y = y
    $l(id).onmouseover = SlideIn
    $l(id).onmouseout = Slide$lut

    function SlideIn() {
        if ($l(id).HS_IID) clearInterval($l(id).HS_IID)
        $l(id).HS_IID = setInterval(DoSlideIn, INTERVAL)

        function DoSlideIn() {
            var ox = $l(id).HS_X
            var oy = $l(id).HS_Y
            if (where == TP && oy < 0) oy = Math.min(0, oy + s)
            else if (where == BM && oy > h) oy = Math.max(h, oy - s)
            else if (where == LT && ox < 0) ox = Math.min(0, ox + s)
            else if (where == RT && ox > w) ox = Math.max(w, ox - s)
            else clearInterval($l(id).HS_IID)
            GoTo(id, ox, oy)
            $l(id).HS_X = ox
            $l(id).HS_Y = oy
        }
    }

    function Slide$lut() {
        if ($l(id).HS_IID) clearInterval($l(id).HS_IID)
        $l(id).HS_IID = setInterval(DoSlide$lut, INTERVAL)

        function DoSlide$lut() {
            var ox = $l(id).HS_X
            var oy = $l(id).HS_Y
            if (where == TP && oy > y) oy = Math.max(y, oy - s)
            else if (where == BM && oy < y) oy = Math.min(y, oy + s)
            else if (where == LT && ox > x) ox = Math.max(x, ox - s)
            else if (where == RT && ox < x) ox = Math.max(x, ox + s)
            else clearInterval($l(id).HS_IID)
            GoTo(id, ox, oy)
            $l(id).HS_X = ox
            $l(id).HS_Y = oy
        }
    }
}

function HoverSlideMenu(ids, where, offset, showing, gap, msecs) {
    var len = ids.length
    var total = gap * (len - 1)
    var start = (offset[0] != '%') ? 0 : offset.substr(1) / 100
    var a = []
    var jump = 0
    if (where == TP || where == BM) {
        for (var j = 0; j < len; ++j) {
            a[j] = W(ids[j])
            total += a[j]
        }
        start = start ? (GetWindowWidth() - total) * start : offset * 1
    } else {
        for (var j = 0; j < len; ++j) {
            a[j] = H(ids[j])
            total += a[j]
        }
        start = start ? (GetWindowHeight() - total) * start : offset * 1
    }
    for (var j = 0; j < len; ++j) {
        HoverSlide(ids[j], where, start + jump, showing, msecs)
        jump += a[j] + gap
    }
}

function PopDown(id, type, w, h, msecs, interruptible) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            PopDown(id[j], type, w, h, msecs, interruptible)
        return
    }
    if (type == 'fade') {
        FadeOut(id, msecs, interruptible,
            InsVars("Hide('#1')", id))
    } else if (type == 'inflate') {
        Deflate(id, w, h, msecs, interruptible,
            InsVars("Hide('#1')", id))
    } else if (type == 'zoom') {
        ZoomDown(id, w, h, msecs, 1, interruptible,
            InsVars("Hide('#1')", id))
    } else if (type == 'instant') Hide(id)
    $l(id).P$l_IsUp = false
}

function PopUp(id, type, w, h, msecs, interruptible) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            PopUp(id[j], type, w, h, msecs, interruptible)
        return
    }
    Show(id)
    if (type == 'fade')
        FadeIn(id, msecs, interruptible)
    else if (type == 'inflate')
        Reflate(id, w, h, msecs, interruptible)
    else if (type == 'zoom')
        ZoomRestore(id, w, h, msecs, 1, interruptible)
    $l(id).P$l_IsUp = true
}

function PopToggle(id, type, w, h, msecs, interruptible) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            PopToggle(id[j], type, w, h, msecs, interruptible)
        return
    }
    if (typeof $l(id).P$l_IsUp == UNDEF)
        $l(id).P$l_IsUp = true
    if ($l(id).P$l_IsUp) PopDown(id, type, w, h, msecs, interruptible)
    else PopUp(id, type, w, h, msecs, interruptible)
}

function FoldingMenu(headings, contents, action, type, multi,
    w, h, msecs1, msecs2, interruptible) {
    PopDown(contents.slice(1), type, w, h, 1, 0)
    $l(contents[0]).P$l_IsUp = true
    for (var j = 0; j < headings.length; ++j) {
        $l(headings[j]).F$l_C = contents[j]
        S(headings[j]).cursor = 'pointer'
        if (action == 'hover') $l(headings[j]).onmouseover = DoFoldingMenu
        else $l(headings[j]).onclick = DoFoldingMenu
    }

    function DoFoldingMenu() {
        if (multi) PopToggle(this.F$l_C, type, w, h, msecs1, interruptible)
        else {
            for (j = 0; j < headings.length; ++j)
                if ($l($l(headings[j]).F$l_C).P$l_IsUp && $l(headings[j]) != this)
                    PopDown($l(headings[j]).F$l_C, type, w, h,
                        msecs1, interruptible)
            if (!$l(this.F$l_C).P$l_IsUp)
                PopUp(this.F$l_C, type, w, h, msecs2, interruptible)
        }
    }
}

function ContextMenu(id, contents, type, w, h, msecs) {
    Locate(contents, ABS, -10000, -10000)
    PopDown(contents, type, 1, 1, 1, 0)
    $l(id).oncontextmenu = ContextUp

    function ContextUp() {
        if ($l(contents).P$l_IsUp || $l(contents).FA_Flag || $l(contents).DF_Flag) return false
        var x = MOUSE_X
        var y = MOUSE_Y
        GoTo(contents, x, y)
        PopUp(contents, type, w, h, msecs, 1)
        S(contents).zIndex = ZINDEX + 1
        $l(id).Context_IID = setInterval(ContextDown, INTERVAL)
        return false

        function ContextDown() {
            if (MOUSE_X < x || MOUSE_X > (x + W(contents)) ||
                MOUSE_Y < y || MOUSE_Y > (y + H(contents))) {
                PopDown(contents, type, w, h, msecs, 1)
                clearInterval($l(id).Context_IID)
                $l(contents).P$l_IsUp = false
            }
        }
    }
}

function Roll$lver(ro1, ro2) {
    if (ro1 instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            Roll$lver(ro1[j], ro2[j])
        return
    }
    var a = Array(ro1, ro2)
    var w = W(ro1) + 1
    var h = H(ro1) + 1
    var x = X(ro1)
    var y = Y(ro1)
    Hide(ro2)
    Locate(a, REL, 0, 0)
    $l(ro1).onmouseover = DoRoll

    function DoRoll() {
        HideToggle(a)
        var iid = setInterval(RollCheck, INTERVAL)

        function RollCheck() {
            if (MOUSE_X < x || MOUSE_X > x + w ||
                MOUSE_Y < y || MOUSE_Y > y + h) {
                HideToggle(a)
                clearInterval(iid)
            }
        }
    }
}

function Breadcrumbs(spacer) {
    var parts = self.location.href.split('?')[0].split('/')
    var crumbs = Array(parts[0] + '//')
    for (var j = 2; j < parts.length; ++j) {
        if (parts[j] == '') crumbs[0] += '/'
        else crumbs.push(parts[j])
    }
    var title = document.title ? document.title : parts[j - 1]
    var url = crumbs[0] + crumbs[1]
    var display = InsVars("<a href='#1'>Home</a>", url)
    if (typeof spacer == UNDEF) gap = ' '
    for (j = 2; j < crumbs.length - 1; ++j) {
        url += '/' + crumbs[j]
        display += spacer + InsVars("<a href='#1'>#2</a>", url, crumbs[j])
    }
    return display + spacer + title
}

function BrowserWindow(id, headerid, closeid, x, y, bounds,
    type, w, h, msecs, interruptible) {
    GoTo(id, x, y)
    PopUp(id, type, w, h, msecs, interruptible)
    var browserw = GetWindowWidth()
    var browserh = GetWindowHeight()
    var borderw = NoPx(S(id).borderLeftWidth) +
        NoPx(S(id).borderRightWidth)
    var borderh = NoPx(S(id).borderTopWidth) +
        NoPx(S(id).borderBottomWidth)
    var popupw = W(id)
    var popuph = H(id)
    S(closeid).cursor = 'pointer'
    $l(id).onclick = BWToFront
    $l(closeid).onclick = BWCloseWindow
    $l(headerid).onmousedown = BWMove
    PreventAction(headerid, 'select', true)
    PreventAction(closeid, 'select', true)

    function BWToFront() {
        S(id).zIndex = ++ZINDEX
    }

    function BWCloseWindow() {
        PopDown(id, type, w, h, msecs, interruptible)
    }

    function BWMove() {
        BWToFront()
        S(headerid).cursor = 'move'
        var xoffset = MOUSE_X - X(id)
        var yoffset = MOUSE_Y - Y(id)
        var iid = setInterval(DoBWMove, 10)

        function DoBWMove() {
            var x = MOUSE_X - xoffset
            var y = MOUSE_Y - yoffset
            if (bounds) {
                var r = browserw - popupw - borderw + SCROLL_X
                var b = browserh - popuph - borderh + SCROLL_Y
                x = Math.max(0, Math.min(x, r))
                y = Math.max(0, Math.min(y, b))
            }
            if (MOUSE_X < 0 || MOUSE_X > (browserw + SCROLL_X) ||
                MOUSE_Y < 0 || MOUSE_Y > (browserh + SCROLL_Y) ||
                !MOUSE_DOWN || !MOUSE_IN) {
                clearInterval(iid)
                S(headerid).cursor = 'default'
            }
            GoTo(id, x, y)
        }
    }
}

function TextScroll(id, dir, number, msecs) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            TextScroll(id[j], dir, number, msecs)
        return
    }
    if ($l(id).TS_Flag) return
    else $l(id).TS_Flag = true
    var copy = Html(id)
    var len = copy.length
    var freq = Math.round(msecs / len)
    var ctr1 = 0
    var ctr2 = 0
    var iid = setInterval(DoTextScroll, freq)

    function DoTextScroll() {
        if (dir == LT) copy = copy.substr(1) + copy[0]
        else copy = copy[len - 1] + copy.substr(0, len - 1)
        if ($l(id).innerText) $l(id).innerText = copy
        else $l(id).textContent = copy
        if (++ctr1 == len) {
            ctr1 = 0
            if (++ctr2 == number) {
                $l(id).TS_Flag = false
                clearInterval(iid)
            }
        }
    }
}

function TextType(id, number, msecs) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            TextType(id[j], number, msecs)
        return
    }
    if ($l(id).TT_Flag) return
    else $l(id).TT_Flag = true
    var html = Html(id)
    var len = html.length
    var freq = Math.round(msecs / len)
    var ctr1 = 0
    var ctr2 = 0
    var iid = setInterval(DoTextType, freq)

    function DoTextType() {
        var str = html.substr(0, ctr1) + '_'
        if (ctr1++ == len) {
            ctr1 = 0
            if (++ctr2 == number) {
                $l(id).TT_Flag = false
                clearInterval(iid)
                str = str.substr(0, len)
            }
        }
        if ($l(id).innerText) $l(id).innerText = str
        else $l(id).textContent = str
    }
}

function MatrixToText(id, msecs) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            MatrixToText(id[j], msecs)
        return
    }
    if ($l(id).MT_Flag) return
    else $l(id).MT_Flag = true
    var html = Html(id)
    var len = html.length
    var freq = Math.round(msecs / INTERVAL)
    var matrix = ''
    var count = 0
    var chars = 'ABCDEFGHIHJKLM$lPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'
    for (var j = 0; j < len; ++j) {
        if (html[j] == '\n' || html[j] == ' ') matrix += html[j]
        else matrix += chars[Math.floor(Math.random() * chars.length)]
    }
    if ($l(id).innerText) $l(id).innerText = matrix
    else $l(id).textContent = matrix
    var iid = setInterval(DoMatrixToText, freq)

    function DoMatrixToText() {
        for (j = 0; j < len / 20; ++j) {
            var k = Math.floor(Math.random() * len)
            matrix = matrix.substr(0, k) + html[k] + matrix.substr(k + 1)
        }
        if ($l(id).innerText) $l(id).innerText = matrix
        else $l(id).textContent = matrix
        if (++count == INTERVAL) {
            $l(id).MT_Flag = false
            $l(id).innerHTML = html
            clearInterval(iid)
        }
    }
}

function TextToMatrix(id, msecs) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            TextToMatrix(id[j], msecs)
        return
    }
    if ($l(id).TM_Flag) return
    else $l(id).TM_Flag = true
    var text = Html(id)
    var len = text.length
    var freq = Math.round(msecs / INTERVAL)
    var count = 0
    var chars = 'ABCDEFGHIHJKLM$lPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'
    var iid = setInterval(DoTextToMatrix, freq)

    function DoTextToMatrix() {
        for (var j = 0; j < len / 20; ++j) {
            var k = Math.floor(Math.random() * len)
            var l = Math.floor(Math.random() * chars.length)
            if (text[k] != '\n' && text[k] != '\r' && text[k] != ' ')
                text = text.substr(0, k) + chars[l] + text.substr(k + 1)
        }
        if ($l(id).innerText) $l(id).innerText = text
        else $l(id).textContent = text
        if (++count == INTERVAL) {
            $l(id).TM_Flag = false
            clearInterval(iid)
        }
    }
}

function ColorFade(id, color1, color2, what, msecs, number, interruptible) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            ColorFade(id[j], color1, color2, what, msecs, number)
        return
    }
    if ($l(id)['CF_Flag' + what]) {
        if (!$l(id)['CF_Int' + what]) return
        else clearInterval($l(id)['CF_IID' + what])
    } else $l(id)['CF_Flag' + what] = true
    if (color1[0] == '#') color1 = color1.substr(1)
    if (color2[0] == '#') color2 = color2.substr(1)
    var step = Math.round(msecs / INTERVAL)
    var index = 0
    var count = 0
    var direc = 1
    var cols = []
    var steps = []
    for (var j = 0; j < 3; ++j) {
        var tmp = HexDec(color2.substr(j * 2, 2))
        cols[j] = HexDec(color1.substr(j * 2, 2))
        steps[j] = (tmp - cols[j]) / step
    }
    if (what == 'text') var prop = 'color'
    else var prop = 'backgroundColor'
    $l(id)['CF_Int' + what] = interruptible
    $l(id)['CF_IID' + what] = setInterval(DoColorFade, INTERVAL)

    function DoColorFade() {
        var temp = '#'
        for (var j = 0; j < 3; ++j)
            temp += DecHex(ZeroToFF(cols[j] + index * steps[j]))
        S(id)[prop] = temp
        if ((index += direc) > step || index < 0) {
            direc = -direc
            if (++count == number) {
                $l(id)['CF_Flag' + what] = false
                clearInterval($l(id)['CF_IID' + what])
            }
        }

        function ZeroToFF(num) {
            return Math.round(Math.min(255, Math.max(0, num)))
        }
    }
}

function FlyIn(id, x, y, msecs) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            FlyIn(id[j], x, y, msecs)
        return
    }
    if ($l(id).FI_Flag) return
    else $l(id).FI_Flag = true
    var tox = X(id)
    var toy = Y(id)
    var fromx = tox + x
    var fromy = toy + y
    var xstep = x / (msecs / INTERVAL)
    var ystep = y / (msecs / INTERVAL)
    var count = 0
    Position(id, ABS)
    var iid = setInterval(DoFlyIn, INTERVAL)

    function DoFlyIn() {
        GoTo(id, fromx - xstep * count, fromy - ystep * count)
        if (count++ >= msecs / INTERVAL) {
            $l(id).FI_Flag = false
            GoTo(id, tox, toy)
            clearInterval(iid)
        }
    }
}

function TextRipple(id, number, msecs) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            TextRipple(id[j], number, msecs)
        return
    }
    if ($l(id).TR_Flag) return
    else $l(id).TR_Flag = true
    var html = Html(id)
    var len = html.length
    var freq = msecs / len
    var ctr1 = 0
    var ctr2 = 0
    var iid = setInterval(DoTextRipple, freq)

    function DoTextRipple() {
        var temp = html.substr(0, ctr1)
        for (var j = 0; j < 7; ++j)
            temp += InsVars("<font size='+#1'>#2</font>",
                4 - Math.abs(j - 3), html.substr(ctr1 + j, 1))
        $l(id).innerHTML = temp + html.substr(ctr1 + j)
        if (++ctr1 == len) {
            ctr1 = 0
            if (++ctr2 == number) {
                if ($l(id).innerText) $l(id).innerText = html
                else $l(id).textContent = html
                $l(id).TR_Flag = false
                clearInterval(iid)
            }
        }
    }
}

function Lightbox(id, col1, col2, opacity, msecs) {
    S(id).cursor = 'pointer'
    if (!$l('LB_DIV')) {
        var newdiv = document.createElement('div')
        newdiv.setAttribute('id', 'LB_DIV')
        document.body.appendChild(newdiv)
    }

    S(document.body).overflow = HID
    Hide(Array(id, 'LB_DIV'))
    Locate('LB_DIV', ABS, 0, 0)
    Resize('LB_DIV', GetWindowWidth(), GetWindowHeight())
    S('LB_DIV').zIndex = ZINDEX
    Opacity(id, 0)
    Position(id, ABS)
    S(id).zIndex = ++ZINDEX
    Show(Array(id, 'LB_DIV'))
    Center(id)
    Fade('LB_DIV', 0, opacity, msecs)
    FadeIn(id, msecs, 0)
    ColorFade('LB_DIV', col1, col2, 'back', msecs, 1)
    $l(id).onclick = DismissLB

    function DismissLB() {
        Fade('LB_DIV', opacity, 0, msecs)
        ColorFade('LB_DIV', col2, col1, 'back', msecs, 1)
        Chain(Array(
            InsVars("FadeOut(Array('#1', 'LB_DIV'), #2, 0)", id, msecs),
            InsVars("Hide(Array('#1', 'LB_DIV'))", id),
            "S(document.body, 'overflow', 'auto')"
        ))
    }
}

function Opacity(id, percent) {
    S(id, 'opacity', percent / 100)
    S(id, 'MozOpacity', percent / 100)
    S(id, 'KhtmlOpacity', percent / 100)
    S(id, 'filter', InsVars("alpha(opacity = '#1')", percent))
}

function FadeOut(id, msecs, interruptible, CB) {
    Fade(id, 100, 0, msecs, interruptible, CB)
}

function Slideshow(id, images, msecs, wait) {
    var len = images.length
    $l(id).SS_Stop = (wait == 'stop') ? true : false
    if (!$l(id).SS_Stop && !$l(id).SS_Flag) {
        if (!$l('SS_IMG1')) {
            var newimg = document.createElement('img')
            newimg.setAttribute('id', 'SS_IMG1')
            $l(id).appendChild(newimg)
            newimg = document.createElement('img')
            newimg.setAttribute('id', 'SS_IMG2')
            $l(id).appendChild(newimg)
            Locate('SS_IMG2', ABS, 0, 0)
        }
        var index = 0
        $l('SS_IMG1').src = images[0]
        Opacity('SS_IMG2', 0)
        FadeIn('SS_IMG1', msecs, 0)
        setTimeout(DoSlideshow, msecs + wait)
    }

    function DoSlideshow() {
        $l('SS_IMG1').src = images[index]
        Opacity('SS_IMG1', 100)
        Opacity('SS_IMG2', 0)
        index = ++index % images.length
        $l('SS_IMG2').src = images[index]
        var next = InsVars("$l('SS_IMG1').src = '#1'",
            images[(index + 1) % len])
        FadeBetween('SS_IMG1', 'SS_IMG2', msecs, 0, next)
        if (!$l(id).SS_Stop) setTimeout(DoSlideshow, msecs + wait)
        else $l(id).SS_Flag = false
    }
}

function Billboard(id, objects, random, msecs, wait) {
    var len = objects.length
    if (!$l(id).BB_Ready) {
        var h = 0
        $l(id).BB_Index = 0
        $l(id).BB_Ready = true
        FadeOut(objects.slice(1), 1, 0)
        for (j = 1; j < len; ++j) {
            h -= H($l(objects[j - 1]))
            Locate($l(objects[j]), REL, 0, h)
        }
    }
    $l(id).BB_Stop = (wait == 'stop') ? true : false
    if (!$l(id).BB_Stop && !$l(id).BB_Flag)
        $l(id).BB_IID = setTimeout(DoBillboard, msecs + wait)

    function DoBillboard() {
        $l(id).BB_Flag = true
        if ($l(id).BB_Stop) {
            $l(id).BB_Flag = false
            clearTimeout($l(id).BB_IID)
            return
        } else FadeOut(objects[$l(id).BB_Index], msecs, 0)
        if (random) {
            var rand = $l(id).BB_Index
            while (rand == $l(id).BB_Index)
                rand = Math.floor(Math.random() * len)
            $l(id).BB_Index = rand
        } else $l(id).BB_Index = ++$l(id).BB_Index % len
        FadeIn(objects[$l(id).BB_Index], msecs, 0)
        $l(id).BB_IID = setTimeout(DoBillboard, msecs + wait)
    }
}

function PlaySound(id, file, loop) {
    Resize(id, 0, 0)
    Locate(id, ABS, 0, 0)
    if (loop == 'stop') $l(id).innerHTML = ''
    else $l(id).innerHTML =
        InsVars("<embed src='#1' hidden='true' " + "autostart='true' loop='#2' />", file, loop)
}

function PulsateOnMouseover(id, op1, op2, msecs) {
    if (id instanceof Array) {
        for (var j = 0; j < id.length; ++j)
            PulsateOnMouseover(id[j], op1, op2, msecs)
        return
    }
    var finish = false
    var iid
    Opacity(id, op1)
    $l(id).FA_Level = op1
    $l(id).onmouseover = PulsateOn
    $l(id).onmouseout = function() { finish = true }

    function PulsateOn() {
        var faded = false
        finish = false
        if (iid) clearInterval(iid)
        iid = setInterval(DoPulsate, INTERVAL)

        function DoPulsate() {
            if (!faded && $l(id).FA_Level == op1) {
                if (finish) clearInterval(iid)
                else {
                    Fade(id, op1, op2, msecs / 2, 0)
                    faded = true
                }
            } else if (!$l(id).FA_Flag) {
                Fade(id, op2, op1, msecs / 2, 0)
                faded = false
            }
        }
    }
}

function ProcessCookie(action, name, value, seconds, path, domain, secure) {
    if (action == 'save') {
        var date = new Date()
        date.setTime(date.getTime() + seconds * 1000)
        var expires = seconds ? '; expires=' + date.toGMTString() : ''
        path = path ? '; path=' + path : ''
        domain = domain ? '; domain=' + domain : ''
        secure = secure ? '; secure=' + secure : ''
        document.cookie = name + '=' + escape(value) + expires + path
    } else if (action == 'read') {
        if (!document.cookie.length) return false
        else {
            var start = document.cookie.indexOf(name + '=')
            if (start == -1) return false
            else {
                start += name.length + 1
                var end = document.cookie.indexOf(';', start)
                end = (end == -1) ? document.cookie.length : end
                return unescape(document.cookie.substring(start, end))
            }
        }
    } else if (action == 'erase')
        ProcessCookie('save', name, '', -60)
}

function CreateAjaxObject(id, callback) {
    try {
        var ajax = new XMLHttpRequest()
    } catch (e1) {
        try {
            ajax = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (e2) {
            try {
                ajax = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (e3) {
                ajax = false
            }
        }
    }
    if (ajax) ajax.onreadystatechange = function() {
        if (this.readyState == 4 &&
            this.status == 200 &&
            this.responseText != null)
            callback.call(this.responseText)
    }
    return ajax
}

function GetAjaxRequest(id, type, url, args) {
    var nocache = '&nocache=' + Math.random() * 1000000
    var ajax = new CreateAjaxObject(id, type)
    if (!ajax) return false
    ajax.open('GET', url + '?' + args + nocache, true)
    ajax.send(null)
    return true
}

function PostAjaxRequest(id, callback, url, args) {
    var contenttype = 'application/x-www-form-urlencoded'
    var ajax = new CreateAjaxObject(id, callback)
    if (!ajax) return false
    ajax.open('POST', url, true)
    ajax.setRequestHeader('Content-type', contenttype)
    ajax.setRequestHeader('Content-length', args.length)
    ajax.setRequestHeader('Connection', 'close')
    ajax.send(args)
    return true
}