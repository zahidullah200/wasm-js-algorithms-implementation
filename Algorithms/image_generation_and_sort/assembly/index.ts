// export function randomizeArray(tota_length:i32):Int32Array{
//   const arr=new Int32Array(tota_length);

//   for(let i=0;i<arr.length;i++){
//     arr[i]=i32(Math.random()*tota_length);
//   }
//   return arr;
// }

// export function sum(arr:Int32Array):u64{
//   let total =0;
//   for(let i=0;i<arr.length;i++){
//     total+=arr[i];
//   }
//   return total;
// }

//1page=64kb
memory.grow(16);

declare function log(d: string):void 
export const memory_ptr:i32=0;
// const value:i32=15;
// store<u8>(memory_prt,value);
// export function getData(): i32 {
//     return load<u8>(memory_prt)
// }


export function generateRandom(w: i32, h: i32):void {
    for(let y=0;y<h;y++){
        for(let x=0;x<w;x++){
            let pixel_ind=memory_ptr+(y*w + x)*4;
            store<u8>(pixel_ind,u8(Math.random()*256));//red
            store<u8>(pixel_ind+1,u8(Math.random()*256));//green
            store<u8>(pixel_ind+2,u8(Math.random()*256));//blue
            store<u8>(pixel_ind+3,u8(255));//alpha
        }
    }

}

export function sortNew(w: i32, h:i32):void{
    let change=false;
    do{
        change=false;
        for(let y=0;y<h;y++){
            for(let x=0;x<w;x++){
                 const pixel_intensity_a= brightness(x,y,w);
                 const pixel_intensity_b= x+1<w? brightness(x+1,y,w):0;
                if(pixel_intensity_a && pixel_intensity_b && pixel_intensity_a<pixel_intensity_b){
                    swapPixels(x,y,w);
                    change=true;
                }
            }
        }
    }while(change);
    
}

function brightness(x: i32, y: i32, w: i32): f32{
    let pixel_ind=memory_ptr+(y*w+x)*4;
    return(0.0126*load<u8>(pixel_ind) + 0.0152*load<u8>(pixel_ind+1) + 0.30722*load<u8>(pixel_ind+2));


}

function swapPixels(x: i32, y: i32, w: i32): void{
    const pixel_ind_1=memory_ptr+(y*w + x)*4;
    const pixel_ind_2=memory_ptr+(y*w + (x+1))*4;
    for(let i=0;i<3;i++){
        let temp=load<u8>(pixel_ind_1+i);
        store<u8>(pixel_ind_1+i, load<u8>(pixel_ind_2+i));
        store<u8>(pixel_ind_2+i,temp);
    }
    store<u8>(pixel_ind_1+3,255);
    store<u8>(pixel_ind_2+3,255);
}





