import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class AmountDto {
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsOptional()
  currency?: string;
}

class PayerDto {
  @IsString()
  @IsNotEmpty()
  openid: string;
}

class GoodsDetailDto {
  @IsString()
  @IsNotEmpty()
  merchant_goods_id: string;

  @IsString()
  @IsOptional()
  wechatpay_goods_id?: string;

  @IsString()
  @IsOptional()
  goods_name?: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;
}

class SceneInfoDto {
  @IsString()
  @IsNotEmpty()
  payer_client_ip: string;

  @IsString()
  @IsOptional()
  device_id?: string;
}

export class CreateWxOrderDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  out_trade_no?: string; // 可选字段

  @IsString()
  @IsOptional()
  time_expire?: string; // 可选字段

  @IsOptional()
  @IsString()
  attach?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AmountDto)
  amount: AmountDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PayerDto)
  payer: PayerDto;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => GoodsDetailDto)
  @IsOptional()
  goods_detail?: GoodsDetailDto[];

  @ValidateNested()
  @Type(() => SceneInfoDto)
  @IsOptional()
  scene_info?: SceneInfoDto;

  @IsBoolean()
  @IsOptional()
  support_fapiao?: boolean;
}
