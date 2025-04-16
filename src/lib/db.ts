import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Hàm cleanup các phiên không hoạt động
async function cleanupInactiveSessions() {
  try {
    // Kiểm tra và lấy danh sách các phiên có khả năng không hoạt động
    const inactiveSessions = await pool.query(
      `SELECT scl_userid, scl_computername, scl_ipaddress
       FROM sys_check_login 
       WHERE scl_trangthai = 'I'
       AND (EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - scl_logtimeout)) / 60) > 30`
    );

    if (inactiveSessions?.rows.length > 0) {
      for (const session of inactiveSessions.rows) {
        try {
          // Thử ping đến IP của máy đó để kiểm tra còn online không
          const isOnline = await checkMachineOnline(session.scl_ipaddress);
          
          if (!isOnline) {
            // Nếu máy offline thì mới update trạng thái
            const result = await pool.query(
              `UPDATE sys_check_login 
               SET scl_trangthai = 'N',
                   scl_logoutdate = scl_logtimeout
               WHERE scl_userid = $1 
               AND scl_computername = $2
               AND scl_trangthai = 'I'
               RETURNING scl_userid, scl_computername`,
              [session.scl_userid, session.scl_computername]
            );

            if (result?.rowCount && result.rowCount > 0) {
              console.log(`[Cleanup] Đã logout phiên không hoạt động: ${session.scl_userid}@${session.scl_computername}`);
            }
          } else {
            console.log(`[Cleanup] Bỏ qua phiên vẫn đang online: ${session.scl_userid}@${session.scl_computername}`);
            // Cập nhật lại thời gian check để tránh check lại trong thời gian ngắn
            await pool.query(
              `UPDATE sys_check_login 
               SET scl_logtimeout = CURRENT_TIMESTAMP
               WHERE scl_userid = $1 
               AND scl_computername = $2
               AND scl_trangthai = 'I'`,
              [session.scl_userid, session.scl_computername]
            );
          }
        } catch (err) {
          console.error(`[Cleanup] Lỗi khi kiểm tra phiên ${session.scl_userid}:`, err);
        }
      }
    }
  } catch (error) {
    console.error('[Cleanup] Lỗi khi cleanup phiên không hoạt động:', error);
  }
}

// Hàm kiểm tra máy còn online không
async function checkMachineOnline(ipAddress: string): Promise<boolean> {
  try {
    // Thực hiện ping hoặc kiểm tra kết nối
    // Đây chỉ là ví dụ, bạn cần implement logic phù hợp với môi trường của mình
    const ping = await import('ping');
    const result = await ping.promise.probe(ipAddress, {
      timeout: 2,
      extra: ['-n', '1'],
    });
    return result.alive;
  } catch (error) {
    console.error(`[Cleanup] Lỗi khi ping đến ${ipAddress}:`, error);
    return false;
  }
}

// Thiết lập interval để tự động cleanup mỗi 15 phút
setInterval(cleanupInactiveSessions, 15 * 60 * 1000);

// Chạy cleanup ngay khi khởi động
cleanupInactiveSessions();

// Kiểm tra kết nối database
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Lỗi kết nối database:', err);
  } else {
    //console.log('Đã kết nối thành công đến database');
  }
});

export default pool;