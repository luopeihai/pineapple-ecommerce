DROP TABLE IF EXISTS `pineapple_admin`; #管理员表
CREATE TABLE IF NOT EXISTS `pineapple_admin`(
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
   `uid` CHAR(255) NOT NULL DEFAULT '' COMMENT 'uid',
   `username` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '管理员账号', #管理员账号
   `password` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '管理员密码',
   `login_time` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '登录时间',
   `login_ip` BIGINT NOT NULL DEFAULT '0' COMMENT '登录IP',
   `user_id` INT DEFAULT NULL COMMENT '用户唯一识别码',
   `status` INT  NOT NULL DEFAULT '1' COMMENT '管理员状态', #0-禁用 #1-启用
   `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
   `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '修改时间',
   `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
)ENGINE = InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS `pineapple_user`; #用户表
CREATE TABLE IF NOT EXISTS `pineapple_user`(
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
   `uid` CHAR(255) NOT NULL DEFAULT '' COMMENT 'uid',
   `username` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '用户名', 
   `password` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '密码',
   `status` INT  NOT NULL DEFAULT '1' COMMENT '用户状态', #0-禁用 #1-启用
   `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
   `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '修改时间',
   `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
)ENGINE = InnoDB DEFAULT CHARSET = utf8;



DROP TABLE IF EXISTS `pineapple_user_profile`; #用户详情表
CREATE TABLE IF NOT EXISTS `pineapple_user_profile`(
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
   `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
   `nickname` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '昵称',
   `avatar` CHAR(255) NOT NULL DEFAULT '' COMMENT '用户头像',
   `sign` VARCHAR(1000)  COMMENT '个性签名',
   `user_id` CHAR(255) NOT NULL DEFAULT '' COMMENT '用户唯一识别码',
   `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
   `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '修改时间',
   `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
)ENGINE = InnoDB DEFAULT CHARSET = utf8;



DROP TABLE IF EXISTS `pineapple_product`; #商品
CREATE TABLE IF NOT EXISTS `pineapple_product`(
   `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
   `uid` CHAR(255) NOT NULL DEFAULT '' COMMENT 'uid',
   `title` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '标题',
   `price` double DEFAULT 0 COMMENT '价格',
   `product_code` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '商品编码',
   `describe` TEXT COMMENT '描述',
   `cover` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '封面',
   `pics` TEXT COMMENT '详细图片', #max <=9
   `carousels` TEXT COMMENT '轮播图片', #max <= 6
   `status` ENUM('0','1') NOT NULL DEFAULT '1' COMMENT '店铺状态', #1-启用 #0-禁用
   `views` BIGINT UNSIGNED NOT NULL DEFAULT '0' COMMENT '浏览数',
   `deals`  INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '成交数',
   `ison` ENUM('0','1') NOT NULL DEFAULT '1' COMMENT '商品状态', #0-下架 #1-上架
   `category_id`  CHAR(255) NOT NULL DEFAULT '' COMMENT '类别uid',
   `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
   `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
   `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
)ENGINE = InnoDB DEFAULT CHARSET = utf8;




DROP TABLE IF EXISTS `pineapple_product_item`; #商品规格
CREATE TABLE IF NOT EXISTS `pineapple_product_item`(
   `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
   `uid` CHAR(255) NOT NULL DEFAULT '' COMMENT 'uid',
   `price` double DEFAULT 0 COMMENT '价格',
   `pricemember` double DEFAULT 0 COMMENT '会员价格',
   `kickback1` double DEFAULT 0 COMMENT '回扣1',
   `kickback2` double DEFAULT 0 COMMENT '回扣2',
   `productuid` CHAR(255) NOT NULL DEFAULT '' COMMENT '商品uid',
   `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
   `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
   `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
)ENGINE = InnoDB DEFAULT CHARSET = utf8;


DROP TABLE IF EXISTS `pineapple_product_item_specifications`; #商品规格详情
CREATE TABLE IF NOT EXISTS `pineapple_product_item_specifications`(
   `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
   `uid` CHAR(255) NOT NULL DEFAULT '' COMMENT 'uid',
   `title` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '标题',
   `iscustom` ENUM('0','1') NOT NULL DEFAULT '1' COMMENT '是否自定义', #0-否 #1-是
   `specificationsuid` CHAR(255) NOT NULL DEFAULT '' COMMENT '规格uid',
   `specificationspuid` CHAR(255) NOT NULL DEFAULT '' COMMENT '规格父类puid',
   `productitemuid` CHAR(255) NOT NULL DEFAULT '' COMMENT '商品规格uid',
   `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
   `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
   `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
)ENGINE = InnoDB DEFAULT CHARSET = utf8;



DROP TABLE IF EXISTS `pineapple_product_category`; #商品分类
CREATE TABLE IF NOT EXISTS `pineapple_product_category`(
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  `uid` CHAR(255) NOT NULL DEFAULT '' COMMENT 'uid',
  `title` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '标题',
  `pid` BIGINT NOT NULL DEFAULT '0' COMMENT '父类id',
  `sort` INT NOT NULL DEFAULT '0' COMMENT '排序',
  `level` INT NOT NULL DEFAULT '1' COMMENT '层级',
  `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '修改时间',
  `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
)ENGINE = InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS `pineapple_product_specifications`; #商品规格
CREATE TABLE IF NOT EXISTS `pineapple_product_specifications`(
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  `uid` CHAR(255) NOT NULL DEFAULT '' COMMENT 'uid',
  `pid` BIGINT NOT NULL DEFAULT '0' COMMENT '父类id',
  `title` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '标题',
  `sort` INT NOT NULL DEFAULT '0' COMMENT '排序',
  `level` INT NOT NULL DEFAULT '1' COMMENT '层级',
  `remarks` VARCHAR(1000) NOT NULL DEFAULT '' COMMENT '备注',
  `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '修改时间',
  `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
)ENGINE = InnoDB DEFAULT CHARSET = utf8;


DROP TABLE IF EXISTS `pineapple_product_category_specifications`; #商品分类规格
CREATE TABLE IF NOT EXISTS `pineapple_product_category_specifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  `uid` CHAR(255) NOT NULL DEFAULT '' COMMENT 'uid',
  `categoryuid` char(255) NOT NULL DEFAULT '' COMMENT '类别id',
  `specificationsuid` char(255) NOT NULL DEFAULT '' COMMENT '规格id',
  `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '修改时间',
  `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;


DROP TABLE IF EXISTS `pineapple_carousel`; #轮播图
CREATE TABLE IF NOT EXISTS `pineapple_carousel`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `cover` VARCHAR(500)  DEFAULT '' COMMENT '图片',
    `type` INT  DEFAULT '0' COMMENT '轮播图类型',  #0-不跳转 1-商品详情  #3外网地址
    `url` VARCHAR(500)  DEFAULT '' COMMENT '连接地址',
    `target_uid` CHAR(255) NOT NULL DEFAULT '0' COMMENT '目标外键',
    `pid` CHAR(255) NOT NULL DEFAULT '0' COMMENT '父类id',
    `sort` tinyint(1) NOT NULL DEFAULT '0' COMMENT '排序',
    `created_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '创建时间',
    `updated_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '更新时间',
    `deleted_at` INT UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间'
)ENGINE = InnoDB DEFAULT CHARSET = utf8;