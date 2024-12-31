

export class BaseModel {
  id!: number;
  name!: string;
}

export class ProductResumModel {
  totalAmount!: number;
  totalQty!: number;
  currency!: string
  isMultiCurrency!: boolean
}
export class SocialNetwork {
  id?: number;
  name!: string;
  sequence?: number;
  url!: string;
}


export class UserModel extends BaseModel {
  image_url!: string;
}
export class PartnerModel extends BaseModel { }
export class SaleOrderLine extends BaseModel {
  qty!: number;
  price!: number;
  subtotal!: number;
}

export class AgentModel extends UserModel {

  biography?: string;
  partner_files: Array<FileModel> = [];
  social_networks: Array<SocialNetwork> = [];
  main_image_blob?: Blob
}

export class HourModel {
  id!: number;
  hour!: string;
  display_hour!: string
}

export class SaleOrderModel extends BaseModel {
  state!: string;
  amount_total!: number;
  amount_tax!: number;
  currency!: string;
  create_date!: number;
  user!: UserModel;
  partner!: PartnerModel;
  lines: Array<SaleOrderLine> = [];


}

export class CalendarModel extends BaseModel {
  start!: number;
  stop!: number;
  duration!: number;
  startYYYMMDD!: string;
  event_status!: string;
  create_date!: number;
  sale_order!: SaleOrderModel;
  showLines: boolean = false
}
export class ClientModel {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  comment?: string;
  birthday_timestamp?: number;
  is_operated?: boolean = false;
  have_allergies?: boolean = false;
  suffer_illness?: boolean = false;
}

export class AppointmentInfoModel {
  id?: number;
  name?: string;
  productQty!: number;
  product!: ProductModel;
  selectedDate!: Date;
  hour!: HourModel;
  manager!: AgentModel
}

export class ProductModel extends BaseModel {
  price!: number;
  currency!: string;
  product_files!: Array<FileModel>;
  attributes!: Array<ProductAttributeModel>;
  agents!: Array<AgentModel>;
}


export class FileModel extends BaseModel {
  sequence!: number;
  type!: string;
  url!: string;
  blob?: Blob;
}



export class ProductAttributeValueModel extends BaseModel { }

export class ProductAttributeModel extends BaseModel {
  visibility!: boolean;
  values!: Array<ProductAttributeValueModel>;
}


export class PhotoModel {
  webviewPath!: string;
  blob!: Blob;
  base64?: string;
  fileName?: string;
}

export class SchoolRoute extends BaseModel {
}

export class SchoolModel extends BaseModel {
  routes: Array<SchoolRoute> = []
}

export class BaseAddress {
  fullAddress?: string;
  latitude?: number;
  longitude?: number
}

export class StudentModel extends BaseModel {
  birthday_timestamp?: number;
  address!: BaseAddress;
  genre!: 'f' | 'm';
  school!: BaseModel;
  image_url?: string
}

export class StudentRequestModel {
  name?: string;
  genre?: 'f' | 'm';
  schoolId?: number;
  address?: BaseAddress = {};
  birthday_timestamp?: number;
  image?: Blob
}
