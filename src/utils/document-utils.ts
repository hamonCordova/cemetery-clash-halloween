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

}

