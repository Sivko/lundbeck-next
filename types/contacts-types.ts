export interface IContactsFormData {
  firstName: string;
  companyName?: string;
  email: string;
  phone?: string;
  message: string;
  file?: FileList;
}


export interface IContactsResCreateCRM {
  data: {
    id: string;
  }
}

export interface IContactsUploadResponse {
  type: string;
  data: IContactsUploadData;
}
interface IContactsUploadData {
  url: string;
  'form-fields': Formfields;
}

interface Formfields {
  acl: string;
  key: string;
  Expires: string;
  policy: string;
  'x-amz-credential': string;
  'x-amz-algorithm': string;
  'x-amz-date': string;
  'x-amz-signature': string;
}