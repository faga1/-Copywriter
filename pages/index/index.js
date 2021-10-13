//Page Object
var app = getApp()
Page({
  data: {
    isSelected:false,
    ismask:false,
    classify_list:[],
    left:0,
    nav_list:[{
      id:0,
      name:"节日",
      list:[
        {
          id:0,
          name:"节日",
          isactive:true,
        },
        {
          id:1,
          name:"春节",
          isactive:false,
        },
        {
          id:2,
          name:"母亲节",
          isactive:false,
        },
        {
          id:3,
          name:"情人节",
          isactive:false,
        },
      ],
      isclassify:false
    },
    {
      id:1,
      name:"场景",
      list:[
        {
          id:0,
          name:"场景",
          isactive:true,
        },
        {
        id:1,
        name:"爱情",
        isactive:false,
      },
      {
        id:2,
        name:"职场",
        isactive:false,
      },
      {
        id:3,
        name:"亲情",
        isactive:false,
      },
      {
        id:4,
        name:"友情",
        isactive:false,
      },],
      isclassify:false
    },
    {
      id:2,
      name:"氛围",
      list:[
        {
          id:0,
          name:"氛围",
          isactive:true,
        },
        {
        id:1,
        name:"励志",
        isactive:false,
      },
      {
        id:2,
        name:"搞笑",
        isactive:false,
      },
      {
        id:3,
        name:"哲理",
        isactive:false,
      },
      {
        id:4,
        name:"伤感",
        isactive:false,
      },
      {
        id:5,
        name:"霸气",
        isactive:false,
      },
      {
        id:6,
        name:"扎心",
        isactive:false,
      },
      {
        id:7,
        name:"乐观",
        isactive:false,
      },],
      isclassify:false,
    },
  ],
    tags_list:[
      {
        id:0,
        name:"孤独",
        selected:false
      },
      {
        id:1,
        name:"青春",
        selected:false
      },
      {
        id:2,
        name:"回忆",
        selected:false
      },
      {
        id:3,
        name:"官宣",
        selected:false
      },
      {
        id:4,
        name:"下雨天",
        selected:false
      }
    ],
  sentence_list:[],
  tags:['','','',''],
  uid:'',
  
  },
  pagenum:1,
  TimeId:-1,
  onLoad:function(){
    console.log(this.pagenum);
    console.log(this.data.sentence_list);
    this.getsentenceList(this.pagenum,...this.data.tags)
    var uid =wx.getStorageSync('uid')
    if(getApp().globalData.uid2){
      console.log(getApp().globalData.uid2);
      wx.request({
        url:'https://www.xdwizz.top/addfriends',
        data:{uid1:uid,uid2:getApp().globalData.uid2},
        header: {'content-type': 'application/x-www-form-pictureencoded'},
        success:(res)=>{
          console.log(res);
        }
      })
    }
  },
  getsentenceList:function(page,tag1='',tag2='',tag3='',tag4=''){
    const tags={}
    if(tag1!==''){
      tags.tag1 = tag1
    }
    if(tag2!==''){
      tags.tag2 = tag2
    }
    if(tag3!==''){
      tags.tag3 = tag3
    }
    if(tag4!==''){
      tags.tag4 = tag4
    }
    console.log(tags);
    wx.request({
      url: 'https://www.xdwizz.top/sentence',
      data: {page:page,...tags},
      method: 'get',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success: (res) => {
        console.log(res);
        console.log(this.pagenum);
        if(res.statusCode!==200){
          return wx.showToast({
            title: '获取文案失败',
            duration: 1000
          })
        }
        var sentence_list = this.data.sentence_list
        var length = res.data.data.length
        if(length===0){
          return wx.showToast({
            title:'无更多文案',
            duration:1000,
            icon:'none'
          })
        }
        var temp_list=[]
        for(var i=0;i<length;i++){
          let temp_tags = [res.data.data[i].tag1,res.data.data[i].tag2,res.data.data[i].tag3,res.data.data[i].tag4]
          var temp_obj = res.data.data[i]
          var sentence1=res.data.data[i].sentence.split('——')
          temp_obj.sentence=sentence1[0]
          temp_obj.sentence_from=sentence1[1]
          temp_obj.tags = temp_tags
          temp_list[i] = temp_obj
        }
        
        
        sentence_list = [...sentence_list,...temp_list]
        console.log('111');
        
        this.setData({
          sentence_list
        })
      },
    }); 
  },
  copy_sentence:function(e){
    var {index}=e.currentTarget.dataset
    var sentence=this.data.sentence_list[index].sentence
    var sid=this.data.sentence_list[index].sid
    clearTimeout(this.TimeId)
    this.TimeId=setTimeout(()=>{
      wx.setClipboardData({
        data: sentence,
      });
      wx.request({
        url: 'https://www.xdwizz.top/copy',
        data: {sid:sid},
        header: {'content-type': 'application/x-www-form-urlencoded'},
        method: 'PUT',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          console.log(res);
        },
        fail: () => {},
        complete: () => {}
      });
        
    },500)
    
  },  
  save(e){
    var {index}=e.currentTarget.dataset
    let that =this
    wx.showToast({
      icon:'loading',
      title:'正在保存图片',
      duration:1000
    })
    wx.getSetting({
      success: (res) => {
        if(!res.authSetting['scope.writePhotoAlbum']){
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: (res) => {
              that.save_image(index)
            },
            fail: () => {
              wx.openSetting({
                success: (result) => {
                  wx.authorize({
                    scope:"scope.writePhotosAlbum",
                    success(){
                      that.save_image(index)
                    }
                  })
                },
              });
                
            },
          });
            
        }else{
          that.save_image(index)
        }
      },
    });
  },
  save_image(index){
    let that=this
    var url=this.data.sentence_list[index].picture
    wx.downloadFile({
      url: url,
      success: (res) => {
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            console.log(res);
            wx.showToast({
              title: '保存成功',
              icon:"success",
              duration: 1000,
            });
              
          },
          fail: () => {},
          complete: () => {}
        });
          
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  collect(e){
    var {index}=e.currentTarget.dataset
    // var uid = app.globalData.uid
    var uid = wx.getStorageSync('uid')
    if(!uid){
      getApp().login().then((res)=>{
        if(!res){
          return
        }else{
          uid=res
          console.log(uid);
          this.collect_request(index,uid)
        }
      })
    }
    else{
      this.collect_request(index,uid)
    }
  },
  collect_request(index,uid){
    var sentence_list=this.data.sentence_list
    sentence_list[index].iscollected=!sentence_list[index].iscollected
    var sid = sentence_list[index].sid
    var iscollected = sentence_list[index].iscollected
    if(!iscollected){
      wx.request({
        url: 'https://www.xdwizz.top/unlike',
        data: {
          uid: uid,
          sid: sid
         },
         header: {'content-type': 'application/x-www-form-urlencoded'},
         method: 'get',
         success: (res) => {
          if(res.statusCode !== 200){
            return wx.showToast({
              title:'取消收藏失败',
              duration: 1000,
              icon: 'none'
            })
          }
         },
       });
    }else{
      wx.request({
        url: 'https://www.xdwizz.top/like',
        data: {
          uid: uid,
          sid: sid
         },
         header: {'content-type': 'application/x-www-form-urlencoded'},
         method: 'get',
         success: (res) => {
          if(res.statusCode !== 200){
            return wx.showToast({
              title:'收藏失败',
              duration: 1000,
              icon: 'none'
            })
          }
          if (res.data.responseCode === '403'){
            wx.showToast({
              title: '此文案已经收藏过',
              duration: 1000,
              icon:'none'
            })
          }
         },
     });
    }
    this.setData({
      sentence_list
    })
  },
  handleReturnTop:function(){
    wx.pageScrollTo({
      scrollTop:0
    })
  },
  
  handleclassify:function(e){
    var classify_list=this.data.classify_list
    var {index} =e.currentTarget.dataset
    var nav_list=this.data.nav_list
    nav_list[index].isclassify=true
    var left =(index)*160+64+'rpx'
    var ismask=true
    this.setData({
      ismask,
      isclassify:true,
      nav_list,
      left
    })
  },
  handleClassifyItem(e){
    var {index1}=e.currentTarget.dataset
    var {index2}=e.currentTarget.dataset
    var nav_list=this.data.nav_list
    nav_list[index1].list.forEach((v)=>{
      v.isactive=false
    })
    nav_list[index1].list[index2].isactive  =true
    nav_list[index1].isclassify=false
    var tags=this.data.tags
    var name=nav_list[index1].list[index2].name
    if(index2===0){
      name=''
    }
    tags[index1]=name
    this.setData({
      nav_list,
      ismask:false,
      tags,
      sentence_list:[]
    })
    this.pagenum=1
    this.getsentenceList(this.pagenum,...tags)
  },
  handleSelect:function(){
    this.setData({
      isSelected:true,
      ismask:true
    })
  },
  handleHideMask:function(){
    var nav_list=this.data.nav_list
    console.log('点击成功');
    nav_list.forEach((v,i)=>{
      v.isclassify=false
    })
    this.setData({
      ismask:false,
      nav_list,
      isSelected:false
    })
  },
  handleConfirm:function(){
    var tags_list=this.data.tags_list
    var tags=this.data.tags
    tags_list.forEach((v,i)=>{
      if (v.selected){
        if(tags.indexOf(v.name)==-1){
          tags[3]=v.name
        }
      }
    })
    this.setData({
      sentence_list:[],
      ismask:false,
      isSelected:false,
      tags
    })
    this.pagenum=1
    this.getsentenceList(this.pagenum,...this.data.tags)
  },
  move:function(){},
  handleTagSelect:function(e){
    let {index}=e.currentTarget.dataset
    let tags_list=this.data.tags_list
    var flag=true
    tags_list.forEach((v,i)=>{
      if(v.selected){
        if(i===index){
          flag=false
        }
      }
      v.selected=false
    })
    if(flag){
      tags_list[index].selected=true
    }else{
      tags_list[index].selected=false
    }

    this.setData({
      tags_list
    })
  },
  handleResetting:function(){
    let tags_list=this.data.tags_list
    tags_list.forEach((v) => {
      v.selected=false
    }); 
    this.setData({
      tags_list,
      sentence_list:[],
      ismask:false,
      isSelected:false,
      tags:['','','','']
    })
    this.pagenum=1
    this.getsentenceList(this.pagenum)
  },
  
  onReachBottom(){
    this.pagenum++
    var length1=this.data.sentence_list.length
    this.getsentenceList(this.pagenum,...this.data.tags)
    var length2=this.data.sentence_list.length
    if(length1!==length2){
      this.pagenum--
    }
  },
});
  