import os from 'os';

interface SystemInfo {
    computerName: string;
    clientIP: string;
}

export function layIPTenMay(): SystemInfo {
    try {
        // Lấy hostname
        const computerName = os.hostname();
        
        // Lấy địa chỉ IP thật của máy
        let clientIP = '127.0.0.1';
        const networkInterfaces = os.networkInterfaces();
        
        // Tìm IPv4 không phải localhost
        for (const interfaceName in networkInterfaces) {
            const networks = networkInterfaces[interfaceName];
            if (networks) {
                for (const network of networks) {
                    if (network.family === 'IPv4' && !network.internal) {
                        clientIP = network.address;
                        break;
                    }
                }
            }
            if (clientIP !== '127.0.0.1') break;
        }

        return {
            computerName,
            clientIP
        };
    } catch (error) {
        console.error('Lỗi khi lấy thông tin hệ thống:', error);
        return {
            computerName: 'unknown',
            clientIP: '127.0.0.1'
        };
    }
} 