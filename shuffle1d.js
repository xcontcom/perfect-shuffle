function shuffle(array){
	var half=array.length/2;
	var temparray=[];
	for(var i=0;i<half;i++){
		temparray[i*2]=array[i+half];
		temparray[i*2+1]=array[i];
	}
	return temparray;
}

function init(){
	var len=document.getElementsByName('len');
	len=Math.round(parseInt(len[0].value));
	if(len>1000) len=1000;
	
	var len2=len*2;
	
	var canvas=document.getElementById('myCanvas');
	var context=canvas.getContext('2d');
	canvas.width=len2, canvas.height=len2;
	context.fillStyle = 'rgb(0,0,0)';
	context.fillRect (0, 0, canvas.width, canvas.height);
	context.fillStyle = 'rgb(255,255,255)';
	

	var array=[];
	for(var j=0;j<len;j++){
		array[j]=false;
		array[j+len]=true;
	}
	for(var j=0;j<len2;j++){
		for(var i=0;i<len2;i++){
			if(array[i]){
				context.fillRect(i,j, 1,1);
			}
		}
		array=shuffle(array);
	}

}