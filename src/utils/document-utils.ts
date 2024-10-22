export class DocumentUtils {

    public static isMobile() {

        const ua = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(ua)) {
            return true;
        }

        if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
            return true;
        }

        if (/Mobile|mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
            return true;
        }

        return false;
    }

    public static enterFullScreen() {
        const element = document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

}

