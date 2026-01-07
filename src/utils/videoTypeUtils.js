/**
 * 视频类型工具函数
 * 用于处理 videoType 枚举值的显示和判断
 */

/**
 * 获取视频类型显示文本
 * @param {string|number} videoType - 视频类型（枚举值或旧值）
 * @returns {string} 显示文本
 */
export function getVideoTypeText(videoType) {
    if (!videoType && videoType !== 0) return '免费';
    
    // 兼容旧字段 videoIsVip
    if (typeof videoType === 'number') {
        switch (videoType) {
            case 0:
            case 1:
                return '免费';
            case 2:
                return 'VIP';
            default:
                return '免费';
        }
    }
    
    if (typeof videoType === 'string') {
        switch (videoType) {
            case 'FREE':
            case '免费':
            case '0':
            case '1':
                return '免费';
            case 'PAID':
            case '收费':
                return '收费';
            case 'VIP':
            case '2':
                return 'VIP';
            case 'NO_COPYRIGHT':
            case '无版权':
            case '3':
                return '无版权';
            case 'EXCLUSIVE':
            case '独播':
            case '4':
                return '独播';
            default:
                return videoType;
        }
    }
    
    return '免费';
}

/**
 * 获取视频类型CSS类
 * @param {string|number} videoType - 视频类型
 * @returns {string} CSS类名
 */
export function getVideoTypeClass(videoType) {
    if (!videoType && videoType !== 0) return 'free';
    
    // 兼容旧字段 videoIsVip
    if (typeof videoType === 'number') {
        switch (videoType) {
            case 1:
                return 'paid';
            case 2:
                return 'vip';
            case 3:
                return 'no-copyright';
            case 4:
                return 'exclusive';
            default:
                return 'free';
        }
    }
    
    if (typeof videoType === 'string') {
        if (videoType === 'VIP' || videoType === '2') {
            return 'vip';
        }
        if (videoType === 'PAID' || videoType === '收费' || videoType === '1') {
            return 'paid';
        }
        if (videoType === 'NO_COPYRIGHT' || videoType === '无版权' || videoType === '3') {
            return 'no-copyright';
        }
        if (videoType === 'EXCLUSIVE' || videoType === '独播' || videoType === '4') {
            return 'exclusive';
        }
    }
    
    return 'free';
}

/**
 * 获取视频类型标签文本
 * @param {string|number} videoType - 视频类型
 * @returns {string} 标签文本
 */
export function getVideoTypeTag(videoType) {
    if (!videoType && videoType !== 0) return '免费观看';
    
    // 兼容旧字段 videoIsVip
    if (typeof videoType === 'number') {
        switch (videoType) {
            case 0:
            case 1:
                return '免费观看';
            case 2:
                return 'VIP专享';
            default:
                return '免费观看';
        }
    }
    
    if (typeof videoType === 'string') {
        switch (videoType) {
            case 'FREE':
            case '免费':
            case '0':
            case '1':
                return '免费观看';
            case 'PAID':
            case '收费':
                return '收费观看';
            case 'VIP':
            case '2':
                return 'VIP专享';
            case 'NO_COPYRIGHT':
            case '无版权':
            case '3':
                return '无版权';
            case 'EXCLUSIVE':
            case '独播':
            case '4':
                return '独播';
            default:
                return '免费观看';
        }
    }
    
    return '免费观看';
}

/**
 * 判断是否为VIP视频（用于权限判断）
 * @param {string|number} videoType - 视频类型
 * @returns {boolean} 是否为VIP视频
 */
export function isVipVideo(videoType) {
    if (!videoType && videoType !== 0) return false;
    
    if (typeof videoType === 'number') {
        return videoType === 2;
    }
    
    if (typeof videoType === 'string') {
        return videoType === 'VIP' || videoType === '收费' || videoType === 'PAID' || videoType === '2';
    }
    
    return false;
}

