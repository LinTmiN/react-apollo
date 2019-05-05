
export interface voteType{
  id:string,
  user:{
    id:string
  }
}

export interface linkType {
  id: string;
  createdAt: string;
  url: string;
  description: string;
  postedBy: {
    id: string;
    name: string;
  };
  votes:Array<any>;
}

export interface commonData{
  loading:boolean,
  error:Error
}