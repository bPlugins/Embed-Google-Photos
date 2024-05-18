
function fb_prompt(url, width, height, cb) {
    var top = top || (screen.height / 2) - (height / 2),
        left = left || (screen.width / 2) - (width / 2),
        win = window.open(url, 'fb_login_window', 'location=1,status=1,resizable=yes,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
    function check() {
        if (!win || win.closed != false) {
            cb();
        } else {
            setTimeout(check, 100);
        }
    }
    setTimeout(check, 100);
}
export default fb_prompt;