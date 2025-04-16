import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { nam, dangDieuTri, raVien, locTreEm, locTheHN, tinhTP, maKhoa, soHS, soDT } = await req.json();

        let conditions = [];
        
        // Ưu tiên tìm kiếm theo số hồ sơ
        if (soHS) {
            conditions.push(`hcr_docno = '${soHS}'`);
        }
        // Ưu tiên tìm kiếm theo số điện thoại
        else if (soDT) {
            conditions.push(`hd_telephone = '${soDT}'`);
        }
        // Nếu không có số hồ sơ và số điện thoại, áp dụng các điều kiện khác
        else {
            conditions.push("hcr_admitdate <> TO_DATE('14/09/1752', 'DD/MM/YYYY')");

            // Điều kiện năm
            if (nam) {
                conditions.push(`hcr_admitdate BETWEEN TO_DATE('01/01/${nam} 00:01', 'DD/MM/YYYY HH24:MI') 
                               AND TO_DATE('31/12/${nam} 23:59', 'DD/MM/YYYY HH24:MI')`);
            }

            // Điều kiện trạng thái
            if (dangDieuTri) {
                conditions.push("hcr_status = 'I'");
            }
            if (raVien) {
                conditions.push("hcr_status = 'T'");
            }

            // Điều kiện trẻ em
            if (locTreEm) {
                conditions.push("EXTRACT(YEAR FROM AGE(hp_birthdate)) < 10");
            }

            // Điều kiện thẻ HN
            if (locTheHN) {
                conditions.push("LEFT(hc_cardno, 2) = 'HN'");
            }

            // Điều kiện tỉnh/thành phố
            if (tinhTP && tinhTP !== '') {
                conditions.push(`sp_id = '${tinhTP}'`);
            }

            // Điều kiện khoa phòng - chỉ thêm điều kiện khi maKhoa có giá trị
            if (maKhoa && maKhoa !== '') {
                conditions.push(`hcr_admitdept = '${maKhoa}'`);
            }
        }

        const whereClause = conditions.join(' AND ');

        const query = `
            SELECT 
                row_number() over(order by hcr_admitdate) ds_stt,
                hcr_docno AS ds_sohoso,
                hcr_patientno AS ds_mabn,
                trim(hp_surname||' '||hp_midname||' '||hp_firstname) as ds_hoten,
                to_char(hp_birthdate, 'DD/MM/YYYY') AS ds_ngaysinh,
                (SELECT ss_desc FROM sys_sel WHERE ss_id = 'sys_sex' and ss_code = hp_sex) as ds_gioitinh,
                hp_dtladdr AS ds_diachi,
                sv_name AS ds_phuong_xa,
                sd_name AS ds_quan_huyen,
                sp_name AS ds_tinh_thanhpho,
                hd_telephone AS ds_sodt,
                hp_sin AS ds_cmnd,
                hcr_admitdept AS ds_makhoa_dt,
                to_char(hcr_admitdate, 'DD/MM/YYYY HH24:MI') AS ds_ngayvaokhoa,
                (SELECT ho_desc FROM hms_object WHERE ho_id = hd_object) AS ds_doituong,
                hc_cardno AS ds_mathe,
                hc_discount AS ds_tylethe,
                hcr_mainicd AS ds_icd10,
                hcr_maindisease As ds_chandoan
            FROM hms_clinical_record 
            LEFT JOIN hms_doc ON (hd_docno = hcr_docno)
            LEFT JOIN hms_patient ON (hp_patientno = hcr_patientno)
            LEFT JOIN hms_card ON (hc_patientno = hd_patientno AND hc_cardno = hd_cardno AND hc_idx = hd_cardidx)
            LEFT JOIN sys_prov on (sp_id = hp_provid)
            LEFT JOIN sys_dist ON (sd_id = hp_distid AND sd_provid = hp_provid)
            LEFT JOIN sys_vill ON (sv_id = hp_villid AND sv_distid = hp_distid AND sv_provid = hp_provid)
            WHERE ${whereClause}
            ORDER BY hcr_admitdate
        `;

        const result = await pool.query(query);

        return NextResponse.json({
            status: 200,
            data: result.rows
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        return NextResponse.json({
            status: 500,
            error: 'Lỗi khi lấy dữ liệu từ server'
        });
    }
} 