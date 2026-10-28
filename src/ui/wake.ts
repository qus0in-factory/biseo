export class Wake{
 private a=()=>{}
 private b=()=>{}
 private ended=false
 set(refresh:()=>void,end:()=>void){this.a=refresh;this.b=end;if(this.ended)end()}
 call(){this.a()}
 end(){this.ended=true;this.b()}
}
