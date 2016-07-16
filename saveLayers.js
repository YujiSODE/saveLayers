/* saveLayers.js
*
*    Copyright (c) 2016 Yuji SODE <yuji.sode@gmail.com>
*
*    This software is released under the MIT License.
*    See LICENSE.txt or http://opensource.org/licenses/mit-license.php
*/
//the interface to convert some canvas/img tags into a png image on Firefox.
function saveLayers(){
//============================================================================
  var slf=window,W,r9=slf.Math.random().toFixed(9).replace(/\./g,''),cObj;
  //=== element generator ===
  var f=function(elName,elId,targetId){
    var t=slf.document.getElementById(targetId),E=slf.document.createElement(elName);
    E.id=elId;
    return t.appendChild(E);
  };
  //=== it returns target element tag array. ===
  var tAr=function(A){
    //A is an array of tag name; e.g. A=['canvas','img'].
    var Ar=[],tg;
    for(var i=0;i<A.length;i+=1){
      tg=slf.document.getElementsByTagName(A[i]);
      for(var j=0;j<tg.length;j+=1){
        if(!!tg[j].src){tg[j].crossOrigin='anonymous';}
        Ar.push(tg[j]);}
    }return Ar;
  };
  //=== it returns {tg:[selected tags],W:[width],H:[height],idx:index list}. ===
  var tgList=function(tgAr,slcId){
    //tgAr is an array of the current selected tags; slcId is id of select tag.
    //value of option tags in the select tag is index for tgAr.
    var s=slf.document.getElementById(slcId),L=s.length,t=[],w=[],h=[],I=0,Ix='';
    for(var i=0;i<L;i+=1){
      if(!!s[i].selected){
        t.push(tgAr[s[i].value]),w.push(tgAr[s[i].value].width),h.push(tgAr[s[i].value].height);
        Ix+=(I>0?', '+I:I)+':'+s[i].innerHTML,I+=1;}
    }return {tg:t,W:w,H:h,idx:Ix};
  };
  //=== it clears target canvas tag. ===
  var clrCs=function(tgtCanvas){
    var c=tgtCanvas.getContext('2d');
    c.clearRect(0,0,tgtCanvas.width||9,tgtCanvas.height||9);
  };
  //=== it saves Canvas data as png. ===
  var saveCvs=function(cId){
    var c=slf.document.getElementById(cId),d,l,a,b,u;
    if(!slf.URL){
      d=c.toDataURL('image/png');
      d=d.replace('image/png','image/octet-stream');
      slf.location.href=d;
    }else{
      d=atob(c.toDataURL().split(',')[1]),l=d.length;
      a=new Uint8Array(l);
      for(var i=0;i<l;i+=1){a[i]=d.charCodeAt(i);}
      b=new Blob([a],{type:'image/octet-stream'});
      u=slf.URL.createObjectURL(b),slf.location.href=u,slf.URL.revokeObjectURL(u);}
  };
  //=== this method returns max_value of an array. ===
  window.Array.prototype.mx=function(){
    var v,A=JSON.parse(JSON.stringify(this));
    v=A.sort(function(a,b){return b-a;});
    return v[0];};
//============================================================================
/*id*/
  var divId='div_'+r9,fmId='fm_'+r9,cvsId='cvsId_'+r9,slcId='slcId_'+r9,BId='B_'+r9,
      /*<div and form>*/
      tgtDiv,st,pIdx,fm,
      /*<list of canvas/img tag>*/
      slctLb,slct,Tgs,L,Opt=[],wMax,hMax,
      /*generating canvas tag*/
      cvs,
      /*<bottun>*/
      ipt=[],r,
      /*Load*/
      c,l,m,J=0,K,od,oIx,
      bd=slf.document.getElementsByTagName('body')[0];
  bd.id='bd_'+r9;
  //=== <div and form> ===
  tgtDiv=f('div',divId,bd.id),st=tgtDiv.style;st.position='absolute',st['z-index']=1000,
    bd.removeAttribute('id');
  pIdx=f('p','P'+divId,divId),pIdx.innerHTML='Layer index<br>';
  fm=f('form',fmId,divId);
  //=== </div and form> ===
  //====== <list of canvas/img tag> ======
  slctLb=f('label',slcId+'label',fmId),slctLb.innerHTML='Target canvas tag:';
  slct=f('select',slcId,slctLb.id),slct.multiple=true;
  //Tgs is the current canvas/img tags.
  Tgs=tAr(['canvas','img']),L=Tgs.length;
  for(var i=0;i<L;i+=1){
    Opt[i]=f('option',slcId+'_opt'+i,slcId),Opt[i].value=i,Opt[i].selected=true,
      Opt[i].innerHTML=Tgs[i].alt||Tgs[i].id||i+'th_'+Tgs[i].tagName;
  }
  cObj=tgList(Tgs,slcId),wMax=+cObj.W.mx(),hMax=+cObj.H.mx();
  //====== </list of canvas/img tag> ======
  //generating canvas tag.
  cvs=f('canvas',cvsId,divId),cvs.width=!!wMax?wMax:9,cvs.height=!!hMax?hMax:9;
  //=== <bottun> ===
  for(var i=0;i<3;i+=1){
    ipt[i]=f('input',['load_','save_','close_'][i]+BId,fmId),ipt[i].type='button',ipt[i].value=['Load','Output','Close'][i];}
  /*Load*/
  ipt[0].addEventListener('click',function(){
    J=0,cObj=tgList(Tgs,slcId),wMax=+cObj.W.mx(),hMax=+cObj.H.mx(),l=m=cObj.tg.length;
    clrCs(cvs),cvs.width=!!wMax?wMax:9,cvs.height=!!hMax?hMax:9;
    pIdx.innerHTML='Layer index={'+cObj.idx+'}<br>';
    //optional order of layers with indices by input: prompt().
    od=slf.prompt('Layer index={'+cObj.idx+'}\nOrder of layers with indices(optional)\ne.g., 0,1,2','');
    if(/^[0-9]+(?:,[0-9]+)*$/.test(od)){oIx=od.split(','),l=oIx.length;}
    if(!!cObj.tg[0]){
      c=cvs.getContext('2d');
      while(J<l){
        if(!!oIx){
          K=+oIx[J];
          if(K<m){c.drawImage(cObj.tg[K],0,c.canvas.height-cObj.tg[K].height),J+=1;}else{J+=1;}
        }else{
          c.drawImage(cObj.tg[J],0,c.canvas.height-cObj.tg[J].height),J+=1;}
      }
      cObj=oIx=null;
    }else{pIdx.innerHTML='Layer index<br>';}
  },true);
  /*Output*/
  ipt[1].addEventListener('click',function(){saveCvs(cvs.id);},true);
  /*Close*/
  ipt[2].addEventListener('click',function(){
    r=tgtDiv.parentNode.removeChild(tgtDiv),r=null;},true);
  //=== </bottun> ===
//============================================================================
}