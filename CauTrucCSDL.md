CREATE TABLE "public"."hms_cnttlogin_ip" (
  "hci_idx" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 1
    CACHE 1
  ),
  "hci_createdby" varchar COLLATE "pg_catalog"."default",
  "hci_createddate" timestamp,
  "hci_id" int4,
  "hci_tenmay" varchar COLLATE "pg_catalog"."default",
  "hci_ip" varchar COLLATE "pg_catalog"."default",
  "hci_user" varchar COLLATE "pg_catalog"."default",
  "hci_trangthai" varchar COLLATE "pg_catalog"."default",
  CONSTRAINT "hms_cnttlogin_ip_pkey" PRIMARY KEY ("hci_idx")
);

ALTER TABLE "public"."hms_cnttlogin_ip" 
  OWNER TO "postgres";


CREATE TABLE "public"."sys_user" (
  "su_userid" varchar COLLATE "pg_catalog"."default" NOT NULL,
  ... (các cột khác tương tự như trước) ...
  CONSTRAINT "sys_user_su_userid" PRIMARY KEY ("su_userid"),
  CONSTRAINT "sys_user_sys_dept_fk1" FOREIGN KEY ("su_deptid") REFERENCES "public"."sys_dept" ("sd_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

ALTER TABLE "public"."sys_user" 
  OWNER TO "postgres";

CREATE TRIGGER "sys_user_trg" AFTER INSERT OR UPDATE OR DELETE ON "public"."sys_user"
FOR EACH ROW
EXECUTE PROCEDURE "public"."sys_user_trg_proc"();

-- Danh mục kho
CREATE TABLE public.qlduoc_dmkho (
  dmkho_id SERIAL PRIMARY KEY,
  dmkho_ma VARCHAR(50),
  dmkho_ten VARCHAR(255),
  dm_loai VARCHAR(100),
  dm_khoa VARCHAR(100),
  dm_isactive VARCHAR(1)
);

-- Danh Mục Loại
CREATE TABLE public.qlduoc_dmloai (
  dmloai_id SERIAL PRIMARY KEY,
  dmloai_ma VARCHAR(50),
  dmloai_ten VARCHAR(255),
);