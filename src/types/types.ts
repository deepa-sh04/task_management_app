export interface Tax {
  id: string;
  name: string;        
  gender: string;      
  country: string;     
  createdAt: string;   
}

export interface Country {
  id: string;
  name: string;        
}

export interface EditTaxData {
  name: string;
  country: string;
}